import React from 'react'
import { SidebarProvider } from "../../../components/ui/sidebar"
import { AppSidebar } from "../../../components/app-sidebar"
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='flex-1'>
        {children}
      </main>
    </SidebarProvider>
  )
}

export default layout