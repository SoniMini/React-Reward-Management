import '../../assets/css/style.css';
import '../../assets/css/pages/admindashboard.css';
import Pageheader from '@/components/common/pageheader/pageheader';
import TableComponent from '@/components/ui/tables/tablecompnent';
import TableBoxComponent from '@/components/ui/tables/tableboxheader';
import React, { Fragment, useState, useEffect } from "react";

import axios from 'axios';
import { BASE_URL } from "../../utils/constants";

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

const BankingHistory: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [transactionData, setTransactionData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/method/reward_management_app.api.bank_history.get_bank_history_details`);
                console.log("bank table data",response);
                
                // Ensure response is in the expected format
                if (Array.isArray(response.data)) {
                    setTransactionData(response.data);
                } else {
                    setError("Unexpected response format");
                }

                setLoading(false);
            } catch (error) {
                setError("Error fetching data");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalPages = Math.ceil((transactionData.length || 0) / itemsPerPage);

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
        // Implement add product logic here
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Ensure transactionData is an array before calling map
    const formattedTransactionData = Array.isArray(transactionData) ? transactionData.map(transaction => ({
        ...transaction,
        transfer_date: transaction.transfer_date ? formatDate(transaction.transfer_date) : '',
    })) : [];

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Fragment>
            <Pageheader currentpage="Banking History" activepage="Transaction History" mainpage="Banking History" />

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent 
                            title="Bank History" 
                            onSearch={handleSearch} 
                            onAddButtonClick={handleAddProductClick} 
                            buttonText="Add Announcement" // Custom button text
                            showButton={false} // Show the button
                        />

                        <div className="box-body m-5">
                            <TableComponent<Transaction>
                                columns={[
                                    { header: 'Bank History ID', accessor: 'name' },
                                    { header: 'Redeem Request ID', accessor: 'redeem_request_id' },
                                    { header: 'Mobile Number', accessor: 'mobile_number' },
                                    { header: 'Amount', accessor: 'amount' },
                                    { header: 'Transaction Account', accessor: 'transaction_id' },
                                    { header: 'Transaction Date', accessor: 'transfer_date' },
                                    { header: 'Transaction Time', accessor: 'transfer_time' },
                                ]}
                                data={formattedTransactionData}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handlePageChange={handlePageChange}
                                showProductQR={false} 
                                showEdit={false} 
                                showDelete={false}
                                editHeader='Action'
                                 
                                columnStyles={{
                                    'Transaction ID': 'text-[var(--primaries)] font-semibold', // Example style for QR ID column
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default BankingHistory;
