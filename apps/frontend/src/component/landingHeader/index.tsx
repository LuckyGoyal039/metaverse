import React from 'react';
// import avatar60 from '../../assets/avatar_60_dancing.png'
// import WorkspacesIcon from '@mui/icons-material/Workspaces';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
import mainLogo from '../../assets/main_logo.png'
import CustomDropdown from '../customDropdown';


const LandingHeader: React.FC = () => {
    const productList = [
        {
            key: "features",
            value: "Features",
            url: "#"
        },
        {
            key: "integrations",
            value: "Integrations",
            url: "#"
        },
        {
            key: "privacy",
            value: "Privacy & Security",
            url: "#"
        },
        {
            key: "download",
            value: "Download",
            url: "#"
        },
        {
            key: "what_new",
            value: "What's New",
            url: "#"
        },
    ]
    const resourceList = [{
        key: "gather_academy",
        value: "Gather Academy",
        url: "#"
    }, {
        key: "custom_stories",
        value: "Custom Stories",
        url: "#"
    }, {
        key: "blog",
        value: "Blog",
        url: "#"
    }, {
        key: "office_tour",
        value: "Office Tour",
        url: "#"
    }, {
        key: "help",
        value: "Help Center",
        url: "#"
    },]
    return (
        <header>
            <nav className="bg-[#333a64] py-3">
                <div className="flex flex-wrap justify-around items-center">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-6">
                        <a href="/" className="flex items-center">
                            <img src={mainLogo} alt="metaverse" className='w-14 h-14' />
                        </a>
                    </div>

                    {/* Right Side Items */}
                    <div className="flex items-center space-x-4">
                        <CustomDropdown label='Products' options={productList} />
                        <div className='text-white'>
                            <p>Pricing</p>
                        </div>
                        <CustomDropdown label='Resources' options={resourceList} />
                        <div className='text-white'>
                            <p>Contact Sales</p>
                        </div>

                        <a href="/signin" >
                            <button className='font-semibold text-[#282d4e] bg-[#00a89d] hover:bg-[#76dbc4] px-6 py-2 rounded-lg cursor-pointer'>
                                Get Started
                            </button>
                        </a>
                        <a href="/signin" >
                            <button className='font-semibold text-[#282d4e] bg-[#ebeeff] hover:bg-[#c9cde0] px-6 py-2 rounded-lg cursor-pointer'>
                                Sign In
                            </button>
                        </a>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default LandingHeader;