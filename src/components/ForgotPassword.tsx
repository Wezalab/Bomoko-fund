import { MdCancel } from "react-icons/md"
import { Button } from "./ui/button"
import { IoIosArrowBack } from "react-icons/io";


function ForgotPassword({onClose}:{onClose:any}) {

  return (
    <div className='px-5 pb-8 pt-5 bg-white shadow-md rounded-2xl'>
        <MdCancel size={28} onClick={onClose} className="absolute top-6 right-5 cursor-pointer" />
        <div className="">
            <span>Reset password</span>
            <div className="">
                <Button
                    className="flex items-center space-x-4 bg-white rounded-3xl h-12 px-5 max-w-fit"
                >
                    <IoIosArrowBack />
                    Back
                </Button>
            </div>
        </div>
    </div>
  )
}

export default ForgotPassword