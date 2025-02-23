import { MdCancel, MdOutlinePhone } from 'react-icons/md'
import { Button } from './ui/button'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { useForm } from 'react-hook-form'
import { FaHashtag, FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { CiLock } from 'react-icons/ci'
import { useResetPasswordMutation } from '@/redux/services/userServices'
import {z} from 'zod'


const stepOneSchemaEmail=z.object({
  email: z.string().email("Invalid email format")   
})



function ResetPassword({onClose,signIn}:{onClose:any,signIn:any}) {
    const [steps,setSteps]=useState(1)
    const [showPassword,setShowPassword]=useState(false)
    const {
        register,
        handleSubmit,
        formState:{errors}
    }=useForm()

    const [
      ResetPasswordRequest,
      {
        data:requestResetPasswordData,
        error:requestResetPasswordError,
        isLoading:requestResetPasswordIsLoading,
        isSuccess:requestResetPasswordIsSuccess,
        isError:requestResetPasswordIsError
      }
    ]=useResetPasswordMutation()


    useEffect(()=>{
      if(requestResetPasswordData && requestResetPasswordIsSuccess){
        console.log("requestResetPassword data:",requestResetPasswordData)
      }
      if(requestResetPasswordIsError){
        console.log("error while requesting reset password",requestResetPasswordError)
      }
    },[requestResetPasswordIsError,requestResetPasswordIsSuccess])

  return (
    <div className="px-5 pb-8 pt-5 bg-white shadow-md rounded-2xl">
        <MdCancel size={28} onClick={onClose} className="absolute top-6 right-5 cursor-pointer" />
        <div className="">
              <div className="mt-5">
                <span className="text-[24px] font-bold text-darkBlue ">
                    {
                        steps===1 ? "Reset password":
                        steps ===2 ? "Verify your account":
                        steps===3 ? "Set your new password":""
                    }
                </span>
              </div>
              <div className="flex items-center justify-between mt-5">
                <Button
                  onClick={signIn}
                  className="h-12 bg-white text-black rounded-[100px] hover:bg-gray-300 border-[2px] border-gray-300"
                >
                  <IoMdArrowRoundBack />
                  Back
                </Button>
                <div className="flex items-center">
                  <div className="w-8 h-8  rounded-full bg-lightBlue flex items-center justify-center">
                    <span className="text-white font-semibold">1</span>
                  </div>
                  <div className="border-t-2 border-dashed mx-1 border-gray-500 w-5"></div>
                  <div className={steps >=2 ? "w-8 h-8 rounded-full bg-lightBlue flex items-center justify-center":"w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center"}>
                    <span className="text-white font-semibold">2</span>
                  </div>
                  <div className="border-t-2 border-dashed mx-1 border-gray-500 w-5"></div>
                  <div className={steps===3 ? "w-8 h-8 rounded-full bg-lightBlue flex items-center justify-center":"w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center"}>
                    <span className="text-white font-semibold">3</span>
                  </div>
                </div>
              </div>

              {
                steps ===1 && (
                  <div
                    className=""
                  >
                    <div className="my-5">
                      <span className="text-lightGray">Provide your phone number or email</span>
                    </div>
                    <form className="">
                      <div className="flex flex-col space-y-1 my-5">
                          <label className="font-semibold">Phone number or email</label>
                          <div className="relative">
                              <MdOutlinePhone className="absolute top-4 left-3" size={18} />
                              <Input 
                              {...register("phone")}
                              className="h-12 rounded-xl indent-8 text-black lg:text-md"
                              placeholder="Phone number or email"
                              />
                          </div>
                      </div>
                      <Button
                        className="text-white w-full h-12 rounded-[100px] bg-darkBlue"
                      >
                        Continue
                      </Button>
                    </form>
                    <div className="flex space-x-2 items-center justify-center my-5">
                      <span className="text-lightGray">By creating an account, you agree to our</span>
                      <span className="text-lightBlue font-semibold">Privacy Policy</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                        <span>Remember password? </span>
                        <span onClick={signIn} className="text-lightBlue font-semibold cursor-pointer hover:underline">Sign in</span>
                    </div>
                  </div>
                )
              }
              {
                steps===2 && (
                  <div
                    className=""
                  >
                    <div className="flex space-x-2 items-center my-5">
                      <span className="text-lightGray">Enter verification code sent to</span>
                      <span className="text-lightBlue font-semibold">0788811122</span>
                    </div>
                    <form className="">
                      <div className="flex flex-col space-y-1 my-5">
                          <label className="font-semibold">Verification code</label>
                          <div className="relative">
                              <FaHashtag className="absolute top-4 left-3" size={18} />
                              <Input 
                                  type="text"
                                  {...register("code")}
                                  className="h-12 rounded-xl indent-8 text-black lg:text-md"
                                  placeholder="Verification code"
                              />
                          </div>
                      </div>
                      <Button
                        className="text-white w-full h-12 rounded-[100px] bg-darkBlue"
                      >
                        Continue
                      </Button>
                    </form>
                    
                    <div className="flex items-center justify-center space-x-2 mt-5">
                        <span>Have not got the code?</span>
                        <span onClick={onClose} className="text-lightBlue font-semibold cursor-pointer hover:underline">Resend code</span>
                    </div>
                  </div>
                )
              }
              {
                steps===3 && (
                  <div
                    className=""
                  >
                    <div className="my-5">
                      <span className="text-lightGray">Set the password for your account</span>
                    </div>
                    <form className="">
                      <div className="flex flex-col space-y-1 my-5">
                          <label className="font-semibold">Password</label>
                          <div className="relative">
                              <CiLock className="absolute top-4 left-3" size={18} />
                              {
                                  !showPassword ? 
                                  <FaRegEye onClick={()=>setShowPassword(!showPassword)} className="absolute top-4 right-3 cursor-pointer" size={18} /> :
                                  <FaRegEyeSlash onClick={()=>setShowPassword(!showPassword)} className="absolute top-4 right-3 cursor-pointer" size={18} />
                              }
                              <Input 
                                  type={showPassword? "text":"password"}
                                  {...register("password")}
                                  className="h-12 rounded-xl indent-8 text-black lg:text-md"
                                  placeholder="Your Password"
                              />
                          </div>
                      </div>
                      <div className="flex flex-col space-y-1 my-5">
                          <label className="font-semibold">Confirm Password</label>
                          <div className="relative">
                              <CiLock className="absolute top-4 left-3" size={18} />
                              {
                                  !showPassword ? 
                                  <FaRegEye onClick={()=>setShowPassword(!showPassword)} className="absolute top-4 right-3 cursor-pointer" size={18} /> :
                                  <FaRegEyeSlash onClick={()=>setShowPassword(!showPassword)} className="absolute top-4 right-3 cursor-pointer" size={18} />
                              }
                              <Input 
                                  type={showPassword? "text":"password"}
                                  {...register("cpassword")}
                                  className="h-12 rounded-xl indent-8 text-black lg:text-md"
                                  placeholder="Confirm Password"
                              />
                          </div>
                      </div>
                      <Button
                        className="text-white w-full h-12 rounded-[100px] bg-darkBlue"
                      >
                        Continue
                      </Button>
                    </form>
                  </div>
                )
              }

            </div>
    </div>
  )
}

export default ResetPassword