import Image from 'next/image'
import LilyLogin from './components/LoginForm'
import SidebarLayout from './components/SidebarComponent'
import EstimateForm from './components/EstimateForm'
import AssessForDespression from './components/AssessForDepression'
import Chatbot from './pages/Chatbot'
import { redirect } from 'next/navigation'
import { auth } from '../../auth'

export default async function Home() {
    const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return <Chatbot />
}
