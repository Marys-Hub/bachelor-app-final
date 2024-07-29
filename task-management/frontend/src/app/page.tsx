"use client"

import {useContext, useEffect, useState} from "react";
import {client} from "@/http/axios";
import Link from "next/link";
import {ReactTyped} from "react-typed";
import {UserContext, UserContextType} from "@/app/userContext";

export default function Home() {
    const [motivational, setMotivational] = useState();

    useEffect(() => {
        client.get('/task/motivational')
            .then((response) => {
                setMotivational(response.data);
            });
    }, []);


    const {user, logoutUser} = useContext(UserContext) as UserContextType;

    return (
        <div className="flex flex-col min-h-[100dvh]">
            <main className="flex-1">
                <section className="w-full pt-12 md:pt-24 lg:pt-32">
                    <div className="container grid gap-8 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
                        <div className="flex flex-col justify-center space-y-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                                    Streamline Your Productivity
                                </h1>
                                <p className="text-muted-foreground md:text-xl">
                                    Our task management system helps you stay organized and focused, so you can achieve
                                    more in less time.
                                </p>
                                <div className="text-sm text-muted-foreground">
                                    {motivational ?
                                        <ReactTyped strings={[motivational]} typeSpeed={40}/> : null}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                {user ?
                                    <Link
                                        href="/tasks"
                                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                        prefetch={false}
                                    >
                                        Go to tasks
                                    </Link> :
                                    <Link
                                        href="/login"
                                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                        prefetch={false}
                                    >
                                        Login
                                    </Link>}
                                {user ?
                                    <button
                                        onClick={() => logoutUser()}
                                        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        Logout
                                    </button> :
                                    <Link
                                        href="/signup"
                                        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                        prefetch={false}
                                    >
                                        Sign up
                                    </Link>}
                            </div>
                        </div>
                        <img
                            src="/logo.jpeg"
                            width="550"
                            height="550"
                            alt="Hero"
                            className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
                        />
                    </div>
                </section>
            </main>
        </div>
    )
}
