import { useContext, useState, useEffect } from 'react';
import { Layout, Dropdown, Avatar, Space, Badge, Tooltip, List } from 'antd';
import { LogoutOutlined, UserOutlined, BellOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import { getMap } from '../utils/workflowStore';
import dayjs from 'dayjs';

const { Header } = Layout;

function BackofficeHeader() {
    const { logoutUser, contracts } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

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
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Se déconnecter',
            onClick: () => {
                logoutUser();
                window.location.href = '/backoffice/login';
            },
        },
    ];

    return (
        <Header className="backoffice-header">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <strong style={{ fontSize: 20 }}>BACK OFFICE</strong>
                <Space size="middle">
                    {/* Notifications */}
                    <Dropdown 
                        overlayClassName="notification-dropdown"
                        dropdownRender={(menu) => (
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
                                                // Navigate to calls page
                                                window.location.href = '/backoffice/calls';
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                padding: '12px 16px',
                                                borderBottom: index < notifications.length - 1 ? '1px solid #f0f0f0' : 'none',
                                                transition: 'background-color 0.2s',
                                                '&:hover': { backgroundColor: '#e6f7ff' }
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6f7ff'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <BellOutlined style={{ color: 'white', fontSize: '16px' }} />
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
                                        fontSize: 18, 
                                        cursor: 'pointer',
                                        color: notifications.length > 0 ? '#1890ff' : '#666'
                                    }} 
                                />
                            </Badge>
                        </Tooltip>
                    </Dropdown>

                    {/* User menu */}
                    <Dropdown menu={{ items }} trigger={['click']}>
                        <Space style={{ cursor:'pointer' }}>
                            <Avatar size="small" icon={<UserOutlined />} />
                        </Space>
                    </Dropdown>
                </Space>
            </div>
        </Header>
    );
}

export default BackofficeHeader;
