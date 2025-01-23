import { Fragment, useState, useEffect } from 'react';

// import Header from  '../../components/common/header';
import CustomerHeader from '../../components/common/carpenterheader';
// import Sidebar from '../../components/common/sidebar';
import axios from 'axios';
import Pageheader from '../../components/common/pageheader/pageheader';


const Productdetails = () => {

  const [productDetails, setProductDetails] = useState(null);
  const [productName, setProductName] = useState("");
  const [productcategory , setProductCategory] = useState("");

  const carpenterrole = localStorage.getItem('carpenterrole');
  console.log(carpenterrole);


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
        if (response.data.message.products && response.data.message.products) {
          const formattedSubCategory = response.data.message.products.product_sub_category.replace(/ /g, '_');
          setProductDetails(response.data.message.products);
          setProductCategory(formattedSubCategory)
        } else {
          console.error('No products found in the response');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };


    fetchProductDetails();
  }, [productName]);

  return (
    <Fragment>
      <div><CustomerHeader/></div>


      <div className="lg:mx-20 md:mx-10 mx-5">
          <div className='my-5'>
                       <Pageheader 
                                      currentpage={"Product Details"} 
                                      activepage={`/sub-category-product/${productcategory}`}
                                      mainpage={"/view-product-details/productName"} 
                                      activepagename='Products Category' 
                                      mainpagename='Product Details' 
                                  />
                      </div>

         <div className='p-3 font-bold text-lg uppercase flex justify-center w-full max-w-xl mx-auto'>
     <div className="uppercase ti-btn card-data border-none text-white font-semibold w-1/2">  {productName}</div>
   
   </div>
        
           
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
     <button className="uppercase ti-btn card-data border-none text-white font-semibold w-1/2">More Details</button>
   
   </div>
         </div>

     
    </Fragment>
  );
};

export default Productdetails;
