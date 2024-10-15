import frappe
import json
import re

no_cache = 1

# Regular expressions for sanitizing JSON to prevent XSS attacks
SCRIPT_TAG_PATTERN = re.compile(r"<script[^<]*</script>")
CLOSING_SCRIPT_TAG_PATTERN = re.compile(r"</script>")

def get_context(context):
    # Uncomment if you need CSRF token for security
    # csrf_token = frappe.sessions.get_csrf_token()
    # context.csrf_token = csrf_token

    try:
        # Check if the user is either "Admin" or "Administrator"
        if frappe.session.user in ["Admin", "Administrator"]:
            # Get boot data for admin and administrator users
            boot = frappe.website.utils.get_boot_data()
        else:
            # Get session data for other users
            boot = frappe.sessions.get()
    except Exception as e:
        # Handle session retrieval errors
        raise frappe.SessionBootFailed from e

    # Convert boot data to JSON and sanitize
    boot_json = frappe.as_json(boot, indent=None, separators=(",", ":"))
    boot_json = SCRIPT_TAG_PATTERN.sub("", boot_json)
    boot_json = CLOSING_SCRIPT_TAG_PATTERN.sub("", boot_json)
    boot_json = json.dumps(boot_json)

    # Update the context with build version and sanitized boot data
    context.update({
        "build_version": frappe.utils.get_build_version(),
        "boot": boot_json,
    })

    return context
