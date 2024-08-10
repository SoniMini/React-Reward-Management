import React, { useEffect } from 'react';
import '../../assets/css/style.css';
import '../../assets/css/sidebar.css';

import sidebarLogo from '../../assets/images/logo-2.png';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SidebarData } from '@/components/common/sidebar/sidebardata';
import SubMenu from '@/components/common/sidebar/submenu';
import { Link } from 'react-router-dom';


console.log(SidebarData);

const Sidebar = ({ isSidebarActive }) => {

    // const fullName = Cookies.get('full_name');
    //  // Find the index of specific items
    // const getItemIndex = (title) => SidebarData.findIndex(item => item.title === title);

    // let itemsToRender;

    // if (fullName === "Administrator") {
    //     const addUserIndex = getItemIndex('Add User');
    //     itemsToRender = addUserIndex !== -1 ? SidebarData.slice(0, addUserIndex + 1) : SidebarData;
    // } else if (fullName === "Admin") {
    //     const faqIndex = getItemIndex("FAQ's");
    //     itemsToRender = faqIndex !== -1 ? SidebarData.slice(0, faqIndex + 1) : SidebarData;
    // } else if (fullName === "carpenter") {
    //     const startIndex = getItemIndex('Dashboard');
    //     const endIndex = getItemIndex('Help & Support');
    //     itemsToRender = startIndex !== -1 && endIndex !== -1 ? SidebarData.slice(startIndex, endIndex + 1) : [];
    // } else {
    //     itemsToRender = SidebarData;
    // }

    const data = localStorage.getItem('user_roles');
    console.log("data",data);

  
    useEffect(() => {
        const sidebar = document.querySelector('.side-menu');   
        const header = document.querySelector('.main-sidebar-header');

        const handleMouseOver = () => {
            if (header) {
                header.style.width = '15rem';
            }
        };

        const handleMouseOut = () => {
            if (header) {
                header.style.width = sidebar.classList.contains('narrow') ? '5rem' : '15rem';
            }
        };

        if (sidebar) {
            sidebar.addEventListener('mouseover', handleMouseOver);
            sidebar.addEventListener('mouseout', handleMouseOut);
        }

        return () => {
            if (sidebar) {
                sidebar.removeEventListener('mouseover', handleMouseOver);
                sidebar.removeEventListener('mouseout', handleMouseOut);
            }
        };
    }, []);

    return (
        <div className={`side-menu ${isSidebarActive ? 'narrow' : 'wide'} text-white`}>
            <div className="main-sidebar-header">
                <img 
                    src={sidebarLogo} 
                    alt="logo" 
                    className={`transition-all duration-300 ${isSidebarActive ? 'w-16' : 'w-32'}`} 
                />
            </div>
            <div className='main-sidebar'>
                <ul>
                    {SidebarData.map((item, index) => {

                        // Conditionally render items based on user role
                    
                                            // Render SubMenu for items with sub-navigation
                                return item.subNav ? (
                                    <SubMenu item={item} key={index} isSidebarActive={isSidebarActive} />
                                ) : (
                                    <li className='sidebar-menu-item' key={index}>
                                        <Link to={item.path} className="flex items-center">
                                            {item.icon}
                                            <span className="menu-text">{item.title}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                </ul>
            </div>  
        </div>
    );
};

export default Sidebar;


