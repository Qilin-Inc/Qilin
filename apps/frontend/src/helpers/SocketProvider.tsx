'use client'
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
    children?: React.ReactNode;
}

interface ISocketContext {
    sendMessage: (msg: string) => void;
    messages: string[];
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
    const context = React.useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const _socket = io('http://localhost:4000');

        const onMessage = (msg: string) => {
            console.log("Message received from server", msg);
            setMessages((prev) => [...prev, msg]);
        };

        _socket.on('chat:message', onMessage);
        setSocket(_socket);
        console.log('Socket connected');

        return () => {
            _socket.off('chat:message', onMessage);
            _socket.disconnect();
            console.log('Socket disconnected');
        };
    }, []);

    const sendMessage = (msg: string) => {
        if (socket && socket.connected) {
            console.log('Sending message:', msg);
            socket.emit('event:message', { message: msg });
        } else {
            console.error('Socket is not connected');
        }
    };

    return (
        <SocketContext.Provider value={{ sendMessage, messages }}>
            {children}
        </SocketContext.Provider>
    );
}
