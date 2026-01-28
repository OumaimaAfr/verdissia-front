import React from 'react';
import {Button, Steps} from 'antd';
import { LeftOutlined, ReloadOutlined } from '@ant-design/icons';
import InfosPersoStep from "./steps/InfosPersoStep.jsx";
import InfosFournitureStep from "./steps/InfosFournitureStep.jsx";
import OffresStep from "./steps/OffresStep.jsx";
import ConfirmationStep from "./steps/ConfirmationStep.jsx";
import { AuthTokenContext, AuthTokenProvider } from "../../context/AuthTokenContext.jsx";

function FormulaireInner(){
    const [current, setCurrent] = React.useState(0);
    const [resetCounter, setResetCounter] = React.useState(0);
    const [infosPersoDetails, setInfosPersoDetails] = React.useState(null);
    const [infosFournitureDetails, setinfosFournitureDetails] = React.useState(null);
    const [offres, setOffres] = React.useState(null);
    const [selectedOffre, setSelectedOffre] = React.useState(null);
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    const { refreshToken } = React.useContext(AuthTokenContext);

    const topRef = React.useRef(null);

    const scrollToTop = React.useCallback((opts = {}) => {
        const { offset = 0, smooth = true } = opts;

        if (topRef.current) {
            const elementTop = topRef.current.getBoundingClientRect().top + window.pageYOffset;
            const target = Math.max(0, elementTop - offset - 90);
            window.scrollTo({ top: target, behavior: smooth ? 'smooth' : 'auto' });
        } else {
            window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
        }
    }, []);

    React.useEffect(() => {
        scrollToTop({ offset: 0, smooth: true });
    }, [current, isSubmitted, scrollToTop]);

    const onFinishInfosPersoStep = (values) => {
        setInfosPersoDetails(values);
        setCurrent(1);
    };

    const onFinishInfosFournitureStep = (values, offresArray) => {
        setinfosFournitureDetails(values);
        setOffres(offresArray || []);
        setCurrent(2);
    };

    const onValidateOffres = (offre) => {
        setSelectedOffre(offre);
        setCurrent(3);
    };

    const steps = [
        <InfosPersoStep onFinish={onFinishInfosPersoStep} initialValues={infosPersoDetails} resetSignal={resetCounter}/>,
        <InfosFournitureStep onFinish={onFinishInfosFournitureStep} initialValues={infosFournitureDetails} resetSignal={resetCounter}/>,
        <OffresStep offres={offres || []} onFinish={onValidateOffres} initialValues={{ selectedId: selectedOffre?.id }} resetSignal={resetCounter}/>,
        <ConfirmationStep infosPerso={infosPersoDetails} infosFourniture={infosFournitureDetails} selectedOffre={selectedOffre} resetSignal={resetCounter} onSubmitted={(ok) => { if (ok) setIsSubmitted(true); }}/>
    ];

    const isStepDisabled = (step) => {
        switch (step) {
            case 0:
                return false;
            case 1:
                return infosPersoDetails === null;
            case 2:
                return (
                    infosPersoDetails === null ||
                    infosFournitureDetails === null ||
                    !Array.isArray(offres) ||
                    offres.length === 0
                );
            case 3:
                return (
                    infosPersoDetails === null ||
                    infosFournitureDetails === null ||
                    selectedOffre === null
                );
            default:
                return true;
        }
    };

    const handleBack = () => {
        setCurrent(current - 1);
    };

    const handleResetAll = () => {
        setInfosPersoDetails(null);
        setinfosFournitureDetails(null);
        setOffres(null);
        setSelectedOffre(null);
        setCurrent(0);
        setResetCounter((n) => n + 1);
        setIsSubmitted(false);
        refreshToken();
        scrollToTop({ offset: 0, smooth: true });
    };

    return (
        <section className="form-container" ref={topRef}>
            <div className="form">
                <div className="form-header-buttons">
                    <div className="left-actions">
                        {current >= 1 && !isSubmitted && (
                            <Button type="primary" ghost icon={<LeftOutlined />} onClick={handleBack}>
                                Retour
                            </Button>
                        )}
                    </div>
                    <div className="right-actions">
                        {!isSubmitted && (
                            <Button type="default" danger icon={<ReloadOutlined />} onClick={handleResetAll}>
                                Réinitialiser
                            </Button>
                        )}
                    </div>
                </div>
                {!isSubmitted && <h2 className="form-title">Souscrivez votre offre d'électricité en 5 min avec VERDISSIA</h2>}
                {!isSubmitted && <Steps current={current} onChange={setCurrent}
                       items={[
                           {
                               title: 'Informations personnelles',
                               disabled: isStepDisabled(0)
                           },
                           {
                               title: 'Informations de fourniture',
                               disabled: isStepDisabled(1)
                           },
                           {
                               title: 'Offres',
                               disabled: isStepDisabled(2)
                           },
                           {
                               title: 'Confirmation',
                               disabled: isStepDisabled(3)
                           }
                       ]}
                />}
                {steps[current]}
            </div>
        </section>
    );
}


export default function Formulaire() {
    return (
        <AuthTokenProvider>
            <FormulaireInner />
        </AuthTokenProvider>
    );
}
