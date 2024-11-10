import React from "react"
import nothing from '../../assets/nothing-found-2.png'
interface NothingFoundProps {
    message: string
}
const NothingFound: React.FC<NothingFoundProps> = (props) => {
    return (

        <div className="flex justify-center items-center flex-col text-white">
            <div>
                <img src={nothing} alt="empty list" className="w-[55px]" />
            </div>
            <p>{props.message}</p>
        </div>

    )
}

export default NothingFound