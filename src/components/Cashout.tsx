import { useState } from "react"
import { useForm } from "react-hook-form"
import { MdCancel, MdOutlinePhone } from "react-icons/md"
import { Input } from "./ui/input"
import { FaCircleExclamation } from "react-icons/fa6"
import { Button } from "./ui/button"
import { BsBank } from "react-icons/bs";
import { GoPerson } from "react-icons/go";
import { FaHashtag } from "react-icons/fa";


function Cashout({onClose}:{onClose:any}) {
    const [mobileMoney,setMobileMoney]=useState(true)
    const [bank,setBank]=useState(false)

    const {
        register,
        handleSubmit,
        formState:{errors}
    }=useForm()

  return (
    <div className="relative bg-white w-full p-5 rounded-2xl">
        <MdCancel size={28} onClick={onClose} className="absolute top-10 right-5 cursor-pointer" />
        <div className="mt-10 mx-5">
            <span className="font-bold text-[20px]">Cashout</span>
        </div>
        <div className="flex  space-x-4 mx-5 mt-5">
            <div onClick={()=>{
                setBank(false)
                setMobileMoney(true)
            }} className={mobileMoney ? "flex flex-col cursor-not-allowed" :"flex cursor-pointer flex-col"}>
                <span className={mobileMoney ?"text-lightBlue font-semibold":"text-black"}>Use mobile money</span>
                {mobileMoney &&<div className="w-[30px] h-1 bg-lightBlue"></div>}
            </div>
            <div onClick={()=>{
                setMobileMoney(false)
                setBank(true)
            }} className={bank ? "flex flex-col cursor-not-allowed" :"flex cursor-pointer flex-col"}>
                <span className={bank ?"text-lightBlue font-semibold":"text-black"}>Use bank</span>
                {bank && <div className="w-[30px] h-1 bg-lightBlue"></div>}
            </div>
        </div>
        {
            mobileMoney &&(
                <form className="">
                    <div className="flex flex-col space-y-1 my-5">
                        <label className="font-semibold">Cashout amount</label>
                        <div className="relative">
                            <Input 
                                type="number"
                                {...register("amount")}
                                className="h-12 rounded-xl indent-2 text-black lg:text-md"
                                placeholder="Amount"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1 my-5">
                        <label className="font-semibold">Recipient phone Number</label>
                        <div className="relative">
                        <MdOutlinePhone className="absolute top-4 left-3" size={18} />
                        <Input 
                            {...register("phone")}
                            className="h-12 rounded-xl indent-8 text-black lg:text-md"
                            placeholder="Phone Number"
                        />
                        </div>
                    </div>
                    <div className="flex items-center space-x-5 px-5 rounded-xl py-3 mt-5 border-[2px] border-lightBlue shadow-sm shadow-lightBlue">
                        <FaCircleExclamation size={24} className="text-lightBlue" />
                        <span className="text-darkBlue text-sm">The amount will be sent to the provided number</span>
                    </div>
                    <Button
                        type="submit"
                        className="bg-darkBlue h-14 text-white hover:bg-lightBlue rounded-[100px] w-full mt-10"
                    >
                        Cashout
                    </Button>
                </form>
            )
        }
        {
            bank &&(
                <form className="">
                    <div className="flex flex-col space-y-1 my-5">
                        <label className="font-semibold">Cashout amount</label>
                        <div className="relative">
                            <Input 
                                type="number"
                                {...register("amount")}
                                className="h-12 rounded-xl indent-2 text-black lg:text-md"
                                placeholder="Amount"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1 my-5">
                        <label className="font-semibold">Bank</label>
                        <div className="relative">
                        <BsBank className="absolute top-4 left-3" size={18} />
                        <Input 
                            {...register("bank")}
                            className="h-12 rounded-xl indent-8 text-black lg:text-md"
                            placeholder="Bank"
                        />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1 my-5">
                        <label className="font-semibold">Names of account owner</label>
                        <div className="relative">
                        <GoPerson className="absolute top-4 left-3" size={18} />
                        <Input 
                            {...register("bankOwner")}
                            className="h-12 rounded-xl indent-8 text-black lg:text-md"
                            placeholder="Names of account owner"
                        />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1 my-5">
                        <label className="font-semibold">Account number</label>
                        <div className="relative">
                        <FaHashtag className="absolute top-4 left-3" size={18} />
                        <Input 
                            {...register("accountNumber")}
                            className="h-12 rounded-xl indent-8 text-black lg:text-md"
                            placeholder="Account number"
                        />
                        </div>
                    </div>
                    <div className="flex items-center space-x-5 px-5 rounded-xl py-3 mt-5 border-[2px] border-lightBlue shadow-sm shadow-lightBlue">
                        <FaCircleExclamation size={24} className="text-lightBlue" />
                        <span className="text-darkBlue text-sm">The amount will be sent to the provided bank account</span>
                    </div>
                    <Button
                        type="submit"
                        className="bg-darkBlue h-14 text-white hover:bg-lightBlue rounded-[100px] w-full mt-10"
                    >
                        Cashout
                    </Button>
                </form>
            )
        }
    </div>
  )
}

export default Cashout