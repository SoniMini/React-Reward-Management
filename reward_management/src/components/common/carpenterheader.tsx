import { Fragment, useState, useEffect } from "react";
import '../../assets/css/pages/admindashboard.css';
import ProfilePic from '/src/assets/images/reward_management/9.jpg';
import '../../assets/css/header.css';
import '../../assets/css/style.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'boxicons/css/boxicons.min.css';
import NotificationDropdown from '../ui/notification';
import Modalsearch from "./modalsearch/modalsearch";
import { useFrappeAuth } from "frappe-react-sdk";
import sidebarLogo from '../../assets/images/01.png';
import axios from 'axios';
import { Link } from "react-router-dom";

const Header = () => {


    const [logo, setLogo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fullScreen, setFullScreen] = useState(false);
    const [theme, setTheme] = useState({
        dataNavLayout: 'vertical',
        dataVerticalStyle: 'closed',
        dataNavStyle: 'menu-click',
        toggled: '',
        class: 'light',
    });


    const { logout } = useFrappeAuth();
    const carpenterrole = localStorage.getItem('carpenterrole');
    console.log(carpenterrole);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [UserImage, setUserImage] = useState(ProfilePic);
    const [username, setUsername] = useState('');
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };


    // Fullscreen toggle handler
    const toggleFullScreen = () => {
        const elem = document.documentElement;
        if (!document.fullscreenElement) {
            elem.requestFullscreen().then(() => setFullScreen(true));
        } else {
            document.exitFullscreen().then(() => setFullScreen(false));
        }
    };

    // Fullscreen change listener
    useEffect(() => {

        const fetchUserEmailAndInitScanner = async () => {
            try {
                const userResponse = await axios.get(`/api/method/frappe.auth.get_logged_user`, {

                });

                const userdata = await axios.get(`/api/resource/User/${userResponse.data.message}`, {

                });

                setUsername(userdata.data.data.first_name || "");
                setUserImage(userdata.data.data.user_image || ProfilePic);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const handleFullscreenChange = () => {
            setFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };

        fetchUserEmailAndInitScanner();

    }, []);

    // Theme toggle handler
    const toggleDarkMode = () => {
        const newClass = theme.class === 'dark' ? 'light' : 'dark';
        const updatedTheme = {
            ...theme,
            class: newClass,
            dataHeaderStyles: newClass,
            dataMenuStyles: theme.dataNavLayout === 'horizontal' ? newClass : 'dark',
        };

        setTheme(updatedTheme);
        applyTheme(updatedTheme);

        localStorage.setItem(`ynex${newClass}theme`, newClass);
        localStorage.removeItem(`ynex${newClass === 'dark' ? 'light' : 'dark'}theme`);
        localStorage.removeItem("ynexMenu");
        localStorage.removeItem("ynexHeader");
    };

    // Apply theme to the document
    const applyTheme = (currentTheme) => {
        const root = document.documentElement;
        Object.entries(currentTheme).forEach(([key, value]) => {
            if (key.startsWith('data')) {
                root.style.setProperty(`--${key}`, value);
            }
        });
    };

    // Fetch website settings and apply theme
    useEffect(() => {
        const fetchWebsiteSettings = async () => {
            try {
                const response = await axios.get('/api/method/reward_management_app.api.website_settings.get_website_settings');
                const { data } = response;

                if (data?.message?.status === 'success') {
                    const bannerImage = data.message.data.banner_image;
                    const fullBannerImageURL = bannerImage ? `${window.origin}${bannerImage}` : sidebarLogo;
                    setLogo(fullBannerImageURL);
                } else {
                    setLogo(sidebarLogo);
                    console.error('Invalid API response:', data.message);
                }
            } catch (error) {
                setLogo(sidebarLogo);
                console.error('Error fetching website settings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWebsiteSettings();
        applyTheme(theme);
    }, [theme]);

    const handleOpenSearchModal = () => {
        setIsSearchModalOpen(true);
    };

    const handleCloseSearchModal = () => {
        setIsSearchModalOpen(false);
    };
    const handleDropdownToggle = () => {
        setDropdownVisible(prevState => !prevState);
    };


    // Show loading spinner if loading
    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <Fragment>
            <header className="bg-white border border-defaultborder border-b-2">
                <nav className="main-header h-[3.75rem] lg:mx-20 md:mx-10 mx-5">
                    <div className="main-header-container">
                        <div className="header-content-left">
                            <div className="header-element md:px-[0.325rem] flex items-center">
                                <img
                                    src={logo}
                                    alt="logo"
                                    className="sidebar-logo w-18 h-10"
                                />
                            </div>
                        </div>


                        <div className="header-content-right flex items-center">
                            {/* search btn logic start------- */}
                            {carpenterrole === "Carpenter" && (
                                <div className="header-element py-[1rem] md:px-[0.65rem] px-2 header-search">
                                    <button
                                        aria-label="button"
                                        type="button"
                                        onClick={handleOpenSearchModal}
                                        className="inline-flex flex-shrink-0 justify-center items-center gap-2 rounded-full font-medium focus:ring-offset-0 focus:ring-offset-white transition-all text-xs dark:bg-bgdark dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                                    >
                                        <i className="bx bx-search-alt-2 header-link-icon"></i>
                                    </button>
                                </div>
                            )}

                            {/* end search btn */}

                            {/* notification logic start------- */}
                            {carpenterrole === "Carpenter" && (
                                <div>
                                    <div className="header-element py-[1rem] md:px-[0.65rem] px-2">
                                        <button className="header-btn header-btn-search" onClick={toggleDropdown}>
                                            <div className="notification-icon-container relative">
                                                <i className="bx bx-bell header-link-icon"></i>
                                                {notificationCount > 0 && (
                                                    <span className="flex absolute h-5 w-5 rounded-full -top-[0.25rem] end-0 -me-[0.7rem]">
                                                        <span className="animate-slow-ping absolute inline-flex -top-[0.5px] -start-[0.5px] h-full w-full rounded-full bg-primary opacity-75"></span>
                                                        <span
                                                            className="relative inline-flex justify-center items-center rounded-full h-5 w-9 bg-primary text-[0.625rem] text-white"
                                                            id="notification-icon-badge"
                                                        >
                                                            {notificationCount}
                                                        </span>
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                    <NotificationDropdown
                                        isOpen={dropdownOpen}
                                        toggleDropdown={toggleDropdown}
                                        onNotificationCountChange={setNotificationCount}
                                    />
                                </div>
                            )}
                            {/* end notification */}
                             {/* start full screen */}
                            <div className="header-element py-[1rem] md:px-[0.65rem] px-2">
                                <button className="header-btn" onClick={toggleFullScreen}>
                                    <i className={`header-link-icon bx ${fullScreen ? 'bx-exit-fullscreen' : 'bx-fullscreen'}`}></i>
                                </button>
                            </div>
                            {/* end of fullscreen */}
                            

                            {/* start of user profile */}
                            {carpenterrole === "Carpenter" && (
                <div className="header-element py-[1rem] md:px-[0.65rem] px-2">
                    <button id="dropdown-profile" type="button"
                        className="hs-dropdown-toggle ti-dropdown-toggle !gap-2 !p-0 flex-shrink-0 sm:me-2 me-0 !rounded-full !shadow-none text-xs align-middle !border-0 !shadow-transparent "
                        onClick={handleDropdownToggle}>
                        <img className="inline-block rounded-full w-[30px] h-[30px]" src={UserImage} width="32" height="32" alt="Image Description" />
                    </button>
                    <div className="md:block hidden dropdown-profile cursor-pointer" onClick={handleDropdownToggle}>
                        <p className="font-semibold mb-0 pt-3 leading-none text-primary text-[0.813rem] ">{username}</p>
                    </div>
                    <div
                        className={`hs-dropdown-menu main-header-dropdown ti-dropdown-menu bg-white mt-3 fixed top-12 right-4 border-0 w-[10rem] p-0 border-defaultborder ${isDropdownVisible ? '' : 'hidden'} pt-0 overflow-hidden header-profile-dropdown dropdown-menu-end`}
                        aria-labelledby="dropdown-profile"
                    >
                        <ul className="text-defaulttextcolor font-medium dark:text-[#8c9097] dark:text-white/50">
                            <li className="user-profile-list hover:bg-[var(--bg-primary)] hover:text-[var(--primaries)]">
                                <a className="w-full ti-dropdown-item !text-[0.8125rem] !gap-x-0 !p-[0.65rem] !inline-flex" href={`/profile-setting`}>
                                    <i className="ti ti-user-circle text-[1.125rem] me-2 opacity-[0.7]"></i>Profile
                                </a>
                            </li>
                            <li className="user-profile-list hover:bg-[var(--bg-primary)] hover:text-[var(--primaries)]">
                                <a
                                    className="w-full ti-dropdown-item !text-[0.8125rem] !p-[0.65rem] !gap-x-0 !inline-flex"
                                    href="/"
                                    onClick={() => {
                                        localStorage.removeItem('user_roles');
                                        localStorage.removeItem('carpenterrole');
                                        localStorage.removeItem("username");
                                        logout;
                                    }}
                                >
                                    <i className="ti ti-logout text-[1.125rem] me-2 opacity-[0.7]"></i>Log Out
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        {/* end of user profile */}

         
  {/* customer logout start-- */}
                            {carpenterrole !== "Carpenter" && (
                            <div className="header-element py-[1rem] md:px-[0.65rem] px-2 header-search">
                                <Link to="/" title="Go to Profile">
                                    <img
                                        className="inline-block rounded-full w-[30px] h-[30px]"
                                        src={ProfilePic}
                                        alt="Profile"
                                    />
                                </Link>
                            </div>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            <Modalsearch isOpen={isSearchModalOpen} onClose={handleCloseSearchModal} />

        </Fragment>
    );
};

export default Header;
