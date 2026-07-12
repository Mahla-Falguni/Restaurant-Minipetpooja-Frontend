import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className=" min-h-screen flex justify-center items-center" >

      <div className=" bg-white p-10 rounded-2xl shadow text-center" >

        <h1 className=" text-6xl text-green-500" >
          ✓
        </h1>

        <h2 className="  text-3xl  font-bold  mt-4" >
          Order Placed Successfully
        </h2>

        <Link to="/track-order"
          className=" inline-block mt-5 bg-orange-500 text-white px-6 py-3 rounded-xl" >
          Track Order
        </Link>

      </div>

    </div>
  );
};

export default OrderSuccess;