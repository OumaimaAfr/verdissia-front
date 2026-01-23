import React from "react";
import { Button, Form, Input } from "antd";

function InfosPersoStep({ onFinish, initialValues, resetSignal }){
    const [form] = Form.useForm();

    React.useEffect(() => {
        form.resetFields();
    }, [resetSignal, form]);

    return(
        <div className="infos-perso-step">
            <p className="description-step">Merci de renseigner vos coordonnées afin que nous puissions traiter votre demande.</p>
            <Form form={form} onFinish={onFinish} initialValues={initialValues} name="validateOnly" layout="vertical" autoComplete="off" requiredMark={false}>
                <Form.Item
                    name="prenom"
                    label="Prénom"
                    rules={[
                        { required: true, message: "Le prénom est requis." },
                        {
                            pattern: /^[\p{L}\p{M}'’ -]+$/u,
                            message: "Le prénom ne doit contenir que des lettres, espaces, apostrophes ou tirets."
                        },
                        { max: 50, message: "Maximum 50 caractères." },
                        {
                            validator: (_, value) =>
                                value && value.trim().length === 0
                                    ? Promise.reject(new Error("Le prénom ne peut pas être vide."))
                                    : Promise.resolve()
                        }
                    ]}
                    normalize={(v) => (typeof v === "string" ? v.replace(/\s+/g, " ").trimStart() : v)}
                >
                    <Input placeholder="Ex. John" inputMode="text"/>
                </Form.Item>
                <Form.Item
                    name="nom"
                    label="Nom"
                    rules={[
                        { required: true, message: "Le nom est requis." },
                        {
                            pattern: /^[\p{L}\p{M}'’ -]+$/u,
                            message: "Le nom ne doit contenir que des lettres, espaces, apostrophes ou tirets."
                        },
                        { max: 50, message: "Maximum 50 caractères." },
                        {
                            validator: (_, value) =>
                                value && value.trim().length === 0
                                    ? Promise.reject(new Error("Le nom ne peut pas être vide."))
                                    : Promise.resolve()
                        }
                    ]}
                    normalize={(v) => (typeof v === "string" ? v.replace(/\s+/g, " ").trimStart() : v)}
                >
                    <Input placeholder="Ex. Doe" inputMode="text"/>
                </Form.Item>
                <Form.Item
                    name="email"
                    label="E‑mail"
                    rules={[
                        { required: true, message: 'Veuillez saisir votre adresse e‑mail' },
                        { type: 'email', message: 'Veuillez saisir une adresse e‑mail valide' },
                    ]}
                >
                    <Input placeholder="Ex. john.doe@exemple.com" />
                </Form.Item>
                <Form.Item
                    name="telephone"
                    label="Téléphone"
                    rules={[
                        { required: true, message: 'Veuillez saisir votre numéro de téléphone' },
                        {
                            pattern: /^[0-9+\s-]{8,20}$/,
                            message: 'Veuillez saisir un numéro de téléphone valide',
                        },
                    ]}
                >
                    <Input placeholder="Ex. 06 12 34 56 78" inputMode="tel" />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                    Continuer
                </Button>
            </Form>
        </div>
    )
}

export default InfosPersoStep