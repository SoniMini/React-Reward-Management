from __future__ import unicode_literals
import frappe
from frappe import _
from datetime import datetime

# @frappe.whitelist(allow_guest=True)
# def update_registration_request_status(registration_id, status):
#     try:
#         registration = frappe.get_doc("Carpenter Registration", registration_id)
#         if status == "Approved":
#             # Fetch Carpainter details
#             carpainter = frappe.get_doc("Carpenter", registration.carpainter_id)
            
#             # Check if a User with the same mobile number exists
#             existing_user = frappe.get_value("User", {"mobile_no": carpainter.mobile_number}, "name")
#             if not existing_user:
#                 # Create a new User
#                 user = frappe.new_doc("User")
#                 user.first_name = carpainter.first_name
#                 user.last_name = carpainter.last_name
#                 user.full_name = carpainter.full_name
#                 user.email = f"{carpainter.mobile_number}@gmail.com"
#                 user.mobile_no = carpainter.mobile_number
#                 user.location = carpainter.city
#                 user.role_profile_name = "Carpenter"  
                
#                 # Save the User document
#                 user.insert(ignore_permissions=True)
#             else:
#                 frappe.throw(_("User with mobile number {0} already exists.").format(carpainter.mobile_number))
        
#         frappe.db.commit()
        
#         return {"status": "success", "message": _("Registration request status updated successfully.")}
    
#     except Exception as e:
#         frappe.log_error(frappe.get_traceback(), _("Error in update_registration_request_status"))
#         frappe.throw(_("Failed to update registration request status: {0}").format(str(e)))

@frappe.whitelist()
def update_registration_request_status(registration_id, status):
    try:
        # Fetch the registration document
        registration = frappe.get_doc("Carpenter Registration", registration_id)

        if status == "Approved":
            # Check if a User with the same mobile number exists
            existing_user = frappe.get_value("User", {"mobile_no": registration.mobile_number}, "name")

            if existing_user:
                # If a user with the same mobile number exists, return error with success: false
                return {
                    "success": False,
                    "status": "failed",
                    "message": _("User with mobile number {0} already exists.").format(registration.mobile_number)
                }

            # If no user exists, create a new User document
            user = frappe.new_doc("User")
            user.first_name = registration.first_name
            user.last_name = registration.last_name
            user.full_name = f"{registration.first_name} {registration.last_name}"
            user.email = f"{registration.mobile_number}@gmail.com"
            user.mobile_no = registration.mobile_number
            user.location = registration.city
            user.role_profile_name = "Carpenter"  # Assigning role as Carpenter

            # Save the User document
            user.insert(ignore_permissions=True)

            # Log the new user details
            user_dict = user.as_dict()
            user_details = "\n".join([f"{key}: {value}" for key, value in user_dict.items()])
            frappe.logger().info(f"New User Details:\n{user_details}")

            # Create a new Carpainter document
            new_carpainter = frappe.new_doc("Carpenter")
            new_carpainter.first_name = registration.first_name
            new_carpainter.last_name = registration.last_name
            new_carpainter.full_name = registration.carpainter_name
            new_carpainter.email = f"{registration.mobile_number}@gmail.com"
            new_carpainter.mobile_number = registration.mobile_number
            new_carpainter.city = registration.city

            # Insert the new Carpainter document
            new_carpainter.insert()

            # Log the newly created carpainter details
            carpainter_dict = new_carpainter.as_dict()
            carpainter_details = "\n".join([f"{key}: {value}" for key, value in carpainter_dict.items()])
            frappe.logger().info(f"New Carpainter Details:\n{carpainter_details}")

        # Commit the transaction
        frappe.db.commit()

        # Return success response after completing the process
        return {
            "success": True,
            "status": "success",
            "message": _("Registration request status updated successfully.")
        }

    except Exception as e:
        # Log the error if something goes wrong
        frappe.log_error(frappe.get_traceback(), _("Error in update_registration_request_status"))
        
        # Return failure response with the error message
        return {
            "success": False,
            "status": "failed",
            "message": _("Failed to update registration request status: {0}").format(str(e))
        }


