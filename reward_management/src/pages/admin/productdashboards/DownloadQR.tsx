import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { BASE_URL } from "../../../utils/constants";
import Pageheader from '@/components/common/pageheader/pageheader';
import TableComponent from '@/components/ui/tables/tablecompnent'; 
import TableBoxComponent from '@/components/ui/tables/tableboxheader';
import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
// import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
// import JSZip from 'jszip';
// import html2canvas from 'html2canvas';

interface QRCodeImage {
    qr_code_image: string;
    points: number;
}

interface DownloadProductQRCode {
    product_name?: string;
    generated_date?: string;
    generated_time?: string;
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
    const [filteredData, setFilteredData] = useState<DownloadProductQRCode[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);

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
                        generated_time: item.generated_time,
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




// table filter logic-------------
useEffect(() => {
    const parseDateString = (dateString: string): Date | null => {
      console.log("Input dateString:", dateString);
      if (typeof dateString !== 'string' || !dateString.trim()) {
        console.error("Expected a non-empty string, but received:", dateString);
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
  
      const date = new Date(year, month, day);
      return isNaN(date.getTime()) ? null : date; 
    };
  
    const filtered = data
      ?.map((item) => ({
        ...item,
        generated_date: item.generated_date || "", 
      }))
      .filter((item) => {
        const query = searchQuery.toLowerCase();
        const generatedDateString = item.generated_date;
  
        const generatedDate = generatedDateString
          ? parseDateString(generatedDateString)
          : null;
  
        const isWithinDateRange =
          (!fromDate || (generatedDate && generatedDate >= new Date(fromDate))) &&
          (!toDate || (generatedDate && generatedDate <= new Date(toDate)));
  
        const matchesSearchQuery =
          item.product_name?.toLowerCase().includes(query) ||
          (item.points && item.points.toString().includes(query)) ||
          (item.generated_time && item.generated_time.toString().includes(query)) ||
          (item.total_product && item.total_product.toString().includes(query));
  
        return isWithinDateRange && matchesSearchQuery;
      });
  
    setFilteredData(filtered);
  }, [data, searchQuery, fromDate, toDate]);
  


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
    setSearchQuery(value);
    setCurrentPage(1);
  };

const handleAddProductClick = () => {
    console.log("Back button clicked");
    navigate('/product-master');
};

const handleDateFilter = (from: Date | null, to: Date | null) => {
    setFromDate(from);
    setToDate(to);
    setCurrentPage(1);
  };

  if (error) return <div>Error: {error}</div>;


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

    

       //  download and create direct pdf for qr images---------
// //    per page 2 row 2 column---------------------
const handleDownloadQR = async (row: DownloadProductQRCode) => {
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm', 
        format: [80, 38], 
    });

    const imageWidth = 33; 
    const imageHeight = 33;
    const imagesPerRow = 2;
    const rowsPerPage = 1; 

    const marginLeft = 2;
    const marginRight = 2; 
    const marginTop = 2.5; 
    const marginBottom = 2.5; 

    // Calculate available space for images
    const pageWidth = 80; 
    const pageHeight = 38; 
    const availableWidth = pageWidth - marginLeft - marginRight;
    const availableHeight = pageHeight - marginTop - marginBottom; 

    // Calculate the gap between images dynamically
    const gapX = (availableWidth - imagesPerRow * imageWidth) / (imagesPerRow - 1);
    const gapY = (availableHeight - rowsPerPage * imageHeight) / (rowsPerPage - 1);

    let currentImageIndex = 0; 
    let currentY = marginTop; 

    // Loop through images and place them
    while (currentImageIndex < row.qr_code_images.length) {
        if (currentImageIndex % (imagesPerRow * rowsPerPage) === 0 && currentImageIndex > 0) {
            pdf.addPage(); 
            currentY = marginTop; 
        }

        // Calculate the X position for the current image
        const imageX = marginLeft + (currentImageIndex % imagesPerRow) * (imageWidth + gapX);

        // Add the QR code image to the PDF
        pdf.addImage(row.qr_code_images[currentImageIndex].qr_code_image, 'PNG', imageX, currentY, imageWidth, imageHeight);

        // Move to the next row after placing the last image in the row
        if ((currentImageIndex + 1) % imagesPerRow === 0) {
            currentY += imageHeight + gapY; 
        }

        currentImageIndex++;
    }

    // Save the PDF file
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
                            showFromDate={true}
                            showToDate={true}
                            onDateFilter={handleDateFilter}
                            icon="ri-arrow-left-line"
                        />

                        <div className="box-body m-5">
                            <TableComponent<DownloadProductQRCode>
                                columns={[
                                    { header: 'Product Name', accessor: 'product_name' },
                                    { header: 'Reward Points', accessor: 'points' },
                                    { header: 'Generated Date', accessor: 'generated_date' },
                                    { header: 'Generated Time', accessor: 'generated_time' },
                                    { header: 'Total QR', accessor: 'total_product' },
                                ]}
                                data={filteredData.slice(
                                    (currentPage - 1) * itemsPerPage,
                                    currentPage * itemsPerPage
                                  )}
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
