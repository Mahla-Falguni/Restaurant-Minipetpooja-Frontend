import { Link } from "react-router-dom";

const CustomerLayout = ({
  children,
}) => {
  return (
    <div className="bg-gray-100 min-h-screen">

      <div className=" bg-white shadow sticky top-0 z-50" >

        <div className=" max-w-7xl mx-auto px-5 py-4 flex justify-between" >

          <Link to="/menu-view" className=" text-2xl font-bold  text-orange-500" >
            Restaurant Menu
          </Link>

          <Link to="/cart" className=" bg-orange-500 text-white px-4 py-2 rounded-lg" >
            Cart
          </Link>

        </div>

      </div>

      <div className="max-w-7xl mx-auto p-5">
        {children}
      </div>

    </div>
  );
};

export default CustomerLayout;