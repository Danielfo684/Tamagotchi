import { Room } from "../../room/entities/Room";
import { Board } from "./Board";

export enum GameStates {
    WAITING, PLAYING
}

export enum Messages {
    BOARD = "BOARD",
    NEW_PLAYER = "NEW_PLAYER",
    ROOM_STATUS = "ROOM_STATUS",
    PLAYERS_UPDATE = "PLAYERS_UPDATE",
    // ASIGN_PLAYER = "ASIGN_PLAYER",
    ASIGN_MY_PLAYER = "ASIGN_MY_PLAYER",
    ATTACK = "ATTACK",
    MOVE = "MOVE",
    ROTATE = "ROTATE",
    CANCELLED_ACTION = "CANCELLED_ACTION",
}

export interface Game {
    id : String,
    state: GameStates,
    room: Room,
    board: Board
}