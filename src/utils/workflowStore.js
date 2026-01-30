const KEY = 'workflow_map_v1';
export const STATES = {
    BLOCKED: 'blocked',
    CALLS: 'calls',
    DECLINED: 'declined',
    EXAMINER: 'examiner',
    TO_CREATE: 'toCreate',
};

export function getMap() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch { return {}; }
}

export function setMap(map) {
    localStorage.setItem(KEY, JSON.stringify(map));
    window.dispatchEvent(new StorageEvent('storage', { key: KEY }));
}

export function setState(id, state, patch = {}) {
    const map = getMap();
    const prev = map[id] || {};
    map[id] = { ...prev, state, ...patch, id };
    setMap(map);
    return map;
}

export function remove(id) {
    const map = getMap();
    delete map[id];
    setMap(map);
    return map;
}

