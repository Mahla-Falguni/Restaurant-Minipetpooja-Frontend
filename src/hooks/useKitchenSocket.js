import { useEffect } from "react";

import { useDispatch } from "react-redux";

import { connectKitchenSocket, disconnectKitchenSocket } from "../services/socket";
import { addOrder, updateOrder } from "../redux/kitchen/kitchenSlice";



const useKitchenSocket = (restaurantId) => {

    const dispatch = useDispatch();

    useEffect(() => {

        if (!restaurantId) return;

        const socket = connectKitchenSocket(restaurantId);

        socket.on("newOrder", (order) => { dispatch(addOrder(order)); });
        socket.on("orderAccepted", (order) => { dispatch(updateOrder(order)); });
        socket.on("orderPreparing", (order) => { dispatch(updateOrder(order)); });
        socket.on("orderReady", (order) => { dispatch(updateOrder(order)); });
        socket.on("orderServed", (order) => { dispatch(updateOrder(order)); });
        socket.on("orderCompleted", (order) => { dispatch(updateOrder(order)); });
        socket.on("orderRejected", (order) => { dispatch(updateOrder(order)); });

        return () => {

            socket.off("newOrder");
            socket.off("orderAccepted");
            socket.off("orderPreparing");
            socket.off("orderReady");
            socket.off("orderServed");
            socket.off("orderCompleted");
            socket.off("orderRejected");

            disconnectKitchenSocket();

        };

    }, [restaurantId, dispatch]);

};



export default useKitchenSocket;