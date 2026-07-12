import { FaPlus } from "react-icons/fa";

const FoodCard = ({ item, onAdd }) => {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">

      <img
        src={item.image}
        alt={item.name}
        className="h-52 w-full object-cover"
      />

      <div className="p-4">

        <div className="flex justify-between items-start">

          <div>
            <h3 className="font-bold text-lg">
              {item.name}
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              {item.description}
            </p>
          </div>

          <span className="font-bold text-orange-500">
            ₹{item.price}
          </span>

        </div>

        <button
          onClick={() => onAdd(item)}
          className="  mt-4  w-full  bg-orange-500  text-white  py-2  rounded-lg  flex  justify-center  items-center  gap-2"
        >
          <FaPlus />
          Add To Cart
        </button>

      </div>

    </div>
  );
};

export default FoodCard;