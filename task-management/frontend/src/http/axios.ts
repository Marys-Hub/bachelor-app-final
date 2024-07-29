import axios from 'axios';
import {toast} from '@/components/ui/use-toast';
import {User, UserContext} from "@/app/userContext";
import {useContext} from "react";

export const client = axios.create({
    baseURL: 'http://localhost:8080',
});

client.interceptors.request.use(request => {
    let loggedUser = localStorage.getItem('user');
    if (loggedUser) {
        let user = JSON.parse(loggedUser) as User;
        request.headers.Authorization = "Basic " + user.token
    }

    return request;
})

client.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401) {
        toast({title: 'Error', description: 'Unauthorized. Please log in and try again.'});
    }

    return Promise.reject(error);
});