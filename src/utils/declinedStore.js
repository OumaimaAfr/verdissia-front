import dayjs from 'dayjs';
const KEY = 'clients_declines';

export function getDeclined() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}

export function addDeclined(item, motif) {
    const current = getDeclined();
    const exists = current.some(x => x.numeroContrat === item.numeroContrat);
    const enriched = { ...item, motifRejet: motif, declinedAt: dayjs().toISOString() };
    const updated = exists
        ? current.map(x => x.numeroContrat === item.numeroContrat ? enriched : x)
        : [enriched, ...current];
    localStorage.setItem(KEY, JSON.stringify(updated));
    return updated;
}

export function removeDeclined(numeroContrat) {
    const updated = getDeclined().filter(x => x.numeroContrat !== numeroContrat);
    localStorage.setItem(KEY, JSON.stringify(updated));
    return updated;
}

export function clearDeclined() {
    localStorage.removeItem(KEY);
}
