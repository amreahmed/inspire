"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod"
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { signup } from "./actions";
import { PasswordInput } from "@/components/PasswordInput";
import LoadingButton from "@/components/LoadingButton";

export default function SignUpForm() {

    const [error, setError] = useState<string>();
    const [isPending, startTransition] = useTransition()

    const form = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
           
        }
    });

    async function onSubmit(values: SignUpValues) {
        setError(undefined);
        startTransition(async () => {
            const { error } = await signup(values);
            if (error) {
                setError(error);
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                {error && <p className="text-center text-destructive">{error}</p>}
                <FormField control={form.control} name="username" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input placeholder="username" {...field}></Input>
                        </FormControl>
                        <FormMessage/>
                        </FormItem>
                )}>
                </FormField>
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="Email" {...field} type="email"></Input>
                        </FormControl>
                        <FormMessage/>
                        </FormItem>
                )}>
                </FormField>
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <PasswordInput placeholder="Password" {...field} type="password"></PasswordInput>
                        </FormControl>
                        <FormMessage/>
                        </FormItem>
                )}>
                </FormField>
                <LoadingButton  loading={isPending} type="submit" className="w-full">Create Account</LoadingButton>
            </form>
        </Form>
    )
}