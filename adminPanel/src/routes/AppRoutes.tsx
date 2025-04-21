import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Profile from "../pages/Profile";
import OverView from "../pages/OverView";

function appRoutes() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/Profile' element={<Profile />} />
            <Route path='/OverView' element={<OverView />} />
        </Routes>
    );
}

export default appRoutes;
