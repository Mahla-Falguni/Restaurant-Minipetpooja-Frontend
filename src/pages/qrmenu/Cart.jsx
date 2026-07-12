import CustomerLayout from "../../layouts/CustomerLayout";

const Cart = () => {
  return (
    <CustomerLayout>

      <div className="max-w-4xl mx-auto p-5">

        <h1 className="text-3xl font-bold mb-5">
          Your Cart
        </h1>

        <div className="bg-white rounded-xl shadow p-5">

          <div className="flex justify-between">

            <span>Veg Burger x2</span>

            <span>₹398</span>

          </div>

          <hr className="my-5"/>

          <div className="flex justify-between">

            <strong>Total</strong>

            <strong>₹398</strong>

          </div>

          <button
            className="
            w-full
            bg-orange-500
            text-white
            py-3
            rounded-xl
            mt-5"
          >
            Proceed to Checkout
          </button>

        </div>

      </div>

    </CustomerLayout>
  );
};

export default Cart;