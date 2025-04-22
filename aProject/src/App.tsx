import "./App.css";
import "./i18n";
import Modal from "./Components/Modal";
import SurveyComponent from "./Components/Survey";
import { observer } from "mobx-react-lite";
import Store from "./store/Store";

const App = observer(() => {
    return (
        <div className='flex flex-col'>
            {Store.isOpen ? <Modal /> : ""}
            <SurveyComponent />
        </div>
    );
});

export default App;
