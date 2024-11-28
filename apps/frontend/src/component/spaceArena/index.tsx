import React, { useRef } from 'react';
import Canvas from '../canvas';

const SpaceArena: React.FC = () => {
    const ROWS = useRef(15);
    const COLS = useRef(25);
    const TILE_SIZE = useRef(32);
    return (
        <>
            <Canvas rows={ROWS.current} cols={COLS.current} tile_size={TILE_SIZE.current} />
        </>
    )
}
export default SpaceArena