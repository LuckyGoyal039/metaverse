import React, { useEffect, useState, useMemo } from "react"
import NothingFound from "../nothingFound"
import SingleSpace from "../singleSpace";
import WaitingPage from "../waiting";
import SearchIcon from '@mui/icons-material/Search';

interface mySpaceInterface {
    id: string;
    name: string;
    thumbnail: string;
    dimensions: string;
    createdAt: string
}

const MySpace: React.FC = () => {

    const [mySpaces, setMySpaces] = useState([])
    const [loading, setLoading] = useState(false);
    const [searchTxt, setSearchTxt] = useState('');

    const filterData = useMemo(() => {
        if (!searchTxt.trim()) return mySpaces;
        return mySpaces.filter((space: mySpaceInterface) =>
            space.name.toLowerCase().includes(searchTxt.toLowerCase())
        );
    }, [searchTxt, mySpaces])

    const getSpaces = async () => {
        try {
            setLoading(true)
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
        } finally {
            setLoading(false)
        }

    }
    useEffect(() => {
        getSpaces()
    }, [])
    return (
        <>
            <div className="flex justify-end pr-12 pt-4 text-[#FAF9F6] gap-2">
                <div className="border-white border-2 rounded-md py-1 px-2 w-72">
                    <SearchIcon />
                    <input
                        value={searchTxt}
                        onChange={(e) => setSearchTxt(e.target.value)}
                        className="bg-transparent focus:bg-none focus:outline-none"
                        placeholder="Search..." />
                </div>
            </div>
            {
                !mySpaces.length && !loading &&
                < div className="w-full h-[85vh] flex items-center justify-center">
                    <NothingFound message="You haven't visited any spaces. Create a Space to get started!" />
                </div >
            }
            {
                !filterData.length && mySpaces.length && <h1>No data found</h1>
            }
            {
                loading && <WaitingPage />
            }
            {
                filterData && <div className="w-full pt-2">
                    <ul className="w-full flex gap-12 flex-wrap pl-12">
                        {filterData.map((spaceEle: mySpaceInterface) => (
                            <SingleSpace key={spaceEle.id} backgroundImg={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh5bElz8R6LVIgd6GDEpC29hrva1ql4TCNqA&s'} spaceName={spaceEle.name} createDate={spaceEle.createdAt} spaceId={spaceEle.id} />
                        ))}
                    </ul>
                </div>
            }
        </>
    )


}

export default MySpace