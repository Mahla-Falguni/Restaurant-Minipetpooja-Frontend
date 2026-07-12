import CustomerLayout from "../../layouts/CustomerLayout";

const MenuItemDetails = () => {
  return (
    <CustomerLayout>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
          className=" h-96 w-full object-cover"
        />

        <div className="p-6">

          <h1 className="text-4xl font-bold">
            Veg Burger
          </h1>

          <p className="text-gray-500 mt-3">
            Premium burger with cheese
            and vegetables.
          </p>

          <h2 className=" text-3xl font-bold text-orange-500 mt-4"  >
            ₹199
          </h2>

          <button className=" mt-5 bg-orange-500 text-white px-8 py-3 rounded-xl" >
            Add To Cart
          </button>

        </div>

      </div>

    </CustomerLayout>
  );
};

export default MenuItemDetails;