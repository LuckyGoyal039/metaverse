import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { socket } from '../../socket';
import tilesetImg from '../../assets/tilemaps/tileset.png';
import map1Json from '../../assets/tilemaps/map1.json'
import ACgarRight from '../../assets/tilemaps/ACgarRight.png';
import ACgarLeft from '../../assets/tilemaps/ACharLeft.png';
import ACgarUp from '../../assets/tilemaps/ACharUp.png';
import ACgarDown from '../../assets/tilemaps/ACharDown.png';

interface CanvasProps {
    rows: number;
    cols: number;
    tile_size: number;
    playerName: string | null;
    room: string;
}

interface SceneState {
    localPlayer: Phaser.Physics.Arcade.Sprite | null;
    localPlayerText: Phaser.GameObjects.Text | null;
    otherPlayers: Record<string, {
        sprite: Phaser.Physics.Arcade.Sprite;
        nameText: Phaser.GameObjects.Text;
    }>;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null;
    camera: Phaser.Cameras.Scene2D.Camera | null;
}

const Canvas: React.FC<CanvasProps> = ({ rows, cols, tile_size, playerName, room }) => {
    const gameRef = useRef<Phaser.Game | null>(null);
    const sceneRef = useRef<SceneState>({
        localPlayer: null,
        localPlayerText: null,
        otherPlayers: {},
        cursors: null,
        camera: null
    });

    useEffect(() => {
        const create = function (this: Phaser.Scene) {
            socket.removeAllListeners();
            const scene = sceneRef.current;
            socket.emit('joinRoom', { room, name: playerName });

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

                if (groundLayer && upperLayer) {
                    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

                    // Create local player and their name text
                    scene.localPlayer = this.physics.add.sprite(50, 50, 'player-right', 0);
                    scene.localPlayer.setCollideWorldBounds(true);

                    scene.localPlayerText = this.add.text(50, 35, 'You', {
                        fontSize: '12px',
                        color: '#ffffff',
                        backgroundColor: '#0000FF',
                        padding: { x: 4, y: 2 },
                    });
                    scene.localPlayerText.setOrigin(0.5, 0.5);

                    if (scene.localPlayer.body) {
                        scene.localPlayer.body.setSize(20, 20);
                    }

                    upperLayer.setCollisionByProperty({ collides: true });
                    this.physics.add.collider(scene.localPlayer, upperLayer);
                }
            }

            // Setup keyboard controls
            if (this.input.keyboard?.createCursorKeys) {
                scene.cursors = this.input.keyboard.createCursorKeys();
            }

            // Clean up existing players
            Object.values(scene.otherPlayers).forEach(({ sprite, nameText }) => {
                sprite.destroy();
                nameText.destroy();
            });
            scene.otherPlayers = {};

            // Setup camera
            scene.camera = this.cameras.main;
            if (scene.localPlayer) {
                scene.camera.startFollow(scene.localPlayer, true, 0.1, 0.1);
                scene.camera.setZoom(1.3);
            }

            socket.on('playerJoined', (players: Record<string, { x: number; y: number; name: string }>) => {
                Object.entries(players).forEach(([id, { x, y, name }]) => {
                    if (id === socket.id) {
                        scene.localPlayer?.setPosition(x, y);
                        scene.localPlayerText?.setPosition(x, y - 15);
                    } else if (!scene.otherPlayers[id]) {
                        const sprite = this.physics.add.sprite(x, y, 'player-right', 0);
                        let playerName = name.trim().toLowerCase();
                        if (playerName.length > 12) {
                            playerName = playerName.slice(0, 12);
                            playerName = playerName + '...'
                        }
                        const nameArr = playerName.split('')
                        nameArr[0] = nameArr[0].toUpperCase();
                        playerName = nameArr.join('');
                        const nameText = this.add.text(x, y - 15, playerName, {
                            fontSize: '12px',
                            color: '#ffffff',
                            backgroundColor: '#ff0000',
                            padding: { x: 4, y: 2 },
                        });
                        nameText.setOrigin(0.5, 0.5);
                        scene.otherPlayers[id] = { sprite, nameText };
                    }
                });
            });

            socket.on('playerMoved', (playerInfo: { id: string; x: number; y: number; dx: number; dy: number }) => {
                const otherPlayer = scene.otherPlayers[playerInfo.id];
                if (otherPlayer) {
                    otherPlayer.sprite.setPosition(playerInfo.x, playerInfo.y);
                    otherPlayer.nameText.setPosition(playerInfo.x, playerInfo.y - 15);

                    if (playerInfo.dx < 0) {
                        otherPlayer.sprite.anims.play('walk-left', true);
                    } else if (playerInfo.dx > 0) {
                        otherPlayer.sprite.anims.play('walk-right', true);
                    } else if (playerInfo.dy < 0) {
                        otherPlayer.sprite.anims.play('walk-up', true);
                    } else if (playerInfo.dy > 0) {
                        otherPlayer.sprite.anims.play('walk-down', true);
                    } else {
                        otherPlayer.sprite.anims.stop();
                        otherPlayer.sprite.setFrame(0);
                    }
                }
            });

            socket.on('playerLeft', (playerId: string) => {
                if (scene.otherPlayers[playerId]) {
                    scene.otherPlayers[playerId].sprite.destroy();
                    scene.otherPlayers[playerId].nameText.destroy();
                    delete scene.otherPlayers[playerId];
                }
            });

            socket.on('collision', ({ x, y }: { x: number; y: number }) => {
                scene.localPlayer?.setPosition(x, y);
                scene.localPlayerText?.setPosition(x, y - 15);
            });
        };

        const update = function (this: Phaser.Scene) {
            const scene = sceneRef.current;
            if (!scene.localPlayer || !scene.cursors) return;

            const movement = { dx: 0, dy: 0 };
            const speed = 100;
            let velocityX = 0;
            let velocityY = 0;

            if (scene.cursors.left.isDown) {
                velocityX = -speed;
                movement.dx = -1;
                scene.localPlayer.anims.play('walk-left', true);
            } else if (scene.cursors.right.isDown) {
                velocityX = speed;
                movement.dx = 1;
                scene.localPlayer.anims.play('walk-right', true);
            }

            if (scene.cursors.up.isDown) {
                velocityY = -speed;
                movement.dy = -1;
                scene.localPlayer.anims.play('walk-up', true);
            } else if (scene.cursors.down.isDown) {
                velocityY = speed;
                movement.dy = 1;
                scene.localPlayer.anims.play('walk-down', true);
            }

            // Set velocity and update name position
            (scene.localPlayer.body as Phaser.Physics.Arcade.Body).setVelocity(velocityX, velocityY);
            if (scene.localPlayerText) {
                scene.localPlayerText.setPosition(scene.localPlayer.x, scene.localPlayer.y - 15);
            }

            // diagonal movement
            if (velocityX !== 0 && velocityY !== 0) {
                velocityX *= Math.SQRT1_2;
                velocityY *= Math.SQRT1_2;
                (scene.localPlayer.body as Phaser.Physics.Arcade.Body).setVelocity(velocityX, velocityY);
            }

            // Stop animations if not moving
            if (velocityX === 0 && velocityY === 0) {
                scene.localPlayer.anims.stop();
                scene.localPlayer.setFrame(0);
            }

            if (movement.dx || movement.dy) {
                socket.emit('movePlayer', {
                    ...movement,
                    x: scene.localPlayer.x,
                    y: scene.localPlayer.y,
                    room,
                });
            }
        };

        const preload = function (this: Phaser.Scene) {
            this.load.image('tile', tilesetImg);
            this.load.tilemapTiledJSON('map1', map1Json);

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
        };

        gameRef.current = new Phaser.Game({
            type: Phaser.AUTO,
            width: cols * tile_size,
            height: rows * tile_size,
            parent: 'phaser-container',
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                }
            },
            scene: { create, update, preload }
        });

        return () => {
            socket.removeAllListeners();
            gameRef.current?.destroy(true);
        };
    }, [rows, cols, tile_size, playerName, room]);

    return <div id="phaser-container" />;
};

export default Canvas;