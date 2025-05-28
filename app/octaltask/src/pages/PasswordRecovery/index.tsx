import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"
import { forgotPassword } from "@/lib/api/auth"


// Form validation schema
const passwordRecoverySchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
})

type PasswordRecoveryFormValues = z.infer<typeof passwordRecoverySchema>

const PasswordRecovery = () => {
    const [isSubmitted, setIsSubmitted] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PasswordRecoveryFormValues>({
        resolver: zodResolver(passwordRecoverySchema),
        defaultValues: {
            email: "",
        },
    })

    const onSubmit = async (data: PasswordRecoveryFormValues) => {
        try {
            const res = await forgotPassword(data.email);
            console.log('Send email success:', res);
            if (res.access_token) {
                localStorage.setItem('token', res.access_token);
            }
        } catch (err: any) {
            console.error("Error sending reset email:", err);
        }

        console.log("Form submitted:", data)
        // Show success message regardless of actual success for security
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsSubmitted(true)
    }

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Left side illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-blue-50 dark:bg-gray-800 items-center justify-center p-12">
                <div className="max-w-md">
                    <div className="mb-8 text-center lg:text-left">
                        <h1 className="text-4xl font-normal mb-2">
                            <span className="font-medium text-blue-600 dark:text-blue-400">Octal</span>
                            <span className="font-normal text-gray-800 dark:text-gray-200">Task</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">Secure account recovery</p>
                    </div>

                    <div className="relative">
                        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                            <path fill="#f3f4f6" d="M488.5,274.5Q488,299,469.5,318.5Q451,338,427.5,347Q404,356,387.5,368.5Q371,381,349,380.5Q327,380,303.5,383.5Q280,387,249,399Q218,411,197.5,388Q177,365,147,363Q117,361,93,345.5Q69,330,57.5,305Q46,280,33.5,254Q21,228,19,198.5Q17,169,41.5,149Q66,129,79,106.5Q92,84,118.5,74Q145,64,168,44.5Q191,25,219.5,32Q248,39,277,32.5Q306,26,334,32.5Q362,39,384.5,54.5Q407,70,424.5,90Q442,110,456.5,134Q471,158,480,183.5Q489,209,489,234.5Q489,260,488.5,274.5Z" className="dark:fill-gray-700" />
                            <g transform="matrix(0.5, 0, 0, 0.5, 120, 100)">
                                <rect x="160" y="80" width="180" height="340" rx="20" fill="#e0e7ff" className="dark:fill-blue-900/40" />
                                <rect x="175" y="120" width="150" height="40" rx="8" fill="#ffffff" className="dark:fill-gray-800" />
                                <rect x="175" y="170" width="150" height="10" rx="5" fill="#d1d5db" className="dark:fill-gray-600" />
                                <rect x="175" y="190" width="120" height="10" rx="5" fill="#d1d5db" className="dark:fill-gray-600" />
                                <rect x="190" y="240" width="120" height="120" rx="60" fill="#93c5fd" className="dark:fill-blue-500/40" />
                                <path d="M230,290 l-20,20 l40,40 l60,-60 l-20,-20 l-40,40 z" fill="#3b82f6" className="dark:fill-blue-400" />
                                <rect x="210" y="380" width="80" height="25" rx="12.5" fill="#4f46e5" className="dark:fill-blue-600" />
                            </g>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Right side recovery form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:hidden">
                        <h1 className="text-4xl font-normal mb-2">
                            <span className="font-medium text-blue-600 dark:text-blue-400">Octal</span>
                            <span className="font-normal text-gray-800 dark:text-gray-200">Task</span>
                        </h1>
                        <h2 className="text-2xl font-normal text-gray-700 dark:text-gray-300">Account recovery</h2>
                        <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">Get a password reset link</p>
                    </div>

                    <div className="hidden lg:block lg:text-left">
                        <h2 className="text-3xl font-normal text-gray-700 dark:text-gray-300">Account recovery</h2>
                        <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">Get a password reset link</p>
                    </div>

                    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl bg-white dark:bg-gray-800">
                        <CardContent className="pt-6 px-6 sm:px-8">
                            {isSubmitted ? (
                                <div className="py-4">
                                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30 text-blue-800 dark:text-blue-300 rounded-lg py-3">
                                        <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        <AlertDescription className="ml-2 text-sm">
                                            If an account exists with that email, we've sent a password reset link. Please check your inbox.
                                        </AlertDescription>
                                    </Alert>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                                        The email might take a few minutes to arrive. Be sure to check your spam folder.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    <div className="space-y-1">
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Email address"
                                            className="h-12 rounded-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 dark:focus:ring-opacity-30 bg-white dark:bg-gray-700 px-4"
                                            {...register("email")}
                                            aria-invalid={errors.email ? "true" : "false"}
                                        />
                                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                                    </div>

                                    <p className="text-sm text-left text-gray-600 dark:text-gray-400 mt-2">
                                        We'll send a recovery link to this email if it matches an account in our system.
                                    </p>

                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 text-white font-medium text-sm h-12 transition-all duration-200"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Sending..." : "Send recovery email"}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>

                        <CardFooter className="flex justify-center p-6 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {isSubmitted ? (
                                    <a href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                                        Back to sign in
                                    </a>
                                ) : (
                                    <>
                                        Remember your password?{" "}
                                        <a href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                                            Sign in
                                        </a>
                                    </>
                                )}
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default PasswordRecovery
