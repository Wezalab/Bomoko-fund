import { FaGift } from "react-icons/fa";
import ProgressBar from "./ProgressBar"
import { Button } from "./ui/button"
import { MdOutlineArrowOutward } from "react-icons/md";

interface PopularProjectCardProps{
   image:string 
   title:string 
   desc:string 
   profile?:string
   type?:string 
   limit:number 
   className:string
   amount:number
}

function PopularProjectCard({
    image,
    title,
    desc,
    profile,
    type,
    limit,
    className,
    amount
}:PopularProjectCardProps) {
   
    const percentage = Math.min((amount / limit) * 100, 100);
  return (
    <div className={'w-[400px] h-[550px] relative rounded-md'+className}>
        <img 
            className="w-full h-full object-cover rounded-2xl"
            src={image}
            alt="project-bg"
        />
        <div className="">
            <div className="w-12 bg-yellow absolute top-5 z-10 left-5 border-white rounded-full border-4 h-12 flex items-center justify-center">
                <img 
                    src={profile}
                    className="w-full h-full  object-cover"
                    alt="popularProject-profile"
                />
            </div>
            <div className="w-[57px] h-[24px] rounded-md absolute right-5 top-6 bg-yellow text-black text-center">
                <span className="text-xs font-semibold">{type}</span>
            </div>
            <div className="flex flex-col space-y-4 absolute bottom-5 left-2 text-white">
                <span className="text-[24px] font-semibold">{title}</span>
                <span className="text-sm">{desc}</span>
                <div className="mt-5 w-[98%]">
                    <div className="flex items-center justify-between">
                        <span>{amount}$</span>
                        <span>{percentage}%</span>
                    </div>
                    <ProgressBar 
                        value={amount}
                        max={limit}
                    />
                </div>
                <div className="flex items-center space-x-10">
                    <Button
                        className="flex items-center justify-between bg-lightBlue hover:bg-blue-200 text-white rounded-[100px] w-[150px] h-[48px]"
                    >
                        Donate 
                        <FaGift color="white" size={28} />
                    </Button>
                    <Button
                        className="flex items-center justify-between bg-transparent text-white border-2 border-white rounded-[100px] w-[150px] h-[48px]"
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