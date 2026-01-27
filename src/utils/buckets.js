import { getMap, STATES } from './workflowStore';

export function computeBuckets(contracts = []) {
    const map = getMap();

    const toCreate = [];
    const blocked = [];
    const calls = [];
    const examiner = [];
    const declined = [];

    const indexById = Object.create(null);

    for (const c of contracts) {
        const id = c.numeroContrat;
        indexById[id] = c;
        const wf = map[id];

        if (wf?.state === STATES.TO_CREATE)       { toCreate.push({ ...c, ...wf }); continue; }
        if (wf?.state === STATES.CALLS)           { calls.push({ ...c, ...wf }); continue; }
        if (wf?.state === STATES.EXAMINER)        { examiner.push({ ...c, ...wf }); continue; }
        if (wf?.state === STATES.DECLINED)        { declined.push({ ...c, ...wf }); continue; }

        if (c.decision === 'VALIDE') toCreate.push(c);
        else                         blocked.push(c);
    }

    return { toCreate, blocked, calls, examiner, declined };
}
