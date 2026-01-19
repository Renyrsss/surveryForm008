import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, BarChart3, MessageSquare, Settings, Heart, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import authStore from "../stores/authStore";

const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: "Дашборд", end: true },
    { to: "/admin/analytics", icon: BarChart3, label: "Аналитика" },
    { to: "/admin/comments", icon: MessageSquare, label: "Комментарии" },
    { to: "/admin/settings", icon: Settings, label: "Настройки" },
];

const AdminLayout = observer(() => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        authStore.logout();
        navigate("/admin/login");
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-slate-900">NNMC Admin</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 hover:bg-slate-100 rounded-lg"
                >
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transform transition-transform lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-200">
                            <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-900">NNMC</h1>
                            <p className="text-xs text-slate-500">Панель управления</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                        isActive
                                            ? "bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-lg shadow-sky-200"
                                            : "text-slate-600 hover:bg-slate-100"
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                    {authStore.user && (
                        <div className="bg-slate-100 rounded-xl p-3">
                            <p className="text-xs text-slate-500">Вы вошли как</p>
                            <p className="text-sm font-medium text-slate-700 truncate">
                                {authStore.user.username}
                            </p>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Выйти
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:pl-64 pt-16 lg:pt-0">
                <div className="p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
});

export default AdminLayout;
