import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import React, { Fragment,useState, useEffect } from "react";
import { useFrappeGetDocList } from 'frappe-react-sdk';
import axios from 'axios';
import { BASE_URL, API_KEY, API_SECRET } from "../../../utils/constants";

interface Carpenter {
    name: string,
    full_name?: string,
    mobile_number: string,
    city: string,
    total_points?: number
}

const AdminDashboard: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [productCount, setProductCount] = useState<number>(0);
    const [itemsPerPage] = useState(5); // Number of items per page
    const { data: carpentersData } = useFrappeGetDocList<Carpenter>('Carpenter', {
        fields: ['name', 'full_name', 'mobile_number', 'city', 'total_points']
    });

    console.log("data", carpentersData);

    useEffect(() => {
        // Fetch total product count
        const fetchProductCount = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/resource/Product?fields=["name"]`);
                const totalProducts = response.data.data.length;
                console.log("total",totalProducts); // Get the count of products
                setProductCount(totalProducts);
            } catch (error) {
                console.error("Error fetching product count:", error);
            }
        };

        fetchProductCount();
    }, []);

    // Pagination data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = carpentersData?.slice(indexOfFirstItem, indexOfLastItem) || [];
    const totalPages = Math.ceil((carpentersData?.length || 0) / itemsPerPage);

    // Pagination handlers
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
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
                            <div className="box">
                                <div className="box-body">
                                    <div className="grid grid-cols-12 xl:gap-y-0 gap-4">
                                       
                                    <div className="category-link  xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900">
                                            <div className="flex flex-row items-start mb-4 ">
                                                <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-12 h-12 rounded-sm mb-2 mr-3">
                                                    <i className="ti ti-wallet text-[1.25rem]"></i>
                                                </span>
                                                <div className="flex flex-col items-start">
                                                    <h5 className="text-[1.125rem] font-semibold mb-2" id='totalgeneratedPoint'>{productCount}</h5>
                                                    <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50 ">
                                                        <div>Total Generated Points</div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="category-link  xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900">
                                            <div className="flex flex-row items-start mb-4 ">
                                                <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-12 h-12  rounded-sm mb-2 mr-3">
                                                    <i className="ti ti-wallet text-[1.25rem]"></i>
                                                </span>
                                                <div className="flex flex-col items-start">
                                                    <h5 className="text-[1.125rem] font-semibold mb-2" id='totalscannedPoints'>98,312</h5>
                                                    <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                                                        <div>Total Points Scanned</div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="category-link  xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900">
                                            <div className="flex flex-row items-start mb-4 ">
                                                <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-12 h-12 rounded-sm mb-2 mr-3">
                                                    <i className="ti ti-wallet text-[1.25rem]"></i>
                                                </span>
                                                <div className="flex flex-col items-start">
                                                    <h5 className="text-[1.125rem] font-semibold mb-2" id='totalredeemedPoint'>98,312</h5>
                                                    <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                                                        <div>Total Points Redeemed</div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="category-link  xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900">
                                            <div className="flex flex-row items-start mb-4 ">
                                                <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-12 h-12  rounded-sm mb-2 mr-3">
                                                    <i className="ti ti-wallet text-[1.25rem]"></i>
                                                </span>
                                                <div className="flex flex-col items-start">
                                                    <h5 className="text-[1.125rem] font-semibold mb-2" id='totalrequestPending'>98,312</h5>
                                                    <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                                                        <div>Total Redeemption Request Pending</div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="category-link  xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 mt-5">
                                            <div className="flex flex-row items-start mb-4 ">
                                                <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-12 h-12  rounded-sm mb-2 mr-3">
                                                    <i className="ti ti-wallet text-[1.25rem]"></i>
                                                </span>
                                                <div className="flex flex-col items-start">
                                                    <h5 className="text-[1.125rem] font-semibold mb-2" id='totalavailablePoints'>98,312</h5>
                                                    <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                                                        <div>Total Available Points</div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="category-link  xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 mt-5">
                                            <div className="flex flex-row items-start mb-4 ">
                                                <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-12 h-12 rounded-sm mb-2 mr-3">
                                                    <i className="ti ti-wallet text-[1.25rem]"></i>
                                                </span>
                                                <div className="flex flex-col items-start">
                                                    <h5 className="text-[1.125rem] font-semibold mb-2" id='registeredCarpenter'>98,312</h5>
                                                    <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                                                        <div>Registered Carpenter</div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="category-link  xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 mt-5">
                                            <div className="flex flex-row items-start mb-4 ">
                                                <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-12 h-12 rounded-sm mb-2 mr-3">
                                                    <i className="ti ti-wallet text-[1.25rem]"></i>
                                                </span>
                                                <div className="flex flex-col items-start">
                                                    <h5 className="text-[1.125rem] font-semibold mb-2" id='totalRedeemptions'>98,312</h5>
                                                    <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                                                        <div>Total Redeemptions</div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="category-link  xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 mt-5">
                                            <div className="flex flex-row items-start mb-4 ">
                                                <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-12 h-12 rounded-sm mb-2 mr-3">
                                                    <i className="ti ti-wallet text-[1.25rem]"></i>
                                                </span>
                                                <div className="flex flex-col items-start">
                                                    <h5 className="text-[1.125rem] font-semibold mb-2" id='toatlProducts'>{productCount}</h5>
                                                    <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                                                        <div>Total Product</div>

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
            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <div className="box-header flex justify-between items-center p-4 border-b">
                            <div className="box-title text-[.9375rem] font-bold text-defaulttextcolor">
                                Top 10 Carpenters
                            </div>
                        </div>
                        <div className="box-body m-5">
                            <div className="table-responsive pt-2 ">
                                <table className="table whitespace-nowrap min-w-full">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="text-start p-3 text-[.9375rem] text-defaulttextcolor font-semibold border border-gray-300">S.No</th>
                                            <th scope="col" className="text-start p-3 text-[.9375rem] text-defaulttextcolor font-semibold border border-gray-300">Carpenter ID</th>
                                            <th scope="col" className="text-start p-3 text-[.9375rem] text-defaulttextcolor font-semibold border border-gray-300">Carpenter Name</th>
                                            <th scope="col" className="text-start p-3 text-[.9375rem] text-defaulttextcolor font-semibold border border-gray-300">Mobile Number</th>
                                            <th scope="col" className="text-start p-3 text-[.9375rem] text-defaulttextcolor font-semibold border border-gray-300">City</th>
                                            <th scope="col" className="text-start p-3 text-[.9375rem] text-defaulttextcolor font-semibold border border-gray-300">Points</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((carpenter, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="p-3 text-[0.9375rem] font-medium text-defaulttextcolor whitespace-nowrap border border-gray-300">{index + 1}</td>
                                                <td className="p-3 text-[0.9375rem] font-semibold text-[var(--primaries)]  whitespace-nowrap border border-gray-300">{carpenter.name}</td>
                                                <td className="p-3 text-[0.9375rem] font-medium text-defaulttextcolor  whitespace-nowrap border border-gray-300">{carpenter.full_name}</td>
                                                <td className="p-3 text-[0.9375rem] font-medium text-defaulttextcolor whitespace-nowrap border border-gray-300">{carpenter.mobile_number}</td>
                                                <td className="p-3 text-[0.9375rem] font-medium text-defaulttextcolor  whitespace-nowrap border border-gray-300">{carpenter.city}</td>
                                                <td className="p-3 text-[0.9375rem] font-medium text-defaulttextcolor  whitespace-nowrap border border-gray-300">{carpenter.total_points}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                        <div className="box-footer p-4 border-t">
                            <div className="sm:flex items-center">
                                <div className="text-defaulttextcolor dark:text-defaulttextcolor/70 font-normal text-[0.913rem]">
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
                                                        className={`page-link px-2 rounded-md ${currentPage === index + 1 ? 'text-white bg-blue-800' : 'bg-gray-200'}`}
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
                                            
        </Fragment>
    );
};

export default AdminDashboard;
