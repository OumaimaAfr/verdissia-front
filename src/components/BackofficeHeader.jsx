import { useContext, useState, useEffect } from 'react';
import { Layout, Dropdown, Avatar, Space, Badge, Tooltip, Modal, Typography, Card } from 'antd';
import { LogoutOutlined, UserOutlined, SettingOutlined, BellOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMap } from '../utils/workflowStore';
import dayjs from 'dayjs';

const { Header } = Layout;

function BackofficeHeader() {
    const { logoutUser, contracts } = useContext(AuthContext);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const isDashboard = pathname === '/backoffice/dashboard';
    const [notifications, setNotifications] = useState([]);

    const headerHeight = 64;

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

        // Vérifier également les rappels de contrats programmés
        const checkContractReminders = () => {
            try {
                const reminders = JSON.parse(localStorage.getItem('contractReminders') || '[]');
                const now = dayjs();
                
                console.log('🔍 Header - Vérification des rappels - Heure actuelle:', now.format('DD/MM/YYYY HH:mm:ss'));
                console.log('🔍 Header - Rappels en attente:', reminders.length);
                
                if (reminders.length === 0) {
                    console.log('🔍 Header - Aucun rappel en attente');
                    return;
                }
                
                reminders.forEach((reminderData, index) => {
                    const reminderTime = dayjs(reminderData.reminderTime);
                    console.log(`🔍 Header - Rappel ${index + 1} (${reminderData.contractId}): ${reminderTime.format('DD/MM/YYYY HH:mm:ss')}`);
                    
                    // Vérifier si le rappel doit être déclenché (fenêtre de 5 minutes)
                    const timeDiff = reminderTime.diff(now, 'minute');
                    console.log(`🔍 Header - Différence temps: ${timeDiff} minutes`);
                    
                    if (timeDiff >= -5 && timeDiff <= 1) {
                        console.log('🔔 Header - DÉCLENCHEMENT du rappel pour:', reminderData.contractId);
                        showContractReminderNotification(reminderData);
                        
                        // Retirer le rappel de la liste
                        const updatedReminders = reminders.filter(r => r.contractId !== reminderData.contractId);
                        localStorage.setItem('contractReminders', JSON.stringify(updatedReminders));
                        console.log('🔍 Header - Rappel supprimé de la liste');
                    }
                });
            } catch (error) {
                console.error('🔍 Header - Erreur lors de la vérification des rappels:', error);
            }
        };

        // Fonction pour calculer la page où se trouve le contrat
        const calculateContractPage = (contractId, sectionPath) => {
            console.log(`🔍 Header - Calcul de page pour ${contractId} dans ${sectionPath}`);
            
            // Simuler le même calcul que le DashboardPage
            // Utiliser les contrats existants et les trier comme dans le Dashboard
            
            let sectionData = [];
            const workflowMap = getMap();
            
            // Appliquer la même logique que computeBuckets
            contracts.forEach(c => {
                const id = c.numeroContrat;
                const wf = workflowMap[id];
                
                if (sectionPath.includes('/create')) {
                    if (wf?.state === 'TO_CREATE' || c.actionConseiller === 'TRAITER') {
                        sectionData.push({ ...c, ...wf });
                    }
                } else if (sectionPath.includes('/blocked')) {
                    if (wf?.state === 'BLOCKED' || (c.actionConseiller !== 'TRAITER' && c.actionConseiller !== 'VÉRIFICATION_OBLIGATOIRE' && c.actionConseiller !== 'EXAMINER')) {
                        sectionData.push({ ...c, ...wf });
                    }
                } else if (sectionPath.includes('/examiner')) {
                    if (wf?.state === 'EXAMINER' || c.actionConseiller === 'VÉRIFICATION_OBLIGATOIRE' || c.actionConseiller === 'EXAMINER') {
                        sectionData.push({ ...c, ...wf });
                    }
                }
            });
            
            // Trier par date de soumission (plus récent d'abord) comme dans le Dashboard
            sectionData.sort((a, b) => {
                const dateA = dayjs(a.dateMiseEnService || a.dateSoumission);
                const dateB = dayjs(b.dateMiseEnService || b.dateSoumission);
                return dateB.diff(dateA);
            });
            
            // Trouver l'index du contrat
            const contractIndex = sectionData.findIndex(c => c.numeroContrat === contractId);
            const pageNumber = contractIndex >= 0 ? Math.floor(contractIndex / 10) + 1 : 1;
            
            console.log(`🔍 Header - Résultat calcul page pour ${contractId}:`);
            console.log(`  - Total contrats dans section: ${sectionData.length}`);
            console.log(`  - Index du contrat: ${contractIndex}`);
            console.log(`  - Page calculée: ${pageNumber}`);
            console.log(`  - Contrats trouvés:`, sectionData.slice(0, 5).map(c => c.numeroContrat));
            
            return pageNumber;
        };

        // Fonction pour afficher la notification de rappel
        const showContractReminderNotification = (reminderData) => {
            try {
                console.log('🔍 Header - Affichage de la pop-up pour:', reminderData.contractId);
                
                // Calculer la page où se trouve le contrat
                const targetPage = calculateContractPage(reminderData.contractId, reminderData.section.path);
                
                Modal.info({
                    title: (
                        <Space>
                            <BellOutlined style={{ color: '#fa8c16' }} />
                            <span>Rappel de contrat à traiter</span>
                        </Space>
                    ),
                    width: 600,
                    content: (
                        <div>
                            <Typography.Paragraph>
                                Vous avez un contrat en attente de traitement :
                            </Typography.Paragraph>
                            <Card size="small" style={{ marginBottom: 16, border: '2px solid #fa8c16', backgroundColor: '#fff7e6' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <span style={{ color: '#6b7280', fontSize: '12px' }}>N° Dossier</span>
                                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{reminderData.contractInfo.numeroContrat}</div>
                                    </div>
                                    <div>
                                        <span style={{ color: '#6b7280', fontSize: '12px' }}>Client</span>
                                        <div style={{ fontWeight: '600', fontSize: '14px' }}>
                                            {reminderData.contractInfo.civilite} {reminderData.contractInfo.prenom} {reminderData.contractInfo.nom}
                                        </div>
                                    </div>
                                    <div>
                                        <span style={{ color: '#6b7280', fontSize: '12px' }}>Section</span>
                                        <div style={{ fontWeight: '600', fontSize: '14px' }}>
                                            <span style={{ color: reminderData.section.color }}>
                                                {reminderData.section.name}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <span style={{ color: '#6b7280', fontSize: '12px' }}>Page</span>
                                        <div style={{ fontWeight: '700', fontSize: '16px', color: '#fa8c16' }}>
                                            Page {targetPage}
                                            <BellOutlined style={{ marginLeft: '8px', color: '#fa8c16', fontSize: '14px' }} />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                            <Typography.Paragraph style={{ marginBottom: 16, fontSize: '13px', color: '#666' }}>
                                💡 <strong>Cliquez sur "Traiter maintenant"</strong> pour accéder directement au contrat sur la bonne page avec mise en évidence.
                            </Typography.Paragraph>
                            <Typography.Paragraph style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
                                💡 Cliquez en dehors de cette fenêtre pour la fermer.
                            </Typography.Paragraph>
                        </div>
                    ),
                    okText: (
                        <Space>
                            <BellOutlined />
                            <span>Traiter maintenant</span>
                        </Space>
                    ),
                    okButtonProps: {
                        style: { backgroundColor: '#fa8c16', borderColor: '#fa8c16' }
                    },
                    cancelButtonProps: {
                        style: { display: 'none' } // Cacher le bouton cancel car on clique en dehors
                    },
                    maskClosable: true, // Permettre la fermeture en cliquant sur le masque
                    onOk: () => {
                        try {
                            console.log('🔍 Header - Redirection vers:', reminderData.section.path);
                            console.log('🔍 Header - Page cible:', targetPage);
                            
                            // Rediriger vers la section appropriée avec mise en évidence
                            sessionStorage.setItem('highlightContract', reminderData.contractId);
                            sessionStorage.setItem('scrollToContract', 'true');
                            sessionStorage.setItem('targetPage', targetPage.toString());
                            
                            // Utiliser navigate au lieu de window.location.href
                            navigate(reminderData.section.path);
                        } catch (error) {
                            console.error('🔍 Header - Erreur lors de la redirection:', error);
                            // Fallback : utiliser window.location.href
                            window.location.href = reminderData.section.path;
                        }
                    },
                    onCancel: () => {
                        console.log('🔍 Header - Notification fermée par l\'utilisateur (clic extérieur)');
                    }
                });
            } catch (error) {
                console.error('🔍 Header - Erreur lors de l\'affichage de la pop-up:', error);
                // Fallback : utiliser une alerte simple
                alert(`Rappel : Contrat ${reminderData.contractInfo.numeroContrat} à traiter`);
            }
        };

        const checkAllNotifications = () => {
            checkNotifications();
            checkContractReminders();
        };

        checkAllNotifications();
        const interval = setInterval(checkAllNotifications, 30000); // Check every 30 seconds

        // Ajouter une fonction de test globale
        window.checkReminders = () => {
            console.log('=== VÉRIFICATION MANUELLE DES RAPPELS ===');
            checkContractReminders();
        };
        
        console.log('💡 Header - Pour vérifier les rappels manuellement, tapez: checkReminders() dans la console');

        // Ajouter une fonction de test globale
        window.testContractPage = (contractId) => {
            console.log('=== TEST CALCUL PAGE ===');
            console.log(`Recherche du contrat: ${contractId}`);
            
            // Tester pour chaque section
            const sections = ['/backoffice/create', '/backoffice/blocked', '/backoffice/examiner'];
            sections.forEach(path => {
                const page = calculateContractPage(contractId, path);
                console.log(`Section ${path}: Page ${page}`);
            });
        };
        
        console.log('💡 Header - Pour tester le calcul de page, tapez: testContractPage("CTR-020")');
        
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

    const headerStyle = {
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
    };

    const titleStyle = {
        fontSize: '20px', 
        color: 'white',
        fontWeight: '600',
        letterSpacing: '0.5px',
        lineHeight: 1.15,
        display: 'block'
    };

    const iconContainerStyle = {
        width: '40px',
        height: '40px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)'
    };

    const iconStyle = {
        width: '24px',
        height: '24px',
        color: 'white'
    };

    const userAvatarStyle = {
        background: 'rgba(255, 255, 255, 0.2)',
        border: '2px solid rgba(255, 255, 255, 0.3)'
    };

    const userNameStyle = {
        color: 'white', 
        fontSize: '14px',
        fontWeight: '500'
    };

    const notificationIconStyle = {
        color: 'white',
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
                        <img src="/assets/images/logo-mini.png" alt="Logo" />
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
                    background: rgba(255, 255, 255, 0.1) !important;
                }
            `}</style>
        </Header>
    );
}

export default BackofficeHeader;
