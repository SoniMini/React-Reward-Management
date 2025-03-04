import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import React, { Fragment, useState, useEffect } from "react";
import { useFrappeGetDocList } from 'frappe-react-sdk';
import axios from 'axios';
import TotalPoints from '../../../assets/images/reward_management/01.png';
import AvailablePoint from '../../../assets/images/reward_management/02.png';
import PointRequested from '../../../assets/images/reward_management/03.png';
import TotalPrpducts from '../../../assets/images/reward_management/in-stock (1).png';
import Carpenter from '../../../assets/images/reward_management/06.png';
import QRScanner from '../../../assets/images/reward_management/05.png';
import TotalPointsGenerated from '../../../assets/images/reward_management/stars.png';
import RedeemRequest from '../../../assets/images/reward_management/10.png';

interface Carpenter {
    name: string;
    full_name?: string;
    mobile_number: string;
    city: string;
    total_points?: number;
}

interface User {
    name: string;
    mobile_no: string;
}

const AdminDashboard: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [productCount, setProductCount] = useState<number>(0);
    const [redemptionsCount, setRedemptionsCount] = useState<number>(0);
    const [pendingRedeemptionCount, setPendingRedeemptionCount] = useState<number>(0);
    const [totalGeneratedQrPoint, setTotalGeneratedQrPoint] = useState<number>(0);
    const [countTotalScannedPoint, setCountTotalScannedPoint] = useState<number>(0);
    const [countTotalRedeemedpoints, setCountTotalRedeemedpoints] = useState<number>(0);
    const [countTotalAvailablePoints, setCountTotalAvailablePoints] = useState<number>(0);
    const [countTotalRegisteredCarpenter, setCountTotalRegisteredCarpenter] = useState<number>(0);
    const [itemsPerPage] = useState(5);

    const { data: userData } = useFrappeGetDocList<User>('User', {
        fields: ['mobile_no', 'name']
    });

    const { data: carpentersData } = useFrappeGetDocList<Carpenter>('Carpenter', {
        fields: ['name', 'full_name', 'mobile_number', 'city', 'total_points']
    });

    useEffect(() => {
        document.title="Admin Dashboard";
        const fetchData = async () => {
            try {
                const [productsRes, redemptionsRes, pendingRes, qrPointsRes, pointsRes, carpentersRes] = await Promise.all([
                    axios.get(`/api/resource/Product?fields=["name"]`),
                    axios.get(`/api/method/reward_management_app.api.admin_dashboards_cards.count_redemptions`),
                    axios.get(`/api/method/reward_management_app.api.admin_dashboards_cards.count_redeem_request`),
                    axios.get(`/api/method/reward_management_app.api.admin_dashboards_cards.total_points_of_qr_code`),
                    axios.get(`/api/method/reward_management_app.api.admin_dashboards_cards.get_total_points_data`),
                    axios.get(`/api/method/reward_management_app.api.admin_dashboards_cards.count_total_customers`)
                ]);

                setProductCount(productsRes.data.data.length);
                setRedemptionsCount(redemptionsRes.data.message);
                setPendingRedeemptionCount(pendingRes.data.message);
                setTotalGeneratedQrPoint(qrPointsRes.data.message.total_points);
                
                const pointsData = pointsRes.data.message;
                setCountTotalScannedPoint(pointsData.total_points || 0);
                setCountTotalRedeemedpoints(pointsData.total_redeem_points || 0);
                setCountTotalAvailablePoints(pointsData.total_available_points || 0);
                
                setCountTotalRegisteredCarpenter(carpentersRes.data.message);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchData();
    }, []);


   // Extract mobile numbers from User data
   const validMobileNumbers = userData?.map(user => user.mobile_no) || [];

   // Filter Carpenters Data
   const filteredCarpenters = carpentersData?.filter(carpenter => validMobileNumbers.includes(carpenter.mobile_number)) || [];

   // Sort by total_points in descending order and get the top 10 carpenters
   const top10Carpenters = filteredCarpenters
       .sort((a, b) => (b.total_points || 0) - (a.total_points || 0))
       .slice(0, 10);

   // Pagination
   const totalPages = Math.ceil((top10Carpenters.length || 0) / itemsPerPage);
   const currentItems = top10Carpenters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

   const handlePrevPage = () => {
       if (currentPage > 1) setCurrentPage(currentPage - 1);
   };

   const handleNextPage = () => {
       if (currentPage < totalPages) setCurrentPage(currentPage + 1);
   };

   const handlePageChange = (pageNumber: number) => {
       setCurrentPage(pageNumber);
   };
    return (
        <Fragment>
            <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
                <div>
                    <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0">
                        Admin Dashboard
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-x-6">
                <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 col-span-12">
                    <div className="grid grid-cols-12 gap-x-6">
                        <div className="xl:col-span-12 col-span-12">
                            <div className="">
                                <div className="grid grid-cols-12 xl:gap-y-0 gap-4">
                                    {/* Dashboard Cards */}
                                    {[{
                                        id: 'totalgeneratedPoint',
                                        value: totalGeneratedQrPoint,
                                        label: 'Total Generated Points',
                                        image: TotalPointsGenerated

                                    }, {
                                        id: 'totalscannedPoints',
                                        value: countTotalScannedPoint,
                                        label: 'Total Points Scanned',
                                        image: QRScanner

                                    }, {
                                        id: 'totalredeemedPoint',
                                        value: countTotalRedeemedpoints,
                                        label: 'Total Points Redeemed',
                                        image: TotalPoints

                                    }, {
                                        id: 'totalrequestPending',
                                        value: pendingRedeemptionCount,
                                        label: 'Total Redemption Request Pending',
                                        image: PointRequested

                                    }, {
                                        id: 'totalavailablePoints',
                                        value: countTotalAvailablePoints,
                                        label: 'Total Available Points',
                                        image: AvailablePoint

                                    }, {
                                        id: 'registeredCarpenter',
                                        value: countTotalRegisteredCarpenter,
                                        label: 'Registered Carpenter',
                                        image: Carpenter

                                    }, {
                                        id: 'totalRedeemptions',
                                        value: redemptionsCount,
                                        label: 'Total Redeemptions',
                                        image: RedeemRequest

                                    }, {
                                        id: 'toatlProducts',
                                        value: productCount,
                                        label: 'Total Product',
                                        image: TotalPrpducts

                                    }].map((card, index) => (
                                        <div key={index} className="category-link card-data xxl:col-span-3 xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4  shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 mt-5">
                                            <div className="flex flex-row items-start ">
                                                <div className='xxl:w-1/4'>
                                                <span className="avatar avatar-lg bg-[#dee9eb] text-white inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 mr-4">
                                                    {/* <i className="ti ti-wallet text-[1.25rem]"></i> */}
                                                    <img src={card.image} alt={`${card.label} icon`} className='w-10 h-10 ' />
                                                     </span>
                                                </div>
                                                <div className="flex flex-col items-start ">
                                                    <h5 className="text-[1.125rem] font-semibold text-white test white mb-2" id={card.id}>{card.value}</h5>
                                                    <div className="flex flex-row text-[1rem] text-white uppercase font-semibold dark:text-white/50">
                                                        <div>{card.label}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <div className="box-header flex justify-between items-center p-4 border-b">
                            <div className="box-title text-[.9375rem] font-bold text-defaulttextcolor">
                                Top 10 Carpenters
                            </div>
                        </div>
                        <div className="box-body m-5 ">
                            <div className="table-responsive pt-2 ">
                                <div className='overflow-scroll'>
                                <table className="table whitespace-nowrap min-w-full ">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="text-start p-3 text-[.9375rem] text-defaulttextcolor font-semibold border border-gray-300">S.No</th>
                                            <th scope="col" className="text-start p-3 text-[.9375rem] text-defaulttextcolor font-semibold border border-gray-300">Carpenter ID</th>
                                            <th scope="col" className="text-start p-3 text-[.9375rem] text-defaulttextcolor font-semibold border border-gray-300">Carpenter Name</th>
                                            <th scope="col" className="text-start p-3 text-[.9375rem] text-defaulttextcolor font-semibold border border-gray-300">Mobile Number</th>
                                            <th scope="col" className="text-start p-3 text-[.9375rem] text-defaulttextcolor font-semibold border border-gray-300">City</th>
                                            <th scope="col" className="text-start p-3 text-[.9375rem] text-defaulttextcolor font-semibold border border-gray-300">Total Points</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.length > 0 ? (
                                            currentItems.map((carpenter, index) => (
                                                <tr key={index}>
                                                    <td className="text-start p-3 border border-gray-300  text-defaultsize font-medium text-defaulttextcolor ">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                    <td className="text-start p-3 border border-gray-300 text-primary text-defaultsize font-semibold">{carpenter.name}</td>
                                                    <td className="text-start p-3 border border-gray-300  text-defaultsize font-medium text-defaulttextcolor ">{carpenter.full_name}</td>
                                                    <td className="text-start p-3 border border-gray-300  text-defaultsize font-medium text-defaulttextcolor ">{carpenter.mobile_number}</td>
                                                    <td className="text-start p-3 border border-gray-300  text-defaultsize font-medium text-defaulttextcolor ">{carpenter.city}</td>
                                                    <td className="text-start p-3 border border-gray-300  text-defaultsize font-medium text-defaulttextcolor ">{carpenter.total_points}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="text-center p-3 border border-gray-300">No data available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                </div>
                                <div className="box-footer p-4 border-t">
                                    <div className="sm:flex items-center">
                                        <div className="text-defaulttextcolor dark:text-defaulttextcolor/70 font-normal text-defaultsize">
                                            Showing {currentItems.length} Entries <i className="bi bi-arrow-right ms-2 font-semibold"></i>
                                        </div>
                                        <div className="ms-auto">
                                            <nav aria-label="Page navigation" className="pagination-style-4">
                                                <ul className="ti-pagination flex items-center px-3 mb-0">
                                                    <li className="page-item px-2">
                                                        <button
                                                            className="page-link"
                                                            onClick={handlePrevPage}
                                                            disabled={currentPage === 1}
                                                        >
                                                            Prev
                                                        </button>
                                                    </li>
                                                    {Array.from({ length: totalPages }, (_, index) => (
                                                        <li className="page-item px-2" key={index + 1}>
                                                            <button
                                                                className={`page-link px-2 rounded-[5px] ${currentPage === index + 1 ? 'text-white bg-primary' : 'bg-[#dee9eb]'}`}
                                                                onClick={() => handlePageChange(index + 1)}
                                                            >
                                                                {index + 1}
                                                            </button>
                                                        </li>
                                                    ))}
                                                    <li className="page-item px-2">
                                                        <button
                                                            className="page-link"
                                                            onClick={handleNextPage}
                                                            disabled={currentPage === totalPages}
                                                        >
                                                            Next
                                                        </button>
                                                    </li>
                                                </ul>
                                            </nav>
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

export default AdminDashboard;
