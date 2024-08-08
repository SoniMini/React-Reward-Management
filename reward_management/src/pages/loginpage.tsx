import { useState, Fragment } from 'react';
import desktoplogo from "@/assets/images/logo-2.png";
import { Box, Button, Callout, Card, Flex, Text } from '@radix-ui/themes';
import { useFrappeAuth } from 'frappe-react-sdk';


const Loginpage = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { currentUser, login, logout, error, isLoading } = useFrappeAuth();
    const [loginError, setLoginError] = useState<any>('');
    const [currentForm, setCurrentForm] = useState<'login' | 'register' | 'carpenterLogin'>('login');
    const [passwordShow, setPasswordShow] = useState<boolean>(false);

    const [isOtpVisible, setIsOtpVisible] = useState(false);

    const [data, setData] = useState({
        email: "",
        password: "",
        firstName: "",
        fullName: "",
        city: "",
        mobile: "",
        otp: "",
        mobilenumber: "",
        mobileotp: "",
    });

    const { email, password: registerPassword, firstName, fullName, city, mobile, otp, mobilenumber, mobileotp } = data;

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
        setLoginError("");
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
            alert("Mobile number must be exactly 10 digits.");
            return;
        }
        // Add your registration logic here
        console.log("Register with:", data);
    };

    const handleCarpenterLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (mobilenumber.length !== 10 || !/^\d+$/.test(mobilenumber)) {
            alert("Mobile number must be exactly 10 digits.");
            return;
        }
        // Handle carpenter login logic here
        console.log("Carpenter login with:", mobilenumber, mobileotp);
    };

    const handleGetOtp = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to send OTP
        setIsOtpVisible(true); // Show OTP fields
    };

    return (
        <Fragment>
            <div className="h-screen flex items-center justify-center text-defaultsize text-defaulttextcolor">
                <div className="grid grid-cols-12 gap-4">
                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-3 sm:col-span-2"></div>
                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-6 sm:col-span-8 col-span-12">
                        <div className="my-[1.5rem] flex justify-center">
                            <img src={desktoplogo} alt="logo" className="w-28" />
                        </div>
                        <Card className="p-8 box-shadow-md">
                            <div className="flex justify-center mb-4">
                                <svg className="w-16 h-16 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                                </svg>
                            </div>
                            <div className="text-center mb-4">
                                <p className="text-lg font-semibold">
                                    {currentForm === "login" && "Login"}
                                    {currentForm === "register" && "Registration"}
                                    {currentForm === "carpenterLogin" && "Carpenter Login"}
                                </p>
                                <p>
                                    {currentForm === "login" && "Please Login to Your Account"}
                                    {currentForm === "register" && "Please enter details to register"}
                                    {currentForm === "carpenterLogin" && "Please login as a Carpenter"}
                                </p>
                            </div>

                            <div className="flex justify-evenly border-b mb-6 gap-4">
                                <Button onClick={() => setCurrentForm('login')} className={`flex-1 ${currentForm === 'login' ? 'border-b-2 border-primary text-primary' : ''}`}>
                                    Admin
                                </Button>
                                <Button onClick={() => setCurrentForm('register')} className={`flex-1 ${currentForm === 'register' ? 'border-b-2 border-primary text-primary' : ''}`}>
                                    Carpenter
                                </Button>
                            </div>

                            {loginError && (
                                <Callout.Root color='red'>
                                    <Callout.Text>
                                        {JSON.stringify(loginError)}
                                    </Callout.Text>
                                </Callout.Root>
                            )}

                            <div className="mt-6">
                                {currentForm === 'login' && (
                                    <form onSubmit={handleLogin}>
                                        <Box className="mb-4">
                                            <Text as='label' htmlFor='login-username'>Username/Email</Text>
                                            <input
                                                id='login-username'
                                                type='text'
                                                placeholder='Username'
                                                onChange={(e) => setUsername(e.target.value)}
                                                value={username}
                                                className="border p-2 rounded w-full"
                                            />
                                        </Box>
                                        <Box className="mb-4">
                                            <Text as='label' htmlFor='login-password'>Password</Text>
                                            <div className="relative">
                                                <input
                                                    id='login-password'
                                                    type={passwordShow ? 'text' : 'password'}
                                                    placeholder='******'
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    value={password}
                                                    className="border p-2 rounded w-full"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setPasswordShow(!passwordShow)}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                                                >
                                                    {passwordShow ? 'Hide' : 'Show'}
                                                </button>
                                            </div>
                                        </Box>
                                        <Button type="submit" disabled={isLoading} className="w-full mb-2">
                                            Login
                                        </Button>
                                        <Button onClick={logout} color='gray' className="w-full">
                                            Logout
                                        </Button>
                                    </form>
                                )}

                                {currentForm === "register" && (
                                    <form onSubmit={handleRegister}>
                                        <Box className="mb-4">
                                            <Box className="xl:col-span-12 col-span-12 mb-3">
                                                <Text as='label' htmlFor="register-firstName" className="form-label text-default">First Name</Text>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    id="register-firstName"
                                                    className="form-control form-control-lg border p-2 rounded w-full"
                                                    onChange={changeHandler}
                                                    value={firstName}
                                                    placeholder="First Name"
                                                    required
                                                />
                                            </Box>

                                            <Box className="xl:col-span-12 col-span-12 mb-3">
                                                <Text as='label' htmlFor="register-fullName" className="form-label text-default">Full Name</Text>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    id="register-fullName"
                                                    className="form-control form-control-lg p-2 border rounded w-full"
                                                    onChange={changeHandler}
                                                    value={fullName}
                                                    placeholder="Full Name"
                                                    required
                                                />
                                            </Box>

                                            <Box className="xl:col-span-12 col-span-12 mb-3">
                                                <Text as='label' htmlFor="register-city" className="form-label text-default">City</Text>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    id="register-city"
                                                    className="form-control form-control-lg border p-2 rounded w-full"
                                                    onChange={changeHandler}
                                                    value={city}
                                                    placeholder="City"
                                                    required
                                                />
                                            </Box>

                                            <Box className="xl:col-span-12 col-span-12 mb-3">
                                                <Text as='label' htmlFor="register-mobile" className="form-label text-default">Mobile Number</Text>
                                                <input
                                                    type="text"
                                                    name="mobile"
                                                    id="register-mobile"
                                                    className="form-control form-control-lg p-2 border rounded w-full"
                                                    onChange={changeHandler}
                                                    value={mobile}
                                                    placeholder="Mobile"
                                                    required
                                                />
                                            </Box>

                                            <Box className="xl:col-span-12 col-span-12 mb-3">
                                                <Text as='label' htmlFor="register-email" className="form-label text-default">Email</Text>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="register-email"
                                                    className="form-control form-control-lg border p-2 rounded w-full"
                                                    onChange={changeHandler}
                                                    value={email}
                                                    placeholder="Email"
                                                    required
                                                />
                                            </Box>

                                            <Box className="xl:col-span-12 col-span-12 mb-3">
                                                <Text as='label' htmlFor="register-password" className="form-label text-default">Password</Text>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    id="register-password"
                                                    className="form-control form-control-lg border p-2 rounded w-full"
                                                    onChange={changeHandler}
                                                    value={registerPassword}
                                                    placeholder="Password"
                                                    required
                                                />
                                            </Box>

                                            <Button type="submit" disabled={isLoading} className="w-full mb-2">
                                                Register
                                            </Button>
                                        </Box>
                                    </form>
                                )}

                                {currentForm === 'carpenterLogin' && (
                                    <form onSubmit={handleCarpenterLogin}>
                                        <Box className="mb-4">
                                            <Text as='label' htmlFor='carpenter-login-mobilenumber'>Mobile Number</Text>
                                            <input
                                                id='carpenter-login-mobilenumber'
                                                type='text'
                                                name="mobilenumber"
                                                placeholder='Mobile Number'
                                                onChange={changeHandler}
                                                value={mobilenumber}
                                                className="border p-2 rounded w-full"
                                                required
                                            />
                                        </Box>

                                        {isOtpVisible && (
                                            <Box className="mb-4">
                                                <Text as='label' htmlFor='carpenter-login-otp'>OTP</Text>
                                                <input
                                                    id='carpenter-login-otp'
                                                    type='text'
                                                    name="mobileotp"
                                                    placeholder='OTP'
                                                    onChange={changeHandler}
                                                    value={mobileotp}
                                                    className="border p-2 rounded w-full"
                                                    required
                                                />
                                            </Box>
                                        )}

                                        <Button onClick={handleGetOtp} disabled={isLoading} className="w-full mb-2">
                                            Get OTP
                                        </Button>
                                        {isOtpVisible && (
                                            <Button type="submit" disabled={isLoading} className="w-full mb-2">
                                                Login
                                            </Button>
                                        )}
                                    </form>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Loginpage;
