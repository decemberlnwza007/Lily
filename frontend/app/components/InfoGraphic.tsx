"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, ExternalLink } from "lucide-react";

type Item = {
  id: number;
  name: string;
  path: string;
  detail: string;
  credit?: string;
};

const items: Item[] = [
  {
    id: 1,
    name: "โรคซึมเศร้า (Depression)",
    path: "/info/depression.jpg",
    detail:
      "โรคซึมเศร้าคือภาวะความผิดปกติทางอารมณ์ที่ทำให้ผู้ป่วยรู้สึกเศร้า ท้อแท้ และหมดหวังอย่างต่อเนื่อง ส่งผลกระทบต่อการใช้ชีวิตประจำวัน ความสัมพันธ์ และการทำงาน อาการอาจรวมถึงการนอนไม่หลับ เบื่ออาหาร และมีความคิดทำร้ายตัวเอง",
    credit: "https://www.rama.mahidol.ac.th/ramamental/generaldoctor/06052014-1109",
  },
  {
    id: 2,
    name: "โรคไบโพลาร์ (Bipolar Disorder)",
    path: "/info/bipolar.jpg",
    detail:
      "โรคไบโพลาร์หรือโรคอารมณ์สองขั้ว เป็นภาวะที่ผู้ป่วยมีการเปลี่ยนแปลงของอารมณ์อย่างรุนแรง ระหว่างช่วงที่อารมณ์ดีผิดปกติ (Mania) และช่วงที่ซึมเศร้า (Depression) ซึ่งส่งผลต่อพลังงาน ระดับกิจกรรม และความสามารถในการตัดสินใจ",
    credit: "https://www.rama.mahidol.ac.th/ramamental/generaldoctor/06052014-1115",
  },
  {
    id: 3,
    name: "โรคแพนิค (Panic Disorder)",
    path: "/info/panic.jpg",
    detail:
      "โรคแพนิคคือภาวะตื่นตระหนกที่เกิดขึ้นอย่างเฉียบพลันโดยไม่มีสาเหตุที่ชัดเจน ผู้ป่วยอาจมีอาการหัวใจเต้นเร็ว หายใจไม่อิ่ม เหงื่อออก และรู้สึกเหมือนกำลังจะตายหรือควบคุมตัวเองไม่ได้",
    credit: "https://www.rama.mahidol.ac.th/ramamental/generaldoctor/06052014-1122",
  },
  {
    id: 4,
    name: "โรคจิตเภท (Schizophrenia)",
    path: "/info/schizophrenia.jpg",
    detail:
      "โรคจิตเภทเป็นความผิดปกติทางจิตที่รุนแรง ส่งผลให้ผู้ป่วยมีการรับรู้ความเป็นจริงที่ผิดเพี้ยนไป เช่น มีอาการหูแว่ว เห็นภาพหลอน หรือมีความคิดหลงผิด ซึ่งต้องการการรักษาอย่างต่อเนื่อง",
    credit: "https://www.rama.mahidol.ac.th/ramamental/generaldoctor/06052014-1128",
  },
  {
    id: 5,
    name: "โรคเครียดหลังเหตุการณ์สะเทือนใจ (PTSD)",
    path: "/info/ptsd.jpg",
    detail:
      "PTSD เป็นภาวะทางจิตที่เกิดขึ้นหลังจากเผชิญกับเหตุการณ์ที่กระทบกระเทือนจิตใจอย่างรุนแรง เช่น อุบัติเหตุ สงคราม หรือการถูกทำร้าย ผู้ป่วยอาจมีอาการฝันร้าย หวาดระแวง และหลีกเลี่ยงสิ่งที่กระตุ้นความทรงจำนั้น",
    credit: "https://www.rama.mahidol.ac.th/ramamental/generaldoctor/06052014-1134",
  },
  {
    id: 6,
    name: "โรคสมาธิสั้น (ADHD)",
    path: "/info/adhd.jpg",
    detail:
      "โรคสมาธิสั้นเป็นภาวะที่มักเริ่มในวัยเด็กและอาจต่อเนื่องถึงวัยผู้ใหญ่ ผู้ป่วยมักมีปัญหาในการจดจ่อ ควบคุมพฤติกรรม หรืออยู่นิ่งไม่ได้ ซึ่งส่งผลกระทบต่อการเรียนและการทำงาน",
    credit: "https://www.rama.mahidol.ac.th/ramamental/generaldoctor/06052014-1140",
  },
];

export default function InfoGraphic() {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 drop-shadow-sm">
            คลังความรู้สุขภาพจิต
          </h1>
          <p className="text-lg text-emerald-800/70 max-w-2xl mx-auto font-medium">
            รวบรวมข้อมูลและสาระน่ารู้เกี่ยวกับโรคทางจิตเวช เพื่อความเข้าใจที่ถูกต้อง
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto mb-16 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-emerald-400 group-focus-within:text-emerald-600 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="ค้นหาบทความ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-emerald-100 bg-white/80 backdrop-blur-sm text-emerald-900 placeholder-emerald-400/70 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 transition-all shadow-lg hover:shadow-xl text-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <Link
              href={{
                pathname: "/infographic-detail",
                query: {
                  name: item.name,
                  path: item.path,
                  detail: item.detail,
                  credit: item.credit,
                },
              }}
              key={item.id}
              className="group relative bg-white rounded-3xl overflow-hidden border border-emerald-100/50 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-transparent transition-colors z-10" />
                <Image
                  src={item.path}
                  alt={item.name}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="p-8 flex flex-col flex-grow relative z-20 bg-white/95 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-emerald-950 mb-3 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                  {item.name}
                </h2>
                <p className="text-emerald-800/70 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                  {item.detail}
                </p>

                <div className="flex items-center text-emerald-600 font-semibold text-sm group/btn">
                  <span className="group-hover/btn:mr-2 transition-all">อ่านเพิ่มเติม</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-emerald-100/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-emerald-900 mb-2">
              ไม่พบข้อมูลที่ค้นหา
            </h3>
            <p className="text-emerald-600/70">
              ลองค้นหาด้วยคำสำคัญอื่น หรือดูบทความทั้งหมด
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
