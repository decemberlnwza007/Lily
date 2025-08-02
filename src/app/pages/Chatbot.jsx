import Header from "../components/Layout/Header"
import ChatArea from "../components/Layout/ChatBubble"
import InputBar from "../components/Layout/InputBar"
import SidebarLayout from "../components/SidebarComponent"

import "./../style/Chat.css"

export default function Chatbot() {
  return (
    <div className="min-h-screen flex bg-green-50">
      {/* <SidebarLayout /> */}
      <main className="flex-1 flex flex-col">
        <div className="flex justify-center">
          <Header />
        </div>
        <ChatArea />
      </main>
    </div>
  )
}
