import '../../assets/css/style.css';

import React, { Fragment, useState, useEffect } from "react";
import axios from 'axios';
import { BASE_URL, API_KEY, API_SECRET } from "../../utils/constants";
import { Link } from 'react-router-dom';



const CarpenterDashboard: React.FC = () => {


    const [productCount, setProductCount] = useState<number>(0);






    useEffect(() => {
        // Fetch total product count
        const fetchProductCount = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/resource/Product?fields=["name"]`);
                const totalProducts = response.data.data.length;
                console.log("total", totalProducts); // Get the count of products
                setProductCount(totalProducts);
            } catch (error) {
                console.error("Error fetching product count:", error);
            }
        };

        fetchProductCount();
    }, []);
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
                            <div className="box">
                                <div className="box-body">
                                    <div className="grid grid-cols-12 xl:gap-y-0 gap-4">

                                        <div className="category-link  xxl:col-span-4 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900">
                                            <div className="flex flex-row items-start mb-4 ">
                                                <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-12 h-12 rounded-sm mb-2 mr-3">
                                                    <i className="ti ti-wallet text-[1.25rem]"></i>
                                                </span>
                                                <div className="flex flex-col items-start">
                                                    <h5 className="text-[1.125rem] font-semibold mb-2" id='totalgeneratedPoint'>{productCount}</h5>
                                                    <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50 ">
                                                        <div>Total Points</div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="category-link  xxl:col-span-4 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900">
                                            <div className="flex flex-row items-start mb-4 ">
                                                <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-12 h-12  rounded-sm mb-2 mr-3">
                                                    <i className="ti ti-wallet text-[1.25rem]"></i>
                                                </span>
                                                <div className="flex flex-col items-start">
                                                    <h5 className="text-[1.125rem] font-semibold mb-2" id='totalscannedPoints'>98,312</h5>
                                                    <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                                                        <div>Available Total Points</div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="category-link  xxl:col-span-4 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900">
                                            <div className="flex flex-row items-start mb-4 ">
                                                <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-12 h-12 rounded-sm mb-2 mr-3">
                                                    <i className="ti ti-wallet text-[1.25rem]"></i>
                                                </span>
                                                <div className="flex flex-col items-start">
                                                    <h5 className="text-[1.125rem] font-semibold mb-2" id='totalredeemedPoint'>98,312</h5>
                                                    <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                                                        <div>Points Redeemed</div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Link to="/banking-history" className="category-link xxl:col-span-4 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 mt-5">
                                            <div className="flex flex-row items-start mb-4">
                                                <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-12 h-12 rounded-sm mb-2 mr-3">
                                                    <i className="ti ti-wallet text-[1.25rem]"></i>
                                                </span>
                                                <div className="flex flex-col items-start">
                                                    <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                                                        <div>QR Scanner</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="category-link  xxl:col-span-4 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 mt-5">
                                            <div className="flex flex-row items-start mb-4 ">
                                                <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-12 h-12  rounded-sm mb-2 mr-3">
                                                    <i className="ti ti-wallet text-[1.25rem]"></i>
                                                </span>
                                                <div className="flex flex-col items-start">

                                                    <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                                                        <div>Point History</div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="category-link  xxl:col-span-4 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 mt-5">
                                            <div className="flex flex-row items-start mb-4 ">
                                                <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-12 h-12 rounded-sm mb-2 mr-3">
                                                    <i className="ti ti-wallet text-[1.25rem]"></i>
                                                </span>
                                                <div className="flex flex-col items-start">

                                                    <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                                                        <div>Redeem Request</div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="category-link  xxl:col-span-4 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 mt-5">
                                            <div className="flex flex-row items-start mb-4 ">
                                                <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-12 h-12 rounded-sm mb-2 mr-3">
                                                    <i className="ti ti-wallet text-[1.25rem]"></i>
                                                </span>
                                                <div className="flex flex-col items-start">

                                                    <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                                                        <div>Bank History</div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="category-link  xxl:col-span-4 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 mt-5">
                                            <div className="flex flex-row items-start mb-4 ">
                                                <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-12 h-12 rounded-sm mb-2 mr-3">
                                                    <i className="ti ti-wallet text-[1.25rem]"></i>
                                                </span>
                                                <div className="flex flex-col items-start">

                                                    <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                                                        <div>Help and Support</div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>
            </div>



        </Fragment>
    );
};

export default CarpenterDashboard;
