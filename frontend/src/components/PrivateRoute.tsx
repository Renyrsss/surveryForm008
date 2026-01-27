import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import authStore from "../stores/authStore";

type Props = {
    children: React.ReactNode;
};

const PrivateRoute = observer(({ children }: Props) => {
    if (!authStore.isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
});

export default PrivateRoute;
