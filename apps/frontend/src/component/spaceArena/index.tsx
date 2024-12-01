import React, { useRef } from 'react';
import Canvas from '../canvas';

interface SpaceArenaProps {
    playerName: string | null
}
const SpaceArena: React.FC<SpaceArenaProps> = ({ playerName }) => {
    const ROWS = useRef(15);
    const COLS = useRef(25);
    const TILE_SIZE = useRef(32);
    const room="demo-room"
    return (
        <>
            <Canvas rows={ROWS.current} cols={COLS.current} tile_size={TILE_SIZE.current} playerName={playerName} room={room} />
        </>
    )
}
export default SpaceArena