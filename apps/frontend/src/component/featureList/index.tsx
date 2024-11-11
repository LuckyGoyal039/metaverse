import React from 'react';

const featuresLeft = [
    { icon: 'https://cdn.prod.website-files.com/63c885e8fb810536398b658a/64093308f0c86285bb8728cf_Desktop.svg', text: 'Share multiple screens at the same time' },
    { icon: 'https://cdn.prod.website-files.com/63c885e8fb810536398b658a/64093349a5623b1f14c9a0b0_slack.png', text: 'Slack integration' },
    { icon: 'https://cdn.prod.website-files.com/63c885e8fb810536398b658a/64b6f4b7c767e83e6428f973_shield-check%201.svg', text: 'SSO' },
    { icon: 'https://cdn.prod.website-files.com/63c885e8fb810536398b658a/6409337698a4d3bcb6a9b156_Blurbg.svg', text: 'Virtual backgrounds and background blur' },
    { icon: 'https://cdn.prod.website-files.com/63c885e8fb810536398b658a/64093356bd5d36786c5d8c4f_Crown.svg', text: 'Premium support (Premium Office plans only)' },
];

const featuresRight = [
    { icon: 'https://cdn.prod.website-files.com/63c885e8fb810536398b658a/6409338426e7bf3949c96183_google.png', text: 'Google Integration' },
    { icon: 'https://cdn.prod.website-files.com/63c885e8fb810536398b658a/64b6f4a7710bba968490792c_icons8-microsoft-outlook-2019-144%201.png', text: 'Outlook integration' },
    { icon: 'https://cdn.prod.website-files.com/63c885e8fb810536398b658a/6409339226e7bf2e33c96328_Calendar.svg', text: 'See when meetings happen in your office' },
    { icon: 'https://cdn.prod.website-files.com/63c885e8fb810536398b658a/640933a08c781e0e38dd412e_Comments.svg', text: 'Collaborate on shared whiteboards' },
    { icon: 'https://cdn.prod.website-files.com/63c885e8fb810536398b658a/640933adf54b45c768e8befc_Favorite-filled.svg', text: 'And more!' },
];

const FeaturesList: React.FC = () => {
    return (
        <div className="bg-[#3a3d84] rounded-xl p-6 text-white w-[700px]">
            <div className="flex flex-col md:flex-row justify-between">
                <div className="space-y-10 md:w-1/2">
                    {featuresLeft.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-4 space-y-5 align-middle">
                            <div className='bg-white p-3 rounded-full'>
                                <img src={feature.icon} alt="" className="w-6 h-6" />
                            </div>
                            <p className="text-base font-semibold w-52 !mt-0">{feature.text}</p>
                        </div>
                    ))}
                </div>


                <div className="space-y-10 md:w-1/2 mt-8 md:mt-0">
                    {featuresRight.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-4 space-y-5 align-middle">
                            <div className='bg-white p-3 rounded-full'>
                                <img src={feature.icon} alt="" className="w-6 h-6" />
                            </div>
                            <p className="text-base font-semibold w-52 !mt-0">{feature.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesList;
