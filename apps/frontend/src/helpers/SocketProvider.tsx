'use client'
import React, { useCallback, useEffect, useState } from "react"
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
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<string[]>([]);

    const sendMessage: ISocketContext['sendMessage'] = useCallback((msg) => {
        if (socket) {
            console.log('Sending message:', msg); // Debugging log
            socket.emit('event:message', { message: msg });
        } else {
            console.error('Socket is not connected'); // Debugging log
        }
    }, [socket]);

    const onMessage = useCallback((msg: string) => {
        console.log("Message received from server", msg);
        setMessages((prev) => [...prev, msg]);
    }, []);
    
    useEffect(() => {
        const _socket = io('http://localhost:3001');
        _socket.on('chat:message', onMessage);
        setSocket(_socket);
        console.log('Socket connected'); // Debugging log

        return () => {
            _socket.disconnect();
            _socket.off('chat:message', onMessage);
            setSocket(undefined);
            console.log('Socket disconnected'); // Debugging log
        };
    }, [onMessage]);


    return (
        <SocketContext.Provider value={{ sendMessage, messages }}>
            {children}
        </SocketContext.Provider>
    );
}