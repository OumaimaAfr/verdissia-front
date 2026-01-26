import { useMemo, useState } from 'react';
import { Table, Tag, Space, Button, Input, Dropdown, message } from 'antd';
import { EyeOutlined, PhoneOutlined, MoreOutlined, FileSearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ContractDrawer from './ContractDrawer';
import { addCall } from '../utils/callsStore';

const { Search } = Input;

const decisionTag = (decision) => {
    const map = {
        'VALIDE': { color: 'green', text: 'VALIDE' },
        'EXAMINER': { color: 'orange', text: 'À EXAMINER' },
        'REJET': { color: 'red', text: 'REJET' },
        'VÉRIFICATION_OBLIGATOIRE': { color: 'gold', text: 'VÉRIFICATION OBLIGATOIRE' },
    };
    const d = map[decision] || { color: 'default', text: decision };
    return <Tag color={d.color}>{d.text}</Tag>;
};

function ContractTable({data, title, mode = 'generic', onRemovedFromCalls }) {
    const [query, setQuery] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selected, setSelected] = useState(null);

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

    const callClient = (record) => {
        addCall(record);
        message.success('Ajouté à "Clients à appeler"');
    };

    const columns = [
        {
            title: 'N° Dossier',
            dataIndex: 'numeroContrat',
            key: 'numeroContrat',
            width: 140,
            render: (v) => <strong>{v}</strong>,
        },
        {
            title: 'Client',
            key: 'client',
            width: 220,
            render: (_, r) => `${r.civilite || ''} ${r.prenom || ''} ${r.nom || ''}`,
        },
        {
            title: 'Localisation',
            key: 'loc',
            width: 220,
            render: (_, r) => `${r.ville || ''} (${r.codePostal || ''})`,
        },
        {
            title: 'Énergie',
            dataIndex: 'typeEnergie',
            key: 'typeEnergie',
            width: 130,
        },
        {
            title: 'Offre',
            key: 'offre',
            width: 220,
            render: (_, r) => r.libelleOffre || r.offre || '—',
        },
        {
            title: 'Décision',
            dataIndex: 'decision',
            key: 'decision',
            width: 170,
            render: (d) => decisionTag(d),
        },
        {
            title: 'Score IA',
            dataIndex: 'confidence',
            key: 'confidence',
            width: 100,
            render: (c) => (c ?? '—'),
            sorter: (a, b) => (a.confidence ?? 0) - (b.confidence ?? 0),
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            width: 230,
            render: (_, record) => {
                const items = [
                    {
                        key: 'examiner',
                        icon: <FileSearchOutlined />,
                        label: 'Examiner',
                        onClick: () => openDrawer(record),
                    },
                    {
                        key: 'rejeter',
                        icon: <CloseCircleOutlined />,
                        label: 'Rejeter',
                        onClick: () => {
                            // TODO: call backend reject if needed
                            message.info('Dossier marqué comme rejeté (mock)');
                        },
                    },
                ];

                return (
                    <Space>
                        <Button icon={<EyeOutlined />} onClick={() => openDrawer(record)}>
                            Voir
                        </Button>

                        {mode !== 'create' && (
                            <Button type="primary" icon={<PhoneOutlined />} onClick={() => callClient(record)}>
                                Appeler
                            </Button>
                        )}

                        <Dropdown menu={{ items }}>
                            <Button icon={<MoreOutlined />} />
                        </Dropdown>
                    </Space>
                );
            },
        },
    ];

    // In "Contrats à créer", we replace the "Appeler" by "Créer contrat"
    if (mode === 'create') {
        columns[columns.length - 1] = {
            ...columns[columns.length - 1],
            render: (_, record) => (
                <Space>
                    <Button icon={<EyeOutlined />} onClick={() => openDrawer(record)}>
                        Voir
                    </Button>
                    <Button type="primary" onClick={() => {
                        // TODO: backend create contract
                        message.success('Contrat créé (mock)');
                    }}>
                        Créer contrat
                    </Button>
                </Space>
            ),
        };
    }

    return (
        <>
            <div style={{ marginBottom: 12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
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
                pagination={{ pageSize: 10, showSizeChanger: true }}
                scroll={{ x: 1000 }}
            />

            <ContractDrawer open={drawerOpen} onClose={closeDrawer} record={selected} />
        </>
    );
}

export default ContractTable;