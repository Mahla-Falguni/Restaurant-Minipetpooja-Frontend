import React, { useMemo } from "react";
import KitchenColumn from "./KitchenColumn";

const COLUMN_CONFIG = [
    { title: "Pending", status: "Pending" },
    { title: "Accepted", status: "Accepted" },
    { title: "Preparing", status: "Preparing" },
    { title: "Ready", status: "Ready" },
    { title: "Served", status: "Served" }
];

const KitchenBoard = ({ orders = [] }) => {

    const groupedOrders = useMemo(() => {
        const groups = {};
        COLUMN_CONFIG.forEach(column => {
            groups[column.status] = [];
        });

        orders.forEach(order => {
            if (groups[order.order_status]) {
                groups[order.order_status].push(order);
            }
        });

        return groups;

    }, [orders]);

    // Empty State

    if (!orders.length) {
        return (
            <div className=" bg-white rounded-2xl  shadow  py-24  text-center  border"  >

                <div className="text-6xl mb-4">    🍽️ </div>

                <h2 className=" text-2xl font-bold text-gray-700"  >
                    No Active Kitchen Orders
                </h2>

                <p className=" text-gray-500 mt-2" >
                    New customer orders will appear here automatically.
                </p>
            </div>
        );
    }

    return (
        <div className=" w-full overflow-x-auto pb-6" >
            <div className=" flex gap-5 min-w-max items-start" >

                {
                    COLUMN_CONFIG.map(column => (
                        <KitchenColumn
                            key={column.status}
                            title={column.title}
                            status={column.status}
                            orders={
                                groupedOrders[column.status] || []
                            }
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default React.memo(KitchenBoard);