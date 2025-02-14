import { useEffect, useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { IoMdArrowRoundBack, IoMdMail } from "react-icons/io"
import { IoCall } from "react-icons/io5"
import { MdCancel, MdMail, MdOutlinePhone,  } from "react-icons/md"
import { Button } from "./ui/button"
import { useForm } from "react-hook-form"
import { Input } from "./ui/input"
import { FaHashtag, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { CiLock } from "react-icons/ci"
import { useFinalizeRegistrationMutation, useRegisterOtpMutation, useVerifyOtpMutation } from "@/redux/services/userServices"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { BsPerson } from "react-icons/bs"
import { PinIcon } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import toast from "react-hot-toast"
import { initialState, selectSignUpData, setSignUpData } from "@/redux/slices/userSlice"
import LoadingComponent from "./LoadingComponent"

interface signUpProps{
  onClose:any 
  setSignIn:any 
  signIn:boolean
}

const stepOneSchema=z.object({
  phone: z
    .string()
    .regex(/^\+\d+$/, "Phone number must start with '+' and contain only numbers")
    .transform((val) => val.replace(/\s+/g, ""))
    
})

const stepTwoSchema=z.object({
  // phone: z
  //   .string()
  //   .regex(/^\+\d+$/, "Phone number must start with '+' and contain only numbers")
  //   .transform((val) => val.replace(/\s+/g, "")),
  code:z.string().min(4,"verification code must contain at least 4 numbers")
})

const stepThreeSchema=z.object({
  names:z.string().min(3,"names must contain at least 3 letters"),
  email: z.string().email("Invalid email format"),
  location:z.string().min(3,"location must be at least 3 characters"),
  password:z.string().min(6,"password must be at least 6 characters length"),
  gender: z.enum(["M", "F"], { message: "Please select a gender" }),
  cpassword:z.string().min(6,"password must be at least 6 characters length")
})


type StepOneData = z.infer<typeof stepOneSchema>;
type StepTwoData = z.infer<typeof stepTwoSchema>;
type StepThreeData =z.infer<typeof stepThreeSchema>

function SignUp({
  onClose,
  signIn,
  setSignIn
}:signUpProps) {
  const [signWithPhone,setSignWithPhone]=useState(false)
      const [signWithGoogle,setSignWithGoogle]=useState(false)
      const [signWithEmail,setSignWithEmail]=useState(false)
      const [verifyEmail,setVerifyEmail]=useState(false)
      const [newPassword,setNewPassword]=useState(false)
      const [showPassword,setShowPassword]=useState(false)
      const [stepsWithPhone,setStepsWithPhone]=useState<number>(1)

      
      const dispatch=useAppDispatch()
      const signUpData=useAppSelector(selectSignUpData)


      const {
        register,
        handleSubmit,
        formState:{errors}
      }=useForm()

      const {
        register:registerStepOneWithPhone,
        handleSubmit:handleSubmitStepOneWithPhone,
        formState:{errors:errorsStepOneWithPhone}
      }=useForm<StepOneData>({ resolver: zodResolver(stepOneSchema) })

      const {
        register:registerStepTwoWithPhone,
        handleSubmit:handleSubmitStepTwoWithPhone,
        formState:{errors:errorsStepTwoWithPhone}
      }=useForm<StepTwoData>({ resolver: zodResolver(stepTwoSchema) })

      const {
        register:registerStepThree,
        handleSubmit:handleSubmitStepThreeWithPhone,
        reset:registerStepThreeReset,
        formState:{errors:errorsStepThree}
      }=useForm<StepThreeData>({ resolver: zodResolver(stepThreeSchema) })

      const [
        registerOtp,
        {
            data:registerOtpData,
            error:registerOtpError,
            isLoading:registerOtpIsLoading,
            isSuccess:registerOtpIsSuccess,
            isError:registerOtpIsError
        }
    ]=useRegisterOtpMutation()

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
      finalizeRegistration,
      {
        data:finalizeRegistrationData,
        error:finalizeRegistrationError,
        isLoading:finalizeRegistrationIsLoading,
        isSuccess:finalizeRegistrationIsSuccess,
        isError:finalizeRegistrationIsError
      }
    ]=useFinalizeRegistrationMutation()

    useEffect(()=>{
      if(registerOtpIsSuccess && registerOtpData){
        console.log("register otp data:",registerOtpData)
        toast.success(registerOtpData.message.slice(0,registerOtpData.message.indexOf("|")))
        dispatch(setSignUpData({...signUpData,otp:registerOtpData.message.split(" ")[1]}))
        setStepsWithPhone(2)

      }
      if(registerOtpIsError){
          console.log("register otp error",registerOtpError)
      }

  },[registerOtpIsSuccess,registerOtpIsError])

  useEffect(()=>{
    if(VerifyOtpData && verifyOtpIsSuccess){
      setStepsWithPhone(3)
      toast.success("phone number verified")
    }
    if(verifyOtpIsError){
      toast.error("Verify otp error")
      console.log("verify otp error",verifyOtpError)
    }
  },[verifyOtpIsError,verifyOtpIsSuccess])


  useEffect(()=>{
    if(finalizeRegistrationData && finalizeRegistrationIsSuccess){
      console.log("finalize registration data:",finalizeRegistrationData)
      toast.success("user registered successfully, login")
      dispatch(setSignUpData(initialState.signUpData))
      onClose()
      setSignIn(true)
    }
    if(finalizeRegistrationIsError){
      toast.error("unable to finalize registration")
      console.log("error while finalizing registration",finalizeRegistrationError)
    }
  },[finalizeRegistrationIsError,finalizeRegistrationIsSuccess])

  const phoneSubmit=(data:StepOneData)=>{
    if(data.phone){
      dispatch(setSignUpData({...signUpData,phone:data.phone}))
      registerOtp({phone:data.phone})
      
      return
    }
    console.log("unable to register otp...")
  }

  const phoneVerification=(data:StepTwoData)=>{
    if(data.code){
      verifyOtp({
        phone:signUpData.phone,
        otp:data.code
      })
    }
  }

  const finalizeRegistrationOnSubmit=(data:StepThreeData)=>{
    if(data.password !== data.cpassword){
      toast.error("Password and confirm Password must match")
      registerStepThreeReset({cpassword:""})
      return
    }
    finalizeRegistration({
      name:data.names,
      gender:data.gender,
      location:data.location,
      email:data.email,
      phone:signUpData.phone,
      password:data.password
    })
  }

  // console.log("sign up data",selectedGender)
  return (
    <div className="px-5 pb-8 pt-5 bg-white shadow-md rounded-2xl">
      <MdCancel size={28} onClick={onClose} className="absolute top-6 right-5 cursor-pointer" />
        {
            (!signWithGoogle && !signWithPhone && !signWithEmail)&&(
                <div className="">
                    <div className="mt-10 flex flex-col space-y-2 mx-5">
                        <span className="font-bold text-[20px]">Set up your account</span>
                        {
                            (!signWithGoogle && !signWithPhone && !signWithEmail)&&
                            <span className="text-lightGray">Create your account for a better experience</span>
                        }
                    </div>
                    <div className="my-5 flex flex-col space-y-5">
                        <div onClick={()=>setSignWithPhone(true)} className="py-3 cursor-pointer hover:bg-lightBlue hover:text-white flex items-center justify-center space-x-5 rounded-xl border-[2px] border-gray-200">
                            <IoCall className="" />
                            <span className="font-semibold">Sign up with a phone number</span>
                        </div>
                        <div className="py-3 cursor-pointer hover:bg-lightBlue hover:text-white flex items-center justify-center space-x-5 rounded-xl border-[2px] border-gray-200">
                            <FcGoogle className="" />
                            <span className="font-semibold">Sign up with Google</span>
                        </div>
                        <div onClick={()=>setSignWithEmail(true)} className="py-3 cursor-pointer hover:bg-lightBlue hover:text-white flex items-center justify-center space-x-5 rounded-xl border-[2px] border-gray-200">
                            <IoMdMail className="" />
                            <span className="font-semibold">Sign up with email</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                        <span>Have an account? </span>
                        <span onClick={()=>{
                          onClose()
                          setSignIn(true)
                        }} className="text-lightBlue font-semibold cursor-pointer hover:underline">Sign in</span>
                    </div>
                </div>
            )
        }
        {
          signWithEmail && (
            <div className="">
              <div className="mt-5">
                <span className="text-[24px] font-bold text-darkBlue ">Your email address</span>
              </div>
              <div className="flex items-center justify-between mt-5">
                <Button
                  onClick={()=>setSignWithEmail(false)}
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
                  <div className={verifyEmail ? "w-8 h-8 rounded-full bg-lightBlue flex items-center justify-center":"w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center"}>
                    <span className="text-white font-semibold">2</span>
                  </div>
                  <div className="border-t-2 border-dashed mx-1 border-gray-500 w-5"></div>
                  <div className={newPassword ? "w-8 h-8 rounded-full bg-lightBlue flex items-center justify-center":"w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center"}>
                    <span className="text-white font-semibold">3</span>
                  </div>
                </div>
              </div>

              {
                !verifyEmail || !newPassword && (
                  <div
                    className=""
                  >
                    <div className="my-5">
                      <span className="text-lightGray">Provide your email to sign up</span>
                    </div>
                    <form className="">
                      <div className="flex flex-col space-y-1 my-5">
                          <label className="font-semibold">Email</label>
                          <div className="relative">
                              <IoMdMail className="absolute top-4 left-3" size={18} />
                              <Input 
                                  type="email"
                                  {...register("email")}
                                  className="h-12 rounded-xl indent-8 text-black lg:text-md"
                                  placeholder="Email"
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
                        <span>Have an account? </span>
                        <span onClick={()=>{
                          onClose()
                          setSignIn(true)
                        }} className="text-lightBlue font-semibold cursor-pointer hover:underline">Sign in</span>
                    </div>
                  </div>
                )
              }
              {
                verifyEmail && (
                  <div
                    className=""
                  >
                    <div className="flex space-x-2 items-center my-5">
                      <span className="text-lightGray">Enter verification code sent to</span>
                      <span className="text-lightBlue font-semibold">mail@mail.com</span>
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
                        <span className="text-lightBlue font-semibold cursor-pointer hover:underline">Resend code</span>
                    </div>
                  </div>
                )
              }
              {
                newPassword && (
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
          )
        }
        {
          signWithPhone && (
            <div className="">
              <div className="mt-5">
                <span className="text-[24px] font-bold text-darkBlue ">Your phone number</span>
              </div>
              <div className="flex items-center justify-between mt-5">
                <Button
                  onClick={()=>setSignWithPhone(false)}
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
                  <div className={stepsWithPhone >= 2 ? "w-8 h-8 rounded-full bg-lightBlue flex items-center justify-center":"w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center"}>
                    <span className="text-white font-semibold">2</span>
                  </div>
                  <div className="border-t-2 border-dashed mx-1 border-gray-500 w-5"></div>
                  <div className={stepsWithPhone === 3 ? "w-8 h-8 rounded-full bg-lightBlue flex items-center justify-center":"w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center"}>
                    <span className="text-white font-semibold">3</span>
                  </div>
                </div>
              </div>

              {
                stepsWithPhone === 1 && (
                  <div
                    className=""
                  >
                    <div className="my-5">
                      <span className="text-lightGray">Provide your phone number to sign up</span>
                    </div>
                    <form className="" onSubmit={handleSubmitStepOneWithPhone(phoneSubmit)}>
                      <div className="flex flex-col space-y-1 my-5">
                          <label className="font-semibold">Phone Number</label>
                          <div className="relative">
                              <MdOutlinePhone className="absolute top-4 left-3" size={18} />
                              <Input 
                                {...registerStepOneWithPhone("phone")}
                                className="h-12 rounded-xl indent-8 text-black lg:text-md"
                                placeholder="Phone Number"
                              />
                              {errorsStepOneWithPhone.phone && <p className="text-red-600 text-xs mt-2">{errorsStepOneWithPhone.phone?.message}</p>}
                          </div>
                      </div>
                      <Button
                        disabled={registerOtpIsLoading}
                        type="submit"
                        className="text-white w-full h-12 rounded-[100px] bg-darkBlue"
                      >
                        { registerOtpIsLoading ? <LoadingComponent />:"Continue"}
                        
                      </Button>
                    </form>
                    <div className="flex space-x-2 items-center justify-center my-5">
                      <span className="text-lightGray text-xs md:text-sm">By creating an account, you agree to our</span>
                      <span className="text-lightBlue text-xs md:text-sm text-nowrap font-semibold">Privacy Policy</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                        <span>Have an account? </span>
                        <span onClick={onClose} className="text-lightBlue font-semibold cursor-pointer hover:underline">Sign in</span>
                    </div>
                  </div>
                )
              }
              {
                stepsWithPhone === 2 && (
                  <div
                    className=""
                  >
                    <div className="flex space-x-2 items-center my-5">
                      <span className="text-lightGray">Enter verification code sent to</span>
                      <span className="text-lightBlue font-semibold">{signUpData.phone || "N/A"}</span>
                    </div>
                    <form onSubmit={handleSubmitStepTwoWithPhone(phoneVerification)} className="">
                      <div className="flex flex-col space-y-1 my-5">
                          <label className="font-semibold">Verification code</label>
                          <div className="relative">
                              <FaHashtag className="absolute top-4 left-3" size={18} />
                              <Input 
                                  value={signUpData.otp || ""}
                                  type="text"
                                  {...registerStepTwoWithPhone("code")}
                                  className="h-12 rounded-xl indent-8 text-black lg:text-md"
                                  placeholder="Verification code"
                              />
                          </div>
                      </div>
                      <Button
                          type="submit"
                          disabled={verifyOtpIsLoading}
                          className="text-white w-full h-12 rounded-[100px] bg-darkBlue"
                      >
                        {verifyOtpIsLoading ? <LoadingComponent /> : "Continue"}
                        
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
                stepsWithPhone === 3  && (
                  <div
                    className=""
                  >
                    <div className="my-5">
                      <span className="text-lightGray">Finalize Registration</span>
                    </div>
                    <form onSubmit={handleSubmitStepThreeWithPhone(finalizeRegistrationOnSubmit)} className="">
                      <div className="relative my-5">
                          <BsPerson className="absolute top-4 left-3" size={18} />
                          <Input 
                              type="text"
                              {...registerStepThree("names")}
                              className="h-12 rounded-xl indent-8 text-black lg:text-md"
                              placeholder="Names"
                          />
                      </div>
                      <div className="relative my-5">
                          <MdMail className="absolute top-4 left-3" size={18} />
                          <Input 
                              type="text"
                              {...registerStepThree("email")}
                              className="h-12 rounded-xl indent-8 text-black lg:text-md"
                              placeholder="Email"
                          />
                      </div>
                      <div className="relative my-5">
                          <PinIcon className="absolute top-4 left-3" size={18} />
                          <Input 
                              type="text"
                              {...registerStepThree("location")}
                              className="h-12 rounded-xl indent-8 text-black lg:text-md"
                              placeholder="Location"
                          />
                      </div>
                      <div className="flex flex-col space-y-1 my-5">
                        <label htmlFor="gender">Gender</label>
                        <select id="gender" className="bg-white py-2" {...registerStepThree("gender")}>
                          <option value="">Gender</option>
                          <option value="M">Male</option>
                          <option value="F">Female</option> 
                        </select>
                      </div>
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
                                  {...registerStepThree("password")}
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
                                  {...registerStepThree("cpassword")}
                                  className="h-12 rounded-xl indent-8 text-black lg:text-md"
                                  placeholder="Confirm Password"
                              />
                          </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={finalizeRegistrationIsLoading}
                        className="text-white w-full h-12 rounded-[100px] bg-darkBlue"
                      >
                        {finalizeRegistrationIsLoading ? <LoadingComponent /> :"Continue"}
                        
                      </Button>
                    </form>
                  </div>
                )
              }

            </div>
          )
        }
    </div>
  )
}

export default SignUp