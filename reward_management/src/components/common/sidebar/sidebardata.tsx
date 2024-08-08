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
import '../../../assets/css/sidebar.css';


const iconStyle = { height: '8px', width: '8px', strokeWidth: '5rem' };



export const SidebarData = [
  {
    title: 'Admin Dashboard',
    path: '/admin-dashboard',
    icon: <AiIcons.AiFillHome className='sidebaricon' />,

  },
  {
    title: 'Product Dashboard',
    path: '/admin-dashboard',
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
    path: '/admin-dashboard',
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
    title: 'Reward Request',
    path: '/redeemption-request',
    icon: <MdRedeem className='sidebaricon'/>
  },
  {
    title: 'Transaction History',
    path: '/transaction-history',
    icon: <IoIcons.IoMdHelpCircle className='sidebaricon' />
  },
  {
    title: 'Announcement',
    path: '/announcement',
    icon: <MdCampaign className='sidebaricon'  />
  },
  {
    title: 'Set Reward Points',
    path: '/set-reward-points',
    icon: <MdCampaign className='sidebaricon'  />
  },
  {
    title: "FAQ's",
    path: '/frequently-asked-question',
    icon: <IoIcons.IoMdPeople className='sidebaricon'  />
  },
  
  {
    title: 'Add User',
    path: '/add-user',
    icon: <FaUserPlus  className='sidebaricon'/>
  },
  {
    title: 'Banking History',
    path: '/banking-history',
    icon: <FaUserPlus  className='sidebaricon'/>
  }
  
];
