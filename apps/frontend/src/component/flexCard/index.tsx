import React from 'react'
interface FlexCardProps {
    imgUrl: string,
    headingOne: string,
    headingTwo: string,
    text: string
    reverse?: boolean
}

const FlexCard: React.FC<FlexCardProps> = (props) => {
    return (
        <div className={`flex justify-center gap-24 mt-24 ${props.reverse ? 'flex-row-reverse' : ''}`}>
            <div className='flex flex-col gap-3 text-white'>
                <h2 className='text-xl'>{props.headingOne}</h2>
                <h1 className='text-5xl w-[500px]'>{props.headingTwo}</h1>
                <p className='w-[500px]'>{props.text}</p>
            </div>
            <div>
                <img src={props.imgUrl} alt="meta view" className='w-[500px]'/>
            </div>
        </div>
    )
}

export default FlexCard