import { MdCancel, MdOutlinePhone } from 'react-icons/md'
import { Button } from './ui/button'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { useForm } from 'react-hook-form'
import { FaHashtag, FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { CiLock } from 'react-icons/ci'
import { useResetPasswordMutation, useResetPasswordRequestMutation, useVerifyOtpMutation } from '@/redux/services/userServices'
import {z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import LoadingComponent from './LoadingComponent'
import toast from 'react-hot-toast'
import { initialState, selectSignUpData, setSignUpData } from '@/redux/slices/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'



const stepOneSchemaEmail=z.object({
  email: z.string().email("Invalid email format")   
})

const stepTwoSchema=z.object({
  code:z.string().min(4,"Code must be minimum of 4 characters")
})

const stepThreeSchema=z.object({
    password: z.string().min(6, "Password must contain at least 6 characters"),
    Cpassword: z.string().min(6, "Confirm password must contain at least 6 characters"),
    }).superRefine((data, ctx) => {
      if (data.password !== data.Cpassword) {
          ctx.addIssue({
              code: "custom",
              path: ["Cpassword"],
              message: "Passwords do not match",
          });
      }
})

type StepOneData=z.infer<typeof stepOneSchemaEmail>
type StepTwoData=z.infer<typeof stepTwoSchema>
type StepThreeData=z.infer<typeof stepThreeSchema>


function ResetPassword({onClose,signIn,setSignIn}:{onClose:any,setSignIn:any,signIn:any}) {
    const [steps,setSteps]=useState(1)
    const [showPassword,setShowPassword]=useState(false)
    const dispatch=useAppDispatch()
    const signupData=useAppSelector(selectSignUpData)
    const {
        register:registerStepOne,
        handleSubmit:handleSubmitStepOne,
        formState:{errors:errorsStepOne}
    }=useForm<StepOneData>({
      resolver:zodResolver(stepOneSchemaEmail)
    })


    const {
      register:registerStepTwo,
      handleSubmit:handleSubmitStepTwo,
      formState:{errors:errorsStepTwo}
  }=useForm<StepTwoData>({
    resolver:zodResolver(stepTwoSchema)
  })

  const {
    register:registerStepThree,
    handleSubmit:handleSubmitStepThree,
    reset:resetStepThree,
    formState:{errors:errorsStepThree}
  }=useForm<StepThreeData>({
    resolver:zodResolver(stepThreeSchema)
  })

    const [
      ResetPasswordRequest,
      {
        data:requestResetPasswordData,
        error:requestResetPasswordError,
        isLoading:requestResetPasswordIsLoading,
        isSuccess:requestResetPasswordIsSuccess,
        isError:requestResetPasswordIsError
      }
    ]=useResetPasswordRequestMutation()

    const [
      verifyOtp,
      {
        data:VerifyOtpData,
        error:verifyOtpError,
        isLoading:verifyOtpIsLoading,
        isSuccess:verifyOtpIsSuccess,
        isError:verifyOtpIsError
      }
    ]=useVerifyOtpMutation()
    

    const [
      ResetPassword,
      {
        data:resetPasswordData,
        isLoading:resetPasswordIsLoading,
        isError:resetPasswordIsError,
        error:resetPasswordError,
        isSuccess:resetPasswordIsSuccess
      }
    ]=useResetPasswordMutation()

    useEffect(()=>{
      if(VerifyOtpData && verifyOtpIsSuccess){
        toast.success("email address verified")
        setSteps(3)
      }
      if(verifyOtpIsError){
        toast.error("Verify otp error")
        console.log("verify otp error",verifyOtpError)
      }
    },[verifyOtpIsError,verifyOtpIsSuccess])

    useEffect(()=>{
      if(requestResetPasswordData && requestResetPasswordIsSuccess){
        toast.success("An email with token has been sent to you")
        setSteps(2)
        console.log("requestResetPassword data:",requestResetPasswordData)
      }
      if(requestResetPasswordIsError){
        console.log("error while requesting reset password",requestResetPasswordError)
      }
    },[requestResetPasswordIsError,requestResetPasswordIsSuccess])

    useEffect(()=>{
      if(resetPasswordIsSuccess && resetPasswordData){
        onClose()
        toast.success("password reset successfully")
        dispatch(setSignUpData(initialState.signUpData))
        setSignIn(true)
      }
      if(resetPasswordIsError){
        console.log("error while resetting password",resetPasswordError)
      }
    },[resetPasswordIsError,resetPasswordIsSuccess])

    const onsubmitEmail=(data:StepOneData)=>{
      dispatch(setSignUpData({email:data.email}))
      ResetPasswordRequest({
        email:data.email
      })
    }

    const onVerifyEmail=(data:StepTwoData)=>{
      verifyOtp({
        email:signupData.email,
        otp:data.code
      })
    }

    const resetPassword=(data:StepThreeData)=>{
      ResetPassword({
        email:signupData.email,
        newPassword:data.password
      })
    }

    useEffect(()=>{
      console.log("error while sending emailzod:",errorsStepOne)
    },[errorsStepOne])

    useEffect(()=>{
      console.log("error while verifying email zod:",errorsStepTwo)
    },[errorsStepTwo])

    useEffect(()=>{
      console.log("error while reseting  password:",errorsStepThree)
    },[errorsStepThree])

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
                    <form onSubmit={handleSubmitStepOne(onsubmitEmail)} className="">
                      <div className="flex flex-col space-y-1 my-5">
                          <label className="font-semibold">Phone number or email</label>
                          <div className="relative">
                              <MdOutlinePhone className="absolute top-4 left-3" size={18} />
                              <Input 
                                {...registerStepOne("email")}
                                className="h-12 rounded-xl indent-8 text-black lg:text-md"
                                placeholder="Phone number or email"
                              />
                              {errorsStepOne.email && <p className="text-red-600 text-xs mt-2">{errorsStepOne.email?.message}</p>}
                          </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={requestResetPasswordIsLoading}
                        className="text-white w-full h-12 rounded-[100px] bg-darkBlue"
                      >
                        {requestResetPasswordIsLoading ? <LoadingComponent /> :"Continue"}
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
                      <span className="text-lightBlue font-semibold">{signupData.email}</span>
                    </div>
                    <form onSubmit={handleSubmitStepTwo(onVerifyEmail)} className="">
                      <div className="flex flex-col space-y-1 my-5">
                          <label className="font-semibold">Verification code</label>
                          <div className="relative">
                              <FaHashtag className="absolute top-4 left-3" size={18} />
                              <Input 
                                  type="text"
                                  {...registerStepTwo("code")}
                                  className="h-12 rounded-xl indent-8 text-black lg:text-md"
                                  placeholder="Verification code"
                              />
                              {errorsStepTwo.code && <span className='text-red-600 mt-2'>{errorsStepTwo.code?.message}</span>}
                          </div>
                      </div>
                      <Button
                        className="text-white w-full h-12 rounded-[100px] bg-darkBlue"
                      >
                        {verifyOtpIsLoading ? <LoadingComponent /> :"Continue"}
                      </Button>
                    </form>
                    
                    <div className="flex items-center justify-center space-x-2 mt-5">
                        <span>Have not got the code?</span>
                        <span onClick={()=>{
                          ResetPasswordRequest({
                            email:signupData.email
                          })
                        }} className="text-lightBlue font-semibold cursor-pointer hover:underline">Resend code</span>
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
                    <form onSubmit={handleSubmitStepThree(resetPassword)} className="">
                      <div className="flex flex-col space-y-1 my-5">
                          <label className="font-semibold">New Password</label>
                          <div className="relative">
                              <CiLock className="absolute top-4 left-3" size={18} />
                              {
                                  !showPassword ? 
                                  <FaRegEye onClick={()=>setShowPassword(!showPassword)} className="absolute top-4 right-3 cursor-pointer" size={18} /> :
                                  <FaRegEyeSlash onClick={()=>setShowPassword(!showPassword)} className="absolute top-4 right-3 cursor-pointer" size={18} />
                              }
                              <Input 
                                  type={showPassword? "text":"password"}
                                  {...registerStepThree('password')}
                                  className="h-12 rounded-xl indent-8 text-black lg:text-md"
                                  placeholder="Your Password"
                              />
                              {errorsStepThree.password && <span className='text-red-600 mt-2'>{errorsStepThree.password?.message}</span>}
                          </div>
                      </div>
                      <div className="flex flex-col space-y-1 my-5">
                          <label className="font-semibold">Confirm New Password</label>
                          <div className="relative">
                              <CiLock className="absolute top-4 left-3" size={18} />
                              {
                                  !showPassword ? 
                                  <FaRegEye onClick={()=>setShowPassword(!showPassword)} className="absolute top-4 right-3 cursor-pointer" size={18} /> :
                                  <FaRegEyeSlash onClick={()=>setShowPassword(!showPassword)} className="absolute top-4 right-3 cursor-pointer" size={18} />
                              }
                              <Input 
                                  type={showPassword? "text":"password"}
                                  {...registerStepThree('Cpassword')}
                                  className="h-12 rounded-xl indent-8 text-black lg:text-md"
                                  placeholder="Confirm Password"
                              />
                              {errorsStepThree.Cpassword && <span className='text-red-600 mt-2'>{errorsStepThree.Cpassword?.message}</span>}
                          </div>
                      </div>
                      <Button
                        type="submit"
                        className="text-white w-full h-12 rounded-[100px] bg-darkBlue"
                      >
                        {resetPasswordIsLoading ? <LoadingComponent /> :"Reset Password"}
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