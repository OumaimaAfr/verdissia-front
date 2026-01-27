import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getCalls } from '../utils/callsStore';
import { getDeclined } from '../utils/declinedStore';

function useBackofficeTotals() {
    const { contracts } = useContext(AuthContext);
    const [callsCount, setCallsCount] = useState(() => getCalls().length);
    const [declinedCount, setDeclinedCount] = useState(() => getDeclined().length);

    // Recompute localStorage-based counters
    const recomputeLocal = useCallback(() => {
        setCallsCount(getCalls().length);
        setDeclinedCount(getDeclined().length);
    }, []);

    // Listen to cross-tab changes
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

    // Compute buckets from contracts held in context
    const toCreate = useMemo(() => contracts.filter(c => c.decision === 'VALIDE'), [contracts]);
    const toReview = useMemo(() => contracts.filter(c => c.decision !== 'VALIDE'), [contracts]);

    const totals = useMemo(() => ({
        toCreate: toCreate.length,
        toReview: toReview.length,       // “Cas bloqués” (non-VALIDE)
        toCall: callsCount,              // Clients à appeler (localStorage)
        declined: declinedCount,         // Cas déclinés (localStorage)
    }), [toCreate.length, toReview.length, callsCount, declinedCount]);

    // Expose an explicit refresh to call after actions
    const refresh = useCallback(() => {
        recomputeLocal();
        // If un jour tu veux refetch contracts serveur, tu peux l’appeler ici.
    }, [recomputeLocal]);

    return { totals, toCreate, toReview, refresh };
}

export default useBackofficeTotals;
