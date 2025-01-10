import frappe
from frappe.model.document import Document


# get current project details
@frappe.whitelist(allow_guest=True)
def get_project():
    
    project_slider = frappe.get_doc("Project Slider", "Project Slider")

    # Fetch child table data
    project_image_data = frappe.get_all(
        "Project Slider Image Child", 
        filters={"parent": "Project Slider"},
        fields=["project_image"]
    )
    
    # Prepare the response dictionary
    response = {
        "project_url": project_slider.project_url,
        "project_image": [entry["project_image"] for entry in project_image_data]
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
        frappe.throw(_("The 'new_image_url' parameter must be an array of image URLs."))

    # Fetch the parent document
    try:
        project_doc = frappe.get_doc("Project Slider", "Project Slider")
    except frappe.DoesNotExistError:
        frappe.throw(_("The 'Project' document does not exist."))

    # Update the project_url field
    project_doc.project_url = projectUrl

    # Clear existing child table rows
    project_doc.set("project_image_slider", [])

    # Append new rows to the child table
    for image_url in new_image_url:
        project_doc.append("project_image_slider", {
            "project_image": image_url
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

