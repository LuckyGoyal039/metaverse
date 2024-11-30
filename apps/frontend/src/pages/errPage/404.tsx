import React from "react";
import { useNavigate } from "react-router-dom";

import image404 from '../../assets/images/404-computer.svg'
const NotFound: React.FC = () => {
    const navigate = useNavigate()
    const handleBackToHome = () => {
        navigate('/')
    }

    return (
        <section>
            <div className="py-4 px-4 mx-auto max-w-screen-xl lg:py-4 lg:px-6">
                <div className="mx-auto max-w-screen-sm flex flex-col justify-center text-center">
                    <div className="flex justify-center">
                        <img src={image404} className="w-96" />
                    </div>
                    <h1 className="mb-4 text-5xl tracking-tight font-extrabold lg:text-7xl text-[#3b82f6]">
                        404
                    </h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                        Something's missing.
                    </p>
                    <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                        Sorry, we can't find that page. You'll find lots to explore on the home page.
                    </p>
                    <button onClick={handleBackToHome}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                        Back to Homepage
                    </button>
                </div>
            </div>
        </section>
    );
};

export default NotFound;
