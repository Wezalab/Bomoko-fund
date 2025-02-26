import React, { useState } from 'react'
import { Footer, Navbar, ResetPassword, SignIn, SignUp } from '../components'
import ChangePassword from '@/components/ChangePassword'
import NotificationModal from '@/components/NotificationModal'


function Layout({children}:{children:React.ReactNode}) {
    const [signIn,setSignIn]=useState(false)
    const [signUp,setSignUp]=useState(false)
    const [resetPassword,setResetPassword]=useState(false)
    const [changePassword,setChangePassword]=useState(false)
    const [notification,setNotification]=useState(false)
  return (
    <div className='relative'>
      {
        resetPassword && (
          <div className='fixed w-[90%] top-[20%] left-[4%] md:w-3/4 lg:w-[40%]  md:top-[15%] lg:top-[25%] md:left-[10%] lg:left-[35%] z-10'>
            <ResetPassword 
              setSignIn={setSignIn}
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
        changePassword && (
          <div className='fixed w-[90%] top-[20%] left-[4%] md:w-3/4 lg:w-[40%]  md:top-[15%] lg:top-[25%] md:left-[10%] lg:left-[35%] z-10'>
            <ChangePassword 
              onClose={()=>setChangePassword(false)} 
              
            />
          </div>
        )
      }
      {
        notification && (
          <div className='fixed w-[90%] top-[5%] left-[4%] md:w-[50%] lg:w-[25%]  md:top-[3%] lg:top-[5%] md:left-[48%] lg:left-[72%] z-10'>
            <NotificationModal
              onClose={()=>setNotification(false)}
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
          <div className='absolute w-[90%] top-[5%] left-[4%] md:w-3/4 lg:w-[30%]  md:top-[5%] lg:top-[5%] md:left-[10%] lg:left-[35%] z-10'>
            <SignUp 
              onClose={()=>setSignUp(false)}
              signIn={signIn}
              setSignIn={setSignIn}
            />
          </div>
        )
      }
      <div className={(signIn || signUp || resetPassword || changePassword || notification )?'blur-sm':""}>
        <Navbar 
            setNotification={setNotification}
            setSignUp={setSignUp}
            setSignIn={setSignIn}
            signIn={signIn}
            signUp={signUp}
            setResetPassword={setResetPassword}
            setChangePassword={setChangePassword}
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