import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import React, { Fragment, useState, useEffect } from "react";
import axios from 'axios';
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import { set } from 'react-hook-form';

const NewLaunchDashboard: React.FC = () => {
    const [nameLaunch, setNameLaunch] = useState<string>('');
    const [urlName, setUrlName] = useState<string>('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    useEffect(() => {
        document.title = 'Newly Launch';

        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                window.location.reload();
            }, 3000);
            return () => clearTimeout(timer);
        }

        const fetchAPI = async () => {
            try {
                const response = await axios.get(`/api/method/reward_management_app.api.new_launch.get_new_launch`);

                if (response.data.message) {
                    console.log("Fetched Data:", response.data.message);
                    setNameLaunch(response.data.message.launch_name);
                    setUrlName(response.data.message.url);
                }
            } catch (error) {
                console.error("Error fetching API data:", error);
            }
        };

        fetchAPI();
    }, [showSuccessAlert]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const data = {
            launch_name: nameLaunch,
            url: urlName,
        };

        try {
            const response = await fetch('/api/resource/Newly Launch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to create New Launch');
            }

            setShowSuccessAlert(true);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to create New Launch.');
        }
    };

    return (
        <Fragment>
            <Pageheader 
                currentpage={"New Launch"} 
                activepage={"/new-launch"} 
                activepagename="New Launch"
            />
            <div className="grid grid-cols-12 gap-x-6 p-6">
                <div className="col-span-12 flex justify-center items-center">
                    <div className="xl:col-span-3 col-span-12 bg-white mt-5 rounded-lg shadow-lg p-6 w-[500px]">
                        <div className="">
                            <div className="box-header">
                                <div className="box-title text-center text-[var(--primaries)] text-sm font-semibold">
                                    Add New Launch
                                </div>
                            </div>
                            <div className="box-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="xl:col-span-12 col-span-12">
                                            <input
                                                type="text"
                                                className="form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium"
                                                id="setNameLaunch"
                                                placeholder="Launch Name"
                                                value={nameLaunch}
                                                onChange={(e) => setNameLaunch(e.target.value)}
                                            />
                                        </div>
                                        <div className="xl:col-span-12 col-span-12">
                                            <input
                                                type="text"
                                                className="form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium"
                                                id="setUrlName"
                                                placeholder="Enter URL"
                                                value={urlName}
                                                onChange={(e) => setUrlName(e.target.value)}
                                            />
                                        </div>
                                        <div className="xl:col-span-12 col-span-12 text-center">
                                            <button
                                                id='submit'
                                                type="submit"
                                                className="ti-btn new-launch border-none  text-white w-full"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showSuccessAlert && (
                <SuccessAlert
                    showButton={false}
                    showCancleButton={false}
                    showCollectButton={false}
                    showAnotherButton={false}
                    showMessagesecond={false}
                    message="New Launch created successfully!"
                    onClose={() => setShowSuccessAlert(false)}
                    onCancel={() => setShowSuccessAlert(false)}
                />
            )}
        </Fragment>
    );
};

export default NewLaunchDashboard;
