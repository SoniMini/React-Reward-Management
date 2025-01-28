import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import React, { Fragment, useState, useEffect } from "react";
import axios from 'axios';
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';

const SetWelcomeBonusPoints: React.FC = () => {
    const [bonusPoints, setBonusPoints] = useState<number | ''>('');
    const [currentBonusPoints, setCurrentBonusPoints] = useState<number | ''>('');

    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    useEffect(() => {
        document.title='Set Welcome Bonus Points';
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                window.location.reload(); 
            }, 3000); 
            return () => clearTimeout(timer);
        }
        // Fetch API function
        const fetchAPI = async () => {
            try {
                const response = await axios.get(`/api/method/reward_management_app.api.welcome_bonus_setup.get_welcome_bonus_points`);

                // Check if the API returns data
                if (response.data.message) {
                    console.log("data", response);
                    const data = response.data.message;
                    setCurrentBonusPoints(data.bonus_points);
                }
            } catch (error) {
                console.log(error);
            }
        }

        // Call the fetch API function
        fetchAPI();
    }, [showSuccessAlert]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        

        const data = {
            bonus_points: bonusPoints,
        };

        try {
            const response = await fetch('/api/resource/Welcome Bonus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Set the success alert and trigger page reload
            setShowSuccessAlert(true);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create Redeemption Points Setup.');
        }
    };

    return (
        <Fragment>
              <Pageheader 
                currentpage={"Set Welcome Bonus Points"} 
                activepage={"/welcome-bonus"} 
                // mainpage={"/set-reward-points"} 
                activepagename="Set Welcome Bonus Points"
                // mainpagename="Set Reward Points "
            />
            {/* <Pageheader currentpage="Set Reward Points" activepage="Set Reward Points" mainpage="Set Reward Points" /> */}
            <div className="grid grid-cols-12 gap-x-6 p-6">
                <div className="col-span-12 flex justify-center items-center">
                    <div className="xl:col-span-3 col-span-12 bg-white mt-5 rounded-lg shadow-lg p-6">
                        <div className="">
                            <div className="box-header">
                                <div className="box-title text-center text-[var(--primaries)] text-sm font-semibold">
                                Set Welcome Bonus Points
                                </div>
                            </div>
                            <div className="box-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="xl:col-span-12 col-span-12">
                                            <div className="text-center text-defaulttextcolor text-defaultsize font-medium">
                                                Bonus Points : {currentBonusPoints}
                                            </div>
                                        </div>
                                        <div className="xl:col-span-12 col-span-12">
                                            <input
                                                type="number"
                                                className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium"
                                                id="setMinPoints"
                                                placeholder="Bonus Points"
                                                value={bonusPoints}
                                                onChange={(e) => setBonusPoints(Number(e.target.value))}
                                            />
                                        </div>
                                      
                                        <div className="xl:col-span-12 col-span-12 text-center">
                                            <button
                                                id='submitpoints'
                                                type="submit"
                                                className="ti-btn new-launch border-none text-white w-full"
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
                    message="Welcome Bonus Points Setup created successfully!" onClose={function (): void {
                        throw new Error('Function not implemented.');
                    } } onCancel={function (): void {
                        throw new Error('Function not implemented.');
                    } }                />
            )}
        </Fragment>
    );
};

export default SetWelcomeBonusPoints;
