import frappe
from frappe import _
from datetime import datetime


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
                filters={"for_user": ["in", admin_users]},  # Filter for any admin user
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
                        filters={"for_user": first_admin_with_notifications},
                        fields=["name", "subject", "email_content", "document_type", "for_user", "creation"]
                    )
                
                return notifications
            else:
                return []
        else:
            return []
    else:
        # Fetch notifications for the logged-in user
        notifications = frappe.get_all(
            "Notification Log",
            filters={"for_user": user},
            fields=["name", "subject", "email_content", "document_type", "for_user", "creation"]
        )

        return notifications


# Notification Updatetion for read notifications----
@frappe.whitelist()
def mark_notification_as_read(name, read):
    try:
        # Fetch the Notification Log document by its name (ID)
        notification = frappe.get_doc("Notification Log", name)
        
        # Check if the notification exists
        if notification:
            # Update the 'read' field with the passed value
            notification.read = read
            notification.save() 
            frappe.db.commit()  
            return {"success":True,"status": "success", "message": "Notification marked as read."}
        else:
            return {"success":False,"status": "error", "message": "Notification not found."}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Error marking notification as read")
        return {"success":False,"status": "error", "message": str(e)}
    
@frappe.whitelist()
def show_notification_data():
    # Fetch all notifications from the Notification Log doctype
    notifications = frappe.get_all(
        "Notification Log",
        fields=["name", "subject", "email_content", "document_type", "for_user", "creation"]
    )

    return notifications


@frappe.whitelist()
def send_system_notification(doc, method=None):
    # doc is the document that triggered the hook
    user_email = doc.name  # Assuming `doc.name` is the user email or ID

    # Fetch the user document
    user = frappe.get_doc("User", user_email)
    
    # Check if the user has a role profile named "Customer"
    if user.role_profile_name == "Carpenter":
        username = user.full_name  # Access the username field

        # Create a new notification log entry
        notification = frappe.get_doc({
            'doctype': 'Notification Log',
            'for_user': user_email,
            'type': 'Alert',
            'subject': 'Your Account Has Been Approved',
            'email_content': f'{username}, Your registration request has been approved, and your account has been created successfully.',
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
            'email_content': f"""
                <p>{customer.full_name}, 
                Your request for 
                <strong>{doc.redeemed_points}</strong> points redemption has been approved!</p>
            """,
            'document_type': 'Redeem Request',
            'document_name': doc.name
        })
        notification.insert(ignore_permissions=True)
        frappe.db.commit()

        return "Notification sent successfully to the user"
    else:
        return "Request not approved, no notification sent"






 
