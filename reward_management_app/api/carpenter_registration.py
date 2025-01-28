from __future__ import unicode_literals
import frappe
from frappe import _
from datetime import datetime

# update carpenter registration request and creat new user and carpenter account------------
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
            user.email = f"{registration.mobile_number}@noexit.com"
            user.mobile_no = registration.mobile_number
            user.location = registration.city
            # Assigning role as Carpenter
            user.role_profile_name = "Carpenter"  

            # Save the User document
            user.insert(ignore_permissions=True)

            # Log the new user details
            user_dict = user.as_dict()
            user_details = "\n".join([f"{key}: {value}" for key, value in user_dict.items()])
            frappe.logger().info(f"New User Details:\n{user_details}")
            
            
            # Fetch the welcome bonus points
            bonuspoints_setup = frappe.get_single('Welcome Bonus') 
            bonus_points = bonuspoints_setup.bonus_points or 0

            # Create a new Carpainter document
            new_carpainter = frappe.new_doc("Carpenter")
            new_carpainter.first_name = registration.first_name
            new_carpainter.last_name = registration.last_name
            new_carpainter.full_name = registration.carpainter_name
            new_carpainter.email = f"{registration.mobile_number}@noexit.com"
            new_carpainter.mobile_number = registration.mobile_number
            new_carpainter.city = registration.city
             # Add bonus points to the total points
            new_carpainter.total_points = bonus_points 
            new_carpainter.current_points = bonus_points
            
            # Add a row to the bonus_history child table
            new_carpainter.append("bonus_history", {
                "doctype": "Carpenter Bonus Point Table",
                "bonus_name": "Welcome Bonus",
                "bonus_points": bonus_points,
                "bonus_earned_date": frappe.utils.now_datetime()
            })
            
            
            # Insert the new Carpainter document
            new_carpainter.insert()
            

            # Create Welcome Bonus History
            bonus_history = create_welcome_bonus_history(new_carpainter.name, new_carpainter.full_name, bonus_points,new_carpainter.mobile_number)
            if not bonus_history.get("success"):
                frappe.throw(_("Failed to create Welcome Bonus History."))

            # Commit the transaction
            frappe.db.commit()
            # # Log the newly created carpainter details
            # carpainter_dict = new_carpainter.as_dict()
            # carpainter_details = "\n".join([f"{key}: {value}" for key, value in carpainter_dict.items()])
            # frappe.logger().info(f"New Carpainter Details:\n{carpainter_details}")

        

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
        
        
# Create Welcome Bonus Points History ----------
def create_welcome_bonus_history(carpenter_id, carpenter_name, bonus_points,mobile_number):
    try:
        if not carpenter_id or not carpenter_name or bonus_points is None:
            return {
                "success": False,
                "message": _("Invalid input data. Carpenter ID, name, and bonus points are required.")
            }

        # Create a new Welcome Bonus History document
        welcome_bonus_history = frappe.new_doc("WelCome Bonus History")
        welcome_bonus_history.carpenter_id = carpenter_id
        welcome_bonus_history.carpenter_name = carpenter_name
        welcome_bonus_history.mobile_number=mobile_number
        welcome_bonus_history.bonus_points = bonus_points
        welcome_bonus_history.date = frappe.utils.now_datetime()

        # Insert the document
        welcome_bonus_history.insert(ignore_permissions=True)
        frappe.db.commit()

        # Return a success response
        return {
            "success": True,
            "message": ("Welcome Bonus History created successfully."),
            "data": {
                "carpenter_id": carpenter_id,
                "carpenter_name": carpenter_name,
                "mobile_number":mobile_number,
                "bonus_points": bonus_points,
                "date": welcome_bonus_history.date
            }
        }

    except Exception as e:
        # Log the error for debugging purposes
        frappe.log_error(frappe.get_traceback(), _("Error in create_welcome_bonus_history"))

        # Return an error response
        return {
            "success": False,
            "message": ("Failed to create Welcome Bonus History: {0}").format(str(e))
        }


# # update carpainter product table ----- 

# @frappe.whitelist()
# def update_carpainter_bonus_history_table(bonus_name, bonus_earned_date,bonus_points):
#     try:

#         # Add points to point_history child table
#         carpainter_doc.append("bonus_history", {
#             "doctype": "Carpenter Bonus Point Table",
#             "bonus_name": bonus_name,
#             "bonus_points": bonus_points,
#             "bonus_earned_date": nowdate()
#         })

#         # Save the Carpainter document
#         carpainter_doc.save()

#         return {"success": True}

#     except Exception as e:
#         frappe.log_error(frappe.get_traceback(), f"Error in update_carpainter_points: {e}")
#         return {"success":False,"error": f"Server error: {e}"}

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
            # Update the status 
             # Assuming 'status' field exists
            registration.status = "Cancel" 
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
