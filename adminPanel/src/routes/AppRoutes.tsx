import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Profile from "../pages/Profile";
import OverView from "../pages/OverView";
import Comments from "../pages/Comments";

function appRoutes() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/Profile' element={<Profile />} />
            <Route path='/OverView' element={<OverView />} />
            <Route path='/comments' element={<Comments />} />
        </Routes>
    );
}

export default appRoutes;
