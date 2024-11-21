import { useEffect, useState } from "react";
import Header from "../../component/header";
import Events from "../../component/events";
import MySpace from "../../component/mySpace";
import WaitingPage from "../../component/waiting";
import { ToastContainer } from "react-toastify";
// import { CreateElementDataSchema, CreateElementFunctionSchema } from "../../types";

function Home() {
    const [tab, setTab] = useState('event')
    const [user, setUser] = useState();
    const [_, setErr] = useState('')
    const getUserInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const HTTP_SERVER_URL = import.meta.env.VITE_HTTP_SERVER_URL;
            const url = `${HTTP_SERVER_URL}/user/user-info`
            const resp = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const respJson = await resp.json()
            console.log(user)
            setUser(respJson)
        } catch (err) {
            console.log(err);
            setErr('unable to fetch user info')
        }
    }


    useEffect(() => {
        getUserInfo()
    }, [])
    return (
        <>
            <ToastContainer />
            <Header tab={tab} setTab={setTab} />
            {
                tab == "event" ? <Events /> : null
            }
            {
                tab == "space" ? <MySpace /> : null
            }
            <WaitingPage/>
        </>
    )
}

export default Home