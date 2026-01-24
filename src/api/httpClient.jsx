import axios from 'axios';

const http = axios.create({
    baseURL: '/api/verdisia',
});

export const setAuthToken = (token) => {
    if (token) {
        http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete http.defaults.headers.common['Authorization'];
    }
};

export default http;
