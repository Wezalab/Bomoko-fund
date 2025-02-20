import { Button } from "./ui/button"
import { MdOutlineArrowOutward } from "react-icons/md";
import welcomeImage from '../assets/welcomeImage.png'
import { ChevronRight } from "lucide-react";
import PopularProjectCard from "./PopularProjectCard";
import popularProjectImage1 from '../assets/popularProjectImg1.png'
import popularProjectImage2 from '../assets/popularProjectProfile2.png'
import popularProjectImage3 from '../assets/popularProjectProfile3.png'
import popularProjectProfileImg from '../assets/popularProjectProfile1.png'
import { projects, userTestimonials } from "@/constants/dummydata";
import TestimonialCard from "./TestimonialCard";
import testimonialBg from '../assets/testimonialBg.png'
import testimonialProfile5 from '../assets/testimonialPic5.png'
import testimonialProfile6 from '../assets/testimonialPic6.png'
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


function HomePage() {
  const  navigate=useNavigate()
  return (
    <section className="bg-gray-100 p-3 md:p-5 lg:p-10">
        <div className="flex flex-col space-y-3 md:grid md:grid-cols-2 md:gap-x-8 md:py-16">
          <div className="">
            <div className="bg-gray-200 mt-5 md:mt-0  max-w-fit rounded-[100px] px-2">
              <span className="text-xs text-nowrap">About Us - Bomoko Fund</span>
            </div>
            <div className="flex flex-col mt-2 lg:mt-5 -space-y-1">
              <span className="text-[30px] md:text-[50px]">Welcome to </span>
              <span className="text-[35px] md:text-[50px] text-lightBlue">Bomoko Fund</span>
            </div>
            <div className="md:w-full lg:w-3/4 mt-5">
              <span className="text-lightGray">
                Bring your ideas to life by starting your own project, raising funds, and joining a community of passionate backers. 
                Explore campaigns across various categories, support causes that resonate with you, and turn your vision into reality.
              </span>
            </div>
            <Button
              className="flex items-center space-x-3 bg-darkBlue w-[120px] h-[40px] md:w-[152px] md:h-[52px] rounded-[100px] mt-3 lg:mt-10 hover:bg-lightBlue"
            >
             Start Now
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
                <p className="text-lg text-gray-700">Projects successfully completed</p>
              </div>

            </div>
          </div>
        </div>

        {/* start of popular projects */}
        <div className="mt-5 md:mt-0">
          <div className="flex items-center md:items-start justify-between">
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-x-2 md:w-2/5 lg:w-2/6">
              <span className="text-darkBlue text-[24px] md:text-[40px] font-semibold">
                Popular
                projects
              </span>
              <span className="hidden md:inline text-lightGray">
                Take a look at some of the most popular projects that are transforming lives on a large scale. 
                These initiatives are making a meaningful impact and improving the quality of life for countless individuals.
              </span>
            </div>
            <Button 
              onClick={()=>navigate("/projects")}
              className="md:w-[150px] w-[120px] h-[38px] md:h-[48px] flex items-center gap-5 rounded-[100px] bg-darkBlue text-white"
            >
              View all
              <ChevronRight />
            </Button>
            
          </div>
          <div className="w-[98%] mx-auto my-2 md:hidden">
            <span className="text-lightGray">
              Take a look at some of the most popular projects that are transforming lives on a large scale. 
              These initiatives are making a meaningful impact and improving the quality of life for countless individuals.
            </span>
          </div>

          <div className="relative hidden md:grid md:grid-cols-7 lg:grid-cols-8  py-10 h-[750px] w-full">
            <PopularProjectCard 
              className="absolute -bottom-36 left-0 md:col-span-3 lg:col-span-2"
              image={popularProjectImage1}
              title="Goma disaster recovery"
              desc="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque"
              type="Charity"
              amount={6000}
              limit={12000}
              profile={popularProjectProfileImg}
            />
            <div className="col-span-1"></div>
            <PopularProjectCard 
              className="absolute -bottom-16 md:col-span-3 lg:col-span-2"
              image={popularProjectImage2}
              title="Support 230 Children to get school fees"
              desc="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque"
              type="Charity"
              amount={6000}
              limit={12000}
              profile={popularProjectProfileImg}
            />
            <div className="md:hidden lg:col-span-1"></div>
            <PopularProjectCard 
              className="absolute lg:grid md:hidden lg:left-[50%] lg:-top-16 col-span-2"
              image={popularProjectImage3}
              title="Help Kamana John get back to life"
              desc="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque"
              type="Charity"
              amount={6000}
              limit={12000}
              profile={popularProjectProfileImg}
            />

            <div className="flex items-center space-x-5 absolute bottom-5 md:right-2 lg:right-0">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-6 rounded-3xl bg-lightBlue"></div>
                <div className="w-2 h-2 rounded-full bg-lightGray"></div>
                <div className="w-2 h-2 rounded-full bg-lightGray"></div>
              </div>
              <Button
                className="flex items-center space-x-5 text-black w-[110px] h-[50px] rounded-[100px] border-2 border-black bg-transparent"
              >
                Next
                <ChevronRight size={28} color="black" />
              </Button>
            </div>
          </div>
        </div>
        {/* end of popular projects */}

        {/* start of popular project on small devices */}
        <div className="block md:hidden">
          <Carousel className="mx-auto max-w-[90%]">
            <CarouselContent className="">
              {Array.from({ length: projects.slice(0,5).length }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center w-full m-0 p-0">
                        <PopularProjectCard
                          className="w-full"
                          image={projects[index].image}
                          title={projects[index].title}
                          desc={projects[index].desc}
                          type={projects[index].type}
                          amount={projects[index].amount}
                          limit={projects[index].limit}
                          profile={projects[index].profile}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-7" />
            <CarouselNext className="-right-7"/>
          </Carousel>
        </div>
        {/* end of popular project on small devices */}
        {/* start of Testimonials on small device */}
        <div className="block md:hidden my-5">
          <div className="flex justify-center items-center flex-col mb-3 space-y-2">
            <span className="text-[25px] font-semibold">Testimonials from our users</span>
            <div className="w-[90%] mx-auto flex items-center justify-center">
              <span className="text-lightGray text-sm text-center">
                These steps outline the process of using the AI Image Generator, 
                from choosing a style to saving or sharing the final artwork
              </span>
            </div>
          </div>
          <Carousel className="mx-auto max-w-[90%]">
            <CarouselContent className="">
              {Array.from({ length: userTestimonials.length }).map((_, index) => (
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
                              <span className="text-sm text-lightGray">{userTestimonials[index].description}</span>
                            </div>
                            <div className="mt-5 text-center">
                              <span className="font-bold ">{userTestimonials[index].name}</span>
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
            <CarouselNext className="-right-7"/>
          </Carousel>
        </div>
        {/* End of Testimonials on small device */}
        {/* start of users testimonials */}
        <div className="my-10 hidden md:block">
          <div className="flex justify-center items-center flex-col space-y-2">
            <span className="text-[40px] font-semibold">Testimonials from our users</span>
            <div className="w-[490px] mx-auto flex items-center justify-center">
              <span className="text-lightGray text-center">
                These steps outline the process of using the AI Image Generator, 
                from choosing a style to saving or sharing the final artwork
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
              userTestimonials.map((testimonial)=>(
                <TestimonialCard 
                  className={
                    testimonial.id ==="1"?'absolute md:left-[5%] lg:left-[2%]':
                    testimonial.id ==="2"?"absolute left-[15%]":
                    testimonial.id ==="3"?'absolute left-[25%]':
                    testimonial.id ==="4"?'absolute md:left-[30%] lg:left-[35%]':
                    ''
                  }
                  key={testimonial.id}
                  img={testimonial.img}
                  name={testimonial.name}
                  description={testimonial.description}
                />
              ))
            }
            <div className="absolute top-10 right-[10%] grid grid-cols-1">
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
                Be part of the 
                change!
              </span>
              <div className="absolute bottom-2 w-[108px] h-[80px] rounded-xl p-3 left-2 bg-lightGray flex flex-col space-y-1">
                <span className="text-white font-[400]">4 Steps</span>
                <span className="text-white text-[9px]">
                  to get funds for your project
                </span>
              </div>
              <div className="bg-white absolute rounded-tl-xl rounded-br-xl p-1 flex items-center bottom-0 right-0">
                <div className="p-2 w-16 h-16 rounded-full bg-lightBlue flex items-center justify-center">
                  <MdOutlineArrowOutward size={20} color="white" />
                </div>
                <Button
                  className="w-[130px] h-[56px] rounded-[100px] bg-lightBlue text-white"
                > 
                  Try it Now
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