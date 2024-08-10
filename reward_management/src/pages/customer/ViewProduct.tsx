import { Fragment, useState } from 'react';
import sidebarLogo from '../../assets/images/logo-2.png';
import ecommerceimg15 from "../../assets/images/reward_management/9.jpg";
import Modalsearch from "@/components/common/modalsearch/modalsearch";

const Productdetails = () => {
  const [fullScreen, setFullScreen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

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

      <div className="grid grid-cols-12 gap-6 mt-4 mx-20">
        <div className="xl:col-span-12 col-span-12">
          <div className="box">
            <div className="box-body">
              <div className="sm:grid grid-cols-12 gap-x-6">
                <div className="xxl:col-span-5 xl:col-span-12 col-span-12">
                
                  
                      <div className="bg-light h-full" >
                        <img className="object-cover w-full" src={ecommerceimg15} alt="Product" />
                      
                
                  </div>
                </div>
                <div className="xxl:col-span-7 xl:col-span-12 col-span-12">
                  <div className="md:grid grid-cols-12 gap-x-3">
                    <div className="xl:col-span-12 col-span-12 mt-4">
                      <div className="mb-4">
                        <p className="text-[.9375rem] font-semibold mb-1">Description :</p>
                        <p className="text-[#8c9097] dark:text-white/50 mb-0">
                          Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati accusamus, quaerat nam quo optio reiciendis harum reprehenderit omnis tempora adipisci in iste aperiam unde, repellendus possimus explicabo veritatis? Dignissimos, id.
                        </p>
                      </div>
                      <div className="mb-4">
                        {/* Add additional content or sections here if needed */}
                      </div>
                      <div className="mb-4">
                        <p className="text-[.9375rem] font-semibold mb-2">Product Details :</p>
                        <div className="table-responsive min-w-full">
                          <table className="table table-bordered whitespace-nowrap w-full">
                            <tbody>
                              <tr className="border border-defaultborder dark:border-defaultborder/10">
                                <th scope="row" className="font-semibold text-start">Brand</th>
                                <td>Orange.Inc</td>
                              </tr>
                              <tr className="border border-defaultborder dark:border-defaultborder/10">
                                <th scope="row" className="font-semibold text-start">Model Name</th>
                                <td>Orange watch series 4</td>
                              </tr>
                              <tr className="border border-defaultborder dark:border-defaultborder/10">
                                <th scope="row" className="font-semibold text-start">Color</th>
                                <td>Raging Brass</td>
                              </tr>
                              <tr className="border border-defaultborder dark:border-defaultborder/10">
                                <th scope="row" className="font-semibold text-start">Style</th>
                                <td>GPS</td>
                              </tr>
                              <tr className="border border-defaultborder dark:border-defaultborder/10">
                                <th scope="row" className="font-semibold text-start">Special Features</th>
                                <td>Heart rate sensor, GPS, Wifi calling, AMOLED display, etc.</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modalsearch isOpen={isSearchModalOpen} onClose={handleCloseSearchModal} />
    </Fragment>
  );
};

export default Productdetails;
