import { Drawer, Descriptions, Tag, Space, Typography } from 'antd';

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

function ContractDrawer({ open, onClose, record }) {
    if (!record) return null;
    const {
        civilite, nom, prenom, voie, codePostal, ville, email, telephone,
        typeEnergie, offre, libelleOffre, dateMiseEnService, decision, confidence,
        motifMessage, details, numeroContrat
    } = record;

    return (
        <Drawer
            title={<Space>
                <Typography.Text strong>Dossier</Typography.Text>
                <Typography.Text type="secondary">#{numeroContrat}</Typography.Text>
            </Space>}
            onClose={onClose}
            open={open}
            width={460}
        >
            <Descriptions size="small" column={1} bordered>
                <Descriptions.Item label="Client">
                    {civilite} {prenom} {nom}
                </Descriptions.Item>
                <Descriptions.Item label="Adresse">
                    {voie} — {codePostal} {ville}
                </Descriptions.Item>
                <Descriptions.Item label="Contact">
                    {email} — {telephone || '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Énergie / Offre">
                    {typeEnergie} — {offre} {libelleOffre ? `(${libelleOffre})` : ''}
                </Descriptions.Item>
                <Descriptions.Item label="Mise en service">
                    {dateMiseEnService}
                </Descriptions.Item>
                <Descriptions.Item label="Décision">
                    {decisionTag(decision)}
                </Descriptions.Item>
                <Descriptions.Item label="Confiance IA">
                    {confidence ?? '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Motif">
                    {motifMessage || '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Détails">
                    {details || '—'}
                </Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
}

export default ContractDrawer;
