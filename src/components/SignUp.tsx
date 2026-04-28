import { useEffect, useState } from "react"

import { IoMdArrowRoundBack, IoMdMail } from "react-icons/io"
import { IoCall } from "react-icons/io5"
import { MdOutlinePhone } from "react-icons/md"
import { Button } from "./ui/button"
import { useForm } from "react-hook-form"
import { Input } from "./ui/input"
import { FaHashtag, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { CiLock } from "react-icons/ci"
import { useFinalizeRegistrationMutation, useRegisterOtpMutation, useSignupMutation, useVerifyOtpMutation } from "@/redux/services/userServices"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import toast from "react-hot-toast"
import { initialState, selectSignUpData, setSignUpData, setToken, setUser } from "@/redux/slices/userSlice"
import LoadingComponent from "./LoadingComponent"
import { apiUrl } from "@/lib/env"
import { getLoginJwt, getLoginUserRecord, mapLoginResponseToUserFields } from "@/lib/authResponse"
import { handleRTKQueryError } from "@/redux/errorHandler";
import { GoogleLogin } from '@react-oauth/google';

interface signUpProps{
  onClose:any 
  setSignIn:any 
  signIn:boolean
}

const stepOneSchemaPhone=z.object({
  phone: z
    .string()
    .regex(/^\+\d+$/, "Phone number must start with '+' and contain only numbers")
    .transform((val) => val.replace(/\s+/g, ""))
    
})
const stepOneSchemaEmail=z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().email("Invalid email format"),
})

const stepTwoSchema=z.object({
  code:z.string().min(4,"verification code must contain at least 4 numbers")
})

const stepThreeSchema=z.object({
  phone: z
    .string()
    .regex(/^\+\d+$/, "Phone number must start with '+' and contain only numbers")
    .transform((val) => val.replace(/\s+/g, "")).optional(),
  email: z.string().email("Invalid email format").optional(),
  password:z.string().min(6,"password must be at least 6 characters length"),
  cpassword:z.string().min(6,"password must be at least 6 characters length")
})

