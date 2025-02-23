import { MdCancel } from "react-icons/md"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { donateOptions } from "@/constants/dummydata"
import React, { useState } from "react"
import { FiUser } from "react-icons/fi"
import { Input } from "./ui/input"
import { useForm } from "react-hook-form"
import { GoCreditCard } from "react-icons/go";
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Button } from "./ui/button"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { FaCircleExclamation } from "react-icons/fa6"

interface cardPaymentProps{
  onClose:any 
  setMobileMoney:any 
  mobileMoney:boolean
  setCard:any 
  card:boolean 
  crypto:boolean
  setCrypto:any
}


function CardPayment({
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
        formState:{errors}
    }=useForm()

    const [anonymously,setAnonymously]=useState(false)

    const [date, setDate] = React.useState<Date>()
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
        <div className="flex flex-col space-y-1 my-5">
          <label className="font-semibold">Card Number</label>
          <div className="relative">
            <GoCreditCard className="absolute top-2 left-3" size={18} />
            <Input 
              {...register("cardNumber")}
              className="py-4 rounded-xl indent-8 text-black lg:text-md"
              placeholder="Card Number"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-5">
          <div className="flex flex-col space-y-1 my-5">
            <label className="font-semibold">Expire Date</label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "w-full md:w-[190px] py-4 justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "MM/yyyy") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                    />
                </PopoverContent>
                </Popover>
          </div>

          <div className="flex flex-col space-y-1 my-5">
            <label className="font-semibold">CVV</label>
            <div className="relative">
              <Input 
                {...register("cvv")}
                className="py-4 rounded-xl w-full md:w-[190px] indent-2 text-black lg:text-md"
                placeholder="CVV"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-5">
          <div className="flex flex-col space-y-1 my-5">
            <label className="font-semibold">Currency</label>
            <Select>
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
            Donate
        </Button>

      </form>

    </div>
  )
}

export default CardPayment