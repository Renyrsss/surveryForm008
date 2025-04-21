import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import Sidebar from "./components/Sidebar";

function App() {
    return (
        <div className=' flex flex-col h-[full]'>
            <div className='flex h-full'>
                <Sidebar />
                <AppRoutes />
            </div>
        </div>
    );
}

export default App;
