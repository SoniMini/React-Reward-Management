import React, { useState, useEffect } from 'react';
import Pageheader from '../../../components/common/pageheader/pageheader';
import {useNavigate, useLocation } from "react-router-dom";
import 'suneditor/dist/css/suneditor.min.css';
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import axios from 'axios';

interface ProductCategory {
    name: string,
    category_name: string
}

interface ProductSubCategory {
    name: string,
    category: string,
    sub_category_name: string
}

const EditCustomerProduct: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileDetails, setFileDetails] = useState<{ url: string, name: string } | null>(null);
    const [productName, setProductName] = useState('');
    const [productCategory, setProductCategory] = useState<{ category_name: string; id: number }[]>([]);
    const [productSubcategory, setProductSubcategory] = useState<{ sub_category_name: string; id: number }[]>([]);
    const [productUrl, setProductUrl] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [existingImages, setExistingImages] = useState<{ url: string, name: string }[]>([]);

    const [error, setError] = useState('');
    const navigate = useNavigate();


    const location = useLocation();


    const resetForm = () => {
        window.location.reload();

    };

    // Fetch the product categories
    const { data: productCategoryData, error: categoryError } = useFrappeGetDocList<ProductCategory>('Product Category', {
        fields: ['name', 'category_name']
    });

    // Fetch the product subcategories
    const { data: productSubCategoryData, error: subCategoryError } = useFrappeGetDocList<ProductSubCategory>('Product Sub Category', {
        fields: ['name', 'category', 'sub_category_name']
    });

    useEffect(() => {
        document.title = 'Edit Customer Product';

         // Extract gift product ID from pathname
         const pathSegments = location.pathname.split('/');
         const ProductId = pathSegments[pathSegments.length - 1];


           // console.log("Extracted Product ID:", ProductId);
           const fetchProducts = async () => {
            try {
                const response = await axios.get(
                    `/api/method/reward_management_app.api.customer_product_master.get_customer_products?url_name=${ProductId}`
                );
                const productData = response.data.message?.data;
        
                if (response.data.message?.status === "success" && productData) {
                    const matchedProduct = productData.find(
                        (product: { name: string }) =>
                            product.name
                                .replace(/\s+/g, "%20")
                                .toLowerCase() === ProductId?.toLowerCase()
                    );
        
                    if (matchedProduct) {
                        console.log("matched gift", matchedProduct);
                        setProductName(matchedProduct.product_name);
                        setProductCategory(matchedProduct.product_category);
                        setProductSubcategory(matchedProduct.product_sub_category);
                        setProductUrl(matchedProduct.product_url);
        
                        // Handle product_image as a string or an array
                        if (Array.isArray(matchedProduct.product_image)) {
                            const imageDetails = matchedProduct.product_image.map((image: { product_image: string }) => ({
                                url: image.product_image,
                                name: image.product_image.split('/').pop() || ''
                            }));
                            setExistingImages(imageDetails);
                        } else if (typeof matchedProduct.product_image === 'string') {
                            setExistingImages([
                                {
                                    url: matchedProduct.product_image,
                                    name: matchedProduct.product_image.split('/').pop() || '',
                                },
                            ]);
                        }
                    } else {
                        console.error("No matching product found.");
                    }
                } else {
                    console.error("Failed to fetch product data.");
                }
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };
        

        if (ProductId) {
            fetchProducts();
        } else {
            console.error("Product ID is missing.");
        }

        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                navigate('/customer-product-master');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert, navigate,location]);

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = (event) => {
                setFileDetails({
                    url: event.target?.result as string,
                    name: selectedFile.name
                });
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    // Handle file removal
    const handleRemoveImage = () => {
        setFile(null);
        setFileDetails(null);
    };

    // Upload file function
  // Upload file function
  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('is_private', '0');
    formData.append('folder', '');
    formData.append('file_name', file.name);

    try {
        const response = await axios.post('/api/method/upload_file', formData, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.message?.file_url) {
            return response.data.message.file_url;
        } else {
            console.error('File URL not found in response:', response.data);
            return null;
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        return null;
    }
};

// Handle form submission
const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if a file is selected
    if (!file) {
        setError('Please upload an image!');
        return;
    }

    try {
        // Upload the file and get the URL
        const fileURL = await uploadFile(file);
        if (!fileURL) {
            setError('File upload failed. Please try again.');
            return;
        }

        // Prepare data for the API call
        const productData = {
            new_image_url: fileURL,
            productName: productName,
            productCategory: productCategory,
            productSubcategory: productSubcategory,
            productUrl: productUrl
        };

        // Make the API call to add a new product
        const response = await axios.put(
            '/api/method/reward_management_app.api.customer_product_master.update_customer_product',
            productData
        );

        // Handle the response
        if (response.status === 200) {
            setShowSuccessAlert(true);
            resetForm(); // Reset the form after successful submission
        } else {
            setError('Failed to add the product. Please try again.');
        }
    } catch (err) {
        setError('Something went wrong. Please try again later.');
        console.error('Error:', err);
    }
};


    return (
        <>
            <Pageheader
                currentpage="Edit Customer Product"
                activepage="/customer-product-master"
                mainpage="/edit-customer-product"
                activepagename="Customer Product Master"
                mainpagename="Edit Customer Product"
            />
            <div className="grid grid-cols-12 gap-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box-body add-products !p-0">
                        <form onSubmit={handleSubmit}>
                            <div className="p-6">
                                <div className="grid grid-cols-12 md:gap-x-[3rem] gap-0">
                                    <div className="xxl:col-span-6 xl:col-span-12 lg:col-span-12 md:col-span-6 col-span-12">
                                        <div className="grid grid-cols-12 gap-4">
                                            <div className="xl:col-span-12 col-span-12">
                                                <label htmlFor="product-name-add" className="form-label text-sm font-semibold text-defaulttextcolor">Product Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control w-full border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem] mt-2"
                                                    id="product-name-add"
                                                    placeholder="Name"
                                                    value={productName}
                                                    onChange={(e) => setProductName(e.target.value)}
                                                    readOnly
                                                />
                                            </div>
                                            
                                            <div className="xl:col-span-12 col-span-12">
                                                <label htmlFor="product-sub-category" className="form-label text-sm font-semibold text-defaulttextcolor">Product Sub Category</label>
                                                <select
                                                    id="product-sub-category"
                                                    name="product-sub-category"
                                                    className="w-full border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem]"
                                                    value={productSubcategory}
                                                    onChange={(e) => setProductSubcategory(e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select a sub category</option>
                                                    {productSubCategoryData && productSubCategoryData.map((subcategory) => (
                                                        <option key={subcategory.name} value={subcategory.sub_category_name}>
                                                            {subcategory.sub_category_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                          
                                            <div className="xl:col-span-12 col-span-12">
                                                <label htmlFor="file-upload" className="block text-sm font-semibold text-defaulttextcolor">Product Image</label>
                                                <input
                                                    type="file"
                                                    id="file-upload"
                                                    className="mt-1 block w-full p-2 border rounded-md"
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                />
                                                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                                            </div>
                                            {fileDetails && (
                                                <div className="my-2">

                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveImage}
                                                        className="text-primary opacity-1 group-hover:opacity-100 transition"
                                                    >
                                                        <i className="ri-close-line text-primary text-lg font-bold "></i>
                                                    </button>

                                                    <img
                                                        src={fileDetails.url}
                                                        alt={fileDetails.name}
                                                        className=" object-contain rounded-md"
                                                    />


                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-12 mt-4 pb-3">
                                                {existingImages.length > 0 && (
                                                    <div>
                                                       
                                                        <div className="grid grid-cols-4 gap-4 mt-2">
                                                            {existingImages.map((image, index) => (
                                                                <div key={index} className="relative">
                                                                    <img
                                                                        src={image.url}
                                                                        alt={image.name}
                                                                        className="max-w-full h-auto border border-defaultborder rounded-md"
                                                                    />
                                                                    <p className="text-sm text-center mt-1">{image.name}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                    </div>

                                    <div className="xxl:col-span-6 xl:col-span-12 lg:col-span-12 md:col-span-6 col-span-12 gap-4">
                                    <div className="grid grid-cols-12 gap-4">
                                    <div className="xl:col-span-12 col-span-12">
                                                <label htmlFor="product-category-add" className="form-label text-sm font-semibold text-defaulttextcolor">Product Category</label>
                                                <select
                                                    id="product-category-add"
                                                    name="product-category-add"
                                                    className="w-full border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem]"
                                                    value={productCategory}
                                                    onChange={(e) => setProductCategory(e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select a category</option>
                                                    {productCategoryData && productCategoryData.map((category) => (
                                                        <option key={category.name} value={category.category_name}>
                                                            {category.category_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="xl:col-span-12 col-span-12 ">
                                                <label htmlFor="product-url" className="form-label text-sm font-semibold text-defaulttextcolor">Product Url</label>
                                                <input
                                                    type="text"
                                                    className="form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
                                                    id="product-url"
                                                    placeholder="Product URL"
                                                    value={productUrl}
                                                    onChange={(e) => setProductUrl(e.target.value)}
                                                />
                                            </div>

                                        </div>
                                        </div>

                                </div>
                                <div className="px-6 py-4 border-t dark:border-defaultborder sm:flex justify-end">
                                    {/* <button type="submit" className="ti-btn ti-btn-primary-full bg-primary me-2">
                                        Add <i className="bi bi-plus-lg ms-2"></i>
                                    </button> */}
                                    <button
                                        type="submit"
                                        className="ti-btn ti-btn-primary !font-medium m-1">
                                        Add Product<i className="bi bi-plus-lg ms-2"></i>
                                    </button>
                                    <button
                                        type="button"
                                        className="ti-btn ti-btn-success bg-defaulttextcolor ti-btn text-white !font-medium m-1"
                                        onClick={resetForm}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {showSuccessAlert && (
                <SuccessAlert
                    showButton={false}
                    showCancleButton={false}
                    showCollectButton={false}
                    showAnotherButton={false}
                    showMessagesecond={false}
                    message="New Product Added successfully!"
                    onClose={() => { }}
                    onCancel={() => { }}
                />
            )}        </>
    );
};

export default EditCustomerProduct;