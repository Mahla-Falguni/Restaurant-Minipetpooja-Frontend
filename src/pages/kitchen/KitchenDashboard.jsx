import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchKitchenOrders,
    fetchKitchenDashboard
} from "../../redux/kitchen/kitchenSlice";

import { getRestaurantProfile } from "../../redux/restaurant/restaurantSlice";

import useKitchenSocket from "../../hooks/useKitchenSocket";

import KitchenHeader from "../../components/kitchen/KitchenHeader";
import KitchenStats from "../../components/kitchen/KitchenStats";
import KitchenBoard from "../../components/kitchen/KitchenBoard";

import { FaSyncAlt, FaExclamationTriangle, FaUtensils } from "react-icons/fa";

const KitchenDashboard = () => {

    const dispatch = useDispatch();

    const { orders, dashboard, loading, error } = useSelector(
        (state) => state.kitchen);

    const restaurant = useSelector(
        (state) => state.restaurant.profile);

    useKitchenSocket(restaurant?._id);

    const [lastUpdated, setLastUpdated] = useState(new Date());

    const loadKitchenData = useCallback(() => {
        dispatch(fetchKitchenOrders());
        dispatch(fetchKitchenDashboard());
        setLastUpdated(new Date());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getRestaurantProfile());
    }, [dispatch]);

    useEffect(() => {

        loadKitchenData();

    }, []);

    // Loading Screen

    if (loading) {

        return (

            <div className=" min-h-screen bg-gradient-to-br from-orange-50 to-gray-100 flex items-center justify-center" >

                <div className="  bg-white  rounded-2xl  shadow-xl  p-10  text-center  w-[350px]" >

                    <div className="  w-16  h-16  mx-auto  border-4  border-orange-500  border-t-transparent  rounded-full  animate-spin mb-5" />

                    <h2 className=" text-2xl font-bold text-gray-800" >
                        Kitchen Loading...
                    </h2>

                    <p className=" text-gray-500 mt-2" >
                        Fetching today's live orders
                    </p>

                </div>

            </div>

        );

    }

    // Error Screen

    if (error) {

        return (

            <div className=" min-h-screen bg-red-50 flex items-center justify-center"  >

                <div className=" bg-white rounded-2xl shadow-xl p-10 text-center w-[450px]" >

                    <FaExclamationTriangle
                        className=" text-red-500 text-6xl mx-auto mb-5"
                    />

                    <h2 className=" text-2xl font-bold" >
                        Failed to Load Kitchen
                    </h2>

                    <p className=" text-gray-600 mt-3" >
                        {error}
                    </p>

                    <button onClick={loadKitchenData}
                        className=" mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold" >
                        Retry
                    </button>

                </div>

            </div>

        );

    }

    return (

        <div className=" min-h-screen bg-gray-100" >

            {/* Sticky Header */}

            <div className=" sticky top-0 z-50 bg-white shadow" >
                <KitchenHeader />
            </div>

            <KitchenStats
                dashboard={dashboard}
            />

            {/* Toolbar */}

            <div className=" flex justify-between items-center px-6 py-4" >

                <div>

                    <h1 className=" text-2xl font-bold" >
                        Kitchen Display System
                    </h1>

                    <p className=" text-gray-500 text-sm" >
                        Last Updated :  {lastUpdated.toLocaleTimeString()}
                    </p>

                </div>

                <button onClick={loadKitchenData}
                    className=" flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg" >
                    <FaSyncAlt />
                    Refresh
                </button>

            </div>

            <div className="px-6 pb-10">

                {
                    orders.length === 0
                        ?
                        (
                            <div className=" bg-white rounded-2xl shadow py-24 text-center" >

                                <FaUtensils className=" text-6xl text-gray-300 mx-auto mb-5" />

                                <h2 className="text-2xlfont-bold">
                                    No Active Orders
                                </h2>

                                <p className=" text-gray-500 mt-2">
                                    Waiting for customers...
                                </p>

                            </div>
                        )

                        :

                        (<KitchenBoard orders={orders} />)

                }

            </div>

        </div>

    );

};

export default KitchenDashboard;