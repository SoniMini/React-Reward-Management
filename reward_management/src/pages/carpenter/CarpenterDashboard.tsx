import '../../assets/css/style.css';
import React, { Fragment, useState, useEffect } from "react";
import axios from 'axios';
// import { BASE_URL } from "../../utils/constants";
import { Link } from 'react-router-dom';

import TotalPoints from '../../assets/images/reward_management/01.png';
import AvailablePoint from '../../assets/images/reward_management/02.png';
import PointRequested from '../../assets/images/reward_management/03.png';
import PointRedeemed from '../../assets/images/reward_management/04.png';
import BankHistory from '../../assets/images/reward_management/08-b.png';
import QRScanner from '../../assets/images/reward_management/05-b.png';
import PointHistroy from '../../assets/images/reward_management/09-b.png';
import RedeemRequest from '../../assets/images/reward_management/10-b.png';
import HelpSupport from '../../assets/images/reward_management/011-b.png';
import ViewProduct from '../../assets/images/reward_management/12-b.png';
import Facebook from '../../assets/images/reward_management/facebook-app-symbol (1).png';
import WhatsApp from '../../assets/images/reward_management/15.png';
import Instagram from '../../assets/images/reward_management/14.png';
import GoogleMap from '../../assets/images/reward_management/16.png';
import GoogleReview from '../../assets/images/reward_management/customer-satisfaction.png';


