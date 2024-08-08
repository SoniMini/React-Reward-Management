import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '@/components/common/pageheader/pageheader';
import TableComponent from '@/components/ui/tables/tablecompnent';
import TableBoxComponent from '@/components/ui/tables/tableboxheader';
import React, { Fragment, useState } from "react";
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { useNavigate } from 'react-router-dom';
import EditModalComponent from '@/components/ui/models/RewardRequestEdit';

interface RewardRequest {
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

const CarpenterRewardRequest: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [selectedRewardRequest, setSelectedRewardRequest] = useState<RewardRequest | null>(null); // State for selected request
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const navigate = useNavigate(); // Initialize useNavigate

    const { data: rewardrequestData } = useFrappeGetDocList<RewardRequest>('Redeem Request', {
        fields: ['name', 'customer_id', 'total_points', 'current_point_status', 'redeemed_points', 'received_date', 'received_time', 'request_status', 'approved_on', 'approve_time', 'transection_id', 'amount']
    });

    const totalPages = Math.ceil((rewardrequestData?.length || 0) / itemsPerPage);

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
        navigate('/redeemption-history');
        // Implement add product logic here
    };

    // handle edit modal----
    const handleEdit = (rewardRequest: RewardRequest) => {
        setSelectedRewardRequest(rewardRequest); // Set the selected request
        setIsModalOpen(true); // Show the modal
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const handleSubmit = async () => {
        console.log('Submit clicked');
        if (!selectedRewardRequest) return;

        // Get current date and time
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const currentTime = now.toISOString().split('T')[1].split('.')[0]; // Format: HH:MM:SS

        const data = {
            approved_on: currentDate,
            approve_time: currentTime,
            transection_id: selectedRewardRequest.transection_id,
            amount: selectedRewardRequest.amount,
            request_status: selectedRewardRequest.request_status
        };

        try {
            const response = await fetch(`/api/resource/Redeem Request/${selectedRewardRequest.name}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();
            if (response.ok) {
                console.log("Redeem Request updated successfully");
                alert('Redeem Request updated successfully!');
                handleCloseModal();
                // Optionally, you can re-fetch the data here or use a state update to reflect changes.
            } else {
                console.error("Failed to update announcement:", responseData);
                alert('Failed to update Redeem Request.');
            }
        } catch (error) {
            console.error("Error:", error.message || error);
            alert('An error occurred while updating the Redeem Request.');
        }
    }

    const handleCancel = () => {
        console.log('Cancel clicked');
        setIsModalOpen(false); // Close the modal on cancel
    }

    const isApproved = selectedRewardRequest?.request_status === 'Approved';

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
                            buttonText="View Redeemption History" // Custom button text
                            showButton={true} // Show the button
                            icon="" // Empty icon
                            buttonOnClick={handleAddProductClick} // Handle button click
                        />

                        <div className="box-body m-5">
                            <TableComponent<RewardRequest>
                                columns={[
                                    { header: 'Request ID', accessor: 'name' },
                                    { header: 'Carpenter ID', accessor: 'customer_id' },
                                    { header: 'Total Points', accessor: 'total_points' },
                                    { header: 'Current Points', accessor: 'current_point_status' },
                                    { header: 'Redeem Request Points', accessor: 'redeemed_points' },
                                    { header: 'Request Received Date', accessor: 'received_date' },
                                    { header: 'Request Received Time', accessor: 'received_time' },
                                    { header: 'Action', accessor: 'request_status' },
                                ]}
                                data={rewardrequestData || []}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handlePageChange={handlePageChange}
                                showProductQR={false}
                                showEdit={true}
                                onEdit={handleEdit} // Pass the handleEdit function
                                editHeader="Update"
                                columnStyles={{
                                    'Request ID': 'text-[var(--primaries)] font-semibold', // Example style for Request ID column
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
                    question={selectedRewardRequest.name} // Adjust according to your data
                    answer={selectedRewardRequest.redeemed_points || ''} // Adjust according to your data
                    status={selectedRewardRequest.request_status || ''} // Adjust according to your data
                    transactionId={isApproved ? selectedRewardRequest.transection_id || '' : ''} // Conditionally show transactionId
                    amount={isApproved ? selectedRewardRequest.amount || '' : ''} // Conditionally show amount
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    setQuestion={(value) => setSelectedRewardRequest(prev => ({ ...prev, name: value }))}
                    setAnswer={(value) => setSelectedRewardRequest(prev => ({ ...prev, redeemed_points: value }))}
                    setStatus={(value) => setSelectedRewardRequest(prev => ({ ...prev, request_status: value }))}
                    setTransactionId={(value) => setSelectedRewardRequest(prev => ({ ...prev, transection_id: value }))}
                    setAmount={(value) => setSelectedRewardRequest(prev => ({ ...prev, amount: value }))}
                    showTransactionId={isApproved} // Pass the condition to modal
                    showAmount={isApproved} // Pass the condition to modal
                />
            )}
        </Fragment>
    );
};

export default CarpenterRewardRequest;
