import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { MdCancel, MdOutlinePhone } from "react-icons/md"
import { Input } from "./ui/input"
import { FaCircleExclamation } from "react-icons/fa6"
import { Button } from "./ui/button"
import { BsBank } from "react-icons/bs";
import { useAppSelector } from "@/redux/hooks"
import { selectUser } from "@/redux/slices/userSlice"
import { z } from "zod"
import { Textarea } from "./ui/textarea"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useCashoutMutation } from "@/redux/services/projectServices"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import LoadingComponent from "./LoadingComponent"



const formSchema=z.object({
  reason:z.string(),
  phone:z.string().optional(),
  type:z.string().optional(),
  amount:z.string().transform(val => {
    const parsed = parseFloat(val);
    if (isNaN(parsed)) {
      throw new Error('Invalid number');
    }
    return parsed;
  }),
  currency:z.string(),
  channel:z.string().optional()
})

const formSchemaBank=z.object({
    reason:z.string(),
    accountName:z.string(),
    accountNumber:z.string(),
    type:z.string().optional(),
    amount:z.string().transform(val => {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) {
        throw new Error('Invalid number');
      }
      return parsed;
    }),
    currency:z.string(),
    channel:z.string().optional()
})


type FormValuesBank=z.infer<typeof formSchemaBank>
type FormValues=z.infer<typeof formSchema>

