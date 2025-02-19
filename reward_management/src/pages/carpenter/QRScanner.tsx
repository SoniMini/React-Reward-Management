import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';
import '../../assets/css/pages/qrscanner.css';
// import { BASE_URL } from "../../utils/constants";
import SuccessAlert from '@/components/ui/alerts/SuccessAlert';
import PointCollectAlert from '@/components/ui/alerts/PointCollected';

const QRScanner = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [carpenterData, setCarpenterData] = useState<any | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showPointCollectAlert, setShowPointCollectAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isCollectingPoints, setIsCollectingPoints] = useState<boolean>(false);
  const qrScannerRef = useRef<HTMLDivElement | null>(null);
  const [customerId, setCustomerId] = useState<string>('');
  const [productTableName, setProductTableName] = useState<string>('');
  const [productQrId, setProductQrId] = useState<string>('');
  const [productQrPoints, setProductQrPoints] = useState<string>('');
  const [mobileNumber,setMobileNumber] = useState<string>('');

  useEffect(() => {
    const fetchUserEmailAndInitScanner = async () => {
      try {
        const userResponse = await axios.get(`/api/method/frappe.auth.get_logged_user`);
        const userData = userResponse.data;

        if (userData.message) {
          console.log("Logged user data:", userData);
          setUserEmail(userData.message);
          await fetchAndLogCarpenterData();
          initQRScanner();
        } else {
          console.error("No email found in response.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchAndLogCarpenterData = async () => {
      try {
        const carpenterResponse = await axios.get(`/api/method/reward_management_app.api.carpenter_master.get_customer_details`);
        console.log("Carpenter data:", carpenterResponse.data);
        const customer_id = carpenterResponse.data.message.name || '';
        setCustomerId(customer_id);
        if (carpenterResponse.data && !carpenterResponse.error) {
          const customer = carpenterResponse.data.message;
          console.log("Customer Name:", customer.name);
          console.log("Total Points:", customer.total_points);
          setCarpenterData(customer);
          setMobileNumber(customer.mobile_number || ''); 

        } else {
          console.error("Error fetching carpenter data:", carpenterResponse.error);
        }
      } catch (error) {
        console.error("Error fetching carpenter data:", error);
      }
    };

    // const initQRScanner = () => {
    //   const onScanSuccess = async (decodedText: string) => {
    //     try {
    //       const productResponse = await axios.get(`/api/method/reward_management_app.api.qr_code_product_detail.get_product_details_from_qr`, {
    //         params: { decode_text: decodedText }
    //       });

    //       if (productResponse.data.message?.error) {
    //         setAlertMessage("This QR Code has already been scanned.");
    //         setIsError(true);
    //       } else {
    //         const productData = productResponse.data;
    //         console.log("scanned qr data", productData);
    //         setProductTableName(productData.message.product_table_name); // Save product_table_name
    //         setProductQrId(productData.message.product_qr_id);
    //         setProductQrPoints(productData.message.points);
    //         setAlertMessage(
    //           `Product Name: ${productData.message.product_name}  Points: ${productData.message.points}`
    //         );
    //         setIsError(false);
    //         setCarpenterData(productData);
    //       }
    //       setShowAlert(true);
    //     } catch (error) {
    //       console.error("Error fetching product details:", error);
    //       setAlertMessage("Error fetching product details. Please try again.");
    //       setIsError(true);
    //       setShowAlert(true);
    //     }
    //   };


    const initQRScanner = () => {
      const onScanSuccess = async (decodedText: string) => {
        console.log("Decoded QR Code:", decodedText);
        try {
          const productResponse = await axios.get(`/api/method/reward_management_app.api.qr_code_product_detail.get_product_details_from_qr`, {
            params: { decode_text: decodedText },
          });

          if (productResponse.data.message?.error) {
            const errorMessage = productResponse.data.message.error;
            setAlertTitle("Error");
            setAlertMessage(errorMessage);
            setIsError(true);
            setShowAlert(true);
          } else {
            const productData = productResponse.data;
            console.log("Scanned QR data", productData);
            setProductTableName(productData.message.product_table_name);
            setProductQrId(productData.message.product_qr_id);
            setProductQrPoints(productData.message.points);
            // setProductEarnedAmount(productData.message.earned_amount);
            setAlertMessage(
              `Product Name: ${productData.message.product_name} Points: ${productData.message.points}`
            );
            setIsError(false);
            setCarpenterData(productData);
            setShowAlert(true); // Ensure to show the alert for success as well
          }
        } catch (error) {
          console.error("Error fetching product details:", error);
          setAlertTitle("Error"); // Add title for consistency
          setAlertMessage("Error fetching product details. Please try again.");
          setIsError(true);
          setShowAlert(true); // Ensure to show the alert
        }
      };

      const html5QrCodeScanner: any = new Html5QrcodeScanner("my-qr-reader", { fps: 10, qrbox: 250 }, true);
      html5QrCodeScanner.render(onScanSuccess);

      const reader = qrScannerRef.current;
      if (reader) {
        const scannerWidth = reader.clientWidth;
        if (scannerWidth < 250) {
          html5QrCodeScanner.setWidth(scannerWidth);
        }
      }
    };

    fetchUserEmailAndInitScanner();
  }, []);

  // handle collect points
  const handleCollectPoints = async () => {
    setIsCollectingPoints(true);
    try {



      if (!customerId || !productTableName || !productQrId || !productQrPoints) {
        throw new Error("Customer ID is missing");
      }

      // First API call to collect points
      const response = await axios.post(`/api/method/reward_management_app.api.carpenter_master.update_customer_points`, {
        points: productQrPoints,
        carpenter_id: customerId // Use customerId instead of carpenterId
      });

      if (response.data.message?.success === true) {
        console.log("Points collected successfully:", response);

        // Second API call to update scanned status
        const updateResponse = await axios.post(`/api/method/reward_management_app.api.qr_code_product_detail.update_scanned_status`, {
          product_table_name: productTableName,
          product_qr_id: productQrId,
          carpenter_id: customerId // Ensure customerId is passed
        });

        console.log("Product QR table data:", updateResponse);

        if (updateResponse.data.message?.success === true) {
          console.log("Scanned status updated successfully:", updateResponse);
          setShowAlert(false); // Close the SuccessAlert
          setAlertMessage("Points collected and status updated successfully!");
          setIsError(false);
          setShowPointCollectAlert(true); // Open the PointCollectAlert
        } else {
          setAlertMessage("Failed to update scanned status. Please try again.");
          setIsError(true);
        }
      } else {
        setAlertMessage("Failed to collect points. Please try again.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error collecting points or updating status:", error);
      setAlertMessage("Error collecting points or updating status. Please try again.");
      setIsError(true);
    }
    setIsCollectingPoints(false);
  };


  const onPointCollect = async () => {
    try {
      // Call the API to update carpenter points
      const response = await axios.post(`/api/method/reward_management_app.api.carpenter_master.update_carpainter_points`, {
        product_name: productTableName,
        points: productQrPoints
      });

      if (response.data.message?.success === true) {
        console.log("Carpenter points updated successfully:", response);
        axios.post('/api/method/reward_management_app.api.sms_api.reward_point_deposited_after_qr_scan_sms', {
          mobile_number: mobileNumber,
          point:productQrPoints
      }, {
          headers: {
              'Content-Type': 'application/json',

          }
      });

      console.log("QR Code scanned and collect point SMS API called successfully");
        // Close the alert or perform other actions if needed
        setShowPointCollectAlert(false);
      } else {
        console.error("Failed to update carpenter points. Please try again.");
      }
    } catch (error) {
      console.error("Error updating carpenter points:", error);
    }
  };



  return (
    <main className="flex items-center justify-center h-screen">
      <div className="border border-defaultborder p-6 bg-white shadow-lg rounded-[5px]">
        <h1 className="text-base text-primary font-semibold mb-3 text-center">Scan QR Codes</h1>
        <div className="flex justify-center items-center w-[400px] border rounded-[5px]">
          <div id="my-qr-reader" className='w-[400px]' ref={qrScannerRef}></div>
        </div>
      </div>

      {/* {showAlert && (
        isError ? (
          <SuccessAlert
            message={alertMessage}
            title="This QR Code has already been scanned"
            buttonLabel="Close"
            onClose={() => setShowAlert(false)}
            showButton={true}
            showMessage={false} onCancel={function (): void {
              throw new Error('Function not implemented.');
            } }          />
        ) : (
          <SuccessAlert
              message={alertMessage}
              title="QR Code Successfully Scanned"
              collectButtonLabel="Collect"
              showMessage={true}
              showMessagesecond={false}
              onClose={() => setShowAlert(false)} // You might want to set showAlert to false here to close the alert
              showCollectButton={true}
              onCollect={handleCollectPoints}
              showButton={true} // Set this to true to show the close button
              onCancel={function (): void {
                throw new Error('Function not implemented.');
              } }          />
        )
      )} */}

      {showAlert && (
        isError ? (
          <SuccessAlert
            message={alertMessage}
            title={alertTitle}
            buttonLabel="Close"
            onClose={() => setShowAlert(false)}
            showButton={true} onCancel={function (): void {
              throw new Error('Function not implemented.');
            }} />
        ) : (
          <SuccessAlert
            message={alertMessage}
            title="QR Code Successfully Scanned"
            collectButtonLabel="Collect"
            showMessage={true}
            onClose={() => setShowAlert(false)}
            showCollectButton={true}
            onCollect={handleCollectPoints}
            showButton={true} onCancel={function (): void {
              throw new Error('Function not implemented.');
            }} />
        )
      )}

      {showPointCollectAlert && (
        <PointCollectAlert
          pointmessage="Congratulations! Your points have been collected."
          onPointClose={() => setShowPointCollectAlert(false)}
          showPointCollectButton={true}
          collectButtonLabel="Ok"
          onPointCollect={onPointCollect}
        />
      )}
    </main>
  );
};

export default QRScanner;
