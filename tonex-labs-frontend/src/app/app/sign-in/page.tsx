"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { signInSchema } from "~/schemas/auth"
import type { SignInFormValues } from "~/schemas/auth"
import { LoaderCircle } from "lucide-react"
import Image from "next/image"
import { signIn } from "next-auth/react"

export default function SignInPage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const router = useRouter();

    const {register, handleSubmit, formState: {errors}, watch} = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onChange",
    })

    const email = watch("email");
    const password = watch("password");

    useEffect(()=>{
        setIsFormValid(!!email && !!password);
    },[email, password])

    const onSubmit = async (data: SignInFormValues) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const signInResult = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if(signInResult?.error){
                setError(signInResult.error === "CredentialsSignin" ? "Invalid email or password" : "Something went wrong. Please try again.");
                return;
            }

            console.log("SignIn success.");
            router.push("/app/speech-synthesis/text-to-speech");
        } catch (error) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen w-full">
            <div className="relative w-full lg:w-1/2">
                <div className="absolute left-8 top-6">
                    <span className="text-xl font-bold tracking-tight text-black">ToneX-Labs</span>
                </div>

                {/* Centered sign up form */}
                <div className="flex min-h-screen items-center justify-center">
                    <div className="w-full max-w-md p-8">
                        <h2 className="mb-6 text-center text-xl font-semibold">Login to your account</h2>

                        {error && (
                            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <label 
                                    htmlFor="email" 
                                    className="mb-1 block text-sm font-medium text-black"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    {...register("email")}
                                    className="w-full rounded-lg border border-gray-200 p-2 placeholder:text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label 
                                    htmlFor="password" 
                                    className="mb-1 block text-sm font-medium text-black"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    {...register("password")}
                                    className="w-full rounded-lg border border-gray-200 p-2 placeholder:text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                    required
                                />
                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            <button type="submit" disabled={isLoading || !isFormValid} className={`my-4 w-full rounded-full py-2.5 text-sm text-white transition-colors ${isLoading ? "cursor-not-allowed bg-gray-300" : isFormValid ? "bg-black" : "cursor-not-allowed bg-gray-400"}`}>
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin text-white" />
                                        Signing in...
                                    </span>
                                ) : (
                                    "Sign In"
                                )}
                            </button>

                            <div className="text-center">
                                <span className="text-sm text-gray-600">
                                    Don&#39;t have an account?{" "}
                                    <a href="/app/sign-up" className="font-medium text-black hover:underline">
                                        Sign Up
                                    </a>
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            {/* Right Side */}
            <div className="hidden py-[3vh] pr-[3vh] lg:block lg:w-1/2">
                <div className="hidden h-full rounded-3xl bg-gradient-to-b from-indigo-300 via-blue-100 to-indigo-600 lg:block">
                    <div className="flex h-full flex-col p-12">
                        <div className="flex h-full items-center justify-center">
                            <Image className="w-full rounded-large" src="/placeholder.jpeg" alt="Sign up illustration" width={500} height={500} />
                        </div>

                        <div className="h-fit w-full max-w-lg">
                            <div className="mb-4 flex w-fit rounded-2xl bg-indigo-300 bg-opacity-40 px-3 py-1">
                                <span className="text-xs font-medium uppercase tracking-wider text-white">LATEST UPDATES</span>
                            </div>
                            <h3 className="text-lg text-white xl:text-xl 2xl:text-2xl 2xl:leading-10">Use our AI Text-To-Speech editor to create natural voiceovers in multiple voices.</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}