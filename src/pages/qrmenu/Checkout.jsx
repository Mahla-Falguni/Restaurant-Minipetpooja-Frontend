const Checkout = () => {
  return (
    <div className="max-w-4xl mx-auto p-5">

      <div className="bg-white p-8 rounded-xl shadow">

        <h1 className="text-3xl font-bold mb-6">
          Checkout
        </h1>

        <input placeholder="Customer Name"
          className=" w-full border p-3 rounded-lg mb-4"
        />

        <input placeholder="Mobile Number"
          className="  w-ful  border  p-3  rounded-lg  mb-4"
        />

        <button className=" bg-orange-500 text-white px-6 py-3 rounded-lg" >
          Place Order
        </button>

      </div>

    </div>
  );
};

export default Checkout;