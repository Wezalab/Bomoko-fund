import { useAppSelector } from '@/redux/hooks'
import { selectPreviewProject } from '@/redux/slices/projectSlice'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui'
import projectProfile from '../assets/project-profile.png'
import { Download } from 'lucide-react'
import { selectUser } from '@/redux/slices/userSlice'
import ProgressBar from './ProgressBar'
import LoadingComponent from './LoadingComponent'

function PreviewProject({data,loading,back,submit}:{data:any,loading:boolean,submit?:()=>void,back:()=>void}) {
    const user=useAppSelector(selectUser)
    
    
  return (
    <form className="relative">
        {/* {
            login && 
            <div className="md:w-[80%] md:left-[10%] lg:w-[500px] absolute md:top-[20%] lg:top-[10%] z-10 lg:left-[40%]">
                <SignIn onClose={()=>setLogin(false)} />
            </div>
        }
        {
            donate &&
            <div className="md:w-[80%] md:left-[10%] lg:w-[500px] absolute md:top-[20%] lg:top-[10%] z-10 lg:left-[40%]">
                <Donate projectId={project._id} onClose={()=>setDonate(false)} />
            </div>
        }
        {
            cashout &&
            <div className="md:w-[80%] md:left-[10%] lg:w-[500px] absolute md:top-[20%] lg:top-[10%] z-10 lg:left-[40%]">
                <Cashout projectId={project._id} onClose={()=>setCashout(false)} />
                
            </div>
        } */}
        <div className={"grid md:my-5 grid-cols-1 lg:grid-cols-4  gap-x-10 lg:pr-5"}>
            
            <div className="col-span-3">
                <div className="w-full h-[500px] relative">
                    <img 
                        src={URL.createObjectURL(data?.medias[0])}
                        className="w-full h-full object-cover"
                        alt={data?.name}
                    />
                    <Button
                        onClick={back}
                        className="text-black h-9 md:h-12 lg:text-xl w-[20] md:w-28 md:text-md text-sm top-[5%] left-[2%] rounded-[100px] absolute z-10 bg-white hover:bg-lightGreen"
                    >
                        Back
                    </Button>
                    <div className="flex flex-col space-y-5 absolute bottom-[10%] z-10 left-[5%]">
                        <div className="bg-[#D6FFE7] py-1 px-4 rounded-2xl max-w-fit">
                            <span className="">{data?.name}</span>
                        </div>
                        <span className="text-[24px] font-semibold text-white">{data?.description}</span>
                    </div>
                </div>
                {/* <div className="grid grid-cols-2 w-[96%] mx-auto md:w-[80%] md:ml-auto gap-5 my-12">
                    <img
                        src={projectVideo}
                        className="w-full h-full object-fill rounded-lg"
                        alt="project-video"
                    />
                    <img 
                        src={projectImage2}
                        className="w-full h-full object-fill rounded-lg"
                        alt="project-image"
                    />
                    
                </div> */}
                <div className="grid grid-cols-1 lg:grid-cols-4 w-[96%] mx-auto md:w-[95%] md:ml-auto md:gap-x-8 my-5">
                    <div className="lg:col-span-1 md:mb-2 w-full max-w-sm bg-gray-200 p-5 rounded-xl">
                        <div className="flex space-x-5">
                            <div className="w-[64px] h-[64px] rounded-full relative overflow-hidden">
                                {/* Dark overlay */}
                                <div className="absolute inset-0 bg-black opacity-50  rounded-full" />
                                
                                {/* Image below the overlay */}
                                <img 
                                    className="w-full h-full rounded-full object-cover z-0"
                                    src={projectProfile}
                                    alt="project-profile"
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <span className="text-sm">Created By</span>
                                <span className="font-semibold text-[18px] md:text-[20px]">
                                {user?.name || "N/A"}
                                </span>
                            </div>
                        </div>


                        <div className="my-5 flex flex-col space-y-2">
                            <span className="text-lightGray">Province</span>
                            <span className="text-lightGray font-semibold text-sm lg:text-[18px]">
                            {data?.province}
                            </span>
                        </div>

                        <div className="my-5 flex flex-col space-y-2">
                            <span className="text-lightGray">Territoire</span>
                            <span className="text-lightGray font-semibold text-sm lg:text-[18px]">
                            {data?.territory}
                            </span>
                        </div>
                    </div>
                    <div className="w-[100%] lg:col-span-3 mx-auto">
                        <p className="font-semibold text-[18px] md:text-[20px] text-lightGray">
                            {data?.description}
                        </p>
                    </div>
                </div>
                {/* <div className="w-[80%] mx-auto md:ml-auto my-10">
                    <span className="text-[24px] font-bold ">Project attachments</span>
                    <div className="grid md:grid-cols-2 md:gap-5 mt-5">
                        {
                            (!data?.attachments || data?.attachments?.length === 0) && (
                                <div className="flex justify-center items-center">
                                    <span className="text-nowrap">No attachment Available</span>
                                </div>
                            )
                        }
                        {
                            data?.attachments?.map((file:any,index:number)=>(
                                <a key={file?._id} href={file} className="py-3 px-5 flex items-center justify-between bg-white border-[1px] rounded-md border-black ">
                                    <span>Download File {index+1}</span>
                                    <Download className="w-5 h-5" />
                                </a>
                            ))
                        }
                        
                    </div>
                </div> */}
            </div>
            <div className="w-full ml-[15%] px-5 mb-5 py-2 md:w-[90%] mx-auto md:ml-auto lg:col-span-1 max-h-fit shadow-md lg:p-5 bg-white rounded-2xl">
                <div className="mt-5 w-[98%] mb-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xl capitalize">{data?.targetAmount}$</span>
                        <span className="text-xl">{0}%</span>
                    </div>
                    <div className="w-full">
                        <ProgressBar 
                            value={0}
                            max={data?.targetAmount}
                        />
                    </div>
                </div>
                <div className="flex flex-col space-y-2 mb-5">
                    {/* <div className="flex items-center space-x-1">
                        <span>Cashed Out:</span>
                        <span className="text-lightGray font-semibold">1000 $</span>
                    </div> */}
                    
                <div className="w-3/4 mx-auto mt-5 flex flex-col space-y-4">
                    
                    <Button
                        
                        onClick={submit}
                        className="bg-white hover:text-white text-black flex items-center space-x-5 text-sm md:text-md md:text-2xl  font-semibold h-14 w-full  rounded-[100px]"
                    >
                        {loading ? <LoadingComponent /> :"Save Changes"}
                        
                    </Button>
                </div>
            </div>
            
        </div>
    </div>
    </form>
  )
}


export default PreviewProject