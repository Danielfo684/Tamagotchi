import { io } from "../../node_modules/socket.io-client/dist/socket.io.esm.min.js";
import { GameService } from "./GameService.js";

export const ConnectionHandler = {
    connected: false,
    socket: null,
    url: null,
    controller: null,
    init: (url, controller, onConnectedCallBack, onDisconnectedCallBack) => {
        ConnectionHandler.controller = controller;
        ConnectionHandler.socket = io(url);
        ConnectionHandler.socket.onAny((message, payload) => {
          


        });
        
        ConnectionHandler.socket.on("connect", (data) => {
            ConnectionHandler.socket.on("connectionStatus", (data) => {
                ConnectionHandler.connected = true;
                onConnectedCallBack();
            });
            ConnectionHandler.socket.on("message", (payload) => {
                ConnectionHandler.controller.actionController(payload);
                //socket.emit("message",{ type: "HELLO", content: "Hello world!"});
            })
            ConnectionHandler.socket.on("disconnect", () => {
                ConnectionHandler.connected = false;
                onDisconnectedCallBack();
            });
        })
     
        
    },
    updatePlayer : (payload) => {
        ConnectionHandler.socket.emit("UPDATE_PLAYER", payload);
    },
    sendStartingBoard : (payload) => {
        ConnectionHandler.socket.emit("STARTING_BOARD", payload);
    }
}



