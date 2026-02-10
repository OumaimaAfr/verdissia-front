import { useMemo, useState, useEffect, useCallback } from 'react';
import { Table, Tag, Space, Button, Input, Dropdown, message, Modal, Form, Typography, Select, DatePicker, notification } from 'antd';
import { EyeOutlined, PhoneOutlined, FilePdfOutlined, CloseCircleOutlined, FileSearchOutlined, MoreOutlined, PlusCircleOutlined, BellOutlined } from '@ant-design/icons';
import ContractDrawer from './ContractDrawer';
import { openAndDownloadContract } from '../utils/contractPdf';
import { setState as setWorkflowState, STATES } from '../utils/workflowStore';
import dayjs from 'dayjs';

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
    const [api, contextHolder] = notification.useNotification();
    
    const openNotification = useCallback((clientName, callbackTime) => {
        api.info({
            message: `📞 Rappel client imminent`,
            description: (
                <div>
                    <strong>{clientName}</strong> attend un appel dans moins de 10 minutes.<br />
                    Heure de rappel : <strong>{dayjs(callbackTime).format('HH:mm')}</strong>
                </div>
            ),
            placement: 'topRight',
            duration: 0, // La notification reste jusqu'à ce qu'elle soit fermée manuellement
        });
    }, [api]);

    const [query, setQuery] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const [declineOpen, setDeclineOpen] = useState(false);
    const [declineTarget, setDeclineTarget] = useState(null);
    const [form] = Form.useForm();
    
    // Missing information modal state
    const [missingInfoOpen, setMissingInfoOpen] = useState(false);
    const [missingInfoTarget, setMissingInfoTarget] = useState(null);
    const [missingInfoForm] = Form.useForm();
    
    // Call result modal state
    const [callResultOpen, setCallResultOpen] = useState(false);
    const [callResultTarget, setCallResultTarget] = useState(null);
    const [callResultForm] = Form.useForm();
    const [selectedNextAction, setSelectedNextAction] = useState(null);
    const [notifiedCallbacks, setNotifiedCallbacks] = useState(new Set());

    // Check for upcoming callbacks every minute
    useEffect(() => {
        const checkCallbacks = () => {
            const now = dayjs();
            const inTenMinutes = now.add(10, 'minute');
            
            data.forEach(record => {
                if (record.nextAction === 'callback_later' && record.callbackDateTime) {
                    const callbackTime = dayjs(record.callbackDateTime);
                    const callbackKey = `${record.numeroContrat}-${record.callbackDateTime}`;
                    
                    // Check if callback is within the next 10 minutes and not already notified
                    if (callbackTime.isAfter(now) && 
                        callbackTime.isBefore(inTenMinutes) && 
                        !notifiedCallbacks.has(callbackKey)) {
                        
                        const clientName = `${record.prenom || ''} ${record.nom || ''}`.trim();
                        openNotification(clientName, record.callbackDateTime);
                        
                        // Add to notified callbacks
                        setNotifiedCallbacks(prev => new Set([...prev, callbackKey]));
                    }
                    
                    // Remove from notified callbacks if the callback time has passed
                    if (callbackTime.isBefore(now) && notifiedCallbacks.has(callbackKey)) {
                        setNotifiedCallbacks(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(callbackKey);
                            return newSet;
                        });
                    }
                }
            });
        };

        // Check immediately and then every minute
        checkCallbacks();
        const interval = setInterval(checkCallbacks, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [data, openNotification, notifiedCallbacks]);

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

    const openDrawer = (record) => { setSelected(record); setDrawerOpen(true); };
    const closeDrawer = () => { setDrawerOpen(false); setSelected(null); };

    const moveToCalls = (record, reason = '') => {
        setWorkflowState(record.numeroContrat, STATES.CALLS, { 
            movedAt: dayjs().toISOString(),
            callReason: reason
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
        onChangedList?.();
    };

    const askDecline = (record) => {
        setDeclineTarget(record);
        form.resetFields();
        setDeclineOpen(true);
    };

    const askMissingInfo = (record) => {
        setMissingInfoTarget(record);
        missingInfoForm.resetFields();
        setMissingInfoOpen(true);
    };

    const confirmMissingInfo = async () => {
        try {
            const { missingInfo } = await missingInfoForm.validateFields();
            const customReason = `Information manquante: ${missingInfo}`;
            moveToCalls(missingInfoTarget, customReason);
            setMissingInfoOpen(false);
            message.success('Ajouté à "Clients à appeler" avec motif personnalisé');
        } catch {
        }
    };

    const markAsCalled = (record) => {
        setCallResultTarget(record);
        callResultForm.resetFields();
        setSelectedNextAction(null);
        setCallResultOpen(true);
    };

    const confirmCallResult = async () => {
        try {
            const { callStatus, callNotes, nextAction, callbackDateTime } = await callResultForm.validateFields();
            const updateData = {
                callStatus,
                callNotes,
                nextAction,
                calledAt: dayjs().toISOString(),
                calledBy: 'conseiller'
            };
            
            // Add callback datetime if "callback_later" is selected
            if (nextAction === 'callback_later' && callbackDateTime) {
                updateData.callbackDateTime = callbackDateTime.toISOString();
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
            calledBy: null
        });
        message.success('Statut d\'appel réinitialisé');
        onChangedList?.();
    };

    const moveToProcessed = (record) => {
        setWorkflowState(record.numeroContrat, STATES.PROCESSED, { 
            processedAt: dayjs().toISOString(),
            processedBy: 'conseiller'
        });
        message.success('Contrat créé et ajouté à "Contrats traités"');
        onChangedList?.();
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
        ...(mode === 'calls' ? [{
            title: 'Motif appel',
            dataIndex: 'callReason',
            key: 'callReason',
            width: 180,
            render: (reason) => {
                if (!reason) return '—';
                
                // Handle custom missing information reasons
                if (reason.startsWith('Information manquante: ')) {
                    const customInfo = reason.replace('Information manquante: ', '');
                    return (
                        <Tag color="cyan">
                            ❓ Info manquante: {customInfo}
                        </Tag>
                    );
                }
                
                const reasonConfig = {
                    'Adresse incohérente': { color: 'orange', icon: '📍' },
                    'Téléphone invalide': { color: 'red', icon: '📞' },
                    'Email à confirmer': { color: 'blue', icon: '📧' },
                    'Date non standard': { color: 'purple', icon: '📅' },
                    'Information manquante': { color: 'cyan', icon: '❓' },
                };
                
                const config = reasonConfig[reason] || { color: 'default', icon: '📞' };
                
                return (
                    <Tag color={config.color}>
                        {config.icon} {reason}
                    </Tag>
                );
            },
        }] : []),
        ...(mode === 'calls' ? [{
            title: 'Statut appel',
            dataIndex: 'callStatus',
            key: 'callStatus',
            width: 120,
            render: (status, record) => {
                if (!status) {
                    return <Tag color="default">⏳ En attente</Tag>;
                }
                
                const statusConfig = {
                    'success': { color: 'green', icon: '✅', text: 'Réussi' },
                    'no_answer': { color: 'orange', icon: '📞', text: 'Pas de réponse' },
                    'wrong_number': { color: 'red', icon: '❌', text: 'Mauvais numéro' },
                    'callback': { color: 'blue', icon: '🔄', text: 'Rappel demandé' },
                    'not_interested': { color: 'volcano', icon: '🚫', text: 'Pas intéressé' },
                    'postponed': { color: 'purple', icon: '⏰', text: 'Reporté' },
                };
                
                const config = statusConfig[status] || { color: 'default', icon: '❓', text: status };
                
                return (
                    <div>
                        <Tag color={config.color}>
                            {config.icon} {config.text}
                        </Tag>
                        {record.calledAt && (
                            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                                {dayjs(record.calledAt).format('DD/MM HH:mm')}
                            </div>
                        )}
                        {record.nextAction === 'callback_later' && record.callbackDateTime && (
                            <div style={{ fontSize: '11px', color: '#1890ff', marginTop: '2px', fontWeight: 'bold' }}>
                                📅 Rappel: {dayjs(record.callbackDateTime).format('DD/MM HH:mm')}
                            </div>
                        )}
                    </div>
                );
            },
        }] : []),
        ...(mode === 'calls' ? [{
            title: 'Notifications',
            key: 'notifications',
            width: 120,
            render: (_, record) => {
                if (record.nextAction === 'callback_later' && record.callbackDateTime) {
                    const now = dayjs();
                    const callbackTime = dayjs(record.callbackDateTime);
                    const inTenMinutes = now.add(10, 'minute');
                    
                    if (callbackTime.isAfter(now) && callbackTime.isBefore(inTenMinutes)) {
                        return (
                            <Tag color="red" icon={<BellOutlined />}>
                                ⚠️ Imminent
                            </Tag>
                        );
                    } else if (callbackTime.isAfter(now)) {
                        const timeUntil = callbackTime.diff(now, 'minutes');
                        return (
                            <Tag color="orange" icon={<BellOutlined />}>
                                📅 {timeUntil}min
                            </Tag>
                        );
                    } else {
                        return (
                            <Tag color="default">
                                ⏰ Expiré
                            </Tag>
                        );
                    }
                }
                return null;
            },
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
                dataIndex: 'processedAt',
                key: 'processedAt',
                width: 180,
                render: (v) => v ? dayjs(v).format('DD/MM/YYYY HH:mm') : '—',
            }
        ] : []),
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            width: (mode === 'declined' || mode === 'examiner') ? 120 : (mode === 'processed') ? 190 : (mode === 'calls') ? 440 : 190,
            render: (_, record) => {
                if (mode === 'create') {
                    // Contrats à créer: Voir + PDF
                    return (
                        <Space>
                            <Button icon={<EyeOutlined />} onClick={() => openDrawer(record)}>Voir</Button>
                            <Button type="primary" icon={<FilePdfOutlined />} onClick={() => {
                                openAndDownloadContract(record);
                                moveToProcessed(record);
                            }}>
                                Créer contrat
                            </Button>
                        </Space>
                    );
                }

                if (mode === 'blocked') {
                    return (
                        <Space>
                            <Button icon={<EyeOutlined />} onClick={() => openDrawer(record)}>
                                Voir
                            </Button>
                            <Button variant="solid" color="cyan" icon={<FileSearchOutlined />} onClick={() => {
                                moveToExaminer(record);
                            }}>
                                Vérifier
                            </Button>
                            <Dropdown menu={{ 
                                items: [
                                    { key: 'address', label: '📍 Adresse incohérente', onClick: () => moveToCalls(record, 'Adresse incohérente') },
                                    { key: 'phone', label: '📞 Téléphone invalide', onClick: () => moveToCalls(record, 'Téléphone invalide') },
                                    { key: 'email', label: '📧 Email à confirmer', onClick: () => moveToCalls(record, 'Email à confirmer') },
                                    { key: 'date', label: '📅 Date non standard', onClick: () => moveToCalls(record, 'Date non standard') },
                                    { key: 'missing', label: '❓ Information manquante', onClick: () => askMissingInfo(record) },
                                ]
                            }}>
                                <Button variant="solid" color="geekblue" icon={<PhoneOutlined />}>
                                    Appeler
                                </Button>
                            </Dropdown>
                            <Button variant="solid" color="volcano" icon={<CloseCircleOutlined />} onClick={() => askDecline(record)}>
                                Décliner
                            </Button>
                        </Space>
                    );
                }

                if (mode === 'examiner') {
                    return (
                        <Space>
                            <Button variant="solid" color="cyan" icon={<FileSearchOutlined />} onClick={() => openDrawer(record)}>
                                Vérifier
                            </Button>
                            <Dropdown menu={{ 
                                items: [
                                    { key: 'address', label: '📍 Adresse incohérente', onClick: () => moveToCalls(record, 'Adresse incohérente') },
                                    { key: 'phone', label: '📞 Téléphone invalide', onClick: () => moveToCalls(record, 'Téléphone invalide') },
                                    { key: 'email', label: '📧 Email à confirmer', onClick: () => moveToCalls(record, 'Email à confirmer') },
                                    { key: 'date', label: '📅 Date non standard', onClick: () => moveToCalls(record, 'Date non standard') },
                                    { key: 'missing', label: '❓ Information manquante', onClick: () => askMissingInfo(record) },
                                ]
                            }}>
                                <Button variant="solid" color="geekblue" icon={<PhoneOutlined />}>
                                    Appeler
                                </Button>
                            </Dropdown>
                            <Button variant="solid" color="volcano" icon={<CloseCircleOutlined />} onClick={() => askDecline(record)}>
                                Décliner
                            </Button>
                        </Space>
                    );
                }

                if (mode === 'calls') {
                    const isRejected = record.decision === 'REJET';
                    const hasBeenCalled = record.callStatus;
                    
                    return (
                        <Space>
                            <Button icon={<EyeOutlined />} onClick={() => openDrawer(record)}>Voir</Button>
                            
                            {!hasBeenCalled ? (
                                <Button type="primary" icon={<PhoneOutlined />} onClick={() => markAsCalled(record)}>
                                    Appeler
                                </Button>
                            ) : (
                                <Dropdown menu={{ 
                                    items: [
                                        { key: 'recall', label: '🔄 Rappeler', onClick: () => markAsCalled(record) },
                                        { key: 'reset', label: '↩️ Réinitialiser', onClick: () => resetCallStatus(record) },
                                    ]
                                }}>
                                    <Button icon={<PhoneOutlined />}>
                                        Options appel
                                    </Button>
                                </Dropdown>
                            )}
                            
                            {!isRejected && (
                                <Button 
                                    type="primary" 
                                    icon={<PlusCircleOutlined />} 
                                    onClick={() => moveToToCreate(record)}
                                    disabled={hasBeenCalled !== 'success'}
                                    title={hasBeenCalled === 'success' ? 'Appel réussi requis' : ''}
                                >
                                    Créer contrat
                                </Button>
                            )}
                            
                            <Button danger icon={<CloseCircleOutlined />} onClick={() => askDecline(record)}>
                                Décliner
                            </Button>
                        </Space>
                    );
                }

                if (mode === 'declined') {
                    return (
                        <Space>
                            <Button icon={<EyeOutlined />} onClick={() => openDrawer(record)}>Voir</Button>
                        </Space>
                    );
                }

                if (mode === 'processed') {
                    return (
                        <Space>
                            <Button icon={<EyeOutlined />} onClick={() => openDrawer(record)}>Voir</Button>
                            <Button type="primary" icon={<FilePdfOutlined />} onClick={() => {
                                openAndDownloadContract(record);
                            }}>
                                Télécharger PDF
                            </Button>
                        </Space>
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
            {contextHolder}
            <div style={{ marginBottom: 20, marginTop: 25, display:'flex', gap: 90, alignItems:'center' }}>
                <h3 style={{ margin: 0 }}>{title}</h3>
                <Search
                    placeholder="Rechercher (nom, email, ville, n°…)"
                    onSearch={setQuery}
                    onChange={(e) => setQuery(e.target.value)}
                    allowClear
                    style={{ width: 360 }}
                />
            </div>

            <Table
                rowKey={(r) => r.numeroContrat}
                columns={columns}
                dataSource={filtered}
                pagination={{ pageSize: 10 }}
            />

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
                okText="Ajouter à appeler"
                cancelText="Annuler"
            >
                <Typography.Paragraph>
                    Merci d'indiquer <strong>quelle information manque</strong>. Ceci aidera le conseiller à se préparer pour l'appel.
                </Typography.Paragraph>
                <Form form={missingInfoForm} layout="vertical">
                    <Form.Item
                        name="missingInfo"
                        label="Information manquante"
                        rules={[{ required: true, message: 'Veuillez préciser l\'information manquante' }]}
                    >
                        <Input.TextArea 
                            rows={3} 
                            maxLength={200} 
                            showCount 
                            placeholder="Ex: Numéro de compte bancaire, Revenu mensuel, Justificatif de domicile..." 
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
