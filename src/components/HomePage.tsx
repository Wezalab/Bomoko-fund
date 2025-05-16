import { Button } from "./ui/button"
import { MdOutlineArrowOutward } from "react-icons/md";
import welcomeImage from '../assets/welcome3.jpg'
import { ChevronRight } from "lucide-react";
import PopularProjectCard from "./PopularProjectCard";
import popularProjectProfileImg from '../assets/popularProjectProfile1.png'
import { userTestimonials } from "@/constants/dummydata";
import TestimonialCard from "./TestimonialCard";
import testimonialBg from '../assets/testimonialBg.png'
import testimonialProfile5 from '../assets/testimonialPic5.png'
import testimonialProfile6 from '../assets/testimonialPic6.png'
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/lib/TranslationContext"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useGetAllProjectsQuery, useUsersProjectsQuery } from "@/redux/services/projectServices";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/slices/userSlice";
import SignIn from "./SignIn";
import Donate from "./Donate";
import Cashout from "./Cashout";
import { setProject } from "@/redux/slices/projectSlice";
import { Project } from "@/types";


function HomePage() {
  const navigate = useNavigate()
  const user = useAppSelector(selectUser)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [login, setLogin] = useState(false)
  const [donate, setDonate] = useState(false)
  const [cashout, setCashout] = useState(false)
  const { t } = useTranslation()

  const dispatch = useAppDispatch()

  const {
    data: userProjectsData,
    error: userProjectError,
    isSuccess: userProjectIsSuccess,
    isError: userProjectIsError,
    isLoading: userProjectIsLoading
  } = useUsersProjectsQuery(user._id)


  const {
    data: AllProjects,
    isSuccess: AllProjectsIsSuccess,
    isLoading: AllProjectsIsLoading,
    isError: AllProjectsIsError,
    error: AllProjectsError
  } = useGetAllProjectsQuery(undefined)

  useEffect(() => {
    if (AllProjectsIsSuccess && AllProjects) {
      //console.log("all projects", AllProjects)
      // dispatch(setProjects(AllProjects))
    }
    if (AllProjectsIsError) {
      console.log("Error while getting all projects", AllProjectsError)
    }
  }, [AllProjectsIsSuccess, AllProjectsIsError])

  useEffect(() => {
    if (userProjectIsSuccess && userProjectsData) {
      console.log("user projects data:", userProjectsData)
    }
    if (userProjectIsError) {
      console.log("error while getting user projects", userProjectError)
    }
  }, [userProjectIsError, userProjectIsSuccess])

  return (
    <section className="bg-gray-100 p-3 md:p-5 lg:p-10 relative">
      {
        login &&
        <div className="md:w-[80%] md:left-[10%] lg:w-[500px] absolute md:top-[20%] lg:top-[15%] z-20 lg:left-[40%]">
          <SignIn onClose={() => setLogin(false)} />
        </div>
      }
      {
        donate &&
        <div className="md:w-[80%] md:left-[10%] lg:w-[500px] absolute md:top-[20%] lg:top-[15%] z-20 lg:left-[40%]">
          <Donate projectId={selectedProject?._id} onClose={() => setDonate(false)} />
        </div>
      }
      {
        cashout &&
        <div className="md:w-[80%] md:left-[10%] lg:w-[500px] fixed md:top-[20%] lg:top-[15%] z-20 lg:left-[40%]">
          <Cashout projectId={selectedProject?._id} onClose={() => setCashout(false)} />

        </div>
      }
      <div className="flex flex-col space-y-3 md:grid md:grid-cols-2 md:gap-x-8 md:py-16">
        <div className="">
          <div className="bg-gray-200 mt-5 md:mt-0  max-w-fit rounded-[100px] px-2">
            <span className="text-xs text-nowrap">{t("About Us - Bomoko Fund")}</span>
          </div>
          <div className="flex flex-col mt-2 lg:mt-5 -space-y-1">
            <span className="text-[30px] md:text-[50px]">{t("Welcome to")} </span>
            <span className="text-[35px] md:text-[50px] text-lightBlue">{t("Bomoko Fund")}</span>
          </div>
          <div className="md:w-full lg:w-3/4 mt-5">
            <span className="text-lightGray">
              {t("Bomoko Fund is a revolutionary")} <span className="font-bold">{t("crowdfunding platform")} </span> {t("designed to empower")} <span className="font-bold">{t("African entrepreneurs and high-potential business projects.")} </span>
              {t("We connect")} <span className="font-bold">{t("visionary business owners")}</span> {t("with")}  <span className="font-bold">{t("impact-driven investors and supporters,")} </span>
              {t("creating a thriving ecosystem where great ideas receive the funding they deserve.")}
            </span>
          </div>
          <Button
            className="flex items-center space-x-3 bg-darkBlue  h-[40px] md:h-[52px] rounded-[100px] mt-3 lg:mt-10 hover:bg-lightBlue"
          >
            {t("Start Now")}
            <MdOutlineArrowOutward size={24} color="white" />
          </Button>
        </div>
        <div className="relative w-full h-[384px]">
          <img
            className="w-full h-full object-cover rounded-2xl"
            src={welcomeImage}
            alt="welcome-image"
          />
          <div className="hidden md:block h-[20px] w-[100%] bg-white absolute inset-1 top-[47%] opacity-100 left-0 "></div>
          <div className="absolute hidden  inset-0 md:flex items-center justify-center">

            <div className="bg-white bg-opacity-90 text-center rounded-lg px-6 py-4 shadow-md">
              <h2 className="text-4xl font-bold text-black">100+</h2>
              <p className="text-lg text-gray-700">{t("Projects successfully completed")}</p>
            </div>

          </div>
        </div>
      </div>

      {/* start of popular projects */}
      {
        AllProjects?.length > 0 && (
          <div className="mt-5 md:mt-0">
            <div className="flex items-center md:items-start justify-between">
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-x-2 md:w-2/5 lg:w-2/6">
                <span className="text-darkBlue text-[24px] md:text-[40px] font-semibold">
                  {t("Popular projects")}
                </span>
                <span className="hidden md:inline text-lightGray">
                  {t("At Bomoko Fund, we prioritize high-potential projects that address critical social and economic needs.")}
                </span>
              </div>
              <Button
                onClick={() => navigate("/projects")}
                className="md:w-[150px] w-[120px] h-[38px] md:h-[48px] flex items-center gap-5 rounded-[100px] bg-darkBlue text-white"
              >
                {t("View all")}
                <ChevronRight />
              </Button>

            </div>
            <div className="w-[98%] mx-auto my-2 md:hidden">
              <span className="text-lightGray">
                {t("At Bomoko Fund, we prioritize high-potential projects that address critical social and economic needs.")}
              </span>
            </div>

            {/* Modern card grid layout for desktop */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {AllProjects.slice(0, 3).map((project: any, index: number) => (
                <div 
                  key={project._id} 
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    {/* Project Category Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 px-4 py-1.5 rounded-full flex items-center gap-2">
                      {project.type.name === "High Yield" ? (
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
                      {[...Array(3)].map((_, i) => (
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
                          src={`https://flagcdn.com/16x12/ae.png`} 
                          alt="Country flag" 
                          className="w-5 h-auto"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {project.province?.name || 'Location'}
                        </span>
                      </div>
                      
                      {/* Project Owner - Fix avatar property name */}
                      <div className="flex items-center space-x-1.5">
                        <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden border border-gray-200 flex items-center justify-center text-xs font-medium">
                          {project.projectOwner?.avatar ? (
                            <img 
                              src={project.projectOwner.avatar} 
                              alt={`${project.projectOwner.name || 'User'}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Replace with initials when image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerText = getInitials(project.projectOwner?.name || 'User');
                                target.parentElement!.style.backgroundColor = getRandomColor(project.projectOwner?.name || 'User');
                                target.parentElement!.style.color = 'white';
                                target.parentElement!.style.display = 'flex';
                                target.parentElement!.style.alignItems = 'center';
                                target.parentElement!.style.justifyContent = 'center';
                              }}
                            />
                          ) : (
                            <span style={{backgroundColor: getRandomColor(project.projectOwner?.name || 'User'), color: 'white'}}>
                              {getInitials(project.projectOwner?.name || 'User')}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-600 font-medium truncate max-w-[80px]">
                          {project.projectOwner?.name || "Anonymous"}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl font-bold text-green-500">
                        {project.currency} {project.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    
                    {/* Project Details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-y-3">
                        <div>
                          <p className="text-gray-500 text-sm">Yearly investment return</p>
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
                        if (project?._id) {
                          navigate(`/projects/${project._id}`);
                        }
                      }}
                      className="w-full mt-4 bg-darkBlue hover:bg-blue-700 text-white py-2.5 rounded-lg"
                    >
                      {t("View Details")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6 md:hidden">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-6 rounded-3xl bg-lightBlue"></div>
                <div className="w-2 h-2 rounded-full bg-lightGray"></div>
                <div className="w-2 h-2 rounded-full bg-lightGray"></div>
              </div>
            </div>
          </div>
        )
      }
      
      {/* end of popular projects */}

      {/* start of popular project on small devices */}
      {
        AllProjects?.length > 0 && (
          <div className="block md:hidden mt-4">
            <Carousel className="mx-auto max-w-[90%]">
              <CarouselContent className="">
                {AllProjects.slice(0, Math.min(3, AllProjects.length)).map((project: any, index: number) => (
                  <CarouselItem key={project._id || index}>
                    <div className="p-1">
                      <Card className="overflow-hidden">
                        <CardContent className="flex flex-col p-0">
                          <div className="relative">
                            {/* Project Category Badge */}
                            <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-1.5 z-10 text-sm">
                              {index % 2 === 0 ? (
                                <>
                                  <span className="text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                      <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2z"/>
                                      <path fillRule="evenodd" d="M8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                                    </svg>
                                  </span>
                                  <span className="font-medium">High Yield</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-amber-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
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
                              className="w-full h-56 object-cover"
                            />
                            
                            {/* Carousel Indicators */}
                            <div className="absolute bottom-4 w-full flex justify-center space-x-1.5">
                              {[...Array(3)].map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`}
                                ></div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Project Info */}
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <img 
                                  src={`https://flagcdn.com/16x12/ae.png`} 
                                  alt="Country flag" 
                                  className="w-4 h-auto"
                                />
                                <span className="text-xs font-medium text-gray-700">
                                  {project.province?.name || 'Location'}
                                </span>
                              </div>
                              
                              {/* Project Owner - Fix avatar property name */}
                              <div className="flex items-center space-x-1">
                                <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden border border-gray-200 flex items-center justify-center text-[8px] font-medium">
                                {project.projectOwner?.avatar ? (
                                <img 
                                  src={project.projectOwner.avatar} 
                                  alt={`${project.projectOwner.name || 'User'}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Replace with initials when image fails to load
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.parentElement!.innerText = getInitials(project.projectOwner?.name || 'User');
                                    target.parentElement!.style.backgroundColor = getRandomColor(project.projectOwner?.name || 'User');
                                    target.parentElement!.style.color = 'white';
                                    target.parentElement!.style.display = 'flex';
                                    target.parentElement!.style.alignItems = 'center';
                                    target.parentElement!.style.justifyContent = 'center';
                                  }}
                                />
                              ) : (
                                <span style={{backgroundColor: getRandomColor(project.projectOwner?.name || 'User'), color: 'white'}}>
                                  {getInitials(project.projectOwner?.name || 'User')}
                                </span>
                              )}
                                </div>
                                <span className="text-[10px] text-gray-600 font-medium truncate max-w-[60px]">
                                  {project.projectOwner?.name || "Anonymous"}
                                </span>
                              </div>
                            </div>
                            
                            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{project.name}</h3>
                            
                            <div className="flex items-center space-x-2 mb-3">
                              <span className="text-xl font-bold text-green-500">
                                {project.currency} {project.targetAmount.toLocaleString()}
                              </span>
                            </div>
                            
                            {/* Action Button */}
                            <Button
                              onClick={() => {
                                setSelectedProject(project);
                                dispatch(setProject(project));
                                if (project?._id) {
                                  navigate(`/projects/${project._id}`);
                                }
                              }}
                              className="w-full bg-darkBlue hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
                            >
                              {t("View Details")}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-7" />
              <CarouselNext className="-right-7" />
            </Carousel>
          </div>
        )
      }
      
      {/* end of popular project on small devices */}
      {/* start of Testimonials on small device */}
      <div className="block md:hidden my-5">
        <div className="flex justify-center items-center flex-col mb-3 space-y-2">
          <span className="text-[25px] font-semibold">{t("Testimonials from Our Community")}</span>
          <div className="w-[90%] mx-auto flex items-center justify-center">
            <span className="text-lightGray text-sm text-center">
              {t("Hear from entrepreneurs and investors who have transformed lives through Bomoko Fund.")}
              {t("Discover how our platform empowers businesses and drives meaningful impact.")}
            </span>
          </div>
        </div>


        <Carousel className="mx-auto max-w-[90%]">
          <CarouselContent className="">
            {Array.from({ length: userTestimonials?.length }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center w-full m-0 p-0">
                      <div className="">
                        <div className="w-full h-[250px]">
                          <img
                            src={userTestimonials[index].img}
                            className="w-full h-full object-cover"
                            alt={`testimonial-${index}`}
                          />
                        </div>
                        <div className="flex flex-col my-3">
                          <div className="w-[90%] mx-auto text-center">
                            <span className="text-sm text-lightGray">{userTestimonials[index]?.description}</span>
                          </div>
                          <div className="mt-5 text-center">
                            <span className="font-bold ">{userTestimonials[index]?.name}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-7" />
          <CarouselNext className="-right-7" />
        </Carousel>
      </div>
      {/* End of Testimonials on small device */}
      {/* start of users testimonials */}
      <div className="md:block hidden my-5">
      <div className="flex justify-center items-center flex-col mb-3 space-y-2">
        <span className="text-[25px] font-semibold">{t("Testimonials from Our Community")}</span>
        <div className="w-[90%] mx-auto flex items-center justify-center">
          <span className="text-lightGray text-sm text-center">
            {t("Hear from entrepreneurs and investors who have transformed lives through Bomoko Fund.")}  
            {t("Discover how our platform empowers businesses and drives meaningful impact.")}
          </span>
        </div>
      </div>

        <div className="h-[600px] md:w-[90%] lg:w-full  mt-8 relative grid grid-cols-1 gap-y-8">
          <img
            src={testimonialBg}
            className="w-full h-full absolute inset-10"
            alt="testimonial-bg"
          />
          {
            userTestimonials.map((testimonial) => (
              <TestimonialCard
                className={
                  testimonial.id === "1" ? 'absolute md:left-[5%] lg:left-[2%]' :
                    testimonial.id === "2" ? "absolute left-[15%]" :
                      testimonial.id === "3" ? 'absolute left-[25%]' :
                        testimonial.id === "4" ? 'absolute md:left-[28%] lg:left-[35%]' :
                          ''
                }
                key={testimonial.id}
                img={testimonial.img}
                name={testimonial.name}
                description={testimonial.description}
              />
            ))
          }
          <div className="absolute top-10 right-[10%] hidden lg:grid grid-cols-1">
            <img
              src={testimonialProfile5}
              className="w-[120px] h-[120xp] rounded-[15px]"
              alt="testimonial-profile5"
            />
            <img
              src={testimonialProfile6}
              className="w-[120px] left-[92%] absolute -bottom-[96%] h-[120xp] rounded-[15px]"
              alt="testimonial-profile6"
            />
          </div>
          <div className="md:hidden w-[323px] absolute rounded-3xl -bottom-5 left-0 h-[200px] py-3 px-5 bg-darkBlue">
            <span className="text-white text-[32px] font-semibold">
              {t("Be part of the change!")}
            </span>
            <div className="absolute bottom-2 w-[108px] h-[80px] rounded-xl p-3 left-2 bg-lightGray flex flex-col space-y-1">
              <span className="text-white font-[400]">{t("4 Steps")}</span>
              <span className="text-white text-[9px]">
                {t("to get funds for your project")}
              </span>
            </div>
            <div className="bg-white absolute rounded-tl-xl rounded-br-xl p-1 flex items-center bottom-0 right-0">
              <div className="p-2 w-16 h-16 rounded-full bg-lightBlue flex items-center justify-center">
                <MdOutlineArrowOutward size={20} color="white" />
              </div>
              <Button
                className="w-[130px] h-[56px] rounded-[100px] bg-lightBlue text-white"
              >
                {t("Try it Now")}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* end of users testimonials */}

    </section>
  )
}

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0]?.toUpperCase() || '')
    .slice(0, 2)
    .join('');
}

// Helper function to generate consistent color based on name
function getRandomColor(name: string): string {
  // Generate a consistent color based on the name string
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#4F46E5', // indigo
    '#0891B2', // cyan
    '#4D7C0F', // lime
    '#9333EA', // purple
    '#0369A1', // blue
    '#059669', // emerald
    '#B91C1C', // red
    '#C2410C', // orange
    '#0F766E', // teal
    '#7E22CE'  // violet
  ];
  
  // Use the hash to pick a consistent color
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export default HomePage