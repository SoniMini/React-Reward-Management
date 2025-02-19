import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'; 
import App from './App.tsx';
import PrivateRoutes from './routes/private-routes';
import Login from './pages/auth/Login';
import ForgetPassword from './pages/auth/forgot_password.tsx';
import AdminDashboard from './pages/admin/admindashboards/AdminDashboard.tsx';
import ProductMaster from './pages/admin/productdashboards/ProductMaster.tsx';
import ProductQRHistory from './pages/admin/productdashboards/ProductQRHistory.tsx';
import DownloadQRCode from './pages/admin/productdashboards/DownloadQR.tsx';
import AddProduct from './pages/admin/productdashboards/Addproduct.tsx';
import EditProduct from './pages/admin/productdashboards/EditProduct.tsx';
import CarpenterRegistration from './pages/admin/carpenterdashboard/CarpenterRegistration.tsx';
import CarpenterDetails from './pages/admin/carpenterdashboard/CarpenterDetails.tsx';
import Carpenter from './pages/admin/carpenterdashboard/CarpenterProfileSetting.tsx';
import CarpenterRewardRequest from './pages/admin/rewardrequest/RewardRequest.tsx';
import CarpenterRedeemptionHistory from './pages/admin/rewardrequest/RedeemptionHistory.tsx';
import AdminAnnouncement from './pages/admin/announcement/AnnouncementDashboard.tsx';
import TransactionHistory from './pages/admin/transactions/TransactionHistroy.tsx';
import FAQDashboard from './pages/admin/faq/FAQDashboard.tsx';
import AddUserDashboard from './pages/admin/admindashboards/AddUser.tsx';
import SetRewardPoint from './pages/admin/setrewardpoint/SetRewardPoint.tsx';
import CategoryMaster from './pages/admin/productcategory/CategoryMaster.tsx';
import SubCategoryMaster from './pages/admin/productcategory/SubCategoryMaster.tsx';
import CustomerProductMAster from './pages/admin/customerproducts/CustomerProductDashboard.tsx';
import AddCustomerProduct from './pages/admin/customerproducts/AddCustomerProduct.tsx';
import EditCustomerProduct from './pages/admin/customerproducts/EditCustomerProduct.tsx';
import CarpenterDashboard from './pages/carpenter/CarpenterDashboard.tsx'
import CarpenterBankingHistory from './pages/carpenter/BankingHistory.tsx'
import PointHistory from './pages/carpenter/PointHistory.tsx'
import QRCodeScanner from './pages/carpenter/QRScanner.tsx'
import HelpAndSupport from './pages/carpenter/HelpAndSupport.tsx'
import RedeemRequest from './pages/carpenter/RewardRequest.tsx'
import CusromerProducts from './pages/customer/CustomerProduct.tsx'
import CustomerProductDetails from './pages/customer/ViewProduct.tsx'
import Projects from './pages/admin/projectslider/ProjectSlider.tsx'
import NewLaunch from './pages/admin/newlaunch/NewLaunch.tsx';
import { FrappeProvider } from 'frappe-react-sdk';
import AdminProfile from './pages/admin/admindashboards/AdminProfile.tsx';
import CarpenterProfile from './pages/carpenter/CarpenterProfile.tsx';
import NotificationDashboard from './pages/admin/adminnotifications/AdminNotification.tsx';
import SubCategoryProducts from './pages/customer/ViewSubCategoryProduct.tsx';
import SocialMediaLink from './pages/admin/socialmedialink/SocialMediaLinks.tsx';
import WelcomeBonus from './pages/admin/bonuspages/BonusDashboards.tsx';
import WelcomeBonusHistory from './pages/admin/bonuspages/WelcomeBonusHistory.tsx';
import FestivalBonus from './pages/admin/bonuspages/FestivalBonus.tsx';
import FestivalBonusHistory from './pages/admin/bonuspages/FestivalBonusHistory.tsx';
import ViewCarpenterPointHistory from './pages/admin/carpenterdashboard/ViewCarpenterPointHistory.tsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <FrappeProvider
        socketPort={import.meta.env.VITE_SOCKET_PORT}
        siteName={import.meta.env.VITE_SITE_NAME}
      >
        <Login />
      </FrappeProvider>
    ),
  },

  {
    path:"/forgot-password",
    element: (
      <FrappeProvider
        socketPort={import.meta.env.VITE_SOCKET_PORT}
        siteName={import.meta.env.VITE_SITE_NAME}
      >
        <ForgetPassword />
      </FrappeProvider>
    ),
  },


  {
    path: "/customer-product",
    element: (
      <FrappeProvider
        socketPort={import.meta.env.VITE_SOCKET_PORT}
        siteName={import.meta.env.VITE_SITE_NAME}
      >
        <CusromerProducts />
      </FrappeProvider>
    ),
  },

  {
    path: "/sub-category-product/:productId",
    element: (
      <FrappeProvider
        socketPort={import.meta.env.VITE_SOCKET_PORT}
        siteName={import.meta.env.VITE_SITE_NAME}
      >
        <SubCategoryProducts />
      </FrappeProvider>
    ),
  },
  {
    path: "/view-product-details/:productId",
    element: (
      <FrappeProvider
        socketPort={import.meta.env.VITE_SOCKET_PORT}
        siteName={import.meta.env.VITE_SITE_NAME}
      >
        <CustomerProductDetails />
      </FrappeProvider>
    ),
  },
  {
    path: "/",
    element: <App />,
     
    children: [
      {
        path: "admin-profile",
        element: <PrivateRoutes element={<AdminProfile />} />,
      },
      {
        path: "admin-dashboard",
        element: <PrivateRoutes element={<AdminDashboard />} />,
      },
      {
        path: "product-master",
        element : <PrivateRoutes element={<ProductMaster/>}/>,
      },
      {
        path: "product-qr-history",
        element: <PrivateRoutes element={<ProductQRHistory />} />,
      },
      {
        path: "add-product",
        element: <PrivateRoutes element={<AddProduct />} />,
      },
      {
        path: "edit-product",
        element: <PrivateRoutes element={<EditProduct />} />,
      },
      {
        path: "download-qr-code",
        element: <PrivateRoutes element={<DownloadQRCode />} />,
      },
      {
        path: "carpenter-registration",
        element: <PrivateRoutes element={<CarpenterRegistration />} />,
      },
      {
        path: "carpenter-details",
        element: <PrivateRoutes element={<CarpenterDetails />} />,
      },
      {
        path: "carpenter/:carpenterId",
        element: <PrivateRoutes element={<Carpenter />} />,
      },
      {
        path: "view-point-history/:carpenterId",
        element: <PrivateRoutes element={<ViewCarpenterPointHistory />} />,
      },
      {
        path: "category-master",
        element: <PrivateRoutes element={<CategoryMaster />} />,
      },

      
      
      {
        path: "sub-category",
        element: <PrivateRoutes element={<SubCategoryMaster />} />,
      },

      {
        path: "customer-product-master",
        element: <PrivateRoutes element={< CustomerProductMAster/>} />,
      },
      {
        path: "add-customer-product",
        element: <PrivateRoutes element={< AddCustomerProduct/>} />,
      },
      {
        path: "projects",
        element: <PrivateRoutes element={< Projects/>} />,
      },
      {
        path: "edit-customer-product/:productId",
        element: <PrivateRoutes element={< EditCustomerProduct/>} />,
      },
      {
        path: "redeemption-request",
        element: <PrivateRoutes element={<CarpenterRewardRequest/>}/>,
      },
      {
        path: "redeemption-history",
        element:<PrivateRoutes element={<CarpenterRedeemptionHistory/>}/>,
      },
      {
        path: "announcement",
        element: <PrivateRoutes element={<AdminAnnouncement />} />,
      },
      {
        path: "welcome-bonus",
        element: <PrivateRoutes element={<WelcomeBonus />} />,
      },
      {
        path: "welcome-bonuspoint-history",
        element: <PrivateRoutes element={<WelcomeBonusHistory />} />,
      },

      {
        path: "festival-bonus",
        element: <PrivateRoutes element={<FestivalBonus />} />,
      },

      {
        path: "festival-bonus-history",
        element: <PrivateRoutes element={<FestivalBonusHistory />} />,
      },
      {
        path: "transaction-history",
        element: <PrivateRoutes element={<TransactionHistory />} />,
      },
      {
        path: "frequently-asked-question",
        element: <PrivateRoutes element={<FAQDashboard />} />,
      },
      {
        path: "new-launch",
        element: <PrivateRoutes element={<NewLaunch />} />,
      },
      {
        path: "social-media-link",
        element: <PrivateRoutes element={<SocialMediaLink />} />,
      },
      {
        path: "add-user",
        element: <PrivateRoutes element={<AddUserDashboard />} />,
      },
      {
        path: "set-reward-points",
        element: <PrivateRoutes element={<SetRewardPoint />} />,
      },
      {
        path : "view-all-notifications",
        element: <PrivateRoutes  element={<NotificationDashboard />} />,
      },
      {
        path: "carpenter-dashboard",
        element: <PrivateRoutes element={<CarpenterDashboard />} />,
      },
      {
        path:"profile-setting",
        element: <PrivateRoutes  element={<CarpenterProfile />} />,
      },
      
      {
        path: "banking-history",
        element: <PrivateRoutes element={<CarpenterBankingHistory />} />,
      },
      {
        path: "point-history",
        element: <PrivateRoutes element={<PointHistory />} />,
      },
      {
        path: "qr-scanner",
        element: <PrivateRoutes element={<QRCodeScanner />} />,
      },
      {
        path: "redeem-request",
        element: <PrivateRoutes element={<RedeemRequest />} />,
      },
      {
        path: "help-and-support",
        element: <PrivateRoutes  element={<HelpAndSupport />} />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />, // Use Navigate here
      },
    ],
  },
], {
  basename: import.meta.env.VITE_BASE_PATH
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
