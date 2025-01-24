import { Button } from "./ui/button"
import { MdOutlineArrowOutward } from "react-icons/md";
import welcomeImage from '../assets/welcomeImage.png'
import { ChevronRight } from "lucide-react";
import PopularProjectCard from "./PopularProjectCard";
import popularProjectImage1 from '../assets/popularProjectImg1.png'
import popularProjectImage2 from '../assets/popularProjectProfile2.png'
import popularProjectImage3 from '../assets/popularProjectProfile3.png'
import popularProjectProfileImg from '../assets/popularProjectProfile1.png'





function HomePage() {
  return (
    <section className="bg-gray-100 px-10 py-10">
        <div className="grid grid-cols-2 gap-x-8 py-16">
          <div className="">
            <div className="bg-gray-200 w-[20%] rounded-[100px] px-2">
              <span className="text-xs">About Us - Bomoko Fund</span>
            </div>
            <div className="flex flex-col mt-5 -space-y-1">
              <span className="text-[50px]">Welcome to </span>
              <span className="text-[50px] text-lightBlue">Bomoko Fund</span>
            </div>
            <div className="w-3/4 mt-5">
              <span className="text-lightGray">
                Bring your ideas to life by starting your own project, raising funds, and joining a community of passionate backers. 
                Explore campaigns across various categories, support causes that resonate with you, and turn your vision into reality.
              </span>
            </div>
            <Button
              className="flex items-center space-x-3 bg-darkBlue w-[152px] h-[52px] rounded-[100px] mt-10 hover:bg-lightBlue"
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
            <div className="h-[20px] w-[100%] bg-white absolute inset-1 top-[47%] opacity-100 left-0 "></div>
            <div className="absolute inset-0 flex items-center justify-center">

              <div className="bg-white bg-opacity-90 text-center rounded-lg px-6 py-4 shadow-md">
                <h2 className="text-4xl font-bold text-black">100+</h2>
                <p className="text-lg text-gray-700">Projects successfully completed</p>
              </div>

            </div>
          </div>
        </div>

        {/* start of popular projects */}
        <div className="">
          <div className="flex justify-between">
            <div className="grid grid-cols-2 gap-x-2 w-2/6">
              <span className="text-darkBlue text-[40px] font-semibold">
                Popular
                projects
              </span>
              <span className="text-lightGray">
                Take a look at some of the most popular projects that are transforming lives on a large scale. 
                These initiatives are making a meaningful impact and improving the quality of life for countless individuals.
              </span>
            </div>
            <Button
              className="w-[150px] h-[48px] flex items-center gap-5 rounded-[100px] bg-darkBlue text-white"
            >
              View all
              <ChevronRight />
            </Button>
          </div>

          <div className="relative grid grid-cols-3 gap-10 py-10 h-[750px] w-full">
            <PopularProjectCard 
              className="absolute -bottom-36 left-16"
              image={popularProjectImage1}
              title="Goma disaster recovery"
              desc="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque"
              type="Charity"
              amount={6000}
              limit={12000}
              profile={popularProjectProfileImg}
            />
            <PopularProjectCard 
              className="absolute -bottom-16"
              image={popularProjectImage2}
              title="Support 230 Children to get school fees"
              desc="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque"
              type="Charity"
              amount={6000}
              limit={12000}
              profile={popularProjectProfileImg}
            />
            <PopularProjectCard 
              className="absolute -top-16"
              image={popularProjectImage3}
              title="Help Kamana John get back to life"
              desc="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque"
              type="Charity"
              amount={6000}
              limit={12000}
              profile={popularProjectProfileImg}
            />

            <div className="flex items-center space-x-5 absolute bottom-5 right-44">
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
        {/* start of users testimonials */}
        <div className="my-10 ">
          <div className="flex justify-center items-center flex-col space-y-2">
            <span className="text-[40px] font-semibold">Testimonials from our users</span>
            <div className="w-[490px] mx-auto flex items-center justify-center">
              <span className="text-lightGray text-center">
                These steps outline the process of using the AI Image Generator, 
                from choosing a style to saving or sharing the final artwork
              </span>
            </div>
            
          </div>
        </div>
        {/* end of users testimonials */}

    </section>
  )
}

export default HomePage