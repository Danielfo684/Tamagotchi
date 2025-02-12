import { io } from "../../node_modules/socket.io-client/dist/socket.io.esm.min.js";
import { GameService } from "./GameService.js";

export const ConnectionHandler = {
    connected: false,
    socket: null,
    url: null,
    controller: null,
    init: (url, controller, onConnectedCallBack, onDisconnectedCallBack) => {
        ConnectionHandler.controller = controller;
        let { socket } = ConnectionHandler;
        socket = io(url);
        socket.onAny((message, payload) => {
            console.log("Esta llegando: ");
            console.log(payload);


        });

        socket.on("connect", (data) => {
            socket.on("connectionStatus", (data) => {
                ConnectionHandler.connected = true;
                console.log(data);
                onConnectedCallBack();
            });
            socket.on("message", (payload) => {
                ConnectionHandler.controller.actionController(payload);
                //socket.emit("message",{ type: "HELLO", content: "Hello world!"});
            })
            socket.on("disconnect", () => {
                ConnectionHandler.connected = false;
                onDisconnectedCallBack();
            });
        })
        // no he encontrado la forma de enlazar limpiamente el socket emit con 
        // la UI y mantenerlos separados, voy a llamar al socket emit directamente en UI
        emitData: (message, payload) => {
            if (ConnectionHandler.socket) {
                ConnectionHandler.socket.emit(message, payload);
            } else {
                console.error("Socket is not initialized.");
            }
        }
    }
}



