import React, { useEffect, useState } from "react"
import NothingFound from "../nothingFound"

interface mySpaceInterface {
    id: string;
    name: string;
    thumbnail: string;
    dimensions: string;
}
const MySpace: React.FC = () => {

    const [mySpaces, setMySpaces] = useState([])
    const getSpaces = async () => {
        try {
            const token = localStorage.getItem('token');
            const HTTP_SERVER_URL = import.meta.env.VITE_HTTP_SERVER_URL;

            const url = `${HTTP_SERVER_URL}/space/all`
            const resp = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const respJson = await resp.json();
            console.log(respJson);
            setMySpaces(respJson)
        } catch (err) {
            console.log(err)
        }

    }
    useEffect(() => {
        getSpaces()
    }, [])
    return (
        <>
            {
                !mySpaces &&
                <div className="w-full h-[85vh] flex items-center justify-center">
                    <NothingFound message="You haven't visited any spaces. Create a Space to get started!" />
                </div>

            }
            {
                mySpaces && <div className="w-full">


                    <ul className="w-full">
                        {mySpaces.map((user: mySpaceInterface) => (
                            <li key={user.id} className="py-3 sm:py-4 w-full">
                                <div className="flex items-center space-x-4  w-full">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="w-16 h-16 rounded-full"
                                            src={'https://www.sandbox.game/cdn-cgi/image/f=auto,origin-auth=share-publicly,onerror=redirect/img/28_Map/LandPreview.png'}
                                            alt={`${user.name} thumbnail`}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                            {user.dimensions}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            }
        </>
    )


}

export default MySpace