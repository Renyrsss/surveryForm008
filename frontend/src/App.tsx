import { Route, Routes } from "react-router-dom";
import SurveyPage from "./pages/SurveyPage";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Analytics from "./pages/admin/Analytics";
import Comments from "./pages/admin/Comments";
import Settings from "./pages/admin/Settings";

function App() {
    return (
        <Routes>
            <Route path="/" element={<SurveyPage />} />
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="comments" element={<Comments />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}

export default App;
