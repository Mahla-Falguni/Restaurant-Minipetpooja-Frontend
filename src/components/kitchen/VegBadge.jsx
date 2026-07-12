const VegBadge = ({ type }) => {

    const isVeg = type === "Veg";

    return (

        <div
            className={` w-5 h-5 rounded border-2 flex items-center justify-center
                ${isVeg ? "border-green-600" : "border-red-600"}
            `} >

            <div
                className={` w-2.5 h-2.5 rounded-full
                    ${isVeg ? "bg-green-600" : "bg-red-600"}
                `}
            />

        </div>

    );

};

export default VegBadge;