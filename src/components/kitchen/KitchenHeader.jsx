import React, { useEffect, useState } from "react";

import { FaExpand, FaCompress, FaVolumeUp, FaVolumeMute, FaClock, FaUtensils } from "react-icons/fa";

const KitchenHeader = () => {
    const [time, setTime] = useState(new Date());
    const [sound, setSound] = useState(true);
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);

    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setFullscreen(true);
        }

        else {
            document.exitFullscreen();
            setFullscreen(false);
        }
    };

    return (
        <header className=" bg-white shadow-md  px-6  py-4  flex  flex-wrap  items-center  justify-between" >

            {/* Left */}

            <div>
                <h1 className=" text-3xl  font-bold  text-orange-600  flex  items-center  gap-3"  >
                    <FaUtensils />
                    Kitchen Display System
                </h1>

                <p className="  text-gray-500" >
                    Live Kitchen Dashboard
                </p>

            </div>

            {/* Center */}

            <div className="text-center"  >

                <div className="   flex   items-center  justify-center  gap-2  text-lg  font-semibold" >
                    <FaClock />
                    {time.toLocaleTimeString()}
                </div>

                <p className="  text-gray-500" >
                    {time.toDateString()}
                </p>

            </div>

            {/* Right */}

            <div className=" flex gap-3"  >

                <button onClick={() => setSound(!sound)}
                    className=" p-3 rounded-lg bg-gray-100 hover:bg-orange-100" >

                    {
                        sound ?
                            <FaVolumeUp />
                            :
                            <FaVolumeMute />
                    }
                </button>

                <button onClick={toggleFullscreen}
                    className=" p-3 rounded-lg bg-gray-100 hover:bg-orange-100"
                >

                    {
                        fullscreen ?
                            <FaCompress />
                            :
                            <FaExpand />
                    }
                </button>
            </div>
        </header>
    );
};

export default KitchenHeader;