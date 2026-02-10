import React, { useContext, useEffect, useState } from 'react';
import {Card, Form, Input, Button, message, Alert, Typography, Space} from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import { generateToken, login } from '../services/authService.jsx';

const { Title, Text } = Typography;

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
        <div style={{
            width: '100%',
            minHeight: '100vh',
            background: '#0f172a',
            display: 'flex',
            position: 'relative',
            overflow: 'hidden',
            margin: 0,
            padding: 0
        }}>
            {/* Animation de particules en arrière-plan */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CradialGradient id='grad1' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' style='stop-color:%2310b981;stop-opacity:0.3' /%3E%3Cstop offset='100%25' style='stop-color:%2310b981;stop-opacity:0' /%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='30' fill='url(%23grad1)'/%3E%3C/svg%3E")`,
                backgroundSize: '200px 200px',
                animation: 'float 20s ease-in-out infinite',
                opacity: 0.4
            }} />

            {/* Effet de lumière animé */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
                animation: 'rotate 30s linear infinite'
            }} />

            {/* Panneau latéral gauche avec effet glassmorphism avancé */}
            <div style={{
                flex: '1',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '60px 40px',
                position: 'relative',
                minWidth: '450px'
            }}>
                {/* Effet de néon */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                    animation: 'pulse 4s ease-in-out infinite'
                }} />
                
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    {/* Logo 3D avec animation */}
                    <div style={{
                        width: '100px',
                        height: '100px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 32px',
                        boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4), 0 0 60px rgba(16, 185, 129, 0.2)',
                        transform: 'perspective(1000px) rotateY(0deg)',
                        animation: 'rotate3d 10s ease-in-out infinite',
                        border: '2px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <img src="/assets/images/logo-mini.png" alt="Logo" style={{ width: '60px', height: '60px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />
                    </div>
                    
                    <Title level={1} style={{ 
                        margin: 0, 
                        background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: '800',
                        fontSize: '42px',
                        marginBottom: '16px',
                        textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                        letterSpacing: '-1px'
                    }}>
                        VERDISSIA
                    </Title>
                    
                    <Text style={{ 
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '20px',
                        fontWeight: '300',
                        marginBottom: '40px',
                        display: 'block',
                        letterSpacing: '0.5px'
                    }}>
                        L'excellence de la gestion back-office
                    </Text>

                    {/* Stats animées */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '20px',
                        marginBottom: '40px'
                    }}>
                        {[
                            { label: 'Sécurisé', icon: '🔒', color: '#10b981' },
                            { label: 'Rapide', icon: '⚡', color: '#f59e0b' },
                            { label: 'Intuitif', icon: '✨', color: '#8b5cf6' }
                        ].map((item, index) => (
                            <div key={index} style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                padding: '20px 16px',
                                borderRadius: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                textAlign: 'center',
                                transform: 'translateY(0)',
                                transition: 'all 0.3s ease',
                                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                            }}>
                                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
                                <Text style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500' }}>{item.label}</Text>
                            </div>
                        ))}
                    </div>

                    {/* Ligne de séparation animée */}
                    <div style={{
                        width: '100px',
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
                        margin: '20px auto',
                        animation: 'slideGradient 3s ease-in-out infinite'
                    }} />
                </div>
            </div>

            {/* Panneau droit avec effet futuriste */}
            <div style={{
                flex: '1.2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 40px',
                position: 'relative'
            }}>
                {/* Carte avec effet de profondeur */}
                <Card 
                    style={{ 
                        width: '100%',
                        maxWidth: '480px',
                        borderRadius: '24px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 100px rgba(16, 185, 129, 0.1)',
                        transform: 'perspective(1000px) rotateX(2deg)',
                        transition: 'all 0.3s ease'
                    }}
                    bodyStyle={{ padding: '56px 48px' }}
                    hoverable
                >
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '60px',
                            height: '60px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            borderRadius: '16px',
                            marginBottom: '20px',
                            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                            animation: 'bounce 2s ease-in-out infinite'
                        }}>
                            <UserOutlined style={{ color: '#ffffff', fontSize: '24px' }} />
                        </div>
                        
                        <Title level={2} style={{ 
                            margin: 0, 
                            color: '#1f2937',
                            fontWeight: '700',
                            fontSize: '32px',
                            marginBottom: '12px',
                            background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Bienvenue
                        </Title>
                        
                        <Text style={{ 
                            color: '#6b7280',
                            fontSize: '18px',
                            fontWeight: '400'
                        }}>
                            Accédez à votre espace personnel
                        </Text>
                    </div>

                    <Form layout="vertical" onFinish={onFinish} autoComplete="off" requiredMark={false}>
                        <Form.Item 
                            name="username" 
                            label={<span style={{ color: '#374151', fontWeight: '600', fontSize: '15px' }}>Identifiant</span>}
                            rules={[{ required: true, message: "L'identifiant est requis." }]}
                        >
                            <Input 
                                prefix={<UserOutlined style={{ color: '#10b981' }} />}
                                size="large"
                                style={{ 
                                    borderRadius: '12px',
                                    border: '2px solid #e5e7eb',
                                    padding: '16px 20px',
                                    fontSize: '16px',
                                    background: 'rgba(249, 250, 251, 0.8)',
                                    transition: 'all 0.3s ease'
                                }}
                                placeholder="Veuillez saisir votre identifiant."
                            />
                        </Form.Item>

                        <Form.Item 
                            name="password" 
                            label={<span style={{ color: '#374151', fontWeight: '600', fontSize: '15px' }}>Mot de passe</span>} 
                            rules={[{ required: true, message: "Le mot de passe est requis." }]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined style={{ color: '#10b981' }} />}
                                size="large"
                                style={{ 
                                    borderRadius: '12px',
                                    border: '2px solid #e5e7eb',
                                    padding: '16px 20px',
                                    fontSize: '16px',
                                    background: 'rgba(249, 250, 251, 0.8)',
                                    transition: 'all 0.3s ease'
                                }}
                                placeholder="••••••••"
                            />
                        </Form.Item>
                        
                        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                                <a href="#" style={{ color: '#10b981', textDecoration: 'none', fontWeight: '500' }}>Mot de passe oublié ?</a>
                            </Text>
                        </div>
                        
                        <div style={{ marginBottom: '32px' }}>
                            {errorMsg && <Alert 
                                type="error" 
                                description={errorMsg} 
                                showIcon 
                                style={{ 
                                    borderRadius: '12px',
                                    border: '1px solid #fecaca',
                                    backgroundColor: '#fef2f2',
                                    fontSize: '14px'
                                }} 
                            />}
                        </div>
                        
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            block 
                            loading={loading}
                            size="large"
                            style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                height: '56px',
                                fontSize: '18px',
                                fontWeight: '600',
                                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <span style={{ position: 'relative', zIndex: 1 }}>
                                Se connecter
                            </span>
                        </Button>
                    </Form>

                    <div style={{ 
                        textAlign: 'center', 
                        marginTop: '40px',
                        paddingTop: '32px',
                        borderTop: '1px solid #f3f4f6'
                    }}>
                        <Text style={{ 
                            color: '#9ca3af',
                            fontSize: '14px'
                        }}>
                            🔐 Connexion sécurisée • 256-bit encryption
                        </Text>
                    </div>
                </Card>
            </div>

            {/* Styles CSS animés */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    33% { transform: translateY(-20px) rotate(120deg); }
                    66% { transform: translateY(20px) rotate(240deg); }
                }
                
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(1.1); }
                }
                
                @keyframes rotate3d {
                    0%, 100% { transform: perspective(1000px) rotateY(0deg); }
                    50% { transform: perspective(1000px) rotateY(180deg); }
                }
                
                @keyframes fadeInUp {
                    from { 
                        opacity: 0; 
                        transform: translateY(30px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }
                
                @keyframes slideGradient {
                    0%, 100% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                }
                
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }
            `}</style>
        </div>
    );
}

export default LoginPage;
