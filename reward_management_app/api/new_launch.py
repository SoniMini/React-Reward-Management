import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def get_new_launch():
    new_launch = frappe.get_single('Newly Launch')  

    launch_name = new_launch.launch_name 
    url = new_launch.url 

    return {
        "success": True,
        'launch_name': launch_name,
        'url': url
    }
    