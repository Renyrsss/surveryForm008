import { Footer } from "antd/es/layout/layout";

function footer() {
    return (
        <Footer style={{ textAlign: "center" }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
    );
}

export default footer;
