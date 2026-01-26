import { useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import StatsBar from '../components/StatsBar';
import ContractTable from '../components/ContractTable';

function ContratsPage() {
    const { contracts } = useContext(AuthContext);

    const toCreate = contracts.filter(c => c.decision === "VALIDE");
    const toReview = contracts.filter(c => c.decision !== "VALIDE");

    return (
        <>
            <StatsBar totals={{
                toCreate: toCreate.length,
                toReview: toReview.length,
                toCall: 0
            }}/>
            <ContractTable data={toCreate} title="Contrats à créer" mode="create" />
        </>
    );
}

export default ContratsPage;
