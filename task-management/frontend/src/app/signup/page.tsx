"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {toast} from "@/components/ui/use-toast"
import {useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {CalendarIcon, Loader2} from "lucide-react"
import {Calendar} from "@/components/ui/calendar";
import {format} from "date-fns"
import {InputPassword} from "@/components/ui/input-password";
import {redirect, useRouter} from "next/navigation"
import Link from "next/link"

const FormSchema = z.object({
    username: z.string()
        .email("Invalid email address")
        .min(2, {
            message: "Email must be at least 2 characters.",
        }),
    password: z.string()
        .min(2, {
            message: "Password must be at least 2 characters.",
        })
})


export default function Signup() {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    });

    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true);

        fetch('http://localhost:8080/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(res => {
                if (res.status === 200) {
                    router.push("/login");
                }
            })
            .catch(err => {
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
                <CardTitle className="text-xl">Sign up</CardTitle>
                <CardDescription>
                    Enter your information to create an account
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
                            {isLoading ? 'Loading' : 'Sign up'}
                        </Button>
                    </form>
                </Form>

                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="underline">
                        Login
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
