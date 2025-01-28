import frappe
from frappe.model.document import Document

@frappe.whitelist()
def get_customer_products():
    try:
        # Fetch all gift products
        gift_products = frappe.get_all(
            "Customer Product Master", 
            fields=["name", "product_name", "product_category","sub_category_name","category_name", "product_sub_category","product_url","product_image"], order_by="creation asc"
        )
        
        # if gift_products:
        #     all_gift_products = []
            
        #     for product in gift_products:
        #         # Fetch related child table records
        #         gift_product_images = frappe.get_all(
        #             "Product Gift Child Table", 
        #             filters={"parent": product.get("name")}, 
        #             fields=["gift_product_image"]
        #         )
                
        #         # Add the child table data to the product dictionary
        #         product["gift_product_images"] = gift_product_images
                
        #         # Append to the result list
        #         all_gift_products.append(product)
            
            # Return the complete data
        return {
                "status": "success", 
                "data": gift_products  # Include all fetched data in the response
            }
        # else:
        #     return {
        #         "status": "success", 
        #         "data": [], 
        #         "message": "No gift products found"
        #     }
    except Exception as e:
        # Log error for debugging in Frappe error logs
        frappe.log_error(frappe.get_traceback(), "Get Gift Products Error")
        
        # Return error response
        return {
            "status": "error", 
            "message": str(e)
        }
        
        
# Add New Customer Product-------------
@frappe.whitelist()
def add_customer_product(new_image_url, productName,productCategoryName, productCategory,subCategoryName, productSubcategory, productUrl):
    # # Ensure the input is a list for new_image_url
    # if not isinstance(new_image_url, list):
    #     return("The 'new_image_url' parameter must be an array of image URLs.")
    #     # frappe.throw(("The 'new_image_url' parameter must be an array of image URLs."))

    # Create a new Cusromer Product document
    product_doc = frappe.get_doc({
        "doctype": "Customer Product Master",
        "product_name": productName,
        "product_category": productCategoryName,
        "category_name": productCategory,
        "product_sub_category": subCategoryName,
        "sub_category_name": productSubcategory,
        "product_url": productUrl,
        "product_image": new_image_url
    })


    # Save the document
    product_doc.insert()  # Insert a new document if it doesn't exist
    frappe.db.commit()

    return {
        "status": "success",
        "message": "Customer product added successfully",
        "gift_product_name": productName,
        "updated_images": new_image_url
    }




        
@frappe.whitelist()
def update_customer_product(new_image_url,productID, productName, productCategoryName,productCategory, subCategoryName,productSubcategory, productUrl):

    # Fetch the existing Gift Product document by name
    product_doc = frappe.get_all("Customer Product Master", filters={"name": productID}, fields=["name"])

    if product_doc:
        # If the document exists, get the first match
        product_doc = frappe.get_doc("Customer Product Master", product_doc[0].name)
        
        # Update fields
        product_doc.product_name = productName
        product_doc.product_category = productCategoryName
        product_doc.category_name = productCategory
        product_doc.product_sub_category =subCategoryName
        product_doc.sub_category_name = productSubcategory
        product_doc.product_url = productUrl
        product_doc.product_image = new_image_url
        
        # # Clear existing images before appending new ones
        # product_doc.set("product_image", [])
        
        # Append new images
        # for image_url in new_image_url:
        #     gift_doc.append("gift_product_image", {
        #         "gift_product_image": image_url
        #     })

        # Save the updated document
        product_doc.save()
        frappe.db.commit()

        return {
            "status": "success",
            "message": "Customer product updated successfully",
            "product_name": productName,
            "updated_images": new_image_url
        }
