import { useState } from "react";
import Header from "../../component/header";
import Events from "../../component/events";
import MySpace from "../../component/mySpace";
import { ToastContainer } from "react-toastify";

function Home() {
    const [tab, setTab] = useState('space')
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
        </>
    )
}

export default Home