import { MdCancel, MdOutlinePhone } from "react-icons/md"
import { IoCall } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { IoMdMail } from "react-icons/io";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { CiLock } from "react-icons/ci";
import { FaRegEye,FaRegEyeSlash } from "react-icons/fa";
import { Button } from "./ui/button";
import { useAppDispatch } from "@/redux/hooks";
import { setToken, setUser } from "@/redux/slices/userSlice";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useLoginMutation, useLoginPhoneMutation } from "@/redux/services/userServices";
import LoadingComponent from "./LoadingComponent";
import { apiUrl } from "@/lib/env";
import { handleRTKQueryError } from "@/redux/errorHandler";
import { showSnackbar } from "@/lib/snackbar";

interface signInProps{
    onClose?:any,
    resetPassword?:boolean
    setResetPassword?:any
    setSignUp?:any 
    signUp?:boolean
}

interface FormDataPhone{
    phone:string
    password:string 
    rememberMe:boolean
}

interface FormDataEmail{
    email:string 
    password:string
    rememberMe:boolean
}

const formSchemaWithPhone=z.object({
    phone: z.string()
    .regex(/^\+\d+$/, "Phone number must start with '+' and contain only numbers"),
    password:z.string().min(6,"password must contains at least 6 characters")
})

const formSchemaWithEmail=z.object({
    email:z.string().email("Invalid email address"),
    password:z.string().min(6,"password must be at least 6 characters long")
})
//type FormData = z.infer<typeof formSchema>

