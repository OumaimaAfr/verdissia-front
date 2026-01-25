import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { Alert, Button, Descriptions, Radio, Typography, Spin } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import dayjs from "dayjs";
import { initSignature, submitSignature } from "../../services/signatureService";

const { Title, Paragraph, Text } = Typography;

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

function formatDateFR(value) {
    if (!value) return "";
    const d = dayjs(value);
    return d.isValid() ? d.format("DD/MM/YYYY") : String(value);
}

function SignaturePad({ onClear }) {
    const canvasRef = React.useRef(null);
    const drawingRef = React.useRef(false);
    const lastPosRef = React.useRef({ x: 0, y: 0 });

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            const width = parent.clientWidth;
            const height = 200;
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            const ctx = canvas.getContext("2d");
            ctx.scale(ratio, ratio);
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.strokeStyle = "#333";
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, width, height);
        };

        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    const getPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        if (e.touches && e.touches[0]) {
            return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
        }
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleStart = (e) => {
        e.preventDefault();
        drawingRef.current = true;
        lastPosRef.current = getPos(e);
    };
    const handleMove = (e) => {
        if (!drawingRef.current) return;
        e.preventDefault();
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastPosRef.current = pos;
    };
    const handleEnd = (e) => {
        e.preventDefault();
        drawingRef.current = false;
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        onClear?.();
    };

    return (
        <div className="signature-canvas-container">
            <canvas
                ref={canvasRef}
                className="sig-canvas"
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
            />
            <div className="signature-actions">
                <Button onClick={clearCanvas}>Effacer la signature</Button>
            </div>
        </div>
    );
}

function SignaturePage() {
    const query = useQuery();
    const token = query.get("token");

    const [loading, setLoading] = React.useState(true);
    const [errorMsg, setErrorMsg] = React.useState(null);
    const [submitted, setSubmitted] = React.useState(false);

    const [prenom, setPrenom] = React.useState("");
    const [nom, setNom] = React.useState("");
    const [dateMiseEnService, setDateMiseEnService] = React.useState("");
    const [offre, setOffre] = React.useState(null);
    const [adresse, setAdresse] = React.useState("");
    const [idDemande, setIdDemande] = React.useState(null);

    const [statutSignature, setStatutSignature] = React.useState("SIGNE");

    const abortRef = React.useRef(null);

    if (!token) {
        return <Navigate to="/error" replace />;
    }

    React.useEffect(() => {
        const controller = new AbortController();
        abortRef.current = controller;

        (async () => {
            try {
                setLoading(true);
                setErrorMsg(null);
                const data = await initSignature(token, controller.signal);

                if (!data || data.status !== "OK") {
                    setErrorMsg(data?.message || "Lien de signature invalide ou expiré.");
                    return;
                }

                setPrenom(data.prenom || "");
                setNom(data.nom || "");
                setDateMiseEnService(data.dateMiseEnService || "");
                setOffre(data.offre || null);
                setAdresse(data.adresse || "");
                setIdDemande(data.idDemande ?? null);
            } catch (e) {
                if (e.name === "AbortError" || e.name === "CanceledError") return;
                console.error(e);
                setErrorMsg("Une erreur est survenue lors du chargement de la page de signature.");
            } finally {
                setLoading(false);
            }
        })();
        return () => controller.abort();
    }, [token]);

    const handleSubmit = async () => {
        if (!idDemande) {
            setErrorMsg("Identifiant de demande introuvable. Merci de réessayer via le lien reçu.");
            return;
        }
        try {
            setLoading(true);
            setErrorMsg(null);
            const controller = new AbortController();
            abortRef.current = controller;

            await submitSignature({ idDemande, statutSignature }, controller.signal);

            setSubmitted(true);
        } catch (e) {
            if (e.name === "AbortError" || e.name === "CanceledError") return;
            console.error(e);
            setErrorMsg("La validation de votre signature a échoué. Merci de réessayer.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !submitted && !errorMsg) {
        return (
            <div className="signature-page">
                <div className="signature-card">
                    <Spin />
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="signature-page">
                <div className="signature-success">
                    <CheckCircleTwoTone twoToneColor="#52c41a" className="success-icon" />
                    <Title level={3} className="success-title">
                        Merci {prenom || ""} !
                    </Title>
                    <Paragraph className="success-text">
                        Votre signature a bien été enregistrée. Nous vous remercions pour votre confiance.
                        Un e‑mail de confirmation vous a été adressé. Vous pouvez fermer cette page en toute sécurité.
                    </Paragraph>
                </div>
            </div>
        );
    }

    return (
        <div className="signature-page">
            <div className="signature-carte">
                <h3 className="signature-titre">Signature de votre contrat</h3>

                {errorMsg ? (
                    <Alert type="error" showIcon className="signature-alert" description={errorMsg} />
                ) : (
                    <>
                        <Paragraph className="signature-intro">
                            Bonjour <Text strong>{prenom} {nom}</Text>,<br />
                            Votre mise en service est prévue le <Text strong>{formatDateFR(dateMiseEnService)}</Text> à l’adresse :
                            <br />
                            <Text strong>{adresse}</Text>.
                            <br />
                            Offre retenue : <Text strong>{offre?.libelle}</Text> — {Number(offre?.prix ?? 0).toFixed(2)} €.
                        </Paragraph>

                        <Descriptions
                            className="signature-descriptions"
                            bordered
                            column={1}
                            size="small"
                            labelStyle={{ width: 220 }}
                        >
                            <Descriptions.Item label="Prénom">{prenom}</Descriptions.Item>
                            <Descriptions.Item label="Nom">{nom}</Descriptions.Item>
                            <Descriptions.Item label="Date de mise en service">{formatDateFR(dateMiseEnService)}</Descriptions.Item>
                            <Descriptions.Item label="Adresse">{adresse}</Descriptions.Item>
                            <Descriptions.Item label="Offre">
                                {offre?.libelle} — {Number(offre?.prix ?? 0).toFixed(2)} €
                            </Descriptions.Item>
                            <Descriptions.Item label="Identifiant de demande">{idDemande ?? "-"}</Descriptions.Item>
                        </Descriptions>

                        <div className="signature-block">
                            <div className="signature-block-header">
                                <Text>Veuillez signer ci‑dessous pour confirmer votre accord.</Text>
                            </div>
                            <SignaturePad />
                        </div>

                        <div className="signature-status">
                            <Radio.Group
                                value={statutSignature}
                                onChange={(e) => setStatutSignature(e.target.value)}
                            >
                                <Radio value="SIGNE">Je signe et j’accepte</Radio>
                                <Radio value="REFUSE">Je refuse</Radio>
                            </Radio.Group>
                        </div>

                        {errorMsg && (
                            <Alert type="error" showIcon className="signature-alert" description={errorMsg} />
                        )}

                        <div className="signature-actions-row">
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleSubmit}
                                loading={loading}
                            >
                                {statutSignature === "REFUSE" ? "Refuser" : "Signer et finaliser"}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default SignaturePage;
