import React, { useMemo } from "react";
import { motion } from "framer-motion";

import { FaUser, FaChair, FaReceipt, FaStickyNote, FaMotorcycle, FaShoppingBag, FaUtensils, FaPhone, FaClock } from "react-icons/fa";

import Badge from "./Badge";
import KitchenTimer from "./KitchenTimer";
import OrderItems from "./OrderItems";
import KitchenActions from "./KitchenActions";
import getStatusColor from "../../utils/kitchenHelpers"

const KitchenCard = ({ order }) => {

    const priority = useMemo(() => {
        const created = new Date(order.createdAt);
        const minutes =
            (Date.now() - created) / 1000 / 60;

        if (minutes >= 20) return "High";
        if (minutes >= 10) return "Medium";

        return "Low";

    }, [order.createdAt]);

    const overdue = useMemo(() => {
        const elapsedMinutes = Math.floor(
            (Date.now() - new Date(order.createdAt)) / 60000
        );

        return elapsedMinutes > (order.estimated_time || 20);

    }, [
        order.createdAt,
        order.estimated_time
    ]);

    const colors = useMemo(() => {
        return getStatusColor(order.order_status);
    }, [order.order_status]);

    const orderTypeIcon = useMemo(() => {
        switch (order.order_type) {
            case "Delivery":
                return (<FaMotorcycle className="text-red-500 text-xl" />);

            case "Takeaway":
                return (<FaShoppingBag className="text-green-600 text-xl" />);

            default:
                return (<FaUtensils className="text-orange-600 text-xl" />);
        }

    }, [order.order_type]);


    const orderItems = useMemo(() => {
        return order.items || [];
    }, [order.items]);


    const timerProps = useMemo(() => ({
        createdAt: order.createdAt,
        estimatedTime: order.estimated_time
    }), [
        order.createdAt,
        order.estimated_time
    ]);

    return (
        <motion.div
            layout

            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: .95 }}
            transition={{ duration: .25 }}

            className={`  rounded-xl  border-l-8  border  transition-all  duration-300

            ${colors.border}
            ${colors.bg}

            ${overdue ? "ring-4 ring-red-300 animate-pulse" : ""} `} >

            {
                priority === "High"
                &&
                <div
                    className=" bg-red-600 text-white text-center font-bold py-1 tracking-wide ">
                    🔥 HIGH PRIORITY ORDER
                </div>
            }

            {/* HEADER */}

            <div
                className=" bg-orange-600 text-white p-4 flex justify-between items-center"
            >

                <div className=" flex gap-2  items-center" >

                    <Badge text={priority} color={priority} />

                    <span
                        className={`  text-white  px-3  py-1  rounded-full  text-xs  font-bold
                        ${colors.badge}
                    `} >
                        {order.order_status}
                    </span>
                </div>

                <div>
                    <h2 className=" text-xl font-bold"  >
                        #{order.order_number}
                    </h2>

                    <p className=" text-sm opacity-90" >
                        {order.order_type}
                    </p>
                </div>

                <Badge text={priority} color={priority} />

            </div>

            {/* BODY */}

            <div className="p-5 space-y-5">

                {/* Table */}

                <div className=" flex justify-between items-center"   >

                    <div className=" flex items-center gap-2"  >

                        <FaChair className="  text-orange-600" />

                        <span>
                            Table
                            <strong> {" "} {order.table_number || "--"}
                            </strong>
                        </span>
                    </div>

                    <Badge
                        text={order.payment_status}
                        color={order.payment_status}
                    />

                </div>

                {/* Customer */}

                <div className=" flex justify-between" >

                    <div className=" flex items-center gap-2" >

                        <FaUser className="  text-blue-600" />

                        <div>
                            <h4 className=" font-semibold" >
                                {
                                    order.customer_name || "Walk-in Customer"
                                }
                            </h4>

                            {
                                order.customer_phone &&
                                <div className=" flex items-center gap-2 text-sm text-gray-500" >
                                    <FaPhone />
                                    {
                                        order.customer_phone
                                    }
                                </div>
                            }

                        </div>

                    </div>

                    <div className="text-right">
                        {orderTypeIcon}
                    </div>

                </div>

                {/* SUMMARY */}

                <div className=" grid  grid-cols-2  gap-3"  >
                    <div className="  bg-gray-50  rounded-lg  p-3"  >

                        <div className="  flex  items-center  gap-2" >
                            <FaReceipt className=" text-gray-500" />

                            <span className="  text-sm" >
                                Items
                            </span>

                        </div>

                        <h3 className=" text-2xl font-bold mt-1"  >
                            {order.total_items}
                        </h3>

                    </div>

                    <div className=" bg-green-50 rounded-lg p-3">

                        <span className="  text-sm" >
                            Total
                        </span>

                        <h3 className="  text-2xl  font-bold  text-green-600  mt-1" >
                            ₹{Number(order.grand_total).toFixed(2)}
                        </h3>

                    </div>

                </div>

                {/* TIMER */}

                <KitchenTimer
                    {...timerProps}
                />

                {/* ORDER ITEMS */}

                <OrderItems
                    items={orderItems}
                />

                {/* SPECIAL NOTE */}

                {
                    order.special_instruction &&
                    <div className="  bg-yellow-50  border  border-yellow-300  rounded-lg  p-4">

                        <div className="  flex  items-start  gap-2"  >

                            <FaStickyNote className="  text-yellow-600  mt-1" />

                            <div>
                                <h4 className="   font-semibold    text-yellow-700"   >
                                    Chef Note
                                </h4>

                                <p className=" text-sm mt-1" >
                                    {
                                        order.special_instruction
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                }

                {/* ETA */}

                <div className="  flex  justify-between  items-center  bg-blue-50  rounded-lg  p-3"  >

                    <div className="  flex  items-cente  gap-2"  >
                        <FaClock className="  text-blue-600" />
                        Estimated Time
                    </div>

                    <strong>
                        {
                            order.estimated_time
                        }
                        mins
                    </strong>

                </div>
            </div>

            {/* FOOTER */}

            <div className="  border-t  p-4  bg-gray-50">
                <KitchenActions
                    order={order}
                />
            </div>

        </motion.div>
    );
};

export default React.memo(KitchenCard);