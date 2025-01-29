import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/header.css';
import '../../assets/css/style.css';
import '../../assets/css/pages/carpenterproducts.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'boxicons/css/boxicons.min.css';
import { Link } from 'react-router-dom';
import CustomerHeader from '../../components/common/carpenterheader';
import Pageheader from '../../components/common/pageheader/pageheader';

// Import Swiper and its styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';

interface Product {
  product_image: string;
  name: string;
  project_link: string;
}

const CustomerProducts = () => {
  const [newLaunch, setNewLaunch] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [category, setCategory] = useState<any[]>([]);
  const [subcategory, setSubcategory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [productsData, setProductsData] = useState<Product[]>([]);

  useEffect(() => {
    document.title = 'Category Products';
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/method/reward_management_app.api.projects.get_project`
        );

        const products = Array.isArray(response.data.message.product)
          ? response.data.message.product
          : [];

        setProductsData(
          products.map((product: any) => ({
            product_image: product.product_image || '',
            product_link: product.product_link || '',
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchnewlaunch = async () => {
      try {
        const response = await axios.get(
          `/api/method/reward_management_app.api.new_launch.get_new_launch`
        );
        setNewLaunch(response.data.message.launch_name);
        setUrl(response.data.message.url);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchCategoryAndSubCategory = async () => {
      try {
        setLoading(true);

        const subcategoryResponse = await axios.get(`/api/method/reward_management_app.api.product_category.get_product_categories`);
        if (subcategoryResponse.data.message.success) {
          setCategory(subcategoryResponse.data.message.categories);
          setSubcategory(subcategoryResponse.data.message.subcategories);
        }

      } catch (error) {
        console.error("Error fetching category and subcategory data:", error);
        setLoading(false);
      }
    };

    fetchnewlaunch();
    fetchData();
    fetchCategoryAndSubCategory();
  }, []);

  const newLunchHandle = () => {
    if (url) {
      window.location.href = url;
    }
  };

  return (
    <Fragment>
      <div><CustomerHeader /></div>

      <div className="lg:mx-20 md:mx-10 mx-5">
        <div className='my-5'>
          <Pageheader
            currentpage={"Customer Products"}
            activepage={"/customer-product"}
            activepagename="Customer Products"
          />
        </div>

        {/* Swiper for products */}
        <div className="my-6">
          <Swiper
            spaceBetween={10}
            slidesPerView={2} 
            loop={productsData.length > 1} 
            autoplay={{ delay: 2000 }} 
            breakpoints={{

              300:{
                slidesPerView: 1,
              },
             
              768: {
                slidesPerView: 2, 
              },
            }}
          >
            {productsData.length > 0 ? (
              productsData.map((product, index) => (
                <SwiperSlide key={index}>
                  <div className="product-card">
                    <div className="box-body">
                      <Link to="#" className="product-image">
                        <img
                          src={product.product_image}
                          className="card-img mb-3 rounded-[5px] md:h-[500px] h-[350px]"
                          alt={`Product ${index}`}
                        />
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div>No products available</div>
              </SwiperSlide>
            )}
          </Swiper>
        </div>

        {/* New launch button */}
        <div className='p-3 font-bold text-lg uppercase flex justify-center w-full max-w-xl mx-auto border-none'>
          <button className="uppercase ti-btn new-launch border-none text-white font-semibold w-1/2" onClick={newLunchHandle}>
            {newLaunch}
          </button>
        </div>

        {/* Render categories with their subcategories */}
        <div className="mt-6 flex justify-center flex-col mb-6">
          <div className="categories-list">
            {category.map((cat) => (
              <div key={cat.category_id} className="category-item mt-6">
                <h3 className='mb-4 text-center text-defaulttextcolor text-md font-semibold'>{cat.category_name}</h3>
                <div className='bg-white border-defaultborder rounded-[10px] shadow-lg p-5'>
                  <div className="subcategory-list flex flex-row gap-6 items-center flex-wrap">
                    {subcategory
                      .filter(sub => sub.category_id === cat.category_id)
                      .map((sub) => (
                        <div
                          key={sub.sub_category_name}
                          className="p-3 w-full sm:w-5/12 md:w-4/12 lg:w-3/12 xl:w-2/12 xxl:w-1/12"
                        >
                          <Link to={`/sub-category-product/${sub.sub_category_id.replace(" ", '_')}`} className="block">
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
    </Fragment>
  );
};

export default CustomerProducts;
