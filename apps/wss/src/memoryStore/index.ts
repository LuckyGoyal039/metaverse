interface Player {
    x: number;
    y: number;
    avatarImage: string;
    name: string;
    dx?: number;
    dy?: number;
    room: string
}

class PlayerManager {
    private players: Map<string, Player> = new Map();

    addPlayer(id: string, player: Player): void {
        this.players.set(id, player);
    }

    getPlayer(id: string): Player | undefined {
        return this.players.get(id);
    }

    removePlayer(id: string): void {
        this.players.delete(id);
    }

    getAllPlayers(): Map<string, Player> {
        return this.players;
    }

    updatePlayer(id: string, updates: Partial<Player>): boolean {
        const player = this.players.get(id);
        if (!player) {
            console.warn(`Player with id "${id}" does not exist.`);
            return false;
        }

        this.players.set(id, { ...player, ...updates });
        return true;
    }
    getPlayersInRoom(room: string, io: any): Map<string, Player> {
        const playersInRoom = new Map<string, Player>();

        for (const [id, player] of this.players.entries()) {
            const socket = io.sockets.sockets.get(id);
            if (socket && socket.rooms.has(room)) {
                playersInRoom.set(id, player);
            }
        }
        return playersInRoom;
    }
}

const playerManager = new PlayerManager();
export default playerManager;
