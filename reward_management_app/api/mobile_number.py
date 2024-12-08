import frappe
import random
from frappe.model.document import Document
from datetime import datetime, timedelta
import requests

from reward_management_app.api.auth import generate_keys

@frappe.whitelist(allow_guest=True)
def get_mobile_verification_fields():
    try:
        otp = frappe.get_list("Mobile Verification", fields=["otp", "mobile_number"])
        return otp
    except Exception as e:
        return e

# Generate random OTP for mobile number and set value
@frappe.whitelist(allow_guest=True)
def generate_or_update_otp(mobile_number):
    if not mobile_number:
        return {'status': 'failed', 'message': 'Mobile number is required'}

    # Generate OTP
    otp = str(random.randint(100000, 999999))

    # Check if a document already exists for the given mobile number
    existing_verification = frappe.get_all('Mobile Verification', filters={'mobile_number': mobile_number}, fields=["name", "mobile_number", "otp"], limit=1)
    
    if existing_verification:
        # If a document exists, update the existing OTP
        doc = frappe.get_doc('Mobile Verification', existing_verification[0].name)
        doc.otp = otp
        doc.save(ignore_permissions=True)
        result = {'status': 'success', 'message': 'OTP updated successfully', 'mobile_number': mobile_number, 'otp': otp}
    else:
        # If no document exists, create a new one with the generated OTP
        doc = frappe.get_doc({
            'doctype': 'Mobile Verification',
            'mobile_number': mobile_number,
            'otp': otp
        })
        doc.insert(ignore_permissions=True)
        result = {'status': 'success', 'message': 'OTP generated successfully', 'mobile_number': mobile_number, 'otp': otp}
    
    # Print values for debugging
    for key, value in result.items():
        print(f"{key}: {value}")

    return result

# Match OTP
# @frappe.whitelist(allow_guest=True)
# def verify_otp(mobile_number, otp):
#     if not mobile_number or not otp:
#         return {'status': 'failed', 'message': 'Mobile number and OTP are required'}
    
#     # Fetch the Mobile Verification document
#     otp_verification = frappe.get_all('Mobile Verification', filters={'mobile_number': mobile_number, 'otp': otp}, fields=["name", "mobile_number", "otp", "modified"], limit=1)
    
#     if otp_verification:
#         modified_time = otp_verification[0].modified
#         time_diff = datetime.now() - modified_time

#         if time_diff <= timedelta(minutes=1):
#             result = {'status': 'success', 'message': 'OTP matched successfully', 'mobile_number': mobile_number, 'otp': otp, 'modified': modified_time}
#         else:
#             result = {'status': 'failed', 'message': 'OTP expired', 'mobile_number': mobile_number, 'otp': otp, 'modified': modified_time}
#     else:
#         result = {'status': 'failed', 'message': 'Invalid OTP', 'mobile_number': mobile_number, 'otp': otp}
    
#     # Print values for debugging
#     for key, value in result.items():
#         print(f"{key}: {value}")

#     return result


@frappe.whitelist(allow_guest=True)
def verify_otp(mobile_number, otp):
    if not mobile_number or not otp:
        return {'status': 'failed', 'message': 'Mobile number and OTP are required'}
    
    # Fetch the Mobile Verification document
    otp_verification = frappe.get_all('Mobile Verification', filters={'mobile_number': mobile_number, 'otp': otp}, fields=["name", "mobile_number", "otp", "modified"], limit=1)
    
    if otp_verification:
        modified_time = otp_verification[0].modified
        time_diff = datetime.now() - modified_time

        if time_diff <= timedelta(minutes=1):
            # OTP is valid
            otp_status = {'status': 'success', 'message': 'OTP matched successfully', 'mobile_number': mobile_number, 'otp': otp, 'modified': modified_time}
            
            # Now check if the user is registered
            registration_status = check_user_registration(mobile_number)  # Call the user registration check function
            
            # Merge the registration status with OTP status
            otp_status.update(registration_status)

        else:
            otp_status = {'status': 'failed', 'message': 'OTP expired', 'mobile_number': mobile_number, 'otp': otp, 'modified': modified_time}
    else:
        otp_status = {'status': 'failed', 'message': 'Invalid OTP', 'mobile_number': mobile_number, 'otp': otp}
    
    # Return the result including OTP and registration status
    return otp_status



# get session details of verfied mobile number and otp use---
@frappe.whitelist(allow_guest=True)
def check_user_registration(mobile_number):
    try:
        # Check if the mobile number exists in the User document
        user_info = frappe.get_value(
            "User",
            {"mobile_no": mobile_number},
            ["name", "full_name", "email", "role_profile_name", "api_key", "api_secret"],
            as_dict=True
        )

        if user_info:
            # User exists, generate API keys if missing
            user_doc = frappe.get_doc("User", user_info.get("name"))
            api_secret = (
                user_doc.get_password("api_secret")
                if user_info.get("api_secret")
                else generate_keys(user_doc)
            )
            api_key = user_doc.api_key or frappe.generate_hash(length=15)

            # Log in the user
            frappe.local.login_manager.login_as(user_info.get("name"))

            # Get session details
            sid = frappe.session.sid
            csrf_token = frappe.sessions.get_csrf_token()

            # Raise an error if any critical data is missing
            if not all([sid, csrf_token, api_key, api_secret, user_info.get("name"), user_info.get("email")]):
                frappe.throw("Oops, Something Went Wrong!", frappe.DoesNotExistError)

            # Return user and session details
            return {
                "registered": True,
                "message": "User logged in successfully.",
                "full_name": user_info.get("full_name"),
                "email": user_info.get("email"),
                "username": user_info.get("name"),
                "role_profile_name": user_info.get("role_profile_name"),
                "session_details": {
                    "sid": sid,
                    "csrf_token": csrf_token,
                    "api_key": api_key,
                    "api_secret": api_secret
                }
            }
        else:
            # User not found
            return {
                "registered": False,
                "message": "Mobile number not registered. Please register to continue."
            }

    except Exception as e:
        # Log any exceptions that occur
        frappe.log_error(f"Error in check_user_registration: {str(e)}")
        return {
            "registered": False,
            "message": str(e)  
        }


# send otp to a mobile number----------
@frappe.whitelist(allow_guest=True)
def send_sms_otp(mobile_number, otp):

    url = "https://login.raidbulksms.com/unified.php"
    params = {
        "key": "1n4812wh341u41U1NWH34812",
        "ph": mobile_number,
        "sndr": "KRIINA",
        "text": f"{otp} is your OTP for Flare Overseas Mobile App\n-Developed by Krina Web"
    }

    try:
        response = requests.get(url, params=params)
        frappe.logger().info(f"SMS API Response: {response.status_code}, {response.text}")
        if response.status_code == 200:
            return {"status": "success", "response": response.text}
        else:
            frappe.throw(_("Failed to send SMS: {0}".format(response.text)))
    except Exception as e:
        frappe.logger().error(f"SMS Sending Error: {str(e)}")
        frappe.throw(("An error occurred while sending the SMS: {0}".format(str(e))))