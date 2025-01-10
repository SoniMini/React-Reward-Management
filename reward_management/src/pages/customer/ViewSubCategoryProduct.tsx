import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/header.css';
import '../../assets/css/style.css';
import '../../assets/css/pages/carpenterproducts.css';
import Modalsearch from "@/components/common/modalsearch/modalsearch";
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'boxicons/css/boxicons.min.css';
import sidebarLogo from '../../assets/images/01.png';
import { Link } from 'react-router-dom';

const SubCategoryProducts = () => {
    const [fullScreen, setFullScreen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [productDetails, setProductDetails] = useState(null);
    const [subCategoryName, setSubCategoryName] = useState(""); // New state for subCategoryName


    // Extract sub-category product name from URL
    useEffect(() => {
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

    const handleOpenSearchModal = () => {
        setIsSearchModalOpen(true);
    };

    const handleCloseSearchModal = () => {
        setIsSearchModalOpen(false);
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        setFullScreen(!fullScreen);
    };

    return (
        <Fragment>
            <header className="bg-white border border-defaultborder border-b-2">
                <nav className="main-header h-[3.75rem] mx-20">
                    <div className="main-header-container pe-[1rem]">
                        <div className="header-content-left">
                            <div className="header-element md:px-[0.325rem] flex items-center">
                                <img src={sidebarLogo} alt="Sidebar Logo" className="sidebar-logo w-18 h-10" />
                            </div>
                        </div>
                        <div className="header-content-right flex items-center">
                            <div className="header-element py-[1rem] md:px-[0.65rem] px-2 header-search">
                                <button
                                    aria-label="Search"
                                    type="button"
                                    onClick={handleOpenSearchModal}
                                    className="inline-flex flex-shrink-0 justify-center items-center gap-2 rounded-full font-medium focus:ring-offset-0 focus:ring-offset-white transition-all text-xs dark:bg-bgdark dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                                >
                                    <i className="bx bx-search-alt-2 header-link-icon"></i>
                                </button>
                            </div>
                            <div className="header-element py-[1rem] md:px-[0.65rem] px-2">
                                <button className="header-btn" onClick={toggleFullScreen}>
                                    <i className={`header-link-icon bx ${fullScreen ? 'bx-exit-fullscreen' : 'bx-fullscreen'}`}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <div className="mt-6 mx-20">
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-8 md:col-span-12 col-span-12">

                        {/* <div className='mt-6 bg-primary/30 rounded-[20px] border-defaultborder shadow-sm p-3 text-center font-semibold text-lg uppercase'>
                            {subCategoryName}</div> */}
                             <div className='p-3 font-bold text-lg uppercase flex justify-center w-full max-w-xl mx-auto'>
  <div className="uppercase ti-btn ti-btn-primary font-semibold w-1/2">  {subCategoryName}</div>

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

            <Modalsearch isOpen={isSearchModalOpen} onClose={handleCloseSearchModal} />
        </Fragment>
    );
};

export default SubCategoryProducts;
