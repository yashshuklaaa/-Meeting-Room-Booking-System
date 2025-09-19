import axios from 'axios';

const apiClient = axios.create({
    // Make sure this port number matches your server's port
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;