"use client"

import {Inter as FontSans} from "next/font/google";
import "./globals.css";
import {cn} from "@/lib/utils";
import {Header} from "@/components/header";
import {Toaster} from "@/components/ui/toaster";
import {User, UserContext} from "@/app/userContext";
import {useEffect, useState} from "react";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    let [user, setUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        let userStorage = localStorage.getItem('user');
        if (userStorage) {
            let user = JSON.parse(userStorage) as User;
            setUser(user);
        }
    }, []);

    const loginUser = (user: User) => {
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    }

    const logoutUser = () => {
        localStorage.removeItem('user');
        setUser(undefined);
    }

    return (
        <html lang="en">
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased",
                    fontSans.variable
                )}
            >
            <UserContext.Provider value={{user, loginUser, logoutUser}}>
                <Header/>
                <div className="flex min-h-screen flex-col items-center justify-between p-6">
                    {children}
                </div>
            </UserContext.Provider>
            <Toaster/>
            </body>
        </html>
    );
}
