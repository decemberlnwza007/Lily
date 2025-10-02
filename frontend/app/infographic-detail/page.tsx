import { useSearchParams } from "next/navigation";
import { ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function InfographicDetail() {
  const params = useSearchParams();

  const name = params.get("name");
  const detail = params.get("detail");
  const path = params.get("path");
  const credit = params.get("credit");

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/info"
          className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          กลับไปหน้ารวม Infographic
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white overflow-hidden">
          <div className="aspect-[16/9] w-full bg-emerald-50">
            <Image
              src={path || "/default.jpg"}
              alt={name || "info"}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-900 leading-snug">
              {name}
            </h1>
            <p className="mt-4 text-emerald-800/80 leading-relaxed text-[15px] sm:text-base">
              {detail}
            </p>

            <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
              {credit ? (
                <a
                  href={credit}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-700"
                >
                  แหล่งที่มา
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <span className="text-sm text-emerald-800/60">
                  ไม่มีแหล่งที่มา
                </span>
              )}

              <Link
                href="/info"
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition"
              >
                กลับหน้ารวม
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
