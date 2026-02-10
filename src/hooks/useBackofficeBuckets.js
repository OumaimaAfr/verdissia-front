import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { computeBuckets } from '../utils/buckets';
import { getMap } from '../utils/workflowStore';

const WORKFLOW_KEY = 'workflow_map_v1';

export default function useBackofficeBuckets() {
    const { contracts } = useContext(AuthContext);
    const [version, setVersion] = useState(0);

    const refresh = useCallback(() => setVersion(v => v + 1), []);

    useEffect(() => {
        const onStorage = (e) => {
            if (!e || e.key === WORKFLOW_KEY) refresh();
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [refresh]);

    const mapSnapshot = useMemo(() => getMap(), [version, contracts]);

    const { toCreate, blocked, calls, examiner, declined, processed } = useMemo(
        () => computeBuckets(contracts),
        [contracts, mapSnapshot, version]
    );

    const totals = useMemo(() => ({
        toCreate: toCreate.length,
        toReview: blocked.length,
        toCall: calls.length,
        declined: declined.length,
        toExamine: examiner.length,
        processed: processed.length,
    }), [toCreate.length, blocked.length, calls.length, declined.length, examiner.length, processed.length]);

    return { toCreate, blocked, calls, examiner, declined, processed, totals, refresh };
}
