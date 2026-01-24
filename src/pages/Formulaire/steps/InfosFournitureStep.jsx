import React from "react";
import {DatePicker, Form, Radio, Button, Input, Col, Row, Alert} from "antd";
import dayjs from "dayjs";
import { getOffres } from "../../../services/offresService.jsx";

function InfosFournitureStep({ onFinish, initialValues, resetSignal }){
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState(null);

    React.useEffect(() => {
        form.resetFields();
        setErrorMsg(null);
    }, [resetSignal, form]);

    const handleSubmit = async (values) => {
        setErrorMsg(null);
        setLoading(true);
        try {
            const payload = {
                typeEnergie: values.typeEnergie || "",
                preferenceOffre: values.preferenceOffre || "",
            };

            const response = await getOffres(payload);
            onFinish(values, response.data);
        } catch (e) {
            console.error(e);
            setErrorMsg("Une erreur est survenue lors de la récupération des offres. Merci de réessayer plus tard.");
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="infos-fourniture-step">
            <p className="description-step">Aidez‑nous à personnaliser votre offre: indiquez votre adresse, le type d’énergie, la date de mise en service et vos priorités.</p>
            <Form form={form} onFinish={handleSubmit} initialValues={initialValues} name="validateOnly" layout="vertical" autoComplete="off" requiredMark={false}>
                <Form.Item
                    name="voie"
                    label="Voie"
                    rules={[
                        { required: true, message: "La voie est requise." },
                        { min: 5, message: "La voie est trop courte." },
                        { max: 150, message: "Maximum 150 caractères." },
                        {
                            validator: (_, value) =>
                                value && value.trim().length === 0
                                    ? Promise.reject(new Error("La voie ne peut pas être vide."))
                                    : Promise.resolve(),
                        },
                    ]}
                    normalize={(v) =>
                        typeof v === "string" ? v.replace(/\s+/g, " ").trimStart() : v
                    }
                >
                    <Input placeholder="Ex. 25 rue des Jardins" />
                </Form.Item>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="codePostal"
                            label="Code postal"
                            rules={[
                                { required: true, message: "Le code postal est requis." },
                                {
                                    pattern: /^[0-9]{4,5}$/,
                                    message: "Veuillez saisir un code postal valide.",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Ex. 75001"
                                inputMode="numeric"
                                maxLength={5}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="ville"
                            label="Ville"
                            rules={[
                                { required: true, message: "La ville est requise." },
                                {
                                    pattern: /^[\p{L}\p{M}'’ -]+$/u,
                                    message: "La ville ne doit contenir que des lettres.",
                                },
                                { max: 80, message: "Maximum 80 caractères." },
                                {
                                    validator: (_, value) =>
                                        value && value.trim().length === 0
                                            ? Promise.reject(new Error("La ville ne peut pas être vide."))
                                            : Promise.resolve(),
                                },
                            ]}
                            normalize={(v) =>
                                typeof v === "string" ? v.replace(/\s+/g, " ").trimStart() : v
                            }
                        >
                            <Input placeholder="Ex. Paris" />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    name="typeEnergie"
                    label="Type d’énergie"
                    rules={[{ required: true, message: "Veuillez choisir un type d’énergie" }]}
                >
                    <Radio.Group>
                        <Radio value="ELECTRICITE">Électricité</Radio>
                        <Radio value="GAZ">Gaz</Radio>
                        <Radio value="DUAL">Dual (Électricité + Gaz)</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="Date souhaitée de mise en service"
                    name="dateMiseEnService"
                    rules={[
                        {
                            required: true,
                            message: "Veuillez sélectionner une date",
                        },
                    ]}
                >
                    <DatePicker
                        placeholder="Sélectionner une date"
                        disabledDate={(current) =>
                            current && current < dayjs().add(1, "day").startOf("day")
                        }
                    />
                </Form.Item>
                <Form.Item
                    name="preferenceOffre"
                    label="Préférences d’offre"
                    rules={[
                        {
                            required: true,
                            message: "Veuillez sélectionner votre préférences d’offre",
                        },
                    ]}
                >
                    <Radio.Group>
                        <Radio value="PRIX">Prix</Radio>
                        <Radio value="STABILITE">Stabilité</Radio>
                        <Radio value="ENERGIE_VERTE">Énergie verte</Radio>
                        <Radio value="INDIFFERENT">Indifférent</Radio>
                    </Radio.Group>
                </Form.Item>
                {errorMsg && (
                    <Alert
                        type="error"
                        description={errorMsg}
                        showIcon
                    />
                )}
                <Button type="primary" htmlType="submit" loading={loading}>
                    Continuer
                </Button>
            </Form>
        </div>
    )
}

export default InfosFournitureStep
