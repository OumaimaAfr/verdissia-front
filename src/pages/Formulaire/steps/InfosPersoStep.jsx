import React from "react";
import {Button, Form, Input, Radio} from "antd";

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
                    name="civilite"
                    label="Civilité"
                    rules={[{ required: true, message: "La civilité est requise." }]}
                >
                    <Radio.Group>
                        <Radio value="Monsieur">Monsieur</Radio>
                        <Radio value="Madame">Madame</Radio>
                    </Radio.Group>
                </Form.Item>
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
                            pattern: /^\d{10}$/,
                            message: 'Le numéro doit contenir exactement 10 chiffres',
                        },
                    ]}
                >
                    <Input placeholder="Ex. 0612345678" inputMode="tel" maxLength={10}/>
                </Form.Item>
                <Form.Item
                    name="numeroCNI"
                    label="Numéro de carte d’identité nationale (CNI)"
                    rules={[
                        { required: true, message: "Le numéro de CNI est requis." },
                        { pattern: /^[A-Z0-9]{12}$/, message: "Le numéro de CNI doit comporter 12 caractères alphanumériques (sans espaces)." },
                    ]}
                >
                    <Input placeholder="Ex. XX1234567890" inputMode="text" maxLength={12} />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                    Continuer
                </Button>
            </Form>
        </div>
    )
}

export default InfosPersoStep