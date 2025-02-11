import { useAppSelector } from "@/redux/hooks"
import { initialState, selectProject, setProject } from "@/redux/slices/projectSlice"
import { Button } from "./ui/button"
import projectVideo from '../assets/project-video.jpg'
import projectImage2 from '../assets/02.jpg'
import projectProfile from '../assets/project-profile.png'
import { files } from "@/constants/dummydata"
import FileAttachment from "./FileAttachment"
import ProgressBar from "./ProgressBar"
import { FaGift,FaShareAlt } from "react-icons/fa"
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Donate from "./Donate"
import { selectUser } from "@/redux/slices/userSlice"
import Cashout from "./Cashout"

function SingleProject() {
    const [donate,setDonate]=useState(false)
    const [cashout,setCashout]=useState(false)
    const project=useAppSelector(selectProject)
    const navigate=useNavigate()
    const user=useAppSelector(selectUser)

    useEffect(()=>{
        window.scrollTo(0,0)
    },[])
    
    //console.log("project selected",project)
  return (
    <div className="relative">
        {
            donate &&
            <div className="md:w-[80%] md:left-[10%] lg:w-[500px] fixed md:top-[20%] lg:top-[10%] z-10 lg:left-[40%]">
                <Donate onClose={()=>setDonate(false)} />
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
                        src={project.image}
                        className="w-full h-full object-cover"
                        alt={project.title}
                    />
                    <Button
                        onClick={()=>{
                            setProject(initialState.project)
                            navigate('/projects')
                        }}
                        className="text-black h-12 text-xl w-28 top-[5%] left-[2%] rounded-[100px] absolute z-10 bg-white hover:bg-lightGreen"
                    >
                        Back
                    </Button>
                    <div className="flex flex-col space-y-5 absolute bottom-[10%] z-10 left-[5%]">
                        <div className="bg-[#D6FFE7] py-1 px-4 rounded-2xl max-w-fit">
                            <span className="">{project.title}</span>
                        </div>
                        <span className="text-[24px] font-semibold text-white">{project.desc}</span>
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
                            <span className="text-lightGray font-semibold text-[18px] md:text-[20px]">22 Septembre 2024</span>
                        </div>
                        <div className="my-5 flex flex-col space-y-2">
                            <span className="text-lightGray">Created on</span>
                            <span className="text-lightGray font-semibold text-[18px] md:text-[20px]">22 Septembre 2024</span>
                        </div>
                    </div>
                    <div className="w-[90%] lg:col-span-3 mx-auto flex text-justify flex-col items-center space-y-5">
                        <p className="font-semibold text-[18px] md:text-[20px] text-lightGray">
                            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. 
                            Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. 
                            Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, 
                            aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
                        </p>
                        <p className="font-semibold text-[18px] md:text-[20px] text-lightGray">
                            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. 
                            Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. 
                            Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, 
                            aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
                        </p>
                        <p className="font-semibold text-[18px] md:text-[20px] text-lightGray">
                            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. 
                            Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. 
                            Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, 
                            aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
                        </p>
                        <p className="font-semibold text-[18px] md:text-[20px] text-lightGray">
                            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. 
                            Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. 
                            Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, 
                            aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
                        </p>
                    </div>
                </div>
                <div className="w-[80%] mx-auto md:ml-auto my-10">
                    <span className="text-[24px] font-bold ">Project attachments</span>
                    <div className="grid md:grid-cols-2 md:gap-5 mt-5">
                        {
                            (!project.projectAttachement || project?.projectAttachement?.length === 0) && (
                                <div className="flex justify-center items-center">
                                    <span className="text-nowrap">No attachment Available</span>
                                </div>
                            )
                        }
                        {
                            !user.email && files.map((file,index)=>(
                                <FileAttachment key={index} file={file} />
                            ))
                        }
                        {
                           user.email && project?.projectAttachement?.map((file:any,index:any)=>(
                                <FileAttachment key={index} file={file} />
                            ))
                        }
                    </div>
                </div>
            </div>
            {
                !user.email && (
                    <div className="w-full ml-[15%] mb-5 py-2 md:w-[90%] mx-auto md:ml-auto lg:col-span-1 max-h-fit shadow-md lg:p-5 bg-white rounded-2xl">
                        <div className="mt-5 w-[98%] mb-5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xl capitalize">{project.amount}$ raised</span>
                                <span className="text-xl">{Math.round(Math.min((project.amount / project.limit) * 100, 100))}%</span>
                            </div>
                            <div className="w-full">
                                <ProgressBar 
                                    value={project.amount}
                                    max={project.limit}
                                />
                            </div>
                        </div>
                        <span className="text-xl text-black">29 days to go</span>
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
                user.email && (
                    <div className="w-full ml-[15%] mb-5 py-2 md:w-[90%] mx-auto md:ml-auto lg:col-span-1 max-h-fit shadow-md lg:p-5 bg-white rounded-2xl">
                        <div className="mt-5 w-[98%] mb-5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xl capitalize">{project.amount}$ raised</span>
                                <span className="text-xl">{Math.round(Math.min((project.amount / project.limit) * 100, 100))}%</span>
                            </div>
                            <div className="w-full">
                                <ProgressBar 
                                    value={project.amount}
                                    max={project.limit}
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
                                <span className="text-lightBlue font-semibold">{project.amount - 1000}$</span>
                            </div>
                        </div>
                        <span className="text-xl text-black">29 days to go</span>
                        <div className="w-3/4 mx-auto mt-5 flex flex-col space-y-4">
                            <Button
                                onClick={()=>setCashout(true)}
                                className="bg-darkBlue hover:text-white flex items-center space-x-5 font-semibold text-md md:text-2xl text-white h-14 w-full  rounded-[100px]"
                            >
                                <FaGift  />
                                Cashout
                            </Button>
                            <Button
                                onClick={()=>navigate(`/projects/${project.id}/edit`)}
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