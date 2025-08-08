"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InfoGraphic() {
    const router = useRouter();
    const [selected, setSelected] = useState(null);
    

    const items = [
        {
            name: "6 วิธีเพื่อรับมือและป้องกันภาวะซึมเศร้าหลังวันหยุดยาว",
            path: "/Infographic/1.jpg",
            detail: "ภาวะซึมเศร้าหลังวันหยุดยาวเกิดขึ้นได้บ่อยมากในวัยเรียนและวัยทำงาน คำแนะนำนี้จะช่วยให้คุณปรับตัวได้ง่ายขึ้น",
        },
        {
            name: "ประเด็นวัยเรียน : “การกลั่นแกล้งรังแกกัน ไม่ใช่เรื่องล้อเล่น",
            path: "/Infographic/2.jpg",
            detail: "การกลั่นแกล้งในวัยเรียนส่งผลต่อสุขภาพจิตระยะยาว Infographic นี้ชวนให้ตระหนักและรับมืออย่างเข้าใจ",
            credit: "https://mhc7.dmh.go.th/09/05/2024/17856-2-2-2-2-2-2/",
        },
        ,
        {
            name: "ประเด็นวัยสูงอายุ : ดูแลใจ สูงวัยอยู่ลำพัง…รับมือกับความเหงาและความสูญเสีย",
            path: "/Infographic/3.jpg",
            detail: "สถานการณ์ผู้สูงอายุที่อยู่ตามลำพัง สาเหตุของความเหงาในผู้สูงอายุ สัญญาณเตือนผู้สูงอายุเสี่ยงเหงาและโดดเดี่ยว การรับมือกับความเหงาที่ต้องอยู่ลำพัง การรับมือกับความเศร้าโศกจากความสูญเสียคู่ชีวิตหรือบุคคลอันเป็นที่รัก ระยะของการปรับตัวเมื่อเกิดการสูญเสีย อาการโศกเศร้าในผู้สูงอายุ ความแตกต่างระหว่างภาวะเศร้าโศกที่เป็นปกติและผิดปกติ เทคนิคการเพิ่มพลังใจ การเช็คและวิธีดูแลสุขภาพใจ",
            credit: "https://mhc7.dmh.go.th/09/05/2024/17856-2-2-2-2/",
        },
        {
            name: "ประเด็นวัยทำงาน : “ความสุขก็สร้างได้ เครียดก็คลายให้เป็น”",
            path: "/Infographic/4.jpg",
            detail: "ความหมายของความเครียด สำรวจความเครียดด้วยตนเอง และการใช้แบบประเมินความเครียด วิธีผ่อนคลายความเครียด และวิธีคลายเครียดด้วยเทคนิคต่างๆ การใช้แบบประเมินความสุข วิธีสร้างสุข การคิดบวกและมองโลกในแง่ดี การพัฒนาความคิดเชิงบวก และการตรวจสุขภาพใจ",
            credit: "https://mhc7.dmh.go.th/09/05/2024/17856-2-2-2-2-2/",
        },
        
    ];

    const handleInfo = (item) => {
        const query = new URLSearchParams({
            name: item.name,
            detail: item.detail,
            path: item.path,
            credit: item.credit || ""
        });

        router.push(`/infographic-detail?${query.toString()}`);
    }

    return (
        <div className="bg-gradient-to-br from-green-100 via-green-200 to-green-200 min-h-screen py-12">
            <div className="bg-white p-8 mx-6 mb-10 shadow-2xl rounded-3xl border-2 border-white/50 backdrop-blur-md">
                <h1 className="text-center text-4xl font-extrabold text-green-700 drop-shadow-md tracking-wide">
                    Info Graphic ความรู้
                </h1>
                <hr className="mt-6 mb-6 border-t-2 border-green-200" />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 px-6">
                    {items.map((src, index) => (
                        <div
                            key={index}
                            onClick={() => handleInfo(src)}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-105 flex flex-col cursor-pointer"
                        >
                            <div className="h-44 w-full overflow-hidden">
                                <img
                                    src={src.path}
                                    alt={`Infographic ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4 flex-1 flex items-center justify-center">
                                <p className="text-sm text-gray-700 text-center font-medium">
                                    {src.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selected && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-all duration-300"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="bg-white rounded-xl max-w-2xl w-full mx-4 shadow-xl overflow-hidden relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl font-bold"
                            onClick={() => setSelected(null)}
                        >
                            &times;
                        </button>

                        <img
                            src={selected.path}
                            alt="Selected"
                            className="w-full h-80 object-cover"
                        />
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-green-700 mb-2">
                                {selected.name}
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {selected.detail}
                            </p>
                            {selected.credit ? (
                                <a
                                    href={selected.credit}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 text-sm underline hover:text-blue-700 transition-all"
                                >
                                    แหล่งที่มา
                                </a>
                            ) : (
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    ไม่มีแหล่งที่มา
                                </p>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
