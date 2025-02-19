import { Fragment, useRef, useState, useEffect } from 'react';
import axios from 'axios';
import Pageheader from '@/components/common/pageheader/pageheader';
import face9 from '../../../assets/images/reward_management/9.jpg';
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';

const CarpenterProfile = () => {

    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [selectedImage, setSelectedImage] = useState(face9); // Set the default image URL here
    const fileInputRef = useRef(null);
    const [UserImage, setUserImage] = useState('');
    const [changeImage, setChangeImage] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [oldEmail, setOldEmail] = useState('');
    const [mobileno, setMobileno] = useState('');
    const [gender, setGender] = useState('');
    const [genders, setGenders] = useState([]);
    const [birthdate, setBirthdate] = useState('');
    const [location, setLocation] = useState('');
    const [carpenterName, setCarpenterName] = useState('');

    // Reset form fields to their initial values
    const resetForm = () => {
        window.location.reload();
    };

    useEffect(() => {
        const pathSegments = window.location.pathname.split('/');
        let carpenterName = pathSegments[pathSegments.length - 1];
        carpenterName = carpenterName.replace(/_/g, ' ');
        setCarpenterName(carpenterName);  // Ensure carpenterName is set dynamically

        if (showSuccessAlert) {
            const timer = setTimeout(() => setShowSuccessAlert(false), 3000);
            return () => clearTimeout(timer);
        }

        const fetchUserEmailAndInitScanner = async () => {
            try {
                const userdata = await axios.get(`/api/method/reward_management_app.api.carpenter_profile.show_carpenter_user?carpenterName=${carpenterName}`);


                console.log("userData----->", userdata);
                setFirstName(userdata.data.message.first_name || "");
                setLastName(userdata.data.message.last_name || "");
                setFullname(userdata.data.message.full_name || "");
                setEmail(userdata.data.message.email || "");
                setOldEmail(userdata.data.message.email || "");
                setMobileno(userdata.data.message.mobile_no || "");
                setGender(userdata.data.message.gender || "");
                setBirthdate(userdata.data.message.birth_date || "");
                setLocation(userdata.data.message.location || "");
                setUserImage(userdata.data.message.user_image || face9);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const fetchAllGenders = async () => {
            try {
                const response = await axios.get(`/api/method/reward_management_app.api.carpenter_profile.get_all_gender`, {
                    method: "GET",
                });
                setGenders(response.data.message);
            } catch (error) {
                console.error("Error fetching genders:", error);
            }
        };

        fetchUserEmailAndInitScanner();
        fetchAllGenders();
    }, [showSuccessAlert]);

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setChangeImage(file);  // Store the actual file object here
        }
    };

    const update_user_details = async () => {
        try {
            const response = await axios.post(`/api/method/reward_management_app.api.carpenter_profile.update_carpenter_details`, {
                name: email,  // New email
                old_email: oldEmail,  // Old email
                first_name: firstName,
                last_name: lastName,
                full_name: fullname,
                mobile_no: mobileno,
                gender,
                birth_date: birthdate,
                location,
            });

            if (response.data.message.status === "success") {
                setShowSuccessAlert(true);
                console.log("User details updated successfully.");
            }
            else if (response.data.message.status === 'error') {
                console.log("Update user response:", response);
                setShowSuccessAlert(true);
                // setShowSuccessAlert(true); // This should likely be set to false in case of error
            }
            else {
                console.error("Unexpected response status:", response.data.message.status);
            }
        } catch (error) {
            console.error("Error updating user details:", error);
            setShowSuccessAlert(false);
        }
    };


    const openFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };



    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append("file", file, file.name);  // Ensure the correct File object is appended
        formData.append("is_private", "0");
        formData.append("folder", "");
        formData.append("file_name", file.name);

        try {
            const response = await axios.post(`/api/method/upload_file`, formData, {
                headers: {
                    'Accept': 'application/json',

                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.message && response.data.message.file_url) {
                return response.data.message.file_url;
            } else {
                console.error("File URL not found in response:", response.data);
                return null;
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            return null;
        }
    };


    // Handle User Image Chnage----
    const changeUserImage = async () => {
        if (!changeImage) {
            alert("Please select an image first.");
            return;
        }

        const uploadedFileUrl = await uploadFile(changeImage);

        if (uploadedFileUrl) {
            try {
                const response = await axios.post(`/api/method/reward_management_app.api.carpenter_profile.update_carpner_image`, {
                    new_image_url: uploadedFileUrl,
                    name: mobileno,
                }, {

                });

                if (response.data.message.status === "success") {
                    // setShowSuccessAlert(true);
                    console.log("uploadedFileUrl", uploadedFileUrl);
                    localStorage.setItem('uploadedFileUrl', uploadedFileUrl);

                    setUserImage(uploadedFileUrl);  // Update the user's profile image with the new image URL
                } else {
                    console.error("Failed to update user image:", response.data);
                }
            } catch (error) {
                console.error("Error updating user image:", error);
            }
        }
    };

    const removeUserImage = async () => {
        try {
            // Set the default image
            setSelectedImage(face9); // Assuming face9 is the default image you want to set

            // Call the API to remove the user image
            await axios.post(`/api/method/reward_management_app.api.carpenter_profile.remove_carpenter_image`, {
                name: mobileno,
            });

            // Remove the image from localStorage
            localStorage.removeItem('uploadedFileUrl');
            setUserImage(face9);

            setTimeout(() => {
                setUserImage(face9); 
            }, 2000);

        } catch (error) {
            console.error('Error removing user image:', error);
        }
    };



    return (
        <>
            <Pageheader
                currentpage={"Carpenter Profile"}
                activepage={"/carpenter-details"}
                mainpage={"/carpenter"}
                activepagename="Carpente Details"
                mainpagename={"Carpenter Profile"}
            />
            {/* <Pageheader currentpage="Profile Setting" activepage="Profile Setting" mainpage="Profile Setting" /> */}
            <div className='container sm:p-3 !p-0 mt-4'>
                <div className="grid grid-cols-12 gap-6 mb-[3rem]">
                    <div className="xl:col-span-12 col-span-12">
                        <div className="box ">
                            <div className="box-header sm:flex block !justify-start m-4 text-lg font-semibold  text-primary">
                                {fullname}
                            </div>
                            <div className="box-body border">
                                <div className="tab-content">
                                    <div className="sm:p-4 p-0">
                                        <h6 className="font-semibold mb-4 text-[1rem]">Photo :</h6>
                                        <div className="mb-6 md:flex items-center">
                                            <div className="mb-0 me-[3rem] relative">
                                                <span className="avatar avatar-xxl avatar-rounded relative inline-block">
                                                    <img src={UserImage || selectedImage} alt="" id="profile-img" className='rounded-full w-[130px] h-[130px] object-cover' />
                                                    <span aria-label="anchor" className="badge rounded-full bg-primary avatar-badge absolute top-[65%]  right-[2px] cursor-pointer py-[2px] px-[6px]" onClick={openFileInput}>
                                                        <input type="file" name="photo" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} className="absolute w-full h-full opacity-0" id="profile-image" />
                                                        <i className="fe fe-edit !text-[0.65rem] text-white"></i>
                                                    </span>
                                                </span>
                                            </div>

                                            <div className="inline-flex flex-col md:flex-row items-center sm:space-x-2 sm:space-y-0 space-y-2">
                                                <button type="button" className="ti-btn ti-btn-primary bg-primary me-1" onClick={changeUserImage}>Change</button>
                                                <button type="button" className="ti-btn-success bg-defaulttextcolor  text-white  ti-btn text-defaulttextcolor" onClick={removeUserImage}>Remove</button>
                                            </div>
                                        </div>
                                        <h6 className="font-semibold mb-4 text-[1rem]">Profile :</h6>
                                        <div className="sm:grid grid-cols-12 gap-6 mb-6">
                                            <div className="xl:col-span-6 col-span-12">
                                                <label htmlFor="first-name" className="form-label text-sm text-defaulttextcolor font-semibold">First Name</label>
                                                <input
                                                    type="text"
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                                    id="first-name"
                                                    placeholder="First Name"
                                                    value={firstName} // Set the value from the state
                                                    onChange={(e) => setFirstName(e.target.value)} // Allow user to change the value
                                                />
                                            </div>
                                            <div className="xl:col-span-6 col-span-12">
                                                <label htmlFor="last-name" className="form-label text-sm text-defaulttextcolor font-semibold">Last Name</label>
                                                <input type="text" className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm" id="last-name" placeholder="Last Name"
                                                    value={lastName} // Set the value from the state
                                                    onChange={(e) => setLastName(e.target.value)} />
                                            </div>
                                            <div className="xl:col-span-6 col-span-12">
                                                <label htmlFor="full-name" className="form-label text-sm text-defaulttextcolor font-semibold">Full Name</label>
                                                <input type="text" className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm" id="full-name" placeholder="Full Name"
                                                    value={fullname} // Set the value from the state
                                                    onChange={(e) =>


                                                        setFullname(e.target.value)


                                                    }
                                                />
                                            </div>

                                        </div>
                                        <h6 className="font-semibold mb-4 text-[1rem]">Personal information :</h6>
                                        <div className="sm:grid grid-cols-12 gap-6 mb-6">
                                            <div className="xl:col-span-6 col-span-12">
                                                <label htmlFor="email-address" className="form-label text-sm text-defaulttextcolor font-semibold">Email Address</label>

                                                <input type="text" className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm" id="email-address" placeholder="xyz@gmail.com"
                                                    value={email} // Set the value from the state
                                                    onChange={(e) => setEmail(e.target.value)}

                                                />
                                            </div>

                                            <div className="xl:col-span-6 col-span-12">
                                                <label htmlFor="mobile-number" className="form-label text-sm text-defaulttextcolor font-semibold ">Mobile Number</label>
                                                <input
                                                    type="text"
                                                    className={`outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] bg-[#e9ecef] form-control-light mt-2 text-sm`}
                                                    id="mobile-number"
                                                    placeholder="contact details"
                                                    value={mobileno}
                                                    readOnly

                                                />

                                            </div>
                                            <div className="xl:col-span-6 col-span-12">
                                                <label htmlFor="dob" className="form-label text-sm text-defaulttextcolor font-semibold">Date of Birth</label>
                                                <input type="date" className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm" id="dob" placeholder="contact details"
                                                    value={birthdate} // Set the value from the state
                                                    onChange={(e) => {
                                                        const selectedDate = e.target.value;
                                                        setBirthdate(selectedDate); // Update the state with the selected date
                                                        console.log("Selected Date:", selectedDate); // Log the selected date to the console
                                                    }}
                                                />
                                            </div>
                                            <div className="xl:col-span-6 col-span-12">
                                                <label htmlFor="gender" className="form-label text-sm text-defaulttextcolor font-semibold">Gender</label>
                                                <select
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                                    id="gender"
                                                    value={gender} // Bind the selected value to the state
                                                    onChange={(e) => {
                                                        const selectedGender = e.target.value;
                                                        setGender(selectedGender); // Update the state with the selected gender
                                                        console.log("Selected Gender:", selectedGender); // Log the selected gender to the console
                                                    }}
                                                >
                                                    <option value="">Select Gender</option> {/* Default option */}
                                                    {genders.map((g, index) => (
                                                        <option key={index} value={g.name}>{g.name}</option>
                                                    ))}
                                                </select>

                                            </div>
                                            <div className="xl:col-span-6 col-span-12">
                                                <label htmlFor="location" className="form-label text-sm text-defaulttextcolor font-semibold">Location</label>
                                                <input type="text" className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm" id="location" placeholder="Location"
                                                    value={location} // Set the value from the state
                                                    onChange={(e) => setLocation(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className='border-t border-defaultborder p-4 flex justify-end'>
                                            <button
                                                className="ti-btn ti-btn-primary bg-primary me-3"
                                                onClick={update_user_details} // Call the update_user_details function on button click
                                            >
                                                Update
                                            </button>
                                            <button
                                                type="button"
                                                className="ti-btn-success bg-defaulttextcolor ti-btn text-white ti-btn  text-defaulttextcolor"
                                                onClick={resetForm}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Success Alert */}
            {showSuccessAlert && <SuccessAlert message="Profile Update successfully!" />}
        </>
    );
};

export default CarpenterProfile;
