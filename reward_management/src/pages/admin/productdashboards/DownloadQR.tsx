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



    //    per page 1 row 2 column---------------------
    // const handleDownloadQR = async (row: DownloadProductQRCode) => {
    //     const imageWidth = 33; // Image width in mm
    //     const imageHeight = 33; // Image height in mm
    //     const imagesPerRow = 2; // 2 images per row
    //     const marginLeft = 2.5; // Left margin in mm
    //     const marginTop = 2.5; // Top margin in mm
    //     const gap = 10; // Gap between images in mm
    
    //     // Calculate dynamic page dimensions for one row of images
    //     const pageWidth = marginLeft * 2 + imagesPerRow * imageWidth + (imagesPerRow - 1) * gap;
    //     const pageHeight = marginTop * 2 + imageHeight;
    
    //     const pdf = new jsPDF({
    //         unit: 'mm',
    //         format: [pageWidth, pageHeight], // Custom page size for one row
    //     });
    
    //     let currentImageIndex = 0;
    
    //     while (currentImageIndex < row.qr_code_images.length) {
    //         // Loop through the images for the current row
    //         for (let i = 0; i < imagesPerRow; i++) {
    //             if (currentImageIndex >= row.qr_code_images.length) break; // Stop if no more images
    
    //             const imageX = i * (imageWidth + gap) + marginLeft;
    //             const imageY = marginTop;
    
    //             // Add the QR code image to the PDF
    //             pdf.addImage(row.qr_code_images[currentImageIndex].qr_code_image, 'PNG', imageX, imageY, imageWidth, imageHeight);
    
    //             currentImageIndex++;
    //         }
    
    //         // Add a new page for the next row, if there are more images
    //         if (currentImageIndex < row.qr_code_images.length) {
    //             pdf.addPage([pageWidth, pageHeight]); // Ensure page size matches for each page
    //         }
    //     }
    
    //     // Save the PDF with the appropriate filename
    //     pdf.save(`${row.product_name || 'QR_Codes'}.pdf`);
    // };
       //  download and create direct pdf for qr images---------
//    per page 2 row 2 column---------------------
       const handleDownloadQR = async (row: DownloadProductQRCode) => {
        const pdf = new jsPDF({
            unit: 'mm', // Set unit to millimeters
            format: [80, 80] // Custom size: 80mm by 80mm (adjust as needed)
        });
    
        const imageWidth = 33; // Image width in mm
        const imageHeight = 33; // Image height in mm
        const imagesPerRow = 2; // 2 images per row
        const rowsPerPage = 1; // 2 rows per page
        const marginLeft = 2.5; // Left margin in mm
        const marginRight = 2.5; // Right margin in mm
        const marginTop = 2.5; // Top margin in mm
        const marginBottom = 2.5; // Bottom margin in mm
        const gap = 10; // Gap between images in mm
    
        const pageWidth = pdf.internal.pageSize.width; // Get page width in mm
        const pageHeight = pdf.internal.pageSize.height; // Get page height in mm
    
        let currentImageIndex = 0; // To track which image we're placing
        let currentY = marginTop; // Start from top with top margin
    
        // Loop through images and place them in 2 columns per row and 2 rows per page
        while (currentImageIndex < row.qr_code_images.length) {
            // Check if adding the next image will exceed the page height
            if (currentImageIndex % (imagesPerRow * rowsPerPage) === 0 && currentImageIndex > 0) {
                pdf.addPage(); // Add a new page if the height exceeds
                currentY = marginTop; // Reset Y position after adding a new page
            }
    
            // Calculate the X position for each image with gap between images
            const imageX = (currentImageIndex % imagesPerRow) * (imageWidth + gap) + marginLeft;
    
            // Add the QR code image to the page
            pdf.addImage(row.qr_code_images[currentImageIndex].qr_code_image, 'PNG', imageX, currentY, imageWidth, imageHeight);
    
            // After placing 2 images (one row), move to the next row and add margin
            if ((currentImageIndex + 1) % imagesPerRow === 0) {
                currentY += imageHeight + marginBottom; // Move to the next row after 2 images
            }
    
            currentImageIndex++;
        }
    
        // Save the PDF as a blob and directly download it
        pdf.save(`${row.product_name || 'QR_Codes'}.pdf`);
    };




    // per page one row one col----------
    // const handleDownloadQR = async (row: DownloadProductQRCode) => {
    //     const imageWidth = 33; // Image width in mm
    //     const imageHeight = 33; // Image height in mm
    //     const imagesPerRow = 1; // 2 images per row
    //     const marginLeft = 2; // Left margin in mm
    //     const marginRight = 2; // Right margin in mm
    //     const marginTop = 2.5; // Top margin in mm
    //     const marginBottom = 2.5; // Bottom margin in mm
    //     const gap = 5; // Gap between images in mm
    
    //     // Calculate the width of the page based on image width, gap, and margins
    //     const pageWidth = imageWidth * imagesPerRow  + gap * (imagesPerRow) + marginLeft + marginRight;
    
    //     // The page height will accommodate just one row of images
    //     const pageHeight = imageHeight + marginTop + marginBottom;
    
    //     // Initialize the PDF with custom page size (one row with two images)
    //     const pdf = new jsPDF({
    //         unit: 'mm', // Set unit to millimeters
    //         format: [pageWidth, pageHeight] // Custom page size to fit one row of two images
    //     });
    
    //     let currentImageIndex = 0; // To track which image we're placing
    //     let currentY = marginTop; // Start from the top with top margin
    
    //     // Loop through images and place them in 2 columns per row, one row per page
    //     while (currentImageIndex < row.qr_code_images.length) {
    //         // Calculate the X position for each image with a gap between images
    //         const imageX = (currentImageIndex % imagesPerRow) * (imageWidth + gap) + marginLeft;
    
    //         // Add the QR code image to the page
    //         pdf.addImage(row.qr_code_images[currentImageIndex].qr_code_image, 'PNG', imageX, currentY, imageWidth, imageHeight);
    
    //         // Move to the next image
    //         currentImageIndex++;
    
    //         // If we've placed two images (one row), add a new page for the next row
    //         if (currentImageIndex % imagesPerRow === 0 && currentImageIndex < row.qr_code_images.length) {
    //             pdf.addPage(); // Add a new page for the next row of images
    //             currentY = marginTop; // Reset Y position for the next page
    //         }
    //     }
    
    //     // Save the PDF as a blob and directly download it
    //     pdf.save(`${row.product_name || 'QR_Codes'}.pdf`);
    // };
    
    


    
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