import { useState } from 'react'
import projectBg from '../assets/projectBg.png'
import { Button } from './ui/button'
import { GiSettingsKnobs } from "react-icons/gi";
import { CiSearch } from "react-icons/ci";
import { Input } from './ui/input';
import { projects } from '@/constants/dummydata';
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
import { setProject } from '@/redux/slices/projectSlice';
import { selectUser } from '@/redux/slices/userSlice';
import { MdMenu } from 'react-icons/md';



function ProjectPage() {
  const [viewMode,setViewMode]=useState<'grid'|'map'>('grid')
  const [itemsPerPage,setItemsPerPage]=useState(9)
  const [openFilter,setOpenFilter]=useState(false)
  const [viewProjectSecurity,setViewProjectSecurity]=useState(false)
  const [selectedProject,setSelectedProject]=useState<any>(null)
  const [filter,setFilter]=useState({
    category:[],
    date:"",
    status:"",
    regions:[],
    creatorGenre:""
  })
  const user=useAppSelector(selectUser)

  const [currentPage, setCurrentPage] = useState(1);

  const currentData = user.email ? user.projects?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ):
    projects?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate=useNavigate()
  const dispatch=useAppDispatch()


  const handleClick = (page:any) => {
    setCurrentPage(page);
  };

  //console.log("selected project",selectedProject)
  //console.log("current data:",currentData)
  return (
    <div className=''>
        {
          (viewProjectSecurity && !user.email) &&
          <div className='fixed bg-white rounded-xl top-[20%] z-10 md:left-[10%] md:w-[80%] lg:left-[35%] lg:w-[30%]'>
            <ViewProjectChecker 
              onClose={()=>setViewProjectSecurity(false)} 
              next={()=>{
                setViewProjectSecurity(false)
                navigate(`/projects/${selectedProject.id}`)
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
              <div className='w-[90%] hidden shadow-md h-[100px] rounded-lg md:flex justify-between items-center p-10 bg-white absolute -bottom-10 left-[5%]'>
                <div className='flex md:w-[30%] space-x-5'>
                  <div onClick={()=>setViewMode('grid')} className={viewMode === 'grid'?'flex flex-col cursor-not-allowed space-y-2':'flex cursor-pointer'}>
                    <span className={viewMode ==='grid'?"text-black font-semibold":"text-lightGray font-semibold"}>Grid view</span>
                    {
                      viewMode ==='grid' &&
                      <div className='w-[30px] h-1 bg-black'></div>
                    }
                    
                  </div>
                  <div onClick={()=>setViewMode('map')} className={viewMode === 'map'?'flex cursor-not-allowed flex-col space-y-2':'flex  cursor-pointer'}>
                    <span className={viewMode ==='map'?"text-black font-semibold":"text-lightGray font-semibold"}>Grid view</span>
                    {
                      viewMode ==='map' &&
                      <div className='w-[30px] h-1 bg-black'></div>
                    }
                    
                  </div>
                </div>
                
                <div className='flex  items-center md:space-x-4 lg:space-x-8'>
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
                currentData.length > 0 &&  currentData.slice(0,9).map((project:any)=>(
                  <PopularProjectCard 
                    onClick={()=>{
                      setSelectedProject(project)
                      //@ts-ignore
                      dispatch(setProject(project))
                      if(selectedProject.id){
                        user.email && navigate(`/projects/${selectedProject.id}`)
                      }
                      
                      !user.email && setViewProjectSecurity(true)
                      
                    }}
                    key={project.id}
                    image={project.image}
                    title={project.title}
                    desc={project.desc}
                    type={project.type}
                    amount={project.amount}
                    limit={project.limit}
                    profile={project.profile}

                  />
                ))
              }
          </div>
          {/* Pagination */}
          {/* //TODO: Only display user projects when a user is logged in  */}
          {
            !user.email && (
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
                      Array.from({length:Math.ceil(projects.length / itemsPerPage)},(_,i)=>(
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
                      disabled={currentPage === Math.ceil(projects.length / itemsPerPage)}
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
          <div className='mt-24 p-[5%]'>
            {/* <DRCProvinces /> */}
          </div>
        }
        </div>
      
    </div>
  )
}

export default ProjectPage