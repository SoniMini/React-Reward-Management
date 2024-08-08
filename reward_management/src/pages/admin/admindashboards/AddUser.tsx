import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '@/components/common/pageheader/pageheader';
import TableComponent from '@/components/ui/tables/tablecompnent';
import TableBoxComponent from '@/components/ui/tables/tableboxheader';
import React, { Fragment, useState, useEffect } from "react";
import axios from 'axios';
import { BASE_URL, API_KEY, API_SECRET } from "../../../utils/constants";

interface User {
    name: string,
    first_name?: string,
    email?: string,
    last_name: string,
    username: string,
    mobile_no?: number
}

const AddUserDashboard: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [usersData, setUsersData] = useState<User[]>([]);

    useEffect(() => {
        const fetchAdminUsers = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/method/reward_management_app.api.add_admin_user.get_users`);
                setUsersData(response.data.message);
            } catch (error) {
                console.error("Error fetching admin users:", error);
            }
        };
        fetchAdminUsers();
    }, []);

    const totalPages = Math.ceil((usersData?.length || 0) / itemsPerPage);

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

    return (
        <Fragment>
            <Pageheader currentpage="Add User" activepage="Add User" mainpage="Add User" />

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent 
                            title="User List" 
                            onSearch={handleSearch} 
                            onAddButtonClick={handleAddProductClick} 
                            buttonText="Add New User" // Custom button text
                            showButton={true} // Show the button
                        />

                        <div className="box-body m-5">
                            <TableComponent<User>
                                columns={[
                                  
                                    { header: 'First Name', accessor: 'first_name' },
                                    { header: 'Last Name', accessor: 'last_name' },
                                    { header: 'User Name', accessor: 'username' },
                                    { header: 'Email', accessor: 'email' },
                                    { header: 'Mobile Number', accessor: 'mobile_no' }
                                ]}
                                data={usersData || []}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handlePageChange={handlePageChange}
                                showProductQR={false}
                                showEdit={false}
                                showDelete={false}
                                showView={false}
                                columnStyles={{
                                    'Registration ID': 'text-[var(--primaries)] font-bold', // Example style for QR ID column
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default AddUserDashboard;
