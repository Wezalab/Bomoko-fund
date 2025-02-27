import { MdCancel } from "react-icons/md"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { donateOptions } from "@/constants/dummydata"
import React, { useEffect, useState } from "react"
import { FiUser } from "react-icons/fi"
import { Input } from "./ui/input"
import { useForm } from "react-hook-form"
import { GoCreditCard } from "react-icons/go";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Button } from "./ui/button"
import { FaCircleExclamation } from "react-icons/fa6"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDonateMutation } from "@/redux/services/projectServices"
import toast from "react-hot-toast"
import { useAppSelector } from "@/redux/hooks"
import { selectUser } from "@/redux/slices/userSlice"
import LoadingComponent from "./LoadingComponent"

interface cardPaymentProps{
  projectId:string
  onClose:any 
  setMobileMoney:any 
  mobileMoney:boolean
  setCard:any 
  card:boolean 
  crypto:boolean
  setCrypto:any
}

const formSchema=z.object({
  donator:z.string().optional(),
  cardNumber:z.string().optional(),
  amount:z.string().transform(val => {
    const parsed = parseFloat(val);
    if (isNaN(parsed)) {
      throw new Error('Invalid number');
    }
    return parsed;
  }),
  type:z.string(),
  currency:z.string(),
  channel:z.string().optional()
})

type FormValues=z.infer<typeof formSchema>

function CardPayment({
  projectId,
  onClose,
  setMobileMoney,
  mobileMoney,
  setCard,
  card,
  crypto,
  setCrypto
}:cardPaymentProps) {

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState:{errors}
    }=useForm<FormValues>({
      resolver:zodResolver(formSchema)
    })

     const [
        Donate,
        {
          data:donateData,
          error:donateError,
          isLoading:donateIsLoading,
          isSuccess:donateIsSuccess,
          isError:donateIsError
        }
      ]=useDonateMutation()

    const [anonymously,setAnonymously]=useState(false)
    const user=useAppSelector(selectUser)
    const [date, setDate] = React.useState<Date>()



    const onsubmit=(data:FormValues)=>{
      Donate({
        donator:data.donator,
        cardNumber:data.cardNumber,
        amount:data.amount,
        type: data.type,
        currency:data.currency,
        channel:"BANK",
        projectId:projectId,
        userId:user._id
      })
    }

    useEffect(()=>{
      if(donateData && donateIsSuccess){
        //console.log("donated successfully",donateData)
        toast.success("donation successfully done!")
        reset()
        onClose()
      }
      if(donateIsError){
        console.log("error while donating using bank",donateError)
      }
    },[donateIsSuccess,donateIsError])

  return (
    <div className="relative bg-white w-full p-5 rounded-2xl">
      <MdCancel size={28} onClick={onClose} className="absolute top-10 right-5 cursor-pointer" />
      <div className="mt-10 mx-5">
        <span className="font-bold text-[20px]">Donate</span>
      </div>
      <div className="m-5 flex space-x-8">
        {
          donateOptions?.map((donateOption,index)=>(
            <div key={index} className="flex flex-col">
              <span 
                onClick={()=>{
                  if(donateOption.name ==="mobileMoney"){
                    setMobileMoney(true)
                    setCard(false)
                    setCrypto(false)
                  }
                  if(donateOption.name ==="card"){
                    setMobileMoney(false)
                    setCard(true)
                    setCrypto(false)
                  }
                  if(donateOption.name ==="crypto"){
                    setMobileMoney(false)
                    setCard(false)
                    setCrypto(true)
                  }
                }}
                className={
                  mobileMoney && donateOption.name ==='mobileMoney'? "text-lightBlue text-sm md:text-md cursor-not-allowed font-semibold":
                  card && donateOption.name ==='card' ?"text-lightBlue text-sm md:text-md cursor-not-allowed font-semibold":
                  crypto && donateOption.name ==='crypto' ?"text-lightBlue text-sm md:text-md cursor-not-allowed font-semibold":"cursor-pointer text-sm md:text-md"
                }
              >
                {
                  donateOption.name === 'mobileMoney'?'Use Mobile Money':
                  donateOption.name === 'card'?'Use Card':
                  donateOption.name === 'crypto'?'Use Crypto':'' 
                }
              </span>
              {
                (mobileMoney && donateOption.name ==='mobileMoney' || card && donateOption.name ==='card' || crypto && donateOption.name ==='crypto' ) &&
                <div className="text-sm md:w-[40px] h-1 bg-lightBlue"></div>
              }
            </div>
          ))
        }
      </div>
      
      <div className="flex w-2/4 m-5 items-center justify-between">
        <Label htmlFor="airplane-mode" className="text-sm md:text-[18px]">Donate anonymously</Label>
        <Switch onCheckedChange={(checked)=>setAnonymously(checked)} id="airplane-mode"  />
      </div>

      <form onSubmit={handleSubmit(onsubmit)} className="m-5">
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Full Names</label>
          <div className="relative">
            <FiUser className="absolute top-2 left-3" size={18} />
            <Input 
              {...register("donator")}
              className="py-4 rounded-xl indent-8 text-black lg:text-md"
              placeholder="Full Names"
            />
            {errors.donator  && <span className="text-red-600 mt-2">{errors.donator?.message}</span>}
          </div>
        </div>
        <div className="flex flex-col space-y-1 my-5">
          <label className="font-semibold">Card Number</label>
          <div className="relative">
            <GoCreditCard className="absolute top-2 left-3" size={18} />
            <Input 
              {...register("cardNumber")}
              className="py-4 rounded-xl indent-8 text-black lg:text-md"
              placeholder="Card Number"
            />
            {errors.cardNumber  && <span className="text-red-600 mt-2">{errors.cardNumber?.message}</span>}
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
        <div className="grid md:grid-cols-2 gap-x-5">
          <div className="flex flex-col space-y-1 my-5">
            <label className="font-semibold">Currency</label>
            <Select onValueChange={(value)=>setValue("currency",value)}>
              <SelectTrigger className="w-full md:w-[180px] py-4 border border-gray-200 mt-1">
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
            <label className="font-semibold">Amount</label>
            <div className="relative">
              <Input 
                {...register("amount")}
                className="py-4 rounded-xl w-full md:w-[190px] indent-2 text-black lg:text-md"
                placeholder="Amount"
              />
              {errors?.amount  && <span className="text-red-600 mt-2">{errors.amount?.message}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-5 px-5 rounded-xl py-3 mt-5 border-[2px] border-lightBlue shadow-sm shadow-lightBlue">
            <FaCircleExclamation size={24} className="text-lightBlue" />
            <span className="text-darkBlue md:text-md text-sm">Donation complete after payment processing</span>
        </div>

        <Button
            type="submit"
            className="bg-darkBlue h-14 text-white hover:bg-lightBlue rounded-[100px] w-full mt-10"
        >
            {donateIsLoading ? <LoadingComponent /> : "Donate"}
        </Button>

      </form>

    </div>
  )
}

export default CardPayment