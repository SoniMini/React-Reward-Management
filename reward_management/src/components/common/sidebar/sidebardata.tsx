import React from 'react';
// import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
// import * as RiIcons from 'react-icons/ri';
import { SlArrowRight, SlArrowDown } from 'react-icons/sl';
import { VscCircle } from "react-icons/vsc";
import { AiFillProduct } from "react-icons/ai";
import { GrUserWorker } from "react-icons/gr";
import { MdRedeem } from "react-icons/md";
import { MdCampaign } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa6";
import { IconCashRegister } from '@tabler/icons-react';
import { IconLayoutDashboard } from '@tabler/icons-react';
import { IconScan } from '@tabler/icons-react';
import { IconBuildingBank } from '@tabler/icons-react';
import { IconCoins } from '@tabler/icons-react';
import RedeemIcon from '@mui/icons-material/Redeem'; 
import { IconHelpHexagon } from '@tabler/icons-react';
import '../../../assets/css/sidebar.css';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import ViewProduct from '../../../assets/images/reward_management/product-research.png'
import { TbCategoryPlus } from "react-icons/tb";
import { MdOutlineCategory } from "react-icons/md";
import CustomerProduct from '../../../assets/images/reward_management/customer-loyalty.png'
import { SiOpenproject } from "react-icons/si";
import SocialMediaLink from '../../../assets/images/reward_management/network.png';
import BonusIcon from '../../../assets/images/reward_management/business.png';





const iconStyle = { height: '8px', width: '8px', strokeWidth: '5rem' };



export const SidebarData = [
  {
    title: 'Admin Dashboard',
    path: '/admin-dashboard',
    icon: <AiIcons.AiFillHome className='sidebaricon' />,

  },
  {
    title: 'Product Dashboard',
    // path: '/admin-dashboard',
    icon: <AiFillProduct className='sidebaricon' />,
    iconClosed:<SlArrowRight style={iconStyle}  /> ,
    iconOpened: <SlArrowDown style={iconStyle}  />,

    subNav: [
      {
        title: 'Product Master',
        path: '/product-master',
        icon: <VscCircle />,
        cName: 'sub-nav'
      },
      {
        title: 'Product QR History',
    path: '/product-qr-history',
        icon: <VscCircle />,
        cName: 'sub-nav'
      },
     
    ]
  },
  {
    title: 'Carpenter Dashboard',
    // path: '/carpenter-dashboard',
    icon: <GrUserWorker className='sidebaricon'  />,

    iconClosed:<SlArrowRight  style={iconStyle} /> ,
    iconOpened: <SlArrowDown  style={iconStyle} />,

    subNav: [
      {
        title: 'Carpenter Registration',
        path: '/carpenter-registration',
        icon: <VscCircle />
      },
      {
        title: 'Carpenter Details',
        path: '/carpenter-details',
        icon: <VscCircle  />
      }
    ]
  },
  {
    title: 'Category Master',
    path: '/category-master',
    icon : <TbCategoryPlus className='sidebaricon' />
  },
  {
    title: 'Sub Category Master',
    path: '/sub-category',
    icon : <MdOutlineCategory className='sidebaricon' />
  },

  {
    title: 'Customer Product Master',
    path: '/customer-product-master',
    icon : <img src={CustomerProduct} alt="image" className='sidebaricon'  />
  },

  {
    title: 'Projects',
    path: '/projects',
    icon : <SiOpenproject className='sidebaricon' />
  },
  {
    title: 'Reward Request',
    path: '/redeemption-request',
    icon: <MdRedeem className='sidebaricon'/>
  },
  {
    title: 'Transaction History',
    path: '/transaction-history',
    icon: <IconCashRegister className='sidebaricon' />
  },
  {
    title: 'Bonus Dashboard',
    // path: '/carpenter-dashboard',
    icon: (
      <img
        src={BonusIcon}
        alt="View Bonus"
        className="sidebaricon"
      />
    ),     
    iconClosed:<SlArrowRight  style={iconStyle} /> ,
    iconOpened: <SlArrowDown  style={iconStyle} />,

    subNav: [
      {
        title: 'Welcome Bonus Point',
        path: '/welcome-bonus',
        icon: <VscCircle />
      },
      {
        title: 'Welcome Bonus History',
        path: '/welcome-bonuspoint-history',
        icon: <VscCircle  />
      },
      {
        title: 'Festival Bonus',
        path: '/festival-bonus',
        icon: <VscCircle  />
      },
      {
        title: 'Festival Bonus History',
        path: '/festival-bonus-history',
        icon: <VscCircle  />
      }
    ]
  },
  {
    title: 'Announcement',
    path: '/announcement',
    icon: <MdCampaign className='sidebaricon'  />
  },
  {
    title: 'Set Reward Points',
    path: '/set-reward-points',
    icon: <IconCoins className='sidebaricon'  />
  },
  {
    title: "New Launch",
    path: '/new-launch',
    icon: <NewReleasesIcon className='sidebaricon'  />
  },

  {
    title: "Social Media Links",
    path: '/social-media-link',
    icon: <img src={SocialMediaLink} alt="social media" className='sidebaricon'  />
  },
  {
    title: "FAQ's",
    path: '/frequently-asked-question',
    icon: <IoIcons.IoMdHelpCircle className='sidebaricon'  />
  },
  
  
  {
    title: 'Add User',
    path: '/add-user',
    icon: <FaUserPlus  className='sidebaricon'/>
  },
  {
    title: 'Dashboard',
    path: '/carpenter-dashboard',
    icon: <IconLayoutDashboard  className='sidebaricon'/>
  },
  {
    title: 'QR Scanner',
    path: '/qr-scanner',
    icon: <IconScan  className='sidebaricon'/>
  },
  {
    title: 'Banking History',
    path: '/banking-history',
    icon: <IconBuildingBank  className='sidebaricon'/>
  },
  {
    title: 'Point History',
    path: '/point-history',
    icon: <IconCoins  className='sidebaricon'/>
  },
  {
    title: 'Redeem Request',
    path: '/redeem-request',
    icon: <RedeemIcon  className='sidebaricon'/>
  },

  {
    title: 'View Products',
    path: '/customer-product',
    icon: (
      <img
        src={ViewProduct}
        alt="View Products"
        className="sidebaricon"
      />
    ),
  },
  {
    title: 'Help & Support',
    path: '/help-and-support',
    icon: <IconHelpHexagon  className='sidebaricon'/>
  },
 
  
];
