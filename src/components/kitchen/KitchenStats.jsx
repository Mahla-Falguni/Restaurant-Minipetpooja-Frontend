import {
    FaClipboardList,
    FaFire,
    FaUtensils,
    FaCheckCircle,
    FaMoneyBillWave
}
    from "react-icons/fa";

import StatCard from "../cards/StatCard";

const KitchenStats = ({ dashboard }) => {

    return (
        <div
            className="  grid  grid-cols-1  md:grid-cols-2  xl:grid-cols-5  gap-5  px-6  mt-5" >

            <StatCard
                label="Pending"
                value={dashboard?.pending || 0}
                icon={FaClipboardList}
            />

            <StatCard
                label="Preparing"
                value={dashboard?.preparing || 0}
                icon={FaFire}
            />

            <StatCard
                label="Ready"
                value={dashboard?.ready || 0}
                icon={FaUtensils}
            />

            <StatCard
                label="Completed"
                value={dashboard?.completed || 0}
                icon={FaCheckCircle}
            />

            <StatCard
                label="Today's Orders"
                value={dashboard?.activeOrders || 0}
                icon={FaMoneyBillWave}
            />

        </div>
    );
};

export default KitchenStats;