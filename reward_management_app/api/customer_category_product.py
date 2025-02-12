import frappe
from frappe.model.document import Document



@frappe.whitelist(allow_guest=True)
def get_customer_product(sub_category_name):
    # Fetch products where product_sub_category matches the sub_category_id
    products = frappe.get_all(
        "Customer Product Master", 
        fields=["name", "product_name", "product_category", "product_sub_category","sub_category_name","category_name", "product_url", "product_image"],
        filters={"product_sub_category": sub_category_name} 
    )

    if products:
        return {
            "success": True,
            "message": "Products fetched successfully.",
            "products": products  
        }
    else:
        return {
            "success": False,
            "message": "No products found for the given sub-category."
        }

# get customer product from slected product----
@frappe.whitelist(allow_guest=True)
def get_product_details(product_name):
    # Fetch products with match product name----
    products = frappe.get_all(
        "Customer Product Master", 
        fields=["name", "product_name", "product_category", "product_sub_category", "product_url", "product_image"],
        filters={"name": product_name},
                limit_page_length=1  

    )

    if products:
        return {
            "success": True,
            "message": "Getting Product Details Succesfully.",
            "products": products[0] 
        }
    else:
        return {
            "success": False,
            "message": "No product found for the given product."
        }
