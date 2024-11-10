import { useState } from "react";
import Header from "../../component/header";
import Events from "../../component/events";
import MySpace from "../../component/mySpace";

function Home() {
    const [tab, setTab] = useState('event')
    return (
        <>
            <Header tab={tab} setTab={setTab} />
            {
                tab == "event" ? <Events /> : null
            }
            {
                tab == "space" ? <MySpace /> : null
            }
            <p>{tab}</p>
        </>
    )
}

export default Home