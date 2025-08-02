import { SendHorizonal, Frown, SmilePlus, Meh, Star } from "lucide-react"

export default function InputBar() {
    return (
        <div className="sticky bottom-0 bg-white w-full md:w-8/12 shadow-xl rounded-t-xl shadow-inner">
            <div className="max-w-full md:max-w-3xl mx-auto px-4 py-4">
                <div className="flex flex-wrap gap-2 justify-center mb-3">
                    <button className="bg-purple-200 hover:bg-purple-300 duration-300 flex items-center gap-2 text-purple-900 px-4 py-2 rounded-full cursor-pointer text-sm md:text-base">
                        <Frown className="text-purple-700" /> รู้สึกเศร้า
                    </button>
                    <button className="bg-purple-200 hover:bg-purple-300 duration-300 flex items-center gap-2 text-purple-900 px-4 py-2 rounded-full cursor-pointer text-sm md:text-base">
                        <SmilePlus className="text-purple-700" /> อยากคุยหน่อยได้ไหม?
                    </button>
                    <button className="bg-yellow-200 hover:bg-yellow-300 duration-300 flex items-center gap-2 text-yellow-900 px-4 py-2 rounded-full cursor-pointer text-sm md:text-base">
                        <Star className="text-yellow-700" /> ช่วยแนะนำหน่อย
                    </button>
                    <button className="bg-purple-200 hover:bg-purple-300 duration-300 flex items-center gap-2 text-purple-900 px-4 py-2 rounded-full cursor-pointer text-sm md:text-base">
                        <Meh className="text-purple-700" /> รู้สึกกังวล
                    </button>
                </div>
                <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 shadow-sm 
            focus-within:ring-2 focus-within:ring-green-300 focus-within:border-green-300 
            focus-within:outline-none border border-transparent transition">
                    <input
                        type="text"
                        placeholder="เล่าให้ฉันฟังสิ... ฉันพร้อมช่วยอยู่ตรงนี้ 💖"
                        className="flex-1 text-sm bg-transparent text-gray-700 outline-none px-3 py-2"
                    />
                    <button className="text-green-500 text-xl cursor-pointer ml-2">
                        <SendHorizonal className="hover:text-green-600" />
                    </button>
                </div>
            </div>
        </div>
    )
}
