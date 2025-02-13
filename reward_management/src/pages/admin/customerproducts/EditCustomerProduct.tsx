import React, { useState, useEffect } from 'react';
import Pageheader from '../../../components/common/pageheader/pageheader';
import { useNavigate, useLocation } from "react-router-dom";
import 'suneditor/dist/css/suneditor.min.css';
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import axios from 'axios';
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

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
    const [productID, setProductID] = useState('');
    const [productName, setProductName] = useState('');
    const [productCategory, setProductCategory] = useState<{ category_name: string; id: number }[]>([]);
    const [productSubcategory, setProductSubcategory] = useState<{ sub_category_name: string; id: number }[]>([]);
    const [productUrl, setProductUrl] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [existingImages, setExistingImages] = useState<{ url: string, name: string }[]>([]);

    // const [error, setError] = useState('');
    const notyf = new Notyf({
        position: {
            x: "right",
            y: "top",
        },
        duration: 5000,
    })
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
        let ProductId = pathSegments[pathSegments.length - 1];
        ProductId = ProductId.replace(/_/g, ' ');
        console.log("Product Name:", ProductId);


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
                            product.name.toLowerCase() === ProductId?.toLowerCase()
                    );

                    if (matchedProduct) {
                        console.log("matched gift", matchedProduct);
                        setProductID(matchedProduct.name);
                        setProductName(matchedProduct.product_name);
                        setProductCategory(matchedProduct.category_name);
                        setProductSubcategory(matchedProduct.sub_category_name);
                        setProductUrl(matchedProduct.product_url);

                        // console.log("Matched Product Category:", matchedProduct.category_name); // Log for debugging
                        // console.log("Category Options:", productCategoryData);

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
    }, [showSuccessAlert, navigate, location, productCategoryData]);

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
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = ''; // Reset the input value
        }
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
                notyf.error('File URL not found in response:');

                console.error('File URL not found in response:', response.data);
                return null;
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            return null;
        }
    };

    // Handle form submission
    // const handleSubmit = async (event: React.FormEvent) => {
    //     event.preventDefault();

    //     // Check if a file is selected
    //     if (!file) {
    //         notyf.error('Please upload an image!');

    //         // setError('Please upload an image!');
    //         return;
    //     }

    //     try {
    //         // Upload the file and get the URL
    //         const fileURL = await uploadFile(file);
    //         if (!fileURL) {
    //             notyf.error('File upload failed. Please try again.');

    //             // setError('File upload failed. Please try again.');
    //             return;
    //         }


    //         // Find the selected subcategory by matching sub_category_name
    //         const selectedSubCategory = productSubCategoryData.find(
    //             (subcategory) => subcategory.sub_category_name === productSubcategory
    //         );

    //         // Extract the subcategory name
    //         const subCategoryName = selectedSubCategory ? selectedSubCategory.name : null;




    //         // Find the selected category by matching sub_category_name
    //         const selectedCategory = productCategoryData.find(
    //             (category) => category.category_name === productCategory
    //         );

    //         // Extract the category name
    //         const productCategoryName = selectedCategory ? selectedCategory.name : null;


    //         // Prepare data for the API call
    //         const productData = {
    //             new_image_url: fileURL,
    //             productID: productID,
    //             productName: productName,
    //             productCategoryName: productCategoryName,
    //             productCategory: productCategory,
    //             subCategoryName: subCategoryName,
    //             productSubcategory: productSubcategory,
    //             productUrl: productUrl
    //         };

    //         // Make the API call to add a new product
    //         const response = await axios.put(
    //             '/api/method/reward_management_app.api.customer_product_master.update_customer_product',
    //             productData
    //         );

    //         // Handle the response
    //         if (response.status === 200) {
    //             setShowSuccessAlert(true);
    //             resetForm();
    //         } else {
    //             notyf.error('Failed to add the product. Please try again.');

    //             // setError('Failed to add the product. Please try again.');
    //         }
    //     } catch (err) {
    //         notyf.error('Something went wrong. Please try again later.');

    //         // setError('Something went wrong. Please try again later.');
    //         console.error('Error:', err);
    //     }
    // };
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // If no file is selected, use the old image URL
        let fileURL = '';

        // Check if a file is selected
        if (file) {
            // If a new file is selected, upload it and get the URL
            try {
                fileURL = await uploadFile(file);
                if (!fileURL) {
                    notyf.error('File upload failed. Please try again.');
                    return;
                }
            } catch (err) {
                notyf.error('Something went wrong during file upload. Please try again later.');
                console.error('Error:', err);
                return;
            }
        } else if (existingImages.length > 0) {
            // If no new file is selected, use the existing image URL
            fileURL = existingImages[0].url;
        } else {
            notyf.error('Please upload an image or ensure there is an existing image.');
            return;
        }

        // Find the selected subcategory by matching sub_category_name
        const selectedSubCategory = productSubCategoryData.find(
            (subcategory) => subcategory.sub_category_name === productSubcategory
        );

        // Extract the subcategory name
        const subCategoryName = selectedSubCategory ? selectedSubCategory.name : null;

        // Find the selected category by matching category_name
        const selectedCategory = productCategoryData.find(
            (category) => category.category_name === productCategory
        );

        // Extract the category name
        const productCategoryName = selectedCategory ? selectedCategory.name : null;

        // Prepare data for the API call
        const productData = {
            new_image_url: fileURL,
            productID: productID,
            productName: productName,
            productCategoryName: productCategoryName,
            productCategory: productCategory,
            subCategoryName: subCategoryName,
            productSubcategory: productSubcategory,
            productUrl: productUrl
        };

        // Make the API call to update the product
        try {
            const response = await axios.put(
                '/api/method/reward_management_app.api.customer_product_master.update_customer_product',
                productData
            );

            // Handle the response
            if (response.status === 200) {
                setShowSuccessAlert(true);
                resetForm();
            } else {
                notyf.error('Failed to update the product. Please try again.');
            }
        } catch (err) {
            notyf.error('Something went wrong. Please try again later.');
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

                                            {/* product id */}
                                            <div className="xl:col-span-12 col-span-12">
                                                <label htmlFor="product-id-add" className="form-label text-sm font-semibold text-defaulttextcolor">Product ID</label>
                                                <input
                                                    type="text"
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem] mt-2"
                                                    id="product-id-add"
                                                    placeholder="Product Id"
                                                    value={productID}
                                                    onChange={(e) => setProductID(e.target.value)}
                                                    readOnly

                                                />
                                            </div>
                                            {/* end of id */}
                                            {/* product category start */}
                                            <div className="xl:col-span-12 col-span-12">
                                                <label htmlFor="product-category" className="form-label text-sm font-semibold text-defaulttextcolor">Product Category</label>
                                                <select
                                                    id="product-category"
                                                    name="product-category"
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] w-full border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem] mt-2"
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
                                            {/* end of product category */}
                                           
                                              {/* image */}
                                              <div className="xl:col-span-12 col-span-12 ">
                                                <label htmlFor="file-upload" className="block text-sm font-semibold text-defaulttextcolor">Product Image</label>
                                                <input
                                                    type="file"
                                                    id="file-upload"
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] mt-1 block w-full p-2 border rounded-[0.5rem]"

                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                />
                                                {/* {error && <p className="text-red-500 text-sm mt-1">{error}</p>} */}
                                            </div>
                                            {fileDetails && (
                                                <div className="my-2 xl:col-span-12 col-span-12 flex justify-center items-center relative">

                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveImage}
                                                        className="absolute top-2 right-2 text-primary opacity-100 group-hover:opacity-100 transition"
                                                    >
                                                        <i className="ri-close-line text-primary text-lg font-bold "></i>
                                                    </button>
                                                    <div className=" w-full aspect-square">
                                                        <img
                                                            src={fileDetails.url}
                                                            alt={fileDetails.name}
                                                            className="object-fill w-full aspect-square"
                                                        />
                                                    </div>
                                                    {/* <div className='flex justify-center items-center'>
                                                        <img
                                                            src={fileDetails.url}
                                                            alt={fileDetails.name}
                                                            className=" object-contain"
                                                        />
                                                    </div> */}




                                                </div>
                                            )}
                                             {/* preview */}
                                        <div className="flex justify-center items-center mt-4 pb-3 xl:col-span-12 col-span-12">
                                            {existingImages.length > 0 && (
                                                <div>

                                                    
                                                        {existingImages.map((image, index) => (

                                                            
                                                            
                                                            <div key={index} className="relative  w-full aspect-square">
                                                                <img
                                                                    src={image.url}
                                                                    alt={image.name}
                                                                    className="object-fill w-full aspect-square"
                                                                />
                                                                {/* <p className="text-sm text-center mt-1">{image.name}</p> */}
                                                            </div>
                                                            
                                                        ))}
                                                    </div>
                                            )}
                                        </div>
                                          
                                        </div>
                                       
                                    </div>
                                    {/* end image */}
                                    {/* category */}

                                    <div className="xxl:col-span-6 xl:col-span-12 lg:col-span-12 md:col-span-6 col-span-12 gap-4">
                                        <div className="grid grid-cols-12 gap-4">
                                             {/* product name */}
                                             <div className="xl:col-span-12 col-span-12">
                                                <label htmlFor="product-name-add" className="form-label text-sm font-semibold text-defaulttextcolor">Product Name</label>
                                                <input
                                                    type="text"
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem] mt-2"
                                                    id="product-name-add"
                                                    placeholder="Name"
                                                    value={productName}
                                                    onChange={(e) => setProductName(e.target.value)}

                                                />
                                            </div>
                                            {/* end of product name */}

                                             {/* product subcategory  */}
                                             <div className="xl:col-span-12 col-span-12">
                                                <label htmlFor="product-sub-category" className="form-label text-sm font-semibold text-defaulttextcolor">Product Sub Category</label>
                                                <select
                                                    id="product-sub-category"
                                                    name="product-sub-category"
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] w-full border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem]"
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
                                            {/* end of sub category */}
                                          
                                            
                                            <div className="xl:col-span-12 col-span-12 ">
                                                <label htmlFor="product-url" className="form-label text-sm font-semibold text-defaulttextcolor">Product Url</label>
                                                <input
                                                    type="text"
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
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

                                    <button
                                        type="submit"
                                        className="ti-btn ti-btn-primary !font-medium m-1">
                                        Edit Product<i className="bi bi-plus-lg ms-2"></i>
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
                    message="Product Update successfully!"
                    onClose={() => { }}
                    onCancel={() => { }}
                />
            )}        </>
    );
};

export default EditCustomerProduct;
