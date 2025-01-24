import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '@/components/common/pageheader/pageheader';
import TableComponent from '@/components/ui/tables/tablecompnent';
import TableBoxComponent from '@/components/ui/tables/tableboxheader';
import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { BASE_URL } from "../../../utils/constants";

interface ProductQRHistory {
    name: string,
    product_qr_name?: string,
    product_table_name: string,
    redeem_date: string,
    carpenter_id: string,
    scanned: string,
    generated_date: string,
    qr_code_image: string,
    points?: number,
    carpenter_name:string,
    mobile_number:string,
    name_of_product:string
}

const ProductQRHistory: React.FC = () => {
    const [data, setData] = useState<ProductQRHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);

    useEffect(() => {
        document.title="Product QR History";
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/method/reward_management_app.api.print_qr_code.print_qr_code`);
                console.log('Fetched Product QR History data:', response);

                if (response.data && response.data.message && Array.isArray(response.data.message)) {
                    const qrTableData = response.data.message.flatMap(item => item.qr_table_data || []);
                    const formattedData = qrTableData.map(item => ({
                        ...item,
                        scanned: item.scanned == '1' ? 'Redeemed' : 'Not Redeemed',
                    }));
                    setData(formattedData);
                } else {
                    setData([]);
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const parseDateString = (dateString: string): Date | null => {
        console.log("Input dateString:", dateString);
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

    // Filter the data based on search query
    const filteredData = data.filter(item => {
        const query = searchQuery.toLowerCase();
        const generatedDateString = item.generated_date;
        const isDateValid = typeof generatedDateString === 'string' && generatedDateString.trim() !== '';
        const generatedDate = isDateValid ? parseDateString(generatedDateString) : null;
    
        // Check if generatedDate is valid
        const isWithinDateRange = (!fromDate || (generatedDate && generatedDate >= fromDate)) &&
                                  (!toDate || (generatedDate && generatedDate <= toDate));
        
        return (
            isWithinDateRange &&
            (
                item.product_qr_name?.toLowerCase().includes(query) ||
                item.name_of_product?.toLowerCase().includes(query) ||
                item.carpenter_id?.toLowerCase().includes(query) ||
                item.points?.toString().toLowerCase().includes(query) ||
                item.scanned?.toLowerCase().includes(query) ||
                (isDateValid && generatedDateString.toLowerCase().includes(query))
            )
        );
    });
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };
    const handleDateFilter = (from: Date | null, to: Date | null) => {
        setFromDate(from);
        setToDate(to);
        setCurrentPage(1); 
    };


    const handleAddProductClick = () => {
        console.log("Add Product button clicked");
        navigate('/redeemption-history');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;



    return (
        <Fragment>
            {/* <Pageheader currentpage="Product QR History" activepage="Product Dashboard" mainpage="Product QR History" /> */}
            <Pageheader 
                currentpage={"Product QR History"} 
                activepage={"/product-qr-history"} 
                activepagename='Product QR History' 
            />

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="">
                        <TableBoxComponent
                            title="Product QR History"
                            onSearch={handleSearch}
                            onAddButtonClick={handleAddProductClick}
                            buttonText="Add New Product"
                            showButton={false}
                            showFromDate={true}
                            showToDate={true}
                            onDateFilter={handleDateFilter}
                        />

                        <div className="box-body m-5">
                            <TableComponent<ProductQRHistory>
                                columns={[
                                    { header: 'QR ID', accessor: 'product_qr_name' },
                                    { header: 'Product Name', accessor: 'name_of_product' },
                                    { header: 'Reward Points', accessor: 'points' },
                                    { header: 'Generated Date', accessor: 'generated_date' },
                                    {
                                        header: 'Status',
                                        accessor: 'scanned',
                                    },
                                    { header: 'Carpenter ID', accessor: 'carpenter_id' },
                                    { header: 'Carpenter Name', accessor: 'carpenter_name' },
                                    { header: 'Mobile Number', accessor: 'mobile_number' },
                                    { header: 'Redeemed Date', accessor: 'redeem_date' },
                                    {
                                        header: 'QR Image',
                                        accessor: 'qr_code_image',
                                        render: (imageUrl) => {
                                            // Check if URL is valid
                                            const imageSrc = imageUrl ? imageUrl : 'placeholder.png'; // Fallback image
                                            return (
                                                <img
                                                    src={imageSrc}
                                                    alt="QR Code"
                                                    style={{ width: '20px', height: '20px' }}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'placeholder.png'; // Handle broken image
                                                    }}
                                                />
                                            );
                                        }
                                    },
                                ]}
                                data={filteredData}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handlePageChange={handlePageChange}
                                showProductQR={false}
                                showEdit={false}
                                columnStyles={{
                                    'QR ID': 'text-[var(--primaries)] font-semibold',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ProductQRHistory;
