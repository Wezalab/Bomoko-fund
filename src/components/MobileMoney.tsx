import { MdCancel } from "react-icons/md"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { donateOptions } from "@/constants/dummydata"
import { useEffect, useState } from "react"
import {  useForm } from "react-hook-form"
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
import { useDonateMutation, useFindProjectMutation, useGetProjectQuery } from "@/redux/services/projectServices"
import { useAppSelector } from "@/redux/hooks"
import { selectUser } from "@/redux/slices/userSlice"
import { zodResolver } from "@hookform/resolvers/zod"
import LoadingComponent from "./LoadingComponent"
import toast from "react-hot-toast"
import axios from "axios"
import { Description } from "@radix-ui/react-dialog"
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from "./ui"



interface mobileMoneyProps{
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
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[1-9]\d{8,14}$/.test(val),
      { message: "Phone number must start with a country code (no plus sign) and contain 9 to 15 digits in total" }
    ),
  type:z.string(),
  amount:z.string(),
  currency:z.string(),
  channel:z.string().optional(),
  description:z.string().optional()
})

type FormValues=z.infer<typeof formSchema>

function MobileMoney({
  projectId,
  onClose,
  setMobileMoney,
  mobileMoney,
  setCard,
  card,
  crypto,
  setCrypto
}:mobileMoneyProps) {
  const [anonymously,setAnonymously]=useState(false)
  const user=useAppSelector(selectUser)


  

  const {
      register,
      handleSubmit,
      setValue,
      reset,
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

  const 
    {
      data:projectData,
      isLoading:projectIsLoading,
      isError:projectIsError,
      isSuccess:projectIsSuccess,
      error:projectError
    }=useGetProjectQuery(projectId,{skip: !projectId })
  

  useEffect(()=>{
    if(donateData && donateIsSuccess){
      //console.log("donated successfully",donateData)
      window.scrollTo(0,0)
      toast.success("donation successfully done!")
      reset()
      onClose()
    }
    if(donateIsError){
      console.log("error while donating using mobile money",donateError)
    }
  },[donateIsSuccess,donateIsError])


  


  const onsubmit=async(data:FormValues)=>{
    const uuid= uuidv4()
    const body={
      amount:data.amount,
      callbackUrl: "http://localhost",
      currency: data.currency,
      description: data.Description,
      merchant: "ALPHA_NEW",
      phone: data.phone?.replace("+",""),
      reference: uuid,
      "type": "1"
    }

    try {
      const res=await axios.post('https://beta-backend.flexpay.cd/api/rest/v1/paymentService',body)
      console.log("payment feedback",res)
    } catch (error) {
      console.log("payment error")
    }
    // Donate({
    //   donator:data.donator,
    //   phone:data.phone,
    //   amount:data.amount,
    //   type: data.type,
    //   currency:data.currency,
    //   channel:"MOBILE MONEY",
    //   projectId:projectId,
    //   userId:user._id
    // })
    // FindProject(projectId)
  }

  useEffect(()=>{
    if(projectIsSuccess && projectData){
      //console.log("got project data",projectData)
    }
    if(projectIsError){
      console.log("error while getting a project",projectError)
    }
  },[projectIsError,projectIsSuccess])

  useEffect(()=>{
    console.log("errors",errors)
  },[errors])

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
                  mobileMoney && donateOption.name ==='mobileMoney'? "text-lightBlue md:text-md text-sm cursor-not-allowed font-semibold":
                  card && donateOption.name ==='card' ?"text-lightBlue md:text-md text-sm cursor-not-allowed font-semibold":
                  crypto && donateOption.name ==='crypto' ?"text-lightBlue md:text-md text-sm cursor-not-allowed font-semibold":"cursor-pointer md:text-md text-sm"
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
        <Label htmlFor="airplane-mode" className="text-sm md:text-[18px]">Donate anonymously</Label>
        <Switch onCheckedChange={(checked)=>setAnonymously(checked)} id="airplane-mode" />
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
                {errors.phone  && <span className="text-red-600 mt-2">{errors.phone?.message}</span>}
              </div>
            </div>
          )
        }
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
          <div className="flex w-full flex-col space-y-1 my-5">
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

          <div className="flex w-full flex-col space-y-1 my-5">
            <label className="font-semibold">Amount</label>
            <div className="relative">
              <Input 
                {...register("amount")}
                className="py-4 rounded-xl w-full md:w-[190px] indent-2 text-black lg:text-md"
                placeholder="Amount"
              />
              {errors.amount  && <span className="text-red-600 mt-2">{errors.amount?.message}</span>}
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-1 my-5">
          <label className="font-semibold">Description</label>
          <div className="relative">
            <Textarea 
              {...register("description")}
              className="py-4rounded-xl indent-1 text-black lg:text-md"
              placeholder="Description"
              rows={3}
            />
            {errors.phone  && <span className="text-red-600 mt-2">{errors.phone?.message}</span>}
          </div>
        </div>
        <div className="flex items-center space-x-5 px-5 rounded-xl py-3 mt-5 border-[2px] border-lightBlue shadow-sm shadow-lightBlue">
          <FaCircleExclamation size={24} className="text-lightBlue" />
          <span className="text-darkBlue md:text-md text-xs">Donation complete after payment processing</span>
        </div>

        <Button
            disabled={donateIsLoading}
            type="submit"
            className="bg-darkBlue h-14 text-white hover:bg-lightBlue rounded-[100px] w-full mt-10"
        >
          {donateIsLoading ? <LoadingComponent /> :"Donate"}
          
        </Button>

      </form>

    </div>
  )
}

export default MobileMoney