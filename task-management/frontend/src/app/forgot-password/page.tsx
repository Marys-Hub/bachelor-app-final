"use client"

import Link from "next/link"

import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Loader2} from "lucide-react"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {toast} from "@/components/ui/use-toast";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {InputPassword} from "@/components/ui/input-password";
import {useContext, useState} from "react"
import {useRouter} from "next/navigation"
import {Authority, User, UserContext, UserContextType} from "@/app/userContext";

const FormSchema = z.object({
    username: z.string().min(2, {
        message: "Email must be at least 2 characters.",
    }).email("Invalid email address")
});

export default function ForgotPassword() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    });

    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true);

        fetch('http://localhost:8080/forgot-password?username=' + data.username, {
            method: 'POST'
        })
            .then(res => {
                if (res.status === 200) {
                    router.push("/login");
                    toast({
                        title: "Password reset successfully.",
                        description: "You will receive an email with the new password",

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
                <CardTitle className="text-xl">Forgot password</CardTitle>
                <CardDescription>
                    Enter your information to reset your password
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
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {isLoading ? 'Loading' : 'Login'}
                        </Button>
                    </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="underline">
                        Login
                    </Link>
                </div>
                <div className="mt-4 text-center text-sm">
                    You don`t have an account?{" "}
                    <Link href="/signup" className="underline">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
