import { FaGift } from "react-icons/fa";
import ProgressBar from "./ProgressBar"
import { Button } from "./ui/button"
import { MdOutlineArrowOutward } from "react-icons/md";
import profileImg from '../assets/project-author.png'

interface PopularProjectCardProps{
   image:string 
   title:string 
   desc:string 
   profile?:string
   type?:string 
   limit:number 
   className?:string
   amount:number
   onClick?:any,
   action?:any
   actionName:string
}

function PopularProjectCard({
    image,
    title,
    desc,
    type,
    limit,
    className,
    amount,
    onClick,
    action,
    actionName
}:PopularProjectCardProps) {
   
    const percentage = Math.round(Math.min((amount || 0 / limit) * 100, 100));
  return (
    <div className={'w-full h-[550px] relative cursor-pointer hover:opacity-50 rounded-md'+className}>
        <img 
            className="w-full h-full object-cover rounded-2xl blur-0 opacity-90 brightness-90"
            src={image}
            alt="project-bg"
        />
        <div className="">
            <div className="w-12 bg-yellow absolute top-5 z-10 left-5 border-white rounded-full border-4 h-12 flex items-center justify-center">
                <img 
                    src={profileImg}
                    className="w-full h-full  object-cover"
                    alt="popularProject-profile"
                />
            </div>
            <div className="py-1 px-3 rounded-md absolute right-5 top-6 bg-yellow text-black text-center">
                <span className="text-xs font-semibold">{type}</span>
            </div>
            <div className="flex w-full flex-col space-y-4 absolute bottom-[2%] md:left-0 lg:left-2 text-white">
                <div className="w-[280px]">
                    <span className="text-[18px] md:text-[24px] font-bold">{title}</span>
                </div>     
                <span className="text-xs md:text-sm font-semibold">{desc}</span>
                <div className="mt-5 w-[96%] mr-[2%]">
                    <div className="flex items-center w-[98%] ml-2 justify-between">
                        <span>{amount || 0}$</span>
                        <span>{percentage}%</span>
                    </div>
                    <div className="w-[98%] ml-2">
                        <ProgressBar 
                            value={amount || 0}
                            max={limit}
                        />
                    </div>
                </div>
                <div className="flex items-center mx-3 justify-between">
                    <Button
                        onClick={action}
                        className="flex items-center justify-between bg-lightBlue hover:bg-blue-700 text-white rounded-[100px] max-w-fit h-[48px]"
                    >
                        {actionName} 
                        <FaGift color="white" size={28} />
                    </Button>
                    <Button
                        onClick={onClick}
                        className="flex items-center justify-between bg-transparent bg-gray-500 hover:bg-black text-white border-2 border-white rounded-[100px] max-w-fit h-[48px]"
                    >
                        View more
                        <MdOutlineArrowOutward size={24} color="white" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PopularProjectCard