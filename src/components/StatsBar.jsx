import { Card, Col, Row, Statistic } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    CheckCircleTwoTone,
    CloseCircleTwoTone,
    ExclamationCircleTwoTone,
    FileSearchOutlined,
    PhoneTwoTone,
    FileTextOutlined,
    ExclamationCircleOutlined,
    PhoneOutlined,
    CloseCircleOutlined
} from "@ant-design/icons";

export default function StatsBar({ totals }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isDashboard = pathname === '/backoffice/dashboard';

    const {
        toCreate = 0,
        toReview = 0,
        toExamine = 0,
        toCall = 0,
        declined = 0,
    } = totals;

    const card = (title, value, icon, route, color) => {
        if (isDashboard) {
            return (
                <Card 
                    hoverable 
                    onClick={() => navigate(route)} 
                    style={{ 
                        cursor: 'pointer',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: 'none',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        transition: 'all 0.3s ease'
                    }}
                    bodyStyle={{ padding: '20px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ 
                                fontSize: '14px', 
                                color: '#6b7280', 
                                marginBottom: '8px',
                                fontWeight: '500'
                            }}>
                                {title}
                            </div>
                            <div style={{ 
                                fontSize: '24px', 
                                fontWeight: '700', 
                                color: '#1f2937',
                                lineHeight: '1'
                            }}>
                                {value}
                            </div>
                        </div>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}>
                            {icon}
                        </div>
                    </div>
                </Card>
            );
        } else {
            return (
                <Card
                    hoverable
                    onClick={() => navigate(route)}
                    style={{
                        cursor: 'pointer',
                        borderRadius: 12,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        border: '1px solid #f0f0f0',
                    }}
                    bodyStyle={{ padding: 16 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ minWidth: 0 }}>
                            <div style={{
                                fontSize: 12,
                                color: '#6b7280',
                                fontWeight: 600,
                                marginBottom: 6,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {title}
                            </div>
                            <div style={{
                                fontSize: 22,
                                fontWeight: 800,
                                color: '#111827',
                                lineHeight: 1
                            }}>
                                {value}
                            </div>
                        </div>
                        <div style={{
                            width: 38,
                            height: 38,
                            borderRadius: 10,
                            background: color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
                            flex: '0 0 auto'
                        }}>
                            {icon}
                        </div>
                    </div>
                </Card>
            );
        }
    };

    return (
        <Row gutter={[16, 16]} style={{ marginBottom: isDashboard ? '24px' : '16px' }}>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                {card(
                    "Contrats à créer", 
                    toCreate, 
                    isDashboard ? 
                        <CheckCircleTwoTone twoToneColor="#ffffff" style={{ fontSize: '18px' }} /> : 
                        <FileTextOutlined style={{ color: '#ffffff', fontSize: '18px' }} />,
                    "/backoffice",
                    isDashboard ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                )}
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                {card(
                    "Cas bloqués", 
                    toReview, 
                    isDashboard ? 
                        <ExclamationCircleTwoTone twoToneColor="#ffffff" style={{ fontSize: '18px' }} /> : 
                        <ExclamationCircleOutlined style={{ color: '#ffffff', fontSize: '18px' }} />,
                    "/backoffice/blocked",
                    isDashboard ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                )}
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                {card(
                    "Cas à examiner", 
                    toExamine, 
                    isDashboard ? 
                        <FileSearchOutlined style={{ color: '#ffffff', fontSize: '18px' }} /> : 
                        <FileSearchOutlined style={{ color: '#ffffff', fontSize: '18px' }} />,
                    "/backoffice/examiner",
                    isDashboard ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                )}
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                {card(
                    "Clients à appeler", 
                    toCall, 
                    isDashboard ? 
                        <PhoneTwoTone twoToneColor="#ffffff" style={{ fontSize: '18px' }} /> : 
                        <PhoneOutlined style={{ color: '#ffffff', fontSize: '18px' }} />,
                    "/backoffice/calls",
                    isDashboard ? "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" : "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                )}
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                {card(
                    "Cas déclinés", 
                    declined, 
                    isDashboard ? 
                        <CloseCircleTwoTone twoToneColor="#ffffff" style={{ fontSize: '18px' }} /> : 
                        <CloseCircleOutlined style={{ color: '#ffffff', fontSize: '18px' }} />,
                    "/backoffice/declined",
                    isDashboard ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                )}
            </Col>
        </Row>
    );
}
