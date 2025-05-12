import { MdCancel } from "react-icons/md"
import { Button } from "./ui/button"
import { notifications } from "@/constants/dummydata"

function NotificationModal({onClose}:{onClose:any}) {
  return (
    <div className="p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between">
            <span className="text-xl font-bold">Notifications</span>
            <Button
                className="text-white bg-lightBlue rounded-[100px] h-10 px-5 max-w-fit"
            >
                Clear All
            </Button>
        </div>
        <div className="mt-6 flex-col space-y-5 h-[500px] overflow-y-auto">
            {
                notifications.map((item, index)=>(
                    <div key={index} className="flex w-full justify-between">
                        <div className="flex space-x-2 w-[70%] mx-1">
                            <img 
                                src={item.image}
                                className="w-16 h-16 rounded-full object-cover"
                                alt={item.image+index}
                            />
                            <div className="flex flex-col">
                                <span className="text-sm">{item.description}</span>
                                <span className="text-xs font-semibold text-lightGray">{item.time}</span>
                            </div>
                        </div>
                        {
                            !item.read && (
                                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                            )
                        }
                        
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default NotificationModal