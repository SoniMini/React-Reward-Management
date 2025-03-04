import frappe
from frappe.model.document import Document


# get current project details
@frappe.whitelist(allow_guest=True)
def get_project():
    
    # project_slider = frappe.get_doc("Project Slider", "Project Slider")

    # Fetch child table data
    project_image_data = frappe.get_all(
        "Project Slider Image Child", 
        filters={"parenttype": "Project Slider"},
        fields=["project_image","project_link"]
    )
    
    # Prepare the response dictionary
    response = {
        "success": True,
        "product": [
            {"product_image": entry["project_image"], "product_link": entry["project_link"]}
            for entry in project_image_data
        ]
    }
    
    return response




# # update or add new project------
# @frappe.whitelist(allow_guest=True)
# def add_project(new_image_url):
#     if not isinstance(new_image_url, list):
#         frappe.throw(_("The new_image_url must be an array."))

#     # Fetch existing child table rows
#     project_images = frappe.get_all(
#         "Project Image",
#         filters={"parent": "Project"},
#         fields=["name", "image"],
#         order_by="idx"
#     )

#     # Load the parent document
#     project_doc = frappe.get_doc("Project", "Project")

#     # Update existing rows or add new rows
#     for idx, image_url in enumerate(new_image_url):
#         if idx < len(project_images):
#             # Update existing row
#             project_images[idx]["image"] = image_url
#             project_doc.update({
#                 "project_image": project_images
#             })
#         else:
#             # Add a new row if not enough existing rows
#             project_doc.append("project_image", {"image": image_url})

#     # Save the updated document
#     project_doc.save()
#     frappe.db.commit()

#     return {"status": "success", "message": "Project images updated successfully"}


@frappe.whitelist()
def add_project(new_image_url, projectUrl):
    # Ensure the input is a list
    if not isinstance(new_image_url, list):
        frappe.throw(("The 'new_image_url' parameter must be an array of image URLs."))

    # Fetch the parent document
    try:
        project_doc = frappe.get_doc("Project Slider", "Project Slider")
    except frappe.DoesNotExistError:
        frappe.throw(("The 'Project' document does not exist."))

    # Update the project_url field
    # project_doc.project_url = projectUrl

    # Clear existing child table rows
    project_doc.set("project_image_slider", [])

    # Append new rows to the child table
    for image_url in new_image_url:
        project_doc.append("project_image_slider", {
            "project_image": image_url
        })
         
    for project_url in projectUrl:
        project_doc.append("project_image_slider", {
            "project_link": project_url
        })
    # Save the updated document
    project_doc.save()
    frappe.db.commit()

    return {
        "status": "success",
        "message": "Project updated successfully",
        "project_url": projectUrl,
        "updated_images": new_image_url
    }
    
    
# add new project----------
@frappe.whitelist()
def add_new_project(new_image_url, image_description):
    # Ensure the inputs are lists
    if not isinstance(new_image_url, list):
        frappe.throw("The 'new_image_url' parameter must be an array of image URLs.")
    
    if not isinstance(image_description, list):
        frappe.throw("The 'image_description' parameter must be an array of descriptions.")

    # Ensure the lists have the same length
    if len(new_image_url) != len(image_description):
        return{
            "success":False,
            "message":"The number of image URLs must match the number of descriptions."
        }

    # Fetch the parent document
    try:
        project_doc = frappe.get_doc("Project Slider", "Project Slider")
    except frappe.DoesNotExistError:
        return{
            "success":False,
            "message":"The 'Project Slider' document does not exist."
        }

    # Clear existing rows in the child table
    project_doc.project_image_slider = []

    # Add new rows to the child table
    for project_image, project_link in zip(new_image_url, image_description):
        project_doc.append("project_image_slider", {
            "project_image": project_image,  # Image URL
            "project_link": project_link      # Project Link (URL)
        })

    # Save the updated document
    project_doc.save()
    frappe.db.commit()

    return {
        "status": 200,
        "success":True,
        "message": "All existing data cleared, and new instruction images and descriptions added successfully",
        "added_images": new_image_url,
        "added_link": image_description
    }

    
    
 #Update Selected Project--------- 

    # @frappe.whitelist()
    # def add_update_project(selected_images, selected_descriptions):
    #     # Validate inputs
    #     if not isinstance(selected_images, list):
    #         frappe.throw("The 'selected_images' parameter must be a list of image URLs.")
        
    #     if not isinstance(selected_descriptions, list):
    #         frappe.throw("The 'selected_descriptions' parameter must be a list of descriptions.")

    #     if len(selected_images) != len(selected_descriptions):
    #         frappe.throw("The number of images and descriptions must match.")

    #     # Fetch the parent document
    #     project_doc = frappe.get_doc("Project Slider", "Project Slider")
        
    #     # Update only selected images and descriptions
    #     for idx, (project_image, project_link) in enumerate(zip(selected_images, selected_descriptions)):
    #         if idx < len(project_doc.project_image_slider):
    #             # Update existing child rows
    #             project_doc.project_image_slider[idx].update({
    #                 "project_image": project_image,
    #                 "project_link": project_link
    #             })
    #         else:
    #             # Append new rows if more data is provided
    #             project_doc.append("project_image_slider", {
    #                 "project_image": project_image,
    #                 "project_link": project_link
    #             })

    #     # Save changes
    #     project_doc.save(ignore_permissions=True)
    #     frappe.db.commit()

    #     return {
    #         "status": "success",
    #         "message": "Selected instructions updated successfully",
    #         "updated_images": selected_images,
    #         "updated_descriptions": selected_descriptions
    #     }


@frappe.whitelist()
def add_update_project(selected_images, selected_descriptions, old_images, old_descriptions):
    # Validate inputs
    if not isinstance(selected_images, list):
        frappe.throw("The 'selected_images' parameter must be a list of image URLs.")
    
    if not isinstance(selected_descriptions, list):
        frappe.throw("The 'selected_descriptions' parameter must be a list of descriptions.")

    if len(selected_images) != len(selected_descriptions):
        frappe.throw("The number of images and descriptions must match.")

    # Fetch the parent document (Project Slider)
    project_doc = frappe.get_doc("Project Slider", "Project Slider")

    updated = False  # Flag to track if any update occurred

    # Loop through the old data (to match and update)
    for idx, (old_image, old_description) in enumerate(zip(old_images, old_descriptions)):
        # Try to find the row matching both old_image and old_description
        matched_row = next((row for row in project_doc.project_image_slider 
                            if row.project_image == old_image and row.project_link == old_description), None)

        if matched_row:
            # If a match is found, update the row with new data from selected_images and selected_descriptions
            matched_row.project_image = selected_images[idx]  # Update image
            matched_row.project_link = selected_descriptions[idx]  # Update link
            updated = True  # Mark update flag as True

    # If any updates were made, save the document
    if updated:
        project_doc.save(ignore_permissions=True)
        frappe.db.commit()

        return {
            "status": "success",
            "message": "Project updated successfully",
            "updated_images": selected_images,
            "updated_descriptions": selected_descriptions
        }
    else:
        return {
            "status": "failure",
            "message": "No matching rows found to update."
        }
