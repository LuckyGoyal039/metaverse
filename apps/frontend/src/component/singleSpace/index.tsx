import React, { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface SingleSpaceProps {
    backgroundImg: string;
    spaceName: string;
    createDate: string;
    spaceId: string

}
const SingleSpace: React.FC<SingleSpaceProps> = ({ backgroundImg, spaceName, createDate, spaceId }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const handleCopy = async () => {
        try {
            const baseUrl = window.location.origin
            const link = `${baseUrl}/join-space?id=${spaceId}`
            await navigator.clipboard.writeText(link);
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
            const url = `/join-space?id=${spaceId}`
            navigate(url);
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
    };
    
    return (
        <div className='flex flex-col gap-2'>
            <div
                className='w-80 h-48 rounded-xl flex items-center justify-center text-white hover:scale-105'
                style={{ backgroundImage: `url(${backgroundImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleJoinRoom}
            >
                {
                    isHovered &&
                    <div className='rounded-full bg-[#151e10] p-3'>
                        <LogoutIcon className='!text-3xl' />
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