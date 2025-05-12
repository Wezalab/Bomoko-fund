import { CiLock } from "react-icons/ci"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { MdCancel } from "react-icons/md"
import { Input } from "./ui/input"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "./ui/button"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useChangePasswordMutation } from "@/redux/services/userServices"
import toast from "react-hot-toast"
import LoadingComponent from "./LoadingComponent"
import { useAppSelector } from "@/redux/hooks"
import { selectUser } from "@/redux/slices/userSlice"



interface formData{
    Opassword:string 
    password:string 
    Cpassword:string
}


const formSchema = z.object({
    Opassword: z.string().min(6, "Old password must contain at least 6 characters"),
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
});

function ChangePassword({onClose}:{onClose:any}) {
    const [showPassword,setShowPassword]=useState(false)
    const user=useAppSelector(selectUser)
    const {register,handleSubmit,formState:{errors}}=useForm<formData>({
        resolver:zodResolver(formSchema)
    })

    const [
        ChangePassword,
        {
            data:changePasswordData,
            error:changePasswordError,
            isSuccess:changePasswordIsSuccess,
            isError:changePasswordIsError,
            isLoading:changePasswordIsLoading
        }
    ]=useChangePasswordMutation()


    useEffect(()=>{
        if(changePasswordData && changePasswordIsSuccess){
            //console.log("changed password successfully",changePasswordData)
            toast.success("Password changed")
            onClose()
        }
        if(changePasswordIsError){
            console.log("Error while changing password",changePasswordError)
            toast.error("unable to change password")
        }
    },[changePasswordIsError,changePasswordIsSuccess])

    const onsubmit=(data:formData)=>{
        ChangePassword({
            userId:user._id,
            data:{
                oldPassword:data.Opassword,
                newPassword:data.password
            }
        })
    }

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl">
      <div className="flex items-center justify-center my-4">
        <span className="text-xl font-bold">Change Password</span>
      </div>
      <div
            className=""
            >
            <div className="my-5">
                <span className="text-lightGray">Change the password for your account</span>
            </div>
            <form onSubmit={handleSubmit(onsubmit)} className="">
                <div className="flex flex-col space-y-1 my-5">
                    <label className="font-semibold">Old Password</label>
                    <div className="relative">
                        <CiLock className="absolute top-4 left-3" size={18} />
                        {
                            !showPassword ? 
                            <FaRegEye onClick={()=>setShowPassword(!showPassword)} className="absolute top-4 right-3 cursor-pointer" size={18} /> :
                            <FaRegEyeSlash onClick={()=>setShowPassword(!showPassword)} className="absolute top-4 right-3 cursor-pointer" size={18} />
                        }
                        <Input 
                            type={showPassword? "text":"password"}
                            {...register("Opassword")}
                            className="h-12 rounded-xl indent-8 text-black lg:text-md"
                            placeholder="Old  Password"
                        />
                        {errors.Opassword && <p className="text-red-500 text-sm">{errors.Opassword?.message}</p>}
                    </div>
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
                            {...register("password")}
                            className="h-12 rounded-xl indent-8 text-black lg:text-md"
                            placeholder="Your Password"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password?.message}</p>}
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
                            {...register("Cpassword")}
                            className="h-12 rounded-xl indent-8 text-black lg:text-md"
                            placeholder="Confirm Password"
                        />
                        {errors.Cpassword && <p className="text-red-500 text-sm">{errors.Cpassword.message}</p>}
                    </div>
                </div>
                <Button
                    disabled={changePasswordIsLoading}
                    type="submit"
                    className="text-white w-full h-12 rounded-[100px] bg-darkBlue"
                >
                {changePasswordIsLoading ? <LoadingComponent />:"Continue"}
                </Button>
            </form>
        </div>
    </div>
  )
}

export default ChangePassword