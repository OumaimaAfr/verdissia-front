import useBackofficeBuckets from '../../hooks/useBackofficeBuckets.js';
import StatsBar from '../../components/StatsBar.jsx';
import ContractTable from '../../components/ContractTable.jsx';

export default function ExaminerPage() {
    const { examiner, totals, refresh } = useBackofficeBuckets();
    return (
        <>
            <StatsBar totals={totals} />
            <ContractTable data={examiner} title="Cas à examiner" mode="examiner" onChangedList={refresh} />
        </>
    );
}
