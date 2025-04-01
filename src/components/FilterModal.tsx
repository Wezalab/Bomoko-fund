import { filterData } from "@/constants/dummydata";
import { MdCancel } from "react-icons/md";
import { Button } from "./ui/button";
import { useState } from "react";


interface filterModalProps{
  setFilterProject:any
  onClose:any 
  setFilterData:any
}

interface FilterDatasProps{
  category:string[]
  date:string 
  status:string 
  region:string[]
  authorGender:string
}

function FilterModal({setFilterProject,onClose,setFilterData}:filterModalProps) {
  const [filterDatas,setFilterDatas]=useState<FilterDatasProps>({
    category:[],
    date:"",
    status:"",
    region:[],
    authorGender:""
  })

    // Toggle category selection
    const toggleCategory = (category: string) => {
      setFilterDatas((prev) => ({
        ...prev,
        category: prev.category.includes(category)
          ? prev.category.filter((c) => c !== category) // Remove if already selected
          : [...prev.category, category], // Add if not selected
      }));
    };
  
    // Update single values
    const updateFilter = (key: keyof FilterDatasProps, value: string) => {
      setFilterDatas((prev) => ({ ...prev, [key]: value }));
    };
  
    // Toggle region selection
    const toggleRegion = (region: string) => {
      setFilterDatas((prev) => ({
        ...prev,
        region: prev.region.includes(region)
          ? prev.region.filter((r) => r !== region)
          : [...prev.region, region],
      }));
    };
  
    const handleFilters = () => {
      //console.log("Applied filters:", filterDatas);
      setFilterData(filterDatas);
      setFilterProject()
      onClose()
    };

  return (
    <div className="bg-white relative rounded-2xl w-full shadow-md py-10 md:px-5">
        <div className="px-5">
          <MdCancel onClick={()=>{
            setFilterData({
              category:[],
              date:"",
              status:"",
              region:[],
              authorGender:""
            }),
            onClose()
          }} className="absolute top-10 right-10 cursor-pointer" size={24} />
          <div className="mt-10 flex items-center justify-center">
              <span className="text-2xl font-semibold">Filter projects</span>
          </div>
          <div className="my-5">
              <span className="font-semibold text-xl">Project Category</span>
              <div className="mt-5 flex space-x-5 w-full overflow-x-auto no-scrollbar">
                  {
                    filterData.category.map((category:string)=>(
                      <Button
                        key={category}
                        onClick={()=>toggleCategory(category)}
                        className={filterDatas.category.includes(category) ? "py-2 px-4 rounded-2xl text-white bg-lightBlue capitalize" :"py-2 px-4 rounded-2xl hover:text-white hover:bg-lightBlue capitalize bg-gray-200 text-black"}
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
                        onClick={()=>updateFilter("date",date)}
                        className={filterDatas.date === date ? "py-2 px-4 rounded-2xl text-white bg-lightBlue capitalize":"py-2 px-4 rounded-2xl hover:text-white hover:bg-lightBlue capitalize bg-gray-200 text-black"}
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
                        onClick={()=>updateFilter("status",status.toUpperCase())}
                        className={filterDatas.status.toLowerCase() === status.toLowerCase() ? "py-2 px-4 rounded-2xl text-white bg-lightBlue capitalize" :"py-2 px-4 rounded-2xl hover:text-white hover:bg-lightBlue capitalize bg-gray-200 text-black"}
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
                        onClick={()=>toggleRegion(region)}
                        className={filterDatas.region.includes(region) ? "py-2 px-4 rounded-2xl text-white bg-lightBlue capitalize" :"py-2 px-4 rounded-2xl hover:text-white hover:bg-lightBlue capitalize bg-gray-200 text-black"}
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
                        onClick={()=>updateFilter("authorGender",gender)}
                        className={filterDatas.authorGender.toLowerCase() === gender.toLowerCase() ? "py-2 px-4 rounded-2xl text-white bg-lightBlue capitalize" :"py-2 px-4 rounded-2xl hover:text-white hover:bg-lightBlue capitalize bg-gray-200 text-black"}
                        >
                        {gender}
                      </Button>
                    ))
                  }
              </div>
          </div>
          <Button 
            onClick={handleFilters}
            className="bg-darkBlue h-12 hover:bg-lightBlue mt-5 rounded-[100px] w-[90%] mx-auto text-white"
          >
            Apply filter
          </Button>
        </div> 
    </div>
  )
}

export default FilterModal