import { useContext, useState, useEffect } from 'react';
import { Layout, Dropdown, Avatar, Space, Badge, Tooltip, Modal, Typography, Card } from 'antd';
import { LogoutOutlined, UserOutlined, SettingOutlined, BellOutlined, PhoneOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getMap } from '../utils/workflowStore';
import { computeBuckets } from '../utils/buckets';
import dayjs from 'dayjs';

const { Header } = Layout;

function BackofficeHeader() {
    const { logoutUser, contracts } = useContext(AuthContext);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);

    const headerHeight = 64;

    // Check for upcoming callbacks every minute
    useEffect(() => {
        const checkNotifications = () => {
            const workflowMap = getMap();
            const now = dayjs();
            const inTenMinutes = now.add(10, 'minute');
            const upcomingCallbacks = [];

            // Vérifier les callbacks dans workflowMap
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

            // Vérifier également les rappels dans localStorage
            try {
                const reminders = JSON.parse(localStorage.getItem('contractReminders') || '[]');
                
                reminders.forEach((reminderData) => {
                    const reminderTime = dayjs(reminderData.reminderTime);
                    
                    if (reminderTime.isAfter(now) && reminderTime.isBefore(inTenMinutes)) {
                        const clientName = reminderData.contractInfo ? 
                            `${reminderData.contractInfo.prenom || ''} ${reminderData.contractInfo.nom || ''}`.trim() : 
                            'Client';
                        
                        upcomingCallbacks.push({
                            contractId: reminderData.contractId,
                            callbackTime: reminderTime,
                            clientName,
                            minutesUntil: reminderTime.diff(now, 'minutes')
                        });
                    }
                });
            } catch (error) {
                console.error('Erreur lors de la lecture des rappels localStorage:', error);
            }

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
                    console.log(`🔍 Header - Condition check: ${timeDiff} >= -1 && ${timeDiff} <= 2 = ${timeDiff >= -1 && timeDiff <= 2}`);
                    
                    if (timeDiff >= -1 && timeDiff <= 2) {
                        console.log('🔔 Header - DÉCLENCHEMENT du rappel pour:', reminderData.contractId);
                        showContractReminderNotification(reminderData);
                        
                        // Retirer le rappel de la liste
                        const updatedReminders = reminders.filter(r => r.contractId !== reminderData.contractId);
                        localStorage.setItem('contractReminders', JSON.stringify(updatedReminders));
                        console.log('🔍 Header - Rappel supprimé de la liste');
                    } else {
                        console.log(`🔍 Header - Rappel ${reminderData.contractId} pas encore déclenché (timeDiff: ${timeDiff})`);
                    }
                });
            } catch (error) {
                console.error('🔍 Header - Erreur lors de la vérification des rappels:', error);
            }
        };

        // Fonction pour calculer la page où se trouve le contrat
        const calculateContractPage = (contractId, sectionPath) => {
            console.log(`🔍 Header - Calcul de page pour ${contractId} dans ${sectionPath}`);
            
            // Utiliser la même logique que computeBuckets pour garantir la cohérence
            const { toCreate, blocked, examiner } = computeBuckets(contracts);
            
            let sectionData = [];
            
            // Sélectionner les données de la section appropriée
            if (sectionPath.includes('/create')) {
                sectionData = toCreate;
            } else if (sectionPath.includes('/blocked')) {
                sectionData = blocked;
            } else if (sectionPath.includes('/examiner')) {
                sectionData = examiner;
            }
            
            // Trier par date de soumission (plus récent d'abord) comme dans le Dashboard
            sectionData = sectionData
                .filter(c => c.dateMiseEnService || c.dateSoumission) // Filtrer les contrats avec une date
                .sort((a, b) => {
                    const dateA = dayjs(a.dateMiseEnService || a.dateSoumission);
                    const dateB = dayjs(b.dateMiseEnService || b.dateSoumission);
                    return dateB.diff(dateA);
                });
            
            // Trouver l'index du contrat
            const contractIndex = sectionData.findIndex(c => c.numeroContrat === contractId);
            const pageNumber = contractIndex >= 0 ? Math.floor(contractIndex / 10) + 1 : 1;
            
            console.log(`🔍 Header - Résultat calcul page pour ${contractId}:`);
            console.log(`  - Section: ${sectionPath}`);
            console.log(`  - Total contrats dans section: ${sectionData.length}`);
            console.log(`  - Index du contrat: ${contractIndex}`);
            console.log(`  - Page calculée: ${pageNumber}`);
            console.log(`  - 5 premiers contrats:`, sectionData.slice(0, 5).map(c => ({ id: c.numeroContrat, action: c.actionConseiller, state: c.state })));
            
            return pageNumber;
        };

        // Fonction pour afficher la notification de rappel
        const showContractReminderNotification = (reminderData) => {
            try {
                console.log('🔍 Header - Affichage de la pop-up pour:', reminderData.contractId);
                console.log('🔍 Header - Données complètes du rappel:', reminderData);
                
                // Afficher une pop-up d'alerte visible
                const clientName = reminderData.contractInfo ? 
                    `${reminderData.contractInfo.prenom || ''} ${reminderData.contractInfo.nom || ''}`.trim() : 
                    'Client';
                
                console.log('🔍 Header - Nom du client extrait:', clientName);
                console.log('🔍 Header - Création de la pop-up...');
                
                // Créer une pop-up d'alerte personnalisée
                const alertDiv = document.createElement('div');
                alertDiv.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                    color: white;
                    padding: 30px 40px;
                    border-radius: 15px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    z-index: 10000;
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    text-align: center;
                    min-width: 400px;
                    animation: alertPulse 0.5s ease-in-out infinite alternate;
                    border: 3px solid #ffffff;
                `;
                
                alertDiv.innerHTML = `
                    <div style="font-size: 48px; margin-bottom: 15px;">📞</div>
                    <div style="font-weight: bold; font-size: 20px; margin-bottom: 10px;">APPEL CLIENT À EFFECTUER</div>
                    <div style="margin: 15px 0; font-size: 16px;">
                        <strong>Client:</strong> ${clientName}<br>
                        <strong>Contrat:</strong> ${reminderData.contractId}
                    </div>
                    <div style="margin-top: 20px; font-size: 14px; opacity: 0.9;">
                        Vous avez un appel prévu avec ce client !
                    </div>
                    <button onclick="this.parentElement.remove()" style="
                        margin-top: 20px;
                        padding: 12px 30px;
                        background: white;
                        color: #ee5a24;
                        border: none;
                        border-radius: 8px;
                        font-weight: bold;
                        cursor: pointer;
                        font-size: 16px;
                    ">OK</button>
                `;
                
                console.log('🔍 Header - Pop-up créée, ajout au DOM...');
                
                // Ajouter l'animation CSS
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes alertPulse {
                        from { transform: translate(-50%, -50%) scale(1); }
                        to { transform: translate(-50%, -50%) scale(1.05); }
                    }
                `;
                document.head.appendChild(style);
                
                // Ajouter la pop-up au body
                document.body.appendChild(alertDiv);
                
                console.log('🔍 Header - Pop-up ajoutée au body !');
                
                // Son de notification (si disponible)
                try {
                    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
                    audio.play().catch(() => {}); // Ignorer les erreurs de lecture audio
                } catch (e) {}
                
                // Retirer automatiquement après 10 secondes
                setTimeout(() => {
                    if (alertDiv.parentElement) {
                        alertDiv.remove();
                        console.log('🔍 Header - Pop-up retirée automatiquement');
                    }
                }, 10000);
                
                // Retirer le rappel de la liste
                try {
                    const reminders = JSON.parse(localStorage.getItem('contractReminders') || '[]');
                    const updatedReminders = reminders.filter(r => r.contractId !== reminderData.contractId);
                    localStorage.setItem('contractReminders', JSON.stringify(updatedReminders));
                    console.log('🔍 Header - Rappel supprimé de la liste');
                } catch (error) {
                    console.error('Erreur lors de la suppression du rappel:', error);
                }
                
            } catch (error) {
                console.error('🔍 Header - Erreur lors de l\'affichage de la pop-up:', error);
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
        
        // Ajouter la fonction de pop-up pour les tests
        window.showContractReminderNotification = showContractReminderNotification;
        
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
    }, [contracts, navigate]);

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
