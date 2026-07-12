import { useState } from "react";
import { useDispatch } from "react-redux";

import { rejectKitchenOrder } from "../../redux/kitchen/kitchenSlice";

const REASONS = [
    "Out of Stock",
    "Kitchen Closed",
    "Ingredient Unavailable",
    "Equipment Issue",
    "Restaurant Busy",
    "Other"
];

const RejectOrderModal = ({
    order,
    open,
    onClose }) => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState("");
    const [customReason, setCustomReason] = useState("");

    if (!open) return null;
    const handleReject = async () => {
        const finalReason =
            reason === "Other"
                ? customReason
                : reason;

        if (!finalReason.trim()) {
            alert("Please select a reason.");
            return;
        }

        try {
            setLoading(true);
            await dispatch(
                rejectKitchenOrder({
                    orderId: order._id,
                    reason: finalReason
                })).unwrap();

            onClose();
        }

        catch (err) { console.log(err); }

        finally { setLoading(false); }

    };

    return (
        <div className=" fixed inset-0 bg-black/50 flex items-center justify-center z-50" >

            <div className=" bg-white rounded-xl shadow-xl w-[450px] p-6" >

                <h2 className="  text-xl  font-bold  mb-5" >
                    Reject Order
                </h2>

                <p className=" text-gray-500 mb-4" >
                    Order #
                    {order.order_number}
                </p>

                <div className="space-y-3">
                    {
                        REASONS.map((item) => (
                            <label
                                key={item}
                                className=" flex items-center gap-3"
                            >

                                <input
                                    type="radio"
                                    checked={reason === item}
                                    onChange={() =>
                                        setReason(item)}
                                />
                                {item}
                            </label>
                        ))
                    }

                </div>
                {
                    reason === "Other"
                    &&
                    <textarea className=" w-full mt-4 border rounded-lg p-3"

                        rows={3}
                        placeholder="Reason..."
                        value={customReason}
                        onChange={(e) =>
                            setCustomReason(
                                e.target.value
                            )
                        }
                    />
                }

                <div className=" flex justify-end gap-3 mt-6" >

                    <button
                        onClick={onClose}
                        className=" px-4 py-2 rounded-lg border"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}
                        onClick={handleReject}
                        className=" px-5 py-2 rounded-lg  bg-red-600  text-white  hover:bg-red-700"
                    >

                        {
                            loading
                                ?
                                "Rejecting..."
                                :
                                "Reject Order"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectOrderModal;