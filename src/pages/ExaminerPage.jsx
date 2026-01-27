import useBackofficeBuckets from '../hooks/useBackofficeBuckets';
import StatsBar from '../components/StatsBar';
import ContractTable from '../components/ContractTable';

export default function ExaminerPage() {
    const { examiner, totals, refresh } = useBackofficeBuckets();
    return (
        <>
            <StatsBar totals={totals} />
            <ContractTable data={examiner} title="Cas à examiner" mode="examiner" onChangedList={refresh} />
        </>
    );
}
