import React, { useEffect } from "react";

import MyChartComponent from "../components/MyChartComponent";
import MonthBtn from "../components/MonthBtn";

import getData from "../service/service";
import YerOrNoComp from "../components/YerOrNoComp";

const home: React.FC = () => {
    useEffect(() => {
        getData();
    }, []);

    return (
        <div className='bg-gray-50 w-full'>
            <div className='p-[20px]'>
                <div>
                    <MonthBtn />
                </div>

                <div className='p-4 space-y-4'>
                    <MyChartComponent />
                    <YerOrNoComp />
                </div>
            </div>
        </div>
    );
};

export default home;
