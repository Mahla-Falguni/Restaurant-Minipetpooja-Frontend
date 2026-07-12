const COLORS = {
    Mild: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hot: "bg-orange-100 text-orange-700",
    Extra_Hot: "bg-red-100 text-red-700"
};

const SpiceBadge = ({ level }) => {

    if (!level) return null;

    return (

        <span
            className={` px-2  py-1  rounded-full  text-xs  font-medium
                ${COLORS[level] || "bg-gray-100 text-gray-700"}
            `}  >

            🌶 {level.replace("_", " ")}
        </span>
    );

};

export default SpiceBadge;