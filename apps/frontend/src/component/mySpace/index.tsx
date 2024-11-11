import React, { useState } from "react"
import NothingFound from "../nothingFound"

const MySpace: React.FC = () => {

    const [data, _] = useState(false)
    return (
        <>
            {
                !data &&
                <div className="w-full h-[85vh] flex items-center justify-center">
                    <NothingFound message="You haven't visited any spaces. Create a Space to get started!" />
                </div>
            }
        </>
    )


}

export default MySpace