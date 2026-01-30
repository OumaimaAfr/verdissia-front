import React from "react";
import {Button, Radio, Alert} from "antd";

function OffresStep({ offres = [], onFinish, initialValues, resetSignal }) {
    const [selectedId, setSelectedId] = React.useState(null);
    const [errorMsg, setErrorMsg] = React.useState(null);

    React.useEffect(() => {
        const fromInit = initialValues?.selectedId ?? null;
        if (!fromInit) {
            setSelectedId(null);
            setErrorMsg(null);
            return;
        }
        const exists = (offres || []).some((o) => o.id === fromInit);
        setSelectedId(exists ? fromInit : null);
        setErrorMsg(null);
    }, [offres, initialValues]);

    const onClickValidate = () => {
        const selected = offres.find((o) => o.id === selectedId);
        if (!selected) {
            setErrorMsg("Veuillez sélectionner une offre pour continuer.");
            return;
        }
        setErrorMsg(null);
        onFinish?.(selected);
    };

    return (
        <div className="offres-step">
            <p className="description-step">
                Veuillez sélectionner l’offre qui correspond le mieux à votre besoin. Les offres ci-dessous sont proposées en fonction de votre profil.
            </p>
            <Alert
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
                description="Choisissez une seule offre parmi celles proposées pour poursuivre votre souscription."
            />
            <div className="offres-list">
                {offres.map((offre) => {
                    const { id, libelle: titre, description, prix } = offre
                    const isSelected = selectedId === id;

                    const onRowClick = () => {
                        setSelectedId(id);
                        setErrorMsg(null);
                    };

                    return (
                        <div key={id} onClick={onRowClick}
                             style={{
                                 cursor: "pointer",
                                 userSelect: "none",
                             }}
                             className={`offre-row ${isSelected ? "selected" : ""}`}>
                            <div className="offre-content">
                                <img className="offre-picto" src="/assets/pictos/offre1.png" alt="picto"/>
                                <div className="offre-infos">
                                    <div className="offre-titre-header">
                                        <div className="offre-titre">{titre}</div>
                                    </div>
                                    <div className="offre-description">{description}</div>
                                </div>
                            </div>
                            <div className="offre-prix-bloc">
                                <div className="offre-prix">{prix.toFixed(2)} € / Mois</div>
                                <Radio
                                    checked={isSelected}
                                    onChange={() => {
                                        setSelectedId(id);
                                        setErrorMsg(null);
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            {errorMsg && <Alert type="error" description={errorMsg} showIcon />}
            <Button type="primary" htmlType="submit" onClick={onClickValidate}>
                Valider mes offres
            </Button>
        </div>
    );
}

export default OffresStep;
