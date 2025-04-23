import { NavLink } from "react-router-dom";
import { Header } from "antd/es/layout/layout";
import { theme } from "antd";

function header() {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <div className='container mx-auto'>
            <Header style={{ padding: 0, background: colorBgContainer }}>
                <ul className='flex gap-[40px] '>
                    header
                    <li>
                        <NavLink to={"/"}>home</NavLink>
                    </li>
                    <li>
                        <NavLink to={"/profile"}>prifile</NavLink>
                    </li>
                    {/* <DatePicker />; */}
                </ul>
            </Header>
        </div>
    );
}

export default header;
