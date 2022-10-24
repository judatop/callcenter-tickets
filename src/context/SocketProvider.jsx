import React, { createContext, useContext, useState, useRef } from "react";
import io from "socket.io-client";
import { API_ENDPOINT } from "../helpers/endpoints";

export const SocketStateContext = createContext();

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);

  const connectSocket = () => {
    disconnectSocket();
    socket.current = io(API_ENDPOINT);
  };

  const disconnectSocket = () => {
    if (socket.current != null) {
      socket.current.disconnect();
    }
  };

  return (
    <SocketStateContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
      {children}
    </SocketStateContext.Provider>
  );
};

export const useSocketState = () => {
  const context = useContext(SocketStateContext);

  if (context === undefined) {
    throw new Error("useSocketState must be used within a SocketProvider");
  }

  return context;
};