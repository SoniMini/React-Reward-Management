import { Fragment, useState, useEffect } from 'react';
import sidebarLogo from '../../assets/images/01.png';
import Modalsearch from "@/components/common/modalsearch/modalsearch";

import axios from 'axios';
import { useParams } from 'react-router-dom';
// import { BASE_URL } from "../../utils/constants";

const Productdetails = () => {
  const [fullScreen, setFullScreen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [productName, setProductName] = useState("");


  useEffect(() => {
    document.title = 'Product Details';

    const url = window.location.href;
    console.log("Full URL:", url);

    const pathSegments = window.location.pathname.split('/');

    let productName = pathSegments[pathSegments.length - 1];
    productName = productName.replace(/_/g, ' ');
    console.log("Product Name:", productName);

    setProductName(productName);

    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/api/method/reward_management_app.api.customer_category_product.get_product_details?product_name=${productName}`);
        console.log("data product card", response);
        if (response.data.message.products && response.data.message.products.length > 0) {
          setProductDetails(response.data.message.products[0]);
        } else {
          console.error('No products found in the response');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };


    fetchProductDetails();
  }, [productName]);

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

      <div className="mt-6 mx-20 ">


      <div className='p-3 font-bold text-lg uppercase flex justify-center w-full max-w-xl mx-auto'>
  <div className="uppercase ti-btn ti-btn-primary font-semibold w-1/2">  {productName}</div>

</div>
      {/* <div className="mt-6  ti-btn ti-btn-primary rounded-[10px] font-semibold  shadow-sm p-2  uppercase flex justify-center max-w-xl mx-auto w-1/2">
    {productName}
  </div> */}
        
          {/* Display fetched product details as cards */}
          <div className=" flex justify-center p-5">
            {productDetails ? (
              <div className=" flex flex-col items-center text-center">
                <div className='bg-white rounded-[10px] border-defaultborder shadow-lg p-6'>
                <img
                  src={productDetails.product_image}
                  alt={productDetails.product_name}
                  className="object-cover rounded-[10px]"
                />
                </div>
               
              
              </div>
            ) : (
              <div className="text-center">No product details found</div>
            )}
          

        </div>

<div className=' p-3 font-bold text-lg uppercase flex justify-center w-full max-w-xl mx-auto'>
  <button className="uppercase ti-btn ti-btn-primary font-semibold w-1/2">More Details</button>

</div>
      </div>
      <Modalsearch isOpen={isSearchModalOpen} onClose={handleCloseSearchModal} />
    </Fragment>
  );
};

export default Productdetails;
