import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import React, { Fragment, useState, useEffect } from "react";
import axios from 'axios';
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import { set } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Facebook from '../../../assets/images/reward_management/facebook-app-symbol (1).png';
import WhatsApp from '../../../assets/images/reward_management/15.png';
import Instagram from '../../../assets/images/reward_management/14.png';
import GoogleMap from '../../../assets/images/reward_management/16.png';

const SocialMediaLink: React.FC = () => {
    // const [nameLaunch, setNameLaunch] = useState<string>('');
    const [facebookLink, setFaceBookLink] = useState<string>('');
    const [instaLink, setInstaLink] = useState<string>('');
    const [whatsappLink, setWhatsAppLink] = useState<string>('');
    const [googleLink, setGoogleLink] = useState<string>('');



    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    useEffect(() => {
        document.title = 'Social Media Link';

        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                window.location.reload();
            }, 3000);
            return () => clearTimeout(timer);
        }

        const fetchAPI = async () => {
            try {
                const response = await axios.get(`/api/method/reward_management_app.api.social_media_link.get_social_media_link`);

                if (response.data.message) {
                    console.log("Social Media Data:", response.data.message);
                    setFaceBookLink(response.data.message.facebook_url);
                    setInstaLink(response.data.message.insta_url);
                    setWhatsAppLink(response.data.message.whatsapp_url);
                    setGoogleLink(response.data.message.google_url);
                }
            } catch (error) {
                console.error("Error fetching API data:", error);
            }
        };

        fetchAPI();
    }, [showSuccessAlert]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const data = {
            facebook_url: facebookLink,
            instagram_url: instaLink,
            whatsapp_url: whatsappLink,
            google_map_url: googleLink,
        };

        try {
            const response = await fetch('/api/resource/Social Media Link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to create New Launch');
            }

            setShowSuccessAlert(true);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to create New Launch.');
        }
    };

    return (
        <Fragment>
            <Pageheader
                currentpage={"Social Media Link"}
                activepage={"/social-media-link"}
                activepagename="Social Media Link"
            />
            <div className="grid grid-cols-12 gap-x-6 p-6">
                <div className="col-span-12 flex justify-center items-center">
                    <div className="xl:col-span-3 col-span-12 bg-white mt-5 rounded-lg shadow-lg p-6 w-[500px]">
                        <div className="">
                            <div className="box-header">
                                <div className="box-title text-center text-[var(--primaries)] text-sm font-semibold">
                                    Add Social Media Link
                                </div>
                            </div>
                            <div className="box-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="xl:col-span-12 col-span-12 flex">
                                            <input
                                                type="text"
                                                className="outline-none w-full focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control !rounded-md !bg-light text-defaulttextcolor text-xs font-medium"
                                                id="setFaceBookLink"
                                                placeholder="Facebook Link"
                                                value={facebookLink}
                                                onChange={(e) => setFaceBookLink(e.target.value)}
                                            />
                                            <span className="w-[10%] text-blue-500 justify-center  items-center  flex border border-[#949eb7] border-l-0  outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control !rounded-md !bg-light text-defaulttextcolor text-xs font-medium ">
                                                <Link
                                                    to="#"
                                                    onClick={() => window.open(facebookLink, "_blank")}
                                                    className='rounded-full md:w-7 md:h-7 w-5 h-5  flex items-center justify-center table-btn'
                                                >
                                                    <img src={Facebook} alt="Facebook" className='md:w-4 md:h-4 w-3 h-3' />
                                                </Link>
                                            </span>
                                        </div>
                                        <div className="xl:col-span-12 col-span-12 flex">
                                            <input
                                                type="text"
                                                className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium"
                                                id="setwatsappLink"
                                                placeholder="Whatsapp Link"
                                                value={whatsappLink}
                                                onChange={(e) => setWhatsAppLink(e.target.value)}
                                            />

                                            <span className="w-[10%] text-blue-500 justify-center  items-center  flex border border-[#949eb7] border-l-0  outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control !rounded-md !bg-light text-defaulttextcolor text-xs font-medium ">
                                                <Link
                                                    to="#"
                                                    onClick={() => window.open(whatsappLink, "_blank")}
                                                    className='rounded-full md:w-7 md:h-7 w-5 h-5  flex items-center justify-center table-btn'
                                                >
                                                    <img src={WhatsApp} alt="Facebook" className='md:w-4 md:h-4 w-3 h-3' />
                                                </Link>
                                            </span>
                                        </div>
                                        <div className="xl:col-span-12 col-span-12 flex">
                                            <input
                                                type="text"
                                                className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium"
                                                id="setinstaLink"
                                                placeholder="Instagram Link"
                                                value={instaLink}
                                                onChange={(e) => setInstaLink(e.target.value)}
                                            />
                                              <span className="w-[10%] text-blue-500 justify-center  items-center  flex border border-[#949eb7] border-l-0  outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control !rounded-md !bg-light text-defaulttextcolor text-xs font-medium ">
                                                <Link
                                            to="#"
                                            onClick={() => window.open(instaLink, "_blank")}
                                            className='rounded-full md:w-7 md:h-7 w-5 h-5 flex items-center justify-center table-btn'
                                        >
                                            <img src={Instagram} alt="Facebook" className='md:w-4 md:h-4 w-3 h-3'/>
                                        </Link>
                                            </span>
                                        </div>
                                        <div className="xl:col-span-12 col-span-12 flex">
                                            <input
                                                type="text"
                                                className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium"
                                                id="setgoogleLink"
                                                placeholder="Google Link"
                                                value={googleLink}
                                                onChange={(e) => setGoogleLink(e.target.value)}
                                            />
                                              <span className="w-[10%] text-blue-500 justify-center  items-center  flex border border-[#949eb7] border-l-0  outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control !rounded-md !bg-light text-defaulttextcolor text-xs font-medium ">
                                                <Link
                                            to="#"
                                            onClick={() => window.open(googleLink, "_blank")}
                                            className='rounded-full md:w-7 md:h-7 w-5 h-5 flex items-center justify-center table-btn'
                                        >
                                            <img src={GoogleMap} alt="Facebook" className='md:w-4 md:h-4 w-3 h-3'/>
                                        </Link>
                                            </span>
                                        </div>
                                        <div className="xl:col-span-12 col-span-12 text-center">
                                            <button
                                                id='submit'
                                                type="submit"
                                                className="border-none ti-btn new-launch text-white w-full"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showSuccessAlert && (
                <SuccessAlert
                    showButton={false}
                    showCancleButton={false}
                    showCollectButton={false}
                    showAnotherButton={false}
                    showMessagesecond={false}
                    message="Links Added successfully!"
                    onClose={() => setShowSuccessAlert(false)}
                    onCancel={() => setShowSuccessAlert(false)}
                />
            )}
        </Fragment>
    );
};

export default SocialMediaLink;
