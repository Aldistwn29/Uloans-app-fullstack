import apiClient from "./api-client";


export async function login(credentials){
    const response = await apiClient.post('/auth/login', credentials);

    const token = response.data?.data?.token;

    if(token){
        localStorage.setItem('uloans_token', token);
    }

    return response.data;
}