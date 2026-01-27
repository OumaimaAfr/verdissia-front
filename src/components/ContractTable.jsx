import { useMemo, useState } from 'react';
import { Table, Tag, Space, Button, Input, Dropdown, message, Modal, Form, Typography } from 'antd';
import { EyeOutlined, PhoneOutlined, FilePdfOutlined, CloseCircleOutlined, FileSearchOutlined, MoreOutlined, PlusCircleOutlined } from '@ant-design/icons';
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
    };
    const d = map[decision] || { color: 'default', text: decision || '—' };
    return <Tag color={d.color}>{d.text}</Tag>;
};

export default function ContractTable({
                                          data,
                                          title,
                                          mode = 'generic', // 'create' | 'blocked' | 'calls' | 'declined' | 'examiner'
                                          onChangedList,
                                      }) {
    const [query, setQuery] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    // Decline modal
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

    const openDrawer = (record) => { setSelected(record); setDrawerOpen(true); };
    const closeDrawer = () => { setDrawerOpen(false); setSelected(null); };

    // Actions helpers
    const moveToCalls = (record) => {
        setWorkflowState(record.numeroContrat, STATES.CALLS, { movedAt: dayjs().toISOString() });
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
            // validation fail
        }
    };

    // Colonnes
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
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            width: (mode === 'declined' || mode === 'examiner') ? 120 : 190,
            render: (_, record) => {
                if (mode === 'create') {
                    // Contrats à créer: Voir + PDF
                    return (
                        <Space>
                            <Button icon={<EyeOutlined />} onClick={() => openDrawer(record)}>Voir</Button>
                            <Button type="primary" icon={<FilePdfOutlined />} onClick={() => {
                                openAndDownloadContract(record);
                            }}>
                                Créer contrat
                            </Button>
                        </Space>
                    );
                }

                if (mode === 'blocked') {
                    // Cas bloqués: Voir + Vérifier (→ examiner) + Appeler + Décliner
                    return (
                        <Space>
                            <Button icon={<EyeOutlined />} onClick={() => openDrawer(record)}>
                                Voir
                            </Button>
                            <Button icon={<FileSearchOutlined />} onClick={() => {
                                moveToExaminer(record);
                            }}>
                                Vérifier
                            </Button>
                            <Button type="primary" icon={<PhoneOutlined />} onClick={() => moveToCalls(record)}>
                                Appeler
                            </Button>
                            <Button danger icon={<CloseCircleOutlined />} onClick={() => askDecline(record)}>
                                Décliner
                            </Button>
                        </Space>
                    );
                }

                if (mode === 'examiner') {
                    // Cas à examiner: Vérifier (Drawer) + Appeler (→ calls) + Décliner (→ declined)
                    return (
                        <Space>
                            <Button icon={<FileSearchOutlined />} onClick={() => openDrawer(record)}>
                                Vérifier
                            </Button>
                            <Button type="primary" icon={<PhoneOutlined />} onClick={() => moveToCalls(record)}>
                                Appeler
                            </Button>
                            <Button danger icon={<CloseCircleOutlined />} onClick={() => askDecline(record)}>
                                Décliner
                            </Button>
                        </Space>
                    );
                }

                if (mode === 'calls') {
                    // Clients à appeler: Voir + (Créer contrat → toCreate) + Décliner
                    return (
                        <Space>
                            <Button icon={<EyeOutlined />} onClick={() => openDrawer(record)}>Voir</Button>
                            <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => moveToToCreate(record)}>
                                Créer contrat
                            </Button>
                            <Button danger icon={<CloseCircleOutlined />} onClick={() => askDecline(record)}>
                                Décliner
                            </Button>
                        </Space>
                    );
                }

                if (mode === 'declined') {
                    // Cas déclinés: Voir seulement
                    return (
                        <Space>
                            <Button icon={<EyeOutlined />} onClick={() => openDrawer(record)}>Voir</Button>
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
        </>
    );
}
