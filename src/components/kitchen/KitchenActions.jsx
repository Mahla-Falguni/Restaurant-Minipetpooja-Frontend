import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import {
    acceptKitchenOrder,
    preparingKitchenOrder,
    readyKitchenOrder,
    serveKitchenOrder
} from "../../redux/kitchen/kitchenSlice";
import RejectOrderModal from "./RejectOrderModel";
import LoadingButton from "../common/LoadingButton";

const KitchenActions = ({ order }) => {

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [rejectModal, setRejectModal] = useState(false);
    const handleAction = async (action) => {

        try {
            setLoading(true);
            switch (action) {
                case "accept":
                    await dispatch(
                        acceptKitchenOrder(order._id)
                    ).unwrap();

                    break;

                case "preparing":
                    await dispatch(
                        preparingKitchenOrder(order._id)
                    ).unwrap();

                    break;

                case "ready":
                    await dispatch(
                        readyKitchenOrder(order._id)
                    ).unwrap();

                    break;

                case "served":
                    await dispatch(
                        serveKitchenOrder(order._id)
                    ).unwrap();

                    break;

                default:
                    break;
            }
            toast.success("Order updated successfully");
        }

        catch (error) {
            // ❌ Error Toast
            toast.error(error?.message || "Something went wrong");
        }

        finally { setLoading(false); }
    };

    return (
        <div className="  mt-5  border-t  pt-4  flex  flex-wrap  gap-2" >
            {
                order.order_status === "Pending"
                &&
                <LoadingButton
                    disabled={loading}
                    onClick={() =>
                        handleAction("accept")
                    }

                    className=" flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-semibold transition disabled:opacity-50"  >

                    Accept Order

                </LoadingButton>
            }

            <LoadingButton
                onClick={() =>
                    setRejectModal(true)
                }

                className=" bg-red-600 hover:bg-red-700 text-white px-4  py-2  rounded-lg"   >
                Reject

            </LoadingButton>

            {
                order.order_status === "Accepted"
                &&
                <LoadingButton
                    disabled={loading}
                    onClick={() =>
                        handleAction("preparing")
                    }

                    className=" flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-2 font-semibold transition disabled:opacity-50"  >

                    Start Preparing

                </LoadingButton>
            }

            {
                order.order_status === "Preparing"
                &&
                <LoadingButton
                    disabled={loading}
                    onClick={() => handleAction("ready")}

                    className=" flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 font-semibold transition disabled:opacity-50"  >

                    Mark Ready

                </LoadingButton>
            }

            <RejectOrderModal
                order={order}
                open={rejectModal}
                onClose={() => setRejectModal(false)}
            />

            {
                order.order_status === "Ready"
                &&
                <LoadingButton
                    disabled={loading}
                    onClick={() =>
                        handleAction("served")}

                    className=" flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 font-semibold transition  disabled:opacity-50"  >

                    Mark Served

                </LoadingButton>
            }

            {
                order.order_status === "Served"
                &&
                <div
                    className=" w-full py-2 rounded-lg bg-green-100 text-green-700 text-center font-semibold" >

                    ✓ Order Served

                </div>
            }
        </div>
    );
};

export default KitchenActions;