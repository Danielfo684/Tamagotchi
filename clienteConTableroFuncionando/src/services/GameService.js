import { Board } from "../entities/Board.js";
import { Queue } from "../Queue.js";
import { ConnectionHandler } from "./ConnectionHandler.js";
export class GameService {
    #states = {
        WAITING: 0,
        PLAYING: 1,
        ENDED: 2
    };
    #ui = null;
    #players = [];
    #board = null;
    #queue = null;
    #state = null;
    #parallel = null;
    #myPlayer = null;
    #startingPositions = null;


    #actionsList = {
        "NEW_PLAYER": this.do_newPlayer.bind(this),
        "BOARD": this.do_newBoard.bind(this),
        "PLAYERS_UPDATE": this.do_updatePlayers.bind(this),
        "ASIGN_PLAYER": this.do_asignPlayer.bind(this),
        "ASIGN_MY_PLAYER": this.do_asignMyPlayer.bind(this),
        // "SEND_UPDATE" : this.do_sendMyPlayer.bind(this)
        // "ROOM_STATUS" : this.do_newBoard.bind(this)
        "UPDATE_PLAYER": this.do_updatePlayers.bind(this)
    };

    constructor(ui) {
        this.#state = this.#states.WAITING;
        this.#board = new Board();
        this.#queue = new Queue();
        this.#parallel = null;
        this.checkScheduler();
        this.#ui = ui;
        console.log(this.#board);
        this.#startingPositions = [[0, 0], [0, 9], [9, 0], [9, 9]];
    }

    checkScheduler() {
        if (!this.#queue.isEmpty()) {
            if (this.#parallel == null) {
                this.#parallel = setInterval(
                    async () => {
                        const action = this.#queue.getMessage();
                        if (action != undefined) {
                            await this.#actionsList[action.type](action.content);
                        } else {
                            this.stopScheduler();
                        }
                    }
                );
            }
        }
    }

    stopScheduler() {
        clearInterval(this.#parallel);
        this.#parallel = null;
    }

    do(data) {
        this.#queue.addMessage(data);
        this.checkScheduler();
    };

    async do_newPlayer(payload) {
        console.log('new player');

        console.log(payload);
        this.#players.push(payload);
        console.log(this.#players);

    };

    async do_asignPlayer(payload) {
        console.log(payload);
    };


    async do_updatePlayers(payload) {
        console.log(this.#players);
        console.log(payload);
        if (this.#players.length === 0) {
            payload.forEach(item => {
                console.log("updating player " + item.name);
                this.#players.push(item.player);
            });

            console.log(this.#players);
            this.#players.map((player, index) => {
                console.log(index);
                player.x = this.#startingPositions[index][0];
                console.log(this.#startingPositions[index][1]);
                player.y = this.#startingPositions[index][1];
            });
            console.log(this.#myPlayer);

            this.#myPlayer = this.#players.find(player =>
                player.id === this.#myPlayer.player.id);
        } else {
            console.log(payload);
            const player = this.#players.find(player => player.id === payload.player.id);
            player.x = payload.player.x;
            player.y = payload.player.y;
            player.status = payload.player.status;
            player.direction = payload.player.direction;
            player.visibility = payload.player.visibility;

            this.#ui.do_action(player, payload.message);

        };
    };

    async do_newBoard(payload) {
        console.log(payload);
        this.#board.build(payload);
        console.log(this.#players);
        this.#ui.drawBoard(this.#board.map, this.#players);

        console.log(this.#myPlayer);

        this.#ui.playerButtons(this.#myPlayer, ConnectionHandler.controller);
        // le mandamos por parámetro el connectionHandler.controller.función de envio de mensajes al servidor y en UIv1.js se lo pasamos a los botones

    }

    async do_asignMyPlayer(payload) {
        if (this.#myPlayer === null) {
            this.#myPlayer = payload;
            console.log("my player");
            console.log(this.#myPlayer);
        }

    }

    // async do_sendMyPlayer(payload) {
    //     ConnectionHandler.emitData("SEND_UPDATE", {
    //         player: this.#myPlayer
    //     });
    // }

}