import useBackofficeBuckets from '../hooks/useBackofficeBuckets';
import StatsBar from '../components/StatsBar';
import ContractTable from '../components/ContractTable';

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
