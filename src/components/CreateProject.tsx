import { useAppSelector } from "@/redux/hooks"
import { selectProject } from "@/redux/slices/projectSlice"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"
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
import { useEffect, useState } from "react";
import MediaUpload from "./MediaUpload";
import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProjectMutation, useGetProjectCategoriesQuery, useGetProjectTypesQuery, useGetProvincesQuery, useGetTerritoriesQuery } from "@/redux/services/projectServices";
import { selectUser } from "@/redux/slices/userSlice";
import LoadingComponent from "./LoadingComponent";
import toast from "react-hot-toast";



function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


const formSchema = z.object({
  name: z.string().min(3, "Project name is required"),
  type: z.string(),
  category: z.string(),
  description: z.string().min(3, "Description is required"),
  province: z.string().min(3, "Province is required"),
  territory: z.string().min(3, "Territory is required"),
  currency: z.enum(["USD", "EUR", "CDF"]),
  targetAmount: z.coerce.number().min(1, "Target amount is required"),
  projectOwner: z.string().min(1, "Project owner ID is required").optional(),
  medias: z.array(z.instanceof(File)).optional(),
  attachments: z.array(z.instanceof(File)).optional(),
});

type FormValues = z.infer<typeof formSchema>;

function CreateProject() {
    const project=useAppSelector(selectProject)
    const navigate=useNavigate()
    const [date, setDate] = useState<Date>(new Date());
    const [upload,setUpload]=useState(true)
    const [embededLink,setEmbededLink]=useState(false)
    const [unsplash,setUnsplash]=useState(false)
    const user=useAppSelector(selectUser)
    const [uploadedMedias, setUploadedMdias] = useState<File[]>([]);
    const [uploadedAttachments, setUploadedAttachments] = useState<File[]>([]);
    const [next,setNext]=useState(true)
    const formattedDate =formatDate(date);

    const {
      register,
      handleSubmit,
      setValue,
      watch,
      formState: { errors },
    } = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues:{
        type:"",
        category:"",
        province:"",
        territory:"",
        currency:"USD"
      }
    });

    //const attachments = useWatch<FileList | undefined>({ name: "attachments" });
    
    const handleMediasChange = (files: File[]) => {
      setUploadedMdias(files);
    };

    const handleAttachmentsChange = (files: File[]) => {
      setUploadedAttachments(files);
    };
    
    const [
      CreateProject,
      {
        data:createProjectData,
        error:createProjectError,
        isSuccess:createProjectIsSuccess,
        isError:createProjectIsError,
        isLoading:createProjectIsLoading
      }
    ]=useCreateProjectMutation()

    const 
      {
        data:getProvincesData,
        error:getProvincesError,
        isSuccess:getProvincesIsSuccess,
        isError:getProvincesIsError,
        isLoading:getProvincesIsLoading
      }=useGetProvincesQuery(undefined)

    const {
      data:getTerritoriesData,
      error:getTerritoriesError,
      isSuccess:getTerritoriesIsSuccess,
      isError:getTerritoriesIsError,
      isLoading:getTerritoriesIsLoading
    }=useGetTerritoriesQuery(undefined)

    const {
      data:projectCategoriesData,
      error:projectCategoriesError,
      isError:projectCategoriesIsError,
      isLoading:projectCategoriesIsLoading,
      isSuccess:projectCategoriesIsSuccess
    }=useGetProjectCategoriesQuery(undefined)


    const {
      data:projectTypesData,
      error:projectTypesError,
      isSuccess:projectTypesIsSuccess,
      isError:projectTypesIsError,
      isLoading:projectTypesIsLoading
    }=useGetProjectTypesQuery(undefined)


    const onsubmit=async(data:FormValues)=>{
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("type", data.type);
      formData.append("category", data.category);
      formData.append("description", data.description);
      formData.append("province", data.province);
      formData.append("territory", data.territory);
      formData.append("endDate", formattedDate);
      formData.append("currency", data.currency);
      formData.append("targetAmount", data.targetAmount?.toString());
      formData.append("projectOwner", user._id);

      uploadedMedias.forEach((file) => {
        formData.append("medias[]", file);
      });
    
      uploadedAttachments.forEach((file) => {
        formData.append("attachments[]", file);
      });
      
      try {
        const response = await CreateProject(formData).unwrap();
        toast.success("Project created successfully!");
        navigate("/projects");
      } catch (err) {
        console.error("Error creating project:", err);
        toast.error("Failed to create project!");
      }
      
      // console.log("medias",uploadedMedias)
      // console.log("attachment",uploadedAttachments)
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
        //  CreateProject((key,value))
      }

      // console.log("date",formattedDate)

    }



    useEffect(()=>{
      if(createProjectData && createProjectIsSuccess){
        console.log("created project successfully!",createProjectData)
      }
      if(createProjectIsError){
        console.log("error while creating a project",createProjectError)
        toast.error("cannot create project")
      }
    },[createProjectIsError,createProjectIsSuccess])

    useEffect(()=>{
      if(getProvincesData && getProvincesIsSuccess){
        //console.log("all provinces",getProvincesData)
      }
      if(getProvincesIsError){
        console.log("getting provinces error",getProvincesError)
      }
    },[getProvincesIsError,getProvincesIsSuccess])

    useEffect(()=>{
      if(getTerritoriesIsSuccess && getTerritoriesData){
        //console.log("territories data",getTerritoriesData)
      }
      if(getTerritoriesIsError){
        console.log("error while getting territories",getTerritoriesError)
      }
    },[getTerritoriesIsSuccess,getTerritoriesIsError])


    useEffect(()=>{
      if(projectCategoriesIsSuccess && projectCategoriesData){
        //console.log("project categories data:",projectCategoriesData)
      }
      if(projectCategoriesIsError){
        console.log("unable to fetch project categories",projectCategoriesError)
      }
    },[projectCategoriesIsSuccess,projectCategoriesIsError])

    useEffect(()=>{
      if(projectTypesIsSuccess && projectTypesData){
        //console.log("project types data:",projectTypesData)
      }
      if(projectTypesIsError){
        console.log("unable to fetch project types",projectTypesError)
      }

    },[projectTypesIsSuccess,projectTypesIsError])


    //errors handling
    useEffect(()=>{
      console.log("errors",errors)
    },[errors])

    // useEffect(() => {
    //   console.log("Watched values:", watch());
    // }, [watch()]);

    //console.log("edit project page",project)
  return (
    <form onSubmit={handleSubmit(onsubmit)} className="grid grid-cols-1 gap-y-5 lg:grid-cols-2 gap-x-10 p-5 md:p-10">
        <div className="w-[98%] md:w-3/4 mx-auto">
          <div className="flex items-center space-x-10 ">
            
            <span className="font-bold text-2xl">Create your Project</span>
          </div>
          <div  className="">
            <div className="grid w-full gap-2 mt-10">
              <Label htmlFor="project-name">Project Name</Label>
              <Textarea {...register("name")} rows={2} placeholder="Support 230 children to get school fees" id="project-name" />
            </div>
            <div className="grid grid-cols-2 mt-5 gap-x-5">
                <div className="flex flex-col space-y-1 my-5">
                  <label className="font-semibold">Project category</label>
                  {
                    projectCategoriesIsLoading && <div className="text-blue-600">
                      <LoadingComponent />
                    </div>
                  }
                  {
                    !projectCategoriesIsLoading && projectCategoriesData?.length===0 && <div className="text-red-600 font-semibold">
                      <span className="font-semibold">No Project Categories available</span>
                    </div>
                  }
                  {
                    projectCategoriesData?.length > 0 && 
                    <Select onValueChange={(value) => setValue("category", value)}>
                      <SelectTrigger className="w-full h-10 border border-gray-200 mt-1">
                        <SelectValue placeholder="Select project category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Project category</SelectLabel>
                          {
                            projectCategoriesData?.map((item:any)=>(
                              <SelectItem 
                                key={item._id} 
                                value={item.name}
                                disabled={item.status !== "ENABLED"} 
                                className={item.status !== "ENABLED" ? "opacity-50 cursor-not-allowed" : ""}
                              >
                                {item.name}
                              </SelectItem>
                            ))
                          }
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  }
                </div>
                <div className="flex flex-col space-y-1 my-5">
                  <label className="font-semibold">Project type</label>
                  {
                    projectTypesIsLoading && <div className="text-blue-600">
                      <LoadingComponent />
                    </div>
                  }
                  {
                    !projectTypesIsLoading && projectTypesData?.length===0 && <div className="text-red-600 font-semibold">
                      <span className="font-semibold">No Project Type</span>
                    </div>
                  }
                  {
                    projectTypesData?.length > 0 && 
                    <Select onValueChange={(value) => setValue("type", value)}>
                      <SelectTrigger className="w-full h-10 border border-gray-200 mt-1">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Project type</SelectLabel>
                          {
                            projectTypesData?.map((item:any)=>(
                              <SelectItem 
                                key={item._id} 
                                value={item.name}
                                disabled={item.status !== "ENABLED"} 
                                className={item.status !== "ENABLED" ? "opacity-50 cursor-not-allowed" : ""}
                              >
                                {item.name}
                              </SelectItem>
                            ))
                          }
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  }
                </div>
            </div>
            <div className="grid w-full gap-2 mt-5">
              <Label htmlFor="project-description">Project Description</Label>
              <Textarea 
                {...register("description")}
                rows={5} 
                placeholder="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu" 
                id="project-description" 
              />
            </div>
            <div className="grid grid-cols-2 mt-5 gap-x-5">
                <div className="flex flex-col space-y-1 my-5">
                  <label className="font-semibold">Currency</label>
                  <Select onValueChange={(value) => setValue("currency", value as "USD"|"EUR"|"CDF")}>
                    <SelectTrigger className="w-full h-10 border border-gray-200 mt-1">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Currency</SelectLabel>
                        <SelectItem value="CDF">CDF</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
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
                  {
                    getProvincesIsLoading && <div className="text-blue-600">
                      <LoadingComponent />
                    </div>
                  }
                  {
                    !getProvincesIsLoading && getProvincesData?.length===0 && <div className="text-red-600 font-semibold">
                      <span className="font-semibold">No Provinces available</span>
                    </div>
                  }
                  {
                    getProvincesData?.length > 0 && 
                    <Select onValueChange={(value) => setValue("province", value)}>
                      <SelectTrigger className="w-full h-10 border border-gray-200 mt-1">
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Province</SelectLabel>
                          {
                            getProvincesData?.map((item:any)=>(
                              <SelectItem 
                                key={item._id} 
                                value={item.name}
                                disabled={item.status !== "ENABLED"} 
                                className={item.status !== "ENABLED" ? "opacity-50 cursor-not-allowed" : ""}
                              >
                                {item.name}
                              </SelectItem>
                            ))
                          }
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  }
                  
                </div>
                <div className="flex flex-col space-y-1 my-5">
                  <label className="font-semibold">Territory</label>
                  {
                    getTerritoriesIsLoading && <div className="text-blue-600">
                      <LoadingComponent />
                    </div>
                  }
                  {
                    !getTerritoriesIsLoading && getTerritoriesData?.length===0 && <div className="text-red-600 font-semibold">
                      <span className="font-semibold">No Provinces available</span>
                    </div>
                  }
                  {
                    getTerritoriesData?.length >0 && 
                    <Select onValueChange={(value) => setValue("territory", value)}>
                      <SelectTrigger className="w-full h-10 border border-gray-200 mt-1">
                        <SelectValue placeholder="Select Territory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Territory</SelectLabel>
                          {
                            getTerritoriesData?.map((item:any)=>(
                              <SelectItem 
                                key={item._id} 
                                value={item.name}
                                disabled={item.status !== "ENABLED"} 
                                className={item.status !== "ENABLED" ? "opacity-50 cursor-not-allowed" : ""}
                              >
                                {item.name}
                              </SelectItem>
                            ))
                          }
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  }
                  
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
                <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
                  <Select
                    onValueChange={(value) => setDate(addDays(new Date(), parseInt(value)))}
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
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(selectedDate) => selectedDate && setDate(selectedDate)}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            {
              next && 
              <Button
                type="button"
                onClick={()=>setNext(false)}
                className="bg-darkBlue h-14 text-white hover:bg-lightBlue rounded-[100px] w-full mt-10"
              >
                  Next
              </Button>
            }
          </div>
        </div>
        <div className="">
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
                <MediaUpload isDisabled={next} onFilesChange={handleMediasChange} />
            </div>
          </div>
          <div className="w-3/4 mx-auto mt-5">
            <span className="text-black font-semibold text-2xl">Project Attachments</span>
            
            <div className="mt-8">
                <MediaUpload isDisabled={next} onFilesChange={handleAttachmentsChange} />
            </div>
          </div>

          {
            !next && 
            <Button
              type="submit"
              className="h-12 w-[50%] ml-[15%] mt-5 text-white bg-darkBlue rounded-[100px]"
            >
              {createProjectIsLoading ? <LoadingComponent /> : "Create project"}
            </Button>
          }
        </div>
        
    </form>
  )
}

export default CreateProject