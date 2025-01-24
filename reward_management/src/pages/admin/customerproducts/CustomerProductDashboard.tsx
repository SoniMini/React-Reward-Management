import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import Pageheader from "../../../components/common/pageheader/pageheader";
import TableBoxComponent from "../../../components/ui/tables/tableboxheader";
import SuccessAlert from "../../../components/ui/alerts/SuccessAlert";
import DangerAlert from "../../../components/ui/alerts/DangerAlert";
import TableComponent from '../../../components/ui/tables/tablecompnent';
import {useNavigate } from "react-router-dom";

interface CustomerProduct {
    name: string,
    product_category: string,
    category_name:string;
    product_sub_category: string,
    sub_category_name:string;
    product_name: string,
    product_url: string,
    product_image:  string,
}

const CustomerProductMaster: React.FC = () => {
    const navigate = useNavigate(); // Hook for navigation
    const [productData, setProductData] = useState<CustomerProduct[]>([]);
    const [filteredData, setFilteredData] = useState<CustomerProduct[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<CustomerProduct | null>(null);
    const [error, setError] = useState(""); // Added state for error handling
  
    // Fetch data from API
    useEffect(() => {
        document.title = 'Customer Product Master';
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/method/reward_management_app.api.customer_product_master.get_customer_products');
                const productData = response.data.message.data;

                console.log("Fetched Products:", productData);

                if (response.data.message.status === 'success') {
                    if (Array.isArray(productData) && productData.length > 0) {
                        setProductData(productData);
                        setFilteredData(productData);
                    } else {
                        setError('No products available.');
                    }
                } else {
                    setError('API returned an error status.');
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch products.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert]);

    // Handle search filtering
    useEffect(() => {
        const filtered = productData.filter((product) => {
            const query = searchQuery.toLowerCase();
            return (
                product.product_name?.toLowerCase().includes(query) ||
                product.product_category?.toLowerCase().includes(query) ||
                product.product_sub_category?.toString().includes(query) // Convert points to string for comparison
            );
        });
        setFilteredData(filtered);
    }, [searchQuery, productData]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleSearch = (value: string) => setSearchQuery(value);

    // Edit Product - navigate to edit page
    const handleEditProduct = (item: CustomerProduct) => {
        const ProductId = item.name.replace(/\s+/g, '_'); // Ensure unique URL format
        navigate(`/edit-customer-product/${ProductId}`);
    };

    // Delete Product - confirm delete
    const handleDeleteProduct = (item: CustomerProduct) => {
        setProductToDelete(item);
        setIsConfirmDeleteModalOpen(true);
    };

    const confirmDelete = async () => {

        if (productToDelete) {
            try {
                const response = await fetch(`/api/resource/Customer Product Master/${productToDelete.name}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
    
                if (!response.ok) {
                    setIsConfirmDeleteModalOpen(false);
                    // Check if the status is 417 or other errors
                    const errorData = await response.json();
                    console.error("Error: ", errorData);
    
                    // Show the error message from the response in the alert
                    setAlertTitle("Error");
                    setAlertMessage(errorData.exception || 'Failed to delete product');
                    setShowSuccessAlert(true);
                    return; // exit early if there was an error
                }
    
                // Handle success case
                setAlertTitle("Success");
                setAlertMessage("Product deleted successfully!");
                setShowSuccessAlert(true);
                setProductData(productData.filter((product) => product.name !== productToDelete.name));
                setIsConfirmDeleteModalOpen(false);
    
            } catch (error) {
                // Handle network or unexpected errors
                console.error("Error deleting product:", error);
                setAlertTitle("Error");
                setAlertMessage('Error deleting product: ' + error.message);
                setShowSuccessAlert(true);
            }
        }
    };

    const cancelDelete = () => {
        setIsConfirmDeleteModalOpen(false);
        setProductToDelete(null);
    };

    return (
        <Fragment>
            <Pageheader currentpage="Customer Product Master" activepage="/customer-product-master" activepagename="Customer Product Master" />
            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <TableBoxComponent
                        title="Customer Products"
                        onSearch={handleSearch}
                        buttonText="Add Product"
                        showButton={true}
                        onAddButtonClick={() => navigate("/add-customer-product")}
                    />

                    <div className="box-body m-5">
                        <TableComponent<CustomerProduct>
                            columns={[
                                { header: 'Product ID', accessor: 'name' },
                                { header: 'Product Name', accessor: 'product_name' },
                                { header: 'Category', accessor: 'category_name' },
                                { header: 'Sub Category', accessor: 'sub_category_name' },
                            ]}
                            data={filteredData || []}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            handlePrevPage={handlePrevPage}
                            handleNextPage={handleNextPage}
                            handlePageChange={handlePageChange}
                            showProductQR={false}
                            showEdit={true}
                            onEdit={handleEditProduct}
                            showDelete={true}
                            onDelete={handleDeleteProduct}
                            editHeader='Action'
                            columnStyles={{
                                'Product ID': 'text-[var(--primaries)] font-semibold',
                            }}
                        />
                    </div>
                </div>
            </div>
            {/* Modals and Alerts */}
            {showSuccessAlert && 
            <SuccessAlert 
                title={alertTitle}
                message={alertMessage} showButton={false}
                showCancleButton={false}
                showCollectButton={false}
                showAnotherButton={false}
                showMessagesecond={false} 
                onClose={() => setShowSuccessAlert(false)} 
                onCancel={() => setShowSuccessAlert(false)} 
            />
            }
            {isConfirmDeleteModalOpen && (
                <DangerAlert
                    type="danger"
                    message="Are you sure you want to delete this product?"
                    onConfirm={confirmDelete}
                    onDismiss={cancelDelete}
                />
            )}
        </Fragment>
    );
};

export default CustomerProductMaster;
