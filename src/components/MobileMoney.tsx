import { MdCancel } from "react-icons/md"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { donateOptions } from "@/constants/dummydata"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { Input } from "./ui/input"
import { FiUser } from "react-icons/fi";
import { MdOutlinePhone } from "react-icons/md";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FaCircleExclamation } from "react-icons/fa6"
import { Button } from "./ui/button"



interface mobileMoneyProps{
  onClose:any 
  setMobileMoney:any 
  mobileMoney:boolean
  setCard:any 
  card:boolean 
  crypto:boolean
  setCrypto:any
}


function MobileMoney({
  onClose,
  setMobileMoney,
  mobileMoney,
  setCard,
  card,
  crypto,
  setCrypto
}:mobileMoneyProps) {
  const [anonymously,setAnonymously]=useState(false)
  const {
      register,
      handleSubmit,
      formState:{errors}
  }=useForm()

  // console.log("anonymous::",anonymously)
  return (
    <div className="relative bg-white w-full p-5 rounded-2xl">
      <MdCancel size={28} onClick={onClose} className="absolute top-10 right-5 cursor-pointer" />
      <div className="mt-10 mx-5">
        <span className="font-bold text-[20px]">Donate</span>
      </div>
      <div className="m-5 flex space-x-8">
        {
          donateOptions.map((donateOption,index)=>(
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
                  mobileMoney && donateOption.name ==='mobileMoney'? "text-lightBlue cursor-not-allowed font-semibold":
                  card && donateOption.name ==='card' ?"text-lightBlue cursor-not-allowed font-semibold":
                  crypto && donateOption.name ==='crypto' ?"text-lightBlue cursor-not-allowed font-semibold":"cursor-pointer"
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
                <div className="w-[40px] h-1 bg-lightBlue"></div>
              }
            </div>
          ))
        }
      </div>
      
      <div className="flex w-2/4 m-5 items-center justify-between">
        <Label htmlFor="airplane-mode" className="text-[18px]">Donate anonymously</Label>
        <Switch onCheckedChange={(checked)=>setAnonymously(checked)} id="airplane-mode" />
      </div>

      <form className="m-5">
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Full Names</label>
          <div className="relative">
            <FiUser className="absolute top-2 left-3" size={18} />
            <Input 
              {...register("names")}
              className="py-4 rounded-xl indent-8 text-black lg:text-md"
              placeholder="Full Names"
            />
          </div>
        </div>
        {
          !anonymously &&(
            <div className="flex flex-col space-y-1 my-5">
              <label className="font-semibold">Phone Number</label>
              <div className="relative">
                <MdOutlinePhone className="absolute top-2 left-3" size={18} />
                <Input 
                  {...register("phone")}
                  className="py-4rounded-xl indent-8 text-black lg:text-md"
                  placeholder="Phone Number"
                />
              </div>
            </div>
          )
        }
        
        <div className="grid grid-cols-2 gap-x-5">
          <div className="flex flex-col space-y-1 my-5">
            <label className="font-semibold">Currency</label>
            <Select>
              <SelectTrigger className="w-[180px] py-4 border border-gray-200 mt-1">
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
                className="py-4 rounded-xl w-[190px] indent-2 text-black lg:text-md"
                placeholder="Amount"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-5 px-5 rounded-xl py-3 mt-5 border-[2px] border-lightBlue shadow-sm shadow-lightBlue">
          <FaCircleExclamation size={24} className="text-lightBlue" />
          <span className="text-darkBlue">Donation complete after payment processing</span>
        </div>

        <Button
            type="submit"
            className="bg-darkBlue h-14 text-white hover:bg-lightBlue rounded-[100px] w-full mt-10"
        >
            Donate
        </Button>

      </form>

    </div>
  )
}

export default MobileMoney