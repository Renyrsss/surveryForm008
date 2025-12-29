import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <div className='bg-blue-950  basis-[20%] min-h-screen '>
            <ul className='flex flex-col py-[10px] px-[15px] text-white sticky top-0'>
                <NavLink
                    to={"/"}
                    className={({ isActive }) =>
                        `px-4 py-2 rounded transition duration-200   ${
                            isActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 hover:text-blue-600"
                        }`
                    }>
                    Главная
                </NavLink>
                <NavLink
                    to={"/OverView"}
                    className={({ isActive }) =>
                        `px-4 py-2 rounded transition duration-200 sticky ${
                            isActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 hover:text-blue-600"
                        }`
                    }>
                    Общий график
                </NavLink>
                <NavLink
                    to={"/Profile"}
                    className={({ isActive }) =>
                        `px-4 py-2 rounded transition duration-200 sticky ${
                            isActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 hover:text-blue-600"
                        }`
                    }>
                    Профиль
                </NavLink>
                <NavLink
                    to={"/comments"}
                    className={({ isActive }) =>
                        `px-4 py-2 rounded transition duration-200 sticky ${
                            isActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 hover:text-blue-600"
                        }`
                    }>
                    Комментарий
                </NavLink>
            </ul>
        </div>
    );
}

export default Sidebar;
