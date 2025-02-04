import { MdCancel } from "react-icons/md"
import { FaCircleExclamation } from "react-icons/fa6";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CiLock } from "react-icons/ci";
import {useForm} from 'react-hook-form'
import toast from 'react-hot-toast'


function ViewProjectChecker({onClose,next}:{onClose:any,next?:any}) {
    const {
        register,
        handleSubmit,
        formState:{errors}
    }=useForm()
    // const navigate=useNavigate()

    const onSubmit=(data:any)=>{
        // console.log("form Data:",data)
        if(data.accessCode !=="1234"){
            toast.error("Incorrect access code")
            return 
        }
        next()
    }

  return (
    <div className="bg-white relative rounded-2xl w-full shadow-md py-10 px-5">
        <div className="px-5">
            <MdCancel onClick={onClose} className="absolute top-10 right-10 cursor-pointer" size={24} />
            <div className="mt-10 flex items-center justify-center">
                <span className="text-2xl font-semibold">View projects</span>
            </div>
            <div className="flex items-center space-x-5 px-5 rounded-xl py-3 mt-5 border-[2px] border-lightBlue shadow-sm shadow-lightBlue">
                <FaCircleExclamation size={24} className="text-lightBlue" />
                <span className="text-darkBlue">Provide access code to view this project</span>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-5">
                    <span className="text-darkBlue">Access code</span>
                    <div className="relative w-full mt-2 mb-2">
                        <CiLock className="absolute top-3 left-2 text-lightGray" size={24} />
                        <Input 
                            {...register(
                                "accessCode",
                                {
                                    required:"Access Code Required!"
                                }
                            )}
                            placeholder="Access code"
                            className={errors.accessCode ?"h-12 indent-8 border-red-600" :"h-12 indent-8"}
                        />
                    </div>
                    
                </div>
                <Button
                    type="submit"
                    className="bg-darkBlue h-12 text-white hover:bg-lightBlue rounded-[100px] w-full mt-10"
                >
                    Submit
                </Button>
            </form>
        </div>
    </div>
  )
}

export default ViewProjectChecker