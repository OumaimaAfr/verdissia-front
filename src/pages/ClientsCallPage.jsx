import { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import ContractTable from '../components/ContractTable';
import StatsBar from '../components/StatsBar';
import { getCalls, removeCall, clearCalls } from '../utils/callsStore';

function ClientsCallPage() {
    const [calls, setCalls] = useState([]);

    const refresh = () => setCalls(getCalls());

    useEffect(() => { refresh(); }, []);

    const onRemovedFromCalls = (numeroContrat) => {
        removeCall(numeroContrat);
        message.success('Retiré de "Clients à appeler"');
        refresh();
    };

    return (
        <>
            <StatsBar totals={{ toCreate: 0, toReview: 0, toCall: calls.length }} />

            <div style={{ marginBottom: 12, textAlign:'right' }}>
                <Button onClick={() => { clearCalls(); refresh(); }}>Vider la liste</Button>
            </div>

            <ContractTable
                data={calls}
                title="Clients à appeler"
                mode="calls"
                onRemovedFromCalls={onRemovedFromCalls}
            />
        </>
    );
}

export default ClientsCallPage;
