import { useAppSelector } from "@/redux/hooks"
import {  ProjectInitialState, selectProject, setProject } from "@/redux/slices/projectSlice"
import { Button } from "./ui/button"
import projectVideo from '../assets/project-video.jpg'
import projectImage2 from '../assets/02.jpg'
import projectProfile from '../assets/project-profile.png'
import ProgressBar from "./ProgressBar"
import { FaGift,FaShareAlt } from "react-icons/fa"
import { CiEdit } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Donate from "./Donate"
import { selectUser } from "@/redux/slices/userSlice"
import Cashout from "./Cashout"
import { Download } from "lucide-react"
import {DateTime} from 'luxon'
import { useGetProjectMutation } from "@/redux/services/projectServices"

function SingleProject() {
    const [donate,setDonate]=useState(false)
    const [cashout,setCashout]=useState(false)
    const project=useAppSelector(selectProject)
    const navigate=useNavigate()
    const user=useAppSelector(selectUser)
    const {id}=useParams()

    const startDate=project.startDate && DateTime.fromISO(project.startDate)
    const endDate=project.startDate && DateTime.fromISO(project.endDate)
    //@ts-ignore
    const remainingDays=endDate.diff(startDate,["days"])

    const [
        GetProject,
        {
            data:getProjectData,
            error:getProjectError,
            isLoading:getProjectIsLoading,
            isError:getProjectIsError,
            isSuccess:getProjectIsSuccess
        }
    ]=useGetProjectMutation()

    useEffect(()=>{
        window.scrollTo(0,0)
    },[])

    
    useEffect(()=>{
        if(getProjectData && getProjectIsSuccess){
            console.log("get project data:",getProjectData)
        }
        if(getProjectIsError){
            console.log("error while getting project",getProjectError)
        }
    },[getProjectIsLoading,getProjectIsSuccess])

    useEffect(()=>{
        GetProject(id)
    },[donate])
    


    //console.log("project selected",project)
  return (
    <div className="relative">
        {
            donate &&
            <div className="md:w-[80%] md:left-[10%] lg:w-[500px] absolute md:top-[20%] lg:top-[10%] z-10 lg:left-[40%]">
                <Donate projectId={project._id} onClose={()=>setDonate(false)} />
            </div>
        }
        {
            cashout &&
            <div className="md:w-[80%] md:left-[10%] lg:w-[500px] fixed md:top-[20%] lg:top-[10%] z-10 lg:left-[40%]">
                <Cashout onClose={()=>setCashout(false)} />
            </div>
        }
        <div className={(donate || cashout) ?"blur-sm grid md:my-5 md:grid-cols-1 lg:grid-cols-4 gap-x-10 lg:pr-5" :"grid md:my-5 grid-cols-1 lg:grid-cols-4  gap-x-10 lg:pr-5"}>
            
            <div className="col-span-3">
                <div className="w-full h-[500px] relative">
                    <img 
                        src={project?.medias[0]}
                        className="w-full h-full object-cover"
                        alt={project?.name}
                    />
                    <Button
                        onClick={()=>{
                            setProject(ProjectInitialState.project)
                            navigate('/projects')
                        }}
                        className="text-black h-9 md:h-12 lg:text-xl w-[20] md:w-28 md:text-md text-sm top-[5%] left-[2%] rounded-[100px] absolute z-10 bg-white hover:bg-lightGreen"
                    >
                        Back
                    </Button>
                    <div className="flex flex-col space-y-5 absolute bottom-[10%] z-10 left-[5%]">
                        <div className="bg-[#D6FFE7] py-1 px-4 rounded-2xl max-w-fit">
                            <span className="">{project.name}</span>
                        </div>
                        <span className="text-[24px] font-semibold text-white">{project.description}</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 w-[96%] mx-auto md:w-[80%] md:ml-auto gap-5 my-12">
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
                    
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 w-[96%] mx-auto md:w-[80%] md:ml-auto md:gap-x-8 my-5">
                    <div className="lg:col-span-1 md:mb-2 max-h-fit bg-gray-200 p-5 rounded-xl">
                        <div className="flex space-x-5">
                            <img 
                                className="w-[64px] h-[64px] rounded-full"
                                src={projectProfile}
                                alt="project-profile"
                            />
                            <div className="flex flex-col space-y-2">
                                <span>Created By</span>
                                <span className="font-semibold text-[18px] md:text-[20px]">Kamana John</span>
                            </div>
                        </div>
                        <div className="my-5 flex flex-col space-y-2">
                            <span className="text-lightGray">Created on</span>
                            <span className="text-lightGray font-semibold text-[18px] md:text-[20px]">{project.startDate?.split("T")[0]}</span>
                        </div>
                        <div className="my-5 flex flex-col space-y-2">
                            <span className="text-lightGray">Created on</span>
                            <span className="text-lightGray font-semibold text-[18px] md:text-[20px]">{project.endDate?.split("T")[0]}</span>
                        </div>
                    </div>
                    <div className="w-[100%] lg:col-span-3 mx-auto">
                        <p className="font-semibold text-[18px] md:text-[20px] text-lightGray">
                            {project.description}
                        </p>
                        
                    </div>
                </div>
                <div className="w-[80%] mx-auto md:ml-auto my-10">
                    <span className="text-[24px] font-bold ">Project attachments</span>
                    <div className="grid md:grid-cols-2 md:gap-5 mt-5">
                        {
                            (!project.attachments || project?.attachments?.length === 0) && (
                                <div className="flex justify-center items-center">
                                    <span className="text-nowrap">No attachment Available</span>
                                </div>
                            )
                        }
                        {
                            project.attachments?.map((file:any,index)=>(
                                <a key={file?._id} href={file} className="py-3 px-5 flex items-center justify-between bg-white border-[1px] rounded-md border-black ">
                                    <span>Download File {index+1}</span>
                                    <Download className="w-5 h-5" />
                                </a>
                            ))
                        }
                        
                    </div>
                </div>
            </div>
            {
                (!user.email && !user.phone_number) && (
                    <div className="w-full ml-[15%] px-5 mb-5 py-2 md:w-[90%] mx-auto md:ml-auto lg:col-span-1 max-h-fit shadow-md lg:p-5 bg-white rounded-2xl">
                        <div className="mt-5 w-[98%] mb-5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xl capitalize">{project.actualBalance || 0}$ raised</span>
                                <span className="text-xl">{Math.round(Math.min(((project.actualBalance || 0) / project.targetAmount) * 100, 100))}%</span>
                            </div>
                            <div className="w-full">
                                <ProgressBar 
                                    value={project.actualBalance || 0}
                                    max={project.targetAmount}
                                />
                            </div>
                        </div>
                        <span className="text-xl text-black">{Math.round(remainingDays.days)} days to go</span>
                        <div className="w-3/4 mx-auto mt-5 flex flex-col space-y-4">
                            <Button
                                onClick={()=>setDonate(true)}
                                className="bg-darkBlue flex items-center space-x-5 font-semibold text-md md:text-2xl text-white h-14 w-full  rounded-[100px]"
                            >
                                <FaGift  />
                                Donate
                            </Button>
                            <Button
                                className="bg-white text-black flex items-center space-x-5 text-md md:text-2xl  font-semibold h-14 w-full  rounded-[100px]"
                            >
                                <FaShareAlt  size={56}/>
                                Share
                            </Button>
                        </div>
                    </div>
                )
            }
            {
                (user.email || user.phone_number) && (
                    <div className="w-full ml-[15%] px-5 mb-5 py-2 md:w-[90%] mx-auto md:ml-auto lg:col-span-1 max-h-fit shadow-md lg:p-5 bg-white rounded-2xl">
                        <div className="mt-5 w-[98%] mb-5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xl capitalize">{project.actualBalance || 0}$ raised</span>
                                <span className="text-xl">{Math.round(Math.min(((project.actualBalance || 0) / project.targetAmount) * 100, 100))}%</span>
                            </div>
                            <div className="w-full">
                                <ProgressBar 
                                    value={project.actualBalance || 0}
                                    max={project.targetAmount}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2 mb-5">
                            <div className="flex items-center space-x-1">
                                <span>Cashed Out:</span>
                                <span className="text-lightGray font-semibold">1000 $</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span>Available Balance:</span>
                                <span className="text-lightBlue font-semibold">{project.actualBalance - 1000}$</span>
                            </div>
                        </div>
                        <span className="text-xl text-black">{Math.round(remainingDays.days)} days to go</span>
                        <div className="w-3/4 mx-auto mt-5 flex flex-col space-y-4">
                            <Button
                                onClick={()=>setCashout(true)}
                                className="bg-darkBlue hover:text-white flex items-center space-x-5 font-semibold text-md md:text-2xl text-white h-14 w-full  rounded-[100px]"
                            >
                                <FaGift  />
                                Cashout
                            </Button>
                            <Button
                                onClick={()=>navigate(`/projects/${project._id}/edit`)}
                                className="bg-white hover:text-white text-black flex items-center space-x-5 text-md md:text-2xl  font-semibold h-14 w-full  rounded-[100px]"
                            >
                                <CiEdit  size={56}/>
                                Edit
                            </Button>
                            <Button
                                className="bg-white hover:text-white text-black flex items-center space-x-5 text-md md:text-2xl  font-semibold h-14 w-full  rounded-[100px]"
                            >
                                <FaShareAlt  size={56}/>
                                Share
                            </Button>
                        </div>
                    </div>
                )
            }
            
        </div>
    </div>
  )
}

export default SingleProject