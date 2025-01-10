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

const CustomerProducts = () => {
  const [fullScreen, setFullScreen] = useState(false);
  const [newLaunch, setNewLaunch] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [category, setCategory] = useState<any[]>([]); // Holds array of category objects
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [subcategory, setSubcategory] = useState<any[]>([]); // Holds array of subcategory objects
  const [loading, setLoading] = useState(false); // Manage loading state

  interface Product {
    product_image: string;
    name: string;
  }

  const [productsData, setProductsData] = useState<Product[]>([]);

  useEffect(() => {
    document.title = 'Category Products';
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/method/reward_management_app.api.projects.get_project`
        );

        console.log("API Response:", response.data);

        const images = Array.isArray(response.data.message.project_image)
          ? response.data.message.project_image
          : [];

        setProductsData(images.map((image: string) => ({ product_image: image, name: '' })));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchnewlaunch = async () => {
      try {
        const response = await axios.get(
          `/api/method/reward_management_app.api.new_launch.get_new_launch`
        );
        console.log("new launch Response:", response.data);
        setNewLaunch(response.data.message.launch_name);
        setUrl(response.data.message.url);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch category and subcategory data
    const fetchCategoryAndSubCategory = async () => {
      try {
        setLoading(true); // Start loading


        // Fetch subcategory data
        const subcategoryResponse = await axios.get(`/api/method/reward_management_app.api.product_category.get_product_category`);
        console.log("Subcategory Response:", subcategoryResponse);
        if (subcategoryResponse.data.message.success) {
          // Set categories and subcategories
          setCategory(subcategoryResponse.data.message.categories);
          setSubcategory(subcategoryResponse.data.message.subcategories);
        }


      } catch (error) {
        console.error("Error fetching category and subcategory data:", error);
        setLoading(false); // End loading
      }
    };

    fetchnewlaunch();
    fetchData();
    fetchCategoryAndSubCategory();
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

  const newLunchHandle = () => {
    if (url) {
      window.location.href = url;
    } else {
      console.log("URL not available");
    }
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
            <div className="grid grid-cols-12 gap-x-6">
              {productsData.map((product, index) => (
                <div
                  className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12"
                  key={index}
                >
                  <div className="box product-card">
                    <div className="box-body">
                      <Link to="#" className="product-image">
                        <img
                          src={product.product_image}
                          className="card-img mb-3 rounded-[5px] h-[500px]"
                          alt={`Product ${index}`}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* <div className='mt-6 flex justify-center'>
          <button className='ti-btn bg-primary text-white px-6 py-2 rounded-[20px] w-[50%]' onClick={newLunchHandle}> {newLaunch}</button>
        </div> */}
                        <div className='p-3 font-bold text-lg uppercase flex justify-center w-full max-w-xl mx-auto'>
  <button className="uppercase ti-btn ti-btn-primary font-semibold w-1/2" onClick={newLunchHandle}>  {newLaunch}</button>

</div>


        {/* Render categories with their subcategories */}
        <div className="mt-6 flex justify-center flex-col items-center">
          <div className="categories-list ">
            {category.map((cat) => (
              <div key={cat.category_id} className="category-item mt-6">
                <h3 className='mb-4 text-center text-defaulttextcolor text-md font-semibold'>{cat.category_name}</h3>
                <div className='bg-white border-defaultborder rounded-[10px] shadow-lg p-5'>


                  <div className="subcategory-list flex flex-row gap-6 items-center flex-wrap ">
                    {subcategory
                      .filter(sub => sub.category_id === cat.category_id)
                      .map((sub) => (
                        <div
                          key={sub.sub_category_name}
                          className="p-3 w-full sm:w-5/12 md:w-4/12 lg:w-3/12 xl:w-2/12 xxl:w-1/12"
                        >
                          <Link to={`/sub-category-product/${sub.sub_category_name.replace(" ", '_')}`}  className="block">
                            <div className="subcategory-item">
                              <div className="text-center">
                                <img
                                  src={sub.sub_category_image}
                                  alt={sub.sub_category_name}
                                  className="rounded-full w-20 h-20 bg-slate-400 shadow-sm mx-auto"
                                />
                              </div>
                              <div className="text-center">{sub.sub_category_name}</div>
                            </div>
                          </Link>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>

      <Modalsearch isOpen={isSearchModalOpen} onClose={handleCloseSearchModal} />
    </Fragment>
  );
};

export default CustomerProducts;
