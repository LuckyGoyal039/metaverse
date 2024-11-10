import React, { useState } from "react"
import NothingFound from "../nothingFound"

const Events: React.FC = () => {
    const [data, _] = useState(false)
    return (
        <>
            <h1>Events</h1>
            {
                !data &&
                <div className="w-full h-[85vh] flex items-center justify-center">
                    <NothingFound message="You haven't created any events." />
                </div>
            }
        </>
    )
}

export default Events