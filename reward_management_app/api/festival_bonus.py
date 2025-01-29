
from __future__ import unicode_literals
import frappe
from frappe import _
from datetime import datetime

# create new festival bonus----

@frappe.whitelist()
def create_new_festival_bonus(festival_name, bonus_message, bonus_points):
    try:
        # Create a new 'Festival Bonus' document
        festival_bonus = frappe.new_doc("Festival Bonus")
        festival_bonus.festival_name = festival_name
        festival_bonus.bonus_message = bonus_message
        festival_bonus.bonus_points = bonus_points
        festival_bonus.date = frappe.utils.nowdate()

        # Save the document to the database
        festival_bonus.insert(ignore_permissions=True)

        # Create Festival Bonus History
        festival_history = create_festival_bonus_history(
            festival_bonus_id=festival_bonus.name,
            festival_name=festival_name,
            bonus_points=bonus_points,
            bonus_message=bonus_message,
            date=festival_bonus.date
        )

        # Check if creating history failed
        if not festival_history.get("success"):
            frappe.throw(_("Failed to create Festival Bonus History: {0}").format(festival_history.get("message")))

        # Commit the transaction
        frappe.db.commit()

        # Return a success response
        return {
            "success": True,
            "message": "Festival Bonus created successfully!",
            "name": festival_bonus.name
        }

    except Exception as e:
        # Handle any errors that occur during document creation
        frappe.log_error(frappe.get_traceback(), "Error creating Festival Bonus")
        return {
            "success": False,
            "message": f"An error occurred: {str(e)}"
        }
       
        
# create New Festival History for all activate carpenter----------
def create_festival_bonus_history(festival_bonus_id, festival_name, bonus_points, bonus_message, date):
    try:
        # Fetch all active carpenters
        active_carpenters = frappe.get_all(
            "Carpenter",
            filters={"enabled": 1},
            fields=["name", "full_name", "mobile_number","total_points","current_points"]
        )

        if not active_carpenters:
            return {
                "success": False,
                "message": "No active carpenters found."
            }

        # Create a Festival  Bonus History for each active carpenter
        for carpenter in active_carpenters:
            festival_bonus_history = frappe.new_doc("Festival Bonus History")
            festival_bonus_history.festival_bonus_id = festival_bonus_id
            festival_bonus_history.name_of_festival = festival_name
            festival_bonus_history.bonus_points = bonus_points
            festival_bonus_history.bonus_message = bonus_message
            festival_bonus_history.bonus_creation_date = date
            festival_bonus_history.bonus_earned_date = frappe.utils.nowdate() 
            festival_bonus_history.carpenter_id = carpenter["name"]
            festival_bonus_history.carpenter_name = carpenter["full_name"]
            festival_bonus_history.mobile_number = carpenter["mobile_number"]

            # Insert the document
            festival_bonus_history.insert(ignore_permissions=True)
     
            
            
        # Now update the total points for each carpenter by adding the bonus points
        for carpenter in active_carpenters:
            try:
                # Log the current points and bonus points for debugging
                total_points = carpenter["total_points"] if carpenter["total_points"] is not None else 0
                total_points = int(total_points)
                current_points = carpenter["current_points"] if carpenter["current_points"] is not None else 0
                current_points = int(current_points)

                
                # Ensure bonus_points is also an integer
                bonus_points_int = int(bonus_points)
                new_total_points = total_points + bonus_points_int
                new_currect_points = current_points + bonus_points_int
                # Update the carpenter's total points in the Carpenter document
                frappe.db.set_value("Carpenter", carpenter["name"], "total_points", new_total_points)
                frappe.db.set_value("Carpenter", carpenter["name"], "current_points" ,new_currect_points)
                
                 # Add a row to the bonus_history child table of the carpenter
                carpenter_doc = frappe.get_doc("Carpenter", carpenter["name"])
                carpenter_doc.append("bonus_history", {
                    "bonus_name": festival_name,
                    # "festival_bonus_id": festival_bonus_history.name,
                    "bonus_points": bonus_points,
                    "bonus_earned_date": date
                })

                # Save the updated Carpenter document
                carpenter_doc.save(ignore_permissions=True)


            except Exception as update_error:
                frappe.log_error(frappe.get_traceback(), _("Error updating total points for carpenter: {0}".format(carpenter["name"])))
                continue  # Continue with the next carpenter even if one fails

            
      

        # Commit all changes to the database
        frappe.db.commit()
        
       
            

        # Return a success response
        return {
            "success": True,
            "message": "Welcome Bonus History created successfully for all active carpenters.",
            "data": {
                "festival_bonus_id": festival_bonus_id,
                "festival_name": festival_name,
                "bonus_points": bonus_points,
                "date": date,
                "carpenter_count": len(active_carpenters)
            }
        }

    except Exception as e:
        # Log the error for debugging purposes
        frappe.log_error(frappe.get_traceback(), _("Error in create_festival_bonus_history"))

        # Return an error response
        return {
            "success": False,
            "message": f"Failed to create Welcome Bonus History: {str(e)}"
        }
        
        
        

# Update Festival Bonus ----------
@frappe.whitelist()  # Allow public access if needed
def update_festival_bonus(name, festival_name, bonus_message, bonus_points):
    try:
        # Fetch the existing 'Festival Bonus' document by its name
        festival_bonus = frappe.get_doc("Festival Bonus", name)

        # Update the fields
        festival_bonus.festival_name = festival_name
        festival_bonus.bonus_message = bonus_message
        festival_bonus.bonus_points = bonus_points
        # festival_bonus.date = frappe.utils.nowdate()  # Optional: update the date if needed

        # Save the updated document
        festival_bonus.save()

        return {
            "success":True,
            "message": "Festival Bonus Updated successfully.",
            "name": festival_bonus.name
            }

    except frappe.DoesNotExistError:
        # If the document with the given name does not exist
        return {"message": "Festival Bonus not found."}
    
    except Exception as e:
        # Handle any other errors
        frappe.log_error(frappe.get_traceback(), "Error updating Festival Bonus")
        return {
            "success":False,
            "message": f"An error occurred: {str(e)}"}
        
       
