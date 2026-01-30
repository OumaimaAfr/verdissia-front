import React, { useContext, useEffect, useState } from 'react';
import {Card, Form, Input, Button, message, Alert} from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import { generateToken, login } from '../services/authService.jsx';

function LoginPage() {
    const { initSession } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = React.useState(null);

    useEffect(() => {
        (async () => {
            try {
                const accessToken = await generateToken();
                if (!accessToken) throw new Error("Token vide");
                initSession(accessToken, []);
            } catch {
                setErrorMsg("Impossible de générer le token d’accès");
            }
        })();
    }, []);

    const onFinish = async ({ username, password }) => {
        try {
            setLoading(true);
            const contracts = await login(username, password);
            initSession(localStorage.getItem("access_token"), contracts);
            message.success("Connexion réussie");
            window.location.href = "/backoffice/dashboard";

        } catch (e) {
            setErrorMsg("Identifiants invalides");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="connexion-carte">
            <Card title="Connexion Back-Office" style={{ width: 380 }}>
                <Form layout="vertical" onFinish={onFinish} autoComplete="off" requiredMark={false}>
                    <Form.Item name="username" label="Utilisateur" rules={[{ required: true, message: "L'utilisateur est requis." }]}>
                        <Input prefix={<UserOutlined />} />
                    </Form.Item>

                    <Form.Item name="password" label="Mot de passe" rules={[{ required: true, message: "Le mot de passe est requis."  }]}>
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>
                    <div>{ errorMsg && <Alert type="error" description={errorMsg} showIcon /> }</div>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Accéder
                    </Button>
                </Form>
            </Card>
        </div>
    );
}

export default LoginPage;
