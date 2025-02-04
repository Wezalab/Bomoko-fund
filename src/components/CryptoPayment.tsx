import { MdCancel } from "react-icons/md"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { cryptoData, donateOptions } from "@/constants/dummydata"
import { useState } from "react"
import { FiUser } from "react-icons/fi"
import { Input } from "./ui/input"
import { useForm } from "react-hook-form"
import { FaExchangeAlt } from "react-icons/fa";
import { FaCircleExclamation } from "react-icons/fa6"
import { Button } from "./ui/button"


interface cryptoPaymentProps{
  onClose:any 
  setMobileMoney:any 
  mobileMoney:boolean
  setCard:any 
  card:boolean 
  crypto:boolean
  setCrypto:any
}


function CryptoPayment({
  onClose,
  setMobileMoney,
  mobileMoney,
  setCard,
  card,
  crypto,
  setCrypto
}:cryptoPaymentProps) {

    const {
        register,
        handleSubmit,
        formState:{errors}
    }=useForm()
    const [anonymously,setAnonymously]=useState(false)
    const [selectedCrypto,setSelectedCrypto]=useState("BTC")
    const [donate,setDonate]=useState(false)
    const [connectWallet,setConnectWallet]=useState(false)
    const [wallet,setWallet]=useState({
      name:"",
      walletId:""
    })

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
        {
          !anonymously && (
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
          )
        }
        
        <div className="bg-[#EDF4FF] rounded-lg flex items-center justify-between p-6 my-5">
            {
                cryptoData.map((c:any,index:number)=>(
                    <div key={index} className="flex flex-col space-y-2 items-center">
                        <div  className={selectedCrypto ===c.name?"p-2 rounded-full border-[2px] border-lightBlue cursor-not-allowed":"p-2 cursor-pointer"}>
                          <img 
                              onClick={()=>setSelectedCrypto(c.name)}
                              src={c.icon}
                              className={"w-[21px] h-[21px]"}
                              alt={c.name+String(index)}
                          />
                        </div>
                        
                        <span>{c.name}</span>
                    </div>
                ))
            }
        </div>
        <div className="">
            <span className="font-semibold">Amount</span>
            <div className="flex items-center space-x-5 mt-2">
                <div className="flex flex-col space-y-1">
                    <div className="relative">
                      <Input 
                          {...register("crypto")}
                          className="py-4 rounded-xl w-[180px] indent-2 text-black lg:text-md"
                          placeholder="Crypto"
                      />
                      <span className="absolute top-2 right-2 text-[14px]">.{selectedCrypto}</span>
                    </div>
                </div>
                <div className="">
                  <FaExchangeAlt color="gray" size={24} />
                </div>
                
                <div className="">
                    <div className="relative">
                      <Input 
                          {...register("amount")}
                          className="py-4 rounded-xl w-[180px] indent-2 text-black lg:text-md"
                          placeholder="USD"
                      />
                      <span className="absolute top-2 right-2 text-[14px]">$</span>
                    </div>
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

export default CryptoPayment