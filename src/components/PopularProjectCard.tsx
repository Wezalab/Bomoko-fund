import { FaGift } from "react-icons/fa";
import ProgressBar from "./ProgressBar"
import { Button } from "./ui/button"
import { MdOutlineArrowOutward } from "react-icons/md";
import profileImg from '../assets/project-author.png'
import { useTranslation } from "@/lib/TranslationContext";

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
    const { t } = useTranslation();
    const percentage = Math.round(Math.min((amount || 0 / limit) * 100, 100));
  return (
    <div className={'w-full h-[550px] relative cursor-pointer hover:opacity-50 rounded-md'+className}>
        <img
            className="w-full h-full object-cover rounded-2xl inset-0"
            src={image}
            alt="project-bg"
        />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-55 rounded-2xl" />
        <div className="">
            <div className="w-12  absolute top-5 z-10 left-5 border-white rounded-full border-4 h-12 flex items-center justify-center">
                <img 
                    src={profileImg}
                    className="w-full h-full brightness-75 object-contain rounded-full bg-black opacity-50"
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
                <span className="text-xs md:text-sm font-semibold">{desc?.split(".")[0]}</span>
                <div className="mt-5 w-[94%] mr-[2%]">
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
                <div className="flex lg:flex-row lg:space-y-0  md:flex-col md:space-y-2 md:w-full items-center mr-[36%] w-3/6  md:-ml-5 space-x-2 md:p-2 lg:p-5 mx-auto justify-between">
                    <Button
                        onClick={action}
                        className="flex items-center justify-between bg-lightBlue hover:bg-blue-700 text-white rounded-[100px] md:w-[100%] lg:max-w-fit h-[10%]"
                    >
                        {actionName} 
                        <FaGift color="white" size={28} />
                    </Button>
                    <Button
                        onClick={onClick}
                        className="flex items-center justify-between bg-transparent bg-gray-500 hover:bg-black text-white border-2 border-white rounded-[100px] md:w-[100%] lg:max-w-fit text-md"
                    >
                        {t("View details")}
                        <MdOutlineArrowOutward size={24} color="white" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PopularProjectCard