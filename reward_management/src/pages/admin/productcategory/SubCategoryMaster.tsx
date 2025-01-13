import "../../../assets/css/style.css";
import "../../../assets/css/pages/admindashboard.css";
import Pageheader from "../../../components/common/pageheader/pageheader";
import TableComponent from "../../../components/ui/tables/tablecompnent";
import TableBoxComponent from "../../../components/ui/tables/tableboxheader";
import React, { useState, useEffect } from "react";
import SuccessAlert from "../../../components/ui/alerts/SuccessAlert";
import DangerAlert from "../../../components/ui/alerts/DangerAlert";
import axios from "axios";
import { useFrappeGetDocList } from "frappe-react-sdk";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

interface ProductSubCategory {
    name: string;
    category: string;
    sub_category_name: string;
    sub_category_image: string;
}

interface ProductCategory {
    name: string,
    category_name: string
}

const SubCategoryMaster: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [productSubCategory, setProductSubCategory] = useState("");
    const [productCategory, setProductCategory] = useState<{ category_name: string; id: number }[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [files, setFiles] = useState<FileList | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
        useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [showAddSubCategoryForm, setShowAddSubCategoryForm] = useState(false);
    const [productSubCategoryToDelete, setProductSubCategoryToDelete] =
        useState<ProductSubCategory | null>(null);
    const [alertTitle, setAlertTitle] = useState("");
    const [productSubCategoryToEdit, setProductSubCategoryToEdit] =
        useState<ProductSubCategory | null>(null);
    const [filteredData, setFilteredData] = useState<ProductSubCategory[]>([]);




    const notyf = new Notyf({
        position: {
            x: 'right',
            y: 'top',
        },
        duration: 3000, 
    });


    // Fetch the product Sub  categories
    const { data: productsubcategoryData, mutate: mutateProductSubCategory } =
        useFrappeGetDocList<ProductSubCategory>("Product Sub Category", {
            fields: ["name", "sub_category_name","category", "sub_category_image"],
        });


       // Fetch the product categories
       const { data: productcategoryData, error } = useFrappeGetDocList<ProductCategory>('Product Category', {
        fields: ['name', 'category_name']
    });


    const handleSearch = (value: string) => setSearchQuery(value);



    useEffect(() => {
        if (productsubcategoryData) {
            const filteredData = productsubcategoryData.filter((item) =>
                item.sub_category_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(filteredData);
        }
    }, [searchQuery, productsubcategoryData]);

    React.useEffect(() => {
        document.title = "Sub Category";
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                // window.location.reload();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert]);

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file, file.name);
        formData.append("is_private", "0");
        formData.append("folder", "");
        formData.append("file_name", file.name);

        try {
            const response = await axios.post(`/api/method/upload_file`, formData, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.data.message?.file_url) {
                return response.data.message.file_url;
            } else {
                console.error("File URL not found in response:", response.data);
                return null;
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fileUrls: string[] = [];

        if (files) {
            for (const file of Array.from(files)) {
                const fileUrl = await uploadFile(file);
                if (fileUrl) {
                    fileUrls.push(fileUrl);
                }
            }
        }

        const updatedProductImage =
            fileUrls.length > 0 ? fileUrls[0] : existingImages[0];

        const data = {
            sub_category_name: productSubCategory,
            category: productCategory,
            sub_category_image: updatedProductImage,
        };

        try {
            if (productSubCategoryToEdit) {
                // Edit existing product category
                await axios.put(
                    `/api/resource/Product Sub Category/${productSubCategoryToEdit.name}`,
                    data,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                setAlertTitle("Success");
                setAlertMessage("Sub Category updated successfully!");
                // Clear the input fields
                setProductSubCategory("");
                // Clear the file previews
                setPreviews([]);
                // Clear any existing images
                setExistingImages([]);
            } else {
                // Add new product category
                await axios.post(`/api/resource/Product Sub Category`, data, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                setAlertTitle("Success");
                setAlertMessage("Sub Category added successfully!");
                // Clear the input fields
                setProductSubCategory("");
                setPreviews([]);
                setExistingImages([]);
            }

            setShowSuccessAlert(true);
            handleCloseModal();
            mutateProductSubCategory();
        } catch (error) {
            console.error("Error submitting the form:", error);
            alert("An error occurred while submitting the form. Please try again.");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            setFiles(selectedFiles);
            const filePreviews = Array.from(selectedFiles).map((file) =>
                URL.createObjectURL(file)
            );
            setPreviews(filePreviews);
        }
    };

    const handleDeleteProductCategory = (item: ProductSubCategory) => {
        setProductSubCategoryToDelete(item);
        setIsConfirmDeleteModalOpen(true);
    };

    const handleEditProductCategory = (category: ProductSubCategory) => {
        setProductSubCategoryToEdit(category);
        setShowAddSubCategoryForm(true);
    };

    const confirmDelete = async () => {
        if (!productSubCategoryToDelete) return;

        try {
            const response = await axios.delete(
                `/api/resource/Product Sub Category/${productSubCategoryToDelete.name}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("delete response", response);

            if (response.data.data === "ok") {
                setAlertMessage("Sub Category deleted successfully!");
                setShowSuccessAlert(true);
                setTimeout(() => setShowSuccessAlert(false), 3000);
                setIsConfirmDeleteModalOpen(false);
                mutateProductSubCategory();
            } else {
                console.warn("Unexpected response:", response);
                alert("Failed to delete Sub Category. Please try again.");
            }
        } catch (error) {
            if (error.response) {
                // Check if the error is a LinkExistsError and extract the message
                if (error.response.data && error.response.data.exception) {
                    const exceptionMessage = error.response.data.exception;

                    // Check if the message contains 'LinkExistsError' and display the custom message
                    if (exceptionMessage.includes("LinkExistsError")) {
                        const linkedMessage =
                            "This Sub Category is linked with a Product. Please unlink it before deletion.";
                        // alert(linkedMessage);
                        notyf.error(linkedMessage);
                    } else {
                        // alert(exceptionMessage);
                        notyf.error(exceptionMessage);
                    }
                } else {
                    alert("Failed to delete Sub Category. Please try again.");
                }
            } else {
                console.error("Error deleting Product Category:", error);
                alert("Failed to delete Product Category. Please try again.");
            }
        }
    };
    const handleCloseModal = () => {
        setProductSubCategoryToEdit(null);
        setShowAddSubCategoryForm(false);
    };

    const cancelDelete = () => {
        setIsConfirmDeleteModalOpen(false);
        setProductSubCategoryToDelete(null);
    };

    return (
        <>
            <Pageheader
                currentpage={"Sub Category"}
                activepage={"/sub-catagory"}
                activepagename="Sub Category"
            />

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <TableBoxComponent
                        title="Sub Category"
                        onSearch={handleSearch}
                        onAddButtonClick={() => setShowAddSubCategoryForm(true)}
                        buttonText="Add Sub Category"
                        showButton={true}
                        showFromDate={false}
                        showToDate={false}
                        onDateFilter={(from, to) => console.log(from, to)}
                    />

                    <div className="box-body m-5">
                        <TableComponent<ProductSubCategory>
                            columns={[
                                { header: "Sub Category", accessor: "sub_category_name" },
                                { header: "Category", accessor: "category" },
                                {
                                    header: "Image",
                                    accessor: "sub_category_image",
                                    render: (row) => (
                                        <img
                                            src={row.catalogue_image}
                                            alt={row.category_name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    ),
                                },
                            ]}
                            data={filteredData || []}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            handlePrevPage={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            handleNextPage={() => setCurrentPage((prev) => prev + 1)}
                            handlePageChange={(page) => setCurrentPage(page)}
                            showProductQR={false}
                            showEdit={true}
                            onEdit={handleEditProductCategory} // Edit button handler
                            showDelete={true}
                            onDelete={handleDeleteProductCategory}
                            showView={false}
                            columnStyles={{
                                'Sub Category': 'text-[var(--primaries)] font-semibold',
                            }}
                        />
                    </div>
                </div>
            </div>

            {showAddSubCategoryForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                        <div className="ti-modal-content flex flex-col h-full max-h-[80vh]">
                            <div className="box-header">
                                <div className="ti-modal-header flex justify-between border-b p-4">
                                    <h6 className="modal-title text-1rem font-semibold text-primary">
                                        {productSubCategoryToEdit
                                            ? "Edit Sub Category"
                                            : "Add Sub Category"}
                                    </h6>
                                    <button
                                        onClick={handleCloseModal}
                                        type="button"
                                        className="text-1rem font-semibold text-defaulttextcolor"
                                    >
                                        <span className="sr-only">Close</span>
                                        <i className="ri-close-line"></i>
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="p-4 overflow-auto flex-1">
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="xl:col-span-12 col-span-12">
                                            <label
                                                htmlFor="subcategoryName"
                                                className="block text-sm text-defaulttextcolor font-semibold mb-1"
                                            >
                                                Sub Category
                                            </label>
                                            <input
                                                type="text"
                                                id="subcategoryName"
                                                className="form-control w-full rounded-md text-defaulttextcolor text-sm border border-[#dadada]"
                                                placeholder="Enter Product Category"
                                                value={
                                                    productSubCategory ||
                                                    (productSubCategoryToEdit
                                                        ? productSubCategoryToEdit.sub_category_name
                                                        : "")
                                                }
                                                onChange={(e) => setProductSubCategory(e.target.value)}
                                                readOnly={!!productSubCategoryToEdit}
                                            />
                                        </div>

                                        {/* select category--- */}
                                        <div className="xl:col-span-12 col-span-12">
                                                    <label htmlFor="product-category-add" className="form-label text-sm font-semibold text-defaulttextcolor">Category</label>
                                                    
                                                        <select
                                                            id="product-category-add"
                                                            name="product-category-add"
                                                            className="w-full border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem]"
                                                            value={productCategory}
                                                            onChange={(e) => setProductCategory(e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Select a category</option>
                                                            {productcategoryData && productcategoryData.map((category) => (
                                                                <option key={category.name} value={category.category_name}>
                                                                    {category.category_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                   
                                                </div>
                                        {/* end---- */}
                                        <div className="xl:col-span-12 col-span-12">
                                            <label
                                                htmlFor="product-images-add"
                                                className="block text-sm font-semibold text-defaulttextcolor mb-1"
                                            >
                                                Category Image
                                            </label>
                                            <input
                                                type="file"
                                                multiple
                                                className="form-control w-full rounded-md text-defaulttextcolor text-sm font-medium p-2 border border-[#dadada]"
                                                id="product-images-add"
                                                onChange={handleFileChange}
                                            />
                                            <div className="flex gap-4 mt-2">
                                                {previews.map((preview, index) => (
                                                    <img
                                                        key={index}
                                                        src={preview}
                                                        alt={`preview-${index}`}
                                                        className="w-32 h-32 object-cover"
                                                    />
                                                ))}
                                                {productSubCategoryToEdit?.sub_category_image && (
                                                    <img
                                                        src={productSubCategoryToEdit?.sub_category_image}
                                                        alt="current image"
                                                        className="w-32 h-32 object-cover"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="xl:col-span-12 col-span-12 text-center border-t p-4 border-defaultborder">


                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="ti-btn ti-btn-primary-full bg-primary me-2"
                                        >
                                            {productSubCategoryToEdit ? "Update" : "Submit"}
                                        </button>
                                        <button
                                            type="button"
                                            className="ti-btn ti-btn-success bg-defaulttextcolor ti-btn text-white !font-medium m-1"
                                            onClick={handleCloseModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>

                                </div>

                            </form>

                        </div>
                    </div>
                </div>
            )}

            {isConfirmDeleteModalOpen && (
                <DangerAlert
                    type="danger"
                    message={`Are you sure you want to delete this sub catagory?`}
                    onDismiss={cancelDelete}
                    onConfirm={confirmDelete}
                    cancelText="Cancel"
                    confirmText="Continue"
                />
            )}

            {showSuccessAlert && (
                <SuccessAlert
                    title={alertTitle}
                    showButton={false}
                    showCancleButton={false}
                    showCollectButton={false}
                    showAnotherButton={false}
                    showMessagesecond={false}
                    message={alertMessage}
                    onClose={function (): void {
                        throw new Error("Function not implemented.");
                    }}
                    onCancel={function (): void {
                        throw new Error("Function not implemented.");
                    }}
                />
            )}
        </>
    );
};

export default SubCategoryMaster;