type StepOneDataEmail=z.infer<typeof stepOneSchemaEmail>
type StepOneData = z.infer<typeof stepOneSchemaPhone>;
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
      const [stepsWithEmail,setStepsWithEmail]=useState<number>(1)
      
          const dispatch=useAppDispatch()
    const signUpData=useAppSelector(selectSignUpData)
    
    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            console.log("Google credential response:", credentialResponse);
            
            // Exchange Google ID token for backend user data
            const backendResponse = await fetch(`${apiUrl}/auth/exchange-google-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    googleToken: credentialResponse.credential,
                    idToken: credentialResponse.credential,
                    credential: credentialResponse.credential,
                    token: credentialResponse.credential,
                })
            });

            if (!backendResponse.ok) {
                throw new Error(`Backend responded with ${backendResponse.status}`);
            }

            const authData = await backendResponse.json();
            console.log('✅ Google authentication successful:', authData);

            const jwt = getLoginJwt(authData);
            const userFields = mapLoginResponseToUserFields(authData);
            const userRecord = getLoginUserRecord(authData);
            const isSuccess = authData.success || jwt || userFields._id;

            if (isSuccess) {
                // Set user data in Redux with backend user ID
                dispatch(setUser({
                    ...userFields,
                    isGoogleUser: true,
                    profile: userRecord?.avatar || userRecord?.picture || userRecord?.profile || '',
                    projects: Array.isArray(userRecord?.projects) ? userRecord.projects : [],
                    cryptoWallet: Array.isArray(userRecord?.cryptoWallet) ? userRecord.cryptoWallet : []
                }));

                // Set JWT token
                if (jwt) dispatch(setToken(jwt));
                
                toast.success(authData.message || "Signed up successfully!");
                console.log("Google sign-up success with backend userId:", userFields._id);
                onClose();
            } else {
                throw new Error(authData.message || 'Authentication failed');
            }
        } catch (error) {
            console.error("Error during Google signup:", error);
            toast.error("Google sign-up failed. Please try again.");
        }
    };

    const handleGoogleError = () => {
        console.error("Google OAuth error");
        toast.error("Google sign-up failed. Please try again.");
    };


      const {
        register:registerStepOneWithEmail,
        handleSubmit:handleSubmitStepOneWithEmail,
        formState:{errors:errorsStepOneWithEmail}
      }=useForm<StepOneDataEmail>({ resolver:zodResolver(stepOneSchemaEmail)})

      const {
        register:registerStepOneWithPhone,
        handleSubmit:handleSubmitStepOneWithPhone,
        formState:{errors:errorsStepOneWithPhone}
      }=useForm<StepOneData>({ resolver: zodResolver(stepOneSchemaPhone) })

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
      signup,
      {
        data: signupData,
        error: signupError,
        isError: signupIsError,
        isLoading: signupIsLoading,
        isSuccess: signupIsSuccess,
      },
    ] = useSignupMutation()

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
        //console.log("register otp data:",registerOtpData)
        toast.success(registerOtpData.message.slice(0,registerOtpData.message.indexOf("|")))
        dispatch(setSignUpData({...signUpData,otp:registerOtpData.message.split(" ")[1]}))
        setStepsWithPhone(2)
      }
      if(registerOtpIsError){
        console.log("register otp error",registerOtpError)
        handleRTKQueryError(registerOtpError);
      }
    },[registerOtpIsSuccess,registerOtpIsError])


    useEffect(()=>{
      if(signupIsSuccess && signupData){
        toast.success(
          typeof signupData.message === 'string'
            ? signupData.message
            : 'Account created — you can sign in.'
        )
        dispatch(setSignUpData(initialState.signUpData))
        onClose()
        setSignIn(true)
      }
      if(signupIsError){
        handleRTKQueryError(signupError)
      }
    },[signupIsSuccess, signupIsError, dispatch, onClose, setSignIn])

    useEffect(()=>{
      if(VerifyOtpData && verifyOtpIsSuccess){
        if(signWithPhone){
          dispatch(setSignUpData({...signUpData,isVerified:true}))
          setStepsWithPhone(3)
          toast.success("phone number verified")
        }
      }
      if(verifyOtpIsError){
        console.log("verify otp error",verifyOtpError)
        handleRTKQueryError(verifyOtpError);
      }
    },[verifyOtpIsError,verifyOtpIsSuccess])


    useEffect(()=>{
      if(finalizeRegistrationData && finalizeRegistrationIsSuccess){
        if(signWithPhone){
          toast.success("user registered successfully login")
          dispatch(setSignUpData(initialState.signUpData))
          onClose()
          setSignIn(true)
        }
      }
      if(finalizeRegistrationIsError){
        console.log("error while finalizing registration",finalizeRegistrationError)
        handleRTKQueryError(finalizeRegistrationError);
      }
    },[finalizeRegistrationIsError,finalizeRegistrationIsSuccess])


    const onsubmitEmail=(data:StepOneDataEmail)=>{
      dispatch(setSignUpData({...signUpData, name: data.name, email: data.email}))
      setStepsWithEmail(2)
    }

    const phoneSubmit=(data:StepOneData)=>{
      if(data.phone){
        dispatch(setSignUpData({...signUpData,phone:data.phone}))
        registerOtp({phone:data.phone})
        return
      }
      console.log("unable to register otp...")
    }

    const phoneVerification=(data:StepTwoData)=>{
      if(data.code && signWithPhone){
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
      if (signWithPhone) {
        finalizeRegistration({
          phone: signUpData.phone,
          password: data.password,
        })
      }
      if (signWithEmail) {
        signup({
          name: signUpData.name,
          email: signUpData.email,
          password: data.password,
          role: 'USER',
        })
      }
    }



    useEffect(()=>{
      if(signUpData.phone  && !signUpData.isVerified){
        setStepsWithPhone(1)
      }
      
    },[])

    // console.log("sign up data",selectedGender)
    return (
      <div className="p-6 bg-white shadow-md rounded-2xl">
        {
          (signWithPhone || signWithEmail) && (
            <IoMdArrowRoundBack 
              onClick={()=> {
                setSignWithPhone(false)
                setSignWithEmail(false)
              }} 
              size={28} 
              className="mb-4 cursor-pointer" 
            />
          )
        }
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
                          <div className="w-full">
                              <GoogleLogin
                                  onSuccess={handleGoogleSuccess}
                                  onError={handleGoogleError}
                                  size="large"
                                  width="100%"
                                  text="signup_with"
                                  useOneTap={false}
                              />
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
                  <span className="text-[24px] font-bold text-darkBlue ">Sign up with email</span>
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
                    <div className={stepsWithEmail >=2 ? "w-8 h-8 rounded-full bg-lightBlue flex items-center justify-center":"w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center"}>
                      <span className="text-white font-semibold">2</span>
                    </div>
                  </div>
                </div>

                {
                  stepsWithEmail === 1 && (
                    <div
                      className=""
                    >
                      <div className="my-5">
                        <span className="text-lightGray">Provide your name and email</span>
                      </div>
                      <form onSubmit={handleSubmitStepOneWithEmail(onsubmitEmail)} className="">
                        <div className="flex flex-col space-y-1 my-5">
                            <label className="font-semibold">Full name</label>
                            <div className="relative">
                                <Input 
                                    type="text"
                                    {...registerStepOneWithEmail("name")}
                                    className="h-12 rounded-xl indent-3 text-black lg:text-md"
                                    placeholder="Jane Doe"
                                />
                                {errorsStepOneWithEmail.name && <span className="text-red-600 mt-2">{errorsStepOneWithEmail.name?.message}</span> }
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1 my-5">
                            <label className="font-semibold">Email</label>
                            <div className="relative">
                                <IoMdMail className="absolute top-4 left-3" size={18} />
                                <Input 
                                    type="email"
                                    {...registerStepOneWithEmail("email")}
                                    className="h-12 rounded-xl indent-8 text-black lg:text-md"
                                    placeholder="Email"
                                />
                                {errorsStepOneWithEmail.email && <span className="text-red-600 mt-2">{errorsStepOneWithEmail.email?.message}</span> }
                                
                            </div>
                        </div>
                        <Button
                          type="submit"
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
                  stepsWithEmail === 2 && (
                    <div
                      className=""
                    >
                      <div className="my-5 flex flex-col gap-1">
                        <span className="text-lightGray">Set a password for</span>
                        <span className="text-lightBlue font-semibold break-all">{signUpData.email || 'your account'}</span>
                      </div>
                      <form onSubmit={handleSubmitStepThreeWithPhone(finalizeRegistrationOnSubmit)} className="">
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
                                {errorsStepThree.password && <p className="text-red-600 text-xs mt-2">{errorsStepThree.password?.message}</p>}
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
                                {errorsStepThree.cpassword && <p className="text-red-600 text-xs mt-2">{errorsStepThree.cpassword?.message}</p>}
                            </div>
                        </div>
                        <Button
                          type="submit"
                          disabled={signupIsLoading}
                          className="text-white w-full h-12 rounded-[100px] bg-darkBlue"
                        >
                          {signupIsLoading ? <LoadingComponent /> :"Create account"}
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
                                {errorsStepTwoWithPhone.code && <p className="text-red-600 text-xs mt-2">{errorsStepTwoWithPhone.code?.message}</p>}
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
                                {errorsStepThree.password && <p className="text-red-600 text-xs mt-2">{errorsStepThree.password?.message}</p>}
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
                                {errorsStepThree.cpassword && <p className="text-red-600 text-xs mt-2">{errorsStepThree.cpassword?.message}</p>}
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