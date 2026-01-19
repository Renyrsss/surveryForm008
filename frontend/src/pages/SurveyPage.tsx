import { observer } from "mobx-react-lite";
import surveyStore from "../stores/surveyStore";
import PinGate from "../components/survey/PinGate";
import WelcomeModal from "../components/survey/WelcomeModal";
import SurveyForm from "../components/survey/SurveyForm";
import "../i18n";

const SurveyPage = observer(() => {
    if (!surveyStore.hasAccess) {
        return <PinGate />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
            {surveyStore.showWelcome && <WelcomeModal />}
            <SurveyForm />
        </div>
    );
});

export default SurveyPage;
