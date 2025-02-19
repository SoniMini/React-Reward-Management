import frappe
from frappe import _
import requests
from reward_management_app.api.sms_api import reject_pending_reward_request_sms
from reward_management_app.api.sms_api import pending_reward_request_approved_sms

@frappe.whitelist()
def get_redeem_request():
    redeem_requests = frappe.get_all("Redeem Request", fields=["name", "customer_id", "redeemed_points", "current_point_status", "total_points", "approve_time", "received_time", "request_status", "received_date", "approved_on", "amount", "transection_id"])
    
    for request in redeem_requests:
        if request.get('received_date'):
            request['received_date'] = frappe.utils.formatdate(request['received_date'], 'dd-MM-yyyy')  # Format received_date as dd-MM-yyyy
        if request.get('approved_on'):
            request['approved_on'] = frappe.utils.formatdate(request['approved_on'], 'dd-MM-yyyy')  # Format approved_on as dd-MM-yyyy
    
    return redeem_requests

# # update reward request status---
# @frappe.whitelist()
# def update_redeem_request_status(request_id, action, transaction_id=None, amount=None):
#     try:
#         redeem_request = frappe.get_doc("Redeem Request", request_id)
        
#         # Update request_status and approved_on
#         redeem_request.request_status = action
#         redeem_request.approved_on = frappe.utils.now_datetime()
#         redeem_request.approve_time = frappe.utils.now_datetime().strftime('%H:%M:%S')
        
#         # Set transaction_id if provided
#         if transaction_id:
#             redeem_request.transection_id = transaction_id
            
#         if amount:
#             redeem_request.amount = amount
        
#         # Fetch the carpainter associated with the redeem request by customer_id
#         carpainter = frappe.get_doc("Carpenter", {"name": redeem_request.customer_id})
        
#         # Deduct redeemed points if action is Approved
#         if action == "Cancel":
#             # Calculate new current_point_status in Redeem Request
#             # redeem_request.current_point_status = redeem_request.total_points + redeem_request.redeemed_points
            
#             # Update points in Carpainter
#             carpainter.current_points = carpainter.current_points + redeem_request.redeemed_points
            
#             carpainter.point_requested = (carpainter.point_requested or 0) - redeem_request.redeemed_points
            
#              # Calculate new current_point_status in Redeem Request
#             redeem_request.current_point_status = carpainter.current_points
            
#             # Save both documents
#             redeem_request.save(ignore_permissions=True)
#             carpainter.save(ignore_permissions=True)
            
#             # Commit the transaction
#             frappe.db.commit()
#           # Deduct redeemed points if action is Approved
#         if action == "Approved":
#             # Update points in Carpainter
#             carpainter.redeem_points = (carpainter.redeem_points or 0) + redeem_request.redeemed_points
            
            
#             # Create Bank Balance document with current datetime
#             create_bank_balance(redeem_request.name, redeem_request.redeemed_points, transaction_id)
        

#             # Save the updates to redeem_request
#             redeem_request.save(ignore_permissions=True)
#             carpainter.save(ignore_permissions=True)

            
#             # Commit the transaction
#             frappe.db.commit()
        
#         return {"status": "success", "message": _("Redeem request status updated successfully.")}
    
#     except Exception as e:
#         frappe.log_error(frappe.get_traceback(), _("Error in update_redeem_request_status"))
#         frappe.throw(_("Failed to update redeem request status: {0}").format(str(e)))



