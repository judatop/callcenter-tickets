import React, {useState} from "react";
import io from "socket.io-client";
import { API_ENDPOINT } from "../helpers/endpoints";

// export const socket = io.connect(API_ENDPOINT);
export let socket = {};

export const SocketContext = React.createContext(); 

export const connect = () => {
    socket  = io.connect(API_ENDPOINT);
    console.log("connectando")
    console.log(socket);
}
