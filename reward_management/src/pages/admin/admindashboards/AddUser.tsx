import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { BASE_URL } from "../../../utils/constants";
import Pageheader from "@/components/common/pageheader/pageheader";
import TableComponent from "@/components/ui/tables/tablecompnent";
import TableBoxComponent from "@/components/ui/tables/tableboxheader";
import AddAdminUser from "@/components/ui/models/AddAdminModel";
import SuccessAlert from "@/components/ui/alerts/SuccessAlert";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

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
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        setFocus, 
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            mobileNumber: "",
            password: "",
        },
    });

    const notyf = new Notyf({
        position: {
            x: "right",
            y: "top",
        },
        duration: 5000,
    });

    const [usersData, setUsersData] = useState<User[]>([]);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState("");

    React.useEffect(() => {
        if (showSuccessAlert) {
            const timer = setTimeout(() => setShowSuccessAlert(false), 3000);
            return () => clearTimeout(timer);
        }
        const fetchAdminUsers = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/api/method/reward_management_app.api.add_admin_user.get_users`
                );
                setUsersData(response.data.message);
            } catch (error) {
                console.error("Error fetching admin users:", error);
            }
        };
        fetchAdminUsers();
    }, [showSuccessAlert]);

    const handleAddButtonClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const filteredData = usersData.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
            item.first_name.toLowerCase().includes(query) ||
            item.last_name.toLowerCase().includes(query) ||
            item.username.toLowerCase().includes(query) ||
            item.email.toLowerCase().includes(query) ||
            item.mobile_no.toLowerCase().includes(query)
        );
    });

    const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);

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

    const onSubmit = async (data: any) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/api/method/reward_management_app.api.add_admin_user.create_admin_user`,
                {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    username: data.username,
                    email: data.email,
                    mobile_no: data.mobileNumber,
                    password: data.password,
                }
            );

            if (response.data.message.status === "success") {
                setShowSuccessAlert(true);
                handleCloseModal();
            } else {
                notyf.error(response.data.message.message);
                reset();
            }
        } catch (error:any) {
            console.error("Error creating admin user:", error);
            if (error.response && error.response.data) {
                const serverMessages = error.response.data._server_messages
                    ? JSON.parse(error.response.data._server_messages)
                    : [];

                const userFriendlyMessages = serverMessages.map(
                    (msg: string) => JSON.parse(msg).message
                );

                notyf.error(userFriendlyMessages.join("\n"));

                if (userFriendlyMessages.includes("Username already exists")) {
                    setFocus("username");
                } else if (userFriendlyMessages.includes("Email is already taken")) {
                    setFocus("email");
                } else if (userFriendlyMessages.includes("Mobile number already exists")) {
                    setFocus("mobileNumber");
                }
            } else {
                notyf.error("An error occurred while creating the user.");
            }
        }
    };

    return (
        <Fragment>
            <Pageheader
                currentpage="Add User"
                activepage="Add User"
                mainpage="Add User"
            />

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent
                            title="User List"
                            onSearch={handleSearch}
                            onAddButtonClick={handleAddButtonClick}
                            buttonText="Add New User"
                            showButton={true}
                        />

                        <div className="box-body m-5">
                            <TableComponent<User>
                                columns={[
                                    { header: "First Name", accessor: "first_name" },
                                    { header: "Last Name", accessor: "last_name" },
                                    { header: "User Name", accessor: "username" },
                                    { header: "Email", accessor: "email" },
                                    { header: "Mobile Number", accessor: "mobile_no" },
                                ]}
                                data={filteredData || []}
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

            {showSuccessAlert && (
                <SuccessAlert
                    showButton={false}
                    showCancleButton={false}
                    showCollectButton={false}
                    showAnotherButton={false}
                    showMessagesecond={false}
                    message="New Admin User Created Successfully!"
                    onClose={() => setShowSuccessAlert(false)} // Close the alert properly
                />
            )}
        </Fragment>
    );
};

export default AddUserDashboard;
