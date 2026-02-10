import { useMemo, useState, useEffect, useRef } from 'react';
import { Table, Tag, Space, Button, Input, Dropdown, message, Modal, Form, Typography, Card, Select, DatePicker } from 'antd';
import { EyeOutlined, PhoneOutlined, FilePdfOutlined, CloseCircleOutlined, FileSearchOutlined, MoreOutlined, PlusCircleOutlined, PushpinOutlined, BellOutlined } from '@ant-design/icons';
import ContractDrawer from './ContractDrawer';
import { openAndDownloadContract } from '../utils/contractPdf';
import { setState as setWorkflowState, STATES } from '../utils/workflowStore';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';

const { Search } = Input;

const decisionTag = (decision) => {
    const map = {
        'VALIDE': { color: 'green', text: 'VALIDE' },
        'EXAMINER': { color: 'orange', text: 'À EXAMINER' },
        'REJET': { color: 'red', text: 'REJET' },
        'VÉRIFICATION_OBLIGATOIRE': { color: 'gold', text: 'VÉRIFICATION OBLIGATOIRE' },
        'EN_ATTENTE': { color: 'default', text: 'EN ATTENTE' },
    };
    const d = map[decision] || { color: 'default', text: decision || '—' };
    return <Tag color={d.color}>{d.text}</Tag>;
};

