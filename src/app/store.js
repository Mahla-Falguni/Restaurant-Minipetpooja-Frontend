import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../redux/auth/authSlice";
import cartReducer from "../redux/cart/cartSlice";
import categoryReducer from "../redux/category/categorySlice";
import menuReducer from "../redux/menu/menuSlice";
import tableReducer from "../redux/table/tableSlice";
import orderReducer from "../redux/order/orderSlice";
import feedbackReducer from "../redux/feedback/feedbackSlice";
import waiterReducer from "../redux/waiter/waiterSlice";
import cashierReducer from "../redux/cashier/cashierSlice";
import kitchenReducer from "../redux/kitchen/kitchenSlice";
import customerReducer from "../redux/customer/customerSlice";
import reservationReducer from "../redux/reservation/reservationSlice";
import staffReducer from "../redux/staff/staffSlice";
import restaurantReducer from "../redux/restaurant/restaurantSlice";
import publicMenuReducer from "../redux/publicMenu/publicMenuSlice";
import dashboardReducer from "../redux/dashboard/dashboardSlice";
import subscriptionReducer from "../redux/subscription/subscriptionSlice";

import superAdminAuthReducer from "../redux/superAdmin/superAdminAuthSlice";
import superAdminRestaurantsReducer from "../redux/superAdmin/superAdminRestaurantSlice";
import superAdminPlansReducer from "../redux/superAdmin/superAdminPlanSlice";
import superAdminAnalyticsReducer from "../redux/superAdmin/superAdminAnalyticsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    cart: cartReducer,
    categories: categoryReducer,
    menu: menuReducer,
    tables: tableReducer,
    orders: orderReducer,
    feedback: feedbackReducer,
    waiter: waiterReducer,
    cashier: cashierReducer,
    kitchen: kitchenReducer,
    customers: customerReducer,
    reservations: reservationReducer,
    staff: staffReducer,
    restaurant: restaurantReducer,
    publicMenu: publicMenuReducer,
    subscription: subscriptionReducer,

    superAdminAuth: superAdminAuthReducer,
    superAdminRestaurants: superAdminRestaurantsReducer,
    superAdminPlans: superAdminPlansReducer,
    superAdminAnalytics: superAdminAnalyticsReducer,
  },
});