import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '@/components/common/pageheader/pageheader';
import TableComponent from '@/components/ui/tables/tablecompnent';
import TableBoxComponent from '@/components/ui/tables/tableboxheader';
import React, { Fragment, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

interface PointHistory {
    name: string;
    points: number;
    date: string;
}

const ViewCarpenterPointHistory: React.FC = () => {
    const [data, setData] = useState<PointHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const [searchQuery, setSearchQuery] = useState('');
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);

    const navigate = useNavigate();
    const location = useLocation();
    const notyf = new Notyf({
        position: {
            x: "right",
            y: "top",
        },
        duration: 5000,
    });

    useEffect(() => {
        document.title = "Carpenter Point History";

        // Extract Carpenter ID from pathname
        const pathSegments = location.pathname.split('/');
        let CarpenterId = pathSegments[pathSegments.length - 1];
        CarpenterId = CarpenterId.replace(/_/g, ' ');
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/method/reward_management_app.api.carpenter_master.get_points_data?carpenter_id=${CarpenterId}`);
                console.log("Response data:", response.data); // To check the entire response data structure
                
                if (response.data && response.data.message.status === 200) {
                    console.log("Fetched carpenter data", response);
                    const carpenterData = response.data.message.data; 
                    console.log("Carpenter point history", carpenterData);
        
                    // Check if carpenterData is an array and has at least one element
                    if (Array.isArray(carpenterData) && carpenterData.length > 0) {
                        const pointHistory = carpenterData[0].point_history; // Access point_history from the first object in the array
                        if (Array.isArray(pointHistory)) {
                            setData(pointHistory);
                            console.log("Point history set to state:", pointHistory);
                        } else {
                            console.log("No valid point history found, setting empty array.");
                            setData([]); // Set empty if no valid point history exists
                        }
                    } else {
                        console.log("No carpenter data found, setting empty array.");
                        setData([]); // If carpenter data is empty or not in the expected format
                    }
                } else {
                    console.log("Response status is not 200 or no data found.");
                    setData([]); // If response status is not 200
                }
            } catch (error) {
                console.error("Error fetching data:", error); // Log the error
                setError(error instanceof Error ? error.message : 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [location.pathname]); // Fetch data based on the carpenterId

    const parseDateString = (dateString: string): Date | null => {
        if (typeof dateString !== 'string') return null;
        const parts = dateString.split('-'); 
        if (parts.length !== 3) return null; 
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; 
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
    };

    const filteredData = data.filter(item => {
        const query = searchQuery.toLowerCase();
        const itemDate = parseDateString(item.date);

        const isWithinDateRange = (!fromDate || (itemDate && itemDate >= fromDate)) &&
                                  (!toDate || (itemDate && itemDate <= toDate));

        return (
            isWithinDateRange &&
            (
                item.name.toLowerCase().includes(query) ||
                item.points.toString().toLowerCase().includes(query) ||
                item.date.includes(query)
            )
        );
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };
    const handleDateFilter = (from: Date | null, to: Date | null) => {
        setFromDate(from);
        setToDate(to);
        setCurrentPage(1); 
    };
    const handleAddProductClick = () => navigate('/carpenter-details');

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Fragment>
            <Pageheader 
                currentpage="Carpenter Point History" 
                activepage="/carpenter-details" 
                mainpage="/view-point-history/:carpenterId" 
                activepagename='Carpenter Details' 
                mainpagename='Carpenter Point History' 
            />

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <TableBoxComponent
                        title="Carpenter Point History"
                        onSearch={handleSearch}
                        onAddButtonClick={handleAddProductClick}
                        buttonText="Add New Product"
                        showButton={false}
                        showFromDate={true}
                        showToDate={true}
                        onDateFilter={handleDateFilter}
                    />

                    <div className="box-body m-5">
                        <TableComponent<PointHistory>
                            columns={[
                                { header: 'Product/Bonus Name', accessor: 'name' },
                                { header: 'Earned Points', accessor: 'points' },
                                { header: 'Date', accessor: 'date' },
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
                                'Product/Bonus Name': 'text-[var(--primaries)] font-semibold',
                            }}
                        />
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ViewCarpenterPointHistory;
