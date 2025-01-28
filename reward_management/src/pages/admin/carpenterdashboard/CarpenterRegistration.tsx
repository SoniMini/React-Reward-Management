import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '@/components/common/pageheader/pageheader';
import TableComponent from '@/components/ui/tables/tablecompnent'; // Ensure the import path is correct
import TableBoxComponent from '@/components/ui/tables/tableboxheader';
import React, { Fragment, useState, useEffect } from "react";
import { useFrappeGetDocList } from 'frappe-react-sdk';
import EditModalComponent from '@/components/ui/models/RewardRequestEdit';
import axios from 'axios';
// import { BASE_URL } from "../../../utils/constants";
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import { PulseLoader } from 'react-spinners';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';



interface CarpenterRegistrations {
    name: string;
    carpainter_id?: string;
    carpainter_name?: string;
    mobile_number?: string;
    city?: string;
    registration_date?: string;
    status?: string;
    approved_date?: string;
}

const CarpenterRegistration: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCarpenter, setSelectedCarpenter] = useState<CarpenterRegistrations | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    // const { data: carpenterregisterData } = useFrappeGetDocList<CarpenterRegistrations>('Carpenter Registration', {
    //     fields: ['name', 'carpainter_id', 'carpainter_name', 'mobile_number', 'city', 'registration_date', 'status', 'approved_date'],
    // });
    const { data: carpenterregisterData, isLoading, error } = useFrappeGetDocList<CarpenterRegistrations>('Carpenter Registration', {
        fields: [
            'name',
            'carpainter_id',
            'carpainter_name',
            'mobile_number',
            'city',
            'registration_date',
            'status',
            'approved_date'
        ],
        // limit_start: pageIndex * 10,
        limit: 0,
        orderBy: {
            field: 'creation',
            order: 'asc',
        }
    });


    const notyf = new Notyf({
        position: {
            x: 'right',
            y: 'top',
        },
        duration: 3000,
    });

    useEffect(() => {
        document.title = "Carpenter Registration";
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                window.location.reload();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert]);

    const totalPages = Math.ceil((carpenterregisterData?.length || 0) / itemsPerPage);

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
    };
    const handleDateFilter = (from: Date | null, to: Date | null) => {
        setFromDate(from);
        setToDate(to);
        setCurrentPage(1);
    };

    const handleAddProductClick = () => {
        console.log("Add Product button clicked");
        // Implement add product logic here
    };

    const handleEdit = (carpenter: CarpenterRegistrations) => {
        console.log("Selected carpenter for editing:", carpenter);
        setSelectedCarpenter(carpenter);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        console.log("Closing modal. Selected carpenter:", selectedCarpenter);
        setIsEditModalOpen(false);
        setSelectedCarpenter(null);
    };

    const handleSubmit = async (updatedCarpenter: CarpenterRegistrations) => {
        console.log("Submitting update for:", updatedCarpenter);

        if (!updatedCarpenter || !updatedCarpenter.name) {
            console.error("No carpenter name found for update.");
            alert('Failed to update Registration Request: No carpenter name found.');
            return;
        }
        setLoading(true);

        const now = new Date();
        // Format: YYYY-MM-DD
        const currentDate = now.toISOString().split('T')[0];
        // Format: HH:MM:SS
        const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
        console.log("current date", currentDate);
        console.log("current Time", currentTime);

        const data = {
            approved_date: currentDate,
            approved_time: currentTime,
            status: updatedCarpenter.status
        };

        try {
            const response = await axios.put(`/api/resource/Carpenter%20Registration/${selectedCarpenter.name}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                console.log("Registration Request updated successfully");

                if (updatedCarpenter.status?.toLowerCase() === 'approved') {
                    await updateRegistrationStatus(updatedCarpenter.name, updatedCarpenter.status);
                } else if (updatedCarpenter.status?.toLowerCase() === 'cancel') {
                    await cancelRegistrationStatus(updatedCarpenter.name, updatedCarpenter.status);
                }
                // alert('Registration Request updated successfully!');
                handleCloseModal();
            } else {
                console.error("Failed to update Registration Request:", response.data);
                alert('Failed to update Registration Request.');
            }
        } catch (error) {
            console.error("Error details:", {
                message: error.message,
                response: error.response?.data,
                stack: error.stack,
            });
            alert('An error occurred while updating the Registration Request.');
        }
        finally {
            setLoading(false);
        }
    };


    // Function to call the API for creating a new user
    const updateRegistrationStatus = async (registrationId: string, status: string) => {
        try {
            const response = await axios.post(`/api/method/reward_management_app.api.carpenter_registration.update_registration_request_status`, {
                registration_id: registrationId,
                status: status
            }, {
                headers: {
                    'Content-Type': 'application/json',

                },
            });
            console.log("registration aprroved",response)

            if (response.data.message.status === "success") {
                console.log("Registration request status updated successfully and create a new user");
                // Set the success alert and trigger page reload
                setShowSuccessAlert(true);
                setAlertMessage('Registration Request Approved Successsfully!!!');
                setAlertTitle('Success');
            } else {
                console.error("Failed to update registration request status:", response.data.message);
                // alert(`Error: ${response.data.message.message || "Unknown error"}`);
                notyf.error(`Error: ${response.data.message.message || "Unknown error"}`);

            }
        } catch (error: any) {
            console.error("Error details:", {
                message: error.message,
                response: error.response?.data,
                stack: error.stack,
            });
            // alert(`Error: ${error.response?.data?.message || error.message}`);
            notyf.error(`Error: ${error.response?.data?.message || error.message}`);

        }
    };

    // Function to call the API for delete  a  user
    const cancelRegistrationStatus = async (registrationId: string, status: string) => {
        try {
            const response = await axios.post(`/api/method/reward_management_app.api.carpenter_registration.cancel_customer_registration`, {
                registration_id: registrationId,
                status: status
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log("delete response", response)

            if (response.data.message.status === "success") {
                console.log("Registration request status updated successfully and cancel request successfully.");
                // Set the success alert and trigger page reload
                setShowSuccessAlert(true);
                setAlertMessage('Registration Request Cancelled Successsfully!!!');
                setAlertTitle('Success');
            } else {
                console.error("Failed to update registration request status and delete user/customer: ", response.data.message);
                alert('Failed to update registration request status and delete user/customer.');
            }
        } catch (error) {
            console.error("Error details:", {
                message: error.message,
                response: error.response?.data,
                stack: error.stack,
            });
            alert('An error occurred while updating the registration request status.');
        }
    };









    // const handleStatusUpdate = async (carpenter: CarpenterRegistrations) => {
    //     if (carpenter.status?.toLowerCase() === 'approved') {
    //         await updateRegistrationStatus(carpenter.name, carpenter.status);
    //     }
    // };  



    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

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


    const formattedCarpenterRegistrationData = carpenterregisterData?.map(carpenterregistration => ({
        ...carpenterregistration,
        registration_date: formatDate(carpenterregistration.registration_date),
        approved_date: formatDate(carpenterregistration.approved_date),
    })) || [];



    // Adjusted filtering logic to include all columns
    const filteredData = formattedCarpenterRegistrationData.filter(transaction => {
        const query = searchQuery.toLowerCase();

        // Parse registration_date for filtering
        const registrationDateString = transaction.registration_date;
        const registrationDate = parseDateString(registrationDateString);

        // Parse approved_date for filtering
        const approvedDateString = transaction.approved_date;
        const approvedDate = parseDateString(approvedDateString);

        // Check if the registration_date is within the selected date range
        const isRegistrationDateInRange =
            (!fromDate || (registrationDate && registrationDate >= fromDate)) &&
            (!toDate || (registrationDate && registrationDate <= toDate));

        // Check if the approved_date is within the selected date range
        const isApprovedDateInRange =
            (!fromDate || (approvedDate && approvedDate >= fromDate)) &&
            (!toDate || (approvedDate && approvedDate <= toDate));

        // Check if either date falls within the selected date range
        const isWithinDateRange = isRegistrationDateInRange || isApprovedDateInRange;

        return (
            isWithinDateRange &&
            (
                (transaction.name && transaction.name.toLowerCase().includes(query)) ||
                (transaction.carpainter_id && transaction.carpainter_id.toLowerCase().includes(query)) ||
                (transaction.carpainter_name && transaction.carpainter_name.toLowerCase().includes(query)) ||
                (transaction.mobile_number && transaction.mobile_number.toLowerCase().includes(query)) ||
                (transaction.city && transaction.city.toLowerCase().includes(query)) ||
                (transaction.status && transaction.status.toLowerCase().includes(query))
            )
        );
    });

    const handleCancel = () => {
        console.log("Edit cancelled");
        handleCloseModal();
    };


    return (
        <Fragment>
            {/* <Pageheader currentpage="Carpenter Registration" activepage="Carpenter Dashboard" mainpage="Carpenter Registration" /> */}
            <Pageheader
                currentpage={"Carpenter Registration"}
                activepage={"/carpenter-registration"}

                activepagename='Carpenter Registration'

            />

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent
                            title="Registration Requests"
                            onSearch={handleSearch}
                            onAddButtonClick={handleAddProductClick}
                            buttonText="Add New Product"
                            showButton={false}
                            showFromDate={true}
                            showToDate={true}
                            onDateFilter={handleDateFilter}
                        />

                        <div className="box-body m-5">
                            <TableComponent<CarpenterRegistrations>
                                columns={[
                                    { header: 'Registration ID', accessor: 'name' },
                                    // { header: 'Carpenter ID', accessor: 'carpainter_id' },
                                    { header: 'Carpenter Name', accessor: 'carpainter_name' },
                                    { header: 'Mobile Number', accessor: 'mobile_number' },
                                    { header: 'City', accessor: 'city' },
                                    { header: 'Request Received Date', accessor: 'registration_date' },
                                    { header: 'Status', accessor: 'status' },
                                    { header: 'Approved/Cancel Date', accessor: 'approved_date' },
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
                                iconsDisabled={{
                                    edit: (item) => item.status === 'Approved' || item.status === 'Cancel', // Disable edit if status is inactive
                                }}
                                columnStyles={{
                                    'Registration ID': 'text-[var(--primaries)] font-semibold', // Example style for QR ID column
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {isEditModalOpen && selectedCarpenter && (
                <EditModalComponent
                    title="Edit Carpenter Request"
                    questionLabel="Registration ID"
                    answerLabel="Carpenter Name"
                    statusLabel="Action"
                    question={selectedCarpenter.name}
                    answer={selectedCarpenter.carpainter_name || ''}
                    status={selectedCarpenter.status || ''}
                    onClose={handleCloseModal}
                    onSubmit={() => handleSubmit(selectedCarpenter)}
                    onCancel={handleCancel}
                    setQuestion={(value) => setSelectedCarpenter(prev => prev ? { ...prev, name: value } : null)}
                    setAnswer={(value) => setSelectedCarpenter(prev => prev ? { ...prev, carpainter_name: value } : null)}
                    setStatus={(value) => setSelectedCarpenter(prev => prev ? { ...prev, status: value } : null)} transactionIdLabel={''} amountLabel={''} transactionId={''} amount={''} setTransactionId={function (value: string): void {
                        throw new Error('Function not implemented.');
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    }} setAmount={function (_value: string): void {
                        throw new Error('Function not implemented.');
                    }} showTransactionId={false} showAmount={false} />
            )}
            {showSuccessAlert && (
                <SuccessAlert
                    title={alertTitle}
                    message={alertMessage}
                    showButton={false}
                    showCancleButton={false}
                    showCollectButton={false}
                    showAnotherButton={false}
                    showMessagesecond={false}
                    // message="Customer Registration Approved successfully!"
                    onClose={function (): void {
                        throw new Error('Function not implemented.');
                    }} onCancel={function (): void {
                        throw new Error('Function not implemented.');
                    }} />
            )}

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
                    <PulseLoader color="#054952" loading={loading} size={15} />
                </div>
            )}

        </Fragment>
    );
};

export default CarpenterRegistration;