const CarpenterDashboard: React.FC = () => {
    const [redeemPoints, setRedeemPoints] = useState<number>(0);
    const [requestedPoints, setRequestedPoints] = useState<number>(0);
    const [totalPoints, setTotalPoints] = useState<number>(0);
    const [currentPoints, setCurrentPoints] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [facebooklink, setFaceBookLink] = useState<string | null>(null);
    const [instagramlink, setInstagramLink] = useState<string | null>(null);
    const [whatsapplink, setWhatsAppLink] = useState<string | null>(null);
    const [googlemaplink, setGoogleMapLink] = useState<string | null>(null);
    const [googleReviewLink , setGoogleReviewLink] =  useState<string | null>(null);


    useEffect(() => {
        const fetchCarpenterData = async () => {
            try {
                const response = await axios.get(`/api/method/reward_management_app.api.carpenter_master.get_carpainter_data`,
                    {
                        headers: {
                            "Accept": "application/json",
                            // "Authorization": "token 01a0a46721cbc35:e48ec29404169f8",
                            "Content-Type": "application/json"
                        }
                    }
                );
                console.log("Carpenter Dashboard API Response:", response);

                // Access the data within the message field
                const data = response.data.message.data;
                console.log("Table Data:", data);

                if (Array.isArray(data) && data.length > 0) {
                    const firstItem = data[0];
                    setRedeemPoints(firstItem.redeem_points || 0);
                    setTotalPoints(firstItem.total_points || 0);
                    setCurrentPoints(firstItem.current_points || 0);
                    setRequestedPoints(firstItem.point_requested || 0);
                } else {
                    console.log("No data available");
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Error fetching data");
                setLoading(false);
            }
        };

        const fetchSocialMediaData = async () => {
            try {
                const response = await axios.get(`/api/method/reward_management_app.api.social_media_link.get_social_media_link`);
                console.log("Social Media API Response:", response);
                if (response.data.message && response.data.message.success == true) {

                    setFaceBookLink(response.data.message.facebook_url);
                    setInstagramLink(response.data.message.insta_url);
                    setWhatsAppLink(response.data.message.whatsapp_url);
                    setGoogleMapLink(response.data.message.google_url);
                    setGoogleReviewLink(response.data.message.google_reviews);
                } else {
                    console.log("No data available");
                }

                setLoading(false);

            }
            catch (error) {
                console.error("Error fetching data:", error);
                setError("Error fetching data");
                setLoading(false);
            }
        };
        fetchSocialMediaData();

        fetchCarpenterData();
    }, []);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
    return (
        <Fragment>
            <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
                <div>
                    <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0">
                        Carpenter Dashboard
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 col-span-12">
                    <div className="grid grid-cols-12 gap-x-6">
                        <div className="xl:col-span-12 col-span-12">
                            <div className="">
                                <div className="">
                                    <div className="grid grid-cols-12 xl:gap-y-0 gap-4 ">
                                        {/*number cards start----  */}
                                        <div className="category-link card-data xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900">
                                            {/* first------- */}
                                            <div className="flex flex-row items-start ">
                                                <div className='xxl:w-1/3 xl:w-1/2'>
                                                    <span className="avatar avatar-lg bg-[#dee9eb] inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 mr-3">
                                                        {/* <i className="ti ti-wallet text-[1.25rem]"></i> */}
                                                        <img src={TotalPoints} alt="" className='w-10 h-10' />
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <h5 className="text-[1.125rem] text-white font-semibold mb-2">{totalPoints}</h5>
                                                    <div className="flex flex-row text-[1rem] font-semibold uppercase text-white dark:text-white/50">
                                                        <div>Total Points</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* second-------- */}
                                        <div className="category-link card-data xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900">
                                            <div className="flex flex-row items-start ">
                                                <div className='xxl:w-1/3 xl:w-1/2'>
                                                    <span className="avatar avatar-lg bg-[#dee9eb]  inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 mr-3">
                                                        {/* <i className="ti ti-wallet text-[1.25rem]"></i> */}
                                                        <img src={AvailablePoint} alt="" className='w-10 h-10' />
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <h5 className="text-[1.125rem] text-white font-semibold mb-2">{currentPoints}</h5>
                                                    <div className="flex flex-row text-[1rem] font-semibold uppercase text-white dark:text-white/50">
                                                        <div>Available Points</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* third----- */}
                                        <div className="category-link card-data xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900">
                                            <div className="flex flex-row items-start ">
                                                <div className='xxl:w-1/3 xl:w-1/2'>
                                                    <span className="avatar avatar-lg bg-[#dee9eb]  inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 mr-3">
                                                        {/* <i className="ti ti-wallet text-[1.25rem]"></i> */}
                                                        <img src={PointRequested} alt="" className='w-10 h-10' />

                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <h5 className="text-[1.125rem] font-semibold text-white mb-2">{requestedPoints}</h5>
                                                    <div className="flex flex-row text-[1rem] font-semibold uppercase text-white dark:text-white/50">
                                                        <div>Points Requested</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* fourth------- */}
                                        <div className="category-link card-data xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900">
                                            <div className="flex flex-row items-start ">
                                                <div className='xxl:w-1/3 xl:w-1/2'>
                                                    <span className="avatar avatar-lg  bg-[#dee9eb]  inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 mr-3">
                                                        {/* <i className="ti ti-wallet text-[1.25rem]"></i> */}
                                                        <img src={PointRedeemed} alt="" className='w-10 h-10' />

                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <h5 className="text-[1.125rem] font-semibold text-white mb-2">{redeemPoints}</h5>
                                                    <div className="flex flex-row text-[1rem] font-semibold uppercase text-white dark:text-white/50">
                                                        <div>Points Redeemed</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* link cards----- */}
                                        <Link to="/qr-scanner" className="category-link xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 xl:mt-5">
                                            <div className="flex flex-row items-start mb-4">
                                                <div className='rounded-full w-16 h-16 flex items-center justify-center '>
                                                    <span className="avatar avatar-lg  text-white inline-flex items-center justify-center w-16 h-16 rounded-full">
                                                        {/* <i className="bi bi-qr-code-scan text-[1rem]"></i> */}
                                                        <img src={QRScanner} alt="" className='' />

                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <div className="flex flex-row text-[1rem] text-defaulttextcolor font-semibold dark:text-white/50">
                                                        <div className='pl-3'>QR Scanner</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>

                                        <Link to="/point-history" className="category-link xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 xl:mt-5">
                                            <div className="flex flex-row items-start mb-4">
                                                <div className=' rounded-full w-16 h-16 flex items-center justify-center'>
                                                    <span className="avatar avatar-lg  text-white inline-flex items-center justify-center w-16 h-16 rounded-full ">
                                                        {/* <i className="bi bi-coin text-[1rem]"/> */}
                                                        <img src={PointHistroy} alt="" className='' />
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <div className="flex flex-row text-[1rem] text-defaulttextcolor font-semibold dark:text-white/50">
                                                        <div className='pl-3'>Point History</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link to="/redeem-request" className="category-link xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 xl:mt-5">
                                            <div className="flex flex-row items-start mb-4 ">
                                                <div className='rounded-full w-16 h-16 flex items-center justify-center'>
                                                    <span className="avatar avatar-lg  text-white inline-flex items-center justify-center  w-16 h-16 rounded-full ">
                                                        {/* <i className="ri-gift-line text-[1rem]"></i> */}
                                                        <img src={RedeemRequest} alt="" />
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <div className="flex flex-row text-[1rem] text-defaulttextcolor font-semibold dark:text-white/50">
                                                        <div className='pl-3'>Redeem Request</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link to="/banking-history" className="category-link xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 xl:mt-5">
                                            <div className="flex flex-row items-start mb-4 ">
                                                <div className='rounded-full w-16 h-16 flex items-center justify-center'>
                                                    <span className="avatar avatar-lg  text-white inline-flex items-center justify-center  w-16 h-16 rounded-full">
                                                        {/* <i className="ri-bank-line text-[1rem]"></i> */}
                                                        <img src={BankHistory} alt="" />
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <div className="flex flex-row text-[1rem] text-defaulttextcolor font-semibold dark:text-white/50">
                                                        <div className='pl-3'>Bank History</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link to="/help-and-support" className="category-link xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 xl:mt-5">
                                            <div className="flex flex-row items-start mb-4 ">
                                                <div className='rounded-full w-16 h-16 flex items-center justify-center'>
                                                    <span className="avatar avatar-lg  text-white inline-flex items-center justify-center rounded-full ">
                                                        {/* <i className="ri-questionnaire-line text-[1rem]"></i> */}
                                                        <img src={HelpSupport} alt="" />
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <div className="flex flex-row text-[1rem] text-defaulttextcolor font-semibold dark:text-white/50">
                                                        <div className='pl-3'>Help & Support</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link to="/customer-product" className="category-link xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 xl:mt-5">
                                            <div className="flex flex-row items-start mb-4 ">
                                                <div className=' rounded-full w-16 h-16 flex items-center justify-center'>

                                                    <img src={ViewProduct} alt="" className='' />

                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <div className="flex flex-row text-[1rem] text-defaulttextcolor font-semibold dark:text-white/50">
                                                        <div className='pl-3'>View Products</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>


                                {/* social media cards------------ */}
                                <div className="flex justify-center items-center lg:mt-40 md:mt-16 sm:mt-14 mt-14  lg:mb-1 md:mb-4 sm:mb-4 mb-4 ">
                                <div className='grid grid-cols-5 gap-5'>
                                    {/* facebook link----- */}
                                    <div className="flex items-center md:w-16 md:h-16 w-8 h-8 justify-center bg-white rounded-full hover:bg-primary">
                                        <Link
                                            to="#"
                                            onClick={() => window.open(facebooklink, "_blank")}
                                            className='rounded-full md:w-10 md:h-10 w-5 h-5 flex items-center justify-center'
                                        >
                                            <img src={Facebook} alt="Facebook" />
                                        </Link>
                                    </div>

                                    {/* instagram link----- */}
                                    <div className="flex items-center md:w-16 md:h-16 w-8 h-8 justify-center bg-white rounded-full hover:bg-primary">
                                        <Link
                                            to="#"
                                            onClick={() => window.open(instagramlink, "_blank")}
                                            className='rounded-full md:w-10 md:h-10 w-5 h-5  flex items-center justify-center'
                                        >
                                            <img src={Instagram} alt="Instagram" />
                                        </Link>
                                    </div>

                                    {/* whatsapp link----- */}
                                    <div className="flex items-center md:w-16 md:h-16 w-8 h-8 justify-center bg-white rounded-full hover:bg-primary">
                                        <Link
                                            to="#"
                                            onClick={() => window.open(whatsapplink, "_blank")}
                                            className='rounded-full md:w-10 md:h-10 w-5 h-5  flex items-center justify-center'
                                        >
                                            <img src={WhatsApp} alt="WhatsApp" />
                                        </Link>
                                    </div>

                                    {/* Google Map link----- */}
                                    <div className="flex items-center md:w-16 md:h-16 w-8 h-8 justify-center bg-white rounded-full hover:bg-primary">
                                        <Link
                                            to="#"
                                            onClick={() => window.open(googlemaplink, "_blank")}
                                            className='rounded-full md:w-10 md:h-10 w-5 h-5  flex items-center justify-center'
                                        >
                                            <img src={GoogleMap} alt="Google Map" />
                                        </Link>
                                    </div>

                                    {/* google reviews----- */}
                                    <div className="flex items-center md:w-16 md:h-16 w-8 h-8 justify-center bg-white rounded-full hover:bg-primary">
                                        <Link
                                            to="#"
                                            onClick={() => window.open(googleReviewLink, "_blank")}
                                            className='rounded-full md:w-10 md:h-10 w-5 h-5  flex items-center justify-center'
                                        >
                                            <img src={GoogleReview} alt="Google Map" />
                                        </Link>
                                    </div>
                                    </div>
                                </div>
                                {/* social media cards end------------ */}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default CarpenterDashboard;
