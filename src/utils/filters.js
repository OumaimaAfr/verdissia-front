export function splitBuckets(list = []) {
    const toCreate = list.filter(c => c.decision === 'VALIDE');
    const toReview = list.filter(c => c.decision !== 'VALIDE');
    return { toCreate, toReview };
}
