"use server"

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { loginSchema, LoginValyes } from "@/lib/validation";
import { verify } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(credintials: LoginValyes): Promise<{ error?: string }> {
    try {
        const { username, password } = loginSchema.parse(credintials);

        const existingUser = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: "insensitive"
                }
            }
        })

        if (!existingUser || !existingUser.passwordHash) {
            return {
                error: "Incorrect username or password!"
            }
        }

        const validatePassword = await verify(existingUser.passwordHash, password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1

        })

        if (!validatePassword) {
            return {
                error: "incorrect username or password!"
            }
        }

        const session = await lucia.createSession(existingUser.id, {})
        const sessionCookie = await lucia.createSessionCookie(session.id);
        (await cookies()).set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        )

        return redirect("/")

    } catch (error) {

        if (isRedirectError(error)) throw error;

        console.error(error);

        return {
            error: "something went wrong"
        }
    }

}