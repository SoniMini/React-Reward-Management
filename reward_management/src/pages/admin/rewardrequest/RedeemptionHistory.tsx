// pages/ProductMaster.tsx

import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '@/components/common/pageheader/pageheader';
import TableComponent from '@/components/ui/tables/tablecompnent';
import TableBoxComponent from '@/components/ui/tables/tableboxheader';
import React, { Fragment, useState } from "react";
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { useNavigate } from 'react-router-dom'; 

interface RewardRequestHistory {
    name: string,
    customer_id?: string,
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

const RedeemptionHistory: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const navigate = useNavigate(); 

    const { data: rewardrequesthistoryData } = useFrappeGetDocList<RewardRequestHistory>('Redeem Request', {
        fields: ['name', 'customer_id', 'total_points', 'current_point_status', 'redeemed_points', 'received_date', 'received_time', 'request_status', 'approved_on', 'approve_time', 'transection_id', 'amount']
    });

    const totalPages = Math.ceil((rewardrequesthistoryData?.length || 0) / itemsPerPage);

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
        console.log("Search value:", value);
        // Implement search logic here
    };

    const handleAddProductClick = () => {
        console.log("Add Product button clicked");
        navigate('/redeemption-request');
        // Implement add product logic here
    };

    return (
        <Fragment>
            <Pageheader currentpage="Reward Request" activepage="Reward Request" mainpage="Reward Request" />

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent 
                            title="Redeemption Requests" 
                            onSearch={handleSearch} 
                            onAddButtonClick={handleAddProductClick} 
                            buttonText="Back" // Custom button text
                            showButton={true} // Show the button
                            icon="ri-arrow-left-line"
                        />

                        <div className="box-body m-5">
                            <TableComponent<RewardRequestHistory>
                                columns={[
                                    { header: 'Request ID', accessor: 'name' },
                                    { header: 'Carpenter ID', accessor: 'customer_id' },
                
                                    { header: 'Current Points', accessor: 'current_point_status' },
                                    { header: 'Redeem Request Points', accessor: 'redeemed_points' },
                                    { header: 'Approved Date', accessor: 'approved_on' },
                                    { header: 'Approved Time', accessor: 'approve_time' },
                                  
                                   
                                 
                                ]}
                                data={rewardrequesthistoryData || []}
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
