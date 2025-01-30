import frappe
from frappe import _


@frappe.whitelist(allow_guest=True)
def check_user_credentials(api_key,api_secret,csrf_token):
    try:
        # Validate the CSRF token
        if not csrf_token or csrf_token != frappe.local.session.data.get('csrf_token'):
            return frappe.local.response.update({
                "status": 403,
                "message": "Invalid or missing CSRF token.",
                "success": False
            })

        # Validate the API key and secret
        if not api_key or not api_secret:
            return frappe.local.response.update({
                "status": 400,
                "message": "API Key and Secret are required.",
                "success": False
            })

        # Fetch the user by API key
        user = frappe.get_all('User', filters={'api_key': api_key}, fields=['name', 'api_secret'], limit=1)

        if not user:
            return frappe.local.response.update({
                "status": 401,
                "message": "Invalid API Key",
                "success": False
            })

        # Check if the api_secret matches the one stored for the user
        if user[0]['api_secret'] != api_secret:
            return frappe.local.response.update({
                "status": 401,
                "message": "Invalid API Secret",
                "success": False
            })

        # If everything is correct, return success
        return frappe.local.response.update({
            "status": 200,
            "message": "User credentials are valid.",
            "success": True
        })

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Error in check_user_credentials API")
        return frappe.local.response.update({
            "status": 500,
            "message": str(e),
            "success": False
        })



@frappe.whitelist()
def get_current_user_credentials():
    try:
        # Get the current logged-in user
        current_user = frappe.session.user
        data =frappe.local.session.data.get('csrf_token')

        # Check if the user is authenticated
        if current_user == "Guest":
            return {
                "status": 401,
                "message": "You must be logged in to access this information.",
                "success": False
            }

        # Fetch the user's API credentials from the User table
        user = frappe.get_all('User', filters={'name': current_user}, fields=['api_key', 'api_secret'])

        if not user:
            return {
                "status": 404,
                "message": "User not found.",
                "success": False
            }

        # Return the credentials for the current user
        return {
            "status": 200,
            "message": "User credentials fetched successfully.",
            "success": True,
            "data": {
                "data":data,
                "user":user[0].get('name'),
                "api_key": user[0].get('api_key'),
                "api_secret": user[0].get('api_secret'),
                # "csrf_token": frappe.local.csrf_token
            }
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Error in get_current_user_credentials API")
        return {
            "status": 500,
            "message": str(e),
            "success": False
        }