"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, ExternalLink, BookOpen } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-4">
            <BookOpen className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            คลังความรู้<span className="text-emerald-600">สุขภาพจิต</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            แหล่งรวมข้อมูลที่ถูกต้องและน่าเชื่อถือ เพื่อความเข้าใจที่ดียิ่งขึ้น
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto mb-16 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="ค้นหาบทความ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all shadow-sm hover:shadow-md text-base"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
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
                className="block relative h-56 overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10" />
                <Image
                  src={item.path}
                  alt={item.name}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              <div className="p-6 flex flex-col flex-grow">
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
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {item.name}
                  </h2>
                </Link>

                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                  {item.detail}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                  {item.credit ? (
                    <a
                      href={item.credit}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-emerald-600 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      แหล่งที่มา
                    </a>
                  ) : (
                    <span className="text-xs text-gray-300">ไม่มีแหล่งที่มา</span>
                  )}

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
                    className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    อ่านต่อ
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ไม่พบข้อมูลที่ค้นหา
            </h3>
            <p className="text-gray-500">
              ลองค้นหาด้วยคำสำคัญอื่น หรือดูบทความทั้งหมด
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
