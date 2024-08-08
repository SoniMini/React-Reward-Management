import React, { Fragment, useState, useEffect } from 'react';
import Pageheader from '@/components/common/pageheader/pageheader';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import SunEditor styles
import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import axios from 'axios';
import { BASE_URL, API_KEY, API_SECRET } from "../../../utils/constants";
import { useNavigate } from 'react-router-dom';

interface EditProduct {
    product_name?: string;
    productId?: string;
    points?: number;
    product_image?: string; // Add image_urls to your interface
}

const EditProduct: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]); // New state for existing images
    const [productName, setProductName] = useState('');
    const [rewardPoints, setRewardPoints] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product'); // Retrieve productId from URL query parameters

    useEffect(() => {
        const fetchProductData = async () => {
            if (!productId) return;
    
            try {
                const response = await axios.get(`${BASE_URL}/api/method/reward_management_app.api.product_master.get_tableproduct_detail`, {
                    params: {
                        product_id: productId
                    }
                });
    
                console.log("API Response:", response.data);
    
                if (response.data && response.data.message.message) {
                    const product = response.data.message.message;
                    console.log("Product Details:", product);
    
                    setProductName(product.product_name || '');
                    setRewardPoints(product.reward_points || '');
                    setProductDescription(product.discription || '');
                    setProductCategory(product.category || '');
    
                    // Ensure product_image is an array
                    const images = Array.isArray(product.product_image) ? product.product_image : [product.product_image].filter(Boolean);
                    setExistingImages(images);
                } else {
                    console.warn("Product details not found in response.");
                }
            } catch (error) {
                console.error('Error fetching product data:', error);
                const errorMessage = error.response?.data?.message || error.message;
                alert(`Error fetching product data: ${errorMessage}`);
            }
        };
    
        fetchProductData();
    }, [productId]);
    
        
    // Handle file input change
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            const fileArray = Array.from(selectedFiles);
            setFiles(fileArray);

            // Create image previews
            const previewArray = fileArray.map(file => URL.createObjectURL(file));
            setPreviews(previewArray);
        }
    };

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file, file.name);
        formData.append("is_private", "0");
        formData.append("folder", "");
        formData.append("file_name", file.name);

        try {
            const response = await axios.post(`${BASE_URL}/api/method/upload_file`, formData, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                    'X-API-SECRET': API_SECRET,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.message && response.data.message.file_url) {
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

    // Reset all form fields
    const resetForm = () => {
        setFiles([]);
        setPreviews([]);
        setProductName('');
        setRewardPoints('');
        setProductDescription('');
        setProductCategory('');
    };

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const fileUrls = [];

        for (const file of files) {
            const fileUrl = await uploadFile(file);
            if (fileUrl) {
                fileUrls.push(fileUrl);
            }
        }

        // Update product details
        try {
            await axios.put(`${BASE_URL}/api/method/update_product/${productId}`, {
                product_name: productName,
                reward_points: rewardPoints,
                description: productDescription,
                category: productCategory,
                file_urls: [...existingImages, ...fileUrls] // Include existing images and new uploads
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                    'X-API-SECRET': API_SECRET,
                }
            });
            navigate('/product-master'); // Redirect after successful update
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <Fragment>
            <Pageheader currentpage="Edit Product" activepage="Product Master" mainpage="Edit Product" />
            <div className="grid grid-cols-12 gap-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
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
                                                        required
                                                    />
                                                </div>
                                                <div className="xl:col-span-12 col-span-12">
                                                    <label htmlFor="product-cost-add" className="form-label text-sm font-semibold text-defaulttextcolor">Reward Points</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2" 
                                                        id="product-cost-add" 
                                                        placeholder="Reward points" 
                                                        value={rewardPoints}
                                                        onChange={(e) => setRewardPoints(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="xl:col-span-12 col-span-12 mb-4">
                                                    <label className="form-label text-sm font-semibold text-defaulttextcolor">Product Description</label>
                                                    <div id="product-features" className="mt-2">
                                                        <SunEditor 
                                                            setContents={productDescription}
                                                            onChange={setProductDescription}
                                                            setOptions={{
                                                                buttonList: [
                                                                    ['undo', 'redo'],
                                                                    ['formatBlock', 'font', 'fontSize'],
                                                                    ['bold', 'underline', 'italic'],
                                                                    ['fontColor', 'hiliteColor'],
                                                                    ['align', 'list', 'lineHeight'],
                                                                    ['table', 'link'],
                                                                    ['fullScreen', 'showBlocks', 'codeView']
                                                                ]
                                                            }}
                                                            height="200px"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="xxl:col-span-6 xl:col-span-12 lg:col-span-12 md:col-span-6 col-span-12 gap-4">
                                            <div className="xl:col-span-12 col-span-12">
                                                <label htmlFor="product-category-add" className="form-label text-sm font-semibold text-defaulttextcolor">Category</label>
                                                <input 
                                                    id="product-category-add" 
                                                    name="product-category-add" 
                                                    className="w-full border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem] mt-2" 
                                                    placeholder="Category"
                                                    value={productCategory}
                                                    onChange={(e) => setProductCategory(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="xxl:col-span-12 xl:col-span-12 col-span-12 mt-4">
                                                <label htmlFor="product-documents" className="form-label text-sm font-semibold text-defaulttextcolor ">Product Image</label>
                                                <div id="product-documents-container" className="mt-1">
                                                {existingImages.length > 0 && existingImages.map((imageUrl, index)  => (
                                                        <img
                                                            key={`existing-image-${index}`}
                                                            src={imageUrl}
                                                            alt={`Existing Image ${index}`}
                                                            className="w-full h-auto mb-2"
                                                        />
                                                    ))}
                                                    {previews.length > 0 && previews.map((preview, index) => (
                                                        <img
                                                            key={`preview-${index}`}
                                                            src={preview}
                                                            alt={`Preview ${index}`}
                                                            className="w-full h-auto mb-2"
                                                        />
                                                    ))}
                                                </div>
                                                <input
                                                    type="file"
                                                    multiple
                                                    className="form-control w-full p-2 border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem] "
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end">
                                    <button 
                                        type="submit" 
                                        className="ti-btn ti-btn-primary !font-medium m-1">
                                        Edit Product
                                    </button>
                                    <button 
                                        type="button" 
                                        className="ti-btn ti-btn-success bg-defaulttextcolor ti-btn text-white !font-medium m-1"
                                        onClick={resetForm} // Add the onClick event to reset the form
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default EditProduct;
