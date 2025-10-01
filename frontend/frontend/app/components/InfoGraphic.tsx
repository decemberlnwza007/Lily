"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, ExternalLink } from "lucide-react";

type Item = {
  name: string;
  path: string;
  detail: string;
  credit?: string;
};

export default function InfoGraphic() {
  const router = useRouter();
  const [selected, setSelected] = useState<Item | null>(null);
  const [q, setQ] = useState("");

  const items: Item[] = [
    {
      name: "6 วิธีเพื่อรับมือและป้องกันภาวะซึมเศร้าหลังวันหยุดยาว",
      path: "/Infographic/1.jpg",
      detail:
        "ภาวะซึมเศร้าหลังวันหยุดยาวเกิดขึ้นได้บ่อยมากในวัยเรียนและวัยทำงาน คำแนะนำนี้จะช่วยให้คุณปรับตัวได้ง่ายขึ้น",
    },
    {
      name: "ประเด็นวัยเรียน : “การกลั่นแกล้งรังแกกัน ไม่ใช่เรื่องล้อเล่น",
      path: "/Infographic/2.jpg",
      detail:
        "การกลั่นแกล้งในวัยเรียนส่งผลต่อสุขภาพจิตระยะยาว Infographic นี้ชวนให้ตระหนักและรับมืออย่างเข้าใจ",
      credit: "https://mhc7.dmh.go.th/09/05/2024/17856-2-2-2-2-2-2/",
    },
    {
      name: "ประเด็นวัยสูงอายุ : ดูแลใจ สูงวัยอยู่ลำพัง…รับมือกับความเหงาและความสูญเสีย",
      path: "/Infographic/3.jpg",
      detail:
        "สถานการณ์ผู้สูงอายุที่อยู่ตามลำพัง สาเหตุของความเหงา สัญญาณเตือนเสี่ยงโดดเดี่ยว การรับมือความเหงาและความสูญเสีย เทคนิคเพิ่มพลังใจและดูแลสุขภาพใจ",
      credit: "https://mhc7.dmh.go.th/09/05/2024/17856-2-2-2-2/",
    },
    {
      name: "ประเด็นวัยทำงาน : “ความสุขก็สร้างได้ เครียดก็คลายให้เป็น”",
      path: "/Infographic/4.jpg",
      detail:
        "ความหมายของความเครียด การประเมินความเครียด วิธีคลายเครียด เทคนิคสร้างสุข คิดบวก และการตรวจสุขภาพใจ",
      credit: "https://mhc7.dmh.go.th/09/05/2024/17856-2-2-2-2-2/",
    },
  ];

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(s) ||
        i.detail.toLowerCase().includes(s)
    );
  }, [q]);

  const handleInfo = (item: Item) => {
    const query = new URLSearchParams({
      name: item.name,
      detail: item.detail,
      path: item.path,
      credit: item.credit || "",
    });
    router.push(`/infographic-detail?${query.toString()}`);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100">
      <div className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]">
        <div className="absolute -top-28 -left-16 size-[22rem] rounded-full bg-emerald-200 blur-3xl" />
        <div className="absolute bottom-0 right-0 size-[26rem] rounded-full bg-teal-200 blur-3xl" />
      </div>

      <div className="relative z-10 w-full mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white/70 backdrop-blur-md border border-white rounded-3xl shadow-xl p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-900">
                Infographic ความรู้
              </h1>
            </div>
            <div className="w-full sm:w-80">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-700/70" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="ค้นหาหัวข้อหรือคำสำคัญ..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-emerald-200 bg-white/80 outline-none focus:ring-2 focus:ring-emerald-300 text-emerald-900 placeholder-emerald-800/50"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
              >
                <button
                  onClick={() => handleInfo(item)}
                  className="block w-full text-left"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={item.path}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-2 font-semibold text-emerald-900">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm text-emerald-800/70 line-clamp-2">
                      {item.detail}
                    </p>
                  </div>
                </button>

                <div className="flex items-center justify-between px-4 pb-4 pt-1">
                  {item.credit ? (
                    <a
                      href={item.credit}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-emerald-800/80"
                    >
                      แหล่งที่มา
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="text-sm text-emerald-800/60">
                      ไม่มีแหล่งที่มา
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-14 text-center text-emerald-800/70">
              ไม่พบผลลัพธ์ที่ตรงกับ “{q}”
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
}
