import { DefaultEventsMap, Server, Socket } from 'socket.io';
import http from 'http';
import { GameService } from '../game/GameService';
import { AnyTxtRecord } from 'dns';
import { RoomService } from '../room/RoomService';
export class ServerService {
    private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null;
    private active: boolean;
    static messages = {
        out: {
            new_player: "NEW_PLAYER",
            room_status: "ROOM_STATUS",
            players_ready: "PLAYERS_READY"
        }
    }

    private static instance: ServerService;
    private constructor() {
        this.io = null;
        this.active = false;
    };

    static getInstance(): ServerService {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ServerService();
        return this.instance;
    }

    public init(httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
        this.io = new Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });
        this.active = true;

        this.io.on('connection', (socket) => {
            socket.emit("connectionStatus", { status: true });
            GameService.getInstance().addPlayer(GameService.getInstance().buildPlayer(socket));
            socket.on("UPDATE_PLAYER", (data) => {
                console.log(data);
                console.log("UPDATE_PLAYER");
                GameService.getInstance().updatePlayer(data);
            });
            socket.on('disconnect', () => {
                console.log('Un cliente se ha desconectado:', socket.id);
                RoomService.getInstance().removePlayer(socket.id);
            });




        });
    }

    public addPlayerToRoom(player: Socket, room: String) {
        player.join(room.toString());
    }

    public sendMessage(room: String | null, type: String, content: any) {
        // console.log(content);
        if (this.active && this.io != null) {
            if (room != null) {
                this.io?.to(room.toString()).emit("message", {
                    type, content
                })
            }
        }
    }


    public isActive() {
        return this.active;
    }


}


