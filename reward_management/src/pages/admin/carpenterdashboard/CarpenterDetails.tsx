// pages/ProductMaster.tsx

import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '@/components/common/pageheader/pageheader';
import TableComponent from '@/components/ui/tables/tablecompnent';
import TableBoxComponent from '@/components/ui/tables/tableboxheader';
import React, { Fragment, useState } from "react";
import { useFrappeGetDocList } from 'frappe-react-sdk';

interface Carpenter {
    name: string,
    full_name?: string,
    city: string,
    mobile_number?: string,
    total_points: number,
    current_points: number,
    redeem_points: number,
}

const CarpenterDetails: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const { data: carpenterData } = useFrappeGetDocList<Carpenter>('Carpenter', {
        fields: ['name', 'full_name', 'city', 'mobile_number','total_points','current_points','redeem_points']
    });

    const totalPages = Math.ceil((carpenterData?.length || 0) / itemsPerPage);

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
            <Pageheader currentpage="Carpenter Details" activepage="Carpenter Dashboard" mainpage="Carpenter Details" />

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent 
                            title="Carpenter Detail" 
                            onSearch={handleSearch} 
                            onAddButtonClick={handleAddProductClick} 
                            buttonText="Add New Product" // Custom button text
                            showButton={false} // Show the button
                        />

                        <div className="box-body m-5">
                            <TableComponent<Carpenter>
                                columns={[
                                    { header: 'Carpenter ID', accessor: 'name' },
                                    { header: 'Carpenter Name', accessor: 'full_name' },  
                                    { header: 'Mobile Number', accessor: 'mobile_number' },
                                    { header: 'City', accessor: 'city' },
                                    { header: 'Total Points', accessor: 'total_points' },
                                    { header: 'Available Points', accessor: 'current_points' },
                                    { header: 'Redeemed Points ', accessor: 'redeem_points' },
                                   
                                 
                                ]}
                                data={carpenterData || []}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handlePageChange={handlePageChange}
                                showProductQR={false} 
                                showEdit={false} 
                                 
                                columnStyles={{
                                    'Carpenter ID': 'text-[var(--primaries)] font-semibold',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};
export default CarpenterDetails;
