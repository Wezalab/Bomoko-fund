import React, { useState } from 'react'
import { Footer, Navbar, ResetPassword, SignIn, SignUp } from '../components'
import ChangePassword from '@/components/ChangePassword'
import NotificationModal from '@/components/NotificationModal'
import { Sheet, SheetContent, SheetOverlay } from '@/components/ui/sheet'


function Layout({children}:{children:React.ReactNode}) {
    const [signIn,setSignIn]=useState(false)
    const [signUp,setSignUp]=useState(false)
    const [resetPassword,setResetPassword]=useState(false)
    const [changePassword,setChangePassword]=useState(false)
    const [notification,setNotification]=useState(false)
  return (
    <div className='relative'>
      {/* ResetPassword Modal */}
      <Sheet open={resetPassword} onOpenChange={setResetPassword}>
        <SheetOverlay className="bg-black/50" />
        <SheetContent side="top" className="w-[90%] md:w-3/4 lg:w-[40%] h-auto p-0 border-none rounded-b-2xl mx-auto">
          <ResetPassword 
            setSignIn={setSignIn}
            onClose={()=>setResetPassword(false)} 
            signIn={()=>{
              setResetPassword(false)
              setSignUp(false)
              setSignIn(true)
            }}
          />
        </SheetContent>
      </Sheet>

      {/* ChangePassword Modal */}
      <Sheet open={changePassword} onOpenChange={setChangePassword}>
        <SheetOverlay className="bg-black/50" />
        <SheetContent side="top" className="w-[90%] md:w-3/4 lg:w-[40%] h-auto p-0 border-none rounded-b-2xl mx-auto">
          <ChangePassword onClose={()=>setChangePassword(false)} />
        </SheetContent>
      </Sheet>

      {/* Notification Modal */}
      <Sheet open={notification} onOpenChange={setNotification}>
        <SheetOverlay className="bg-black/50" />
        <SheetContent side="top" className="w-[90%] md:w-[50%] lg:w-[25%] h-auto p-0 border-none rounded-b-2xl right-0 left-auto ml-auto">
          <NotificationModal onClose={()=>setNotification(false)} />
        </SheetContent>
      </Sheet>

      {/* SignIn Modal */}
      <Sheet open={signIn} onOpenChange={setSignIn}>
        <SheetOverlay className="bg-black/50" />
        <SheetContent side="top" className="w-[90%] md:w-3/4 lg:w-[30%] h-auto p-0 border-none rounded-b-2xl mx-auto">
          <SignIn 
            resetPassword={resetPassword}
            setResetPassword={setResetPassword}
            onClose={()=>setSignIn(false)}
            setSignUp={setSignUp}
            signUp={signUp}
          />
        </SheetContent>
      </Sheet>

      {/* SignUp Modal */}
      <Sheet open={signUp} onOpenChange={setSignUp}>
        <SheetOverlay className="bg-black/50" />
        <SheetContent side="top" className="w-[90%] md:w-3/4 lg:w-[30%] h-auto max-h-[80vh] p-0 border-none rounded-b-2xl mx-auto overflow-y-auto">
          <SignUp 
            onClose={()=>setSignUp(false)}
            signIn={signIn}
            setSignIn={setSignIn}
          />
        </SheetContent>
      </Sheet>

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