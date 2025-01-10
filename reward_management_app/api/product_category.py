import frappe
from frappe.model.document import Document

@frappe.whitelist(allow_guest=True)
def get_product_subcategory():
    product_subcategory = frappe.get_all("Product Sub Category", fields=["name", "category", "sub_category_name","sub_category_image"])
    if product_subcategory:
        return  {
            "success": True,
            "message": "Product Sub Category fetched successfully.",
            "data": product_subcategory
            }
    else:
        frappe.throw(("subcategory not found for this email"))
        
        
        
@frappe.whitelist(allow_guest=True)
def get_product_category():
    # Fetch all product categories
    product_category = frappe.get_all("Product Category", fields=["name", "category_name"])

    # Fetch all product subcategories
    product_subcategory = frappe.get_all("Product Sub Category", fields=["name", "category", "sub_category_name", "sub_category_image"])

    # Prepare separate lists for categories and subcategories
    category_list = []
    subcategory_list = []

    # Loop through each product category and add it to category_list
    for category in product_category:
        category_list.append({
            "category_name": category["category_name"],
            "category_id": category["name"]
        })

    # Loop through each product subcategory and add it to subcategory_list
    for subcategory in product_subcategory:
        subcategory_list.append({
            "sub_category_name": subcategory["sub_category_name"],
            "sub_category_image": subcategory["sub_category_image"],
            "category_id": subcategory["category"]
        })

    # Return both category and subcategory lists
    return {
        "success": True,
        "message": "Product Categories and Subcategories fetched successfully.",
        "categories": category_list,
        "subcategories": subcategory_list
    }
