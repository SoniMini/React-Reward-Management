import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/style.css';
import '../../assets/css/pages/carpenterproducts.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'boxicons/css/boxicons.min.css';
import { Link } from 'react-router-dom';
import CustomerHeader from '../../components/common/carpenterheader';
import Pageheader from '../../components/common/pageheader/pageheader';
import { error } from 'console';

const SubCategoryProducts = () => {

    const [productDetails, setProductDetails] = useState(null);
    // const [subCategoryName, setSubCategoryName] = useState(""); 
    const [subCategory, setSubCategory] = useState("");
    const carpenterrole = localStorage.getItem('carpenterrole');
    console.log(carpenterrole);


    // Extract sub-category product name from URL
    useEffect(() => {
        document.title = 'Sub Category Products';
        const url = window.location.href;
        console.log("Full URL:", url);

        const pathSegments = window.location.pathname.split('/');

        let subCategoryName = pathSegments[pathSegments.length - 1];
        subCategoryName = subCategoryName.replace(/_/g, ' ');
        console.log("Sub-Category Product Name:", subCategoryName);

        // setSubCategoryName(subCategoryName);

        const fetchSubCategory = async () => {
            try {
                const response = await axios.get(`/api/resource/Product Sub Category?filters=[["name","=","${subCategoryName}"]]&fields=["name","sub_category_name","category","category_name"]`);
                console.log("Fetched Subcategory Details:", response.data);
                if (response.data && response.data.data.length > 0) {
                    const subCategory = response.data.data[0].sub_category_name;
                    setSubCategory(subCategory);
                } else {
                    console.error("No data found for the specified subcategory name.");
                    setSubCategory("No Subcategory Found");
                }

            } catch (error) {
                console.error("Error fetching subcategory details:", error);
            }
        };

        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`/api/method/reward_management_app.api.customer_category_product.get_customer_product?sub_category_name=${subCategoryName}`);
                console.log("Fetched products:", response.data);
                if (response.data && response.data.message.success === true) {
                    const products = response.data.message.products;
                    setProductDetails(products);
                } else {
                    const message = response.data.message.message;

                    setProductDetails(message);
                }

            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        fetchSubCategory();


        fetchProductDetails();
    }, []);



    return (
        <Fragment>

            <div><CustomerHeader /></div>
            <div className="lg:mx-20 md:mx-10 mx-5 ">
                <div className='my-5'>
                    <Pageheader
                        currentpage={"Product Category"}
                        activepage={"/customer-product"}
                        mainpage={"/sub-category-product/:productName"}
                        activepagename='Customer Products'
                        mainpagename='Product Category'
                    />
                </div>

                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-8 md:col-span-12 col-span-12">

                        <div className='p-3 font-bold text-lg uppercase flex justify-center w-full max-w-xl mx-auto'>
                            <div className="uppercase ti-btn card-data text-white border-none font-semibold w-1/2"> {subCategory}</div>

                        </div>
                        {Array.isArray(productDetails) && productDetails.length > 0 ? (
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-5">
                                {/* Display fetched product details as cards */}
                                {productDetails.map((product, index) => (
                                    <div
                                        key={index}
                                        className="overflow-hidden flex flex-col"
                                    >
                                        {/* Product Image */}
                                        <div className="bg-white rounded-[10px] border-defaultborder shadow-lg flex items-center justify-center p-4 aspect-square">
                                            <img
                                                src={product.product_image}
                                                alt={product.product_name}
                                                className="object-cover  w-full h-full rounded-[10px] "
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="p-4 flex-1 text-center">
                                            <h3 className="text-defaultsize text-defaulttextcolor mb-2">
                                                <Link
                                                    to={`/view-product-details/${product.name.replace(/ /g, '_')}`}
                                                    className="text-defaulttextcolor font-medium hover:underline"
                                                >
                                                    {product.product_name}
                                                </Link>
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 flex justify-center items-center">
                                No products available.
                            </div>
                        )}


                    </div>
                </div>
            </div>


        </Fragment>
    );
};

export default SubCategoryProducts;
