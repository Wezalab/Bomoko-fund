import { useEffect, useState } from 'react'
import projectBg from '../assets/projectBg.png'
import { Button } from './ui/button'
import { GiSettingsKnobs } from "react-icons/gi";
import { CiSearch } from "react-icons/ci";
import { Input } from './ui/input';
import PopularProjectCard from './PopularProjectCard';
import { IoChevronBackSharp, IoChevronForward, IoLocation } from "react-icons/io5";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu"
import FilterModal from './FilterModal';
import ViewProjectChecker from './ViewProjectchecker';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {  selectProjects, setProject, setProjects } from '@/redux/slices/projectSlice';
import { selectUser } from '@/redux/slices/userSlice';
import { MdMenu } from 'react-icons/md';
import MapComponent from './MapComponent';
import { PlusCircle } from 'lucide-react';
import { useGetAllProjectsQuery, useUsersProjectsQuery } from '@/redux/services/projectServices';
import SignIn from './SignIn';
import Donate from './Donate';
import Cashout from './Cashout';



function ProjectPage() {
  
  const [viewMode,setViewMode]=useState<'grid'|'map'|'other'>('grid')
  const [itemsPerPage,setItemsPerPage]=useState(9)
  const [openFilter,setOpenFilter]=useState(false)
  const [viewProjectSecurity,setViewProjectSecurity]=useState(false)
  const [selectedProject,setSelectedProject]=useState<any>(null)
  const [donate,setDonate]=useState(false)
  const [cashout,setCashout]=useState(false)
  const [login,setLogin]=useState(false)
  
  const user=useAppSelector(selectUser)
  const allProjects=useAppSelector(selectProjects)


  const [currentPage, setCurrentPage] = useState(1);

  const {
    data:userProjectsData,
    error:userProjectError,
    isSuccess:userProjectIsSuccess,
    isError:userProjectIsError,
    isLoading:userProjectIsLoading
  }=useUsersProjectsQuery(user?._id)


  const currentData = allProjects?.filter((item:any)=>item.medias.length > 0)?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const currentDataPersonal = (user?.email || user?.phone_number) && userProjectsData?.filter((item:any)=>item.medias.length > 0)?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate=useNavigate()
  const dispatch=useAppDispatch()

  const {
    data:AllProjects,
    isSuccess:AllProjectsIsSuccess,
    isLoading:AllProjectsIsLoading,
    isError:AllProjectsIsError,
    error:AllProjectsError
  }=useGetAllProjectsQuery(undefined)

  

  const handleClick = (page:any) => {
    setCurrentPage(page);
  };

  useEffect(()=>{
    if(AllProjectsIsSuccess && AllProjects){
      //console.log("all projects",AllProjects)
      dispatch(setProjects(AllProjects.filter((item:any)=>!["PENDING","REJECTED"].includes(item.status))))
    }
    if(AllProjectsIsError){
      console.log("Error while getting all projects",AllProjectsError)
    }
  },[AllProjectsIsSuccess,AllProjectsIsError])

  useEffect(()=>{
    if(userProjectIsSuccess && userProjectsData){
      //console.log("user projects data:",userProjectsData)
    }
    if(userProjectIsError){
      console.log("error while getting user projects",userProjectError)
    }
  },[userProjectIsError,userProjectIsSuccess])

  //console.log("selected project",selectedProject)
  //console.log("current data:",currentData)
  //console.log("all projects data",currentData)
  return (
    <div className='relative'>
        {
            login && 
            <div className="md:w-[80%] md:left-[10%] lg:w-[500px] absolute md:top-[20%] lg:top-[15%] z-20 lg:left-[40%]">
                <SignIn onClose={()=>setLogin(false)} />
            </div>
        }
        {
            donate &&
            <div className="md:w-[80%] md:left-[10%] lg:w-[500px] absolute md:top-[20%] lg:top-[15%] z-20 lg:left-[40%]">
                <Donate projectId={selectedProject?._id} onClose={()=>setDonate(false)} />
            </div>
        }
        {
            cashout &&
            <div className="md:w-[80%] md:left-[10%] lg:w-[500px] absolute md:top-[20%] lg:top-[15%] z-20 lg:left-[40%]">
                <Cashout projectId={selectedProject?._id} onClose={()=>setCashout(false)} />
                
            </div>
        }
        {
          (viewProjectSecurity && (!user.email && !user.phone_number)) &&
          <div className='fixed bg-white rounded-xl top-[20%] z-10 md:left-[10%] md:w-[80%] lg:left-[35%] lg:w-[30%]'>
            <ViewProjectChecker 
              onClose={()=>setViewProjectSecurity(false)} 
              next={()=>{
                setViewProjectSecurity(false)
                navigate(`/projects/${selectedProject?._id}`)
              }}
            />
          </div> 
          
        }
        {
          openFilter && 
          <div className='absolute bg-white rounded-xl w-[96%] left-[2%] top-10 z-50 md:top-[12%] md:z-10 md:left-[10%] lg:left-[35%] md:w-[80%] lg:w-[30%]'>
            <FilterModal onClose={()=>setOpenFilter(false)} />
          </div>
        }
        <div className={(openFilter || viewProjectSecurity) ? 'relative blur-md':"relative"}>
          <div className="w-full h-[20vh] relative">
              <img 
                src={projectBg}
                className='w-full h-full object-cover'
                alt="project-bg"
              />
              {/* small devices filter and search */}
              <div className='flex md:hidden flex-col  mt-5 px-5'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <MdMenu color='blue' size={18} />
                    <IoLocation size={16}/>
                  </div>
                  <GiSettingsKnobs onClick={()=>setOpenFilter(true)} className='' size={18} />
                </div>
                <div className='w-full relative mt-2'>
                  <CiSearch className='absolute top-2 left-2' />
                  <Input 
                    placeholder='Search Project'
                    className='h-8 border-none rounded-xl text-sm bg-gray-200 indent-8'
                  />
                </div>
              </div>
              <div className='w-[95%] lg:w-[90%] hidden shadow-md h-[100px] rounded-lg md:flex justify-between items-center p-10 bg-white absolute -bottom-10 left-[2%] lg:left-[5%]'>
                <div className='flex md:w-[40%] space-x-5'>
                  <div onClick={()=>setViewMode('grid')} className={viewMode === 'grid'?'flex flex-col cursor-not-allowed space-y-2':'flex cursor-pointer'}>
                    <span className={viewMode ==='grid'?"text-black md:text-sm text-nowrap lg:text-md font-semibold":"text-lightGray md:text-sm lg:text-md text-nowrap"}>Personal projects</span>
                    {
                      viewMode ==='grid' &&
                      <div className='w-[30px] h-1 bg-black'></div>
                    }
                    
                  </div>
                  <div onClick={()=>setViewMode('other')} className={viewMode === 'other'?'flex flex-col cursor-not-allowed space-y-2':'flex cursor-pointer'}>
                    <span className={viewMode ==='other'?"text-black md:text-sm lg:text-md text-nowrap font-semibold":"text-lightGray lg:text-md md:text-sm text-nowrap "}>Projects</span>
                    {
                      viewMode ==='other' &&
                      <div className='w-[30px] h-1 bg-black'></div>
                    }
                    
                  </div>
                  <div onClick={()=>setViewMode('map')} className={viewMode === 'map'?'flex cursor-not-allowed flex-col space-y-2':'flex  cursor-pointer'}>
                    <span className={viewMode ==='map'?"text-black font-semibold md:text-sm lg:text-md text-nowrap":"text-lightGray md:text-sm text-nowrap lg:text-md"}>Map view</span>
                    {
                      viewMode ==='map' &&
                      <div className='w-[30px] h-1 bg-black'></div>
                    }
                    
                  </div>
                </div>
                
                <div className='flex  items-center md:space-x-4 lg:space-x-8'>
                    {
                      (user?.email || user?.phone_number) && (
                        <Button
                          onClick={()=>navigate('/projects/create')}
                          className='flex items-center space-x-3 md:h-[35px] lg:h-[50px] bg-lightBlue hover:bg-blue-300 text-white rounded-[100px] max-w-fit'
                        >
                          <PlusCircle />
                          Create
                        </Button>
                      )
                    }
                    
                    <Button
                      onClick={()=>setOpenFilter(true)}
                      className='bg-grayColor md:w-[100px] lg:w-[150px] md:h-[35px] lg:h-[50px] text-black rounded-[100px] hover:text-white hover:bg-lightBlue flex items-center space-x-5'
                    >
                      <GiSettingsKnobs className='' size={24} />
                      Filter
                    </Button>
                    <div className='w-[430px] hidden md:hidden bg-grayColor rounded-[100px] lg:flex items-center space-x-5 px-2 h-[50px]'>
                      <div className='relative w-[300px]'>
                        <Input 
                          className='w-full py-4 indent-10 rounded-[100px]'
                          placeholder='Search'
                        />
                        <CiSearch className='text-lightGray absolute top-2 left-3' size={20} />
                      </div>
                      <Button
                        className='w-[100px] h-[42px] rounded-[100px] bg-lightBlue text-white hover:bg-blue-200'
                      >
                        Search
                      </Button>
                    </div>
                    <Button
                      className='md:w-[80px] lg:hidden md:h-[35px] lg:w-[100px] lg:h-[42px] rounded-[100px] bg-lightBlue text-white hover:bg-blue-200'
                    >
                      Search
                    </Button>
                </div>
              </div>
          </div>
          { viewMode ==='grid' &&
          <>
            {/* project session */}
          <div className='mt-24 mb-10 px-[5%] md:grid-cols-2 grid lg:grid-cols-3 gap-x-8 gap-y-5'>
              
              {
                currentDataPersonal?.length > 0 &&  currentDataPersonal?.slice(0,9).map((project:any)=>(
                  <PopularProjectCard 
                    onClick={()=>{
                      setSelectedProject(project)
                      //@ts-ignore
                      dispatch(setProject(project))
                      if(project?._id){
                        navigate(`/projects/${project._id}`)
                      }
                      
                      //(!user.email&& !user.phone_number) && setViewProjectSecurity(true)
                      
                    }}
                    action={()=>{
                      setSelectedProject(project)
                      //@ts-ignore
                      dispatch(setProject(project))
                      setCashout(true)
                    }}
                    actionName='Cashout'
                    key={project?._id}
                    image={project?.medias[0]}
                    title={project?.name}
                    desc={project?.description}
                    type={project?.type.name}
                    amount={project?.actualBalance}
                    limit={project?.targetAmount}

                  />
                ))
              }
              
          </div>
              {
                userProjectsData?.length === 0 && (
                  <div className='flex items-center justify-center text-center w-full mb-10'>
                    <span className='text-lightGray font-bold text-xl'>No Personal Projects</span>
                  </div>
                )
              }
              {
                viewMode ==="grid" && !userProjectsData  && (
                  <div className='flex items-center justify-center text-center w-full mb-10'>
                    <span className='text-lightGray font-bold text-xl'>No Personal Projects</span>
                  </div>
                )
              }
              {
                userProjectIsLoading && (
                  <div className='flex items-center justify-center text-center w-full mb-10'>
                    <span className='text-blue-600 font-bold text-xl'>Getting all user's Projects...</span>
                  </div>
                )
              }

          {/* Pagination */}
          {/* //TODO: Only display user projects when a user is logged in  */}
          {
            (user?.email || user?.phone_number) && userProjectsData?.length > 0 && (
              <div className='w-[90%] mx-auto flex items-center justify-center space-x-10 my-5'>
                  <Button
                    disabled={currentPage === 1}
                    onClick={()=>{
                      handleClick(currentPage-1)
                      window.scrollTo(0,0)
                    }}
                    className=' bg-transparent text-black hover:bg-lightBlue hover:text-white'
                  >
                    <IoChevronBackSharp />
                  </Button>

                  <div className='flex items-center space-x-4'>
                    {
                      Array.from({length:Math.ceil(userProjectsData?.length / itemsPerPage)},(_,i)=>(
                        <span 
                          key={i} 
                          onClick={()=>{
                            handleClick(i+1)
                            window.scrollTo(0,0)
                          }} 
                          className={i+1 === currentPage ?'text-lightBlue cursor-pointer font-bold underline':'cursor-pointer'}
                        >
                          {i+1}
                        </span>
                      ))
                    }
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Button
                      disabled={currentPage === Math.ceil(userProjectsData?.length / itemsPerPage)}
                      onClick={()=>{
                        handleClick(currentPage+1)
                        window.scrollTo(0,0)
                      }}
                      className=' bg-transparent text-black hover:bg-lightBlue hover:text-white'
                    >
                      <IoChevronForward />
                    </Button>
                    <NavigationMenu className='z-0'>
                      <NavigationMenuList>
                          <NavigationMenuItem>
                              <NavigationMenuTrigger className='font-bold'>{itemsPerPage}/page</NavigationMenuTrigger>
                              <NavigationMenuContent >
                                  <ul className="grid w-[100px] gap-3 p-4">
                                      <li 
                                        onClick={()=>{
                                          setItemsPerPage(9)
                                          window.scrollTo(0,0)
                                          }} 
                                        className='hover:text-lightBlue cursor-pointer'
                                      >
                                        9
                                      </li>
                                      <li 
                                        onClick={()=>{
                                          setItemsPerPage(12)
                                          window.scrollTo(0,0)
                                        }} 
                                        className='hover:text-lightBlue cursor-pointer'
                                      >
                                        12
                                      </li>
                                  </ul>
                              </NavigationMenuContent>
                          </NavigationMenuItem>
                      </NavigationMenuList>
                  </NavigationMenu>
                  </div>
                  
              </div>
            )
          }
          
          </>
        }
        { viewMode ==='other' &&
          <>
            {/* project session */}
          <div className='mt-24 mb-10 px-[5%] md:grid-cols-2 grid lg:grid-cols-3 gap-x-8 gap-y-5'>
              
              {
                currentData?.length > 0 &&  currentData?.slice(0,9).map((project:any,index)=>(
                  <PopularProjectCard 
                    key={project._id}
                    onClick={()=>{
                      setSelectedProject(project)
                      //@ts-ignore
                      dispatch(setProject(project))
                      if(project?._id){
                        navigate(`/projects/${project._id}`)
                      }
                      
                      //(!user.email&& !user.phone_number) && setViewProjectSecurity(true)
                      
                    }}
                    actionName='Donate'
                    action={()=>{
                      setSelectedProject(project)
                      //@ts-ignore
                      dispatch(setProject(project))
                      if((user?.email || user?.phone_number && !userProjectsData?.map((item:any)=>item._id).includes(project._id))){
                        setDonate(true)
                        return
                    }
                    setLogin(true)
                    }}
                    image={project?.medias[0]}
                    title={project?.name}
                    desc={project?.description}
                    type={project?.type.name}
                    amount={project?.actualBalance}
                    limit={project?.targetAmount}

                  />
                ))
              }
              
          </div>
              {
                !currentData && (
                  <div className='flex items-center justify-center text-center w-full mb-10'>
                    <span className='text-lightGray font-bold text-xl'>No Projects Available</span>
                  </div>
                )
              }
              {
                AllProjectsIsLoading && (
                  <div className='flex items-center justify-center text-center w-full mb-10'>
                    <span className='text-blue-600 font-bold text-xl'>Getting all Projects...</span>
                  </div>
                )
              }
              

          {/* Pagination */}
          {/* //TODO: Only display user projects when a user is logged in  */}
          {
            (
              <div className='w-[90%] mx-auto flex items-center justify-center space-x-10 my-5'>
                  <Button
                    disabled={currentPage === 1}
                    onClick={()=>{
                      handleClick(currentPage-1)
                      window.scrollTo(0,0)
                    }}
                    className=' bg-transparent text-black hover:bg-lightBlue hover:text-white'
                  >
                    <IoChevronBackSharp />
                  </Button>

                  <div className='flex items-center space-x-4'>
                    {
                      Array.from({length:Math.ceil(allProjects?.length / itemsPerPage)},(_,i)=>(
                        <span 
                          key={i} 
                          onClick={()=>{
                            handleClick(i+1)
                            window.scrollTo(0,0)
                          }} 
                          className={i+1 === currentPage ?'text-lightBlue cursor-pointer font-bold underline':'cursor-pointer'}
                        >
                          {i+1}
                        </span>
                      ))
                    }
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Button
                      disabled={currentPage === Math.ceil(allProjects?.length / itemsPerPage)}
                      onClick={()=>{
                        handleClick(currentPage+1)
                        window.scrollTo(0,0)
                      }}
                      className=' bg-transparent text-black hover:bg-lightBlue hover:text-white'
                    >
                      <IoChevronForward />
                    </Button>
                    <NavigationMenu>
                      <NavigationMenuList>
                          <NavigationMenuItem>
                              <NavigationMenuTrigger className='font-bold'>{itemsPerPage}/page</NavigationMenuTrigger>
                              <NavigationMenuContent >
                                  <ul className="grid w-[100px] gap-3 p-4">
                                      <li 
                                        onClick={()=>{
                                          setItemsPerPage(9)
                                          window.scrollTo(0,0)
                                          }} 
                                        className='hover:text-lightBlue cursor-pointer'
                                      >
                                        9
                                      </li>
                                      <li 
                                        onClick={()=>{
                                          setItemsPerPage(12)
                                          window.scrollTo(0,0)
                                        }} 
                                        className='hover:text-lightBlue cursor-pointer'
                                      >
                                        12
                                      </li>
                                  </ul>
                              </NavigationMenuContent>
                          </NavigationMenuItem>
                      </NavigationMenuList>
                  </NavigationMenu>
                  </div>
              </div>
            )
          }
          
          </>
        }
        {
          viewMode ==='map' &&
          <div className='mt-10 p-[5%]'>
            <MapComponent />
          </div>
        }
        </div>
      
    </div>
  )
}

export default ProjectPage