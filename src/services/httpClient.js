const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export class HttpError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
    }
}

async function request(method, url, options = {}) {
    const res = await fetch(`${API_BASE_URL}${url}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        credentials: 'include',
        ...('body' in options ? { body: JSON.stringify(options.body) } : {}),
        signal: options.signal,
    });

    if (res.status === 401) throw new HttpError('Unauthorized', 401);
    if (res.status === 403) throw new HttpError('Forbidden', 403);

    if (!res.ok) {
        const msg = (await res.text()) || `HTTP ${res.status}`;
        throw new HttpError(msg, res.status);
    }

    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : res.text();
}

export const http = {
    get: (u, o) => request('GET', u, o),
    post: (u, o) => request('POST', u, o),
    put:  (u, o) => request('PUT',  u, o),
    delete:(u, o) => request('DELETE',u, o),
};
