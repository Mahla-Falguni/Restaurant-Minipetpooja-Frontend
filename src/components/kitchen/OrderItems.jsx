import { useState } from "react";
import React from "react";
import { FaChevronDown, FaChevronUp, FaClock, FaStickyNote } from "react-icons/fa";

import VegBadge from "./VegBadge";
import SpiceBadge from "./SpiceBadge";

const OrderItems = ({ items = [] }) => {

    const [expanded, setExpanded] = useState(false);
    const visibleItems = expanded ? items : items.slice(0, 3);

    return (
        <div
            className="  bg-gray-50  rounded-xl  border  p-4 "  >

            {/* Header */}

            <div
                className=" flex justify-between items-center mb-4  "  >

                <h3 className=" font-bold text-lg  " >
                    Order Items
                </h3>

                <span className=" text-sm text-gray-500 " >
                    {items.length} Items
                </span>

            </div>

            {/* Items */}

            <div className="space-y-3">
                {
                    visibleItems.map((item) => (
                        <div

                            key={item._id}
                            className=" bg-white rounded-lg border p-3 " >

                            <div className=" flex justify-between items-start " >

                                <div className=" flex gap-3 " >

                                    <div
                                        className=" bg-orange-600 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold "  >
                                        {item.quantity}
                                    </div>

                                    <div>

                                        <div className=" flex items-center gap-2 " >

                                            <VegBadge type={item.food_type} />

                                            <h4 className="font-semibold" >
                                                {item.item_name}
                                            </h4>

                                        </div>

                                        <div className=" flex gap-2 mt-2 flex-wrap " >

                                            <SpiceBadge level={item.spice_level} />

                                            {
                                                item.preparation_time && (
                                                    <span
                                                        className=" bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs " >

                                                        <FaClock className="inline mr-1" />
                                                        {item.preparation_time} min
                                                    </span>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {
                                item.special_instruction && (
                                    <div
                                        className=" mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-2 flex gap-2 " >

                                        <FaStickyNote className=" text-yellow-600 mt-1 " />

                                        <p className=" text-sm " >
                                            {item.special_instruction}
                                        </p>

                                    </div>
                                )
                            }
                        </div>
                    ))
                }

            </div>

            {
                items.length > 3 && (
                    <button onClick={() => setExpanded(!expanded)}
                        className=" w-full mt-4 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 font-semibold flex justify-center items-center gap-2 " >

                        {
                            expanded ?
                                <> <FaChevronUp />  Show Less </>
                                :
                                <> <FaChevronDown /> Show All ({items.length}) </>
                        }

                    </button>
                )
            }
        </div>
    );
};

export default React.memo(OrderItems);