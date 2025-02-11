import { filterData } from "@/constants/dummydata";
import { MdCancel } from "react-icons/md";
import { Button } from "./ui/button";
import { useState } from "react";

function FilterModal({onClose}:{onClose:any}) {
  const [filterDatas,setfilterDatas]=useState({
    category:[],
    date:"",
    status:"",
    region:[],
    authorGender:""
  })
  return (
    <div className="bg-white relative rounded-2xl w-full shadow-md py-10 md:px-5">
        <div className="px-5">
          <MdCancel onClick={onClose} className="absolute top-10 right-10 cursor-pointer" size={24} />
          <div className="mt-10 flex items-center justify-center">
              <span className="text-2xl font-semibold">Filter projects</span>
          </div>
          <div className="my-5">
              <span className="font-semibold text-xl">Project Category</span>
              <div className="mt-5 flex space-x-5 w-full overflow-x-auto no-scrollbar">
                  {
                    filterData.category.map(category=>(
                      <Button
                        className="py-2 px-4 rounded-2xl hover:text-white hover:bg-lightBlue capitalize bg-gray-200 text-black"
                      >
                        {category}
                      </Button>
                    ))
                  }
              </div>
          </div>
          <div className="my-5">
              <span className="font-semibold text-xl">Date Created</span>
              <div className="mt-5 flex space-x-5">
                  {
                    filterData.date.map(date=>(
                      <Button
                        className="py-2 px-4 rounded-2xl hover:text-white hover:bg-lightBlue capitalize bg-gray-200 text-black"
                      >
                        {date}
                      </Button>
                    ))
                  }
              </div>
          </div>
          <div className="my-5">
              <span className="font-semibold text-xl">Project Status</span>
              <div className="mt-5 flex space-x-5">
                  {
                    filterData.status.map(status=>(
                      <Button
                        className="py-2 px-4 rounded-2xl hover:text-white hover:bg-lightBlue capitalize bg-gray-200 text-black"
                      >
                        {status}
                      </Button>
                    ))
                  }
              </div>
          </div>
          <div className="my-5">
              <span className="font-semibold text-xl">Region</span>
              <div className="mt-5 flex space-x-5 w-full overflow-x-auto no-scrollbar">
                  {
                    filterData.region.map(region=>(
                      <Button
                        className="py-2 px-4 rounded-2xl hover:text-white hover:bg-lightBlue capitalize bg-gray-200 text-black"
                      >
                        {region}
                      </Button>
                    ))
                  }
              </div>
          </div>
          <div className="my-5">
              <span className="font-semibold text-xl">Project creator Gender</span>
              <div className="mt-5 flex space-x-5 w-full overflow-x-auto no-scrollbar">
                  {
                    filterData.authorGender.map(gender=>(
                      <Button
                        className="py-2 px-4 rounded-2xl hover:text-white hover:bg-lightBlue capitalize bg-gray-200 text-black"
                      >
                        {gender}
                      </Button>
                    ))
                  }
              </div>
          </div>
          <Button 
            className="bg-darkBlue h-12 hover:bg-lightBlue mt-5 rounded-[100px] w-[90%] mx-auto text-white"
          >
            Apply filter
          </Button>
        </div> 
    </div>
  )
}

export default FilterModal