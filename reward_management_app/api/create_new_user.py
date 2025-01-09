import frappe
from frappe.model.document import Document

# check register user before registration

@frappe.whitelist(allow_guest=True)
def check_registered_user(mobile_number):
    try:
        # Check if the Carpainter already exists in Customer Registration
        existing_carpainter = frappe.db.get_value(
            "Carpenter Registration",
            {"mobile_number": mobile_number,"status":"Pending"},
            ["name", "status"],
            as_dict=True
        )

        if existing_carpainter:
            if existing_carpainter["status"] == "Pending":
                return {
                    "approved":False,
                    "registered": True,
                    "activate":False,
                    "status": "failed",
                    "message": "Your registration request is pending admin approval. You will be able to log in once the request is approved."
                }

        # Check if the mobile number exists in the User document
        
         # Step 3: Check if the mobile number exists in User document
        user_info = frappe.get_value(
            "User",
            {"mobile_no": mobile_number},
            ["name", "full_name", "email", "role_profile_name"],
            as_dict=True
        )

        if user_info:
            if user_info:
                 # If user is found, check for the matching carpenter with the same mobile number
                carpenter_info = frappe.get_value(
                    "Carpenter",  
                    {"mobile_number": mobile_number},
                    ["name", "full_name","full_name", "email", "enabled"],
                    as_dict=True
                )

                if carpenter_info:
                    # If carpenter is found, check if the account is enabled
                    if carpenter_info["enabled"]:
                        # Carpenter exists and is enabled
                        return {
                            "approved": True,
                            "registered": True,
                            "activate":True,
                            "message": "User is already registered. Please login to your account.",
                            "full_name": user_info.get("full_name"),
                            "email": user_info.get("email"),
                            "username": user_info.get("name"),
                            "role_profile_name": user_info.get("role_profile_name"),
                        }
                    else:
                        # Carpenter exists but the account is disabled
                        return {
                            "activate":False,
                            "registered": True,
                            "approved":True,
                            "message": "Your account is deactivated. Please contact the admin."
                        }

        # If no user or carpainter registration exists for the mobile number
        return {
            "registered": False,
            "approved":False,
            "activate":False,
            "message": "Mobile number not registered. Please register to continue."
        }

    except Exception as e:
        # Log any exceptions that occur
        frappe.log_error(f"Error in check_registered_user: {str(e)}")
        return {
            "approved":False,
            "registered": False,
            "message": f"An error occurred: {str(e)}"
        }

# @frappe.whitelist(allow_guest=True)
# def check_registered_user(mobile_number):
#     try:
#         # Check if the mobile number exists in User document (matching the 'mobile_no' field)
#         user_info = frappe.get_value(
#             "User",  
#             {"mobile_no": mobile_number},  
#             ["name", "email"],
#             as_dict=True  
#         )

#         if user_info:
#             # If user exists with the provided mobile number
#             return {
#                 "registered": True,
#                 "message": "User is already registered. Please login to your account."
#             }
#         else:
#             # If no user exists with the provided mobile number
#             return {
#                 "registered": False,
#                 "message": "Mobile number not registered. Please register to continue."
#             }

#     except Exception as e:
#         # Log any exceptions that occur
#         frappe.log_error(f"Error in check_registered_user: {str(e)}")
#         return {
#             "registered": False,
#             "message": f"An error occurred: {str(e)}"  
#         }


# # check user registration login time----
@frappe.whitelist(allow_guest=True)
def check_user_registration(mobile_number):
    try:
        
        # Step 1: Check if the mobile number exists in Mobile Verification
        existing_verification = frappe.get_all(
            'Mobile Verification',
            filters={'mobile_number': mobile_number},
            fields=["name", "mobile_number", "otp"],
            limit=1
        )

        # Step 2: Check if the mobile number exists in Customer Registration
        existing_carpainter = frappe.db.get_value(
            "Carpenter Registration",
            {"mobile_number": mobile_number,"status":"Pending"},
            ["name","status"],
            as_dict=True
        )
        
        if existing_carpainter:
            if existing_carpainter["status"] == "Pending":
                # Registration is pending approval
                return {
                    "approved": False,
                    "registered": True,
                    "activate":False,
                    "status": "failed",
                    "message": "Your registration request is pending admin approval. You will be able to log in once the request is approved."
                }
            elif existing_carpainter["status"] == "Cancel":
                # Registration was cancelled
                return {
                    "approved": False,
                    "registered": False,
                    "activate":False,
                    "status": "failed",
                    "message": "Your registration request has been cancelled. To proceed, please complete the registration process again."
                }
         
           
        
        # Step 3: Check if the mobile number exists in User document
        user_info = frappe.get_value(
            "User",
            {"mobile_no": mobile_number},
            ["name", "full_name", "email", "role_profile_name"],
            as_dict=True
        )

        if existing_verification:
            # If the mobile number is found in the Mobile Verification document
            if user_info:
                 # If user is found, check for the matching carpenter with the same mobile number
                carpenter_info = frappe.get_value(
                    "Carpenter",  
                    {"mobile_number": mobile_number},
                    ["name", "full_name","full_name", "email", "enabled"],
                    as_dict=True
                )

                if carpenter_info:
                    # If carpenter is found, check if the account is enabled
                    if carpenter_info["enabled"]:
                        # Carpenter exists and is enabled
                        return {
                            "approved": True,
                            "registered": True,
                            "activate":True,
                            "message": "Carpenter is already registered. Login Successfull.",
                            "full_name": user_info.get("full_name"),
                            "email": user_info.get("email"),
                            "username": user_info.get("name"),
                            "role_profile_name": user_info.get("role_profile_name"),
                        }
                    else:
                        # Carpenter exists but the account is disabled
                        return {
                            "activate":False,
                            "registered": False,
                            "message": "Your account is deactivated. Please contact the admin."
                        }
            
            else:
                # If only Mobile Verification exists and not User
                return {
                    "registered": False,
                    "message": "Your mobile number is not registered. Please complete the registration process to continue."
                }
        
        elif user_info:
            # If only User exists but not Mobile Verification
            return {
                "registered": True,
                "message": "Your mobile number is not registered. Please complete the registration process to continue."
            }

        else:
            # If neither Mobile Verification nor User exists for the mobile number
            return {
                "registered": False,
                "message": "Your mobile number is not registered. Please complete the registration process to continue."
            }

    except Exception as e:
        # Log any exceptions that occur
        frappe.log_error(f"Error in check_user_registration: {str(e)}")
        return {
            "registered": False,
            "message": str(e)  # Return the actual error message in case of exception
        }
