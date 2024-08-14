import React, { Fragment, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { BASE_URL } from "../../../utils/constants";
import Pageheader from '@/components/common/pageheader/pageheader';
import TableComponent from '@/components/ui/tables/tablecompnent';
import TableBoxComponent from '@/components/ui/tables/tableboxheader';
import AddAdminUser from '@/components/ui/models/AddAdminModel';
import SuccessAlert from '@/components/ui/alerts/SuccessAlert';

// Validation Schema
const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email address").required("Email is required"),
    mobileNumber: yup.string().matches(/^\d+$/, "Mobile number must be digits").required("Mobile number is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const AddUserDashboard: React.FC = () => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            mobileNumber: '',
            password: '',
        }
    });

    const [usersData, setUsersData] = React.useState<User[]>([]);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page

    React.useEffect(() => {
        if (showSuccessAlert) {
            const timer = setTimeout(() => setShowSuccessAlert(false), 3000);
            return () => clearTimeout(timer);
        }
        const fetchAdminUsers = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/method/reward_management_app.api.add_admin_user.get_users`);
                setUsersData(response.data.message);
            } catch (error) {
                console.error("Error fetching admin users:", error);
            }
        };
        fetchAdminUsers();
    },[showSuccessAlert]);

    const handleAddButtonClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        reset();
    };
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

    const onSubmit = async (data: any) => {
        console.log("btn clicked");
        try {
            const response = await axios.post(`${BASE_URL}/api/method/reward_management_app.api.add_admin_user.create_admin_user`, {
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                mobile_number: data.mobileNumber,
                password: data.password
            });
            console.log("User created successfully", response.data);
            handleCloseModal();
        } catch (error) {
            console.error("Error creating admin user:", error);
        }
    };

    return (
        <Fragment>
            <Pageheader currentpage="Add User" activepage="Add User" mainpage="Add User" />

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent 
                            title="User List" 
                            onSearch={(value) => console.log("Search value:", value)} 
                            onAddButtonClick={handleAddButtonClick} 
                            buttonText="Add New User"
                            showButton={true}
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
                                columnStyles={{}}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <AddAdminUser
                    title="Add New Admin User"
                    adminFirstNameLabel="First Name"
                    adminLastNameLabel="Last Name"
                    adminUsernameLabel="User Name"
                    adminEmailLabel="Email"
                    adminMobileLabel="Mobile Number"
                    adminSetPasswordLabel="Set User Password"
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit(onSubmit)}
                    onCancel={handleCloseModal}
                    control={control}
                    errors={errors}
                />
            )}
             {/* Success Alert */}
             {showSuccessAlert && <SuccessAlert message="New Admin Created Successfully!" />}
        </Fragment>
    );
};

export default AddUserDashboard;
