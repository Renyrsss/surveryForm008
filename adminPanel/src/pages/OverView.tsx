import { useEffect } from "react";
import MonthBtn from "../components/MonthBtn";
import OverViewCharts from "../components/OverViewCharts";
import getData from "../service/service";

function OverView() {
    useEffect(() => {
        getData();
    }, []);
    return (
        <div className='p-[20px] bg-gray-50 w-full  '>
            <MonthBtn />
            <OverViewCharts />
        </div>
    );
}

export default OverView;
