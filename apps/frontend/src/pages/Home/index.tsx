import { useState } from "react";
import Header from "../../component/header";
import Events from "../../component/events";
import MySpace from "../../component/mySpace";
import { ToastContainer } from "react-toastify";

function Home() {
    const [tab, setTab] = useState('space')
    const [key, setKey] = useState(0);
    const reloadComponent = () => {
        setKey((prev) => prev + 1)
    }
    return (
        <>
            <ToastContainer />
            <Header tab={tab} setTab={setTab} parentReload={reloadComponent} />
            {
                tab == "event" ? <Events /> : null
            }
            {
                tab == "space" ? <MySpace key={key} /> : null
            }
        </>
    )
}

export default Home