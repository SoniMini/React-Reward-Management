import "../../../assets/css/style.css";
import "../../../assets/css/pages/admindashboard.css";
import Pageheader from "../../../components/common/pageheader/pageheader";
import TableComponent from "../../../components/ui/tables/tablecompnent";
import TableBoxComponent from "../../../components/ui/tables/tableboxheader";
import React, { useState, useEffect } from "react";
import SuccessAlert from "../../../components/ui/alerts/SuccessAlert";
import DangerAlert from "../../../components/ui/alerts/DangerAlert";
import axios from "axios";
import { useFrappeGetDocList } from "frappe-react-sdk";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

interface FestivalBonus {
    name: string;
    festival_name: string;
    bonus_points: string
    bonus_message: string;
    date: string
}



const FestivalBonusMaster: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [festivalBonusId, setFestivalBonusId] = useState("");
    const [festivalName, setFestivalName] = useState("");
    const [bonusPoints, setBonusPoints] = useState("");

    const [bonusMessage, setBonusMessage] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [showAddFestivalBonusForm, setShowAddFestivalBonusForm] = useState(false);
    const [festivalBonusToDelete, setFestivalBonusToDelete] = useState<FestivalBonus | null>(null);
    const [alertTitle, setAlertTitle] = useState("");
    // const [festivalBonusToEdit, setFestivalBonusToEdit] = useState<FestivalBonus | null>(null);
    // const [filteredData, setFilteredData] = useState<FestivalBonus[]>([]);
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [date, setDate] = useState('');




    const notyf = new Notyf({
        position: {
            x: 'right',
            y: 'top',
        },
        duration: 3000,
    });


    React.useEffect(() => {
        document.title = "Festival Bonus";
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                // window.location.reload();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert]);



    // Fetch the festival bonus
    const { data: festivalBonusData, mutate: mutateFestivalBonus } =
        useFrappeGetDocList<FestivalBonus>("Festival Bonus", {
            fields: ["name", "festival_name", "bonus_points", "bonus_message", "date"],
            orderBy: {
                field: 'creation',
                order: 'asc',
            },
        });


    const handleSearch = (value: string) => {
        // Update search query
        setSearchQuery(value);
        setCurrentPage(1);
        console.log("Search value:", value);
    };


    const handleDateFilter = (from: Date | null, to: Date | null) => {
        setFromDate(from);
        setToDate(to);
        setCurrentPage(1);
    };

    const formatDateToMySQL = (dateString: string) => {
        const [year, month, day] = dateString.split('-').map(Number);
        return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
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

    // const formatDateToISO = (dateString: string) => {
    //     const date = new Date(dateString);
    //     const year = date.getFullYear();
    //     const month = (`0${date.getMonth() + 1}`).slice(-2);
    //     const day = (`0${date.getDate()}`).slice(-2);
    //     return `${year}-${month}-${day}`;
    // };



    const formattedFestivalBonusData = festivalBonusData?.map(festivaldata => ({
        ...festivaldata,
        date: festivaldata.date ? formatDateToMySQL(festivaldata.date) : '',
    })) || [];





    const filteredData = formattedFestivalBonusData.filter(festivalbonus => {
        const query = searchQuery.toLowerCase();

        // Parse the published_on date for filtering
        const festivalBonusDateString = festivalbonus.date;
        const isDateValid = typeof festivalBonusDateString === 'string' && festivalBonusDateString.trim() !== '';
        const festivalBonusDate = isDateValid ? parseDateString(festivalBonusDateString) : null;



        // Check if the announcement date is within the selected date range
        const isWithinDateRange = ((!fromDate || (festivalBonusDate && festivalBonusDate >= fromDate)) &&
            (!toDate || (festivalBonusDate && festivalBonusDate <= toDate)));

        return (
            isWithinDateRange && // Include date range filtering
            (
                (festivalbonus.name && festivalbonus.name.toLowerCase().includes(query)) ||
                (festivalbonus.festival_name && festivalbonus.festival_name.toLowerCase().includes(query)) ||
                (festivalbonus.bonus_message && festivalbonus.bonus_message.toLowerCase().includes(query)) ||
                (festivalbonus.bonus_points && festivalbonus.bonus_points.toString().toLowerCase().includes(query))
            )
        );
    });





    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        // Get current date and format as dd-mm-yyyy
        // const currentDate = new Date();
        // const formattedDate = formatDateToISO(currentDate); // Format to ISO format (YYYY-MM-DD)



        const data = {
            festival_name: festivalName,
            bonus_message: bonusMessage,
            bonus_points: bonusPoints,

        };



        try {

            // Add new product category
            await axios.post(`/api/method/reward_management_app.api.festival_bonus.create_new_festival_bonus`, 
                
                data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setAlertTitle("Success");
            setAlertMessage("Festival Bonus added successfully!");
            // Clear the input fields
            setFestivalName('');
            setBonusPoints('');
            setBonusMessage('');
            setDate('');
            setShowSuccessAlert(true);
            handleCloseModal();
            mutateFestivalBonus();
        } catch (error) {
            console.error("Error submitting the form:", error);
            alert("An error occurred while submitting the form. Please try again.");
        }
    };



    // edit festival------------
    const handleEditFestivalBonus = (festivalbonus: FestivalBonus) => {
        // setFestivalBonusToEdit(festivalbonus);
        setShowAddFestivalBonusForm(true);
        setFestivalBonusId(festivalbonus.name);
        setFestivalName(festivalbonus.festival_name);
        setBonusMessage(festivalbonus.bonus_message);
        setBonusPoints(festivalbonus.bonus_points);
    };




    // const handleEditSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();


    //     const updatedata = {
    //         name: festivalBonusId,
    //         festival_name: festivalName,
    //         bonus_message: bonusMessage,
    //         bonus_points: bonusPoints,
    //     };

    //     try {

    //         // Edit existing  Festival Bonus
    //         await axios.put(
    //             `/api/method/reward_management_app.api.festival_bonus.update_festival_bonus`,
    //             updatedata,
    //             {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //             }
    //         );
    //         setAlertTitle("Success");
    //         setAlertMessage("Festival Bonus updated successfully!");
    //         // Clear the input fields
    //         setFestivalName('');
    //         setBonusMessage('');
    //         setBonusPoints('');
    //         setShowSuccessAlert(true);
    //         handleCloseModal();
    //         mutateFestivalBonus();
    //     } catch (error) {
    //         console.error("Error submitting the form:", error);
    //         alert("An error occurred while submitting the form. Please try again.");
    //     }
    // };



    // delete Festival Bonus---------

    const handleDeleteFestivalBonus = (item: FestivalBonus) => {
        setFestivalBonusToDelete(item);
        setIsConfirmDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!festivalBonusToDelete) return;

        try {
            const response = await axios.delete(
                `/api/resource/Festival Bonus/${festivalBonusToDelete.name}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("delete response", response);

            if (response.data.data === "ok") {
                setAlertMessage("Festival Bonus deleted successfully!");
                setShowSuccessAlert(true);
                setTimeout(() => setShowSuccessAlert(false), 3000);
                setIsConfirmDeleteModalOpen(false);
                mutateFestivalBonus();
            } else {
                console.log("Unexpected response:", response);
                alert("Failed to delete Festival Bonus. Please try again.");
            }
        } catch (error) {
            if (error.response) {
                // Check if the error is a LinkExistsError and extract the message
                if (error.response.data && error.response.data.exception) {
                    const exceptionMessage = error.response.data.exception;

                    // Check if the message contains 'LinkExistsError' and display the custom message
                    if (exceptionMessage.includes("LinkExistsError")) {
                        const linkedMessage =
                            "This Festival Bonus is linked with a Carpenter. Please unlink it before deletion.";
                        // alert(linkedMessage);
                        notyf.error(linkedMessage);
                    } else {
                        // alert(exceptionMessage);
                        notyf.error(exceptionMessage);
                    }
                } else {
                    alert("Failed to delete Festival Bonus. Please try again.");
                }
            } else {
                // console.error("Error deleting Festival Bonus:", error);
                alert("Failed to delete Festival Bonus. Please try again.");
            }
        }
    };
    const handleCloseModal = () => {
        // setFestivalBonusToEdit(null);
        setShowAddFestivalBonusForm(false);
        setFestivalName('');
        setBonusMessage('');
        setBonusPoints('');

    };

    const cancelDelete = () => {
        setIsConfirmDeleteModalOpen(false);
        setFestivalBonusToDelete(null);
    };

    return (
        <>
            <Pageheader
                currentpage={"Festival Bonus"}
                activepage={"/festival-bonus"}
                activepagename="Festival Bonus"
            />

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <TableBoxComponent
                        title="Festival Bonus"
                        onSearch={handleSearch}
                        onAddButtonClick={() => setShowAddFestivalBonusForm(true)}
                        buttonText="Add Festival Bonus"
                        showButton={true}
                        showFromDate={true}
                        showToDate={true}
                        onDateFilter={handleDateFilter}
                    />

                    <div className="box-body m-5">
                        <TableComponent<FestivalBonus>
                            columns={[
                                { header: "ID", accessor: "name" },

                                { header: "Festival Name", accessor: "festival_name" },
                                { header: "Bonus Points", accessor: "bonus_points" },
                                {
                                    header: "Message",
                                    accessor: "bonus_message",
                                },
                                {
                                    header: "Date",
                                    accessor: "date",
                                },
                            ]}
                            data={filteredData}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            handlePrevPage={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            handleNextPage={() => setCurrentPage((prev) => prev + 1)}
                            handlePageChange={(page) => setCurrentPage(page)}
                            showProductQR={false}
                            showEdit={false}
                            // onEdit={handleEditFestivalBonus} // Edit button handler
                            showDelete={true}
                            onDelete={handleDeleteFestivalBonus}
                            showView={false}
                            columnStyles={{
                                'ID': 'text-[var(--primaries)] font-semibold',
                            }}
                        />
                    </div>
                </div>
            </div>
            {/* show add festival bonus model */}
            {showAddFestivalBonusForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                        <div className="ti-modal-content flex flex-col h-full max-h-[80vh]">
                            <div className="box-header">
                                <div className="ti-modal-header flex justify-between border-b p-4">
                                    <h6 className="modal-title text-1rem font-semibold text-primary">
                                        Add Festival Bonus
                                    </h6>
                                    <button
                                        onClick={handleCloseModal}
                                        type="button"
                                        className="text-1rem font-semibold text-defaulttextcolor"
                                    >
                                        <span className="sr-only">Close</span>
                                        <i className="ri-close-line"></i>
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="p-4 overflow-auto flex-1">
                                    <div className="grid grid-cols-12 gap-4">
                                        {/* Festival Bonus Name */}

                                        <div className="xl:col-span-12 col-span-12">
                                            <label
                                                htmlFor="festivalName"
                                                className="block text-sm text-defaulttextcolor font-semibold mb-1"
                                            >
                                                Festival Name
                                            </label>
                                            <input
                                                type="text"
                                                id="festivalName"
                                                className="form-control w-full rounded-[5px] text-defaulttextcolor text-sm border border-[#dadada] outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada]"
                                                placeholder="Enter Festival Name"
                                                value={festivalName}
                                                onChange={(e) => {
                                                    setFestivalName(e.target.value);

                                                }}
                                            />
                                        </div>

                                        {/* add message--- */}
                                        <div className="xl:col-span-12 col-span-12">
                                            <label
                                                htmlFor="festivalMessage"
                                                className="block text-sm text-defaulttextcolor font-semibold mb-1"
                                            >
                                                Message
                                            </label>
                                            <input
                                                type="text"
                                                id="festivalMessage"
                                                className="form-control w-full rounded-[5px] text-defaulttextcolor text-sm border border-[#dadada] outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada]"
                                                placeholder="Enter Festival Name"
                                                value={bonusMessage}
                                                onChange={(e) => {
                                                    setBonusMessage(e.target.value);

                                                }}
                                            />
                                        </div>
                                        {/* end---- */}
                                        {/* add points---- */}
                                        <div className="xl:col-span-12 col-span-12">
                                            <label
                                                htmlFor="bonusPoints"
                                                className="block text-sm text-defaulttextcolor font-semibold mb-1"
                                            >
                                                Bonus Points
                                            </label>
                                            <input
                                                type="text"
                                                id="bonusPoints"
                                                className="form-control w-full rounded-[5px] text-defaulttextcolor text-sm border border-[#dadada] outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada]"
                                                placeholder="Enter Festival Name"
                                                value={bonusPoints}
                                                onChange={(e) => {
                                                    setBonusPoints(e.target.value);

                                                }}
                                            />
                                        </div>
                                        {/* end */}
                                    </div>
                                </div>

                                <div className="xl:col-span-12 col-span-12 text-center border-t p-4 border-defaultborder">


                                    <div className="flex justify-end items-baseline">
                                        <button
                                            type="submit"
                                            className="ti-btn ti-btn-primary-full bg-primary me-2"
                                        >Submit </button>
                                        <button
                                            type="button"
                                            className="ti-btn ti-btn-success bg-defaulttextcolor ti-btn text-white !font-medium m-1"
                                            onClick={handleCloseModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>

                                </div>

                            </form>

                        </div>
                    </div>
                </div>
            )}

            {/* show edit Festival Bonus----------------------- */}



            {/* {festivalBonusToEdit && ( */}
                {/* <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                        <div className="ti-modal-content flex flex-col h-full max-h-[80vh]"> */}
                            {/* <div className="box-header">
                                <div className="ti-modal-header flex justify-between border-b p-4">
                                    <h6 className="modal-title text-1rem font-semibold text-primary">

                                        Edit Festival Bonus
                                    </h6>
                                    <button
                                        onClick={handleCloseModal}
                                        type="button"
                                        className="text-1rem font-semibold text-defaulttextcolor"
                                    >
                                        <span className="sr-only">Close</span>
                                        <i className="ri-close-line"></i>
                                    </button> */}
                                {/* </div>
                            </div>

                            <form onSubmit={handleEditSubmit}>
                                <div className="p-4 overflow-auto flex-1">
                                    <div className="grid grid-cols-12 gap-4"> */}

                                        {/* Bonus ID */}
                                        {/* <div className="xl:col-span-12 col-span-12">
                                            <label
                                                htmlFor="bonusId"
                                                className="block text-sm text-defaulttextcolor font-semibold mb-1"
                                            >
                                                Bonus ID
                                            </label>
                                            <input
                                                type="text"
                                                id="bonusId"
                                                className="form-control w-full rounded-[5px] text-defaulttextcolor text-sm border border-[#dadada] outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada]"
                                                placeholder="Enter Product Category"
                                                value={
                                                    festivalBonusId

                                                }
                                                onChange={(e) => setFestivalBonusId(e.target.value)}
                                                readOnly
                                            />
                                        </div> */}

                                        {/* Festival Bonus Name */}

                                        {/* <div className="xl:col-span-12 col-span-12">
                                            <label
                                                htmlFor="festivalName"
                                                className="block text-sm text-defaulttextcolor font-semibold mb-1"
                                            >
                                                Festival Name
                                            </label>
                                            <input
                                                type="text"
                                                id="festivalName"
                                                className="form-control w-full rounded-[5px] text-defaulttextcolor text-sm border border-[#dadada] outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada]"
                                                placeholder="Enter Festival Name"
                                                value={festivalName}
                                                onChange={(e) => {
                                                    setFestivalName(e.target.value);

                                                }}
                                            />
                                        </div> */}

                                        {/* add message--- */}
                                        {/* <div className="xl:col-span-12 col-span-12"> */}
                                            {/* <label
                                                htmlFor="bonusMessage"
                                                className="block text-sm text-defaulttextcolor font-semibold mb-1"
                                            >
                                                Message
                                            </label>
                                            <input
                                                type="text"
                                                id="bonusMessage"
                                                className="form-control w-full rounded-[5px] text-defaulttextcolor text-sm border border-[#dadada] outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada]"
                                                placeholder="Enter Festival Name"
                                                value={bonusMessage}
                                                onChange={(e) => {
                                                    setBonusMessage(e.target.value);

                                                }}
                                            />
                                        </div> */}
                                        {/* end---- */}
                                        {/* add points---- */}
                                        {/* <div className="xl:col-span-12 col-span-12">
                                            <label
                                                htmlFor="bonusPoints"
                                                className="block text-sm text-defaulttextcolor font-semibold mb-1"
                                            >
                                                Bonus Points
                                            </label>
                                            <input
                                                type="text"
                                                id="bonusPoints"
                                                className="form-control w-full rounded-[5px] text-defaulttextcolor text-sm border border-[#dadada] outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada]"
                                                placeholder="Enter Festival Name"
                                                value={bonusPoints}
                                                onChange={(e) => {
                                                    setBonusPoints(e.target.value);

                                                }}
                                            />
                                        </div> */}
                                        {/* end */}
                                    {/* </div>
                                </div> */}

                                {/* <div className="xl:col-span-12 col-span-12 text-center border-t p-4 border-defaultborder">


                                    <div className="flex justify-end items-baseline">
                                        <button
                                            type="submit"
                                            className="ti-btn ti-btn-primary-full bg-primary me-2"
                                        >
                                            Submit</button>
                                        <button
                                            type="button"
                                            className="ti-btn ti-btn-success bg-defaulttextcolor ti-btn text-white !font-medium m-1"
                                            onClick={handleCloseModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>

                                </div>

                            </form>

                        </div>
                    </div>
                </div> */}
            {/* )} */}

            {isConfirmDeleteModalOpen && (
                <DangerAlert
                    type="danger"
                    message={`Are you sure you want to delete this Festival Bonus?`}
                    onDismiss={cancelDelete}
                    onConfirm={confirmDelete}
                    cancelText="Cancel"
                    confirmText="Continue"
                />
            )}

            {showSuccessAlert && (
                <SuccessAlert
                    title={alertTitle}
                    showButton={false}
                    showCancleButton={false}
                    showCollectButton={false}
                    showAnotherButton={false}
                    showMessagesecond={false}
                    message={alertMessage}
                    onClose={function (): void {
                        throw new Error("Function not implemented.");
                    }}
                    onCancel={function (): void {
                        throw new Error("Function not implemented.");
                    }}
                />
            )}
        </>
    );
};

export default FestivalBonusMaster;
