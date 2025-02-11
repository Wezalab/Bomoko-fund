import { MdCancel, MdOutlinePhone } from "react-icons/md"
import { IoCall } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { IoMdMail } from "react-icons/io";
import { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { CiLock } from "react-icons/ci";
import { FaRegEye,FaRegEyeSlash } from "react-icons/fa";
import { Button } from "./ui/button";
import { users } from "@/constants/dummydata";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/slices/userSlice";
import toast from "react-hot-toast";


interface signInProps{
    onClose:any,
    resetPassword:boolean
    setResetPassword:any
    setSignUp:any 
    signUp:boolean
}

interface FormData{
    email?:string
    phone?:string
    password:string 
    rememberMe?:boolean
}

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


    const {
        register,
        handleSubmit,
        reset,
        formState:{errors}
    }=useForm<FormData>()
    
    const onsubmit=(data:FormData)=>{
        if(data.phone || data.email){
            let loggedUser=users.find(d=>d.phone_number===data.phone || d.email ===data.email)
            if(loggedUser && loggedUser.password ===data.password){
                // console.log("logged user",loggedUser)
                dispatch(setUser(loggedUser))
                onClose()
                toast.success("user Logged In successfully!")
                reset()
            }
            console.log("Wrong credentials")
            reset({password:''})
            return
        }
        console.log("user not found")
        reset()
    }
  return (
    <div className="px-5 pb-8 pt-5 bg-white shadow-md rounded-2xl">
        <MdCancel size={28} onClick={onClose} className="absolute top-6 right-5 cursor-pointer" />
        {
            signWithPhone ? 
            <IoMdArrowRoundBack size={28} onClick={()=>setSignWithPhone(false)} className="absolute top-6 left-5 cursor-pointer" />:
            signWithEmail?<IoMdArrowRoundBack size={28} onClick={()=>setSignWithEmail(false)} className="absolute top-6 left-5 cursor-pointer" />:""
        }
        {
            (!signWithGoogle && !signWithPhone && !signWithEmail)&&(
                <div className="">
                    <div className="mt-10 flex flex-col space-y-2 mx-5">
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
                        <div className="py-3 cursor-pointer hover:bg-lightBlue hover:text-white flex items-center justify-center space-x-5 rounded-xl border-[2px] border-gray-200">
                            <FcGoogle className="" />
                            <span className="font-semibold">Sign in with Google</span>
                        </div>
                        <div onClick={()=>setSignWithEmail(true)} className="py-3 cursor-pointer hover:bg-lightBlue hover:text-white flex items-center justify-center space-x-5 rounded-xl border-[2px] border-gray-200">
                            <IoMdMail className="" />
                            <span className="font-semibold">Sign in with email</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                        <span>Don’t have an account?</span>
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
                    <form onSubmit={handleSubmit(onsubmit)}>
                        <div className="flex flex-col space-y-1 my-5">
                            <label className="font-semibold">Phone Number</label>
                            <div className="relative">
                                <MdOutlinePhone className="absolute top-4 left-3" size={18} />
                                <Input 
                                {...register("phone",{
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
                            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
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
                                    {...register("password",{
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
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        

                        <Button
                            type="submit"
                            className="bg-darkBlue h-14 text-white hover:bg-lightBlue rounded-[100px] w-full mt-10"
                        >
                            Continue
                        </Button>
                        <div className="flex items-center justify-between my-5">
                            <div className="flex items-center space-x-2">
                                <Input 
                                    type="checkbox"
                                    {...register("rememberMe")}
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
                    <form onSubmit={handleSubmit(onsubmit)}>
                        <div className="flex flex-col space-y-1 my-5">
                            <label className="font-semibold">Email</label>
                            <div className="relative">
                                <IoMdMail className="absolute top-4 left-3" size={18} />
                                <Input 
                                    type="email"
                                    {...register("email",{
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
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
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
                                    {...register("password",{
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
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

                        </div>
                        

                        <Button
                            type="submit"
                            className="bg-darkBlue h-14 text-white hover:bg-lightBlue rounded-[100px] w-full mt-10"
                        >
                            Continue
                        </Button>
                        <div className="flex items-center justify-between my-5">
                            <div className="flex items-center space-x-2">
                                <Input 
                                    type="checkbox"
                                    {...register("rememberMe")}
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