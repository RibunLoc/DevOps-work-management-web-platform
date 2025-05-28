'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { signup } from '@/lib/api/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

// Form validation schema
const signupSchema = z
    .object({
        name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
        email: z.string().email({ message: 'Please enter a valid email address' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
        confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: SignupFormValues) => {
        try {
            const res = await signup(data.email, data.password, data.name);
            console.log('Signup success:', res);
            alert('Registration successful!');
            console.log('Form submitted:', data);
            navigate('/login');
        } catch (error) {
            console.error('Signup error:', error);
            alert('Registration failed. Please try again.');
        }
    };

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
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Streamline your workflow, accomplish more
                        </p>
                    </div>

                    <div className="relative">
                        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
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

            {/* Right side signup form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:hidden">
                        <h1 className="text-4xl font-normal mb-2">
                            <span className="font-medium text-blue-600 dark:text-blue-400">Octal</span>
                            <span className="font-normal text-gray-800 dark:text-gray-200">Task</span>
                        </h1>
                        <h2 className="text-2xl font-normal text-gray-700 dark:text-gray-300">
                            Create account
                        </h2>
                        <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                            to get started with OctalTask
                        </p>
                    </div>

                    <div className="hidden lg:block lg:text-left">
                        <h2 className="text-3xl font-normal text-gray-700 dark:text-gray-300">
                            Create account
                        </h2>
                        <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                            to get started with OctalTask
                        </p>
                    </div>

                    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl bg-white dark:bg-gray-800">
                        <CardContent className="pt-6 px-6 sm:px-8">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div className="space-y-1">
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="First and last name"
                                        className="h-12 rounded-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 dark:focus:ring-opacity-30 bg-white dark:bg-gray-700 px-4"
                                        {...register('name')}
                                        aria-invalid={errors.name ? 'true' : 'false'}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Email address"
                                        className="h-12 rounded-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 dark:focus:ring-opacity-30 bg-white dark:bg-gray-700 px-4"
                                        {...register('email')}
                                        aria-invalid={errors.email ? 'true' : 'false'}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 space-y-1">
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Password"
                                            className="h-12 rounded-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 dark:focus:ring-opacity-30 bg-white dark:bg-gray-700 px-4"
                                            {...register('password')}
                                            aria-invalid={errors.password ? 'true' : 'false'}
                                        />
                                        {errors.password && (
                                            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-1">
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm"
                                            className="h-12 rounded-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 dark:focus:ring-opacity-30 bg-white dark:bg-gray-700 px-4"
                                            {...register('confirmPassword')}
                                            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                                        />
                                        {errors.confirmPassword && (
                                            <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
                                        )}
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 dark:text-gray-400 text-left mt-2">
                                    Use 8 or more characters with a mix of letters, numbers & symbols
                                </p>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 text-white font-medium text-sm h-12 transition-all duration-200"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Creating account...' : 'Create account'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>

                        <CardFooter className="flex justify-center p-6 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Already have an account?{' '}
                                <a
                                    href="/login"
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                                >
                                    Sign in instead
                                </a>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Signup;
