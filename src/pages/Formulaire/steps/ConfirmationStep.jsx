import React from "react";
import { Alert, Button, Checkbox, Descriptions } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import dayjs from "dayjs";
import { soumettreDemande } from "../../../services/appServices";

function mapTypeEnergie(v) {
    switch (v) {
        case "ELECTRICITE":
            return "Électricité";
        case "GAZ":
            return "Gaz";
        case "DUAL":
            return "Dual (Électricité + Gaz)";
        default:
            return v || "";
    }
}

function mapPreference(v) {
    switch (v) {
        case "PRIX":
            return "Prix";
        case "STABILITE":
            return "Stabilité";
        case "ENERGIE_VERTE":
            return "Énergie verte";
        case "INDIFFERENT":
            return "Indifférent";
        default:
            return v || "";
    }
}

function ConfirmationStep({infosPerso = {}, infosFourniture = {}, selectedOffre = null, resetSignal, onSubmitted}) {
    const [consentRGPD, setConsentRGPD] = React.useState(false);
    const [consentCGV, setConsentCGV] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState(null);
    const [submitted, setSubmitted] = React.useState(false);

    const abortRef = React.useRef(null);

    const lastResetRef = React.useRef(resetSignal);

    React.useEffect(() => {
        if (lastResetRef.current !== resetSignal) {
            setConsentRGPD(false);
            setConsentCGV(false);
            setLoading(false);
            setErrorMsg(null);
            setSubmitted(false);
            lastResetRef.current = resetSignal;
        }
        return () => {
            if (abortRef.current) abortRef.current.abort();
        };
    }, [resetSignal]);

    const prenom = infosPerso?.prenom;

    const handleSubmit = async () => {
        setErrorMsg(null);

        if (!consentRGPD || !consentCGV) {
            setErrorMsg("Vous devez accepter les deux consentements pour poursuivre.");
            return;
        }

        const payload = {
            typeDemande: "souscription",
            informationsPersonnelles: {
                referenceClient: infosPerso?.numeroCNI,
                civilite: infosPerso?.civilite,
                prenom: infosPerso?.prenom,
                nom: infosPerso?.nom,
                email: infosPerso?.email,
                telephone: infosPerso?.telephone,
            },
            informationsFourniture: {
                voie: infosFourniture?.voie,
                codePostal: infosFourniture?.codePostal,
                ville: infosFourniture?.ville,
                typeEnergie: infosFourniture?.typeEnergie,
                dateMiseEnService: dayjs(infosFourniture?.dateMiseEnService).format("DD-MM-YYYY"),
                preferenceOffre: infosFourniture?.preferenceOffre,
                offre: selectedOffre.id,
            },
            consentementClient: Boolean(consentRGPD && consentCGV),
        };

        try {
            setLoading(true);
            if (abortRef.current) abortRef.current.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            await soumettreDemande(payload, controller.signal);

            setSubmitted(true);
            if (typeof onSubmitted === "function") onSubmitted(true);
        } catch (e) {
            if (e.name === "CanceledError" || e.name === "AbortError") return;
            console.error(e);
            setErrorMsg("Une erreur est survenue lors de la soumission de votre demande. Merci de réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="success-step">
                <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 72, marginBottom: 30 }} />
                <h3>Merci {prenom || ""}</h3>
                <div className="success-text">
                    Votre demande a bien été envoyée. Un e‑mail vous a été adressé afin de procéder à la
                    signature de votre contrat. Pensez à vérifier vos courriers indésirables. Notre équipe
                    reste à votre disposition pour toute question.
                </div>
            </div>
        );
    }

    return (
        <div className="confirmation-step">
            <p className="description-step">Vérifiez votre demande.<br/>Merci de relire attentivement le récapitulatif ci‑dessous avant de soumettre votre demande.</p>
            <div className="recapitulatif">
                <Descriptions title="Récapitulatif de vos informations" className="recapitulatif-table" bordered column={1}>
                    <Descriptions.Item label="Civilité">{infosPerso?.civilite}</Descriptions.Item>
                    <Descriptions.Item label="Prénom">{infosPerso?.prenom}</Descriptions.Item>
                    <Descriptions.Item label="Nom">{infosPerso?.nom}</Descriptions.Item>
                    <Descriptions.Item label="E‑mail">{infosPerso?.email}</Descriptions.Item>
                    <Descriptions.Item label="Téléphone">{infosPerso?.telephone}</Descriptions.Item>
                    <Descriptions.Item label="Référence client (CNI)">{infosPerso?.numeroCNI}</Descriptions.Item>

                    <Descriptions.Item label="Voie">{infosFourniture?.voie}</Descriptions.Item>
                    <Descriptions.Item label="Code postal">{infosFourniture?.codePostal}</Descriptions.Item>
                    <Descriptions.Item label="Ville">{infosFourniture?.ville}</Descriptions.Item>
                    <Descriptions.Item label="Type d’énergie">{mapTypeEnergie(infosFourniture?.typeEnergie)}</Descriptions.Item>
                    <Descriptions.Item label="Date de mise en service">{dayjs(infosFourniture?.dateMiseEnService).format("DD-MM-YYYY")}</Descriptions.Item>
                    <Descriptions.Item label="Préférence d’offre">{mapPreference(infosFourniture?.preferenceOffre)}</Descriptions.Item>
                    <Descriptions.Item label="Offre choisie">
                        <div>
                            <div>
                                {selectedOffre.libelle} — {selectedOffre.prix.toFixed(2)} €
                            </div>
                            <div>{selectedOffre.description}</div>
                        </div>
                    </Descriptions.Item>
                </Descriptions>
            </div>

            <div className="consentement">
                <Checkbox checked={consentRGPD} onChange={(e) => setConsentRGPD(e.target.checked)}>
                    J’accepte que mes données personnelles soient traitées par VERDISIA aux fins de gestion de
                    ma demande.
                </Checkbox>
                <Checkbox checked={consentCGV} onChange={(e) => setConsentCGV(e.target.checked)}>
                    J’ai lu et j’accepte les <strong>Conditions Générales de Vente</strong> de VERDISIA et je confirme l’exactitude des informations renseignées.
                </Checkbox>
            </div>

            {errorMsg && (
                <Alert type="error" showIcon description={errorMsg} />
            )}

            <Button type="primary" htmlType="submit" onClick={handleSubmit} loading={loading}>
                Soumettre ma demande
            </Button>
        </div>
    );
}

export default ConfirmationStep;
