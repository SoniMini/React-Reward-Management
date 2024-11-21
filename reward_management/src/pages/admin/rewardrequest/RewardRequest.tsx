import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '@/components/common/pageheader/pageheader';
import TableComponent from '@/components/ui/tables/tablecompnent';
import TableBoxComponent from '@/components/ui/tables/tableboxheader';
import React, { Fragment, useState,useEffect } from "react";
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { useNavigate } from 'react-router-dom';
import EditModalComponent from '@/components/ui/models/RewardRequestEdit';
import axios from 'axios';
// import { BASE_URL } from "../../../utils/constants";
import SuccessAlert from '@/components/ui/alerts/SuccessAlert';

interface RewardRequest {
    name: string;
    customer_id?: string;
    full_name?:string;
    redeemed_points: string;
    current_point_status?: number;
    total_points?: string;
    transection_id?: string;
    request_status?: string;
    mobile_number?: string;
    received_date?: string;
    received_time?: string;
    amount?: string;
    approved_on?: string;
    approve_time?: string;
}

// Utility function to format dates
const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const CarpenterRewardRequest: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); 
    const [selectedRewardRequest, setSelectedRewardRequest] = useState<RewardRequest | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const navigate = useNavigate(); 
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);

    const { data: rewardrequestData } = useFrappeGetDocList<RewardRequest>('Redeem Request', {
        fields: ['name', 'customer_id','full_name','mobile_number', 'total_points', 'current_point_status', 'redeemed_points', 'received_date', 'received_time', 'request_status', 'approved_on', 'approve_time', 'transection_id', 'amount']
    });

    const formattedData = rewardrequestData?.map(request => ({
        ...request,
        received_date: formatDate(request.received_date),
        approved_on: formatDate(request.approved_on),
        // Format other dates as needed
    }));

    console.log("formattedData------->",formattedData);

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
            const recivedDateString = request.received_date;
            const isDateValid = typeof recivedDateString === 'string' && recivedDateString.trim() !== '';
            const recivedDate = isDateValid ? parseDateString(recivedDateString) : null;
        
            // Check if the received date is within the selected date range
            const isWithinDateRange = (!fromDate || (recivedDate && recivedDate >= fromDate)) &&
                                      (!toDate || (recivedDate && recivedDate <= toDate));
        
            return (
                isWithinDateRange && 
                (request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                request.customer_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (request.redeemed_points !== undefined && request.redeemed_points.toString().toLowerCase().includes(searchQuery)) ||
                (request.total_points !== undefined && request.total_points.toString().toLowerCase().includes(searchQuery)) ||
                (request.received_date !== undefined && request.received_date.toString().toLowerCase().includes(searchQuery)) ||
                (request.received_time !== undefined && request.received_time.toString().toLowerCase().includes(searchQuery)) ||
                (request.current_point_status !== undefined && request.current_point_status.toString().toLowerCase().includes(searchQuery)) ||
                (request.mobile_number !== undefined && request.mobile_number.toString().toLowerCase().includes(searchQuery)) ||
                request.request_status?.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        });

    const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);

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
        navigate('/redeemption-history');
        // Implement add product logic here
    };

    // handle edit modal----
    const handleEdit = (rewardRequest: RewardRequest) => {
        setSelectedRewardRequest(rewardRequest);
        setIsModalOpen(true); 
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const handleSubmit = async () => {
        console.log('Submit clicked');
        if (!selectedRewardRequest) return;
        console.log('Transaction ID:', selectedRewardRequest.transection_id); 
    
        // Get current date and time
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0]; 
        const currentTime = now.toISOString().split('T')[1].split('.')[0]; 
    
        const data = {
            approved_on: currentDate,
            approve_time: currentTime,
            transaction_id: selectedRewardRequest.transection_id,
            amount: selectedRewardRequest.amount,
            action: selectedRewardRequest.request_status, 
            request_id: selectedRewardRequest.name,
        };
    
        try {
            const response = await axios.post(`/api/method/reward_management_app.api.admin_redeem_request.update_redeem_request_status`, data);
    
            if (response.status === 200) {
                console.log("Redeem Request updated successfully");
                // alert('Redeem Request updated successfully!');
                setShowSuccessAlert(true);
                handleCloseModal();
                // Optionally, you can re-fetch the data here or use a state update to reflect changes.
            } else {
                console.error("Failed to update Redeem Request:", response.data);
                alert('Failed to update Redeem Request.');
            }
        } catch (error) {
            console.error("Error:", error.message || error);
            alert('An error occurred while updating the Redeem Request.');
        }
    };
    
    const handleCancel = () => {
        console.log('Cancel clicked');
        setIsModalOpen(false); 
    }

    const isApproved = selectedRewardRequest?.request_status === 'Approved';

    useEffect(()=>{
        document.title="Reward Request";
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                window.location.reload(); 
            }, 3000); 
            return () => clearTimeout(timer);
        }
    },[showSuccessAlert]);

    return (
        <Fragment>
            {/* <Pageheader currentpage="Reward Request" activepage="Reward Request" mainpage="Reward Request" /> */}
            <Pageheader 
                currentpage={"Reward Request"} 
                activepage={"/redeemption-request"} 
              
                activepagename="Reward Request"
               
            />

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent
                            title="Redeemption Requests"
                            onSearch={handleSearch}
                            onAddButtonClick={handleAddProductClick}
                            buttonText="View Redeemption History" 
                            showButton={true} 
                            icon="" 
                            buttonOnClick={handleAddProductClick}
                            showFromDate={true}
                            showToDate={true}
                            onDateFilter={handleDateFilter}
                        />

                        <div className="box-body m-5">
                            <TableComponent<RewardRequest>
                                columns={[
                                    { header: 'Request ID', accessor: 'name' },
                                    { header: 'Carpenter ID', accessor: 'customer_id' },
                                    { header: 'Carpenter Name', accessor: 'full_name' },
                                    { header: 'Mobile Number', accessor: 'mobile_number' },
                                    { header: 'Total Points', accessor: 'total_points' },
                                    { header: 'Current Points', accessor: 'current_point_status' },
                                    { header: 'Redeem Request Points', accessor: 'redeemed_points' },
                                    { header: 'Request Received Date', accessor: 'received_date' },
                                    { header: 'Request Received Time', accessor: 'received_time' },
                                    { header: 'Action', accessor: 'request_status' },
                                ]}
                                data={filteredData || []}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handlePageChange={handlePageChange}
                                showProductQR={false}
                                showEdit={true}
                                onEdit={handleEdit}
                                editHeader="Update"
                                columnStyles={{
                                    'Request ID': 'text-[var(--primaries)] font-semibold',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Render the modal */}
            {isModalOpen && selectedRewardRequest && (
                <EditModalComponent
                    title="Edit Reward Request"
                    questionLabel="Request ID"
                    answerLabel="Amount"
                    statusLabel="Action"
                    transactionIdLabel="Transaction ID"
                    amountLabel="Amount"
                    question={selectedRewardRequest.name} 
                    answer={selectedRewardRequest.redeemed_points || ''} 
                    status={selectedRewardRequest.request_status || ''} 
                    transactionId={isApproved ? selectedRewardRequest.transection_id || '' : ''} 
                    amount={isApproved ? selectedRewardRequest.amount || '' : ''} 
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    setQuestion={(value) => setSelectedRewardRequest(prev => ({ ...prev, name: value }))}
                    setAnswer={(value) => setSelectedRewardRequest(prev => ({ ...prev, redeemed_points: value }))}
                    setStatus={(value) => setSelectedRewardRequest(prev => ({ ...prev, request_status: value }))}
                    setTransactionId={(value) => setSelectedRewardRequest(prev => ({ ...prev, transection_id: value }))}
                    setAmount={(value) => setSelectedRewardRequest(prev => ({ ...prev, amount: value }))}
                    showTransactionId={isApproved} 
                    showAmount={isApproved} 
                />
            )}
             {showSuccessAlert && (
                <SuccessAlert
                    showButton={false}
                    showCancleButton={false}
                    showCollectButton={false}
                    showAnotherButton={false}
                    showMessagesecond={false}
                    message="Redeem Request Update Successfully!!"
                    onClose={() => setShowSuccessAlert(false)} 
                    onCancel={function (): void {
                        throw new Error('Function not implemented.');
                    } }                />
            )}
        </Fragment>
    );
};

export default CarpenterRewardRequest;
