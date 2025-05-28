import type React from "react"
import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const token = searchParams.get("token")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!token) {
            setError("Invalid or expired token.")
            return
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        try {
            const response = await axios.post("http://localhost:3000/auth/reset-password", {
                token: token,
                newPassword: newPassword,
            })
            setSuccess("Password changed successfully. Redirecting...")
            setTimeout(() => navigate("/login"), 2500)
        } catch (err: any) {
            setError(err?.response?.data?.message || "An error occurred.")
        }
    }

    
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Left side illustration */}
            <div className="items-center justify-center hidden p-12 lg:flex lg:w-1/2 bg-blue-50 dark:bg-gray-800">
                <div className="max-w-md">
                    <div className="mb-8 text-center lg:text-left">
                        <h1 className="mb-2 text-4xl font-normal">
                            <span className="font-medium text-blue-600 dark:text-blue-400">Octal</span>
                            <span className="font-normal text-gray-800 dark:text-gray-200">Task</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">Create a new secure password</p>
                    </div>

                    <div className="relative">
                        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                            <path fill="#f3f4f6" d="M488.5,274.5Q488,299,469.5,318.5Q451,338,427.5,347Q404,356,387.5,368.5Q371,381,349,380.5Q327,380,303.5,383.5Q280,387,249,399Q218,411,197.5,388Q177,365,147,363Q117,361,93,345.5Q69,330,57.5,305Q46,280,33.5,254Q21,228,19,198.5Q17,169,41.5,149Q66,129,79,106.5Q92,84,118.5,74Q145,64,168,44.5Q191,25,219.5,32Q248,39,277,32.5Q306,26,334,32.5Q362,39,384.5,54.5Q407,70,424.5,90Q442,110,456.5,134Q471,158,480,183.5Q489,209,489,234.5Q489,260,488.5,274.5Z" className="dark:fill-gray-700" />
                            <g transform="matrix(0.5, 0, 0, 0.5, 120, 100)">
                                <rect x="140" y="120" width="220" height="260" rx="20" fill="#e0e7ff" className="dark:fill-blue-900/40" />
                                <circle cx="250" cy="200" r="50" fill="#93c5fd" className="dark:fill-blue-500/40" />
                                <rect x="225" cy="175" width="50" height="50" rx="4" fill="#3b82f6" className="dark:fill-blue-600" />
                                <rect x="235" cy="195" width="30" height="10" rx="2" fill="#f3f4f6" className="dark:fill-gray-300" />
                                <rect x="180" y="270" width="140" height="20" rx="4" fill="#ffffff" className="dark:fill-gray-800" />
                                <rect x="180" y="300" width="140" height="20" rx="4" fill="#ffffff" className="dark:fill-gray-800" />
                                <rect x="210" y="340" width="80" height="25" rx="12.5" fill="#4f46e5" className="dark:fill-blue-600" />
                            </g>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Right side reset password form */}
            <div className="flex items-center justify-center w-full px-6 py-12 lg:w-1/2">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:hidden">
                        <h1 className="mb-2 text-4xl font-normal">
                            <span className="font-medium text-blue-600 dark:text-blue-400">Octal</span>
                            <span className="font-normal text-gray-800 dark:text-gray-200">Task</span>
                        </h1>
                        <h2 className="text-2xl font-normal text-gray-700 dark:text-gray-300">Reset password</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Create a new password for your account</p>
                    </div>

                    <div className="hidden lg:block lg:text-left">
                        <h2 className="text-3xl font-normal text-gray-700 dark:text-gray-300">Reset password</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Create a new password for your account</p>
                    </div>

                    <Card className="bg-white border border-gray-200 shadow-sm dark:border-gray-700 rounded-2xl dark:bg-gray-800">
                        <CardContent className="px-6 pt-6 sm:px-8">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1">
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="New password"
                                        className="h-12 px-4 bg-white border-gray-300 rounded-lg dark:border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 dark:focus:ring-opacity-30 dark:bg-gray-700"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm password"
                                        className="h-12 px-4 bg-white border-gray-300 rounded-lg dark:border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 dark:focus:ring-opacity-30 dark:bg-gray-700"
                                        required
                                    />
                                </div>

                                <p className="mt-2 text-xs text-left text-gray-500 dark:text-gray-400">
                                    Use 8 or more characters with a mix of letters, numbers & symbols
                                </p>

                                {error && (
                                    <Alert variant="destructive" className="py-2 text-red-800 border-red-100 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-300">
                                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                        <AlertDescription className="ml-2 text-sm">{error}</AlertDescription>
                                    </Alert>
                                )}

                                {success && (
                                    <Alert className="py-2 text-green-800 border-green-100 rounded-lg bg-green-50 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-300">
                                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        <AlertDescription className="ml-2 text-sm">{success}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 text-white font-medium text-sm h-12 transition-all duration-200"
                                    >
                                        Reset password
                                    </Button>
                                </div>
                            </form>
                        </CardContent>

                        <CardFooter className="flex justify-center p-6 border-t border-gray-100 dark:border-gray-700">
                            <a href="/login" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                Back to sign in
                            </a>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
