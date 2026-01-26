import http from '../api/httpClient.jsx';

export async function initSignature(token, signal) {
    const res = await http.request({
        method: 'POST',
        url: '/signature/init',
        data: { token },
        signal,
        headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
}

export async function submitSignature(payload, signal) {
    const res = await http.request({
        method: 'POST',
        url: '/signature/confirm',
        data: payload,
        signal,
        headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
}
