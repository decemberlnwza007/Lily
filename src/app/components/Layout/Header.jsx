import { Heart } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-green-400 w-8/12 rounded-b-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-2 left-4 w-3 h-3 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-6 right-8 w-2 h-2 bg-green-200 rounded-full animate-bounce"></div>
        <div className="absolute bottom-3 left-12 w-2 h-2 bg-green-300 rounded-full animate-ping"></div>
      </div>
      
      <div className="max-w-3xl mx-auto px-6 py-6 flex items-center gap-4 text-white relative z-10">
        <div className="w-14 h-14 bg-gradient-to-br from-white to-green-100 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
          <span className="text-green-600 transform hover:rotate-12 transition-transform duration-300">
            <Heart size={24} fill="currentColor" />
          </span>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent drop-shadow-sm">
            Lily
          </h1>
          <p className="text-lg opacity-90 font-medium text-green-50">
            AI Chatbot
          </p>
        </div>
        
        <div className="flex gap-2 opacity-60">
          <div className="w-4 h-4 bg-green-300 rounded-full transform rotate-45"></div>
          <div className="w-3 h-3 bg-green-200 rounded-full transform rotate-45 mt-1"></div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-300 via-green-400 to-green-300"></div>
    </header>
  )
}