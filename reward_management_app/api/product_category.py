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
        
        
        
        
 #Get Product Category------------------------------------------------------------------------------------------------------------------- 
@frappe.whitelist(allow_guest=True)
def get_product_categories():
    # Fetch all product categories
    product_category = frappe.get_all("Product Category", fields=["name", "category_name"])

    # Fetch all product subcategories
    product_subcategory = frappe.get_all("Product Sub Category", fields=["name", "category","category_name", "sub_category_name", "sub_category_image"])

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
            "category_id": subcategory["category_name"]
        })

    # Return both category and subcategory lists
    return {
        "success": True,
        "message": "Product Categories and Subcategories fetched successfully.",
        "categories": category_list,
        "subcategories": subcategory_list
    }


# get all category and subcategory--------------------------------------------------------------------------------------------------
@frappe.whitelist(allow_guest=True)
def get_product_category():
    # Fetch all product categories
    product_category = frappe.get_all("Product Category", fields=["name", "category_name"])

    # Fetch all product subcategories
    product_subcategory = frappe.get_all("Product Sub Category", fields=["name", "category", "sub_category_name", "sub_category_image"])

    # Create a dictionary to group subcategories by category
    category_data = {}

    # Initialize grouped_data with category details
    for category in product_category:
        category_data[category["name"]] = {
            "category_name": category["category_name"],
            "category_id": category["name"],
            "subcategories": []
        }

    # Populate subcategories into their respective categories
    for subcategory in product_subcategory:
        category_id = subcategory["category"]
        if category_id in category_data:
            category_data[category_id]["subcategories"].append({
                "sub_category_name": subcategory["sub_category_name"],
                "sub_category_image": subcategory["sub_category_image"],
                "subcategory_id": subcategory["name"]
            })

    # Convert grouped_data into a list for better JSON serialization
    grouped_category_list = list(category_data.values())

    # Return the structured data
    return {
        "success": True,
        "message": "Product Categories and Subcategories fetched successfully.",
        "categories": grouped_category_list
    }
