import useBackofficeBuckets from '../hooks/useBackofficeBuckets';
import StatsBar from '../components/StatsBar';
import ContractTable from '../components/ContractTable';

export default function DeclinedPage() {
    const { declined, totals, refresh } = useBackofficeBuckets();

    return (
        <>
            <StatsBar totals={totals} />
            <ContractTable data={declined} title="Cas déclinés" mode="declined" onChangedList={refresh} />
        </>
    );
}
