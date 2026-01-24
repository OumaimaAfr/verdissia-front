import http from '../api/httpClient.jsx';

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