function Cashout({onClose,projectId}:{onClose:any,projectId:string}) {
    const [mobileMoney,setMobileMoney]=useState(true)
    const [bank,setBank]=useState(false)
    const user=useAppSelector(selectUser)

    const [
        Cashout,
        {
            data:cashoutData,
            error:cashoutError,
            isLoading:cashoutIsLoading,
            isSuccess:cashoutIsSuccess,
            isError:cashoutIsError
        }
    ]=useCashoutMutation()

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState:{errors}
    }=useForm<FormValues>({
        resolver:zodResolver(formSchema)
    })

    const {
        register:registerBank,
        handleSubmit:handleSubmitBank,
        reset:resetBank,
        setValue:setValueBank,
        formState:{errors:errorsBank}
    }=useForm<FormValuesBank>({
        resolver:zodResolver(formSchemaBank)
    })

    const onsubmit=(data:FormValues)=>{
        Cashout({
            reason:data.reason,
            type:data.type,
            channel:"MOBILE MONEY",
            phone:data.phone,
            amount:data.amount,
            currency:data.currency,
            projectId:projectId,
            requester:user._id
        })
    }

    const onsubmitBank=(data:FormValuesBank)=>{
        Cashout({
            reason:data.reason,
            type:data.type,
            channel:"BANK",
            accountName:data.accountName,
            accountNumber:data.accountNumber,
            amount:data.amount,
            currency:data.currency,
            projectId:projectId,
            requester:user._id

        })
    }

    useEffect(()=>{
        if(cashoutIsSuccess && cashoutData){
            toast.success("cashout request sent")
            onClose()
            console.log("cashout success",cashoutData)
            reset()
        }
        if(cashoutIsError){
            console.log("unable to cashout",cashoutError)
            toast.error("cannot cashout")
        }
    },[cashoutIsError,cashoutIsSuccess])

    useEffect(()=>{
        console.log("cashout zodError",errors)
    },[errors])

  return (
    <div className="relative bg-white w-full p-5  rounded-2xl">
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
                <form onSubmit={handleSubmit(onsubmit)} className="">
                    <div className="flex flex-col space-y-1 my-5">
                        <label className="font-semibold">Reason</label>
                        <div className="relative">
                            <Textarea 
                                {...register("reason")}
                                className="h-12 rounded-xl indent-2 text-black lg:text-md"
                                placeholder="Reason of cashing out"
                            />
                            {errors.reason  && <span className="text-red-600 mt-2">{errors.reason?.message}</span>}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1 my-5">
                        <label className="font-semibold">Type</label>
                        <Select onValueChange={(value)=>setValue("type",value)}>
                        <SelectTrigger className="w-full  py-4 border border-gray-200 mt-1">
                            <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Type</SelectLabel>
                            <SelectItem value="DONATION">DONATION</SelectItem>
                            <SelectItem value="PRE-ORDER">PRE_ORDER</SelectItem>
                            <SelectItem value="LOAN">LOAN</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-full flex-col space-y-1 my-5">
                        <label className="font-semibold">Currency</label>
                        <Select onValueChange={(value)=>setValue("currency",value)}>
                        <SelectTrigger className="w-full py-4 border border-gray-200 mt-1">
                            <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Currency</SelectLabel>
                            <SelectItem value="CDF">CDF</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col space-y-1 my-5">
                        <label className="font-semibold">Cashout amount</label>
                        <div className="relative">
                            <Input 
                                {...register("amount")}
                                className="h-12 rounded-xl indent-2 text-black lg:text-md"
                                placeholder="Amount"
                            />
                            {errors.amount  && <span className="text-red-600 mt-2">{errors.amount?.message}</span>}
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
                            {errors.phone  && <span className="text-red-600 mt-2">{errors.phone?.message}</span>}
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
                        {cashoutIsLoading ? <LoadingComponent /> :"Cashout"}
                    </Button>
                </form>
            )
        }
        {
            bank &&(
                <form onClick={handleSubmitBank(onsubmitBank)} className="">
                    <div className="flex flex-col space-y-1 my-5">
                        <label className="font-semibold">Reason</label>
                        <div className="relative">
                            <Textarea 
                                {...registerBank("reason")}
                                className="h-12 rounded-xl indent-2 text-black lg:text-md"
                                placeholder="Reason of cashing out"
                            />
                            {errorsBank.reason  && <span className="text-red-600 mt-2">{errorsBank.reason?.message}</span>}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1 my-5">
                        <label className="font-semibold">Cashout amount</label>
                        <div className="relative">
                            <Input 
                                type="number"
                                {...registerBank("amount")}
                                className="h-12 rounded-xl indent-2 text-black lg:text-md"
                                placeholder="Amount"
                            />
                            {errorsBank.amount  && <span className="text-red-600 mt-2">{errorsBank.amount?.message}</span>}
                        </div>
                    </div>
                    <div className="flex w-full flex-col space-y-1 my-5">
                            <label className="font-semibold">Currency</label>
                            <Select onValueChange={(value)=>setValueBank("currency",value)}>
                                <SelectTrigger className="w-full  py-4 border border-gray-200 mt-1">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Currency</SelectLabel>
                                    <SelectItem value="CDF">CDF</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errorsBank.currency  && <span className="text-red-600 mt-2">{errorsBank.currency?.message}</span>}
                        </div>
                    <div className="flex flex-col space-y-1 my-5">
                        <label className="font-semibold">Account Number</label>
                        <div className="relative">
                            <BsBank className="absolute top-4 left-3" size={18} />
                            <Input 
                                {...registerBank("accountNumber")}
                                className="h-12 rounded-xl indent-8 text-black lg:text-md"
                                placeholder="Bank Number"
                            />
                            {errorsBank.accountNumber  && <span className="text-red-600 mt-2">{errorsBank.accountNumber?.message}</span>}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1 my-5">
                        <label className="font-semibold">Account Name</label>
                        <div className="relative">
                            <BsBank className="absolute top-4 left-3" size={18} />
                            <Input 
                                {...registerBank("accountName")}
                                className="h-12 rounded-xl indent-8 text-black lg:text-md"
                                placeholder="Bank Name"
                            />
                            {errorsBank.accountName  && <span className="text-red-600 mt-2">{errorsBank.accountName?.message}</span>}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1 my-5">
                        <label className="font-semibold">Type</label>
                        <Select onValueChange={(value)=>setValue("type",value)}>
                            <SelectTrigger className="w-full  py-4 border border-gray-200 mt-1">
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Type</SelectLabel>
                                <SelectItem value="DONATION">DONATION</SelectItem>
                                <SelectItem value="PRE-ORDER">PRE_ORDER</SelectItem>
                                <SelectItem value="LOAN">LOAN</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errorsBank.type  && <span className="text-red-600 mt-2">{errorsBank.type?.message}</span>}
                    </div>
                    
                    <div className="flex items-center space-x-5 px-5 rounded-xl py-3 mt-5 border-[2px] border-lightBlue shadow-sm shadow-lightBlue">
                        <FaCircleExclamation size={24} className="text-lightBlue" />
                        <span className="text-darkBlue text-sm">The amount will be sent to the provided bank account</span>
                    </div>
                    <Button
                        type="submit"
                        className="bg-darkBlue h-14 text-white hover:bg-lightBlue rounded-[100px] w-full mt-10"
                    >
                        {cashoutIsLoading ? <LoadingComponent /> :"Cashout"}
                    </Button>
                </form>
            )
        }
    </div>
  )
}

export default Cashout