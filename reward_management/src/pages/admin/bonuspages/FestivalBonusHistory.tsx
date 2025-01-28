import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import TableComponent from '../../../components/ui/tables/tablecompnent';
import TableBoxComponent from '../../../components/ui/tables/tableboxheader';
// import ViewModalComponent from '../../../components/ui/models/ViewModel';
import React, { Fragment, useState } from "react";
import { useFrappeGetDocList } from 'frappe-react-sdk';
// import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
// import DangerAlert from '../../../components/ui/alerts/DangerAlert';


interface FestivalBonusHistory {
    name: string,
    carpenter_id?: string,
    carpenter_name: string,
    bonus_points?: string,
    mobile_number?: string,
    bonus_creation_date?: string,
    festival_bonus_id:string,
    name_of_festival:string,
    bonus_message:string
}

const FestivalBonusHistory: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    // const [alertMessage, setAlertMessage] = useState('');
    // const [alertTitle, setAlertTitle] = useState('');
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);


    const { data: festivalBonusHistory} = useFrappeGetDocList<FestivalBonusHistory>('Fastival Bonus History', {
        fields: ['name', 'carpenter_name', 'carpenter_id', 'bonus_creation_date', 'bonus_points','mobile_number','festival_bonus_id','name_of_festival','bonus_message'],
        orderBy: {
            field: 'creation',
            order: 'asc',
        },
    });

    React.useEffect(() => {
        document.title = 'Fastival Bonus History';
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert]);

    const totalPages = Math.ceil((festivalBonusHistory?.length || 0) / itemsPerPage);

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
    };

    const handleDateFilter = (from: Date | null, to: Date | null) => {
        setFromDate(from);
        setToDate(to);
        setCurrentPage(1);
    };

    const handleAddButtonClick = () => {
        console.log('Add Bonus Clicked');
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
    const formattedWelcomeBonusHistoryData = festivalBonusHistory?.map(festivalBonusHistory => ({
        ...festivalBonusHistory,
        date: festivalBonusHistory.bonus_creation_date ? formatDateToMySQL(festivalBonusHistory.bonus_creation_date) : '',
    })) || [];


    const filteredData = formattedWelcomeBonusHistoryData?.filter(bonushistory => {
        const query = searchQuery.toLowerCase();
    // Parse the published_on date for filtering
    const bonushistoryDateString = bonushistory.date;
    const isDateValid = typeof bonushistoryDateString === 'string' && bonushistoryDateString.trim() !== '';
    const festivalbonusDate = isDateValid ? parseDateString(bonushistoryDateString) : null;

    // Check if the announcement date is within the selected date range
    const isWithinDateRange = ((!fromDate || (festivalbonusDate && festivalbonusDate >= fromDate)) &&
                              (!toDate || (festivalbonusDate && festivalbonusDate <= toDate)));
    
    return (
        isWithinDateRange && // Include date range filtering
        (
            (bonushistory.name && bonushistory.name.toLowerCase().includes(query)) ||
            (bonushistory.carpenter_name && bonushistory.carpenter_name.toLowerCase().includes(query)) ||
            (bonushistory.name_of_festival && bonushistory.name_of_festival.toString().toLowerCase().includes(query)) ||

            (bonushistory.bonus_points && bonushistory.bonus_points.toString().toLowerCase().includes(query)) ||
            (bonushistory.mobile_number && bonushistory.mobile_number.toString().toLowerCase().includes(query))
        )
    );
});

    return (
        <Fragment>
            <Pageheader
                currentpage={"Festival Bonus History"}
                activepage={"/festival-bonus-history"}
                activepagename='Festival Bonus History'
            />
            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="">
                        <TableBoxComponent
                            title="Festival Bonus History"
                            onSearch={handleSearch}
                            onAddButtonClick={handleAddButtonClick}
                            buttonText="Add Bonus"
                            showButton={false}
                            showFromDate={true}
                            showToDate={true}
                            onDateFilter={handleDateFilter}
                        />
                        <div className="box-body m-5">
                            <TableComponent
                                columns={[
                                    { header: 'Bonus ID', accessor: 'name' },
                                    { header: 'Festival Name', accessor: 'name_of_festival' },
                                    { header: 'Carpenter Name', accessor: 'carpenter_name' },
                                    { header: 'Mobile Number', accessor: 'mobile_number' },

                                    { header: 'Date', accessor: 'date' },
                                    { header: 'Bonus Points', accessor: 'bonus_points' },
                                ]}
                                data={filteredData}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handlePageChange={handlePageChange}
                                showProductQR={false}
                                showEdit={false}
                                showDelete={false}
                                showView={false}
                                editHeader='Action'
                                columnStyles={{
                                    'Bonus ID': 'text-[var(--primaries)] font-semibold',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default FestivalBonusHistory;
