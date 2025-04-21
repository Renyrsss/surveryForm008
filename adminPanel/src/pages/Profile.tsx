import React, { useEffect } from "react";

import YerOrNoComp from "../components/YerOrNoComp";
import getData from "../service/service";

function Profile() {
    useEffect(() => {
        getData();
    }, []);
    return (
        <div className='w-full bg-gray-50'>
            <YerOrNoComp />
        </div>
    );
}

export default Profile;
