import { useState } from "react";

import "./App.css";
import "./i18n";
import Modal from "./Components/Modal";
import SurveyComponent from "./Components/Survey";
function App() {
    const [open, setIsOpen] = useState(true);

    return (
        <div className='flex flex-col'>
            {open ? <Modal isOpen={setIsOpen} /> : ""}
            <SurveyComponent />
        </div>
    );
}

export default App;
