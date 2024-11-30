import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { socket } from '../../socket';

import tilesetImg from '../../assets/tilemaps/tileset.png'
import map1Json from '../../assets/tilemaps/map1.json'
import ACgarRight from '../../assets/tilemaps/ACgarRight.png';
// Import other direction sprites
import ACgarLeft from '../../assets/tilemaps/ACharLeft.png';
import ACgarUp from '../../assets/tilemaps/ACharUp.png';
import ACgarDown from '../../assets/tilemaps/ACharDown.png';

interface CanvasProps {
    rows: number;
    cols: number;
    tile_size: number;
}

interface SceneState {
    localPlayer: Phaser.Physics.Arcade.Sprite | null;
    otherPlayers: Record<string, Phaser.Physics.Arcade.Sprite>;
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

            // Create animations
            this.anims.create({
                key: 'walk-right',
                frames: this.anims.generateFrameNumbers('player-right', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });

            this.anims.create({
                key: 'walk-left',
                frames: this.anims.generateFrameNumbers('player-left', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });

            this.anims.create({
                key: 'walk-up',
                frames: this.anims.generateFrameNumbers('player-up', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });

            this.anims.create({
                key: 'walk-down',
                frames: this.anims.generateFrameNumbers('player-down', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });

            const map = this.make.tilemap({ key: 'map1', tileWidth: 32, tileHeight: 32 });
            const tileset = map.addTilesetImage('tile1', 'tile');

            if (tileset) {
                const groundLayer = map.createLayer('ground', tileset, 0, 0);
                const upperLayer = map.createLayer('upper', tileset, 0, 0);

                if (groundLayer) {
                    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
                }

                scene.localPlayer = this.physics.add.sprite(50, 50, 'player-right', 0);
                scene.localPlayer.setCollideWorldBounds(true);

                if (upperLayer) {
                    upperLayer.setCollisionByProperty({ collides: true });
                    // const debugGraphics = this.add.graphics().setAlpha(0.75);

                    this.physics.add.collider(scene.localPlayer, upperLayer, () => {
                        console.log('Collision occurred!');
                    });
                }
            }

            if (this.input.keyboard?.createCursorKeys)
                scene.cursors = this.input.keyboard.createCursorKeys();

            Object.values(scene.otherPlayers).forEach(player => player.destroy());
            scene.otherPlayers = {};

            socket.on('newPlayer', (players: Record<string, { x: number; y: number }>) => {
                Object.entries(players).forEach(([id, { x, y }]) => {
                    if (id === socket.id) {
                        scene.localPlayer?.setPosition(x, y);
                    } else if (!scene.otherPlayers[id]) {
                        scene.otherPlayers[id] = this.physics.add.sprite(x, y, 'player-right', 0);
                    } else {
                        scene.otherPlayers[id].setPosition(x, y);
                    }
                });
            });
            socket.on('playerMoved', (playerInfo: { id: string; x: number; y: number; dx: number; dy: number }) => {
                const otherPlayer = scene.otherPlayers[playerInfo.id];
                if (otherPlayer) {
                    otherPlayer.setPosition(playerInfo.x, playerInfo.y);

                    // Determine and play animation based on movement
                    if (playerInfo.dx < 0) {
                        otherPlayer.anims.play('walk-left', true);
                    } else if (playerInfo.dx > 0) {
                        otherPlayer.anims.play('walk-right', true);
                    } else if (playerInfo.dy < 0) {
                        otherPlayer.anims.play('walk-up', true);
                    } else if (playerInfo.dy > 0) {
                        otherPlayer.anims.play('walk-down', true);
                    } else {
                        otherPlayer.anims.stop();
                        otherPlayer.setFrame(0);
                    }
                }
            });

            socket.on('collision', ({ x, y }: { x: number; y: number }) => {
                scene.localPlayer?.setPosition(x, y);
            });
        };

        const update = function (this: Phaser.Scene) {
            const scene = sceneRef.current;
            if (!scene.localPlayer || !scene.cursors) return;

            const movement = { dx: 0, dy: 0 };
            const speed = 2;
            (scene.localPlayer.body as Phaser.Physics.Arcade.Body).setVelocity(0);

            if (scene.cursors.left.isDown) {
                movement.dx = -speed;
                scene.localPlayer.anims.play('walk-left', true);
            } else if (scene.cursors.right.isDown) {
                movement.dx = speed;
                scene.localPlayer.anims.play('walk-right', true);
            } else if (scene.cursors.up.isDown) {
                movement.dy = -speed;
                scene.localPlayer.anims.play('walk-up', true);
            } else if (scene.cursors.down.isDown) {
                movement.dy = speed;
                scene.localPlayer.anims.play('walk-down', true);
            } else {
                scene.localPlayer.anims.stop();
                // Set the idle frame (first frame) of the current direction
                scene.localPlayer.setFrame(0);
            }

            if (movement.dx || movement.dy) {
                socket.emit('movePlayer', {
                    ...movement,
                    x: scene.localPlayer.x,
                    y: scene.localPlayer.y
                });
            }
        };

        const preload = function (this: Phaser.Scene) {
            this.load.image('tile', tilesetImg);
            this.load.tilemapTiledJSON('map1', map1Json);

            // Load all direction spritesheets
            this.load.spritesheet('player-right', ACgarRight, {
                frameWidth: 24,
                frameHeight: 24,
            });
            this.load.spritesheet('player-left', ACgarLeft, {
                frameWidth: 24,
                frameHeight: 24,
            });
            this.load.spritesheet('player-up', ACgarUp, {
                frameWidth: 24,
                frameHeight: 24,
            });
            this.load.spritesheet('player-down', ACgarDown, {
                frameWidth: 24,
                frameHeight: 24,
            });
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