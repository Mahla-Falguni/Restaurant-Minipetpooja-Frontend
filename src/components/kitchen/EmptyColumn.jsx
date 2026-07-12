import React from "react";

const EmptyColumn = ({ title }) => {

    return (
        <div className="flex flex-col items-center justify-center h-40 text-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50"   >

            <div className="text-5xl mb-2">     🍽️ </div>

            <h3 className="   text-gray-500   font-semibold" >
                No {title} Orders
            </h3>

            <p className="  text-sm  text-gray-400  mt-1" >
                Waiting for new orders...
            </p>
        </div>
    );
};

export default EmptyColumn;