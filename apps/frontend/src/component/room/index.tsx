import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SpaceArena from "../../component/spaceArena";
import WaitingPage from "../../component/waiting";
// import { toast } from 'react-toastify';

const Room: React.FC = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const username = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data] = useState<any>(null);
    const [usernameEntered, setUsernameEntered] = useState<boolean>(false);

    // const fetchData = async (name: string) => {
    //     setIsLoading(true);
    //     try {
    //         const response = await fetch(`/api/getData?username=${name}`);
    //         const result = await response.json();
    //         setData(result);
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const checkLogin = async () => {
        setIsLoading(true);
        try {
            const HTTP_SERVER = import.meta.env.VITE_HTTP_SERVER_URL
            const url = `${HTTP_SERVER}/is-login`
            const token = localStorage.getItem("token")
            await fetch(url, {
                method: "GET",
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
        } catch (error) {
            navigate('/signin', { state: { success: false, message: "Please login to join the space" } });
        } finally {
            setIsLoading(false);
        }
    }
    // const checkSpaceExist = async () => {
    //     try {
    //         const HTTP_SERVER = import.meta.env.VITE_HTTP_SERVER_URL
    //         const url = `${HTTP_SERVER}/checkSpace`
    //         const token = localStorage.getItem("token")
    //         const data = {
    //             spaceId: searchParams.get('id')
    //         }
    //         const res = await fetch(url, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(data),
    //         });

    //     } catch (err) {
    //         console.log("spaceid validation failed: ", err)
    //     }
    // }

    const handleNext = () => {
        if (typeof username.current?.value === 'string' && username.current?.value) {
            // fetchData(username.current.value);
            setUsernameEntered(true);
        } else {
            alert("Please enter a valid name.");
        }
    };

    useEffect(() => {
        if (data) {
            setIsLoading(false);
        }
    }, [data]);
    useEffect(() => {
        checkLogin()
        // checkSpaceExist()
    }, []);
    return (
        <>
            {isLoading ? (
                <WaitingPage />
            ) : !usernameEntered ? (
                <form onSubmit={handleNext}>

                    <div
                        id="username-modal"
                        className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
                    >
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Enter Your Name
                            </h3>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                defaultValue={username.current?.value || ""}
                                ref={username}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="mt-4 w-full bg-blue-700 text-white p-2.5 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="w-full h-[90vh]">
                    {data ? (
                        <SpaceArena playerName={username.current?.value ?? null} room={searchParams.get('id') ?? ""} />
                    ) : (
                        <SpaceArena playerName={username.current?.value ?? null} room={searchParams.get('id') ?? ""} />
                        // <div>No data found</div>
                    )}
                </div>
            )}
        </>
    );
}

export default Room