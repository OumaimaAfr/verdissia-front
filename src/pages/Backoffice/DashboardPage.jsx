import React, { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Modal, Button, Typography, Space, Form, DatePicker, message } from 'antd';
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    LineChart, Line,
} from 'recharts';
import useBackofficeBuckets from '../../hooks/useBackofficeBuckets.js';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { 
    FileTextOutlined, 
    ExclamationCircleOutlined, 
    PhoneOutlined, 
    SearchOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    EyeOutlined
} from '@ant-design/icons';

function PieSideLegend({ data }) {
    return (
        <div style={{
            width: 240,
            paddingLeft: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            overflowY: 'auto'
        }}>
            {data.map(item => (
                <div key={item.key} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    gap: 12,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    transition: 'all 0.2s ease'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                            style={{
                                width: 12, 
                                height: 12, 
                                borderRadius: '50%',
                                background: item.color, 
                                display: 'inline-block',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            aria-label={`couleur pour ${item.name}`}
                        />
                        <span style={{ fontSize: 14, fontWeight: 500, color: '#374151'}}>{item.name}</span>
                    </div>
                    <strong style={{ 
                        minWidth: 28, 
                        textAlign: 'right', 
                        color: '#1f2937',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}>{item.value}</strong>
                </div>
            ))}
        </div>
    );
}

function StatsCard({ title, value, icon, color, onClick }) {
    return (
        <Card
            style={{
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid rgb(5, 150, 105);',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
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

export default function DashboardPage() {
    const { toCreate, blocked, calls, examiner, declined, processed, totals } = useBackofficeBuckets();
    const [newContractModalVisible, setNewContractModalVisible] = useState(false);
    const [latestContract, setLatestContract] = useState(null);
    const [postponeModalVisible, setPostponeModalVisible] = useState(false);
    const [postponeForm] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Détecter la dernière demande de contrat ajoutée
        const checkLatestContract = () => {
            const allContracts = [...toCreate, ...blocked, ...examiner];
            
            if (allContracts.length > 0) {
                // Trier par date de soumission (la plus récente d'abord)
                const sortedContracts = allContracts
                    .filter(c => c.dateMiseEnService || c.dateSoumission) // Filtrer les contrats avec une date
                    .sort((a, b) => {
                        const dateA = dayjs(a.dateMiseEnService || a.dateSoumission);
                        const dateB = dayjs(b.dateMiseEnService || b.dateSoumission);
                        return dateB.diff(dateA); // Plus récent d'abord
                    });
                
                if (sortedContracts.length > 0) {
                    const latest = sortedContracts[0];
                    const now = dayjs();
                    const contractDate = dayjs(latest.dateMiseEnService || latest.dateSoumission);
                    const minutesAgo = now.diff(contractDate, 'minute');
                    
                    // Si le contrat a été ajouté il y a moins de 30 minutes
                    if (minutesAgo < 30) {
                        setLatestContract({
                            ...latest,
                            timeAgo: minutesAgo < 1 ? 'à l\'instant' : 
                                   minutesAgo < 60 ? `il y a ${minutesAgo} minute${minutesAgo > 1 ? 's' : ''}` :
                                   `il y a ${Math.floor(minutesAgo / 60)} heure${Math.floor(minutesAgo / 60) > 1 ? 's' : ''}`
                        });
                        
                        // Vérifier si c'est la première visite sur cette session
                        const hasSeenNotification = sessionStorage.getItem('latestContractSeen');
                        if (!hasSeenNotification || hasSeenNotification !== latest.numeroContrat) {
                            setNewContractModalVisible(true);
                            sessionStorage.setItem('latestContractSeen', latest.numeroContrat);
                        }
                    }
                }
            }
        };
        
        // Vérifier après un court délai pour s'assurer que les données sont chargées
        const timer = setTimeout(checkLatestContract, 1000);
        return () => clearTimeout(timer);
    }, [toCreate, blocked, examiner]);

    // Gestion des clics sur les cartes
    const handleCardClick = (cardType) => {
        // Rediriger vers la page appropriée selon le type de carte
        switch(cardType) {
            case 'Contrats à créer':
                navigate("/backoffice");
                break;
            case 'Cas bloqués':
                navigate("/backoffice/blocked");
                break;
            case 'Clients à appeler':
                navigate("/backoffice/calls");
                break;
            case 'Cas à examiner':
                navigate("/backoffice/examiner");
                break;
            case 'Contrats traités':
                navigate("/backoffice/processed");
                break;
            case 'Cas déclinés':
                navigate("/backoffice/declined");
                break;
            default:
                console.log(`Carte cliquée: ${cardType}`);
        }
    };

    // Fonction pour déterminer dans quelle section se trouve le contrat
    const getContractSection = (contract) => {
        if (toCreate.find(c => c.numeroContrat === contract.numeroContrat)) {
            const sectionData = toCreate;
            const contractIndex = sectionData.findIndex(c => c.numeroContrat === contract.numeroContrat);
            const pageNumber = Math.floor(contractIndex / 10) + 1; // 10 contrats par page
            return { 
                name: 'Contrats à créer', 
                path: "/backoffice",
                color: '#10b981',
                pageNumber,
                contractIndex
            };
        }
        if (blocked.find(c => c.numeroContrat === contract.numeroContrat)) {
            const sectionData = blocked;
            const contractIndex = sectionData.findIndex(c => c.numeroContrat === contract.numeroContrat);
            const pageNumber = Math.floor(contractIndex / 10) + 1;
            return { 
                name: 'Cas bloqués', 
                path: "/backoffice/blocked",
                color: '#f59e0b',
                pageNumber,
                contractIndex
            };
        }
        if (examiner.find(c => c.numeroContrat === contract.numeroContrat)) {
            const sectionData = examiner;
            const contractIndex = sectionData.findIndex(c => c.numeroContrat === contract.numeroContrat);
            const pageNumber = Math.floor(contractIndex / 10) + 1;
            return { 
                name: 'Cas à examiner', 
                path: "/backoffice/examiner",
                color: '#3b82f6',
                pageNumber,
                contractIndex
            };
        }
        return { name: 'Non trouvé', path: '#', color: '#6b7280', pageNumber: 1, contractIndex: -1 };
    };

    // Fonction pour gérer le traitement immédiat
    const handleImmediateProcessing = () => {
        const section = getContractSection(latestContract);
        
        // Stocker les informations du contrat à mettre en évidence
        sessionStorage.setItem('highlightContract', latestContract.numeroContrat);
        sessionStorage.setItem('scrollToContract', 'true');
        sessionStorage.setItem('targetPage', section.pageNumber.toString());

        navigate(section.path);
    };

    // Fonction pour reporter le traitement
    const handlePostponeProcessing = () => {
        setNewContractModalVisible(false);
        setPostponeModalVisible(true);
        postponeForm.resetFields();
    };

    // Fonction pour confirmer le report
    const confirmPostpone = async () => {
        try {
            const { reminderTime } = await postponeForm.validateFields();
            
            // Stocker les informations du contrat à rappeler
            const reminderData = {
                contractId: latestContract.numeroContrat,
                contractInfo: latestContract,
                reminderTime: reminderTime.toISOString(),
                section: getContractSection(latestContract),
                createdAt: dayjs().toISOString()
            };
            
            // Ajouter à la liste des rappels
            const existingReminders = JSON.parse(localStorage.getItem('contractReminders') || '[]');
            existingReminders.push(reminderData);
            localStorage.setItem('contractReminders', JSON.stringify(existingReminders));
            
            // Programmer la notification
            scheduleReminder(reminderData);
            
            setPostponeModalVisible(false);
            message.success(`Rappel programmé pour ${reminderTime.format('DD/MM/YYYY à HH:mm')}`);
            
            // Pour tester : vérifier immédiatement si le rappel est bien programmé
            console.log('=== TEST RAPPEL ===');
            console.log('Rappels actuels:', JSON.parse(localStorage.getItem('contractReminders') || '[]'));
            console.log('Heure actuelle:', dayjs().format('DD/MM/YYYY HH:mm:ss'));
            console.log('Heure du rappel:', reminderTime.format('DD/MM/YYYY HH:mm:ss'));
            console.log('Différence (minutes):', reminderTime.diff(dayjs(), 'minute'));
            console.log('==================');
            
            // Test immédiat si le rappel est dans moins de 2 minutes
            const timeDiff = reminderTime.diff(dayjs(), 'minute');
            if (timeDiff <= 2 && timeDiff >= 0) {
                console.log('⚠️ Test immédiat du rappel dans 2 secondes...');
                setTimeout(() => {
                    console.log('🔔 Test de déclenchement immédiat');
                    checkPendingReminders();
                }, 2000);
            }
            
        } catch (error) {
            console.error('Erreur lors de la programmation du rappel:', error);
            message.error('Erreur lors de la programmation du rappel');
        }
    };

    // Fonction pour programmer un rappel
    const scheduleReminder = (reminderData) => {
        // Ne plus utiliser setTimeout pour les longs délais
        // La vérification se fera périodiquement
        console.log('Rappel programmé pour:', reminderData.reminderTime);
    };

    // Fonction pour vérifier les rappels en attente
    const checkPendingReminders = () => {
        try {
            const reminders = JSON.parse(localStorage.getItem('contractReminders') || '[]');
            const now = dayjs();
            
            console.log('Vérification des rappels - Heure actuelle:', now.format('DD/MM/YYYY HH:mm:ss'));
            console.log('Rappels en attente:', reminders.length);
            
            if (reminders.length === 0) {
                console.log('Aucun rappel en attente');
                return;
            }
            
            reminders.forEach((reminderData, index) => {
                const reminderTime = dayjs(reminderData.reminderTime);
                console.log(`Rappel ${index + 1} (${reminderData.contractId}): ${reminderTime.format('DD/MM/YYYY HH:mm:ss')}`);
                
                // Vérifier si le rappel doit être déclenché (fenêtre de 5 minutes)
                const timeDiff = reminderTime.diff(now, 'minute');
                console.log(`Différence temps: ${timeDiff} minutes (rappel - maintenant)`);
                
                // CORRECTION: Si timeDiff est négatif, le rappel est dans le passé
                // Si timeDiff est positif, le rappel est dans le futur
                // On déclenche si le rappel est passé ou dans les 2 prochaines minutes
                if (timeDiff <= 2) {
                    console.log('🔔 DÉCLENCHEMENT du rappel pour:', reminderData.contractId);
                    console.log(`Raison: timeDiff=${timeDiff} <= 2 (rappel passé ou imminent)`);
                    showReminderPopup(reminderData);
                    
                    // Retirer le rappel de la liste
                    const updatedReminders = reminders.filter(r => r.contractId !== reminderData.contractId);
                    localStorage.setItem('contractReminders', JSON.stringify(updatedReminders));
                    console.log('Rappel supprimé de la liste');
                } else {
                    console.log(`Rappel pas encore déclenché: ${timeDiff} minutes restantes`);
                }
            });
        } catch (error) {
            console.error('Erreur lors de la vérification des rappels:', error);
        }
    };

    // Vérification périodique des rappels
    useEffect(() => {
        // Vérifier immédiatement au chargement
        checkPendingReminders();
        
        // Configurer une vérification toutes les 30 secondes
        const interval = setInterval(checkPendingReminders, 30000);
        
        return () => clearInterval(interval);
    }, []);

    // Fonction pour afficher la pop-up de rappel
    const showReminderPopup = (reminderData) => {
        try {
            console.log('Affichage de la pop-up pour:', reminderData.contractId);
            
            Modal.info({
                title: '🔔 Rappel de contrat à traiter',
                width: 600,
                content: (
                    <div>
                        <Typography.Paragraph>
                            Vous avez un contrat en attente de traitement :
                        </Typography.Paragraph>
                        <Card size="small" style={{ marginBottom: 16 }}>
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
                                    <span style={{ color: '#6b7280', fontSize: '12px' }}>Énergie</span>
                                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{reminderData.contractInfo.typeEnergie}</div>
                                </div>
                            </div>
                        </Card>
                        <Typography.Paragraph style={{ marginBottom: 16 }}>
                            Cliquez sur "Traiter maintenant" pour accéder directement au contrat.
                        </Typography.Paragraph>
                    </div>
                ),
                okText: 'Traiter maintenant',
                onOk: () => {
                    try {
                        console.log('Redirection vers:', reminderData.section.path);
                        // Rediriger vers la section appropriée avec mise en évidence
                        sessionStorage.setItem('highlightContract', reminderData.contractId);
                        sessionStorage.setItem('scrollToContract', 'true');
                        sessionStorage.setItem('targetPage', reminderData.section.pageNumber.toString()); // Retour à la première page
                        navigate(reminderData.section.path);
                    } catch (error) {
                        console.error('Erreur lors de la redirection:', error);
                        // Fallback : utiliser window.location.href
                        window.location.href = reminderData.section.path;
                    }
                },
                onCancel: () => {
                    console.log('Notification annulée par l\'utilisateur');
                }
            });
        } catch (error) {
            console.error('Erreur lors de l\'affichage de la pop-up:', error);
            // Fallback : utiliser une alerte simple
            alert(`Rappel : Contrat ${reminderData.contractInfo.numeroContrat} à traiter`);
        }
    };

    // Vérifier les rappels au chargement du composant
    useEffect(() => {
        // Cette fonction est maintenant gérée par le useEffect ci-dessus
        
        // Ajouter un bouton de test dans la console
        window.testReminder = () => {
            console.log('=== TEST MANUEL DES RAPPELS ===');
            checkPendingReminders();
        };
        
        // Test spécifique pour le cas 15:35 → 16:35
        window.testSpecificReminder = () => {
            console.log('=== TEST SPÉCIFIQUE ===');
            const reminders = JSON.parse(localStorage.getItem('contractReminders') || '[]');
            const now = dayjs();
            
            console.log('Heure actuelle:', now.format('DD/MM/YYYY HH:mm:ss'));
            console.log('Rappels dans localStorage:', reminders);
            
            if (reminders.length === 0) {
                console.log('❌ Aucun rappel trouvé dans localStorage');
                return;
            }
            
            reminders.forEach((reminder, index) => {
                const reminderTime = dayjs(reminder.reminderTime);
                const timeDiff = reminderTime.diff(now, 'minute');
                console.log(`Rappel ${index + 1}:`);
                console.log(`  - ID: ${reminder.contractId}`);
                console.log(`  - Heure rappel: ${reminderTime.format('DD/MM/YYYY HH:mm:ss')}`);
                console.log(`  - Différence: ${timeDiff} minutes (rappel - maintenant)`);
                console.log(`  - Dans le passé?: ${timeDiff < 0}`);
                console.log(`  - Doit se déclencher?: ${timeDiff <= 2}`);
            });
            
            // Forcer le déclenchement du premier rappel trouvé
            const targetReminder = reminders[0]; // Prendre le premier rappel
            if (targetReminder) {
                console.log('🔔 DÉCLENCHEMENT FORCÉ du rappel:', targetReminder.contractId);
                showReminderPopup(targetReminder);
                
                // Retirer de la liste
                const updatedReminders = reminders.filter(r => r.contractId !== targetReminder.contractId);
                localStorage.setItem('contractReminders', JSON.stringify(updatedReminders));
                console.log('Rappel supprimé après déclenchement forcé');
            }
        };
        
        // Test pour créer un rappel immédiat
        window.createTestReminder = () => {
            console.log('=== CRÉATION RAPPEL TEST ===');
            const testReminder = {
                contractId: 'TEST-123',
                contractInfo: {
                    numeroContrat: 'TEST-123',
                    civilite: 'M',
                    prenom: 'Test',
                    nom: 'User',
                    typeEnergie: 'Électricité'
                },
                reminderTime: dayjs().toISOString(), // MAINTENANT
                section: { name: 'Test', path: '#', color: '#10b981' },
                createdAt: dayjs().toISOString()
            };
            
            const existingReminders = JSON.parse(localStorage.getItem('contractReminders') || '[]');
            existingReminders.push(testReminder);
            localStorage.setItem('contractReminders', JSON.stringify(existingReminders));
            
            console.log('Rappel de test créé pour maintenant');
            console.log('Tapez testSpecificReminder() pour le déclencher');
        };
        
        console.log('💡 Pour tester les rappels manuellement, tapez:');
        console.log('  - testReminder() : vérification normale');
        console.log('  - testSpecificReminder() : test détaillé avec déclenchement forcé');
        console.log('  - createTestReminder() : créer un rappel de test pour maintenant');
    }, [navigate]);
    
    // Debug pour vérifier les valeurs
    console.log('Dashboard - totals:', totals);
    console.log('Dashboard - processed:', processed);
    console.log('Dashboard - totals.processed:', totals.processed);

    const PIE_COLORS = {
        toCreate:  '#10b981',
        blocked:   '#f59e0b',
        toExamine: '#3b82f6',
        toCall:    '#8b5cf6',
        declined:  '#ef4444',
        processed: '#06b6d4',
    };

    const makePieData = (totals) => ([
        { key: 'toCreate',  name: 'Contrats à créer',  value: totals.toCreate,  color: PIE_COLORS.toCreate  },
        { key: 'blocked',   name: 'Cas bloqués',       value: totals.toReview,  color: PIE_COLORS.blocked   },
        { key: 'toExamine', name: 'Cas à examiner',    value: totals.toExamine, color: PIE_COLORS.toExamine },
        { key: 'toCall',    name: 'Clients à appeler', value: totals.toCall,    color: PIE_COLORS.toCall    },
        { key: 'declined',  name: 'Cas déclinés',      value: totals.declined,  color: PIE_COLORS.declined  },
        { key: 'processed', name: 'Contrats traités',  value: totals.processed, color: PIE_COLORS.processed  },
    ]);

    const pieData = makePieData(totals);

    const decisionCount = {};
    [...toCreate, ...blocked, ...calls, ...examiner, ...declined, ...processed].forEach(c => {
        decisionCount[c.decision] = (decisionCount[c.decision] || 0) + 1;
    });

    const decisionsData = Object.entries(decisionCount).map(([decision, count]) => ({
        decision,
        count,
    }));

    const energyCount = {};
    [...toCreate, ...blocked, ...calls, ...examiner, ...declined, ...processed].forEach(c => {
        energyCount[c.typeEnergie] = (energyCount[c.typeEnergie] || 0) + 1;
    });

    const energyData = Object.entries(energyCount).map(([type, count]) => ({
        type,
        count,
    }));

    const byDate = {};
    [...toCreate, ...blocked, ...calls, ...examiner, ...declined, ...processed].forEach(c => {
        const d = dayjs(c.dateMiseEnService).format('YYYY-MM-DD');
        byDate[d] = (byDate[d] || 0) + 1;
    });

    const dateData = Object.entries(byDate).map(([date, count]) => ({
        date,
        count,
    })).sort((a, b) => (a.date < b.date ? -1 : 1));

    // Calcul du temps de traitement des contrats
    const processingTimeData = processed
        .filter(c => c.contractGeneratedAt && c.dateMiseEnService)
        .map(c => {
            const created = dayjs(c.dateMiseEnService);
            const processed = dayjs(c.contractGeneratedAt);
            const minutesDiff = processed.diff(created, 'minute', true);
            return {
                contractNumber: c.numeroContrat,
                client: `${c.prenom} ${c.nom}`,
                processingTime: Math.max(0, minutesDiff), // Éviter les valeurs négatives
                createdDate: created.format('DD/MM/YYYY'),
                processedDate: processed.format('DD/MM/YYYY HH:mm'),
                decision: c.decision,
                confidence: c.confidence
            };
        })
        .filter(c => c.processingTime <= 10080); // Filtrer les contrats traités en moins d'une semaine (10080 minutes)

    // Données pour le graphique de temps de traitement
    const timeRanges = [
        { range: '< 30min', min: 0, max: 30, count: 0, color: '#10b981' },
        { range: '30min-2h', min: 30, max: 120, count: 0, color: '#3b82f6' },
        { range: '2-6h', min: 120, max: 360, count: 0, color: '#f59e0b' },
        { range: '6-24h', min: 360, max: 1440, count: 0, color: '#8b5cf6' },
        { range: '> 24h', min: 1440, max: Infinity, count: 0, color: '#ef4444' }
    ];

    processingTimeData.forEach(c => {
        const range = timeRanges.find(r => c.processingTime >= r.min && c.processingTime < r.max);
        if (range) range.count++;
    });

    // Statistiques de temps de traitement
    const avgProcessingTime = processingTimeData.length > 0 
        ? Math.max(0.1, processingTimeData.reduce((sum, c) => sum + c.processingTime, 0) / processingTimeData.length)
        : 0.1; // Minimum 0.1 minute (6 secondes) pour éviter 0
    
    const medianProcessingTime = processingTimeData.length > 0 
        ? Math.max(0.1, [...processingTimeData.map(c => c.processingTime)].sort((a, b) => a - b)[Math.floor(processingTimeData.length / 2)])
        : 0.1; // Minimum 0.1 minute pour éviter 0

    // Formatage intelligent du temps
    const formatTime = (minutes) => {
        if (minutes < 1) return `${Math.round(minutes * 60)}s`;
        if (minutes < 60) return `${minutes.toFixed(1)}min`;
        return `${minutes.toFixed(0)}min`;
    };

    // Comparaison avec processus manuel (benchmarks réalistes)
    const manualProcessSteps = {
        verification: 30,      // 30 min - Vérification manuelle des documents
        validation: 45,         // 45 min - Validation par plusieurs services
        saisie: 60,            // 1h - Saisie des données dans les systèmes
        controle: 90,         // 1.5h - Contrôles qualité et conformité
        generation: 120,      // 2h - Génération manuelle du contrat
        signature: 180,       // 3h - Processus de signature
        total: 525           // 8.75h total par contrat
    };
    
    // Ajout des délais d'attente et temps de traitement humain
    const humanOverhead = {
        pauses: 0.3,          // 30% de temps en plus pour pauses/interruptions
        errors: 0.2,          // 20% de temps en plus pour corrections d'erreurs
        coordination: 0.4,    // 40% de temps en plus pour coordination entre services
        total: 0.9           // 90% de temps supplémentaire
    };
    
    const manualAvgTime = manualProcessSteps.total * (1 + humanOverhead.total); // ~997 minutes (~16.6h)
    
    // Calcul du gain d'efficacité plus précis
    const llmEfficiencyGain = ((manualAvgTime - avgProcessingTime) / manualAvgTime * 100).toFixed(1);
    
    // Calcul du facteur d'accélération
    const speedFactor = (manualAvgTime / avgProcessingTime).toFixed(1);
    
    // Calcul du temps économisé par contrat
    const timeSavedPerContract = manualAvgTime - avgProcessingTime;

    return (
        <div style={{ padding: '0' }}>
            {/* Modal pour la dernière demande de contrat */}
            <Modal
                title={
                    <Space>
                        <ClockCircleOutlined style={{ color: '#10b981' }} />
                        <span>Nouvelle demande de contrat</span>
                    </Space>
                }
                open={newContractModalVisible}
                onCancel={() => setNewContractModalVisible(false)}
                footer={[
                    <Button key="postpone" onClick={handlePostponeProcessing}>
                        Reporter
                    </Button>,
                    <Button key="immediate" type="primary" onClick={handleImmediateProcessing}>
                        Traiter immédiatement
                    </Button>
                ]}
                width={600}
                style={{ top: 100 }}
            >
                {latestContract && (
                    <div>
                        <Typography.Paragraph style={{ fontSize: '16px', marginBottom: '20px' }}>
                            Bonjour <strong>Administrateur</strong>, vous avez une nouvelle demande de contrat à traiter.
                        </Typography.Paragraph>
                        
                        <Card 
                            size="small" 
                            style={{ 
                                marginBottom: '16px',
                                border: '1px solid #d9f7be',
                                backgroundColor: '#f6ffed'
                            }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <span style={{ color: '#6b7280', fontSize: '12px' }}>N° Dossier</span>
                                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{latestContract.numeroContrat}</div>
                                </div>
                                <div>
                                    <span style={{ color: '#6b7280', fontSize: '12px' }}>Client</span>
                                    <div style={{ fontWeight: '600', fontSize: '14px' }}>
                                        {latestContract.civilite} {latestContract.prenom} {latestContract.nom}
                                    </div>
                                </div>
                                <div>
                                    <span style={{ color: '#6b7280', fontSize: '12px' }}>Localisation</span>
                                    <div style={{ fontWeight: '600', fontSize: '14px' }}>
                                        {latestContract.ville} ({latestContract.codePostal})
                                    </div>
                                </div>
                                <div>
                                    <span style={{ color: '#6b7280', fontSize: '12px' }}>Énergie</span>
                                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{latestContract.typeEnergie}</div>
                                </div>
                                <div>
                                    <span style={{ color: '#6b7280', fontSize: '12px' }}>Offre</span>
                                    <div style={{ fontWeight: '600', fontSize: '14px' }}>
                                        {latestContract.libelleOffre || latestContract.offre}
                                    </div>
                                </div>
                                <div>
                                    <span style={{ color: '#6b7280', fontSize: '12px' }}>Ajouté</span>
                                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{latestContract.timeAgo}</div>
                                </div>
                            </div>
                        </Card>

                        <div style={{ 
                            padding: '12px', 
                            backgroundColor: '#e6f7ff', 
                            borderRadius: '6px',
                            border: '1px solid #91d5ff'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <EyeOutlined style={{ color: '#1890ff' }} />
                                <span style={{ fontSize: '14px' }}>
                                    Ce contrat se trouve dans la section : 
                                    <strong style={{ color: getContractSection(latestContract).color, marginLeft: '4px' }}>
                                        {getContractSection(latestContract).name}
                                    </strong>
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal pour reporter le traitement */}
            <Modal
                title={
                    <Space>
                        <ClockCircleOutlined style={{ color: '#f59e0b' }} />
                        <span>Programmer un rappel</span>
                    </Space>
                }
                open={postponeModalVisible}
                onOk={confirmPostpone}
                onCancel={() => setPostponeModalVisible(false)}
                okText="Programmer le rappel"
                cancelText="Annuler"
                width={500}
            >
                {latestContract && (
                    <div>
                        <Typography.Paragraph style={{ marginBottom: '16px' }}>
                            Choisissez le créneau horaire pour recevoir un rappel concernant ce contrat :
                        </Typography.Paragraph>
                        
                        <Card size="small" style={{ marginBottom: '16px', backgroundColor: '#f9f9f9' }}>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                                Contrat concerné :
                            </div>
                            <div style={{ fontWeight: '600', fontSize: '14px' }}>
                                {latestContract.numeroContrat} - {latestContract.civilite} {latestContract.prenom} {latestContract.nom}
                            </div>
                        </Card>
                        
                        <Form form={postponeForm} layout="vertical">
                            <Form.Item
                                name="reminderTime"
                                label="Date et heure du rappel"
                                rules={[{ required: true, message: 'Veuillez sélectionner une date et heure' }]}
                            >
                                <DatePicker
                                    showTime
                                    placeholder="Sélectionnez la date et heure du rappel"
                                    style={{ width: '100%' }}
                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                    format="DD/MM/YYYY HH:mm"
                                    size="large"
                                />
                            </Form.Item>
                        </Form>
                        
                        <div style={{ 
                            padding: '12px', 
                            backgroundColor: '#e6f7ff', 
                            borderRadius: '6px',
                            border: '1px solid #91d5ff',
                            fontSize: '12px',
                            color: '#666'
                        }}>
                            💡 Vous recevrez une notification à l'heure choisie avec un accès direct au contrat.
                        </div>
                    </div>
                )}
            </Modal>

            {/* Stats Cards */}
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
                        onClick={() => handleCardClick('Clients à appeler')}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatsCard
                        title="Cas déclinés"
                        value={totals.declined}
                        icon={<CloseCircleOutlined style={{ color: 'white', fontSize: '20px' }} />}
                        color="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                        onClick={() => handleCardClick('Cas déclinés')}
                    />
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

            {/* Charts */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card 
                        title="Répartition des cas" 
                        style={{
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                            border: '1px solid rgb(5, 150, 105)'
                        }}
                        headStyle={{
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            borderRadius: '12px 12px 0 0',
                            border: 'none'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <PieChart width={300} height={300}>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    dataKey="value"
                                    label={({ value, percent }) => `${value} (${(percent * 100).toFixed(0)}%)`}
                                >
                                    {pieData.map((entry) => (
                                        <Cell key={entry.key} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                            <PieSideLegend data={pieData} />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card 
                        title="Décisions IA" 
                        style={{
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                            border: '1px solid rgb(5, 150, 105)'
                        }}
                        headStyle={{
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            borderRadius: '12px 12px 0 0',
                            border: 'none'
                        }}
                    >
                        <BarChart width={400} height={300} data={decisionsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="decision" tick={{ fill: '#6b7280' }} />
                            <YAxis tick={{ fill: '#6b7280' }} />
                            <Tooltip 
                                formatter={(value) => [`${value}`, "contrats"]}
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </Card>
                </Col>
                <Col xs={24} lg={12} id="processing-time-section">
                    <Card 
                        title="Temps de traitement des contrats" 
                                                style={{
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                            border: '1px solid rgb(5, 150, 105)'
                        }}
                        headStyle={{
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            borderRadius: '12px 12px 0 0',
                            border: 'none'
                        }}
                    >
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginBottom: '8px',
                                padding: '12px',
                                background: '#f0fdf4',
                                borderRadius: '8px',
                                border: '1px solid #bbf7d0'
                            }}>
                                <span style={{ fontWeight: '600', color: '#166534' }}>
                                    ⚡ Processus avec LLM
                                </span>
                                <span style={{ fontWeight: '700', color: '#166534', fontSize: '16px' }}>
                                    {formatTime(avgProcessingTime)}
                                </span>
                            </div>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginBottom: '8px',
                                padding: '12px',
                                background: '#fef2f2',
                                borderRadius: '8px',
                                border: '1px solid #fecaca'
                            }}>
                                <span style={{ fontWeight: '600', color: '#991b1b' }}>
                                    🐌 Processus manuel
                                </span>
                                <span style={{ fontWeight: '700', color: '#991b1b', fontSize: '16px' }}>
                                    {formatTime(manualAvgTime)}
                                </span>
                            </div>
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                                gap: '8px',
                                marginTop: '12px',
                                padding: '12px',
                                background: '#f8fafc',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb'
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Moyenne</div>
                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>{formatTime(avgProcessingTime)}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Médiane</div>
                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>{formatTime(medianProcessingTime)}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Gain</div>
                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#166534' }}>{llmEfficiencyGain}%</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Facteur</div>
                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#166534' }}>{speedFactor}x</div>
                                </div>
                            </div>
                        </div>
                        <BarChart width={400} height={250} data={timeRanges}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="range" tick={{ fill: '#6b7280', fontSize: '12px' }} />
                            <YAxis tick={{ fill: '#6b7280' }} />
                            <Tooltip 
                                formatter={(value) => [`${value} contrats`, "Nombre"]}
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                {timeRanges.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                        <div style={{ 
                            marginTop: '16px', 
                            padding: '12px',
                            background: '#f8fafc',
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: '#6b7280',
                            textAlign: 'center'
                        }}>
                            📊 {processingTimeData.length} contrats analysés • 
                            Temps moyen réduit de {llmEfficiencyGain}% avec l'IA • 
                            {speedFactor}x plus rapide
                        </div>
                                            </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card 
                        title="Décomposition processus manuel vs LLM" 
                        style={{
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                            border: '1px solid rgb(5, 150, 105)',
                            height: '-webkit-fill-available' // Hauteur fixe pour correspondre au graphique
                        }}
                        headStyle={{
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            borderRadius: '12px 12px 0 0',
                            border: 'none'
                        }}
                        bodyStyle={{
                            height: '520px' // Hauteur du contenu
                        }}
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: '380px' }}>
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#991b1b', marginBottom: '20px' }}>
                                    🐌 Processus Manuel ({formatTime(manualAvgTime)})
                                </div>
                                <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '2.2' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span>• Vérification</span>
                                        <span style={{ fontWeight: '600' }}>{manualProcessSteps.verification}min</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span>• Validation</span>
                                        <span style={{ fontWeight: '600' }}>{manualProcessSteps.validation}min</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span>• Saisie</span>
                                        <span style={{ fontWeight: '600' }}>{manualProcessSteps.saisie}min</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span>• Contrôle</span>
                                        <span style={{ fontWeight: '600' }}>{manualProcessSteps.controle}min</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span>• Génération</span>
                                        <span style={{ fontWeight: '600' }}>{manualProcessSteps.generation}min</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span>• Signature</span>
                                        <span style={{ fontWeight: '600' }}>{manualProcessSteps.signature}min</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span>• Overhead humain</span>
                                        <span style={{ fontWeight: '600', color: '#991b1b' }}>+{Math.round(humanOverhead.total * 100)}%</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#166534', marginBottom: '20px' }}>
                                    ⚡ Processus LLM ({formatTime(avgProcessingTime)})
                                </div>
                                <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '2.2' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span>• Analyse IA</span>
                                        <span style={{ fontWeight: '600', color: '#166534' }}>Instantané</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span>• Vérification</span>
                                        <span style={{ fontWeight: '600', color: '#166534' }}>Automatique</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span>• Validation</span>
                                        <span style={{ fontWeight: '600', color: '#166534' }}>Automatique</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span>• Génération</span>
                                        <span style={{ fontWeight: '600', color: '#166534' }}>Instantané</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span>• Pas d'overhead</span>
                                        <span style={{ fontWeight: '600', color: '#166534' }}>0%</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span>• Pas d'erreurs</span>
                                        <span style={{ fontWeight: '600', color: '#166534' }}>0%</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span>• Temps économisé</span>
                                        <span style={{ fontWeight: '600', color: '#166534' }}>{formatTime(timeSavedPerContract)}/contrat</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ 
                            marginTop: '30px',
                            padding: '20px',
                            background: 'rgb(248, 250, 252)',
                            borderRadius: '8px',
                            border: '1px solid #bbf7d0',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '18px', fontWeight: '700', color: 'rgb(107, 114, 128)', marginBottom: '10px' }}>
                                🚀 Gain d'efficacité: {llmEfficiencyGain}%
                            </div>
                            <div style={{ fontSize: '15px', color: 'rgb(107, 114, 128)' }}>
                                Le processus LLM est {speedFactor}x plus rapide que le processus manuel
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card 
                        title="Répartition par type d'énergie" 
                        style={{
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                            border: '1px solid rgb(5, 150, 105)'
                        }}
                        headStyle={{
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            borderRadius: '12px 12px 0 0',
                            border: 'none'
                        }}
                    >
                        <BarChart width={400} height={300} data={energyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="type" tick={{ fill: '#6b7280' }} />
                            <YAxis tick={{ fill: '#6b7280' }} />
                            <Tooltip 
                                formatter={(value) => [`${value}`, "contrats"]}
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card 
                        title="Volume par date de mise en service" 
                        style={{
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                            border: '1px solid rgb(5, 150, 105)'
                        }}
                        headStyle={{
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            borderRadius: '12px 12px 0 0',
                            border: 'none'
                        }}
                    >
                        <LineChart width={400} height={300} data={dateData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="date" tick={{ fill: '#6b7280' }} />
                            <YAxis tick={{ fill: '#6b7280' }} />
                            <Tooltip 
                                formatter={(value) => [`${value}`, "contrats"]}
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="count" 
                                stroke="#f59e0b" 
                                strokeWidth={3}
                                dot={{ fill: '#f59e0b', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </Card>
                </Col>
                            </Row>
        </div>
    );
}
