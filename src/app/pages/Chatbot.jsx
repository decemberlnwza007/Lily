import Header from '../components/Layout/Header'
import ChatArea from '../components/Layout/ChatBubble'
import InputBar from '../components/Layout/InputBar'
import SidebarLayout from '../components/SidebarComponent'

import './../style/bg.css'
import './../style/Chat.css'

export default function Chatbot() {
  return (
    <div className="min-h-screen flex bg overflow">
      <SidebarLayout />

      <main className="flex-1 flex flex-col relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23128C7E' fill-opacity='0.4'%3E%3Ccircle cx='8' cy='8' r='2'/%3E%3Crect x='16' y='6' width='4' height='4'/%3E%3Cpath d='M26 8h4v1h-4v-1zm0 2h3v1h-3v-1z'/%3E%3Ccircle cx='8' cy='20' r='1.5'/%3E%3Crect x='16' y='18' width='6' height='4' rx='2'/%3E%3Cpath d='M26 20h3v1h-3v-1zm0 2h4v1h-4v-1z'/%3E%3Ccircle cx='8' cy='32' r='2'/%3E%3Crect x='16' y='30' width='4' height='4'/%3E%3Cpath d='M26 32h4v1h-4v-1zm0 2h3v1h-3v-1z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
            backgroundRepeat: 'repeat',
          }}
        />
        <div className="relative z-10 flex flex-col h-full ">
          {/* <div className="flex ">
            <Header />
          </div> */}
          <div className="flex flex-1 ">
            <ChatArea />
          </div>
        </div>
      </main>
    </div>
  )
}
