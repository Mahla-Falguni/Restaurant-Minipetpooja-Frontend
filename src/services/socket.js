import { io } from "socket.io-client";

let socket = null;

export const connectKitchenSocket = (restaurantId) => {

    if (socket) return socket;

    socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
        transports: ["websocket"],
        autoConnect: true
    });

    socket.on("connect", () => {

        console.log(
            "Socket Connected:",
            socket.id
        );

        socket.emit(
            "joinRestaurant",
            restaurantId
        );

    });

    socket.on("disconnect", () => {
        console.log(
            "Socket Disconnected"
        )
    });

    return socket;

};

export const getKitchenSocket = () => socket;

export const disconnectKitchenSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};