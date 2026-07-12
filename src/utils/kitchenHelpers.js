const getStatusColor = (status) => {

    switch (status) {

        case "Pending":
            return {
                border: "border-l-yellow-500",
                bg: "bg-yellow-50",
                badge: "bg-yellow-500"
            };

        case "Accepted":
            return {
                border: "border-l-blue-500",
                bg: "bg-blue-50",
                badge: "bg-blue-500"
            };

        case "Preparing":
            return {
                border: "border-l-orange-500",
                bg: "bg-orange-50",
                badge: "bg-orange-500"
            };

        case "Ready":
            return {
                border: "border-l-green-500",
                bg: "bg-green-50",
                badge: "bg-green-500"
            };

        case "Served":
            return {
                border: "border-l-gray-500",
                bg: "bg-gray-50",
                badge: "bg-gray-500"
            };

        case "Rejected":
            return {
                border: "border-l-red-600",
                bg: "bg-red-50",
                badge: "bg-red-600"
            };

        default:
            return {
                border: "border-l-gray-300",
                bg: "bg-white",
                badge: "bg-gray-400"
            };
    }

};

export default getStatusColor;