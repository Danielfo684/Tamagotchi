import { Socket } from "socket.io";
import { Directions, Player, PlayerStates } from "../player/entities/Player";
import { Room, RoomConfig } from "../room/entities/Room";
import { RoomService } from "../room/RoomService";
import { Game, GameStates, Messages } from "./entities/Game";
import { BoardBuilder } from "./BoardBuilder";
import { ServerService } from "../server/ServerService"
export class GameService {
    private games: Game[];
    // static actions = {
    //         MOVING: this.do_move(),
    //         ROTATING: "do_rotate",
    //         ATTACKING: "do_attack",

    // }
    private static instance: GameService;
    private constructor() {
        this.games = [];
    };

    static getInstance(): GameService {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new GameService();
        return this.instance;
    }

    public buildPlayer(socket: Socket): Player {
        return {
            id: socket,
            x: 0,
            y: 0,
            state: PlayerStates.Idle,
            direction: Directions.Right,
            visibility: true
        }
    }
    public updatePlayer(data: any) {
        console.log(data.action);
        let room: Room = RoomService.getInstance().getRoomByPlayerId(data.player.id);
        // if (this.checkPlayerAction(data)) {
        room = RoomService.getInstance().updatePlayer(room, data);
        this.sendUpdatedPlayers(room, data.player, data.action);
    // } else (this.sendUpdatedPlayers(room, data.player, "You cannot do that"));
    }
    public addPlayer(player: Player): boolean {
        console.log(player.id.id);
        const room: Room = RoomService.getInstance().addPlayer(player);

        ServerService.getInstance().sendMessage(room.name, Messages.ASIGN_MY_PLAYER, {
            player: this.mapPlayer(player)
        });
        const genRanHex = (size: Number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        if (room.players.length == RoomConfig.maxRoomPlayers) {
            const game: Game = {
                id: "game" + genRanHex(128),
                state: GameStates.WAITING,
                room: room,
                board: new BoardBuilder().getBoard()
            }
            room.game = game;
            this.games.push(game);
        }

        if (room.occupied) {
            if (room.game) {
                room.game.state = GameStates.PLAYING;
                if (ServerService.getInstance().isActive()) {



                    this.sendStartingPlayers(room, room.players);

                    ServerService.getInstance().sendMessage(room.name, Messages.BOARD, room.game.board);
                }
            }
            return true;
        }

        return false;
    }

    private sendStartingPlayers(room: Room, data: Player[]) {
        ServerService.getInstance().sendMessage(room.name, Messages.PLAYERS_UPDATE, [{
            name: '1',
            player: this.mapPlayer(data[0]),
        },
        {
            name: '2',
            player: this.mapPlayer(data[1])
        },
        // {
        //     name: '3',
        //     player: this.mapPlayer(room.players[2])
        // },
        // {
        //     name: '4',
        //     player: this.mapPlayer(room.players[3])
        // }
        ]);
    }

    private sendUpdatedPlayers(room: Room, data: Player, message?: string) {
        console.log("envio de mensaje");
        ServerService.getInstance().sendMessage(room.name, Messages.PLAYERS_UPDATE, {
            message: message,
            player: data,
        }
        );
    }
    private mapPlayer(player: Player) {
        return {
            id: player.id.id,
            x: player.x,
            y: player.y,
            state: player.state,
            direction: player.direction,
            visibility: player.visibility
        }
    }


    // private checkPlayerAction(data: any) {
    //     if (Object.keys(GameService.actions).includes(data.action))
    //         GameService.actions[data.action]();
    // }
    // private do_move() {

    // }
}
