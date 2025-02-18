import frappe

# forget password api for admin----
@frappe.whitelist(allow_guest=True)
def update_password_without_current():
    try:
        user_data = frappe.form_dict  
        email = user_data.get('email')
        new_password = user_data.get('new_password')

        # Fetch User document based on email
        user = frappe.get_doc("User", {"email": email})

        # Set new password
        user.new_password = new_password 
        user.save()

        return {"success": True, "message": "Password updated successfully."}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), ("API Error"))
        return {"success": False , "message": str(e)}