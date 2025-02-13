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
          <div className='fixed w-[90%] top-[20%] left-[4%] md:w-3/4 lg:w-[30%]  md:top-[15%] lg:top-[25%] md:left-[10%] lg:left-[35%] z-10'>
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
          <div className='fixed w-[90%] top-[20%] left-[4%] md:w-3/4 lg:w-[30%]  md:top-[15%] lg:top-[25%] md:left-[10%] lg:left-[35%] z-10'>
            <SignIn 
              resetPassword={resetPassword}
              setResetPassword={setResetPassword}
              onClose={()=>setSignIn(false)}
              setSignUp={setSignUp}
              signUp={signUp}
            />
          </div>
        )
      }
      {
        signUp && (
          <div className='absolute w-[90%] top-[5%] left-[4%] md:w-3/4 lg:w-[30%]  md:top-[5%] lg:top-[15%] md:left-[10%] lg:left-[35%] z-10'>
            <SignUp 
              onClose={()=>setSignUp(false)}
              signIn={signIn}
              setSignIn={setSignIn}
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