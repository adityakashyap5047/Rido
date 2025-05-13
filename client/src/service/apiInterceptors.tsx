import axios from "axios";
import { BASE_URL } from "./config";
import { tokenStorage } from "@/store/storage";

export const refresh_token = async () => {
    try {
        
    } catch (error) {
        console.error("REFRESH TOKEN ERROR");
        tokenStorage.clearAll();
        logout()
    }
}

export const appAxios = axios.create({
    baseURL: BASE_URL,
});

appAxios.interceptors.request.use(async config => {
    const accessToken = tokenStorage.getString('access_token')
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}    );

appAxios.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 401) {
           try {
                const newAccessToken = await refresh_token();
                if (newAccessToken) {
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(error.config);
                }    
            } catch (error) {
                console.error("Error while refreshing token:", error);
            }
        }
        return Promise.reject(error);
    }
);