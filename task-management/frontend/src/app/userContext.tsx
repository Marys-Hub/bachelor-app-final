import {createContext} from "react";

export enum Authority {
    USER = "USER",
}

export interface User {
    username: string;
    token: string;
    authority: Authority;
}

export type UserContextType = {
    user: User | undefined
    loginUser: (user: User) => void,
    logoutUser: () => void,
}

export const UserContext = createContext<UserContextType | undefined>(undefined);