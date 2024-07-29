"use client"

import Link from "next/link"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Loader2} from "lucide-react"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {toast} from "@/components/ui/use-toast";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {InputPassword} from "@/components/ui/input-password";
import {useContext, useState} from "react"
import {useRouter} from "next/navigation"
import {Authority, User, UserContext, UserContextType} from "@/app/userContext";
import {client} from "@/http/axios";

const FormSchema = z.object({
    username: z.string()
        .min(2, {
            message: "Email must be at least 2 characters.",
        })
        .email(
            "Invalid email address"
        ),
    password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    })
});

export default function Login() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    });

    const [isLoading, setLoading] = useState(false);
    const router = useRouter();
    const {loginUser} = useContext(UserContext) as UserContextType;

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true);

        const base64encodedData = Buffer.from(`${data.username}:${data.password}`).toString('base64');

        fetch('http://localhost:8080/current-user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64encodedData
            },
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(user => {
                            loginUser({
                                username: user.username,
                                token: base64encodedData,
                                authority: user.authority
                            } as User);

                            router.push("/");
                        }
                    );
                }

                if (res.status == 401) {
                    toast({
                        variant: "destructive",
                        title: "Authentication failed.",
                        description: "Username or password are incorrect",
                    });
                }
            })
            .catch(err => {
                console.log(err);
                toast({
                    variant: "destructive",
                    title: "Something went wrong.",
                    description: "Try again later",
                });
            })
            .finally(() => setLoading(false))
    }

    return (
        <Card className="lg:w-1/3">
            <CardHeader>
                <CardTitle className="text-xl">Login</CardTitle>
                <CardDescription>
                    Enter your information to login
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({field}) => (
                                <FormItem>
                                    <Label>Email</Label>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <Label>Password</Label>
                                    <FormControl>
                                        <InputPassword
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {isLoading ? 'Loading' : 'Login'}
                        </Button>
                    </form>
                </Form>

                <div className="mt-4 text-center text-sm">
                    You don`t have an account?{" "}
                    <Link href="/signup" className="underline">
                        Sign up
                    </Link>
                </div>

                <div className="mt-4 text-center text-sm">
                    Do you forgot your password?{" "}
                    <Link href="/forgot-password" className="underline">
                        Reset password
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