export default function ContractTable({
    data,
    title,
    mode = 'generic',
    onChangedList,
}) {
    const { pathname } = useLocation();
    const isBackofficeListPage = pathname.startsWith('/backoffice') && pathname !== '/backoffice/dashboard';
    const tableRef = useRef(null);

    const [query, setQuery] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [highlightedContractId, setHighlightedContractId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [declineOpen, setDeclineOpen] = useState(false);
    const [declineTarget, setDeclineTarget] = useState(null);
    const [form] = Form.useForm();

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return data;
        return data.filter(c => {
            const hay = [
                c.nom, c.prenom, c.ville, c.email, c.telephone,
                c.offre, c.libelleOffre, c.numeroContrat
            ].filter(Boolean).join(' ').toLowerCase();
            return hay.includes(q);
        });
    }, [data, query]);

    // Effet pour gérer la mise en évidence et le défilement
    useEffect(() => {
        if (isBackofficeListPage) {
            const contractToHighlight = sessionStorage.getItem('highlightContract');
            const shouldScroll = sessionStorage.getItem('scrollToContract');
            const targetPage = sessionStorage.getItem('targetPage');
            
            if (contractToHighlight && shouldScroll === 'true') {
                setHighlightedContractId(contractToHighlight);
                
                // Définir la page cible si spécifiée
                if (targetPage) {
                    const page = parseInt(targetPage, 10);
                    if (!isNaN(page) && page > 0) {
                        console.log(`🎯 ContractTable: Définition de la page cible: ${page}`);
                        setCurrentPage(page);
                    }
                }
                
                // Attendre que le tableau soit rendu et que la pagination soit appliquée
                setTimeout(() => {
                    const element = document.querySelector(`[data-row-key="${contractToHighlight}"]`);
                    if (element) {
                        console.log(`🎯 ContractTable: Élément trouvé pour ${contractToHighlight}`);
                        element.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                        
                        // Ajouter un effet de mise en évidence amélioré
                        element.style.backgroundColor = '#fff7e6';
                        element.style.borderLeft = '4px solid #fa8c16';
                        element.style.boxShadow = '0 0 10px rgba(250, 140, 22, 0.3)';
                        element.style.transition = 'all 0.3s ease';
                        element.style.position = 'relative';
                        
                        // Ajouter une icône de notification
                        const iconContainer = document.createElement('div');
                        iconContainer.style.cssText = `
                            position: absolute;
                            top: -8px;
                            right: -8px;
                            background: #fa8c16;
                            color: white;
                            border-radius: 50%;
                            width: 24px;
                            height: 24px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 12px;
                            z-index: 1000;
                            animation: pulse 2s infinite;
                            box-shadow: 0 2px 8px rgba(250, 140, 22, 0.4);
                        `;
                        iconContainer.innerHTML = '🔔';
                        element.style.position = 'relative';
                        element.appendChild(iconContainer);
                        
                        // Retirer la mise en évidence après 5 secondes
                        setTimeout(() => {
                            element.style.backgroundColor = '';
                            element.style.borderLeft = '';
                            element.style.boxShadow = '';
                            if (iconContainer.parentNode) {
                                iconContainer.parentNode.removeChild(iconContainer);
                            }
                        }, 5000);
                    } else {
                        console.log(`🎯 ContractTable: Élément NON trouvé pour ${contractToHighlight}`);
                    }
                    
                    // Nettoyer le sessionStorage
                    sessionStorage.removeItem('highlightContract');
                    sessionStorage.removeItem('scrollToContract');
                    sessionStorage.removeItem('targetPage');
                }, 1500); // Augmenté à 1500ms pour laisser le temps à la pagination de s'appliquer
            }
        }
    }, [isBackofficeListPage, filtered]);

    const openDrawer = (record) => { setSelected(record); setDrawerOpen(true); };
    const closeDrawer = () => { setDrawerOpen(false); setSelected(null); };

    const moveToCalls = (record, reason = 'À contacter') => {
        setWorkflowState(record.numeroContrat, STATES.CALLS, { 
            movedAt: dayjs().toISOString(),
            callReason: reason,
            callStatus: null,
            notifications: 'En attente d\'appel'
        });
        message.success('Ajouté à "Clients à appeler"');
        onChangedList?.();
    };

    const moveToToCreate = (record) => {
        setWorkflowState(record.numeroContrat, STATES.TO_CREATE, { movedAt: dayjs().toISOString() });
        message.success('Ajouté à "Contrats à créer"');
        onChangedList?.();
    };

    const moveToExaminer = (record) => {
        setWorkflowState(record.numeroContrat, STATES.EXAMINER, { movedAt: dayjs().toISOString() });
        message.success('Ajouté à "Cas à examiner"');
        onChangedList?.();
    };

    const moveToProcessed = (record) => {
        setWorkflowState(record.numeroContrat, STATES.PROCESSED, { contractGeneratedAt: dayjs().toISOString() });
        message.success('Ajouté à "Contrats traités"');
        onChangedList?.();
    };

    const askDecline = (record) => {
        setDeclineTarget(record);
        form.resetFields();
        setDeclineOpen(true);
    };

    const confirmDecline = async () => {
        try {
            const { motif } = await form.validateFields();
            setWorkflowState(declineTarget.numeroContrat, STATES.DECLINED, {
                motifRejet: motif,
                declinedAt: dayjs().toISOString()
            });
            message.success('Dossier décliné');
            setDeclineOpen(false);
            onChangedList?.();
        } catch {
        }
    };

    // Fonctions pour la gestion des appels
    const [callResultOpen, setCallResultOpen] = useState(false);
    const [callResultTarget, setCallResultTarget] = useState(null);
    const [callResultForm] = Form.useForm();
    const [selectedNextAction, setSelectedNextAction] = useState(null);

    // Fonctions pour la gestion des informations manquantes
    const [missingInfoOpen, setMissingInfoOpen] = useState(false);
    const [missingInfoTarget, setMissingInfoTarget] = useState(null);
    const [missingInfoForm] = Form.useForm();

    const markAsCalled = (record) => {
        setCallResultTarget(record);
        callResultForm.resetFields();
        setSelectedNextAction(null);
        setCallResultOpen(true);
    };

    const askMissingInfo = (record) => {
        setMissingInfoTarget(record);
        missingInfoForm.resetFields();
        setMissingInfoOpen(true);
    };

    const confirmMissingInfo = async () => {
        try {
            const { missingInfoType, missingInfoDetails } = await missingInfoForm.validateFields();
            const reason = `Information manquante: ${missingInfoType}${missingInfoDetails ? ` - ${missingInfoDetails}` : ''}`;
            moveToCalls(missingInfoTarget, reason);
            setMissingInfoOpen(false);
        } catch {
        }
    };

    const confirmCallResult = async () => {
        try {
            const { callStatus, callNotes, nextAction, callbackDateTime } = await callResultForm.validateFields();
            const updateData = {
                callStatus,
                callNotes,
                nextAction,
                calledAt: dayjs().toISOString(),
                calledBy: 'conseiller',
                notifications: callStatus === 'success' ? 'Appel réussi' : 'Appel terminé'
            };
            
            if (nextAction === 'callback_later' && callbackDateTime) {
                updateData.callbackDateTime = callbackDateTime.toISOString();
                updateData.notifications = 'Rappel prévu';
            }
            
            setWorkflowState(callResultTarget.numeroContrat, STATES.CALLS, updateData);
            setCallResultOpen(false);
            setSelectedNextAction(null);
            message.success('Appel enregistré avec succès');
            onChangedList?.();
        } catch {
        }
    };

    const resetCallStatus = (record) => {
        setWorkflowState(record.numeroContrat, STATES.CALLS, { 
            callStatus: null,
            callNotes: null,
            nextAction: null,
            calledAt: null,
            calledBy: null,
            notifications: 'En attente d\'appel'
        });
        message.success('Statut d\'appel réinitialisé');
        onChangedList?.();
    };

    const getActionBtnProps = (intent) => {
        if (!isBackofficeListPage) return {};

        const base = {
            size: 'middle',
            style: {
                borderRadius: 10,
                height: 30,
                fontWeight: 600,
                padding: '0 8px',
                fontSize: 11,
            },
        };

        if (intent === 'success') {
            return {
                ...base,
                type: 'primary',
                style: {
                    ...base.style,
                    background: '#10b981',
                },
            };
        }

        if (intent === 'info') {
            return {
                ...base,
                type: 'primary',
                style: {
                    ...base.style,
                    background: '#2563eb',
                },
            };
        }

        if (intent === 'warning') {
            return {
                ...base,
                style: {
                    ...base.style,
                    borderColor: '#f59e0b',
                    color: '#b45309',
                    background: '#fffbeb',
                },
            };
        }

        if (intent === 'danger') {
            return {
                ...base,
                danger: true,
            };
        }

        return base;
    };

    const actionSpaceProps = isBackofficeListPage ? {
        wrap: true,
        size: [8, 8],
        style: { maxWidth: 260 },
    } : undefined;

    const actionsWrap = (children) => {
        if (isBackofficeListPage) {
            return <div className="bo-actions-wrap" style={{ 
                display: 'flex',
                width: '100%',
                textAlign: 'right'
            }}>{children}</div>;
        }
        return <Space style={{ justifyContent: 'flex-end', width: '100%' }}>{children}</Space>;
    };

    const columns = [
        {
            title: 'N° Dossier',
            dataIndex: 'numeroContrat',
            key: 'numeroContrat',
            width: 130,
            render: (v) => <strong>{v}</strong>,
        },
        {
            title: 'Client',
            key: 'client',
            width: 165,
            render: (_, r) => `${r.civilite || ''} ${r.prenom || ''} ${r.nom || ''}`,
        },
        {
            title: 'Localisation',
            key: 'loc',
            width: 145,
            render: (_, r) => `${r.ville || ''} (${r.codePostal || ''})`,
        },
        {
            title: 'Énergie',
            dataIndex: 'typeEnergie',
            key: 'typeEnergie',
            width: 100,
        },
        {
            title: 'Offre',
            key: 'offre',
            width: 106,
            render: (_, r) => r.libelleOffre || r.offre || '—',
        },
        ...(mode !== 'declined' ? [{
            title: 'Décision',
            dataIndex: 'decision',
            key: 'decision',
            width: 74,
            render: (d) => decisionTag(d),
        }] : []),
        ...(mode !== 'declined' ? [{
            title: 'Score IA',
            dataIndex: 'confidence',
            key: 'confidence',
            width: 85,
            render: (c) => (c ?? '—'),
            sorter: (a, b) => (a.confidence ?? 0) - (b.confidence ?? 0),
        }] : []),
        ...(mode === 'declined' ? [
            {
                title: 'Motif rejet',
                dataIndex: 'motifRejet',
                key: 'motifRejet',
                width: 280,
                render: (v) => v || '—',
            },
            {
                title: 'Date rejet',
                dataIndex: 'declinedAt',
                key: 'declinedAt',
                width: 180,
                render: (v) => v ? dayjs(v).format('DD/MM/YYYY HH:mm') : '—',
            }
        ] : []),
        ...(mode === 'processed' ? [
            {
                title: 'Date traitement',
                dataIndex: 'contractGeneratedAt',
                key: 'contractGeneratedAt',
                width: 180,
                render: (v) => v ? dayjs(v).format('DD/MM/YYYY HH:mm') : '—',
            }
        ] : []),
        ...(mode === 'calls' ? [
            {
                title: 'Motif appel',
                dataIndex: 'callReason',
                key: 'callReason',
                width: 150,
                render: (v) => v ? <Tag icon={<PushpinOutlined style={{ color: '#ff4d4f' }} />} color="default">{v}</Tag> : '—',
            },
            {
                title: 'Statut appel',
                dataIndex: 'callStatus',
                key: 'callStatus',
                width: 150,
                render: (v) => {
                    if (!v) return '—';
                    const statusConfig = {
                        'success': { color: 'green', text: 'Réussi' },
                        'no_answer': { color: 'orange', text: 'Pas de réponse' },
                        'wrong_number': { color: 'red', text: 'Mauvais numéro' },
                        'callback': { color: 'blue', text: 'Rappel demandé' },
                        'not_interested': { color: 'gray', text: 'Pas intéressé' },
                        'postponed': { color: 'purple', text: 'Reporté' }
                    };
                    const config = statusConfig[v] || { color: 'default', text: v };
                    return <Tag color={config.color}>{config.text}</Tag>;
                },
            },
                    ] : []),
        {
            title: 'Actions',
            key: 'actions',
            fixed: isBackofficeListPage ? undefined : 'right',
            width: isBackofficeListPage ? 320 : ((mode === 'declined' || mode === 'examiner' || mode === 'processed') ? 120 : (mode === 'calls' ? 280 : 190)),
            align: 'right',
            render: (_, record) => {
                if (mode === 'create') {
                    return actionsWrap(
                        <>
                            <Button
                                icon={<EyeOutlined />}
                                onClick={() => openDrawer(record)}
                                {...getActionBtnProps('default')}
                            >
                                Voir
                            </Button>
                            <Button
                                icon={<FilePdfOutlined />}
                                onClick={() => moveToProcessed(record)}
                                {...getActionBtnProps('success')}
                            >
                                Créer contrat
                            </Button>
                        </>
                    );
                }

                if (mode === 'blocked') {
                    return actionsWrap(
                        <>
                            <Button
                                icon={<EyeOutlined />}
                                onClick={() => openDrawer(record)}
                                {...getActionBtnProps('default')}
                            >
                                Voir
                            </Button>
                            <Button
                                icon={<FileSearchOutlined />}
                                onClick={() => moveToExaminer(record)}
                                {...getActionBtnProps('warning')}
                            >
                                Vérifier
                            </Button>
                            <Dropdown 
                                menu={{ 
                                    items: [
                                        { key: 'address', label: '📍 Adresse incohérente', onClick: () => moveToCalls(record, 'Adresse incohérente') },
                                        { key: 'phone', label: '📞 Téléphone invalide', onClick: () => moveToCalls(record, 'Téléphone invalide') },
                                        { key: 'email', label: '📧 Email à confirmer', onClick: () => moveToCalls(record, 'Email à confirmer') },
                                        { key: 'date', label: '📅 Date non standard', onClick: () => moveToCalls(record, 'Date non standard') },
                                        { key: 'missing', label: '❓ Information manquante', onClick: () => askMissingInfo(record) },
                                    ]
                                }}
                            >
                                <Button
                                    icon={<PhoneOutlined />}
                                    {...getActionBtnProps('info')}
                                >
                                    Appeler
                                </Button>
                            </Dropdown>
                            <Button
                                icon={<CloseCircleOutlined />}
                                onClick={() => askDecline(record)}
                                {...getActionBtnProps('danger')}
                            >
                                Décliner
                            </Button>
                        </>
                    );
                }

                if (mode === 'examiner') {
                    return actionsWrap(
                        <>
                            <Button
                                icon={<FileSearchOutlined />}
                                onClick={() => openDrawer(record)}
                                {...getActionBtnProps('warning')}
                            >
                                Vérifier
                            </Button>
                            <Dropdown 
                                menu={{ 
                                    items: [
                                        { key: 'address', label: '📍 Adresse incohérente', onClick: () => moveToCalls(record, 'Adresse incohérente') },
                                        { key: 'phone', label: '📞 Téléphone invalide', onClick: () => moveToCalls(record, 'Téléphone invalide') },
                                        { key: 'email', label: '📧 Email à confirmer', onClick: () => moveToCalls(record, 'Email à confirmer') },
                                        { key: 'date', label: '📅 Date non standard', onClick: () => moveToCalls(record, 'Date non standard') },
                                        { key: 'missing', label: '❓ Information manquante', onClick: () => askMissingInfo(record) },
                                    ]
                                }}
                            >
                                <Button
                                    icon={<PhoneOutlined />}
                                    {...getActionBtnProps('info')}
                                >
                                    Appeler
                                </Button>
                            </Dropdown>
                            <Button
                                icon={<CloseCircleOutlined />}
                                onClick={() => askDecline(record)}
                                {...getActionBtnProps('danger')}
                            >
                                Décliner
                            </Button>
                        </>
                    );
                }

                if (mode === 'calls') {
                    const isRejected = record.decision === 'REJET';
                    const hasBeenCalled = record.callStatus;
                    
                    return actionsWrap(
                        <>
                            <Button
                                icon={<EyeOutlined />}
                                onClick={() => openDrawer(record)}
                                {...getActionBtnProps('default')}
                            >
                                Voir
                            </Button>
                            
                            {!hasBeenCalled ? (
                                <Button
                                    icon={<PhoneOutlined />}
                                    onClick={() => markAsCalled(record)}
                                    {...getActionBtnProps('info')}
                                >
                                    Appeler
                                </Button>
                            ) : (
                                <Dropdown 
                                    menu={{ 
                                        items: [
                                            { key: 'recall', label: '🔄 Rappeler', onClick: () => markAsCalled(record) },
                                            { key: 'reset', label: '↩️ Réinitialiser', onClick: () => resetCallStatus(record) },
                                        ]
                                    }}
                                >
                                    <Button
                                        icon={<PhoneOutlined />}
                                        {...getActionBtnProps('info')}
                                    >
                                        Options appel
                                    </Button>
                                </Dropdown>
                            )}
                            
                            {!isRejected && (
                                <Button 
                                    icon={<PlusCircleOutlined />}
                                    onClick={() => moveToToCreate(record)}
                                    disabled={hasBeenCalled !== 'success'}
                                    style={{
                                        ...getActionBtnProps('success').style,
                                        background: hasBeenCalled !== 'success' ? '#d1d5db' : '#10b981',
                                        borderColor: hasBeenCalled !== 'success' ? '#d1d5db' : '#10b981',
                                        color: hasBeenCalled !== 'success' ? '#6b7280' : 'white',
                                        cursor: hasBeenCalled !== 'success' ? 'not-allowed' : 'pointer'
                                    }}
                                    title={hasBeenCalled === 'success' ? 'Appel réussi requis' : ''}
                                >
                                    Créer contrat
                                </Button>
                            )}
                            
                            <Button
                                icon={<CloseCircleOutlined />}
                                onClick={() => askDecline(record)}
                                {...getActionBtnProps('danger')}
                            >
                                Décliner
                            </Button>
                        </>
                    );
                }

                if (mode === 'declined') {
                    return actionsWrap(
                        <>
                            <Button
                                icon={<EyeOutlined />}
                                onClick={() => openDrawer(record)}
                                {...getActionBtnProps('default')}
                            >
                                Voir
                            </Button>
                        </>
                    );
                }

                if (mode === 'processed') {
                    return actionsWrap(
                        <>
                            <Button
                                icon={<EyeOutlined />}
                                onClick={() => openDrawer(record)}
                                {...getActionBtnProps('default')}
                            >
                                Voir
                            </Button>
                            <Button
                                icon={<FilePdfOutlined />}
                                onClick={() => openAndDownloadContract(record)}
                                {...getActionBtnProps('success')}
                            >
                                Télécharger PDF
                            </Button>
                        </>
                    );
                }

                return (
                    <Dropdown menu={{ items: [{ key: 'view', icon: <EyeOutlined />, label: 'Voir', onClick: () => openDrawer(record) }] }}>
                        <Button icon={<MoreOutlined />} />
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <>
            <div style={isBackofficeListPage ? {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                marginBottom: 16,
                marginTop: 8,
                flexWrap: 'wrap'
            } : {
                marginBottom: 20,
                marginTop: 25,
                display: 'flex',
                gap: 90,
                alignItems: 'center'
            }}>
                <Typography.Title level={3} style={isBackofficeListPage ? { margin: 0, fontWeight: 700, color: '#111827' } : { margin: 0 }}>
                    {title}
                </Typography.Title>

                <Search
                    placeholder="Rechercher (nom, email, ville, n°…)"
                    onSearch={setQuery}
                    onChange={(e) => setQuery(e.target.value)}
                    allowClear
                    style={{ width: isBackofficeListPage ? 420 : 360, maxWidth: '100%' }}
                />
            </div>

            <Card
                bordered={false}
                style={isBackofficeListPage ? {
                    borderRadius: 12,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    overflow: 'hidden'
                } : undefined}
                styles={isBackofficeListPage ? { body: { padding: 0 } } : undefined}
            >
                <Table
                    ref={tableRef}
                    rowKey={(r) => r.numeroContrat}
                    columns={columns}
                    dataSource={filtered}
                    pagination={{ 
                        pageSize: 10,
                        current: currentPage,
                        onChange: (page) => setCurrentPage(page),
                        showSizeChanger: false,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} contrats`
                    }}
                    size={isBackofficeListPage ? 'middle' : 'large'}
                    className={isBackofficeListPage ? 'bo-contract-table' : undefined}
                    scroll={isBackofficeListPage ? { x: 1100 } : undefined}
                    rowClassName={(record) => {
                        if (highlightedContractId === record.numeroContrat) {
                            return 'highlighted-row';
                        }
                        return '';
                    }}
                    onRow={(record) => ({
                        'data-row-key': record.numeroContrat,
                    })}
                />
            </Card>

            {isBackofficeListPage && (
                <style>{`
                    .bo-actions-wrap {
                        display: flex;
                        flex-wrap: nowrap;
                        gap: 6px;
                        justify-content: flex-start;
                        max-width: 400px;
                        white-space: nowrap;
                        width: 100%;
                    }
                    .bo-actions-wrap .ant-btn {
                        flex: 0 0 auto;
                    }
                    .bo-contract-table .ant-table-thead > tr > th {
                        background: #f9fafb !important;
                        color: #374151;
                        font-weight: 600;
                    }
                    .bo-contract-table .ant-table-tbody > tr:hover > td {
                        background: #f0fdf4 !important;
                    }
                    .bo-contract-table .ant-table-cell {
                        border-bottom: 1px solid #f3f4f6;
                    }
                    .bo-contract-table .ant-table-cell:last-child {
                        text-align: left !important;
                        padding-left: 16px !important;
                        min-width: 280px;
                    }
                    .highlighted-row {
                        background-color: #fff7e6 !important;
                        border-left: 4px solid #fa8c16 !important;
                        animation: highlightPulse 2s ease-in-out;
                        position: relative !important;
                    }
                    @keyframes highlightPulse {
                        0% { background-color: #fff7e6; }
                        50% { background-color: #ffe7ba; }
                        100% { background-color: #fff7e6; }
                    }
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                `}</style>
            )}

            <ContractDrawer open={drawerOpen} onClose={closeDrawer} record={selected} />

            <Modal
                title="Décliner le dossier"
                open={declineOpen}
                onOk={confirmDecline}
                onCancel={() => setDeclineOpen(false)}
                okText="Confirmer le rejet"
                okButtonProps={{ danger: true }}
            >
                <Typography.Paragraph>
                    Merci d’indiquer le <strong>motif de rejet</strong>. Il apparaîtra dans <em>Cas déclinés</em>.
                </Typography.Paragraph>
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="motif"
                        label="Motif de rejet"
                        rules={[{ required: true, message: 'Le motif est obligatoire' }]}
                    >
                        <Input.TextArea rows={4} maxLength={500} showCount placeholder="Ex: Email invalide, Téléphone non conforme, Adresse incohérente..." />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Information manquante"
                open={missingInfoOpen}
                onOk={confirmMissingInfo}
                onCancel={() => setMissingInfoOpen(false)}
                okText="Confirmer"
                cancelText="Annuler"
                width={600}
            >
                <Typography.Paragraph>
                    Veuillez spécifier <strong>quelle information manque</strong> pour le dossier de {missingInfoTarget?.prenom} {missingInfoTarget?.nom}.
                </Typography.Paragraph>
                <Form form={missingInfoForm} layout="vertical">
                    <Form.Item
                        name="missingInfoType"
                        label="Type d'information manquante"
                        rules={[{ required: true, message: 'Veuillez sélectionner un type' }]}
                    >
                        <Select placeholder="Sélectionnez le type d'information manquante">
                            <Select.Option value="Adresse complète">📍 Adresse complète</Select.Option>
                            <Select.Option value="Code postal">📮 Code postal</Select.Option>
                            <Select.Option value="Ville">🏙️ Ville</Select.Option>
                            <Select.Option value="Numéro de téléphone">📞 Numéro de téléphone</Select.Option>
                            <Select.Option value="Adresse email">📧 Adresse email</Select.Option>
                            <Select.Option value="Revenus mensuels">💰 Revenus mensuels</Select.Option>
                            <Select.Option value="Situation professionnelle">💼 Situation professionnelle</Select.Option>
                            <Select.Option value="Numéro de compte bancaire">🏦 Numéro de compte bancaire</Select.Option>
                            <Select.Option value="Date de naissance">🎂 Date de naissance</Select.Option>
                            <Select.Option value="Lieu de naissance">📍 Lieu de naissance</Select.Option>
                            <Select.Option value="Pièce d'identité">🆔 Pièce d'identité</Select.Option>
                            <Select.Option value="Justificatif de domicile">🏠 Justificatif de domicile</Select.Option>
                            <Select.Option value="Autre">❓ Autre</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="missingInfoDetails"
                        label="Détails supplémentaires (optionnel)"
                    >
                        <Input.TextArea 
                            rows={3} 
                            maxLength={200} 
                            showCount 
                            placeholder="Précisez les détails si nécessaire..." 
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Résultat de l'appel"
                open={callResultOpen}
                onOk={confirmCallResult}
                onCancel={() => setCallResultOpen(false)}
                okText="Enregistrer"
                cancelText="Annuler"
                width={600}
            >
                <Typography.Paragraph>
                    Veuillez enregistrer le <strong>résultat de l'appel</strong> pour {callResultTarget?.prenom} {callResultTarget?.nom}.
                </Typography.Paragraph>
                <Form form={callResultForm} layout="vertical">
                    <Form.Item
                        name="callStatus"
                        label="Statut de l'appel"
                        rules={[{ required: true, message: 'Veuillez sélectionner un statut' }]}
                    >
                        <Select placeholder="Sélectionnez le résultat de l'appel">
                            <Select.Option value="success">✅ Appel réussi - Client intéressé</Select.Option>
                            <Select.Option value="no_answer">📞 Pas de réponse</Select.Option>
                            <Select.Option value="wrong_number">❌ Mauvais numéro</Select.Option>
                            <Select.Option value="callback">🔄 Rappel demandé par le client</Select.Option>
                            <Select.Option value="not_interested">🚫 Client pas intéressé</Select.Option>
                            <Select.Option value="postponed">⏰ Reporté à plus tard</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="callNotes"
                        label="Notes de l'appel"
                        rules={[{ required: true, message: 'Veuillez ajouter des notes' }]}
                    >
                        <Input.TextArea 
                            rows={3} 
                            maxLength={300} 
                            showCount 
                            placeholder="Détails de la conversation : informations confirmées, questions posées, prochaines étapes..." 
                        />
                    </Form.Item>
                    <Form.Item
                        name="nextAction"
                        label="Prochaine action"
                    >
                        <Select 
                            placeholder="Sélectionnez la prochaine action (optionnel)"
                            onChange={(value) => setSelectedNextAction(value)}
                        >
                            <Select.Option value="create_contract">Créer le contrat</Select.Option>
                            <Select.Option value="callback_later">Rappeler plus tard</Select.Option>
                            <Select.Option value="send_email">Envoyer un email</Select.Option>
                            <Select.Option value="decline">Décliner le dossier</Select.Option>
                            <Select.Option value="no_action">Aucune action immédiate</Select.Option>
                        </Select>
                    </Form.Item>
                    
                    {selectedNextAction === 'callback_later' && (
                        <Form.Item
                            name="callbackDateTime"
                            label="Date et heure de rappel"
                            rules={[{ required: true, message: 'Veuillez sélectionner une date de rappel' }]}
                        >
                            <DatePicker
                                showTime
                                placeholder="Sélectionnez la date et heure de rappel"
                                style={{ width: '100%' }}
                                disabledDate={(current) => current && current < dayjs().startOf('day')}
                                format="DD/MM/YYYY HH:mm"
                            />
                        </Form.Item>
                    )}
                </Form>
            </Modal>

        </>
    );
}
