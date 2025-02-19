import frappe
import requests



# pending account sms---
@frappe.whitelist(allow_guest=True)
def pending_account_sms(mobile_number):
    url = "https://login.raidbulksms.com/unified.php"
    params = {
        "key": "1n4812wh341u41U1NWH34812",
        "ph": mobile_number,
        "sndr": "FLAREO",
        "text": f"Welcome to Flare Overseas Mobile App! Your registration is complete,but your account is currently pending approval.You will be notified once approved.Stay tuned"
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
        

# Approved Account 
@frappe.whitelist(allow_guest=False)
def approved_account_sms(mobile_number):
    url = "https://login.raidbulksms.com/unified.php"
    params = {
        "key": "1n4812wh341u41U1NWH34812",
        "ph": mobile_number,
        "sndr": "FLAREO",
        "text": f"Congratulations! Your account with Flare Overseas Mobile App has been approved. Start scanning QR codes and earning reward points today."
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
        
# Reject pending account request--
@frappe.whitelist(allow_guest=True)
def reject_account_sms(mobile_number):
    url = "https://login.raidbulksms.com/unified.php"
    params = {
        "key": "1n4812wh341u41U1NWH34812",
        "ph": mobile_number,
        "sndr": "FLAREO",
        "text": f"We regret to inform you that your account registration with Flare Overseas Mobile App has been rejected. For more information, please contact support"
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
        
# festival bonus api----
@frappe.whitelist(allow_guest=False)
def festival_bonus_sms(mobile_number,point  ):
    url = "https://login.raidbulksms.com/unified.php"
    params = {
        "key": "1n4812wh341u41U1NWH34812",
        "ph": mobile_number,
        "sndr": "FLAREO",
        "text": f"Happy Diwali! Enjoy your special festival bonus of free {point} reward points from Flare Overseas. Scan QR codes and keep earning more at Flare Overseas Mobile App!"
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
        
# Reward Point Withdrawal Request------
@frappe.whitelist(allow_guest=False)
def reward_point_withdrawal_request_sms(mobile_number,point):
    url = "https://login.raidbulksms.com/unified.php"
    params = {
        "key": "1n4812wh341u41U1NWH34812",
        "ph": mobile_number,
        "sndr": "FLAREO",
        "text": f"Your reward point {point} withdrawal request has been received.We are processing it and will notify you once it's approved.Thank you for using Flare Overseas Mobile App!"
    }

    try:
        response = requests.get(url, params=params)
        frappe.logger().info(f"SMS API Response: {response.status_code}, {response.text}")
        if response.status_code == 200:
            return {"status": "success", "response": response.text}
        else:
            frappe.throw(("Failed to send SMS: {0}".format(response.text)))
    except Exception as e:
        frappe.logger().error(f"SMS Sending Error: {str(e)}")
        return{
            "success":False,
            "message": ("An error occurred while sending the SMS: {0}").format(str(e))
        }
        # frappe.throw(("An error occurred while sending the SMS: {0}".format(str(e))))
  
# Reject pending reward request--
@frappe.whitelist(allow_guest=False)
def reject_pending_reward_request_sms(mobile_number,point):
    url = "https://login.raidbulksms.com/unified.php"
    params = {
        "key": "1n4812wh341u41U1NWH34812",
        "ph": mobile_number,
        "sndr": "FLAREO",
        "text": f"We regret to inform you that your reward point {point} withdrawal request has been rejected.Please check your account for more details at Flare Overseas Mobile App"
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


# approved pending reward request--
@frappe.whitelist(allow_guest=False)
def pending_reward_request_approved_sms(mobile_number,point,transection_id):
    url = "https://login.raidbulksms.com/unified.php"
    params = {
        "key": "1n4812wh341u41U1NWH34812",
        "ph": mobile_number,
        "sndr": "FLAREO",
        "text": f"Your reward point {point} withdrawal request has been approved. The points have been successfully transferred to your UPI number {transection_id}. Enjoy Flare Overseas Mobile App!"
    }

    try:
        response = requests.get(url, params=params)
        frappe.logger().info(f"SMS API Response: {response.status_code}, {response.text}")
        if response.status_code == 200:
            return {"status": "success", "response": response.text}
        else:
            frappe.throw(("Failed to send SMS: {0}".format(response.text)))
    except Exception as e:
        frappe.logger().error(f"SMS Sending Error: {str(e)}")
        frappe.throw(("An error occurred while sending the SMS: {0}".format(str(e))))
  
  
        
# Reward Points Deposited After QR Scan------
@frappe.whitelist(allow_guest=False)
def reward_point_deposited_after_qr_scan_sms(mobile_number,point):
    url = "https://login.raidbulksms.com/unified.php"
    params = {
        "key": "1n4812wh341u41U1NWH34812",
        "ph": mobile_number,
        "sndr": "FLAREO",
        "text": f"Good news! You’ve earned {point} reward points for scanning the QR code. Check your account to see the updated balance. Keep scanning and earning from Flare Overseas Mobile App!"
    }

    try:
        response = requests.get(url, params=params)
        frappe.logger().info(f"SMS API Response: {response.status_code}, {response.text}")
        if response.status_code == 200:
            return {"status": "success", "response": response.text}
        else:
            frappe.throw(("Failed to send SMS: {0}".format(response.text)))
    except Exception as e:
        frappe.logger().error(f"SMS Sending Error: {str(e)}")
        frappe.throw(("An error occurred while sending the SMS: {0}".format(str(e))))
        
        
