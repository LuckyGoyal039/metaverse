import React from "react";
import { useNavigate } from "react-router-dom";
import image500 from '../../assets/images/500.svg'

const ServerError: React.FC = () => {
    const navigate = useNavigate()
    const handleBackToHome = () => {
        navigate('/')
    }

    return (
        <section>
            <div className="py-4 px-4 mx-auto max-w-screen-xl lg:py-4 lg:px-6">
                <div className="mx-auto max-w-screen-sm flex flex-col justify-center text-center">
                    <div className="flex justify-center">
                        <img src={image500} className="w-96" />
                    </div>
                    <h1 className="mb-4 text-3xl tracking-tight font-extrabold lg:text-3xl text-[#3b82f6]">
                        500 Internal Error
                    </h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                        Whoops! That page doesn’t exist.
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

export default ServerError;
