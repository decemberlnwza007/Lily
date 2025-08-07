'use client';

import { useSession } from 'next-auth/react';
import '../style/login.css';
import { useEffect, useState } from 'react';

export default function RegisterForm() {
    const { data: session, status } = useSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);


    return (
        <div className="min-h-screen bg-gradient-to-br from-mint-50 to-emerald-50 flex items-center justify-center p-4 relative overflow-hidden">

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        สมัครสมาชิก Lily
                    </h1>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/50">

                </div>
            </div>
        </div>
    )
}