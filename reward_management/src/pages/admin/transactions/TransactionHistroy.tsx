import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '@/components/common/pageheader/pageheader';
import TableComponent from '@/components/ui/tables/tablecompnent';
import TableBoxComponent from '@/components/ui/tables/tableboxheader';
import React, { Fragment, useState, useEffect } from "react";
import { useFrappeGetDocList } from 'frappe-react-sdk';
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import axios from 'axios';

interface Transaction {
    name: string,
    redeem_request_id?: string,
    carpainter_id: string,
    carpainter_name?: string,
    mobile_number?: string,
    transaction_id?: string,
    transfer_date?: string,
    amount?: number,
    transfer_time?: string
}

const TransactionHistory: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    // const [date, setDate] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [transectionAccount, setTransectionAccount] = useState('');
    const [transferAmount, setTransferAmount] = useState('');




    const { data: transactionData, error } = useFrappeGetDocList<Transaction>('Bank Balance', {
        fields: ['name', 'redeem_request_id', 'carpainter_id', 'carpainter_name', 'mobile_number', 'transaction_id', 'transfer_date', 'amount', 'transfer_time'],
        limit: 0,
        orderBy: {
            field: 'transfer_date',
            order: 'desc',
        },
    });

    if (error) {
        console.error("Error fetching transaction data:", error);
    }

    const totalPages = Math.ceil((transactionData?.length || 0) / itemsPerPage);

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
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formattedTransactionData = transactionData?.map(transaction => ({
        ...transaction,
        transfer_date: transaction.transfer_date ? formatDate(transaction.transfer_date) : '',
    })) || [];


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

    // const formatDateToISO = (dateString: string) => {
    //     const date = new Date(dateString);
    //     const year = date.getFullYear();
    //     const month = (`0${date.getMonth() + 1}`).slice(-2);
    //     const day = (`0${date.getDate()}`).slice(-2);
    //     return `${year}-${month}-${day}`;
    // };

    const filteredData = formattedTransactionData.filter(transaction => {
        const query = searchQuery.toLowerCase();

        // Parse the transfer_date for filtering
        const transactionDateString = transaction.transfer_date;
        const isDateValid = typeof transactionDateString === 'string' && transactionDateString.trim() !== '';
        const transactionDate = isDateValid ? parseDateString(transactionDateString) : null;

        // Check if the transaction date is within the selected date range
        const isWithinDateRange = (!fromDate || (transactionDate && transactionDate >= fromDate)) &&
            (!toDate || (transactionDate && transactionDate <= toDate));

        const matchesSearchQuery =
            (transaction.name && transaction.name.toLowerCase().includes(query)) ||
            (transaction.carpainter_id && transaction.carpainter_id.toLowerCase().includes(query)) ||
            (transaction.redeem_request_id && transaction.redeem_request_id.toString().toLowerCase().includes(query)) ||
            (transaction.carpainter_name && transaction.carpainter_name.toLowerCase().includes(query)) ||
            (transaction.transaction_id && transaction.transaction_id.toString().toLowerCase().includes(query)) ||
            (transaction.amount !== undefined && transaction.amount.toString().toLowerCase().includes(query)) ||
            (transaction.mobile_number && transaction.mobile_number.toLowerCase().includes(query)) ||
            (transaction.transfer_time && transaction.transfer_time.toLowerCase().includes(query));

        // Return true if it is within the date range and matches the search query
        return isWithinDateRange && matchesSearchQuery;
    });

    useEffect(() => {
        document.title = "Trasaction History";
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                window.location.reload();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert]);



    const handleEdit = (transection: Transaction) => {
        setSelectedTransaction(transection);
        // setUpdatedStatus(carpenter.enabled); 
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTransaction(null);
    };

    const handleSubmit = async (selectedTransaction: Transaction) => {
        console.log("Submitting update for:", selectedTransaction);

        if (!selectedTransaction || !selectedTransaction.name) {
            console.error("No carpenter name found for update.");
            alert('Failed to update Registration Request: No carpenter name found.');
            return;
        }

        if (!transectionAccount || !transferAmount) {
            alert("Please enter a valid TransectionAccount and TransferAmount.");
            return;
        }

        // add current date and time ----
        const now = new Date();
        const transferDate = now.toISOString().split('T')[0];
        const transferTime = now.toTimeString().split(' ')[0];

        const data = {
            transaction_id: transectionAccount,
            amount: transferAmount,
            transfer_date: transferDate,
            transfer_time: transferTime,
        };

        try {
            const response = await axios.put(`/api/resource/Bank Balance/${selectedTransaction.name}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                setShowSuccessAlert(true);
                setAlertMessage('Transaction updated successfully');
                setAlertTitle('Success');
            } else {
                throw new Error('Unexpected response from server');
            }
        } catch (error) {
            console.error('Error:', error);
            setAlertMessage('Failed to update transaction');
            setAlertTitle('Error');
            setShowSuccessAlert(true);
        }

    };

    return (
        <Fragment>
            <Pageheader
                currentpage={"Transaction History"}
                activepage={"/transaction-history"}

                activepagename="Transaction History"

            />

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent
                            title="Carpenter Transaction History"
                            onSearch={handleSearch}
                            onAddButtonClick={handleAddProductClick}
                            buttonText="Add Announcement"
                            showButton={false}
                            showFromDate={true}
                            showToDate={true}
                            onDateFilter={handleDateFilter}
                        />

                        <div className="box-body m-5">
                            <TableComponent<Transaction>
                                columns={[
                                    { header: 'Transaction ID', accessor: 'name' },
                                    { header: 'Redeem Request ID', accessor: 'redeem_request_id' },
                                    { header: 'Carpenter ID', accessor: 'carpainter_id' },
                                    { header: 'Carpenter Name', accessor: 'carpainter_name' },
                                    { header: 'Mobile Number', accessor: 'mobile_number' },
                                    { header: 'Reference ID', accessor: 'transaction_id' },
                                    { header: 'Amount', accessor: 'amount' },
                                    { header: 'Transaction Date', accessor: 'transfer_date' },
                                    { header: 'Transaction Time', accessor: 'transfer_time' },
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
                                editHeader="Edit"
                                showDelete={false}
                                columnStyles={{
                                    'Transaction ID': 'text-[var(--primaries)] font-semibold',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>


            {isModalOpen && selectedTransaction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                        <div className="ti-modal-content">
                            <div className="ti-modal-header flex justify-between border-b p-4">
                                <h6 className="modal-title text-1rem font-semibold text-primary">Update Transection ID</h6>
                                <button onClick={handleCloseModal} type="button" className="text-1rem font-semibold text-defaulttextcolor">
                                    <span className="sr-only">Close</span>
                                    <i className="ri-close-line"></i>
                                </button>
                            </div>
                            <div className='p-4'>
                                {selectedTransaction && (
                                    <div className="xl:col-span-12 col-span-12 mb-4">
                                        <label htmlFor="name" className="form-label text-sm text-defaulttextcolor font-semibold">Transection ID</label>
                                        <input
                                            type="text"
                                            className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                            id='name'
                                            value={selectedTransaction.name || ''}
                                            readOnly
                                        />
                                    </div>
                                )}

                                <div className="xl:col-span-12 col-span-12 mb-4">
                                    <label htmlFor="redeem_request_id" className="form-label text-sm text-defaulttextcolor font-semibold">Redeem Request ID</label>
                                    <input
                                        className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                        placeholder="Enter your question here"
                                        id="redeem_request_id"

                                        value={selectedTransaction.redeem_request_id}
                                        readOnly
                                    />
                                </div>

                                <div className="xl:col-span-12 col-span-12 mb-4">
                                    <label htmlFor="carpainter_id" className="form-label text-sm text-defaulttextcolor font-semibold">Carpenter ID</label>
                                    <input
                                        className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                        placeholder="Enter your question here"
                                        id="carpainter_id"

                                        value={selectedTransaction.carpainter_id}
                                        readOnly
                                    />
                                </div>

                                <div className="xl:col-span-12 col-span-12 mb-4">
                                    <label htmlFor="carpainter_name" className="form-label text-sm text-defaulttextcolor font-semibold">Carpenter Name</label>
                                    <input
                                        className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                        placeholder="Enter your question here"
                                        id="carpainter_name"

                                        value={selectedTransaction.carpainter_name}
                                        readOnly
                                    />
                                </div>

                                <div className="xl:col-span-12 col-span-12 mb-4">
                                    <label htmlFor="mobile_number" className="form-label text-sm text-defaulttextcolor font-semibold">Carpenter Mobile Number</label>
                                    <input
                                        className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                        placeholder="Enter your question here"
                                        id="mobile_number"

                                        value={selectedTransaction.mobile_number}
                                        readOnly
                                    />
                                </div>

                                <div className="xl:col-span-12 col-span-12 mb-4">
                                    <label htmlFor="transectionAccount" className="form-label text-sm text-defaulttextcolor font-semibold">Transection Account</label>
                                    <input
                                        className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                        placeholder="Enter Transaction Account"
                                        id="transectionAccount"
                                        value={transectionAccount || ''}
                                        onChange={(e) => setTransectionAccount(e.target.value)}

                                    />
                                </div>
                                <div className="xl:col-span-12 col-span-12 mb-4">
                                    <label htmlFor="transferAmount" className="form-label text-sm text-defaulttextcolor font-semibold">Transfer Amount</label>
                                    <input
                                        className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                        placeholder="Enter Amount"
                                        id="transferAmount"
                                        value={transferAmount || ''}
                                        // onChange={(e) => setTransferAmount(e.target.value)}
                                        onChange={(e) => setTransferAmount(e.target.value)}

                                    />
                                </div>


                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="ti-btn ti-btn-primary bg-primary me-2"
                                        onClick={() => handleSubmit(selectedTransaction)}
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-defaulttextcolor ti-btn text-white"
                                        onClick={handleCloseModal}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {showSuccessAlert && (
                <SuccessAlert title={alertTitle} message={alertMessage}
                    onClose={() => setShowSuccessAlert(false)}
                    onCancel={function (): void {
                        throw new Error('Function not implemented.');
                    }} />
            )}
        </Fragment>
    );
};

export default TransactionHistory;
