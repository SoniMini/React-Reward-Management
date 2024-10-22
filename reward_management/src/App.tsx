
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FrappeProvider } from 'frappe-react-sdk';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import Header from './components/common/header';
import Sidebar from './components/common/sidebar';
import Favicon from './assets/images/01.png';

function App() {
  
  const location = useLocation();
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const toggleSidebar = () => {
   
    setIsSidebarActive(!isSidebarActive);
    
  };
  
  function setFavicons(favImg: string) {
    const headElement = document.querySelector('head');
    
    // Remove existing favicon if it exists
    const existingFavicon = document.querySelector('link[rel="shortcut icon"]');
    if (existingFavicon && headElement) {
        headElement.removeChild(existingFavicon);
    }
  
    const newFavicon = document.createElement('link');
    newFavicon.setAttribute('rel', 'shortcut icon');
    newFavicon.setAttribute('type', 'image/png'); // Adjust the type based on your image
    newFavicon.setAttribute('href', favImg);
    headElement?.appendChild(newFavicon);
  }

  useEffect(() => {
    console.log(`Route changed to: ${location.pathname}`);
    
    const fetchWebsiteSettings = async () => {
      try {
        const response = await fetch('/api/method/reward_management_app.api.website_settings.get_website_settings');
        console.log("Image response", response);

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched data:", data);

          if (data && data.message && data.message.status === 'success') {
            const { favicon } = data.message.data || {};

            if (favicon) {
              // Prepend window.origin to the favicon path if it's not absolute
              const absoluteFaviconUrl = `${window.origin}${favicon}`;
              console.log("Absolute favicon URL:", absoluteFaviconUrl);
              setFavicons(absoluteFaviconUrl); 
            } else {
              // If no favicon is provided, set the default favicon
              setFavicons(Favicon); // Favicon should be the string URL to the default image
              console.log("Fallback favicon set to default.");
            }
          } else {
            console.error("Error fetching website settings:", data?.message || 'No message available');
            setFavicons(Favicon); // Fallback to default favicon on error
          }
        } else {
          console.error("Network response was not ok:", response.statusText);
          setFavicons(Favicon); // Fallback to default favicon on error
        }
      } catch (error) {
        console.error("Error fetching website settings:", error.message || error);
        setFavicons(Favicon); // Fallback to default favicon on error
      }
    };

    fetchWebsiteSettings();
  }, [location.pathname]);
  const getSiteName = () => {
    if (window.frappe?.boot?.versions?.frappe &&
        (window.frappe.boot.versions.frappe.startsWith('15') ||
         window.frappe.boot.versions.frappe.startsWith('16'))) {
      return window.frappe?.boot?.sitename ?? import.meta.env.VITE_SITE_NAME;
    }
    return import.meta.env.VITE_SITE_NAME;
  };

  return (
    <div className="App">
      <Theme appearance="light" accentColor="iris" panelBackground="translucent">
        <FrappeProvider
          socketPort={import.meta.env.VITE_SOCKET_PORT}
          siteName={getSiteName()}
        >
          <div className={`page layout ${isSidebarActive ? 'sidebar-narrow' : 'sidebar-wide'}`}>
            <Header toggleSidebar={toggleSidebar} isSidebarActive={isSidebarActive} />
            <Sidebar isSidebarActive={isSidebarActive} />
            <div className='content main-index' style={{ marginInlineStart: isSidebarActive ? '5rem' : '15rem' }}>
              <div className='main-content bg-body-bg'>
                <Outlet />
              </div>
            </div>
          </div>
        </FrappeProvider>
      </Theme>
    </div>
  );
}

export default App;
