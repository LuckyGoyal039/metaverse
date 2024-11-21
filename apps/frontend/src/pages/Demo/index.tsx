// import { useEffect, useState } from "react";
// import Header from "../../component/header";
// import Events from "../../component/events";
// import MySpace from "../../component/mySpace";
// import WaitingPage from "../../component/waiting";

function Demo() {
    // const [tab, setTab] = useState('event')
    // const [user, setUser] = useState();
    // const [_, setErr] = useState('')
    // const getUserInfo = async () => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         const HTTP_SERVER_URL = import.meta.env.VITE_HTTP_SERVER_URL;
    //         const url = `${HTTP_SERVER_URL}/user/user-info`
    //         const resp = await fetch(url, {
    //             method: "GET",
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         })
    //         const respJson = await resp.json()
    //         setUser(respJson)
    //     } catch (err) {
    //         console.log(err);
    //         setErr('unable to fetch user info')
    //     }
    // }

    // useEffect(() => {
    //     getUserInfo()
    // }, [])
    return (
        <>
            <h1>demo page</h1>
            {/* <Header tab={tab} setTab={setTab} /> */}
            {
                // tab == "event" ? <Events /> : null
            }
            {
                // tab == "space" ? <MySpace /> : null
            }
            {/* <WaitingPage/> */}
        </>
    )
}

export default Demo