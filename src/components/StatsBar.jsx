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
    CloseCircleOutlined,
    SearchOutlined,
    CheckCircleOutlined
} from "@ant-design/icons";

function StatsCard({ title, value, icon, color, onClick }) {
    return (
        <Card
            style={{
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid rgb(5, 150, 105);',
                background: '#FFFFFF',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
            }}
            bodyStyle={{ padding: '24px' }}
            hoverable
            onClick={onClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
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
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#1f2937',
                        lineHeight: '1'
                    }}>
                        {value}
                    </div>
                </div>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                    {icon}
                </div>
            </div>
        </Card>
    );
}

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
                        border: '1px solid rgb(5, 150, 105);',
                        background: '#D0F8CC',
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
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                        <Col xs={24} sm={12} lg={6}>
                            <StatsCard
                                title="Contrats à créer"
                                value={totals.toCreate}
                                icon={<FileTextOutlined style={{ color: 'white', fontSize: '20px' }} />}
                                color="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                onClick={() => handleCardClick('Contrats à créer')}
                            />
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <StatsCard
                                title="Cas bloqués"
                                value={totals.toReview}
                                icon={<ExclamationCircleOutlined style={{ color: 'white', fontSize: '20px' }} />}
                                color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                                onClick={() => handleCardClick('Cas bloqués')}
                            />
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <StatsCard
                                title="Cas à examiner"
                                value={totals.toExamine}
                                icon={<SearchOutlined style={{ color: 'white', fontSize: '20px' }} />}
                                color="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                                onClick={() => handleCardClick('Cas à examiner')}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <StatsCard
                                title="Clients à appeler"
                                value={totals.toCall}
                                icon={<PhoneOutlined style={{ color: 'white', fontSize: '20px' }} />}
                                color="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                                onClick={() => handleCardClick('Clients à appeler')}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <StatsCard
                                title="Cas déclinés"
                                value={totals.declined}
                                icon={<CloseCircleOutlined style={{ color: 'white', fontSize: '20px' }} />}
                                color="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                                onClick={() => handleCardClick('Cas déclinés')}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <StatsCard
                                title="Contrats traités"
                                value={totals.processed}
                                icon={<CheckCircleOutlined style={{ color: 'white', fontSize: '20px' }} />}
                                color="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
                                onClick={() => handleCardClick('Contrats traités')}
                            />
                        </Col>
                    </Row>
    );
}
