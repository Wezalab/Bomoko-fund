import { useAppSelector } from "@/redux/hooks"
import { selectProject } from "@/redux/slices/projectSlice"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"
import { IoChevronBack } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { useState } from "react";
import MediaUpload from "./MediaUpload";


function CreateProject() {
    const project=useAppSelector(selectProject)
    const navigate=useNavigate()
    const [date, setDate] =useState<Date>()
    const [upload,setUpload]=useState(true)
    const [embededLink,setEmbededLink]=useState(false)
    const [unsplash,setUnsplash]=useState(false)

    const {
      register,
      handleSubmit,
      reset,
      formState:{errors}
    }=useForm()

    //console.log("edit project page",project)
  return (
    <div className="grid grid-cols-1 gap-y-5 lg:grid-cols-2 gap-x-10 p-5 md:p-10">
        <div className="w-[98%] md:w-3/4 mx-auto">
          <div className="flex items-center space-x-10 ">
            
            <span className="font-bold text-2xl">Create your Project</span>
          </div>
          <form className="">
            <div className="grid w-full gap-2 mt-10">
              <Label htmlFor="project-name">Project Name</Label>
              <Textarea rows={2} placeholder="Support 230 children to get school fees" id="project-name" />
            </div>
            <div className="grid grid-cols-2 mt-5 gap-x-5">
                <div className="flex flex-col space-y-1 my-5">
                  <label className="font-semibold">Project category</label>
                  <Select>
                    <SelectTrigger className="w-full h-10 border border-gray-200 mt-1">
                      <SelectValue placeholder="Select project category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Project category</SelectLabel>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1 my-5">
                  <label className="font-semibold">Project type</label>
                  <Select>
                    <SelectTrigger className="w-full h-10 border border-gray-200 mt-1">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Project type</SelectLabel>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
            </div>
            <div className="grid w-full gap-2 mt-5">
              <Label htmlFor="project-description">Project Description</Label>
              <Textarea 
                rows={5} 
                placeholder="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu" 
                id="project-description" 
              />
            </div>
            <div className="grid grid-cols-2 mt-5 gap-x-5">
                <div className="flex flex-col space-y-1 my-5">
                  <label className="font-semibold">Currency</label>
                  <Select>
                    <SelectTrigger className="w-full h-10 border border-gray-200 mt-1">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Currency</SelectLabel>
                        <SelectItem value="CDF">CDF</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1 my-5">
                  <label className="font-semibold">Target amount</label>
                  <div className="relative">
                    <Input 
                      {...register("targetAmount")}
                      className="h-10 rounded-xl w-full indent-2 text-black lg:text-md"
                      placeholder="Target amount"
                    />
                  </div>
                </div>
            </div>
            <div className="grid grid-cols-2 mt-5 gap-x-5">
                <div className="flex flex-col space-y-1 my-5">
                  <label className="font-semibold">Province</label>
                  <Select>
                    <SelectTrigger className="w-full h-10 border border-gray-200 mt-1">
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Province</SelectLabel>
                        <SelectItem value="north kivu">North Kivu</SelectItem>
                        <SelectItem value="south kivu">South Kivu</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1 my-5">
                  <label className="font-semibold">Territory</label>
                  <Select>
                    <SelectTrigger className="w-full h-10 border border-gray-200 mt-1">
                      <SelectValue placeholder="Select Territory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Territory</SelectLabel>
                        <SelectItem value="massissi">Massissi</SelectItem>
                        <SelectItem value="goma">Goma</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
            </div>
            <div className="flex flex-col space-y-1 my-5">
              <label className="font-semibold">Project end date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-10 justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="flex w-auto flex-col space-y-2 p-2"
                >
                  <Select
                    onValueChange={(value) =>
                      setDate(addDays(new Date(), parseInt(value)))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="0">Today</SelectItem>
                      <SelectItem value="1">Tomorrow</SelectItem>
                      <SelectItem value="3">In 3 days</SelectItem>
                      <SelectItem value="7">In a week</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="rounded-md border">
                    <Calendar mode="single" selected={date} onSelect={setDate} />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <Button
                type="submit"
                className="bg-darkBlue h-14 text-white hover:bg-lightBlue rounded-[100px] w-full mt-10"
            >
                Next
            </Button>
          </form>
        </div>
        <div className="w-3/4 mx-auto">
          <span className="text-black font-semibold text-2xl">Project media</span>
          <div className="mt-5 flex space-x-4">
            <div onClick={()=>{
                
            }} className={upload ? "flex flex-col cursor-not-allowed" :"flex cursor-pointer flex-col"}>
                <span className={upload ?"text-lightBlue font-semibold":"text-black"}>Upload</span>
                {upload &&<div className="w-[30px] h-1 bg-lightBlue"></div>}
            </div>
            <div onClick={()=>{
                
            }} className={embededLink ? "flex flex-col cursor-not-allowed" :"flex cursor-pointer flex-col"}>
                <span className={embededLink ?"text-lightBlue font-semibold":"text-black"}>Embeded Link</span>
                {embededLink && <div className="w-[30px] h-1 bg-lightBlue"></div>}
            </div>
            <div onClick={()=>{
                
              }} className={unsplash ? "flex flex-col cursor-not-allowed" :"flex cursor-pointer flex-col"}>
                  <span className={unsplash ?"text-lightBlue font-semibold":"text-black"}>Unplash</span>
                  {unsplash && <div className="w-[30px] h-1 bg-lightBlue"></div>}
              </div>
          </div>
          <div className="mt-8">
              <MediaUpload />
          </div>
        </div>
    </div>
  )
}

export default CreateProject