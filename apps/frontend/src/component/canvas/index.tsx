import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { socket } from '../../socket';

import tilesetImg from '../../assets/tilemaps/tileset.png'
import map1Json from '../../assets/tilemaps/map1.json'


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

            // Create the tilemap
            const map = this.make.tilemap({ key: 'map1', tileWidth: 32, tileHeight: 32 });

            // The second parameter ('tileset') should match the key you used in preload
            // The first parameter should match the name of your tileset in the TSX file
            const tileset = map.addTilesetImage('tile1', 'tile');

            if (tileset) {

                // Create the layer using the exact name from your map
                const groundLayer = map.createLayer('ground', tileset, 0, 0);
                const upperLayer = map.createLayer('upper', tileset, 0, 0);

                if (groundLayer) {
                    // Optional: Set world bounds based on map size
                    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
                }
                scene.localPlayer = this.add.rectangle(50, 50, tile_size, tile_size, 0x0000ff);
                this.physics.add.existing(scene.localPlayer);
                (scene.localPlayer.body as Phaser.Physics.Arcade.Body).setSize(tile_size, tile_size).setOffset(0, 0);

                (scene.localPlayer.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

                if (upperLayer) {

                    console.log("collider added")
                    // upperLayer.setCollisionByExclusion([-1]);
                    upperLayer.setCollisionByProperty({ collides: true });
                    const debugGraphics = this.add.graphics().setAlpha(0.75);
                    upperLayer.renderDebug(debugGraphics, {
                        tileColor: null,
                        collidingTileColor: new Phaser.Display.Color(255, 0, 0, 255),
                        faceColor: new Phaser.Display.Color(0, 255, 0, 255)
                    });
                    this.physics.add.collider(scene.localPlayer, upperLayer, () => {
                        console.log('Collision occurred!');
                    });

                    this.physics.add.overlap(scene.localPlayer, upperLayer, () => {
                        console.log('Overlap detected!');
                    });
                }
                this.physics.world.drawDebug = true;
                this.physics.world.debugGraphic.setAlpha(0.75);

                console.log('Player Body:', scene.localPlayer.body);
            }

            // Player and socket logic
            // scene.localPlayer = this.add.rectangle(0, 0, tile_size, tile_size, 0x0000ff);
            // this.physics.add.existing(scene.localPlayer);

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
        const preload = function (this: Phaser.Scene) {
            // Make sure this path points to your actual tileset image file
            // debugger
            this.load.image('tile', tilesetImg);
            this.load.tilemapTiledJSON('map1', map1Json);
        }
        socket.connect();
        gameRef.current = new Phaser.Game({
            type: Phaser.AUTO,
            width: cols * tile_size,
            height: rows * tile_size,
            parent: 'phaser-container',
            physics: { default: 'arcade', arcade: { debug: true } },
            scene: { create, update, preload }
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