import { Toaster, toast } from 'react-hot-toast';

import { login } from "../utils/LoginUtils";
import { useRef } from "react";
import { useRouter } from 'next/router';

export function SignIn ({ providers }: any) {
    const router = useRouter();
    const username = useRef("");
    const password = useRef("");
    return (
        <div className="flex items-center min-h-screen p-4 bg-gray-100 lg:justify-center">
            <div
                className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md"
            >
                <div
                    className="p-4 py-6 text-white bg-gray-800 md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly"
                >
                    <div className="my-3 text-4xl font-bold tracking-wider text-center">
                        <a href="#">M-COPILOT</a>
                    </div>
                </div>
                <div className="p-5 bg-white md:flex-1">
                    <h3 className="my-4 text-2xl font-semibold text-gray-700">Account Login</h3>
                    <form action="#" className="flex flex-col space-y-5">
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="username" className="text-sm font-semibold text-gray-500">User Name</label>
                            <input
                                type="username"
                                id="username"
                                autoFocus
                                className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                                onChange={(e) => (username.current = e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-semibold text-gray-500">Password</label>
                            </div>
                            <input
                                type="password"
                                id="password"
                                className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                                onChange={(e) => (password.current = e.target.value)}
                            />
                        </div>
                        <div>
                            <button
                                type="button"
                                className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-gray-800 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4"
                                onClick={() => {
                                    login(username.current, password.current)
                                    .then((resp) => {
                                        if (resp?.ok) {
                                            router.push('/');
                                        } else {
                                            toast.error(`Login fail: ${resp?.error}`);
                                        }
                                    })
                                }}
                            >
                                Log in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div><Toaster/></div>
        </div>
    )
}