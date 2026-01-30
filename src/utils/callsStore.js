const KEY = 'clients_a_appeler';

export function getCalls() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
