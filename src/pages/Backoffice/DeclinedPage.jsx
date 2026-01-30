import useBackofficeBuckets from '../../hooks/useBackofficeBuckets.js';
import StatsBar from '../../components/StatsBar.jsx';
import ContractTable from '../../components/ContractTable.jsx';

export default function DeclinedPage() {
    const { declined, totals, refresh } = useBackofficeBuckets();

    return (
        <>
            <StatsBar totals={totals} />
            <ContractTable data={declined} title="Cas déclinés" mode="declined" onChangedList={refresh} />
        </>
    );
}
