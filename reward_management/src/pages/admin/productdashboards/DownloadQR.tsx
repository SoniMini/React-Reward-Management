import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { BASE_URL } from "../../../utils/constants";
import Pageheader from '@/components/common/pageheader/pageheader';
import TableComponent from '@/components/ui/tables/tablecompnent'; 
import TableBoxComponent from '@/components/ui/tables/tableboxheader';
import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import html2canvas from 'html2canvas';

interface QRCodeImage {
    qr_code_image: string;
    points: number;
}

interface DownloadProductQRCode {
    product_name?: string;
    generated_date?: string;
    total_product?: number;
    points?: number;
    qr_code_images?: QRCodeImage[];
    product_qr_id?:string;
}

const DownloadQRCode: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState<DownloadProductQRCode[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [itemsPerPage] = useState(5);
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('product');

    useEffect(() => {
        document.title="Download QR";
        const fetchData = async () => {
            if (!productName) {
                setError('Product name is missing in the URL');
                return;
            }
        
            try {
                const response = await axios.get(`/api/method/reward_management_app.api.print_qr_code.get_product_by_name`, {
                    params: { productName }
                });

                if (response.data.message && Array.isArray(response.data.message.message)) {
                    console.log("data-------", response);
                    // Aggregate data by generated_date and product_name
                    const aggregatedData = response.data.message.message.map((item: any) => ({
                        product_name: item.qr_code_images[0]?.product_name || 'Unknown Product Name',
                        generated_date: item.generated_date,
                        total_product: item.total_product,
                        points: item.qr_code_images.reduce((acc: number, img: any) => acc + img.points, 0),
                        qr_code_images: item.qr_code_images, 
                    }));
                    
                    setData(aggregatedData);
                } else {
                    setData([]);
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to fetch data');
            }
        };
        
        fetchData();
    }, [productName]);

    const totalPages = Math.ceil(data.length / itemsPerPage);

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
       
    };

    const handleAddProductClick = () => {
        console.log("Back button clicked");
        navigate('/product-master');
    };

    // // Function to handle QR code image download
    // const handleDownloadQR = (row: DownloadProductQRCode) => {
    //     if (row.qr_code_images) {
    //         row.qr_code_images.forEach((image) => {
    //             const link = document.createElement('a');
    //             link.href = image.qr_code_image;
    //             link.download = image.qr_code_image.split('/').pop() || 'qr_code.png';
    //             link.click();
    //         });
    //     }
    // };


    //  download and create zip pdf for qr images---------
    // const handleDownloadQR = async (row:any) => {
    //     const zip = new JSZip();
    //     const pdf = new jsPDF('portrait', 'mm', 'a4'); // 'mm' sets the unit to millimeters
    
    //     // Set image dimensions in millimeters
    //     const imageWidth = 33; // 33 mm
    //     const imageHeight = 33; // 33 mm
    //     const rowSpacing = 10; // Spacing between rows (adjust as needed)
    //     const columnSpacing = 5; // Spacing between columns (adjust as needed)
    
    //     // A4 dimensions in mm: 210 × 297
    //     const columnsPerPage = Math.floor((210 - 20) / (imageWidth + columnSpacing)); // Allow for 10 mm margins
    //     const rowsPerPage = Math.floor((297 - 30) / (imageHeight + rowSpacing)); // Allow for 20 mm margins
    //     const maxImagesPerPage = columnsPerPage * rowsPerPage;
    
    //     row.qr_code_images.forEach((image, index) => {
    //         // Add a new page if the index exceeds maxImagesPerPage for a page
    //         if (index > 0 && index % maxImagesPerPage === 0) {
    //             pdf.addPage();
    //         }
    
    //         // Calculate the current page-specific index
    //         const pageSpecificIndex = index % maxImagesPerPage;
    
    //         // Calculate column and row indices
    //         const colIndex = pageSpecificIndex % columnsPerPage;
    //         const rowIndex = Math.floor(pageSpecificIndex / columnsPerPage);
    
    //         // Calculate the X and Y positions for the QR code
    //         const x = colIndex * (imageWidth + columnSpacing) + 10; // 10 mm left margin
    //         const y = rowIndex * (imageHeight + rowSpacing) + 20; // 20 mm top margin
    
    //         // Debug position
    //         console.log(`Adding image at position: (${x}, ${y}) on page ${Math.floor(index / maxImagesPerPage) + 1}`);
    
    //         // Add QR code image to the PDF
    //         pdf.addImage(image.qr_code_image, 'PNG', x, y, imageWidth, imageHeight);
    //     });
    
    //     // Save the PDF as a blob and add it to the ZIP file
    //     const pdfBlob = pdf.output('blob');
    //     zip.file(`${row.product_name || 'QR_Codes'}.pdf`, pdfBlob);
    
    //     // Generate the ZIP and download it
    //     const zipBlob = await zip.generateAsync({ type: 'blob' });
    //     saveAs(zipBlob, 'qr_codes.zip');
    // };

       //  download and create direct pdf for qr images---------
   
    const handleDownloadQR = (row) => {
    const pdf = new jsPDF('portrait', 'mm', 'a4'); // Use millimeters as units

    // Set image dimensions in millimeters
    const imageWidth = 33; // 33 mm
    const imageHeight = 33; // 33 mm
    const rowSpacing = 10; // Spacing between rows
    const columnSpacing = 5; // Spacing between columns

    // A4 dimensions in mm: 210 × 297
    const columnsPerPage = Math.floor((210 - 20) / (imageWidth + columnSpacing)); // Allow for 10 mm margins
    const rowsPerPage = Math.floor((297 - 30) / (imageHeight + rowSpacing)); // Allow for 20 mm margins
    const maxImagesPerPage = columnsPerPage * rowsPerPage;

    row.qr_code_images.forEach((image, index) => {
        // Add a new page if the index exceeds maxImagesPerPage for a page
        if (index > 0 && index % maxImagesPerPage === 0) {
            pdf.addPage();
        }

        // Calculate the current page-specific index
        const pageSpecificIndex = index % maxImagesPerPage;

        // Calculate column and row indices
        const colIndex = pageSpecificIndex % columnsPerPage;
        const rowIndex = Math.floor(pageSpecificIndex / columnsPerPage);

        // Calculate the X and Y positions for the QR code
        const x = colIndex * (imageWidth + columnSpacing) + 10; // 10 mm left margin
        const y = rowIndex * (imageHeight + rowSpacing) + 20; // 20 mm top margin

        // Debug position
        console.log(`Adding image at position: (${x}, ${y}) on page ${Math.floor(index / maxImagesPerPage) + 1}`);

        // Add QR code image to the PDF
        pdf.addImage(image.qr_code_image, 'PNG', x, y, imageWidth, imageHeight);
    });

    // Save the PDF with the specified file name
    pdf.save(`${row.product_name || 'QR_Codes'}.pdf`);
};

    
    
    return (
        <Fragment>
          <Pageheader 
                currentpage={"Download QR"} 
                activepage={"/product-master"} 
                mainpage={"/download-qr-code"} 
                activepagename='Product Master' 
                mainpagename='Download QR' 
            />
            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent 
                            title="Download Product QR" 
                            onSearch={handleSearch} 
                            onAddButtonClick={handleAddProductClick} 
                            buttonText="Back" 
                            showButton={true} 
                            icon="ri-arrow-left-line"
                        />

                        <div className="box-body m-5">
                            <TableComponent<DownloadProductQRCode>
                                columns={[
                                    { header: 'Product Name', accessor: 'product_name' },
                                    { header: 'Reward Points', accessor: 'points' },
                                    { header: 'Generated Date', accessor: 'generated_date' },
                                    { header: 'Total QR', accessor: 'total_product' },
                                ]}
                                data={data}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handlePageChange={handlePageChange}
                                showProductQR={false} 
                                editHeader='Download QR'
                                showEdit={true} 
                                iconsConfig={{
                                    editIcon: "bi bi-download",
                                }}
                                // Pass the entire row to handleDownloadQR
                                onEdit={handleDownloadQR} 
                                columnStyles={{
                                    'Product Name': 'text-[var(--primaries)] font-semibold',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default DownloadQRCode;
