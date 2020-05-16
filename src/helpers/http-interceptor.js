import axios from 'axios';
import { STORAGE } from '../helpers/app.constant';

export const setupInterceptors = () => {

    axios.interceptors.request.use(config => {

        config.headers['Content-Type'] = 'application/json';

        // If it is login rest call, don't add token
        if (config.url.includes('/login')) {
            return config;
        }

        const token = JSON.parse(sessionStorage.getItem(STORAGE.USER_DETAILS))?.token;

        config.headers['authorization'] = token;
        config.headers['cache-control'] = 'no-cache';

        return config;
    }, (err) => {

        console.log("EXPIRED TOKEN!");
        sessionStorage.clear();

        return Promise.reject(err);
    });

};
