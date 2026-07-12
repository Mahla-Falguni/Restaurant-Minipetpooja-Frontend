import React from "react";

const StatCard = ({
    title,
    value,
    color = "orange",
    icon }) => {

    return (

        <div
            className=" bg-white rounded-xl shadow-md p-5 border-l-4 transition hover:shadow-xl"
            style={{
                borderColor: color
            }}
        >

            <div className=" flex justify-between items-center" >

                <div>
                    <p className=" text-gray-500 text-sm" >
                        {title}
                    </p>

                    <h2 className=" text-3xl font-bold mt-2" >
                        {value}
                    </h2>

                </div>

                <div className="text-3xl" >
                    {icon}
                </div>

            </div>
        </div>
    );
};

export default StatCard;