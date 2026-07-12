import CustomerLayout from "../../layouts/CustomerLayout";

const CustomerMenu = () => {
  return (
    <CustomerLayout>

      <div className="sticky top-0 bg-white p-4 shadow z-50">

        <h1 className="text-3xl font-bold text-orange-500">
          Restaurant Menu
        </h1>

      </div>

      <div className="p-5">

        <div className="grid md:grid-cols-3 gap-5">

          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item}
              className=" bg-white rounded-xl overflow-hidden shadow"
            >

              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
                className=" h-52 w-full object-cover"
              />

              <div className="p-4">

                <h3 className="font-bold text-xl">
                  Veg Burger
                </h3>

                <p className="text-gray-500">
                  Delicious burger
                </p>

                <div className="flex justify-between mt-3">

                  <span className="font-bold">
                    ₹199
                  </span>

                  <button className=" bg-orange-500 text-white px-4 py-2 rounded"  >
                    Add
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </CustomerLayout>
  );
};

export default CustomerMenu;