# @frappe.whitelist(allow_guest=True)
# def check_user_registration(mobile_number):
#     try:
#         # Check if the mobile number exists in the User document (matching the 'mobile_no' field)
#         user_info = frappe.get_value(
#             "User",  
#             {"mobile_no": mobile_number},  
#             ["name", "email","role_profile_name"],
#             as_dict=True  
#         )

#         if user_info:
#             # If user is found, check for the matching carpenter with the same mobile number
#             carpenter_info = frappe.get_value(
#                 "Carpenter",  
#                 {"mobile_number": mobile_number},
#                 ["name", "full_name","full_name", "email", "enabled"],
#                 as_dict=True
#             )

#             if carpenter_info:
#                 # If carpenter is found, check if the account is enabled
#                 if carpenter_info["enabled"]:
#                     # Carpenter exists and is enabled
#                     return {
#                         "registered": True,
#                         "message": "Carpenter is already registered. Login Successfull.",
#                         "full_name": user_info.get("full_name"),
#                         "email": user_info.get("email"),
#                         "username": user_info.get("name"),
#                         "role_profile_name": user_info.get("role_profile_name"),
#                     }
#                 else:
#                     # Carpenter exists but the account is disabled
#                     return {
#                         "registered": False,
#                         "message": "Your account is disabled or deactivated. Please contact the admin."
#                     }
            
#             # If no carpenter is found, but user exists
#             return {
#                 "registered": True,
#                 "message": "User is already registered. Please login to your account."
#             }
        
#         else:
#             # If no user is found with the provided mobile number
#             return {
#                 "registered": False,
#                 "message": "Mobile number not registered. Please register to continue."
#             }

#     except Exception as e:
#         # Log any exceptions that occur
#         frappe.log_error(f"Error in check_registered_user: {str(e)}")
#         return {
#             "registered": False,
#             "message": f"An error occurred: {str(e)}"  
#         }


    
# @frappe.whitelist(allow_guest=True)
# def check_user_registration(mobile_number):
#     try:
#         # Check if the mobile number exists in the User document
#         user_info = frappe.get_value(
#             "User",
#             {"mobile_no": mobile_number},
#             ["name", "full_name", "email", "role_profile_name", "api_key", "api_secret"],
#             as_dict=True
#         )

#         if user_info:
#             # User exists, generate API keys if missing
#             user_doc = frappe.get_doc("User", user_info.get("name"))
#             api_secret = (
#                 user_doc.get_password("api_secret")
#                 if user_info.get("api_secret")
#                 else generate_keys(user_doc)
#             )
#             api_key = user_doc.api_key or frappe.generate_hash(length=15)

#             # Log in the user
#             frappe.local.login_manager.login_as(user_info.get("name"))

#             # Get session details
#             sid = frappe.session.sid
#             csrf_token = frappe.sessions.get_csrf_token()

#             # Raise an error if any critical data is missing
#             if not all([sid, csrf_token, api_key, api_secret, user_info.get("name"), user_info.get("email")]):
#                 frappe.throw("Oops, Something Went Wrong!", frappe.DoesNotExistError)

#             # Return user and session details
#             return {
#                 "registered": True,
#                 "message": "User logged in successfully.",
#                 "full_name": user_info.get("full_name"),
#                 "email": user_info.get("email"),
#                 "username": user_info.get("name"),
#                 "role_profile_name": user_info.get("role_profile_name"),
#                 "session_details": {
#                     "sid": sid,
#                     "csrf_token": csrf_token,
#                     "api_key": api_key,
#                     "api_secret": api_secret
#                 }
#             }
#         else:
#             # User not found
#             return {
#                 "registered": False,
#                 "message": "Mobile number not registered. Please register to continue."
#             }

#     except Exception as e:
#         # Log any exceptions that occur
#         frappe.log_error(f"Error in check_user_registration: {str(e)}")
#         return {
#             "registered": False,
#             # This will return the actual error message in case of exception
#             "message": str(e)  
#         }


# # Generate API keys for the user
# def generate_keys(user):
#     # Generate API secret
#     api_secret = frappe.generate_hash(length=15)  
#      # Check if API key is missing
#     if not user.api_key: 
#          # Generate API key
#         user.api_key = frappe.generate_hash(length=15) 
#          # Assign API secret
#     user.api_secret = api_secret 
#       # Save user with permissions ignored
#     user.save(ignore_permissions=True)
#      # Commit the changes to the database
#     frappe.db.commit() 

#     return api_secret   