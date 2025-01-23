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


interface Product {
  product_image: string;
  name: string;
  project_link: string;
}

const CustomerProducts = () => {
  // const [fullScreen, setFullScreen] = useState(false);
  const [newLaunch, setNewLaunch] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [category, setCategory] = useState<any[]>([]);
  // const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [subcategory, setSubcategory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [productsData, setProductsData] = useState<Product[]>([]);

  const carpenterrole = localStorage.getItem('carpenterrole');
  console.log(carpenterrole);


  useEffect(() => {
    document.title = 'Category Products';
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/method/reward_management_app.api.projects.get_project`
        );

        console.log("Project Response:", response.data);

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
        const subcategoryResponse = await axios.get(`/api/method/reward_management_app.api.product_category.get_product_categories`);
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



  const newLunchHandle = () => {
    if (url) {
      window.location.href = url;
    } else {
      console.log("URL not available");
    }
  };

  //   // Show loading spinner if loading
  //   if (loading) {
  //     return <div className="loading">Loading...</div>;
  // }


  return (
    <Fragment>

      <div><CustomerHeader /></div>


      <div className="lg:mx-20 md:mx-10 mx-5 ">
        <div className='my-5'>
          <Pageheader
            currentpage={"Customer Products"}
            activepage={"/customer-product"}
            activepagename="Customer Products"

          />
        </div>

        <div className="grid grid-cols-12 gap-x-6">
          <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 md:col-span-12 col-span-12">
            <div className="grid grid-cols-12 gap-x-6">
              {productsData.map((product, index) => (
                <div
                  className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12"
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

        <div className='p-3 font-bold text-lg uppercase flex justify-center w-full max-w-xl mx-auto border-none'>
          <button className="uppercase ti-btn new-launch border-none text-white font-semibold w-1/2" onClick={newLunchHandle}>  {newLaunch}</button>

        </div>


        {/* Render categories with their subcategories */}
        <div className="mt-6 flex justify-center flex-col">
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
                          <Link to={`/sub-category-product/${sub.sub_category_name.replace(" ", '_')}`} className="block">
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
