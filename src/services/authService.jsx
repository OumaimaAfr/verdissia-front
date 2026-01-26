import http from '../api/httpClient.jsx';
import { encodeCredential } from '../api/auth.jsx';

export async function login(username, password) {
    const payload = { username, password };

    const res = await http.post('/auth/login', payload, {
        headers: { "Content-Type": "application/json" },
    });

    return res.data;
}


export async function generateToken() {
    const payload = {
        username: 'client',
        password: encodeCredential('Cl13nt!Pwd_2026#Verd'),
    };

    const res = await http.request({
        method: 'POST',
        url: '/generation-token',
        data: payload,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return res.data?.accessToken;
}
