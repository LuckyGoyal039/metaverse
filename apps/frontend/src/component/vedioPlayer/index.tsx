import React from 'react';

interface VideoPlayerProps {
    src: string
}
const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
    return (
        <video className='rounded-3xl w-[650px]' autoPlay loop muted>
            <source src={props.src} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
};

export default VideoPlayer;
