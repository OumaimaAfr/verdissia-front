import http from '../api/httpClient.jsx';
import { encodeCredential } from '../api/auth.jsx';

export async function generateToken() {
    const payload = {
        client_id: 'energy-contracts-front',
        grant_type: 'password',
        username: encodeCredential('client.user'),
        password: encodeCredential('user'),
    };

    const res = await http.request({
        method: 'GET',
        url: '/generation-token',
        data: payload,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return res.data?.access_token || res.data;
}
