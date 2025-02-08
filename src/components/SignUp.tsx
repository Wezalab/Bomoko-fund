import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { IoMdArrowRoundBack, IoMdMail } from "react-icons/io"
import { IoCall } from "react-icons/io5"
import { MdCancel, MdOutlinePhone } from "react-icons/md"
import { Button } from "./ui/button"
import { useForm } from "react-hook-form"
import { Input } from "./ui/input"
import { FaHashtag, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { CiLock } from "react-icons/ci"


function SignUp({onClose}:{onClose:any}) {
  const [signWithPhone,setSignWithPhone]=useState(false)
      const [signWithGoogle,setSignWithGoogle]=useState(false)
      const [signWithEmail,setSignWithEmail]=useState(false)
      const [verifyEmail,setVerifyEmail]=useState(false)
      const [newPassword,setNewPassword]=useState(false)
      const [verifyPhone,setVerifyPhone]=useState(false)
      const [phonePassword,setPhonePassword]=useState(false)
      const [showPassword,setShowPassword]=useState(false)
      const {
        register,
        handleSubmit,
        formState:{errors}
      }=useForm()


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
                        <span onClick={onClose} className="text-lightBlue font-semibold cursor-pointer hover:underline">Sign in</span>
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
                !verifyEmail && !newPassword && (
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
                        <span onClick={onClose} className="text-lightBlue font-semibold cursor-pointer hover:underline">Sign in</span>
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
                        <span onClick={onClose} className="text-lightBlue font-semibold cursor-pointer hover:underline">Resend code</span>
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
                  <div className={verifyPhone ? "w-8 h-8 rounded-full bg-lightBlue flex items-center justify-center":"w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center"}>
                    <span className="text-white font-semibold">2</span>
                  </div>
                  <div className="border-t-2 border-dashed mx-1 border-gray-500 w-5"></div>
                  <div className={phonePassword ? "w-8 h-8 rounded-full bg-lightBlue flex items-center justify-center":"w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center"}>
                    <span className="text-white font-semibold">3</span>
                  </div>
                </div>
              </div>

              {
                !verifyPhone && !phonePassword && (
                  <div
                    className=""
                  >
                    <div className="my-5">
                      <span className="text-lightGray">Provide your phone number to sign up</span>
                    </div>
                    <form className="">
                      <div className="flex flex-col space-y-1 my-5">
                          <label className="font-semibold">Phone Number</label>
                          <div className="relative">
                              <MdOutlinePhone className="absolute top-4 left-3" size={18} />
                              <Input 
                              {...register("phone")}
                              className="h-12 rounded-xl indent-8 text-black lg:text-md"
                              placeholder="Phone Number"
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
                        <span onClick={onClose} className="text-lightBlue font-semibold cursor-pointer hover:underline">Sign in</span>
                    </div>
                  </div>
                )
              }
              {
                verifyPhone && (
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
    </div>
  )
}

export default SignUp