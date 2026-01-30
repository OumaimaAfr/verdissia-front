const KEY = 'clients_declines';

export function getDeclined() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
