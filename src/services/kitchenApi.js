import axios from "../api/axiosInstance"


// Dashboard
export const getKitchenDashboard = () => axios.get("/kitchen/dashboard");

// Orders
export const getKitchenOrders = (params) => axios.get("/kitchen/orders", { params });

// Accept
export const acceptOrder = (id) => axios.patch(`/kitchen/accept/${id}`);

// Preparing
export const startPreparing = (id) => axios.patch(`/kitchen/preparing/${id}`);

// Ready
export const markReady = (id) => axios.patch(`/kitchen/ready/${id}`);

// Served
export const serveOrder = (id) => axios.patch(`/kitchen/serve/${id}`);

// Completed
export const completeOrder = (id) => axios.patch(`/kitchen/complete/${id}`);

// Reject
export const rejectOrder = (id, reason) => axios.patch(`/kitchen/reject/${id}`, { reason });