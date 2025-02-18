import React, { useState, Fragment, useEffect } from "react";
import { Box, Button, Text, Card } from "@radix-ui/themes";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import SuccessAlert from "../../components/ui/alerts/SuccessAlert";
import desktoplogo from "@/assets/images/01.png";
import "../../assets/css/style.css";
import { error } from "console";

const Forgotpassword = () => {
    const notyf = new Notyf({
        position: { x: 'right', y: 'top' },
        duration: 3000,
    });

    const navigate = useNavigate();
  
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordShow, setPasswordShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [logo, setLogo] = useState(desktoplogo); // Default logo
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    // Fetch website settings to set the logo
    useEffect(() => {
        const fetchWebsiteSettings = async () => {
            try {
                const response = await axios.get('/api/method/reward_management_app.api.website_settings.get_website_settings');
                if (response.data?.message?.status === "success") {
                    const { banner_image } = response.data.message.data;
                    if (banner_image) {
                        setLogo(`${window.origin}${banner_image}`);
                    }
                }
            } catch (error) {
                console.error("Error fetching website settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWebsiteSettings();

        // Optional: Handle success alert display logic
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
            }, 3000); // Hide alert after 3 seconds
            return () => clearTimeout(timer);
        }

        if (password && confirmPassword && password === confirmPassword) {
            setPasswordsMatch(true);
        } else {
            setPasswordsMatch(false);
            
        }
    }, [showSuccessAlert,password, confirmPassword]);

    if (loading) {
        return <div>Loading...</div>; // Display loading state
    }

    const handlePasswordReset = async (e: any) => {
        e.preventDefault();
    
        if (!username || !password) {
            notyf.error('Please fill in both fields.');
            return;
        }
    
        try {
            const response = await axios.post(
                `/api/method/reward_management_app.api.forgot_password.update_password_without_current`,
                {
                    email: username,
                    new_password: password
                }
            );
    
            if (response.data.message.success === true) {
                setAlertTitle('Success');
                setAlertMessage('Your password has been successfully reset.');
                setShowSuccessAlert(true);
    
                // Wait for alert to show before redirecting
                setTimeout(() => {
                    navigate('/');
                }, 3000); 
            } else {
                // Check if there is a server-side error message
                const errorMessage = response.data.message?.message || 'Failed to reset password';
                const errorTitle = response.data.message?.title || 'Error';
                notyf.error(`${errorTitle}: ${errorMessage}`);
            }
        } catch (error) {
            // Show generic error message in case of an unexpected error
            notyf.error('An error occurred while resetting the password.');
            console.error("Password reset error:", error);
    
            // Optionally, you can also display the server-side error if it exists in the `error.response` object
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message.message || 'An unexpected error occurred.';
                const errorTitle = error.response.data.message.title || 'Error';
                notyf.error(`${errorTitle}: ${errorMessage}`);
            }
        }
    };
    

    

    return (
        <Fragment>
            <div className="ssm:h-[100vh] h-auto ssm:bg-white flex items-center justify-center text-defaultsize text-defaulttextcolor overflow-y-scroll">
                <div className="grid grid-cols-12 gap-4">
                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-3 sm:col-span-2"></div>
                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-6 sm:col-span-8 col-span-12 sm:max-w-[420px] sm:w-[420px] max-w-[300px] w-[300px]">
                        <Card className="sm:p-8 p-6 rounded-[10px] bg-[var(--body-bg)]">
                            <div className="flex justify-center mb-8">
                                <img src={logo} alt="logo" className="w-20" />
                            </div>
                            <div className="text-center mb-5 text-primary">
                                <p className="text-lg font-semibold">Reset Password</p>
                                <p className="text-[#8c9097] text-center font-normal">Please Enter New Password</p>
                            </div>

                            <div className="mt-6 sm:w-full">
                                <form onSubmit={handlePasswordReset} className="sm:max-w-[350px] sm:w-[350px] max-w-[250px] w-[250px]">
                                    <Box className="mb-4">
                                        <Text as="label" htmlFor="username" className="text-defaultsize font-semibold text-primary">
                                            Email
                                        </Text>
                                        <input
                                            id="username"
                                            type="text"
                                            placeholder="Email"
                                            onChange={(e) => setUsername(e.target.value)}
                                            value={username}
                                            className="bg-white border-none shadow-md rounded-[5px] p-2 mt-2 text-xs sm:w-full w-[250px] text-primary outline-none focus:outline-none focus:ring-0 no-outline focus:border-defaultbackground"
                                        />
                                    </Box>

                                    <Box className="mb-4">
                                        <Text as="label" htmlFor="password" className="text-defaultsize font-semibold text-primary">
                                            New Password
                                        </Text>
                                        <div className="relative sm:max-w-full sm:w-full max-w-[250px] w-[250px]">
                                            <input
                                                id="password"
                                                type={passwordShow ? "text" : "password"}
                                                placeholder="******"
                                                onChange={(e) => setPassword(e.target.value)}
                                                value={password}
                                                className="bg-white border-none text-xs shadow-md p-2 pt-2 mt-2 rounded-[5px] sm:w-full w-[250px] outline-none focus:outline-none focus:ring-0 no-outline focus:border-defaultbackground"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setPasswordShow(!passwordShow)}
                                                className="absolute inset-y-0 pt-2 right-0 pr-3 flex items-center text-xs text-gray-500"
                                            >
                                                {passwordShow ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </Box>

                                    {/* confirm password  */}
                                    <Box className="mb-4">
                                        <Text as="label" htmlFor="confirmpassword" className="text-defaultsize font-semibold text-primary">
                                            Confirm Password
                                        </Text>
                                        <div className="relative sm:max-w-full sm:w-full max-w-[250px] w-[250px]">
                                            <input
                                                id="confirmpassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="******"
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                value={confirmPassword}
                                                className="bg-white border-none text-xs shadow-md p-2 pt-2 mt-2 rounded-[5px] sm:w-full w-[250px] outline-none focus:outline-none focus:ring-0 no-outline focus:border-defaultbackground"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 pt-2 right-0 pr-3 flex items-center text-xs text-gray-500"
                                            >
                                                {showConfirmPassword ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </Box>
                                    <Button 
                                        type="submit" 
                                        className={`ti-btn new-launch !bg-primary !text-white !font-medium border-none shadow-md w-full ${!passwordsMatch ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={!passwordsMatch}
                                    >
                                        Save Password
                                    </Button>
                                    <Box className="mt-4 text-center font-semibold">
                                        <Text className="text-default text-primary">
                                            Back to 
                                         <Link to="/" className="text-defaulttextcolor"> Login</Link>
                                        </Text>
                                    </Box>
                                </form>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
            {showSuccessAlert && (
                <SuccessAlert title={alertTitle} showButton={false} message={alertMessage} />
            )}
        </Fragment>
    );
};

export default Forgotpassword;
