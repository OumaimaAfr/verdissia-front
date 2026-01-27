import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { Alert, Button, Descriptions, Radio, Typography, Spin } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import dayjs from "dayjs";
import { initSignature, submitSignature } from "../../services/signatureService";

const { Paragraph, Text } = Typography;

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

function formatDateFR(value) {
    if (!value) return "";
    const d = dayjs(value);
    return d.isValid() ? d.format("DD/MM/YYYY") : String(value);
}

function SignaturePad({ onChange, onClear }, ref) {
    const canvasRef = React.useRef(null);
    const drawingRef = React.useRef(false);
    const lastPosRef = React.useRef({ x: 0, y: 0 });
    const hasInkRef = React.useRef(false);
    const blankDataUrlRef = React.useRef(null);

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

            hasInkRef.current = false;
            blankDataUrlRef.current = canvas.toDataURL();
            onChange?.(false);
        };

        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, [onChange]);

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

        if (!hasInkRef.current) {
            hasInkRef.current = true;
            onChange?.(true);
        }
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
        hasInkRef.current = false;
        onChange?.(false);
        onClear?.();
    };

    React.useImperativeHandle(ref, () => ({
        isEmpty: () => !hasInkRef.current,
        toDataURL: (type = "image/png", quality) => {
            const canvas = canvasRef.current;
            return canvas?.toDataURL(type, quality);
        },
        clear: clearCanvas
    }));

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
                <Button type="primary" ghost htmlType="submit" onClick={clearCanvas}>Effacer la signature</Button>
            </div>
        </div>
    );
}

function SignaturePage() {
    const query = useQuery();
    const token = query.get("token");

    const [loading, setLoading] = React.useState(true);
    const [errorMsg, setErrorMsg] = React.useState(null);
    const [errorMsgSoumission, setErrorMsgSoumission] = React.useState(null);
    const [submitted, setSubmitted] = React.useState(false);

    const [prenom, setPrenom] = React.useState("");
    const [nom, setNom] = React.useState("");
    const [dateMiseEnService, setDateMiseEnService] = React.useState("");
    const [offre, setOffre] = React.useState(null);
    const [adresse, setAdresse] = React.useState("");
    const [idDemande, setIdDemande] = React.useState(null);
    const [hasSignature, setHasSignature] = React.useState(false);
    const sigRef = React.useRef(null);

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
                setErrorMsgSoumission(null);
                const response = await initSignature(token, controller.signal);

                if (!response || response.status !== "OK") {
                    setErrorMsg(response?.message || "Lien de signature invalide ou expiré.");
                    return;
                }

                setPrenom(response.data.prenom || "");
                setNom(response.data.nom || "");
                setDateMiseEnService(response.data.dateMiseEnService || "");
                setOffre(response.data.offre || null);
                setAdresse(response.data.adresse || "");
                setIdDemande(response.data.idDemande ?? null);
            } catch (e) {
                if (e.name === "AbortError" || e.name === "CanceledError") return;
                setErrorMsg(e.response.data.error.message || "Une erreur est survenue lors du chargement de la page de signature.");
            } finally {
                setLoading(false);
            }
        })();
        return () => controller.abort();
    }, [token]);

    const handleSubmit = async () => {
        if (!idDemande) {
            setErrorMsgSoumission("Identifiant de demande introuvable. Merci de réessayer via le lien reçu.");
            return;
        }

        if (!hasSignature || sigRef.current?.isEmpty()) {
            setErrorMsgSoumission("Veuillez signer dans l’encart prévu avant de finaliser.");
            return;
        }
        try {
            setLoading(true);
            setErrorMsg(null);
            setErrorMsgSoumission(null);
            const controller = new AbortController();
            abortRef.current = controller;

            await submitSignature({ idDemande, statutSignature }, controller.signal);

            setSubmitted(true);
        } catch (e) {
            if (e.name === "AbortError" || e.name === "CanceledError") return;
            console.error(e);
            setErrorMsgSoumission("La validation de votre signature a échoué. Merci de réessayer.");
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
                    <h3 className="success-title">
                        Merci {prenom || ""} !
                    </h3>
                    <div className="success-text">
                        Votre signature a bien été enregistrée. Nous vous remercions pour votre confiance.
                        Un e‑mail de confirmation vous a été adressé. Vous pouvez fermer cette page en toute sécurité.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="signature-page">
            <div className="signature-carte">
                <h3 className="signature-titre">Signature de votre contrat</h3>

                {errorMsg ? (
                    <Alert type="error" showIcon className="signature-alert" description={errorMsg} style={{ marginBottom: 0}} />
                ) : (
                    <>
                        <Paragraph className="signature-intro">
                            Bonjour <strong>{prenom} {nom}</strong>,<br />
                            Votre mise en service est prévue le <strong>{formatDateFR(dateMiseEnService)}</strong> à l’adresse :    <strong>{adresse}</strong>.
                            <br />
                            Offre retenue : <strong>{offre?.libelle}</strong> — {Number(offre?.prix ?? 0).toFixed(2)} € / Mois.
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
                                {offre?.libelle} — {Number(offre?.prix ?? 0).toFixed(2)} € / Mois
                            </Descriptions.Item>
                            <Descriptions.Item label="Identifiant de demande">{idDemande ?? "-"}</Descriptions.Item>
                        </Descriptions>

                        <div className="signature-block">
                            <div className="signature-block-header">
                                <Text>Veuillez signer ci‑dessous pour confirmer votre accord.</Text>
                            </div>
                            <SignaturePad ref={sigRef} onChange={setHasSignature} />
                        </div>

                        {errorMsgSoumission && (
                            <Alert type="error" showIcon className="signature-alert" description={errorMsgSoumission} />
                        )}

                        <div className="signature-actions-row">
                            <Button type="primary" htmlType="submit" onClick={handleSubmit} loading={loading}>
                                Signer et finaliser
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default SignaturePage;
