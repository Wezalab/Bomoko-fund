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
        AllProjects?.length > 0 &&(
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

            <div className="relative hidden md:grid md:grid-cols-7 lg:grid-cols-8  py-10 h-[750px] w-full">
              <PopularProjectCard
                className="absolute w-[100%] -bottom-36 left-0  md:col-span-3 lg:col-span-2"
                onClick={() => {
                  setSelectedProject(AllProjects?.[0])
                  //@ts-ignore
                  dispatch(setProject(AllProjects?.[0]))
                  if (AllProjects?.[0]?._id) {
                    navigate(`/projects/${AllProjects?.[0]?._id}`)
                  }
                }}
                actionName={t("Donate")}
                action={() => {

                }}
                image={AllProjects?.[0]?.medias[0]}
                title={AllProjects?.[0]?.name}
                desc={AllProjects?.[0]?.desctiption}
                type={AllProjects?.[0]?.type.name}
                amount={AllProjects?.[0]?.actualBalance || 0}
                limit={AllProjects?.[0]?.targetAmount}
                profile={popularProjectProfileImg}
              />
              <div className="col-span-1"></div>

              <PopularProjectCard
                className="absolute w-[108%] -bottom-16 md:col-span-3 lg:col-span-2"
                onClick={() => {
                  setSelectedProject(AllProjects?.[1])
                  //@ts-ignore
                  dispatch(setProject(AllProjects?.[1]))
                  if (AllProjects?.[1]?._id) {
                    navigate(`/projects/${AllProjects?.[1]?._id}`)
                  }
                }}
                actionName={t("Donate")}
                action={() => {

                }}
                image={AllProjects?.[1]?.medias[0]}
                title={AllProjects?.[1]?.name}
                desc={AllProjects?.[1]?.desctiption}
                type={AllProjects?.[1]?.type.name}
                amount={AllProjects?.[1]?.actualBalance || 0}
                limit={AllProjects?.[1]?.targetAmount}
                profile={popularProjectProfileImg}
              />
              <div className="md:hidden lg:col-span-1"></div>
              <PopularProjectCard
                className="absolute w-[108%] lg:block md:hidden lg:left-[50%] 2xl:-top-[15%] -top-[10%] lg:col-span-2"
                onClick={() => {
                  setSelectedProject(AllProjects?.[2])
                  //@ts-ignore
                  dispatch(setProject(AllProjects?.[2]))
                  if (AllProjects?.[2]?._id) {
                    navigate(`/projects/${AllProjects?.[2]?._id}`)
                  }
                }}
                actionName={t("Donate")}
                action={() => {

                }}
                image={AllProjects?.[2]?.medias[0]}
                title={AllProjects?.[2]?.name}
                desc={AllProjects?.[2]?.desctiption}
                type={AllProjects?.[2]?.type.name}
                amount={AllProjects?.[2]?.actualBalance || 0}
                limit={AllProjects?.[2]?.targetAmount}
                profile={popularProjectProfileImg}
              />

              <div className="flex items-center space-x-5 absolute bottom-5 md:right-2 lg:right-0">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-6 rounded-3xl bg-lightBlue"></div>
                  <div className="w-2 h-2 rounded-full bg-lightGray"></div>
                  <div className="w-2 h-2 rounded-full bg-lightGray"></div>
                </div>
                <Button
                  onClick={() => navigate("/projects")}
                  className="flex items-center space-x-5 text-black w-[110px] h-[50px] rounded-[100px] border-2 border-black bg-transparent"
                >
                  {t("Next")}
                  <ChevronRight size={28} color="black" />
                </Button>
              </div>
            </div>
          </div>
        )
      }
      
      {/* end of popular projects */}

      {/* start of popular project on small devices */}
      {
        AllProjects?.length > 0 && (
          <div className="block md:hidden">
            <Carousel className="mx-auto max-w-[90%]">
              <CarouselContent className="">
                {Array.from({ length: AllProjects?.slice(0, 3).length }).map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center w-full m-0 p-0">
                          <PopularProjectCard
                            className="w-full"
                            onClick={() => {
                              setSelectedProject(AllProjects?.[index])
                              //@ts-ignore
                              dispatch(setProject(AllProjects?.[index]))
                              if (AllProjects?.[index]?._id) {
                                navigate(`/projects/${AllProjects?.[index]._id}`)
                              }

                              //(!user.email&& !user.phone_number) && setViewProjectSecurity(true)

                            }}
                            actionName={t("Donate")}
                            action={() => {
                              setSelectedProject(AllProjects?.[index])
                              //@ts-ignore
                              dispatch(setProject(AllProjects?.[index]))
                              if ((user.email || user.phone_number && !userProjectsData?.map((item: any) => item._id).includes(AllProjects?.[index]?._id))) {
                                setDonate(true)
                                return
                              }
                              setLogin(true)
                            }}
                            image={AllProjects[index].medias[0]}
                            title={AllProjects[index].name}
                            desc={AllProjects[index].desccription}
                            type={AllProjects[index].type.name}
                            amount={AllProjects[index].actualBalance || 0}
                            limit={AllProjects[index].targetAmount}
                          />
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

export default HomePage