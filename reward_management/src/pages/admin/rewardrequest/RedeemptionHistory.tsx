// pages/ProductMaster.tsx

import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '@/components/common/pageheader/pageheader';
import TableComponent from '@/components/ui/tables/tablecompnent';
import TableBoxComponent from '@/components/ui/tables/tableboxheader';
import React, { Fragment, useState ,useEffect } from "react";
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { useNavigate } from 'react-router-dom'; 

interface RewardRequestHistory {
    name: string,
    customer_id?: string,
    full_name?:string,
    redeemed_points: string,
    current_point_status?: number,
    total_points?: string,
    transection_id?: string,
    request_status?: string,
    mobile_number?: string,
    received_date?: string,
    received_time?: string,
    amount?: string,
    approved_on?: string,
    approve_time?: string,
}

// Utility function to format dates
const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2); 
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};


const RedeemptionHistory: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); 
    const navigate = useNavigate(); 
    const [searchQuery, setSearchQuery] = useState('');
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);

    const { data: rewardrequesthistoryData } = useFrappeGetDocList<RewardRequestHistory>('Redeem Request', {
        fields: ['name', 'customer_id', 'total_points', 'current_point_status','full_name', 'redeemed_points','mobile_number' ,'received_date', 'received_time', 'request_status', 'approved_on', 'approve_time', 'transection_id', 'amount'],
        limit: 0,
    });
    const formattedData = rewardrequesthistoryData?.map(request => ({
        ...request,
        received_date: formatDate(request.received_date),
        approved_on: formatDate(request.approved_on),
        // Format other dates as needed
    }));
    const parseDateString = (dateString: string): Date | null => {
        if (typeof dateString !== 'string') {
            console.error("Expected a string, but received:", dateString);
            return null;
        }
        const parts = dateString.split('-');
        if (parts.length !== 3) {
            console.error("Invalid date format:", dateString);
            return null;
        }
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; 
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
    };


         // Filter data based on search query
         const filteredData = formattedData?.filter(request => {
            // Parse the approved_on date string into a Date object
            const approvedDateString = request.approved_on; 
            const isDateValid = typeof approvedDateString === 'string' && approvedDateString.trim() !== '';
            const approvedDate = isDateValid ? parseDateString(approvedDateString) : null;
    
            // Check if the approved_on date is within the selected date range
            const isWithinDateRange = (!fromDate || (approvedDate && approvedDate >= fromDate)) &&
                (!toDate || (approvedDate && approvedDate <= toDate));
    
            return (
                request.request_status === "Approved" &&
                isWithinDateRange &&
                (
                    request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    request.customer_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (request.redeemed_points !== undefined && request.redeemed_points.toString().toLowerCase().includes(searchQuery)) ||
                    (request.approved_on !== undefined && request.approved_on.toString().toLowerCase().includes(searchQuery)) ||
                    (request.approve_time !== undefined && request.approve_time.toString().toLowerCase().includes(searchQuery)) ||
                    (request.current_point_status !== undefined && request.current_point_status.toString().toLowerCase().includes(searchQuery)) ||
                    request.request_status?.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        });

    const totalPages = Math.ceil((formattedData?.length || 0) / itemsPerPage);

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

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
        console.log("Search value:", value);
        // Implement search logic here
    };
    const handleDateFilter = (from: Date | null, to: Date | null) => {
        setFromDate(from);
        setToDate(to);
        // Reset to the first page
        setCurrentPage(1);
    };

    const handleAddProductClick = () => {
        console.log("Add Product button clicked");
        navigate('/redeemption-request');
        // Implement add product logic here
    };
    useEffect(()=>{
        document.title="Redeemption History";
    });

    return (
        <Fragment>
            {/* <Pageheader currentpage="Reward Request" activepage="Reward Request" mainpage="Reward Request" /> */}
            <Pageheader
                currentpage={"Reward History"}
                activepage={"/redeemption-request"}
                mainpage={"/redeemption-history"}
                activepagename='Reward Request'
                mainpagename='Reward History'
            />

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent 
                            title="Redeemption Request History" 
                            onSearch={handleSearch} 
                            onAddButtonClick={handleAddProductClick} 
                            buttonText="Back" 
                            showButton={true}
                            icon="ri-arrow-left-line"
                            showFromDate={true}
                            showToDate={true}
                            onDateFilter={handleDateFilter}
                        />

                        <div className="box-body m-5">
                            <TableComponent<RewardRequestHistory>
                                columns={[
                                    { header: 'Request ID', accessor: 'name' },
                                    { header: 'Carpenter ID', accessor: 'customer_id' },
                                    { header: 'Carpenter Name', accessor: 'full_name' },
                                    { header: 'Mobile Number', accessor: 'mobile_number' },
                
                                    { header: 'Current Points', accessor: 'current_point_status' },
                                    { header: 'Redeem Request Points', accessor: 'redeemed_points' },
                                    { header: 'Approved Date', accessor: 'approved_on' },
                                    { header: 'Approved Time', accessor: 'approve_time' },
                                  
                                   
                                 
                                ]}
                                data={filteredData || []}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handlePageChange={handlePageChange}
                                showProductQR={false} 
                                showEdit={false} 
                            
                                columnStyles={{
                                    'Request ID': 'text-[var(--primaries)] font-semibold', // Example style for QR ID column
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};
export default RedeemptionHistory;
