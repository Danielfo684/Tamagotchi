import { Player } from "../player/entities/Player";
import { ServerService } from "../server/ServerService";
import { Room, RoomConfig } from "./entities/Room";

export class RoomService {
    private rooms: Room[];
    private static instance: RoomService;
    private constructor() {
        this.rooms = [];
    };

    static getInstance(): RoomService {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new RoomService();
        return this.instance;
    }

    private getRoom(): Room {
        const room = this.rooms.find((item) => item.occupied == false);
        if (room == undefined) {
            const genRanHex = (size: Number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
            const currentRoom: Room = {
                name: "room" + genRanHex(128),
                players: [],
                occupied: false,
                game: null
            }
            this.rooms.push(currentRoom);
            return currentRoom;
        }
        
         return room;
    }

    public addPlayer(player: Player): Room {
        const room: Room = this.getRoom();
        room.players.push(player);
        ServerService.getInstance().addPlayerToRoom(player.id, room.name);
        if (room.players.length == RoomConfig.maxRoomPlayers) room.occupied = true;
        return room;
    }

    public removePlayer(playerId: String): void {
        this.rooms.forEach((room) => {
            room.players = room.players.filter((item) => item.id.id !== playerId);
        });

        //  this.rooms.find((room) => {room.players.find(player.id.id)});
        //     if (room) {
        //         room.players = room.players.filter((item) => item !== player);

        //        this.rooms.push(room);
        //     }
        // });
    }
    public getRoomByPlayerId(playerId: String): Room {
        console.log(playerId);
         const room = this.rooms.find((room) => room.players.find((player) => player.id.id === playerId));
         if (!room) {
            throw new Error('Room not found for playerId');
        }
        this.updatePlayer(room, playerId);
         return room;
    }
    public updatePlayer(room: Room, data: any): Room {
        room.players.forEach((player) => {
            if (player.id.id === data.id) {
                player.x = data.x;
                player.y = data.y;
                player.direction = data.direction;
                player.state = data.state;
                player.visibility = data.visibility;
            }
        });
        return room;
    }
}
