import React from 'react';
import {Button, Steps} from 'antd';
import { LeftOutlined, ReloadOutlined } from '@ant-design/icons';
import InfosPersoStep from "./steps/InfosPersoStep.jsx"
import InfosFournitureStep from "./steps/InfosFournitureStep.jsx";
import ContratStep from "./steps/ContratStep.jsx";
import { AuthTokenContext, AuthTokenProvider } from "../../context/AuthTokenContext.jsx";

function FormulaireInner(){
    const [current, setCurrent] = React.useState(0);
    const [resetCounter, setResetCounter] = React.useState(0);
    const [infosPersoDetails, setInfosPersoDetails] = React.useState(null);
    const [infosFournitureDetails, setinfosFournitureDetails] = React.useState(null);

    const { refreshToken } = React.useContext(AuthTokenContext);

    React.useEffect(() => {
        refreshToken();
    }, [refreshToken]);

    const onFinishInfosPersoStep = (values) => {
        setInfosPersoDetails(values);
        setCurrent(1);
    };

    const onFinishInfosFournitureStep = (values) => {
        setinfosFournitureDetails(values);
        setCurrent(2);
    }

    const steps = [
        <InfosPersoStep onFinish={onFinishInfosPersoStep} initialValues={infosPersoDetails} resetSignal={resetCounter}/>,
        <InfosFournitureStep onFinish={onFinishInfosFournitureStep} initialValues={infosFournitureDetails} resetSignal={resetCounter}/>,
        <ContratStep />
    ]

    const isStepDisabled = (step) => {
        if (step === 0) {
            return false;
        }
        if (step === 1) {
            return infosPersoDetails === null;
        }
        if (step === 2) {
            return infosPersoDetails === null || infosFournitureDetails === null;
        }
    };

    const handleBack = () => {
        setCurrent(current - 1);
    };

    const handleResetAll = () => {
        setInfosPersoDetails(null);
        setinfosFournitureDetails(null);
        setCurrent(0);
        setResetCounter((n) => n + 1);
        refreshToken();
    };

    return (
        <section className="form-container">
            <div className="form">
                <div className="form-header-buttons">
                    <div className="left-actions">
                        {current >= 1 && (
                            <Button type="primary" ghost icon={<LeftOutlined />} onClick={handleBack}>
                                Retour
                            </Button>
                        )}
                    </div>
                    <div className="right-actions">
                        <Button type="default" danger icon={<ReloadOutlined />} onClick={handleResetAll}>
                            Réinitialiser
                        </Button>
                    </div>
                </div>
                <h2 className="form-title">Souscrivez votre offre d'électricité en 5 min avec VERDISIA</h2>
                <Steps current={current} onChange={setCurrent}
                       items={[
                           {
                               title: 'informations personnelles',
                               disabled: isStepDisabled(0)
                           },
                           {
                               title: 'informations de fourniture',
                               disabled: isStepDisabled(1)
                           },
                           {
                               title: 'Contrat',
                               disabled: isStepDisabled(2)
                           }
                       ]}
                />
                {steps[current]}
            </div>
        </section>
    )
}


export default function Formulaire() {
    return (
        <AuthTokenProvider>
            <FormulaireInner />
        </AuthTokenProvider>
    );
}
