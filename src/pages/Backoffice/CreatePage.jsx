import ContractTable from '../../components/ContractTable.jsx';
import useBackofficeBuckets from '../../hooks/useBackofficeBuckets.js';

export default function CreatePage() {
    const { toCreate } = useBackofficeBuckets();

    return (
        <div style={{ padding: '0 24px' }}>
            <ContractTable 
                data={toCreate}
                title="Contrats à créer"
                mode="create"
            />
        </div>
    );
}
