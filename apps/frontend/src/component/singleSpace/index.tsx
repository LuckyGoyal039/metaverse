import React, { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from 'react-toastify';

interface SingleSpaceProps {
    backgroundImg: string;
    spaceName: string;
    createDate: string;
    copyUrl: string

}
const SingleSpace: React.FC<SingleSpaceProps> = ({ backgroundImg, spaceName, createDate, copyUrl }) => {
    const [isHovered, setIsHovered] = useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(copyUrl);
            toast.success("Link Copied to clipboard!", {
                position: 'bottom-right'
            })
        } catch (err) {
            toast.error("Failed to copy text", {
                position: 'bottom-right'
            })
            console.error('Failed to copy Link:', err);
        }
    };
    const handleJoinRoom = () => {
        try {
            toast.success("Join Space Functionality is unavailable", {
                position: "top-center"
            })
        } catch (err) {
            toast.error("unable to join room", {
                position: "top-center"
            })
        }
    }

    const formatDate = (unFormateDate: string) => {
        const date = new Date(unFormateDate);
        const options: Intl.DateTimeFormatOptions = { month: 'short' };
        const month = new Intl.DateTimeFormat('en-US', options).format(date);
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();

        return `${month}, ${day} ${year}`;

        return `${day}-${month}-${year}`;
    };
    return (
        <div className='flex flex-col gap-2'>
            <div
                className='w-80 h-48 rounded-xl flex items-center justify-center text-white hover:scale-105'
                style={{ backgroundImage: `url(${backgroundImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {
                    isHovered &&
                    <div className='rounded-full bg-[#151e10] p-3'>
                        <LogoutIcon className='!text-3xl' onClick={handleJoinRoom} />
                    </div>
                }
            </div>
            <div className='flex justify-between px-1 text-white'>
                <div>
                    <p>{spaceName}</p>
                </div>
                <div className='flex gap-3'>
                    <p>{formatDate(createDate)}</p>
                    <ContentCopyIcon onClick={handleCopy} className='cursor-pointer text-gray-500' />
                </div>
            </div>
        </div>
    )
}

export default SingleSpace