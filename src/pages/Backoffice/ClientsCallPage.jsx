import React from "react";
import useBackofficeBuckets from '../../hooks/useBackofficeBuckets.js';
import StatsBar from '../../components/StatsBar.jsx';
import ContractTable from '../../components/ContractTable.jsx';

export default function ClientsCallPage() {
    const { calls, totals, refresh } = useBackofficeBuckets();

    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
            <StatsBar totals={totals} />
            <ContractTable data={calls} title="Clients à appeler" mode="calls" onChangedList={refresh} />
        </>
    );
}
