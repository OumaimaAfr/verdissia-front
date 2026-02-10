import React from "react";
import useBackofficeBuckets from '../../hooks/useBackofficeBuckets.js';
import StatsBar from '../../components/StatsBar.jsx';
import ContractTable from '../../components/ContractTable.jsx';

export default function ProcessedContractsPage() {
    const { processed, totals, refresh } = useBackofficeBuckets();

    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
            <StatsBar totals={totals} />
            <ContractTable
                data={processed}
                title="Contrats traités"
                mode="processed"
                onChangedList={refresh}
            />
        </>
    );
}
