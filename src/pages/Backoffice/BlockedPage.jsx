import useBackofficeBuckets from '../../hooks/useBackofficeBuckets.js';
import StatsBar from '../../components/StatsBar.jsx';
import ContractTable from '../../components/ContractTable.jsx';

export default function BlockedPage() {
    const { blocked, totals, refresh } = useBackofficeBuckets();
    return (
        <>
            <StatsBar totals={totals} />
            <ContractTable data={blocked} title="Cas bloqués" mode="blocked" onChangedList={refresh} />
        </>
    );
}