# update points--------------------
@frappe.whitelist()
def update_redeem_request_status(request_id, action, transaction_id=None, amount=None):
    try:
        redeem_request = frappe.get_doc("Redeem Request", request_id)
        request_action = redeem_request.request_status  # Previous status
        # print(f"\n\nRedeem Request Status Before: {request_action}, Action Received: {action}")
        
        # Update request_status and timestamps
        redeem_request.request_status = action
        redeem_request.approved_on = frappe.utils.now_datetime()
        redeem_request.approve_time = frappe.utils.now_datetime().strftime('%H:%M:%S')
        
        if transaction_id:
            redeem_request.transection_id = transaction_id
        
        if amount:
            redeem_request.amount = amount
        
        # Fetch the Carpenter associated with the redeem request
        carpainter = frappe.get_doc("Carpenter", {"name": redeem_request.customer_id})

        # Handling Cancel after Approved
        if request_action == 'Approved' and action == 'Cancel':
            # print(f"\n\nHandling Cancel after Approved for Request: {request_id}")
            carpainter.current_points += redeem_request.redeemed_points
            carpainter.point_requested = 0
            # carpainter.point_requested = (carpainter.point_requested or 0) - redeem_request.redeemed_points
            carpainter.redeem_points = (carpainter.redeem_points or 0) - redeem_request.redeemed_points
            redeem_request.current_point_status = carpainter.current_points
            
            # Call the SMS API when reward request is Cancel
            reject_pending_reward_request_sms(redeem_request.mobile_number, redeem_request.redeemed_points)
        
        # Handling Approval from Cancel
        elif request_action == 'Cancel' and action == 'Approved':
            # print(f"\n\nHandling Approval after Cancel for Request: {request_id}")
            carpainter.current_points -= redeem_request.redeemed_points
            carpainter.point_requested = 0
            # carpainter.point_requested = (carpainter.point_requested or 0) + redeem_request.redeemed_points
            carpainter.redeem_points = (carpainter.redeem_points or 0) + redeem_request.redeemed_points
            redeem_request.current_point_status = carpainter.current_points
            redeem_request.total_points = carpainter.total_points
            create_bank_balance(redeem_request.name, redeem_request.redeemed_points, transaction_id)
            
            # Call the SMS API when changing from Cancel to Approved
            if transaction_id:
                sms_response = pending_reward_request_approved_sms(redeem_request.mobile_number, redeem_request.redeemed_points, transaction_id)
            else:
                sms_response = "Transaction ID missing, SMS not sent."
            # pending_reward_request_approved_sms(redeem_request.mobile_number, redeem_request.redeemed_points,transaction_id)
        
        # Handling New Approvals
        elif action == "Approved":
            # print(f"\n\nHandling New Approval for Request: {request_id}")
            carpainter.point_requested = 0

            # carpainter.point_requested = (carpainter.point_requested or 0) - redeem_request.redeemed_points
            carpainter.redeem_points = (carpainter.redeem_points or 0) + redeem_request.redeemed_points
            create_bank_balance(redeem_request.name, redeem_request.redeemed_points, transaction_id)
            
            # Call the SMS API when reward request is Approved
            if transaction_id:
                sms_response = pending_reward_request_approved_sms(redeem_request.mobile_number, redeem_request.redeemed_points, transaction_id)
            else:
                sms_response = "Transaction ID missing, SMS not sent."
            # pending_reward_request_approved_sms(redeem_request.mobile_number, redeem_request.redeemed_points,transaction_id)
        
        # Handling New Cancellations
        elif action == "Cancel":
            # print(f"\n\nHandling New Cancellation for Request: {request_id}")
            carpainter.current_points += redeem_request.redeemed_points
            carpainter.point_requested = 0
            # carpainter.point_requested = (carpainter.point_requested or 0) - redeem_request.redeemed_points
            redeem_request.current_point_status = carpainter.current_points
            # Call the SMS API when changing from Approved to Cancel
            reject_pending_reward_request_sms(redeem_request.mobile_number, redeem_request.redeemed_points)

        # Save both documents
        redeem_request.save(ignore_permissions=True)
        carpainter.save(ignore_permissions=True)
        
        # Commit the transaction
        frappe.db.commit()
        
        return {"status":200, "success":True, 
                "message": "Redeem request status updated successfully.",
                "sms_response":sms_response}
    
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Error in update_redeem_request_status"))
        # frappe.throw(_("Failed to update redeem request status: {0}").format(str(e)))
        return{
            "success":False,
            "message": f"Failed to update redeem request status: {str(e)}"
        }

        
# Create Bank Balance ----------
def create_bank_balance(redeem_request_id, amount, transaction_id=None):
    try:
        # Create Bank Balance document
        bank_balance = frappe.new_doc("Bank Balance")
        bank_balance.redeem_request_id = redeem_request_id
        bank_balance.amount = amount
        bank_balance.transaction_id = transaction_id
        bank_balance.transfer_date = frappe.utils.now_datetime()
        bank_balance.transfer_time = frappe.utils.now_datetime().strftime('%H:%M:%S')
        
        bank_balance.insert(ignore_permissions=True)
        frappe.db.commit()
        frappe.msgprint(_("Bank Balance created successfully."))  # Optional message for success

        return bank_balance.name  # Return the created Bank Balance document's name
    
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Error in creating Bank Balance"))
        frappe.throw(_("Failed to create Bank Balance: {0}").format(str(e)))
