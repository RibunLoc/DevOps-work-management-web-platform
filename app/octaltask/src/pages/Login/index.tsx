import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/lib/api/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import Cookies from 'js-cookie';

// Form validation schema
const loginSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
    remember: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            remember: false,
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setLoginError('');
            const res = await login(data.email, data.password);
            console.log('Login success:', res);
            if (res.accessToken) {
                Cookies.set('token', res.accessToken, {
                expires: 1, // số ngày hết hạn
            });
                navigate('/tasks');
            } else {
                setLoginError('An unexpected error occurred');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            setLoginError(error?.response?.data?.message || 'Invalid email or password');
        }
    };

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
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Organize your tasks, boost your productivity
                        </p>
                    </div>

                    <div className="relative">
                        <svg
                            viewBox="0 0 500 500"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-auto"
                        >
                            <path
                                fill="#f3f4f6"
                                d="M488.5,274.5Q488,299,469.5,318.5Q451,338,427.5,347Q404,356,387.5,368.5Q371,381,349,380.5Q327,380,303.5,383.5Q280,387,249,399Q218,411,197.5,388Q177,365,147,363Q117,361,93,345.5Q69,330,57.5,305Q46,280,33.5,254Q21,228,19,198.5Q17,169,41.5,149Q66,129,79,106.5Q92,84,118.5,74Q145,64,168,44.5Q191,25,219.5,32Q248,39,277,32.5Q306,26,334,32.5Q362,39,384.5,54.5Q407,70,424.5,90Q442,110,456.5,134Q471,158,480,183.5Q489,209,489,234.5Q489,260,488.5,274.5Z"
                                className="dark:fill-gray-700"
                            />
                            <g transform="matrix(0.5, 0, 0, 0.5, 120, 100)">
                                <rect
                                    x="80"
                                    y="80"
                                    width="340"
                                    height="340"
                                    rx="20"
                                    fill="#e0e7ff"
                                    className="dark:fill-blue-900/40"
                                />
                                <rect
                                    x="120"
                                    y="180"
                                    width="260"
                                    height="40"
                                    rx="8"
                                    fill="#ffffff"
                                    className="dark:fill-gray-800"
                                />
                                <rect
                                    x="120"
                                    y="240"
                                    width="260"
                                    height="40"
                                    rx="8"
                                    fill="#ffffff"
                                    className="dark:fill-gray-800"
                                />
                                <rect
                                    x="120"
                                    y="300"
                                    width="260"
                                    height="40"
                                    rx="8"
                                    fill="#ffffff"
                                    className="dark:fill-gray-800"
                                />
                                <circle cx="140" cy="200" r="10" fill="#4f46e5" className="dark:fill-blue-500" />
                                <circle cx="140" cy="260" r="10" fill="#4f46e5" className="dark:fill-blue-500" />
                                <circle cx="140" cy="320" r="10" fill="#4f46e5" className="dark:fill-blue-500" />
                                <path
                                    d="M120,120 h180 a4,4 0 0 1 4,4 v22 a4,4 0 0 1 -4,4 h-180 a4,4 0 0 1 -4,-4 v-22 a4,4 0 0 1 4,-4 z"
                                    fill="#4338ca"
                                    className="dark:fill-indigo-600"
                                />
                                <path
                                    d="M313,120 h47 a4,4 0 0 1 4,4 v22 a4,4 0 0 1 -4,4 h-47 a4,4 0 0 1 -4,-4 v-22 a4,4 0 0 1 4,-4 z"
                                    fill="#3b82f6"
                                    className="dark:fill-blue-600"
                                />
                            </g>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Right side login form */}
            <div className="flex items-center justify-center w-full px-6 py-12 lg:w-1/2">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:hidden">
                        <h1 className="mb-2 text-4xl font-normal">
                            <span className="font-medium text-blue-600 dark:text-blue-400">Octal</span>
                            <span className="font-normal text-gray-800 dark:text-gray-200">Task</span>
                        </h1>
                        <h2 className="text-2xl font-normal text-gray-700 dark:text-gray-300">Sign in</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            to continue to OctalTask
                        </p>
                    </div>

                    <div className="hidden lg:block lg:text-left">
                        <h2 className="text-3xl font-normal text-gray-700 dark:text-gray-300">Sign in</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            to continue to OctalTask
                        </p>
                    </div>

                    <Card className="bg-white border border-gray-200 shadow-sm dark:border-gray-700 rounded-2xl dark:bg-gray-800">
                        <CardContent className="px-6 pt-6 sm:px-8">
                            {loginError && (
                                <Alert
                                    variant="destructive"
                                    className="py-2 mb-4 text-red-800 border-red-100 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-300"
                                >
                                    <AlertDescription className="text-sm">{loginError}</AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div className="space-y-1">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Email address"
                                        className="h-12 px-4 bg-white border-gray-300 rounded-lg dark:border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 dark:focus:ring-opacity-30 dark:bg-gray-700"
                                        {...register('email')}
                                        aria-invalid={errors.email ? 'true' : 'false'}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        className="h-12 px-4 bg-white border-gray-300 rounded-lg dark:border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 dark:focus:ring-opacity-30 dark:bg-gray-700"
                                        {...register('password')}
                                        aria-invalid={errors.password ? 'true' : 'false'}
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="remember"
                                            {...register('remember')}
                                            className="border-gray-300 dark:border-gray-600"
                                        />
                                        <Label
                                            htmlFor="remember"
                                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Stay signed in
                                        </Label>
                                    </div>
                                    <a
                                        href="/password-recovery"
                                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                    >
                                        Forgot password?
                                    </a>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 text-white font-medium text-sm h-12 transition-all duration-200"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>

                        <CardFooter className="flex justify-center p-6 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Don't have an account?{' '}
                                <a
                                    href="/signup"
                                    className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                >
                                    Create account
                                </a>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Login;
