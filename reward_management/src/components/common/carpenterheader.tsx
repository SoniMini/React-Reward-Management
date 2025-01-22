import { Fragment, useState, useEffect } from "react";
import '../../assets/css/pages/admindashboard.css';
import ProfilePic from '/src/assets/images/reward_management/9.jpg';
import '../../assets/css/header.css';
import '../../assets/css/style.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'boxicons/css/boxicons.min.css';
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
        const handleFullscreenChange = () => {
            setFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
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
                            <div className="header-element py-[1rem]">
                                <button className="header-btn" onClick={toggleFullScreen}>
                                    <i className={`header-link-icon bx ${fullScreen ? 'bx-exit-fullscreen' : 'bx-fullscreen'}`}></i>
                                </button>
                            </div>
                            <div className="header-element py-[1rem] md:px-[0.65rem] px-2 header-search">
                                <Link to="/" title="Go to Profile">
                                    <img
                                        className="inline-block rounded-full w-[30px] h-[30px]"
                                        src={ProfilePic}
                                        alt="Profile"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </Fragment>
    );
};

export default Header;
