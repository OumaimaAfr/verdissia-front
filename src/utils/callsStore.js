const KEY = 'clients_a_appeler';

export function getCalls() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}

export function addCall(item) {
    const current = getCalls();
    const exists = current.some(x => x.numeroContrat === item.numeroContrat);
    if (!exists) {
        const updated = [item, ...current];
        localStorage.setItem(KEY, JSON.stringify(updated));
    }
}

export function removeCall(numeroContrat) {
    const updated = getCalls().filter(x => x.numeroContrat !== numeroContrat);
    localStorage.setItem(KEY, JSON.stringify(updated));
}

export function clearCalls() {
    localStorage.removeItem(KEY);
}
