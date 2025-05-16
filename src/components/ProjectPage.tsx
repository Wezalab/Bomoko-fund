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
import { useFilterProjectsMutation, useGetAllProjectsQuery, useUsersProjectsQuery } from '@/redux/services/projectServices';
import SignIn from './SignIn';
import Donate from './Donate';
import Cashout from './Cashout';
import { Sheet, SheetContent, SheetOverlay } from '@/components/ui/sheet'


interface FilterDatasProps{
  category:string[]
  date:string 
  status:string 
  region:string[]
  authorGender:string
}


function ProjectPage() {
  
  const [viewMode,setViewMode]=useState<'grid'|'map'|'other'>('other')
  const [itemsPerPage,setItemsPerPage]=useState(9)
  const [openFilter,setOpenFilter]=useState(false)
  const [filterProjects,setFilterProject]=useState(false)
  const [filterDatas,setFilterDatas]=useState<FilterDatasProps>({
    category:[],
    date:"",
    status:"",
    region:[],
    authorGender:""
  })
  const [viewProjectSecurity,setViewProjectSecurity]=useState(false)
  const [selectedProject,setSelectedProject]=useState<any>(null)
  const [donate,setDonate]=useState(false)
  const [cashout,setCashout]=useState(false)
  const [login,setLogin]=useState(false)
  const [search,setSearch]=useState("")


  const user=useAppSelector(selectUser)
  const allProjects=useAppSelector(selectProjects)


  const [currentPage, setCurrentPage] = useState(1);

  const {
    data:userProjectsData,
    error:userProjectError,
    isSuccess:userProjectIsSuccess,
    isError:userProjectIsError,
    isLoading:userProjectIsLoading
  }=useUsersProjectsQuery(user?._id,{skip:!user._id})

  const [
    FilterProjects,
    {
      data:filterProjectsData,
      error:filterProjectsError,
      isSuccess:filterProjectsIsSuccess,
      isError:filterProjectsIsError,
      isLoading:filterProjectIsLoading
    }
  ]=useFilterProjectsMutation()


  useEffect(()=>{
    if(filterProjectsData && filterProjectsIsSuccess){
      console.log("filter data success",filterProjectsData)
    }
    if(filterProjectsIsError){
      console.log("filter data is error",filterProjectsError)
    }
  },[filterProjectsIsSuccess,filterProjectsIsError])


  const applyFilters = async () => {
    try {
      const response = await FilterProjects(filterDatas).unwrap();
      console.log("Filtered projects:", response);
    } catch (err) {
      console.error("Error filtering projects:", err);
    }
  };

  const currentData =search ? allProjects?.filter((item:any)=>item.name.toLowerCase().startsWith(search.toLocaleLowerCase()))?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) :filterProjects ? filterProjectsData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) : allProjects?.filter((item:any)=>item.medias.length > 0)?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const currentDataPersonal =search ? (user?.email || user?.phone_number) && userProjectsData?.filter((item:any)=>item.name.toLocaleLowerCase().startsWith(search.toLocaleLowerCase()))?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ):(user?.email || user?.phone_number) && userProjectsData?.filter((item:any)=>item.medias.length > 0)?.slice(
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

  useEffect(()=>{
    applyFilters()
  },[filterDatas])

  //console.log("selected project",selectedProject)
  //console.log("current data:",currentData)
  //console.log("all projects data",currentData)

  //console.log("filtered data-->",filterDatas)
  return (
    <div className='relative min-h-screen bg-gray-50'>
        {/* Login Modal */}
        <Sheet open={login} onOpenChange={setLogin}>
          <SheetOverlay className="bg-black/50" />
          <SheetContent side="top" className="w-[90%] md:w-3/4 lg:w-[40%] h-auto p-0 border-none rounded-b-2xl mx-auto">
            <SignIn onClose={() => setLogin(false)} />
          </SheetContent>
        </Sheet>

        {/* Donate Modal */}
        <Sheet open={donate} onOpenChange={setDonate}>
          <SheetOverlay className="bg-black/50" />
          <SheetContent side="top" className="w-[90%] md:w-3/4 lg:w-[40%] h-auto p-0 border-none rounded-b-2xl mx-auto">
            <Donate projectId={selectedProject?._id} onClose={() => setDonate(false)} />
          </SheetContent>
        </Sheet>

        {/* Cashout Modal */}
        <Sheet open={cashout} onOpenChange={setCashout}>
          <SheetOverlay className="bg-black/50" />
          <SheetContent side="top" className="w-[90%] md:w-3/4 lg:w-[40%] h-auto p-0 border-none rounded-b-2xl mx-auto">
            <Cashout projectId={selectedProject?._id} onClose={() => setCashout(false)} />
          </SheetContent>
        </Sheet>

        {/* View Project Security Modal */}
        <Sheet open={viewProjectSecurity && (!user.email && !user.phone_number)} onOpenChange={setViewProjectSecurity}>
          <SheetOverlay className="bg-black/50" />
          <SheetContent side="top" className="w-[90%] md:w-3/4 lg:w-[40%] h-auto p-0 border-none rounded-b-2xl mx-auto">
            <ViewProjectChecker 
              onClose={() => setViewProjectSecurity(false)} 
              next={() => {
                setViewProjectSecurity(false)
                navigate(`/projects/${selectedProject?._id}`)
              }}
            />
          </SheetContent>
        </Sheet>

        {/* Filter Modal */}
        <Sheet open={openFilter} onOpenChange={setOpenFilter}>
          <SheetOverlay className="bg-black/50" />
          <SheetContent side="top" className="w-[90%] md:w-3/4 lg:w-[40%] h-auto p-0 border-none rounded-b-2xl mx-auto">
            <FilterModal 
              setFilterProject={() => setFilterProject(true)} 
              setFilterData={setFilterDatas} 
              onClose={() => setOpenFilter(false)} 
            />
          </SheetContent>
        </Sheet>

        <div className={(openFilter || viewProjectSecurity || login || donate || cashout) ? 'relative blur-sm' : "relative"}>
          {/* Hero Banner Section */}
          <div className="w-full relative">
              <div className="h-[30vh] md:h-[40vh] relative overflow-hidden rounded-b-3xl">
                <img 
                  src={projectBg}
                  className='w-full h-full object-cover transform scale-110 hover:scale-105 transition-transform duration-700'
                  alt="Projects Banner"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent flex flex-col justify-center items-center">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-center">Discover Projects</h1>
                  <p className="text-white text-lg md:text-xl max-w-xl text-center px-4">Find and support amazing initiatives that make a difference</p>
                </div>
              </div>
              
              {/* Mobile Filter & Search */}
              <div className='md:hidden px-4 py-4 mt-2 bg-white rounded-xl mx-3 shadow-md -mt-6 relative z-10'>
                <div className='flex items-center justify-between mb-3'>
                  <h2 className="font-semibold text-gray-800">Projects</h2>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={()=>setOpenFilter(true)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <GiSettingsKnobs size={16} />
                      <span>Filter</span>
                    </Button>
                  </div>
                </div>
                <div className='w-full relative'>
                  <div className="relative">
                    <CiSearch className='absolute top-3 left-3 text-gray-400' size={18} />
                    <Input 
                      onChange={(e)=>setSearch(e.target.value)}
                      placeholder='Search projects...'
                      className='h-10 pl-10 pr-4 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-lightBlue'
                    />
                  </div>
                </div>

                {/* Mobile View Tabs */}
                <div className="mt-4 flex gap-4 border-b border-gray-200">
                  <button 
                    onClick={()=>setViewMode('other')} 
                    className={`pb-2 ${viewMode === 'other' ? 'border-b-2 border-lightBlue text-lightBlue font-medium' : 'text-gray-500'}`}
                  >
                    All Projects
                  </button>
                  <button 
                    onClick={()=>setViewMode('map')} 
                    className={`pb-2 ${viewMode === 'map' ? 'border-b-2 border-lightBlue text-lightBlue font-medium' : 'text-gray-500'}`}
                  >
                    Map View
                  </button>
                  {(user?.email || user?.phone_number) && (
                    <button 
                      onClick={()=>setViewMode('grid')} 
                      className={`pb-2 ${viewMode === 'grid' ? 'border-b-2 border-lightBlue text-lightBlue font-medium' : 'text-gray-500'}`}
                    >
                      My Projects
                    </button>
                  )}
                </div>
              </div>

              {/* Desktop Navigation & Search Bar */}
              <div className='hidden md:block w-[95%] lg:w-[90%] shadow-lg rounded-xl mx-auto -mt-10 bg-white relative z-10'>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6">
                  {/* Desktop Tabs */}
                  <div className='flex space-x-8 mb-4 md:mb-0'>
                    <div onClick={()=>setViewMode('other')} className={`cursor-pointer relative`}>
                      <span className={`${viewMode === 'other' ? "text-lightBlue font-semibold" : "text-gray-500 hover:text-gray-800"} transition-colors duration-200`}>
                        All Projects
                      </span>
                      {viewMode === 'other' && <div className='absolute -bottom-6 w-full h-0.5 bg-lightBlue rounded-full'></div>}
                    </div>
                    
                    <div onClick={()=>setViewMode('map')} className={`cursor-pointer relative`}>
                      <span className={`${viewMode === 'map' ? "text-lightBlue font-semibold" : "text-gray-500 hover:text-gray-800"} transition-colors duration-200`}>
                        Map View
                      </span>
                      {viewMode === 'map' && <div className='absolute -bottom-6 w-full h-0.5 bg-lightBlue rounded-full'></div>}
                    </div>
                    
                    {(user?.email || user?.phone_number) && (
                      <div onClick={()=>setViewMode('grid')} className={`cursor-pointer relative`}>
                        <span className={`${viewMode === 'grid' ? "text-lightBlue font-semibold" : "text-gray-500 hover:text-gray-800"} transition-colors duration-200`}>
                          My Projects
                        </span>
                        {viewMode === 'grid' && <div className='absolute -bottom-6 w-full h-0.5 bg-lightBlue rounded-full'></div>}
                      </div>
                    )}
                  </div>
                  
                  {/* Search and Action Buttons */}
                  <div className='flex flex-wrap items-center gap-4'>
                    {/* Create Button */}
                    {(user?.email || user?.phone_number) && (
                      <Button
                        onClick={()=>navigate('/projects/create')}
                        className='flex items-center gap-2 bg-lightBlue hover:bg-blue-300 text-white rounded-full'
                        size="sm"
                      >
                        <PlusCircle size={16} />
                        <span>Create Project</span>
                      </Button>
                    )}
                    
                    {/* Filter Button */}
                    {viewMode === "other" && (
                      <Button
                        onClick={()=>{
                          if(filterProjects) {
                            setFilterProject(false)
                            return
                          }
                          setFilterProject(true)
                          setOpenFilter(true)
                        }}
                        className={filterProjects ? "rounded-full gap-2 bg-lightBlue text-white" : 'rounded-full gap-2 bg-grayColor text-black hover:bg-lightBlue hover:text-white'}
                        size="sm"
                      >
                        <GiSettingsKnobs size={16} />
                        <span>Filter</span>
                      </Button>
                    )}
                    
                    {/* Search Box */}
                    <div className='relative w-full md:w-72 lg:w-80'>
                      <CiSearch className='absolute top-2.5 left-3 text-gray-400' size={18} />
                      <Input 
                        onChange={(e)=>setSearch(e.target.value)}
                        placeholder='Search projects...'
                        className='pl-10 pr-4 h-10 w-full rounded-full border border-gray-200 focus:ring-2 focus:ring-lightBlue'
                      />
                    </div>
                  </div>
                </div>
              </div>
          </div>

          {/* Personal Projects Section */}
          {viewMode === 'grid' && (
            <div className="container mx-auto px-4 py-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Projects</h2>
                <Button
                  onClick={()=>navigate('/projects/create')}
                  className='flex items-center gap-2 bg-lightBlue hover:bg-blue-300 text-white rounded-full md:hidden'
                  size="sm"
                >
                  <PlusCircle size={16} />
                  <span>Create</span>
                </Button>
              </div>

              {userProjectIsLoading ? (
                <div className='flex items-center justify-center h-64'>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lightBlue"></div>
                </div>
              ) : currentDataPersonal?.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {currentDataPersonal?.map((project: any) => (
                    <div 
                      key={project._id} 
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="relative">
                        {/* Project Category Badge */}
                        <div className="absolute top-4 left-4 bg-white/90 px-4 py-1.5 rounded-full flex items-center gap-2 z-10">
                          {project.type.name === "High Yield" || project.type.name === "Business" ? (
                            <>
                              <span className="text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2z"/>
                                  <path fillRule="evenodd" d="M8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                                </svg>
                              </span>
                              <span className="font-medium">High Yield</span>
                            </>
                          ) : (
                            <>
                              <span className="text-amber-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path fillRule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707z"/>
                                </svg>
                              </span>
                              <span className="font-medium">Balanced</span>
                            </>
                          )}
                        </div>
                        
                        {/* Project Image */}
                        <img 
                          src={project.medias[0]} 
                          alt={project.name} 
                          className="w-full h-64 object-cover"
                        />
                        
                        {/* Carousel Indicators */}
                        <div className="absolute bottom-4 w-full flex justify-center space-x-2">
                          {[...Array(Math.min(3, project.medias.length || 1))].map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`}
                            ></div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Project Info */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <img 
                              src={`https://flagcdn.com/16x12/cd.png`} 
                              alt="Country flag" 
                              className="w-5 h-auto"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              {project.province?.name || 'DRC'}
                            </span>
                          </div>
                          
                          {/* Project Owner */}
                          <div className="flex items-center space-x-1.5">
                            <div className="w-7 h-7 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                              <img 
                                src={project.projectOwner?.profile || "https://ui-avatars.com/api/?name=" + encodeURIComponent(project.projectOwner?.name || "User")} 
                                alt="Owner" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(project.projectOwner?.name || "User")}&background=random`;
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-600 font-medium truncate max-w-[80px]">
                              {project.projectOwner?.name || "Anonymous"}
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{project.name}</h3>
                        
                        <div className="flex items-center space-x-2 mb-4">
                          <span className="text-2xl font-bold text-green-500">
                            {project.currency} {project.targetAmount.toLocaleString()}
                          </span>
                        </div>
                        
                        {/* Project Details */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-2 gap-y-3">
                            <div>
                              <p className="text-gray-500 text-sm">Yearly return</p>
                              <p className="font-semibold text-gray-900">{project.loanRate || 8.5}%</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-sm">Funded date</p>
                              <p className="font-semibold text-gray-900">
                                {new Date(project.endDate).toLocaleDateString('en-US', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-gray-500 text-sm">Current valuation</p>
                              <p className="font-semibold text-gray-900">
                                {project.currency} {project.actualBalance.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Button */}
                        <Button
                          onClick={() => {
                            setSelectedProject(project);
                            dispatch(setProject(project));
                            if(project?._id) {
                              navigate(`/projects/${project._id}`);
                            }
                          }}
                          className="w-full mt-4 bg-darkBlue hover:bg-blue-700 text-white py-2.5 rounded-lg"
                        >
                          Cashout
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center bg-gray-50 rounded-lg p-12 border border-dashed border-gray-300'>
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <PlusCircle size={40} className="text-gray-400" />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-700 mb-2'>No projects found</h3>
                  <p className='text-gray-500 mb-4 text-center'>You haven't created any projects yet.</p>
                  <Button
                    onClick={()=>navigate('/projects/create')}
                    className='flex items-center gap-2 bg-lightBlue hover:bg-blue-300 text-white rounded-full'
                  >
                    <PlusCircle size={16} />
                    <span>Create New Project</span>
                  </Button>
                </div>
              )}

              {/* Pagination for Personal Projects */}
              {(user?.email || user?.phone_number) && userProjectsData?.length > itemsPerPage && (
                <div className='flex items-center justify-center mt-10 space-x-2'>
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => {
                      handleClick(currentPage-1);
                      window.scrollTo(0,0);
                    }}
                    variant="outline"
                    className='rounded-full w-10 h-10 p-0 flex items-center justify-center'
                    aria-label="Previous page"
                  >
                    <IoChevronBackSharp />
                  </Button>

                  <div className='flex items-center'>
                    {Array.from({length: Math.min(5, Math.ceil(userProjectsData?.length / itemsPerPage))}, (_, i) => {
                      // Logic to show ellipsis for many pages
                      const pageNum = i + 1;
                      if (Math.ceil(userProjectsData?.length / itemsPerPage) > 5) {
                        // Show first page, last page, current page, and pages around current
                        if (pageNum === 1 || 
                            pageNum === Math.ceil(userProjectsData?.length / itemsPerPage) ||
                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                          return (
                            <Button
                              key={i}
                              onClick={() => {
                                handleClick(pageNum);
                                window.scrollTo(0,0);
                              }}
                              variant={pageNum === currentPage ? "default" : "ghost"}
                              className={`rounded-full w-10 h-10 p-0 ${pageNum === currentPage ? 'bg-lightBlue text-white' : 'text-gray-700'}`}
                            >
                              {pageNum}
                            </Button>
                          );
                        } else if (pageNum === 2 && currentPage > 3) {
                          return <span key="ellipsis-start" className="px-2">...</span>;
                        } else if (pageNum === Math.ceil(userProjectsData?.length / itemsPerPage) - 1 && currentPage < Math.ceil(userProjectsData?.length / itemsPerPage) - 2) {
                          return <span key="ellipsis-end" className="px-2">...</span>;
                        } else {
                          return null;
                        }
                      } else {
                        // Show all pages if 5 or fewer
                        return (
                          <Button
                            key={i}
                            onClick={() => {
                              handleClick(pageNum);
                              window.scrollTo(0,0);
                            }}
                            variant={pageNum === currentPage ? "default" : "ghost"}
                            className={`rounded-full w-10 h-10 p-0 ${pageNum === currentPage ? 'bg-lightBlue text-white' : 'text-gray-700'}`}
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    })}
                  </div>

                  <Button
                    disabled={currentPage === Math.ceil(userProjectsData?.length / itemsPerPage)}
                    onClick={() => {
                      handleClick(currentPage+1);
                      window.scrollTo(0,0);
                    }}
                    variant="outline"
                    className='rounded-full w-10 h-10 p-0 flex items-center justify-center'
                    aria-label="Next page"
                  >
                    <IoChevronForward />
                  </Button>

                  <div className="ml-4 border-l pl-4 border-gray-200">
                    <NavigationMenu>
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger className='px-3 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md'>
                            {itemsPerPage} per page
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid w-28 gap-1 p-2">
                              <li 
                                onClick={() => {
                                  setItemsPerPage(9);
                                  setCurrentPage(1);
                                  window.scrollTo(0,0);
                                }}
                                className='px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer text-sm'
                              >
                                9 per page
                              </li>
                              <li 
                                onClick={() => {
                                  setItemsPerPage(12);
                                  setCurrentPage(1);
                                  window.scrollTo(0,0);
                                }}
                                className='px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer text-sm'
                              >
                                12 per page
                              </li>
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* All Projects Section */}
          {viewMode === 'other' && (
            <div className="container mx-auto px-4 py-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">All Projects</h2>
                {filterProjects && (
                  <Button
                    onClick={() => setFilterProject(false)}
                    variant="outline"
                    size="sm"
                    className="text-gray-600 border-gray-300 hidden md:flex"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>

              {AllProjectsIsLoading ? (
                <div className='flex items-center justify-center h-64'>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lightBlue"></div>
                </div>
              ) : currentData?.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {currentData?.map((project: any, index: number) => (
                    <div 
                      key={project._id} 
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="relative">
                        {/* Project Category Badge */}
                        <div className="absolute top-4 left-4 bg-white/90 px-4 py-1.5 rounded-full flex items-center gap-2 z-10">
                          {project.type.name === "High Yield" || project.type.name === "Business" ? (
                            <>
                              <span className="text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2z"/>
                                  <path fillRule="evenodd" d="M8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                                </svg>
                              </span>
                              <span className="font-medium">High Yield</span>
                            </>
                          ) : (
                            <>
                              <span className="text-amber-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path fillRule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707z"/>
                                </svg>
                              </span>
                              <span className="font-medium">Balanced</span>
                            </>
                          )}
                        </div>
                        
                        {/* Project Image */}
                        <img 
                          src={project.medias[0]} 
                          alt={project.name} 
                          className="w-full h-64 object-cover"
                        />
                        
                        {/* Carousel Indicators */}
                        <div className="absolute bottom-4 w-full flex justify-center space-x-2">
                          {[...Array(Math.min(3, project.medias.length || 1))].map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`}
                            ></div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Project Info */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <img 
                              src={`https://flagcdn.com/16x12/cd.png`} 
                              alt="Country flag" 
                              className="w-5 h-auto"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              {project.province?.name || 'DRC'}
                            </span>
                          </div>
                          
                          {/* Project Owner */}
                          <div className="flex items-center space-x-1.5">
                            <div className="w-7 h-7 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                              <img 
                                src={project.projectOwner?.profile || "https://ui-avatars.com/api/?name=" + encodeURIComponent(project.projectOwner?.name || "User")} 
                                alt="Owner" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(project.projectOwner?.name || "User")}&background=random`;
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-600 font-medium truncate max-w-[80px]">
                              {project.projectOwner?.name || "Anonymous"}
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{project.name}</h3>
                        
                        <div className="flex items-center space-x-2 mb-4">
                          <span className="text-2xl font-bold text-green-500">
                            {project.currency} {project.targetAmount.toLocaleString()}
                          </span>
                        </div>
                        
                        {/* Project Details */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-2 gap-y-3">
                            <div>
                              <p className="text-gray-500 text-sm">Yearly return</p>
                              <p className="font-semibold text-gray-900">{project.loanRate || 8.5}%</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-sm">Funded date</p>
                              <p className="font-semibold text-gray-900">
                                {new Date(project.endDate).toLocaleDateString('en-US', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-gray-500 text-sm">Current valuation</p>
                              <p className="font-semibold text-gray-900">
                                {project.currency} {project.actualBalance.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Button */}
                        <Button
                          onClick={() => {
                            setSelectedProject(project);
                            dispatch(setProject(project));
                            if (user?.email || user?.phone_number) {
                              if(project?._id) {
                                navigate(`/projects/${project._id}`);
                              }
                            } else {
                              setLogin(true);
                            }
                          }}
                          className="w-full mt-4 bg-darkBlue hover:bg-blue-700 text-white py-2.5 rounded-lg"
                        >
                          Donate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center bg-gray-50 rounded-lg p-12 border border-dashed border-gray-300'>
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <CiSearch size={40} className="text-gray-400" />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-700 mb-2'>No projects found</h3>
                  <p className='text-gray-500 mb-4 text-center'>
                    {search ? 'No projects match your search criteria' : 'There are no projects available at the moment'}
                  </p>
                  {search && (
                    <Button
                      onClick={() => setSearch('')}
                      variant="outline"
                      className='flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-lightBlue hover:text-white'
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              )}

              {/* Pagination for All Projects */}
              {currentData?.length > 0 && allProjects?.length > itemsPerPage && (
                <div className='flex items-center justify-center mt-10 space-x-2'>
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => {
                      handleClick(currentPage-1);
                      window.scrollTo(0,0);
                    }}
                    variant="outline"
                    className='rounded-full w-10 h-10 p-0 flex items-center justify-center'
                    aria-label="Previous page"
                  >
                    <IoChevronBackSharp />
                  </Button>

                  <div className='flex items-center'>
                    {Array.from({length: Math.min(5, Math.ceil(allProjects?.length / itemsPerPage))}, (_, i) => {
                      // Logic to show ellipsis for many pages
                      const pageNum = i + 1;
                      if (Math.ceil(allProjects?.length / itemsPerPage) > 5) {
                        // Show first page, last page, current page, and pages around current
                        if (pageNum === 1 || 
                            pageNum === Math.ceil(allProjects?.length / itemsPerPage) ||
                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                          return (
                            <Button
                              key={i}
                              onClick={() => {
                                handleClick(pageNum);
                                window.scrollTo(0,0);
                              }}
                              variant={pageNum === currentPage ? "default" : "ghost"}
                              className={`rounded-full w-10 h-10 p-0 ${pageNum === currentPage ? 'bg-lightBlue text-white' : 'text-gray-700'}`}
                            >
                              {pageNum}
                            </Button>
                          );
                        } else if (pageNum === 2 && currentPage > 3) {
                          return <span key="ellipsis-start" className="px-2">...</span>;
                        } else if (pageNum === Math.ceil(allProjects?.length / itemsPerPage) - 1 && currentPage < Math.ceil(allProjects?.length / itemsPerPage) - 2) {
                          return <span key="ellipsis-end" className="px-2">...</span>;
                        } else {
                          return null;
                        }
                      } else {
                        // Show all pages if 5 or fewer
                        return (
                          <Button
                            key={i}
                            onClick={() => {
                              handleClick(pageNum);
                              window.scrollTo(0,0);
                            }}
                            variant={pageNum === currentPage ? "default" : "ghost"}
                            className={`rounded-full w-10 h-10 p-0 ${pageNum === currentPage ? 'bg-lightBlue text-white' : 'text-gray-700'}`}
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    })}
                  </div>

                  <Button
                    disabled={currentPage === Math.ceil(allProjects?.length / itemsPerPage)}
                    onClick={() => {
                      handleClick(currentPage+1);
                      window.scrollTo(0,0);
                    }}
                    variant="outline"
                    className='rounded-full w-10 h-10 p-0 flex items-center justify-center'
                    aria-label="Next page"
                  >
                    <IoChevronForward />
                  </Button>

                  <div className="ml-4 border-l pl-4 border-gray-200">
                    <NavigationMenu>
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger className='px-3 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md'>
                            {itemsPerPage} per page
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid w-28 gap-1 p-2">
                              <li 
                                onClick={() => {
                                  setItemsPerPage(9);
                                  setCurrentPage(1);
                                  window.scrollTo(0,0);
                                }}
                                className='px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer text-sm'
                              >
                                9 per page
                              </li>
                              <li 
                                onClick={() => {
                                  setItemsPerPage(12);
                                  setCurrentPage(1);
                                  window.scrollTo(0,0);
                                }}
                                className='px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer text-sm'
                              >
                                12 per page
                              </li>
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Map View Section */}
          {viewMode === 'map' && (
            <div className="container mx-auto px-4 py-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Project Map</h2>
              </div>
              <div className='bg-white p-4 sm:p-6 rounded-xl shadow-sm'>
                <MapComponent />
              </div>
            </div>
          )}
        </div>
    </div>
  )
}

export default ProjectPage