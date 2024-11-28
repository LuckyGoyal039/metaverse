import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { socket } from '../../socket';

interface CanvasProps {
    rows: number;
    cols: number;
    tile_size: number;
}

interface SceneState {
    localPlayer: Phaser.GameObjects.Rectangle | null;
    otherPlayers: Record<string, Phaser.GameObjects.Rectangle>;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null;
}

const Canvas: React.FC<CanvasProps> = ({ rows, cols, tile_size }) => {
    const gameRef = useRef<Phaser.Game | null>(null);
    const sceneRef = useRef<SceneState>({
        localPlayer: null,
        otherPlayers: {},
        cursors: null
    });

    useEffect(() => {
        const create = function (this: Phaser.Scene) {
            socket.removeAllListeners();
            const scene = sceneRef.current;

            const graphics = this.add.graphics();
            graphics.lineStyle(1, 0xffffff, 0.5);

            for (let row = 0; row <= rows; row++) {
                graphics.strokeLineShape(new Phaser.Geom.Line(0, row * tile_size, cols * tile_size, row * tile_size));
            }
            for (let col = 0; col <= cols; col++) {
                graphics.strokeLineShape(new Phaser.Geom.Line(col * tile_size, 0, col * tile_size, rows * tile_size));
            }

            scene.localPlayer = this.add.rectangle(0, 0, tile_size, tile_size, 0x0000ff);
            this.physics.add.existing(scene.localPlayer);
            (scene.localPlayer.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
            if (this.input.keyboard?.createCursorKeys)
                scene.cursors = this.input.keyboard.createCursorKeys();

            Object.values(scene.otherPlayers).forEach(player => player.destroy());
            scene.otherPlayers = {};

            socket.on('newPlayer', (players: Record<string, { x: number; y: number }>) => {
                Object.entries(players).forEach(([id, { x, y }]) => {
                    if (id === socket.id) {
                        scene.localPlayer?.setPosition(x, y);
                    } else if (!scene.otherPlayers[id]) {
                        scene.otherPlayers[id] = this.add.rectangle(x, y, tile_size, tile_size, 0xff0000);
                    } else {
                        scene.otherPlayers[id].setPosition(x, y);
                    }
                });
            });

            socket.on('collision', ({ x, y }: { x: number; y: number }) => {
                scene.localPlayer?.setPosition(x, y);
            });
        };

        const update = function (this: Phaser.Scene) {
            const scene = sceneRef.current;
            if (!scene.localPlayer || !scene.cursors) return;

            const movement = { dx: 0, dy: 0 };
            (scene.localPlayer.body as Phaser.Physics.Arcade.Body).setVelocity(0);

            if (scene.cursors.left.isDown) movement.dx = -5;
            else if (scene.cursors.right.isDown) movement.dx = 5;
            if (scene.cursors.up.isDown) movement.dy = -5;
            else if (scene.cursors.down.isDown) movement.dy = 5;

            if (movement.dx || movement.dy) socket.emit('movePlayer', movement);
        };

        socket.connect();
        gameRef.current = new Phaser.Game({
            type: Phaser.AUTO,
            width: cols * tile_size,
            height: rows * tile_size,
            parent: 'phaser-container',
            physics: { default: 'arcade', arcade: { debug: false } },
            scene: { create, update }
        });

        return () => {
            socket.disconnect();
            socket.removeAllListeners();
            gameRef.current?.destroy(true);
        };
    }, [rows, cols, tile_size]);

    return <div id="phaser-container" />;
};

export default Canvas;