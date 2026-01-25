import http from '../api/httpClient.jsx';
import axios from "axios";

export async function soumettreDemande(payload, signal) {
    const res = await http.request({
        method: 'POST',
        url: '/soumission',
        data: payload,
        signal,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return res.data;
}

export async function getCommunesByCodePostal(codePostal, signal) {
    const cp = (codePostal || '').replace(/\D/g, '');
    if (!/^\d{5}$/.test(cp)) {
        return [];
    }

    const url = `https://geo.api.gouv.fr/communes?codePostal=${cp}&fields=nom&format=json&geometry=centre`;

    const { data } = await axios.get(url, { signal });
    if (!Array.isArray(data)) return [];
    return data
        .map((c) => ({ nom: c?.nom }))
        .filter((c) => !!c.nom);
}

export async function getOffres(params) {
    const res = await http.request({
        method: 'GET',
        url: `/offres/search?typeEnergie=${params.typeEnergie}&preferenceOffre=${params.preferenceOffre}`,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return res.data;
}
