import CustomerLayout from "../../layouts/CustomerLayout";

const TrackOrder = () => {
  return (
    <CustomerLayout>

      <div className="bg-white rounded-xl p-8 shadow">

        <h1 className=" text-3xl font-bold mb-8" >
          Track Order
        </h1>

        <div className="space-y-6">

          <div className="text-green-500">
            ✓ Order Received
          </div>

          <div className="text-green-500">
            ✓ Preparing Food
          </div>

          <div className="text-gray-400">
            Cooking
          </div>

          <div className="text-gray-400">
            Ready To Serve
          </div>

        </div>

      </div>

    </CustomerLayout>
  );
};

export default TrackOrder;