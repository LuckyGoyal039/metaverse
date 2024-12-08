import React, { useRef, useEffect, useState } from 'react';
import Canvas from '../canvas';
import Chat from '../chat';
import { socket } from '../../socket';
import mainLogo from '../../assets/main_logo.png'
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatIcon from '@mui/icons-material/Chat';

interface SpaceArenaProps {
    playerName: string | null
    room?: string
}

const SpaceArena: React.FC<SpaceArenaProps> = ({ playerName, room = "demo-room" }) => {
    const ROWS = useRef(20);
    const COLS = useRef(35);
    const TILE_SIZE = useRef(32);
    const flag = useRef(false);
    const [mic, setMic] = useState(true)
    const [camera, setCamera] = useState(false)
    const toggleMic = () => {

        setMic((prev) => !prev)
    }
    const toggleCamera = () => {

        setCamera((prev) => !prev)
    }
    useEffect(() => {
        if (flag.current) {
            return
        }
        socket.connect();
        socket.on('connect', () => {
            console.log("socket connected successfully")
        })
        return () => {
            socket.disconnect()
        }
    }, [])


    return (
        <>
            <div className='w-full flex flex-col max-h-[100vh] overflow-hidden'>
                <div className='h-[4vh]'>
                    <h1 className='text-white text-xl text-center'>{room}</h1>
                </div>
                <div className='flex gap-1 h-[90vh] overflow-hidden px-1'>
                    <div className='flex justify-center w-[calc(100vw-25vw)] bg-black'>
                        <div className=''>
                            <Canvas
                                rows={ROWS.current}
                                cols={COLS.current}
                                tile_size={TILE_SIZE.current}
                                playerName={playerName}
                                room={room}
                            />
                        </div>
                    </div>
                    <div className='w-[25vw]'>
                        <Chat playerName={playerName} room={room} />
                    </div>
                </div>
                <div className='h-[6vh] text-white flex justify-between items-center px-2'>
                    <img src={mainLogo} alt="metaverse" className='w-10 h-10' />
                    {
                        mic ? <MicIcon onClick={toggleMic} /> : <MicOffIcon onClick={toggleMic} />
                    }
                    {
                        camera ? <VideocamIcon onClick={toggleCamera} /> : <VideocamOffIcon onClick={toggleCamera} />
                    }
                    <ChatIcon />
                    <LogoutIcon />
                </div>
            </div>
        </>
    );
};

export default SpaceArena;