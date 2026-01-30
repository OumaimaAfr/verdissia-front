import useBackofficeBuckets from '../../hooks/useBackofficeBuckets.js';
import StatsBar from '../../components/StatsBar.jsx';
import ContractTable from '../../components/ContractTable.jsx';

export default function ContratsPage() {
    const { toCreate, totals, refresh } = useBackofficeBuckets();

    return (
        <>
            <StatsBar totals={totals} />
            <ContractTable
                data={toCreate}
                title="Contrats à créer"
                mode="create"
                onChangedList={refresh}
            />
        </>
    );
}