# @frappe.whitelist(allow_guest=True)
# def update_registration_request_status(registration_id, status):
#     try:
#         registration = frappe.get_doc("Carpenter Registration", registration_id)
        
#         if status == "Approved":
#             # Fetch Carpainter details
#             # carpainter = frappe.get_doc("Carpenter Registration", registration.name)
            
#             # Check if a User with the same mobile number exists
#             existing_user = frappe.get_value("User", {"mobile_no": registration.mobile_number}, "name")
            
#             if existing_user:
#                 # If a user with the same mobile number exists, return an error with success: false
#                 return {"success": False, "status": "failed", "message": _("User with mobile number {0} already exists.").format(registration.mobile_number)}
            
            
#             if not existing_user:
#                 # Create a new User
#                 user = frappe.new_doc("User")
#                 user.first_name = registration.first_name
#                 user.last_name = registration.last_name
#                 user.full_name = f"{registration.first_name} {registration.last_name}"
#                 user.email = f"{registration.mobile_number}@gmail.com"
#                 user.mobile_no = registration.mobile_number
#                 user.location = registration.city
#                 user.role_profile_name = "Carpenter"  # Assigning role as Carpenter
                
#                 # Save the User document
#                 user.insert(ignore_permissions=True)
                
#                 # Log the new user details
#                 user_dict = user.as_dict()
#                 user_details = "\n".join([f"{key}: {value}" for key, value in user_dict.items()])
#                 frappe.logger().info(f"New User Details:\n{user_details}")
                
#                 # Create a new Carpainter document
#                 new_carpainter = frappe.new_doc("Carpenter")  # Corrected to use new_doc method
#                 new_carpainter.first_name = registration.first_name
#                 new_carpainter.last_name = registration.last_name
#                 new_carpainter.full_name = registration.carpainter_name
#                 new_carpainter.email = f"{registration.mobile_number}@gmail.com"
#                 new_carpainter.mobile_number = registration.mobile_number
#                 new_carpainter.city = registration.city
               
                
#                 # Insert the new Carpainter document
#                 new_carpainter.insert()
                
#                 # Log the newly created carpainter details
#                 carpainter_dict = new_carpainter.as_dict()
#                 carpainter_details = "\n".join([f"{key}: {value}" for key, value in carpainter_dict.items()])
#                 frappe.logger().info(f"New Carpainter Details:\n{carpainter_details}")

#             else:
#                 # frappe.throw(_("User with mobile number {0} already exists.").format(new_carpainter.mobile_number))
#                 return {"success": False, "status": "failed", "message": _("User with mobile number {0} already exists.").format(registration.mobile_number)}

        
#         # Commit the transaction
#         frappe.db.commit()
        
#         return {"success": True, "status": "success", "message": _("Registration request status updated successfully.")}
    
#     except Exception as e:
#         frappe.log_error(frappe.get_traceback(), _("Error in update_registration_request_status"))
#         # frappe.throw(_("Failed to update registration request status: {0}").format(str(e)))
#         return {"success": False,"status": "failed", "message": _("Failed to update registration request status: {0}").format(str(e))}


# cancel request-----
@frappe.whitelist()
def cancel_customer_registration(registration_id, status):
    try:
        # Fetch the registration document
        registration = frappe.get_doc("Carpenter Registration", registration_id)

        if status == "Cancel":
            # Update the status or perform any other necessary logic
            registration.status = "Cancel"  # Assuming 'status' field exists
            registration.save()

            return {
                "status": "success",
                "message": "Registration request status cancelled successfully."
            }
        
        # If the status is not "Cancel", return appropriate message
        return {
            "status": "fail",
            "message": "Invalid status provided."
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Error in cancel_customer_registration")
        return {
            "status": "fail",
            "message": f"Failed to update registration request status: {str(e)}"
        }
