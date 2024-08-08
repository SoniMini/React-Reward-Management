import frappe
from frappe import _
@frappe.whitelist()
def get_users():
    # Query to get users with Admin role
    users_with_admin_role = frappe.get_all(
        "Has Role",
        filters={"role": "Admin"},
        fields=["parent as user"]
    )
    
    # Extract user IDs
    user_ids = [user['user'] for user in users_with_admin_role]

    if user_ids:
        users = frappe.get_all(
            "User",
            filters={"name": ["in", user_ids]},
            fields=["first_name", "last_name", "username", "email", "mobile_no"]
        )
    else:
        users = []

    return users