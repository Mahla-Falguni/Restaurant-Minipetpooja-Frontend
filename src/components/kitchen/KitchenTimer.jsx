import { useEffect, useMemo, useState } from "react";

import {
    FaClock,
    FaCheckCircle,
    FaExclamationTriangle,
    FaFire
} from "react-icons/fa";

const KitchenTimer = ({
    createdAt,
    estimatedTime = 20 }) => {

    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const updateTimer = () => {
            const diff = Math.floor(
                (Date.now() -
                    new Date(createdAt).getTime()) / 1000
            );

            setSeconds(diff);
        };

        updateTimer();

        const interval = setInterval(
            updateTimer,
            1000
        );

        return () => clearInterval(interval);

    }, [createdAt]);

    const minutes = Math.floor(seconds / 60);
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const secs = seconds % 60;
    const formattedTime =

        `${hrs.toString().padStart(2, "0")}:` +
        `${mins.toString().padStart(2, "0")}:` +
        `${secs.toString().padStart(2, "0")}`;

    const status = useMemo(() => {

        if (minutes < estimatedTime * 0.5) {
            return {
                label: "On Time",
                bg: "bg-green-100",
                text: "text-green-700",
                border: "border-green-500",
                icon: <FaCheckCircle />
            };
        }

        if (minutes < estimatedTime) {
            return {
                label: "Warning",
                bg: "bg-yellow-100",
                text: "text-yellow-700",
                border: "border-yellow-500",
                icon: <FaExclamationTriangle />
            };
        }

        return {

            label: "Delayed",
            bg: "bg-red-100",
            text: "text-red-700",
            border: "border-red-500",
            icon: <FaFire />
        };

    }, [minutes, estimatedTime]);

    return (
        <div
            className={`
                flex
                items-center
                justify-between
                p-3
                rounded-lg
                border-l-4
                ${status.bg}
                ${status.border}
            `} >

            <div className=" flex items-center gap-2"   >

                <FaClock className={status.text} />

                <div>
                    <p className={`  text-sm  font-semibold  ${status.text}`} >
                        Cooking Time
                    </p>

                    <h3 className=" text-lg font-bold" >
                        {formattedTime}
                    </h3>
                </div>

            </div>

            <div
                className={`
                flex
                items-center
                gap-2
                font-semibold
                ${status.text}
            `} >

                {status.icon}
                {status.label}

            </div>

        </div>
    );
};

export default KitchenTimer;