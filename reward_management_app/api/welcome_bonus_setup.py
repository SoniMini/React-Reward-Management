import frappe
from frappe import _

@frappe.whitelist()
def get_welcome_bonus_points():
    # Fetch bonus points from Welcome Bonus
    bonuspoints_setup = frappe.get_single('Welcome Bonus') 
    bonus_points = bonuspoints_setup.bonus_points or 0

    return {
        "success":True,
        'bonus_points': bonus_points,
    }
    