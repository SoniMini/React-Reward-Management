// import React, { useEffect } from 'react';
// import '../../assets/css/style.css';
// // import '../../assets/css/sidebar.css';
// import sidebarLogo from '../../assets/images/logo-2.png';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { SidebarData } from '@/components/common/carpentersidebar/carpentersidebardata';
// import SubMenu from '@/components/common/carpentersidebar/carpentersubmenu';
// import { Link } from 'react-router-dom';

// const Sidebar = ({ isSidebarActive }) => {
//     useEffect(() => {
//         const sidebar = document.querySelector('.side-menu');
//         const header = document.querySelector('.main-sidebar-header');

//         const handleMouseOver = () => {
//             if (header) {
//                 header.style.width = '15rem';
//             }
//         };

//         const handleMouseOut = () => {
//             if (header) {
//                 header.style.width = sidebar.classList.contains('narrow') ? '5rem' : '15rem';
//             }
//         };

//         if (sidebar) {
//             sidebar.addEventListener('mouseover', handleMouseOver);
//             sidebar.addEventListener('mouseout', handleMouseOut);
//         }

//         // Clean up event listeners on component unmount
//         return () => {
//             if (sidebar) {
//                 sidebar.removeEventListener('mouseover', handleMouseOver);
//                 sidebar.removeEventListener('mouseout', handleMouseOut);
//             }
//         };
//     }, []);

//     return (
//         <div className={`side-menu ${isSidebarActive ? 'narrow' : 'wide'}  text-white`}>
//             <div className="main-sidebar-header">
//                 <img 
//                     src={sidebarLogo} 
//                     alt="logo" 
//                     className={`transition-all duration-300 ${isSidebarActive ? 'w-16' : 'w-32'}`} 
//                 />
//             </div>
//             <div className='main-sidebar'>
//                 <div className="">
//                     <ul>
//                         {SidebarData.map((item, index) => {
//                             // Render SubMenu for items with sub-navigation
//                             return item.subNav ? (
//                                 <SubMenu item={item} key={index} isSidebarActive={isSidebarActive} />
//                             ) : (
//                                 <li className='sidebar-menu-item' key={index}>
//                                     <Link to={item.path} className="flex items-center">
//                                         {item.icon}
//                                         <span className={`menu-text ${isSidebarActive ? 'hidden' : 'block'}`}>{item.title}</span>
//                                     </Link>
//                                 </li>
//                             );
//                         })}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Sidebar;
