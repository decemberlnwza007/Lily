import EstimateForm from '../components/EstimateForm'
import SidebarLayout from '../components/SidebarComponent'

import '../style/bg.css'
import '../style/Chat.css'

export default function Estimate() {
  return (
    <div className="h-dvh min-h-dvh grid grid-cols-[18rem_1fr] bg overflow-hidden">
      <aside className="h-dvh min-h-0 overflow-y-auto">
        <SidebarLayout />
      </aside>

      <main className="relative h-dvh min-h-0">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' ... %3C/svg%3E")`,
            backgroundSize: '40px 40px',
            backgroundRepeat: 'repeat',
          }}
        />

        <div className="absolute inset-0 z-10 flex flex-col overflow-auto min-h-0">
          <div className="flex-1 flex min-h-0">
            <EstimateForm />
          </div>
        </div>
      </main>
    </div>
  )
}
