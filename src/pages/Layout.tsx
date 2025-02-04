import React, { useState } from 'react'
import { Footer, Navbar, SignIn } from '../components'




function Layout({children}:{children:React.ReactNode}) {
    const [signIn,setSignIn]=useState(false)
    const [signUp,setSignUp]=useState(false)
    const [forgotPassword,setForgotPassword]=useState(false)
  return (
    <div className='relative'>
      {
        signIn && (
          <div className='fixed w-[30%] top-[25%] left-[35%] z-10'>
            <SignIn 
              onClose={()=>setSignIn(false)}
            />
          </div>
        )
      }
      <div className={(signIn || signUp )?'blur-sm':""}>
        <Navbar 
            setSignUp={setSignUp}
            setSignIn={setSignIn}
            signIn={signIn}
            signUp={signUp}
          />
          <div className=''>
            {children}
          </div>
          <Footer />
      </div>
    </div>
  )
}

export default Layout