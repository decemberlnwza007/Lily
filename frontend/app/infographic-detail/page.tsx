"use client";

import { useSearchParams } from "next/navigation";

export default function InfographicDetail() {
    const params = useSearchParams();

    const name = params.get("name");
    const detail = params.get("detail");
    const path = params.get("path");
    const credit = params.get("credit");

    return (
        <div className="p-8 bg-green-200">
            <img src={path || "/default.jpg"} alt={name || "infographic"} className="w-full h-auto object-cover mb-4 rounded-lg" />
            <div className="bg-white shadow-xl p-6 rounded-xl">
                <h1 className="text-2xl font-bold text-green-700">{name}</h1>
                <p className="mt-2 text-gray-600">{detail}</p>
                {credit ? (
                    <a href={credit} className="block mt-4 text-blue-500 underline">แหล่งที่มา</a>
                ) : (
                    <p className="mt-4 text-sm text-gray-400">ไม่มีแหล่งที่มา</p>
                )}
            </div>
        </div>
    );
}