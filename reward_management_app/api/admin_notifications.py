import frappe
from frappe import _
from datetime import datetime
import requests
from reward_management_app.api.sms_api import festival_bonus_sms


@frappe.whitelist()
def get_notifications_log():
    # Get the current user
    user = frappe.session.user

    # Check if the user is "Administrator"
    if user == "Administrator":
        # Fetch all users with the "Admin" role
        admin_users = frappe.get_all("User", filters={"role_profile_name": "Admin"}, pluck="name")

        if admin_users:
            # Fetch notifications for any of the admin users
            notifications = frappe.get_all(
                "Notification Log",
                filters={"for_user": ["in", admin_users],"read": 0},  # Filter for any admin user
                fields=["name", "subject", "email_content", "document_type", "for_user", "creation"]
            )
            
            if notifications:
                # Find the first admin user with notifications
                first_admin_with_notifications = next(
                    (admin_user for admin_user in admin_users if any(n['for_user'] == admin_user for n in notifications)),
                    None
                )

                if first_admin_with_notifications:
                    # Fetch notifications specifically for that first admin user
                    notifications = frappe.get_all(
                        "Notification Log",
                        filters={"for_user": first_admin_with_notifications,"read": 0},
                        fields=["name", "subject", "email_content", "document_type", "for_user", "creation"]
                    )
                
                return notifications
            else:
                return []
        else:
            return []
    else:
        # Fetch notifications for the logged-in user carpenter
        notifications = frappe.get_all(
            "Notification Log",
            filters={"for_user": user,"read": 0},
            fields=["name", "subject", "email_content", "document_type", "for_user", "creation"]
        )

        return notifications


# Notification Updatetion for read notifications----

@frappe.whitelist()
def mark_notification_as_read(name):
    try:
        # Fetch the Notification Log document by its name (ID)
        notification = frappe.get_doc("Notification Log", name)
        
        # Check if the notification exists
        if notification:
            # Mark the notification as read
            notification.read = 1 
            notification.save()
            frappe.db.commit()
            return {"success": True, "status": "success", "message": "Notification marked as read."}
        else:
            return {"success": False, "status": "error", "message": "Notification not found."}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Error marking notification as read")
        return {"success": False, "status": "error", "message": str(e)}


# send system notification to carpenter if registration approved succcessfully-------
@frappe.whitelist()
def send_system_notification(doc, method=None):
    # doc is the document that triggered the hook
    user_email = doc.name

    # Fetch the user document
    user = frappe.get_doc("User", user_email)
    
    # Check if the user has a role profile named "Customer"
    if user.role_profile_name == "Carpenter":
        username = user.full_name  

        # Create a new notification log entry
        notification = frappe.get_doc({
            'doctype': 'Notification Log',
            'for_user': user_email,
            'type': 'Alert',
            'subject': 'Your Account Has Been Approved',
            'email_content': f'{username},Your registration request has been approved, and your account has been created successfully.',
            'document_type': 'User',
            'name': 'Welcome Notification'
        })
        notification.insert(ignore_permissions=True)
        frappe.db.commit()

        return "Notification sent successfully"
    
    return "User is not a Customer, notification not sent."




# @frappe.whitelist()
# def send_customer_reward_approved_notification(doc, method=None):
#     # Ensure the reward request status is 'Approved'
#     if doc.request_status == 'Approved':
#         # Fetch customer details using the customer_id field from Redeem Request
#         try:
#             # Use the customer_id field to fetch the Customer document
#             customer = frappe.get_doc("Redeem Request", doc.name)
#         except frappe.DoesNotExistError:
#             frappe.throw(_("Customer {0} not found").format(doc.name))

#         # Assuming the mobile_number is stored in customer.mobile_no
#         # Generate the email format using mobile_number@gmail.com
#         customer_email = f"{customer.mobile_number}@gmail.com"
        
#         # Create a new notification log entry for the customer
#         notification = frappe.get_doc({
#             'doctype': 'Notification Log',
#             'for_user': customer_email,  # Send notification to the specific customer
#             'subject': 'Reward Request Approved',
#             'type':'Alert',
#             'email_content': f"""
#                 <p>{customer.full_name}, 
#                 <a href="../../rewards/redeem-request">Your request for 
#                 <strong>{doc.redeemed_points}</strong> points redemption has been approved!</a></p>
#             """,
#             'document_type': 'Redeem Request',
#             'document_name': doc.name  # The name of the triggered document
#         })
#         notification.insert(ignore_permissions=True)
#         frappe.db.commit()

#         return "Notification Reward Request has been sent successfully"
#     else:
#         return "Request not approved, no notification sent"


# send system notificatio to carpenter is reward request approved successfully 
@frappe.whitelist()
def send_customer_reward_approved_notification(doc, method=None):
    # Ensure the reward request status is 'Approved'
    if doc.request_status == 'Approved':
        try:
            # Fetch the Redeem Request document (which contains the customer information)
            customer = frappe.get_doc("Redeem Request", doc.name)
        except frappe.DoesNotExistError:
            frappe.throw(_("Customer {0} not found").format(doc.name))

        # Get the customer's mobile number
        customer_mobile = customer.mobile_number

        # Find the corresponding User by matching the mobile number
        user = frappe.db.get_value("User", {"mobile_no": customer_mobile}, "name")
        
        if not user:
            frappe.throw(_("No user found with mobile number {0}").format(customer_mobile))

        # Create a new notification log entry for the user found via the mobile number
        notification = frappe.get_doc({
            'doctype': 'Notification Log',
             # Send notification to the matched user
            'for_user': user, 
            'subject': 'Reward Request Approved',
            'type': 'Alert',
            'email_content': f'{customer.full_name},\nYour request for {doc.redeemed_points} points redemption has been approved!',
            'document_type': 'Redeem Request',
            'document_name': doc.name
        })
        notification.insert(ignore_permissions=True)
        frappe.db.commit()

        return "Notification sent successfully to the user"
    else:
        return "Request not approved, no notification sent"
    
    
