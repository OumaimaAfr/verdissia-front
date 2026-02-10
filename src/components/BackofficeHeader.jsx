import { useContext, useState, useEffect } from 'react';
import { Layout, Dropdown, Avatar, Space, Badge, Tooltip } from 'antd';
import { LogoutOutlined, UserOutlined, SettingOutlined, BellOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { getMap } from '../utils/workflowStore';
import dayjs from 'dayjs';

const { Header } = Layout;

function BackofficeHeader() {
    const { logoutUser, contracts } = useContext(AuthContext);
    const { pathname } = useLocation();
    const isDashboard = pathname === '/backoffice/dashboard';
    const [notifications, setNotifications] = useState([]);

    const headerHeight = isDashboard ? 64 : 56;

    // Check for upcoming callbacks every minute
    useEffect(() => {
        const checkNotifications = () => {
            const workflowMap = getMap();
            const now = dayjs();
            const inTenMinutes = now.add(10, 'minute');
            const upcomingCallbacks = [];

            Object.entries(workflowMap).forEach(([contractId, workflow]) => {
                if (workflow.nextAction === 'callback_later' && workflow.callbackDateTime) {
                    const callbackTime = dayjs(workflow.callbackDateTime);
                    
                    if (callbackTime.isAfter(now) && callbackTime.isBefore(inTenMinutes)) {
                        // Find client name from contracts
                        const contract = contracts.find(c => c.numeroContrat === contractId);
                        const clientName = contract ? 
                            `${contract.prenom || ''} ${contract.nom || ''}`.trim() : 
                            'Client';
                        
                        upcomingCallbacks.push({
                            contractId,
                            callbackTime,
                            clientName,
                            minutesUntil: callbackTime.diff(now, 'minutes')
                        });
                    }
                }
            });

            // Sort by urgency (closest first)
            upcomingCallbacks.sort((a, b) => a.minutesUntil - b.minutesUntil);
            setNotifications(upcomingCallbacks);
        };

        checkNotifications();
        const interval = setInterval(checkNotifications, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [contracts]);

    const items = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Mon Profil',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Paramètres',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Se déconnecter',
            onClick: () => {
                logoutUser();
                window.location.href = '/backoffice/login';
            },
            danger: true,
        },
    ];

    const headerStyle = isDashboard ? {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        padding: '0 24px',
        borderBottom: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        height: headerHeight,
        display: 'flex',
        alignItems: 'center'
    } : {
        background: '#ffffff',
        padding: '0 16px',
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        height: headerHeight,
        display: 'flex',
        alignItems: 'center'
    };

    const titleStyle = isDashboard ? {
        fontSize: '20px', 
        color: 'white',
        fontWeight: '600',
        letterSpacing: '0.5px',
        lineHeight: 1.15,
        display: 'block'
    } : {
        fontSize: '20px', 
        color: '#1f2937',
        fontWeight: '600',
        lineHeight: 1.15,
        display: 'block'
    };

    const iconContainerStyle = isDashboard ? {
        width: '40px',
        height: '40px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)'
    } : {
        width: '36px',
        height: '36px',
        background: '#f8fafc',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const iconStyle = isDashboard ? {
        width: '24px',
        height: '24px',
        color: 'white'
    } : {
        width: '24px',
        height: '24px',
        color: '#10b981'
    };

    const userAvatarStyle = isDashboard ? {
        background: 'rgba(255, 255, 255, 0.2)',
        border: '2px solid rgba(255, 255, 255, 0.3)'
    } : {
        background: '#10b981',
        border: '2px solid #ffffff'
    };

    const userNameStyle = isDashboard ? {
        color: 'white', 
        fontSize: '14px',
        fontWeight: '500'
    } : {
        color: '#1f2937', 
        fontSize: '14px',
        fontWeight: '500'
    };

    const notificationIconStyle = isDashboard ? {
        color: 'white',
        fontSize: '18px'
    } : {
        color: '#10b981',
        fontSize: '18px'
    };

    return (
        <Header className="backoffice-header" style={headerStyle}>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                width: '100%'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={iconContainerStyle}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}>
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <line x1="9" y1="9" x2="15" y2="9"/>
                            <line x1="9" y1="15" x2="15" y2="15"/>
                        </svg>
                    </div>
                    <div>
                        <strong style={titleStyle}>
                            VERDISSIA BACKOFFICE
                        </strong>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Notifications */}
                    <Dropdown 
                        overlayClassName="notification-dropdown"
                        dropdownRender={() => (
                            <div style={{ 
                                width: 280, 
                                maxHeight: 400, 
                                overflow: 'auto',
                                background: '#fff',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                border: '1px solid #d9d9d9'
                            }}>
                                <div style={{ 
                                    padding: '8px 16px', 
                                    borderBottom: '1px solid #f0f0f0',
                                    background: '#fafafa',
                                    fontWeight: 'bold',
                                    fontSize: '14px'
                                }}>
                                    📞 Rappels imminents
                                </div>
                                {notifications.length > 0 ? (
                                    notifications.map((notif, index) => (
                                        <div
                                            key={notif.contractId}
                                            onClick={() => {
                                                window.location.href = '/backoffice/calls';
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                padding: '12px 16px',
                                                borderBottom: index < notifications.length - 1 ? '1px solid #f0f0f0' : 'none',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6f7ff'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <BellOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: '500', fontSize: '14px', marginBottom: '2px' }}>
                                                        {notif.clientName}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                                        Rappel dans {notif.minutesUntil} minute{notif.minutesUntil > 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                                {notif.minutesUntil <= 3 && (
                                                    <span style={{ 
                                                        background: '#ff4d4f', 
                                                        color: 'white', 
                                                        padding: '2px 6px', 
                                                        borderRadius: '10px', 
                                                        fontSize: '10px',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        Urgent
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ 
                                        padding: '24px 16px', 
                                        textAlign: 'center', 
                                        color: '#999',
                                        fontSize: '14px'
                                    }}>
                                        <BellOutlined style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }} />
                                        Aucun rappel imminent
                                    </div>
                                )}
                            </div>
                        )}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <Tooltip title="Notifications">
                            <Badge count={notifications.length} size="small">
                                <BellOutlined 
                                    style={{ 
                                        ...notificationIconStyle,
                                        cursor: 'pointer'
                                    }} 
                                />
                            </Badge>
                        </Tooltip>
                    </Dropdown>

                    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                        <Space style={{ 
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease'
                        }}
                        className="user-dropdown">
                            <Avatar 
                                size="small" 
                                icon={<UserOutlined />}
                                style={userAvatarStyle}
                            />
                            <span style={userNameStyle}>
                                Administrateur
                            </span>
                        </Space>
                    </Dropdown>
                </div>
            </div>

            <style jsx>{`
                .user-dropdown:hover {
                    background: ${isDashboard ? 'rgba(255, 255, 255, 0.1)' : '#f8fafc'} !important;
                }
            `}</style>
        </Header>
    );
}

export default BackofficeHeader;
