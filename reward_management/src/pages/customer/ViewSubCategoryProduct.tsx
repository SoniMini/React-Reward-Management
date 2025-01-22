import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/header.css';
import '../../assets/css/style.css';
import '../../assets/css/pages/carpenterproducts.css';
// import Modalsearch from "@/components/common/modalsearch/modalsearch";
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'boxicons/css/boxicons.min.css';
// import sidebarLogo from '../../assets/images/01.png';
import { Link } from 'react-router-dom';
import Header from '../../components/common/header';
import CustomerHeader from '../../components/common/carpenterheader';
import Sidebar from '../../components/common/sidebar';
import Pageheader from '../../components/common/pageheader/pageheader';

const SubCategoryProducts = () => {
    //     const [fullScreen, setFullScreen] = useState(false);
    //     const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [productDetails, setProductDetails] = useState(null);
    const [subCategoryName, setSubCategoryName] = useState(""); // New state for subCategoryName

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

        setSubCategoryName(subCategoryName);


        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`/api/method/reward_management_app.api.customer_category_product.get_customer_product?sub_category_name=${subCategoryName}`);
                console.log("Fetched products:", response.data);
                setProductDetails(response.data.message.products);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        fetchProductDetails();
    }, []);



    return (
        <Fragment>
            {carpenterrole === "Carpenter" ? (
                <div>
                    <Header />
                    <Sidebar isSidebarActive={false} />
                </div>
            ) : (
                <div><CustomerHeader /></div>
            )}

            {carpenterrole === "Carpenter" ? (
                <div className="pl-[16.5rem] px-[1.5rem] bg-body-bg mt-[60px]  ">
                    <div className='my-5 pt-3'>
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

                            {/* <div className='mt-6 bg-primary/30 rounded-[20px] border-defaultborder shadow-sm p-3 text-center font-semibold text-lg uppercase'>
                      {subCategoryName}</div> */}
                            <div className='p-3 font-bold text-lg uppercase flex justify-center w-full max-w-xl mx-auto'>
                                <div className="uppercase ti-btn card-data text-white border-none font-semibold w-1/2">  {subCategoryName}</div>

                            </div>
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-5">
                                {/* Display fetched product details as cards */}
                                {productDetails &&
                                    productDetails.map((product, index) => (
                                        <div
                                            key={index}
                                            className=" overflow-hidden flex flex-col"
                                        >
                                            {/* Product Image */}
                                            <div className="bg-white rounded-[10px] border-defaultborder shadow-lg flex items-center justify-center p-4">
                                                <img
                                                    src={product.product_image}
                                                    alt={product.name}
                                                    className="object-cover h-full w-full rounded-[10px]"
                                                />
                                            </div>

                                            {/* Product Details */}
                                            {/* Product Details */}
                                            <div className="p-4 flex-1 text-center">
                                                <h3 className="text-defaultsize text-defaulttextcolor mb-2">
                                                    <Link
                                                        to={`/view-product-details/${product.name.replace(" ", '_')}`}
                                                        className="text-defaulttextcolor font-medium hover:underline"
                                                    >
                                                        {product.product_name}
                                                    </Link>
                                                </h3>
                                            </div>


                                        </div>
                                    ))}
                            </div>

                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-6 mx-20">
                    <div className="grid grid-cols-12 gap-x-6">
                        <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-8 md:col-span-12 col-span-12">

                            {/* <div className='mt-6 bg-primary/30 rounded-[20px] border-defaultborder shadow-sm p-3 text-center font-semibold text-lg uppercase'>
                            {subCategoryName}</div> */}
                            <div className='p-3 font-bold text-lg uppercase flex justify-center w-full max-w-xl mx-auto'>
                                <div className="uppercase ti-btn card-data text-white border-none font-semibold w-1/2">  {subCategoryName}</div>

                            </div>
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-5">
                                {/* Display fetched product details as cards */}
                                {productDetails &&
                                    productDetails.map((product, index) => (
                                        <div
                                            key={index}
                                            className=" overflow-hidden flex flex-col"
                                        >
                                            {/* Product Image */}
                                            <div className="bg-white rounded-[10px] border-defaultborder shadow-lg flex items-center justify-center p-4">
                                                <img
                                                    src={product.product_image}
                                                    alt={product.name}
                                                    className="object-cover h-full w-full rounded-[10px]"
                                                />
                                            </div>

                                            {/* Product Details */}
                                            {/* Product Details */}
                                            <div className="p-4 flex-1 text-center">
                                                <h3 className="text-defaultsize text-defaulttextcolor mb-2">
                                                    <Link
                                                        to={`/view-product-details/${product.name.replace(" ", '_')}`}
                                                        className="text-defaulttextcolor font-medium hover:underline"
                                                    >
                                                        {product.product_name}
                                                    </Link>
                                                </h3>
                                            </div>


                                        </div>
                                    ))}
                            </div>

                        </div>
                    </div>
                </div>)}



            {/* <Modalsearch isOpen={isSearchModalOpen} onClose={handleCloseSearchModal} /> */}
        </Fragment>
    );
};

export default SubCategoryProducts;
