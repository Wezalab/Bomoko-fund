import React, { useState } from 'react'
import { Footer, Navbar, ResetPassword, SignIn, SignUp } from '../components'




function Layout({children}:{children:React.ReactNode}) {
    const [signIn,setSignIn]=useState(false)
    const [signUp,setSignUp]=useState(false)
    const [resetPassword,setResetPassword]=useState(false)
    const [forgotPassword,setForgotPassword]=useState(false)
  return (
    <div className='relative'>
      {
        resetPassword && (
          <div className='fixed w-[30%] top-[25%] left-[35%] z-10'>
            <ResetPassword 
              onClose={()=>setResetPassword(false)} 
              signIn={()=>{
                setResetPassword(false)
                setSignUp(false)
                setSignIn(true)
              }}
            />
          </div>
        )
      }
      {
        signIn && (
          <div className='fixed w-[30%] top-[25%] left-[35%] z-10'>
            <SignIn 
              resetPassword={resetPassword}
              setResetPassword={setResetPassword}
              onClose={()=>setSignIn(false)}
            />
          </div>
        )
      }
      {
        signUp && (
          <div className='fixed w-[30%] top-[25%] left-[35%] z-10'>
            <SignUp 
              onClose={()=>setSignUp(false)}
            />
          </div>
        )
      }
      <div className={(signIn || signUp || resetPassword )?'blur-sm':""}>
        <Navbar 
            setSignUp={setSignUp}
            setSignIn={setSignIn}
            signIn={signIn}
            signUp={signUp}
            setResetPassword={setResetPassword}
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