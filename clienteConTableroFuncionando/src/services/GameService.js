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
    board = null;
    #queue = null;
    #state = null;
    #parallel = null;
    #myPlayer = null;
    #startingPositions = null;


    #actionsList = {
        "NEW_PLAYER": this.do_newPlayer.bind(this),
        "BOARD": this.do_newBoard.bind(this),
        "PLAYERS_UPDATE": this.do_updatePlayers.bind(this),
        "ASIGN_MY_PLAYER": this.do_asignMyPlayer.bind(this),
        "UPDATE_PLAYER": this.do_updatePlayers.bind(this),
        "ATTACKING": this.do_attack.bind(this),
        "MOVING": this.do_move.bind(this),
        "ROTATING": this.do_rotate.bind(this),
         "DEFEATING": this.do_defeat.bind(this),
        "CANCELLED_ACTION": this.do_cancelledAction.bind(this),
        "WINNING": this.do_win.bind(this),
    };

    constructor(ui) {
        this.#state = this.#states.WAITING;
        this.board = new Board();
        this.#queue = new Queue();
        this.#parallel = null;
        this.checkScheduler();
        this.#ui = ui;
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

        this.#players.push(payload);

    };




    async do_updatePlayers(payload) {
        if (this.#players.length === 0) {
            payload.forEach(item => {
                this.#players.push(item.player);
            });

            this.#players.map((player, index) => {
                player.x = this.#startingPositions[index][0];
                player.y = this.#startingPositions[index][1];
            });

            this.#myPlayer = this.#players.find(player =>
                player.id === this.#myPlayer.player.id);
        } else {
            console.log(payload);
            const player = this.#players.find(player => player.id === payload.player.id);
            player.x = payload.player.x;
            player.y = payload.player.y;
            player.state = payload.player.state;
            player.direction = payload.player.direction;
            player.visibility = payload.player.visibility;
            let newPayload = {
                type : payload.message ,
                content: payload.player
            }
            this.do(newPayload);
            this.#ui.do_action(player, payload.message, this.#myPlayer);

        };
    };

    async do_newBoard(payload) {
        this.board.build(payload);
        this.#ui.drawBoard(this.board.map, this.#players, this.#myPlayer);


        this.#ui.playerButtons(this.#myPlayer, ConnectionHandler.controller);
        // le mandamos por parámetro el connectionHandler.controller.función de envio de mensajes al servidor y en UIv1.js se lo pasamos a los botones

    }

    async do_asignMyPlayer(payload) {
        if (this.#myPlayer === null) {
            this.#myPlayer = payload;

        }

    }
    async do_cancelledAction(payload) {
        console.log("Action cancelled");
        this.#ui.showCancelMessage();
    }
    async do_win(payload) {
        if (payload.id === this.#myPlayer)
        console.log("You win!");
        this.#ui.showVictory();
    }


    //Métodos únicamente planteados para implementar nuevas acciones si hicese falta.
    //En un primer momento se encargaban de hacer ciertas comprobaciones, pero al trasladar la mayoría al servidor
    // se han quedado vacías.
    async do_attack(payload) {}
    async do_move(payload) {}
    async do_rotate(payload) {}

    async do_defeat(payload) {
        if(payload.id === this.#myPlayer)
        this.#ui.showDefeat();
    }
    

}