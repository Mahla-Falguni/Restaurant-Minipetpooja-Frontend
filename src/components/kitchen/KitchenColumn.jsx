import React from "react";

import EmptyColumn from "./EmptyColumn";
import KitchenCard from "./KitchenCard";

const STATUS_COLORS = {
    Pending: "bg-yellow-500",
    Accepted: "bg-blue-500",
    Preparing: "bg-orange-500",
    Ready: "bg-green-500",
    Served: "bg-purple-500"
};

const KitchenColumn = ({
    title,
    status,
    orders = [] }) => {

    return (
        <div className=" w-[340px] min-w-[340px] bg-gray-100 rounded-xl shadow-md flex flex-col max-h-[calc(100vh-220px)]" >

            {/* Header */}

            <div className={`   ${STATUS_COLORS[status]}   text-white   px-4   py-3   rounded-t-xl   flex   justify-between   items-center sticky  top-0 z-10 `} >

                <h2 className=" font-bold text-lg" >
                    {title}
                </h2>

                <span className="  bg-white  text-black  rounded-full  px-3  py-1  text-sm  font-bold" >
                    {orders.length}
                </span>

            </div>

            {/* Orders */}

            <div className="  flex-1  overflow-y-auto  p-3  space-y-4" >
                {
                    orders.length === 0 ?
                        <EmptyColumn title={title} />
                        :
                        orders.map(
                            (order) => (
                                <KitchenCard
                                    key={order._id}
                                    order={order}
                                />
                            )
                        )
                }
            </div>
        </div>
    );
};


export default React.memo(KitchenColumn);