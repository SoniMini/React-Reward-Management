import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def get_social_media_link():
    social_link = frappe.get_single('Social Media Link')  

    facebook_url = social_link.facebook_url 
    insta_url = social_link.instagram_url 
    whatsapp_url = social_link.whatsapp_url
    google_url = social_link.google_map_url

    return {
        "success": True,
        'facebook_url': facebook_url,
        'insta_url': insta_url,
        'whatsapp_url': whatsapp_url,
        'google_url': google_url,
    }
    