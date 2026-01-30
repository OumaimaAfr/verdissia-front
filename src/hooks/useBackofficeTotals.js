import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getCalls } from '../utils/callsStore';
import { getDeclined } from '../utils/declinedStore';

function useBackofficeTotals() {
    const { contracts } = useContext(AuthContext);
    const [callsCount, setCallsCount] = useState(() => getCalls().length);
    const [declinedCount, setDeclinedCount] = useState(() => getDeclined().length);

    const recomputeLocal = useCallback(() => {
        setCallsCount(getCalls().length);
        setDeclinedCount(getDeclined().length);
    }, []);

    useEffect(() => {
        const onStorage = (e) => {
            if (!e) return;
            if (e.key === 'clients_a_appeler' || e.key === 'clients_declines') {
                recomputeLocal();
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [recomputeLocal]);

    const toCreate = useMemo(() => contracts.filter(c => c.decision === 'VALIDE'), [contracts]);
    const toReview = useMemo(() => contracts.filter(c => c.decision !== 'VALIDE'), [contracts]);

    const totals = useMemo(() => ({
        toCreate: toCreate.length,
        toReview: toReview.length,
        toCall: callsCount,
        declined: declinedCount,
    }), [toCreate.length, toReview.length, callsCount, declinedCount]);

    const refresh = useCallback(() => {
        recomputeLocal();
    }, [recomputeLocal]);

    return { totals, toCreate, toReview, refresh };
}

export default useBackofficeTotals;
