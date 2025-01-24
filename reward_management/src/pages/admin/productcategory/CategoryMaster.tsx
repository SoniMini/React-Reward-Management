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

interface ProductCategory {
    name: string;
    category_name: string;
}

const CategoryMaster: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [productCatalogue, setProductCatalogue] = useState("");
    const [categoryName, setcategoryName] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [showAddCatalogueForm, setShowAddCatalogueForm] = useState(false);
    const [productCategoryToDelete, setProductCategoryToDelete] = useState<ProductCategory | null>(null);
    const [alertTitle, setAlertTitle] = useState("");
    const [productCategoryToEdit, setProductCategoryToEdit] =useState<ProductCategory | null>(null);
    const [filteredData, setFilteredData] = useState<ProductCategory[]>([]);




    const notyf = new Notyf({
        position: {
            x: 'right',
            y: 'top',
        },
        duration: 3000, 
    });


    // Fetch the product categories
    const { data: productcategoryData, mutate: mutateProductCategory } =
        useFrappeGetDocList<ProductCategory>("Product Category", {
            fields: ["name", "category_name"],
            orderBy: {
                field: 'creation',
                order: 'desc',
            },
        });

    const handleSearch = (value: string) => setSearchQuery(value);



    useEffect(() => {
        if (productcategoryData) {
            const filteredData = productcategoryData.filter((item) =>
                item.category_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(filteredData);
        }
    }, [searchQuery, productcategoryData]);

    React.useEffect(() => {
        document.title = "Product Category";
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                // window.location.reload();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert]);

//   Add New Catefory--------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const data = {
            // name :categoryName,
            category_name: productCatalogue,
        };

        try {
            if (showAddCatalogueForm) {
                // Add new product category
                await axios.post(`/api/resource/Product Category`, data, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                setAlertTitle("Success");
                setAlertMessage("Product Category added successfully!");
                // Clear the input fields
                
            }

            setShowSuccessAlert(true);
            setProductCatalogue("");

            handleCloseModal();
            mutateProductCategory();
        } catch (error) {
            console.error("Error submitting the form:", error);
            alert("An error occurred while submitting the form. Please try again.");
        }
    };


    //   Edit Category--------------


    const handleEditProductCategory = (category: ProductCategory) => {
        setProductCategoryToEdit(category);
        setcategoryName(category.name);  // Set the Category ID
        setProductCatalogue(category.category_name); // Set the Category Name
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const updatedData = {
            name: categoryName,
            category_name: productCatalogue,
        };
    
        try {
            await axios.put(`/api/resource/Product Category/${categoryName}`, updatedData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Clear the input fields
            setAlertTitle("Success");
            setAlertMessage("Product Category updated successfully!");
            setShowSuccessAlert(true);
            setProductCatalogue("");

    
            // Close the modal and refresh the data
            handleCloseModal();
            mutateProductCategory();  
    
        } catch (error) {
            console.error("Error updating the product category:", error);
            alert("An error occurred while updating the category. Please try again.");
        }
    };
    

// Delete Category-----
    const handleDeleteProductCategory = (item: ProductCategory) => {
        setProductCategoryToDelete(item);
        setIsConfirmDeleteModalOpen(true);
    };


    const confirmDelete = async () => {
        if (!productCategoryToDelete) return;

        try {
            const response = await axios.delete(
                `/api/resource/Product Category/${productCategoryToDelete.name}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("delete response", response);

            if (response.data.data === "ok") {
                setAlertMessage("Product Category deleted successfully!");
                setShowSuccessAlert(true);
                setTimeout(() => setShowSuccessAlert(false), 3000);
                setIsConfirmDeleteModalOpen(false);
                mutateProductCategory();
            } else {
                console.warn("Unexpected response:", response);
                alert("Failed to delete Product Category. Please try again.");
            }
        } catch (error) {
            if (error.response) {
                // Check if the error is a LinkExistsError and extract the message
                if (error.response.data && error.response.data.exception) {
                    const exceptionMessage = error.response.data.exception;

                    // Check if the message contains 'LinkExistsError' and display the custom message
                    if (exceptionMessage.includes("LinkExistsError")) {
                        const linkedMessage =
                            "This Product Category is linked with a Product. Please unlink it before deletion.";
                        // alert(linkedMessage);
                        notyf.error(linkedMessage);
                    } else {
                        // alert(exceptionMessage);
                        notyf.error(exceptionMessage);
                    }
                } else {
                    alert("Failed to delete Product Category. Please try again.");
                }
            } else {
                console.error("Error deleting Product Category:", error);
                alert("Failed to delete Product Category. Please try again.");
            }
        }
    };
    const handleCloseModal = () => {
        setProductCategoryToEdit(null);
        setShowAddCatalogueForm(false);
    };

    const cancelDelete = () => {
        setIsConfirmDeleteModalOpen(false);
        setProductCategoryToDelete(null);
    };

    return (
        <>
            <Pageheader
                currentpage={"Category Master"}
                activepage={"/category-master"}
                activepagename="Category Master"
            />

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <TableBoxComponent
                        title="Category Master"
                        onSearch={handleSearch}
                        onAddButtonClick={() => setShowAddCatalogueForm(true)}
                        buttonText="Add Category"
                        showButton={true}
                        showFromDate={false}
                        showToDate={false}
                        onDateFilter={(from, to) => console.log(from, to)}
                    />

                    <div className="box-body m-5">
                        <TableComponent<ProductCategory>
                            columns={[
                                { header: "Category ID", accessor: "name" },
                                { header: "Category Name", accessor: "category_name" },

                               
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
                            onEdit={handleEditProductCategory} 
                            showDelete={true}
                            onDelete={handleDeleteProductCategory}
                            showView={false}
                            columnStyles={{
                                'Category Name': 'text-[var(--primaries)] font-semibold',
                            }}
                        />
                    </div>
                </div>
            </div>

            {showAddCatalogueForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                        <div className="ti-modal-content flex flex-col h-full max-h-[80vh]">
                            <div className="box-header">
                                <div className="ti-modal-header flex justify-between border-b p-4">
                                    <h6 className="modal-title text-1rem font-semibold text-primary">
                                        Add Category
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
                                                htmlFor="categoryName"
                                                className="block text-sm text-defaulttextcolor font-semibold mb-1"
                                            >
                                                Category
                                            </label>
                                            <input
                                                type="text"
                                                id="categoryName"
                                                className="form-control w-full rounded-[5px] text-defaulttextcolor text-sm border border-[#dadada] outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada]"
                                                placeholder="Enter Product Category"
                                                value={
                                                    productCatalogue 
                                                }
                                                onChange={(e) => setProductCatalogue(e.target.value)}
                                            />
                                        </div>
                                       
                                    </div>
                                </div>

                                <div className="xl:col-span-12 col-span-12 text-center border-t p-4 border-defaultborder">


                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="ti-btn ti-btn-primary !font-medium m-1"
                                            
                                        >
                                            Submit
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


{productCategoryToEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                        <div className="ti-modal-content flex flex-col h-full max-h-[80vh]">
                            <div className="box-header">
                                <div className="ti-modal-header flex justify-between border-b p-4">
                                    <h6 className="modal-title text-1rem font-semibold text-primary">
                                        Edit Category
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

                            <form onSubmit={handleEditSubmit}>
                                <div className="p-4 overflow-auto flex-1">
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="xl:col-span-12 col-span-12">
                                            <label
                                                htmlFor="categoryID"
                                                className="block text-sm text-defaulttextcolor font-semibold mb-1"
                                            >
                                                Category Id
                                            </label>
                                            <input
                                                type="text"
                                                id="categoryID"
                                                className="form-control w-full rounded-[5px] text-defaulttextcolor text-sm border border-[#dadada] outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada]"
                                                value={
                                                    categoryName 
                                                }
                                                readOnly
                                                onChange={(e) => setcategoryName(e.target.value)}
                                            />
                                        </div>
                                        <div className="xl:col-span-12 col-span-12">
                                            <label
                                                htmlFor="categoryName"
                                                className="block text-sm text-defaulttextcolor font-semibold mb-1"
                                            >
                                                Category Name
                                            </label>
                                            <input
                                                type="text"
                                                id="categoryName"
                                                className="form-control w-full rounded-[5px] text-defaulttextcolor text-sm border border-[#dadada] outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada]"
                                                placeholder="Enter Product Category"
                                                value={
                                                    productCatalogue 
                                                }
                                                onChange={(e) => setProductCatalogue(e.target.value)}
                                            />
                                        </div>
                                       
                                    </div>
                                </div>

                                <div className="xl:col-span-12 col-span-12 text-center border-t p-4 border-defaultborder">


                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="ti-btn ti-btn-primary !font-medium m-1"
                                            
                                        >
                                            Submit
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
                    message={`Are you sure you want to delete this catagory?`}
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

export default CategoryMaster;