function SignIn({
    onClose,
    resetPassword,
    setResetPassword,
    setSignUp,
    signUp
}:signInProps) {
    const [signWithPhone,setSignWithPhone]=useState(false)
    const [signWithGoogle,setSignWithGoogle]=useState(false)
    const [signWithEmail,setSignWithEmail]=useState(false)
    const [showPassword,setShowPassword]=useState(false)
    const dispatch=useAppDispatch()
    const [
        Login,
        {
            data:loginData,
            error:loginError,
            isSuccess:loginIsSuccess,
            isLoading:loginIsLoading,
            isError:loginIsError
        }
    ]=useLoginMutation()

    const [
        LoginWithPhone,
        {
            data:loginWithPhoneData,
            error:loginWithPhoneError,
            isSuccess:loginWithPhoneIsSuccess,
            isError:loginWithPhoneIsError,
            isLoading:loginWithPhoneIsLoading
        }
    ]=useLoginPhoneMutation()

    const {
        register:loginWithPhone,
        handleSubmit:handleSubmitWithPhone,
        reset:resetWithPhone,
        formState:{errors:errorsWithPhone}
    }=useForm<FormDataPhone>({
        resolver: zodResolver(formSchemaWithPhone), // Use Zod for validation
      });


    
    const {
    register:loginWithEmail,
    handleSubmit:handleSubmitwithEmail,
    reset:resetWithEmail,
    formState:{errors:errorsWithEmail}
}=useForm<FormDataEmail>({
    resolver: zodResolver(formSchemaWithEmail), // Use Zod for validation
    });
    
    const onsubmit=(data:FormDataPhone)=>{
        //console.log("on submit hitted")
        LoginWithPhone({
            phone:data.phone,
            password:data.password
        })
    }

    useEffect(()=>{
        if(loginIsSuccess && loginData){
            //console.log("login data:",loginData)
            toast.success(loginData?.message)
            dispatch(setToken(loginData?.token))
            dispatch(setUser({
                _id:loginData?.userDetails?._id,
                email:loginData?.userDetails?.email,
                phone_number:loginData?.userDetails?.phone,
                name:loginData?.userDetails?.name,
                bio:loginData?.userDetails?.bio,
                location:loginData?.userDetails?.location
            }))
            onClose()
            resetWithEmail()
            //console.log("login success",loginData)
        }
        if(loginIsError){
            console.log("cannot login", loginError)
            // Check for the specific error message
            if (
                typeof loginError === 'object' &&
                loginError !== null &&
                'status' in loginError &&
                loginError.status === 401 &&
                'data' in loginError &&
                loginError.data &&
                typeof loginError.data === 'object' &&
                'message' in loginError.data &&
                loginError.data.message === "Invalid credentials - no password set"
            ) {
                setResetPassword(true);
                return;
            }
            // Use our RTK Query error handler for other errors
            handleRTKQueryError(loginError);
        }
    },[loginIsError,loginIsSuccess,loginError])

    useEffect(()=>{
        if(loginWithPhoneData && loginWithPhoneIsSuccess){
            // console.log("login with phone Data:",loginWithPhoneData)
            toast.success(loginWithPhoneData?.message)
            dispatch(setToken(loginWithPhoneData?.token))
            dispatch(setUser({
                _id:loginWithPhoneData.userDetails._id,
                email:loginWithPhoneData?.userDetails?.email,
                phone_number:loginWithPhoneData?.userDetails?.phone,
                name:loginWithPhoneData?.userDetails?.name,
                bio:loginWithPhoneData?.userDetails?.bio,
                location:loginWithPhoneData?.userDetails?.location
            }))
            onClose()
            resetWithPhone()
        }
        if(loginWithPhoneIsError){
            console.log("error while login with phone number", loginWithPhoneError)
            // Check for the specific error message
            if (
                typeof loginWithPhoneError === 'object' &&
                loginWithPhoneError !== null &&
                'status' in loginWithPhoneError &&
                loginWithPhoneError.status === 401 &&
                'data' in loginWithPhoneError &&
                loginWithPhoneError.data &&
                typeof loginWithPhoneError.data === 'object' &&
                'message' in loginWithPhoneError.data &&
                loginWithPhoneError.data.message === "Invalid credentials - no password set"
            ) {
                setResetPassword(true);
                return;
            }
            // Use our RTK Query error handler for other errors
            handleRTKQueryError(loginWithPhoneError);
        }

    },[loginWithPhoneIsSuccess,loginWithPhoneIsError,loginWithPhoneError])

    const onSumbmitWithEmail=(data:FormDataEmail)=>{
        console.log("login with email data:",data)
        Login({
            email:data.email,
            password:data.password
        })
    }

    const handleGoogleAuth=()=>{
        window.location.href = "http://localhost:7007/api/auth/google";
    }   
  return (
    <div className="px-5 pb-8 pt-10 bg-white shadow-md rounded-2xl">
        {/* Remove the absolute positioned close button since SheetContent provides a close button */}
        {/* <MdCancel size={28} onClick={onClose} className="absolute top-6 right-5 cursor-pointer" /> */}
        
        {
            signWithPhone ? 
            <IoMdArrowRoundBack size={28} onClick={()=>setSignWithPhone(false)} className="mb-4 cursor-pointer" />:
            signWithEmail ? <IoMdArrowRoundBack size={28} onClick={()=>setSignWithEmail(false)} className="mb-4 cursor-pointer" /> : null
        }
        {
            (!signWithGoogle && !signWithPhone && !signWithEmail)&&(
                <div className="">
                    <div className="flex flex-col space-y-2 mx-5">
                        <span className="font-bold text-[20px]">Sign into your account</span>
                        {
                            (!signWithGoogle && !signWithPhone && !signWithEmail)&&
                            <span className="text-lightGray">Sign in for a better experience</span>
                        }
                    </div>
                    <div className="my-5 flex flex-col md:justify-center space-y-5">
                        <div onClick={()=>setSignWithPhone(true)} className="py-3 cursor-pointer hover:bg-lightBlue hover:text-white flex items-center justify-center space-x-5 rounded-xl border-[2px] border-gray-200">
                            <IoCall className="" />
                            <span className="font-semibold">Sign in with a phone number</span>
                        </div>
                        <button disabled onClick={handleGoogleAuth} className="py-3 cursor-pointer hover:bg-lightBlue hover:text-white flex items-center justify-center space-x-5 rounded-xl border-[2px] border-gray-200">
                            <FcGoogle className="" />
                            <span className="font-semibold">Sign in with Google</span>
                        </button>
                        <div onClick={()=>setSignWithEmail(true)} className="py-3 cursor-pointer hover:bg-lightBlue hover:text-white flex items-center justify-center space-x-5 rounded-xl border-[2px] border-gray-200">
                            <IoMdMail className="" />
                            <span className="font-semibold">Sign in with email</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                        <span>Don't have an account?</span>
                        <span onClick={()=>{
                            onClose()
                            setSignUp(true)
                        }} className="text-lightBlue font-semibold cursor-pointer hover:underline">Sign up</span>
                    </div>
                </div>
            )
        }
        {
            signWithPhone && (
                <div className="mb-5 mt-14">
                    <span className="font-bold text-[20px]">Sign in</span>
                    <form onSubmit={handleSubmitWithPhone(onsubmit)}>
                        <div className="flex flex-col space-y-1 my-5">
                            <label className="font-semibold">Phone Number</label>
                            <div className="relative">
                                <MdOutlinePhone className="absolute top-4 left-3" size={18} />
                                <Input 
                                {...loginWithPhone("phone",{
                                    required:"Phone Number is required",
                                    pattern:{
                                        value: /^\+\d{1,3}[- ]?\d{3}[- ]?\d{4}$/,
                                        message: "Invalid phone number format. Example: +1 555 123 4567"
                                    }
                                })}
                                className="h-12 rounded-xl indent-8 text-black lg:text-md"
                                placeholder="Phone Number"
                                />
                            </div>
                            {errorsWithPhone.phone && <p className="text-red-500 text-sm">{errorsWithPhone.phone?.message}</p>}
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
                                    {...loginWithPhone("password",{
                                        required:"Password is required",
                                        minLength:{
                                            value:6,
                                            message:"Password must be at least 6 charaters"
                                        }
                                    })}
                                    className="h-12 rounded-xl indent-8 text-black lg:text-md"
                                    placeholder="Password"
                                />
                            </div>
                            {errorsWithPhone.password && <p className="text-red-500 text-sm">{errorsWithPhone.password.message}</p>}
                        </div>
                        {/* Error message for phone login */}
                        { typeof loginWithPhoneError === 'object' && loginWithPhoneError !== null && 'data' in loginWithPhoneError && loginWithPhoneError.data && typeof loginWithPhoneError.data === 'object' && 'message' in loginWithPhoneError.data && typeof loginWithPhoneError.data.message === 'string' && (
                            <p className="text-red-500 text-sm">{loginWithPhoneError.data.message as string}</p>
                        )}
                        <Button
                            disabled={loginWithPhoneIsLoading}
                            type="submit"
                            className="bg-darkBlue h-14 text-white hover:bg-lightBlue rounded-[100px] w-full mt-10"
                        >
                            {loginWithPhoneIsLoading ? <LoadingComponent /> :"Continue"}
                        </Button>
                        <div className="flex items-center justify-between my-5">
                            <div className="flex items-center space-x-2">
                                <Input 
                                    checked
                                    type="checkbox"
                                    {...loginWithPhone("rememberMe")}
                                    className="w-4 h-4 bg-lightBlue"
                                />
                                <span>Remember Me</span>
                            </div>
                            
                            
                            <span onClick={()=>{
                                onClose()
                                setResetPassword(true)
                            }} className="text-lightGray cursor-pointer">Forgot Password?</span>
                        </div>
                    </form>
                </div>
            )
        }
        {
            signWithEmail && (
                <div className="mb-5 mt-14">
                    <span className="font-bold text-[20px]">Sign in</span>
                    <form onSubmit={handleSubmitwithEmail(onSumbmitWithEmail)}>
                        <div className="flex flex-col space-y-1 my-5">
                            <label className="font-semibold">Email</label>
                            <div className="relative">
                                <IoMdMail className="absolute top-4 left-3" size={18} />
                                <Input 
                                    type="email"
                                    {...loginWithEmail("email",{
                                        required:"Email is Required",
                                        pattern:{
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message:"Invalid email"
                                        }
                                    })}
                                    className="h-12 rounded-xl indent-8 text-black lg:text-md"
                                    placeholder="Email"
                                />
                            </div>
                            {errorsWithEmail.email && <p className="text-red-500 text-sm">{errorsWithEmail.email?.message}</p>}
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
                                    {...loginWithEmail("password",{
                                        required:"Password is required",
                                        minLength:{
                                            value:6,
                                            message:"Password must be at least 6 charaters"
                                        }
                                    })}
                                    className="h-12 rounded-xl indent-8 text-black lg:text-md"
                                    placeholder="Password"
                                />
                            </div>
                            {errorsWithEmail.password && <p className="text-red-500 text-sm">{errorsWithEmail.password.message}</p>}

                        </div>
                        {/* Error message for email login */}
                        { typeof loginError === 'object' && loginError !== null && 'data' in loginError && loginError.data && typeof loginError.data === 'object' && 'message' in loginError.data && typeof loginError.data.message === 'string' && (
                            <p className="text-red-500 text-sm">{loginError.data.message as string}</p>
                        )}

                        <Button
                            disabled={loginIsLoading}
                            type="submit"
                            className="bg-darkBlue h-14 text-white hover:bg-lightBlue rounded-[100px] w-full mt-10"
                        >
                            {loginIsLoading ? <LoadingComponent /> :"Continue"}
                        </Button>
                        <div className="flex items-center justify-between my-5">
                            <div className="flex items-center space-x-2">
                                <Input 
                                    checked
                                    type="checkbox"
                                    {...loginWithEmail("rememberMe")}
                                    className="w-4 h-4 bg-lightBlue"
                                />
                                <span>Remember Me</span>
                            </div>
                            
                            <span onClick={()=>{
                                onClose()
                                setResetPassword(true)
                            }}  className="text-lightGray cursor-pointer">Forgot Password?</span>
                        </div>
                    </form>
                </div>
            )
        }
        
    </div>
  )
}

export default SignIn