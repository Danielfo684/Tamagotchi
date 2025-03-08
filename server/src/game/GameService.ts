import { Socket } from "socket.io";
import { Directions, Player, PlayerStates } from "../player/entities/Player";
import { Room, RoomConfig } from "../room/entities/Room";
import { RoomService } from "../room/RoomService";
import { Game, GameStates, Messages } from "./entities/Game";
import { BoardBuilder } from "./BoardBuilder";
import { ServerService } from "../server/ServerService"
export class GameService {
    private games: Game[];


    // para futuros códigos: este objeto json era problemático porque al contrario que otros elementos que hemos definido en TypeScript, 
    // hay que establecer qué va a ser la clave, qué va a ser el valor y qué va a devolver, todo en una sola línea.
    // Para poder meterle parámetros hay que hacerlo como función flecha, si no no se puede.
    actions: { [key: string]: (data: any) => void } = {
        MOVING: (data) => this.check_move(data),
        ROTATING: (data) => this.check_rotate(data),
        ATTACKING: (data) => this.check_attack(data),
    }
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
            state: PlayerStates.Moving,
            direction: Directions.Right,
            visibility: true
        }
    }
    public updatePlayer(data: any) {
        console.log(data.action);

        let room: Room = RoomService.getInstance().getRoomByPlayerId(data.player.id);
        if (this.actions[data.action]) {
            console.log("existe la acción");
            this.actions[data.action](data);
        } else {
            console.log("no existe la acción");
            this.sendCancelledAction(room, data.player, data.action);
        }
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
    private sendCancelledAction(room: Room, data: Player, action: string) {
        ServerService.getInstance().sendMessage(room.name, Messages.CANCELLED_ACTION, {
            message: action + " is not a valid action",
            player: data
        });
    };

    private sendUpdatedPlayers(room: Room, data: any, message?: string) {
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



    public check_rotate(data: any) {
        let room: Room = RoomService.getInstance().getRoomByPlayerId(data.player.id);
        room = RoomService.getInstance().updatePlayer(room, data);
        this.sendUpdatedPlayers(room, data.player, data.action);
    }
    public check_attack(data: any) {
        console.log("ATAQUE");
        let room: Room = RoomService.getInstance().getRoomByPlayerId(data.player.id);
        let x = data.player.x;
        let y = data.player.y;
        switch (data.player.direction) {
            case Directions.Up:
                --x;
                break;
            case Directions.Right:
                ++y;
                break;
            case Directions.Down:
                ++x;
                break;
            case Directions.Left:
                --y;
                break;
        }

        room.players.forEach((player) => {
            if (player.x === x && player.y === y && player.state !== PlayerStates.Defeated) {
                player.state = PlayerStates.Defeated;
                this.updatePlayerData(player, room);
                let mappedPlayer = this.mapPlayer(player);
                this.sendUpdatedPlayers(room, mappedPlayer, "DEFEATING");
            } else {
            }
        });
    }

    public check_move(data: any) {
        let room: Room = RoomService.getInstance().getRoomByPlayerId(data.player.id);
        let nextTile: Array<number> = [];
        console.log(data.player.direction);
        console.log(data.player.x);
        console.log(data.player.y);
        switch (data.player.direction) {
            case Directions.Up:
                nextTile = [data.player.x - 1, data.player.y];

                break;
            case Directions.Right:
                nextTile = [data.player.x, data.player.y + 1];
                break;
            case Directions.Down:
                nextTile = [data.player.x + 1, data.player.y];
                break;
            case Directions.Left:
                nextTile = [data.player.x, data.player.y - 1];
                break;
        }
        let marker: Boolean = false;
        if (nextTile[0] >= 0 && nextTile[0] <= 9 && nextTile[1] >= 0 && nextTile[1] <= 9) {
            room.players.forEach((player) => {
               console.log("nos movemos!");
                if (
                    (player.x === nextTile[0] && player.y === nextTile[1])
                ) {
                    marker = true;
                }

            })

            if (!marker) {
                data.player.x = nextTile[0];
                data.player.y = nextTile[1];
            }
            this.updatePlayerData(data.player, room);
            RoomService.getInstance().updatePlayer(room, data);
            this.sendUpdatedPlayers(room, data.player, data.action);
        } else {
            console.log("no se puede mover");
        }

    }

    public updatePlayerData(player: Player, room: Room) {
        room.players.forEach((serverPlayer) => {
            if (serverPlayer.id.id === player.id.id) {
                serverPlayer.x = player.x;
                serverPlayer.y = player.y;
                serverPlayer.state = player.state;
                serverPlayer.direction = player.direction;
                serverPlayer.visibility = player.visibility;
            }
        });
    }

}