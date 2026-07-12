import { FaTrash } from "react-icons/fa";

const CartDrawer = ({ cart, total, onRemove, }) => {
  return (
    <div className=" fixed right-0 top-0 h-screen w-96 bg-white shadow-2xl p-5 z-50"  >

      <h2 className=" text-2xl font-bold mb-5" >
        Cart
      </h2>

      {cart.map((item) => (
        <div key={item._id}
          className=" flex justify-between items-center border-b py-3" >

          <div>
            <h4 className="font-semibold"> {item.name} </h4>
            <p> ₹{item.price}</p>
          </div>

          <button onClick={() => onRemove(item._id)} >
            <FaTrash className="text-red-500" />
          </button>

        </div>
      ))}

      <div className="mt-5">

        <h3 className="font-bold text-xl">   Total ₹{total} </h3>

        <button className=" mt-4 w-full bg-orange-500 text-white py-3 rounded-xl" >
          Checkout
        </button>

      </div>

    </div>
  );
};

export default CartDrawer;