# send system notification to carpenter if bonus added into carpenter bonus history child table---------
@frappe.whitelist()
def send_welcome_bonus_points_notification(doc, method=None):
    # Check if this is a new record and not an update
    # if doc.is_new():
        try:
            # Fetch the WelCome Bonus History document (which contains the carpenter information)
            carpenter = frappe.get_doc("WelCome Bonus History", doc.name)
        except frappe.DoesNotExistError:
            return {
                "success": False,
                "message": f"Welcome Bonus History {doc.name} not found"
            }

        # Get the carpenter's mobile number
        carpenter_mobile = carpenter.mobile_number

        if not carpenter_mobile:
            return {
                "success": False,
                "message": "Carpenter does not have a mobile number"
            }

        # Find the corresponding User by matching the mobile number
        user = frappe.db.get_value("User", {"mobile_no": carpenter_mobile}, "name")
        
        if not user:
            return {
                "success": False,
                "message": f"No user found with mobile number {carpenter_mobile}"
            }

        # Verify if the user has the "Carpenter" role
        user_roles = frappe.get_roles(user)
        if "Carpenter" not in user_roles:
            return {
                "success": False,
                "message": f"User with mobile number {carpenter_mobile} does not have the Carpenter role"
            }

        # Create a new notification log entry for the matched Carpenter
        notification = frappe.get_doc({
            'doctype': 'Notification Log',
            'for_user': user,
            'subject':'Welcome Bonus Points',
            'type': 'Alert',
            'email_content': f"""{carpenter.carpenter_name},\nThank you for joining us! {carpenter.bonus_points} bonus points have been added to your account as a welcome reward.""",
            'document_type': 'WelCome Bonus History',
            'document_name': doc.name
        })
        notification.insert(ignore_permissions=True)
        frappe.db.commit()
        # Call the welcome_bonus_sms function to send SMS
        sms_response = welcome_bonus_sms(carpenter_mobile, carpenter.bonus_points)

        return {
            "success": True,
            "message": "Notification sent successfully to the Carpenter",
            "sms_response":sms_response
        }
    # else:
    #     return {
    #         "success": False,
    #         "message": "This is not a newly created document."
    #     }


# welcome bonus sms api---
@frappe.whitelist(allow_guest=False)
def welcome_bonus_sms(mobile_number,point):
    url = "https://login.raidbulksms.com/unified.php"
    params = {
        "key": "1n4812wh341u41U1NWH34812",
        "ph": mobile_number,
        "sndr": "FLAREO",
        "text": f"Welcome to Flare Overseas Mobile App! You've received free {point} reward points as part of your welcome bonus. Start earning more by scanning product QR codes"
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


# send system notification to carpenter for festival bonus ---------
@frappe.whitelist()
def send_festival_bonus_points_notification(doc, method=None):
    try:
        # Fetch the Festival Bonus History document
        carpenter = frappe.get_doc("Festival Bonus History", doc.name)
    except frappe.DoesNotExistError:
        frappe.log_error(f"Festival Bonus History {doc.name} not found")
        return {"success": False, "message": f"Festival Bonus History {doc.name} not found"}

    # Get the carpenter's mobile number
    carpenter_mobile = carpenter.mobile_number
    if not carpenter_mobile:
        return {"success": False, "message": "Carpenter does not have a mobile number"}

    # Find the corresponding User by matching the mobile number
    user = frappe.db.get_value("User", {"mobile_no": carpenter_mobile}, "name")
    if not user:
        return {"success": False, "message": f"No user found with mobile number {carpenter_mobile}"}

    # Check if the user has the "Carpenter" role
    user_roles = frappe.get_roles(user)
    if "Carpenter" not in user_roles:
        return {"success": False, "message": f"User with mobile number {carpenter_mobile} does not have the Carpenter role"}

    # Create a notification log entry for the Carpenter
    notification = frappe.get_doc({
        'doctype': 'Notification Log',
        'for_user': user,
        'subject':'Congratulations! You have Earned a Festival Bonus',
        'type': 'Alert',
        'email_content': f"""{carpenter.carpenter_name},\n{doc.bonus_message},\nYou have been awarded a bonus of {doc.bonus_points} points.""",
        'document_type': 'Festival Bonus History',
        'document_name': doc.name
    })
    notification.insert(ignore_permissions=True)
    frappe.db.commit()
    
    # Call the imported welcome_bonus_sms function
    festival_bonus_sms_response = festival_bonus_sms(carpenter_mobile, carpenter.bonus_points)

    return {
            "success": True,
            "message": "Notification sent successfully to the Carpenter",
            "festival_bonus":festival_bonus_sms_response
             }


 
