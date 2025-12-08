'use client'

import { useState } from 'react'
import { Phone, X, HeartHandshake, AlertCircle } from 'lucide-react'

export default function CrisisSupport() {
    const [isOpen, setIsOpen] = useState(false)

    const hotlines = [
        {
            name: 'สายด่วนสุขภาพจิต',
            number: '1323',
            desc: 'ปรึกษาปัญหาสุขภาพจิต ตลอด 24 ชั่วโมง',
            color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
            iconColor: 'text-emerald-600'
        },
        // {
        //     name: 'สายด่วนกรมสุขภาพจิต',
        //     number: '1667',
        //     desc: 'ปรึกษาปัญหาความเครียด',
        //     color: 'bg-teal-50 text-teal-700 border-teal-100',
        //     iconColor: 'text-teal-600'
        // },
        // {
        //     name: 'Samaritans Thailand',
        //     number: '02-113-6783',
        //     desc: 'รับฟังด้วยใจ ไม่ตัดสิน (12:00 - 22:00 น.)',
        //     color: 'bg-rose-50 text-rose-700 border-rose-100',
        //     iconColor: 'text-rose-600'
        // },
    ]

    return (
        <>
            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6 z-[100]">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-red-500 text-white shadow-lg hover:shadow-rose-300/50 hover:scale-110 transition-all duration-300 ease-out ${isOpen ? 'rotate-45' : ''}`}
                    aria-label="Crisis Support"
                >
                    {!isOpen && <span className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-75 duration-1000" />}
                    {isOpen ? <X className="w-7 h-7 relative z-10" /> : <HeartHandshake className="w-7 h-7 relative z-10" />}

                    {/* Tooltip */}
                    {!isOpen && (
                        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none translate-x-2 group-hover:translate-x-0">
                            ขอความช่วยเหลือ
                        </span>
                    )}
                </button>

                {/* Modal - Popover Style */}
                {isOpen && (
                    <div className="absolute bottom-20 right-0 w-80 sm:w-96 origin-bottom-right animate-scale-in z-[110]">
                        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
                            {/* Header */}
                            <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                                <div className="relative z-10">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5" />
                                        สายด่วนฉุกเฉิน
                                    </h2>
                                    <p className="text-rose-100 text-xs mt-1 opacity-90">
                                        เราอยู่เคียงข้างคุณเสมอ
                                    </p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                {hotlines.map((hotline, index) => (
                                    <a
                                        key={index}
                                        href={`tel:${hotline.number}`}
                                        className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] ${hotline.color} bg-opacity-50 hover:bg-opacity-100`}
                                    >
                                        <div className={`w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm ${hotline.iconColor}`}>
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-gray-800 text-base leading-tight">{hotline.number}</div>
                                            <div className="font-medium text-gray-700 text-xs">{hotline.name}</div>
                                            <div className="text-[10px] text-gray-500 mt-0.5 truncate">{hotline.desc}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* Footer */}
                            {/* <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 text-center">
                                <p className="text-[10px] text-gray-400">
                                    หากตกอยู่ในอันตรายร้ายแรง โทร <span className="font-bold text-rose-500">1669</span>
                                </p>
                            </div> */}
                        </div>
                    </div>
                )}
            </div>

            {/* Backdrop for mobile to close when clicking outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[90] bg-transparent"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}
