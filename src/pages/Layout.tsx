import React from 'react'
import { Footer, Navbar } from '../components'

function Layout({children}:{children:React.ReactNode}) {
  return (
    <div>
        <Navbar />
        {children}
        <Footer />
    </div>
  )
}

export default Layout