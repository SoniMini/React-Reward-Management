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
        "text": f"{otp} is your OTP for Flare Overseas Mobile App"
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
        