import useBackofficeBuckets from '../hooks/useBackofficeBuckets';
import StatsBar from '../components/StatsBar';
import ContractTable from '../components/ContractTable';

export default function BlockedPage() {
    const { blocked, totals, refresh } = useBackofficeBuckets();
    return (
        <>
            <StatsBar totals={totals} />
            <ContractTable data={blocked} title="Cas bloqués" mode="blocked" onChangedList={refresh} />
        </>
    );
}
