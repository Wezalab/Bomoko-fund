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
import { useEffect, useState } from "react";
import MediaUpload from "./MediaUpload";
import { useEditProjectMutation, useGetProjectCategoriesQuery, useGetProjectQuery, useGetProjectTypesQuery, useGetProvincesQuery, useGetTerritoriesQuery } from "@/redux/services/projectServices";
import { z } from "zod";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingComponent from "./LoadingComponent";
import { selectUser } from "@/redux/slices/userSlice";
import { Description } from "@radix-ui/react-dialog";
import { current } from "@reduxjs/toolkit";



function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const formSchema = z.object({
  name: z.string().min(3, "Project name is required").optional(),
  type: z.string().optional(),
  category: z.string().optional(),
  description: z.string().min(3, "Description is required").optional(),
  province: z.string().min(3, "Province is required").optional(),
  territory: z.string().min(3, "Territory is required").optional(),
  currency: z.enum(["USD", "EUR", "CDF"]).optional(),
  targetAmount: z.coerce.number().min(1, "Target amount is required").optional(),
  projectOwner: z.string().min(1, "Project owner ID is required").optional(),
  medias: z.array(z.instanceof(File)).optional(),
  attachments: z.array(z.instanceof(File)).optional(),
});

type FormValues = z.infer<typeof formSchema>;

function EditProject() {
    const project=useAppSelector(selectProject)
    const navigate=useNavigate()
    // const [date, setDate] =useState<Date | null>()
    const [upload,setUpload]=useState(true)
    const [embededLink,setEmbededLink]=useState(false)
    const [unsplash,setUnsplash]=useState(false)
    const [uploadedMedias, setUploadedMdias] = useState<File[]>([]);
    const [uploadedAttachments, setUploadedAttachments] = useState<File[]>([]);
    const [next,setNext]=useState(true)
    const user=useAppSelector(selectUser)
    //@ts-ignore
    // const formattedDate =formatDate(date);
    const [values,setValues]=useState({
      name:"",
      type:"",
      category:"",
      Description:"",
      province:"",
      territory:"",
      currency:"",
      targetAmount:0
    })

    const  [
      EditProject,
      {
        data:editProjectData,
        error:editProjectError,
        isLoading:editProjectIsLoading,
        isError:editProjectIsError,
        isSuccess:editProjectIsSuccess
      }
    ]=useEditProjectMutation()



    const {
      data:projectData,
      isLoading:projectIsLoading,
      error:projectError,
      isSuccess:projectIsSuccess,
      isError:projectIsError
    }=useGetProjectQuery(project._id)

    const handleMediasChange = (files: File[]) => {
      setUploadedMdias(files);
    };

    const handleAttachmentsChange = (files: File[]) => {
      setUploadedAttachments(files);
    };

    const {
          register,
          handleSubmit,
          setValue,
          reset,
          watch,
          formState: { errors },
        } = useForm<FormValues>({
          resolver: zodResolver(formSchema),
        });

    const {
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
    
        // const {
        //       register,
        //       handleSubmit,
        //       setValue,
        //       reset,
        //       watch,
        //       formState: { errors },
        //     } = useForm<FormValues>({
        //       resolver: zodResolver(formSchema),
        //       defaultValues:{
        //         type:"",
        //         category:"",
        //         province:"",
        //         territory:"",
        //         currency:"USD"
        //       }
        //     });

        const onsubmit=async(e:any)=>{
          e.preventDefault()
          console.log("[DEBUG] Edit - Form submission started");
          
          const formData = new FormData();

          console.log("[DEBUG] Edit - Current values being added to FormData:", values);
          
          Object.entries(values).forEach(([key, value]) => {
            // Only append if it's a non-empty string or a non-zero number
            if ((typeof value === "string" && value !== "") || 
                (typeof value === "number" && value !== 0)) {
                  //@ts-ignore
              console.log(`[DEBUG] Edit - Adding ${key} to FormData:`, value);
              // Convert any value to string to ensure compatibility with FormData
              formData.append(key, String(value));
            }
          });

          console.log("[DEBUG] Edit - Adding projectOwner to FormData:", user._id);
          formData.append("projectOwner", user._id);

          // Log media files
          console.log("[DEBUG] Edit - Media files being uploaded:", uploadedMedias);
          uploadedMedias.forEach((file, index) => {
            console.log(`[DEBUG] Edit - Adding media file ${index} to FormData:`, file.name);
            formData.append(`medias[${index}]`, file);
          });
          
          // Log attachment files
          console.log("[DEBUG] Edit - Attachment files being uploaded:", uploadedAttachments);
          uploadedAttachments.forEach((file, index) => {
            console.log(`[DEBUG] Edit - Adding attachment file ${index} to FormData:`, file.name);
            formData.append(`attachments[${index}]`, file);
          });

          try {
            console.log("[DEBUG] Edit - Calling EditProject API with FormData for project ID:", project._id);
            const response = await EditProject({id:project._id,data:formData}).unwrap();
            console.log("[DEBUG] Edit - Project update successful. Response:", response);
            toast.success("Project edited successfully!");
            navigate("/projects");
          } catch (err) {
            console.error("[DEBUG ERROR] Edit - Project update failed with error:", err);
            // More detailed error logging
            if ((err as any)?.status) {
              console.error("[DEBUG ERROR] Edit - Error status:", (err as any).status);
            }
            if ((err as any)?.data) {
              console.error("[DEBUG ERROR] Edit - Error response data:", (err as any).data);
            }
            toast.error("Failed to updating project!");
          }
          
          // Log FormData entries for debugging
          console.log("[DEBUG] Edit - FormData entries:");
          for (let [key, value] of formData.entries()) {
            console.log(`[DEBUG] Edit - FormData entry - ${key}:`, value);
          }
        }


    useEffect(()=>{
      if(editProjectData && editProjectIsSuccess){
        console.log("successfully updated project",editProjectData)
        toast.success("project edited successfully!")
      }
      if(editProjectIsError){
        console.log("error while editing Project",editProjectError)
      }
    },[editProjectIsError,editProjectIsSuccess])

    

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
      console.log("[DEBUG] Edit - Form Errors:", errors);
      if (Object.keys(errors).length > 0) {
        console.log("[DEBUG] Edit - Form has validation errors:");
        Object.entries(errors).forEach(([field, error]) => {
          console.error(`[DEBUG ERROR] Edit - Field: ${field}, Error:`, error);
        });
      }
    },[errors])

    useEffect(()=>{
      if(projectIsSuccess && projectData){
        //console.log("project data:",projectData)
      }
      if(projectIsError){
        console.log("error getting project",projectError)
      }
    },[projectIsError,projectIsSuccess])

    //console.log("edit project page",project)

    // Enhanced logging for Select dropdowns
    const handleCategoryChange = (value: string) => {
      console.log("[DEBUG] Edit - Category selected:", value);
      console.log("[DEBUG] Edit - Available categories:", projectCategoriesData);
      setValues({...values, category: value});
    };

    const handleTypeChange = (value: string) => {
      console.log("[DEBUG] Edit - Type selected:", value);
      console.log("[DEBUG] Edit - Available types:", projectTypesData);
      setValues({...values, type: value});
    };

    const handleProvinceChange = (value: string) => {
      console.log("[DEBUG] Edit - Province selected:", value);
      console.log("[DEBUG] Edit - Available provinces:", getProvincesData);
      setValues({...values, province: value});
    };

    const handleTerritoryChange = (value: string) => {
      console.log("[DEBUG] Edit - Territory selected:", value);
      console.log("[DEBUG] Edit - Available territories:", getTerritoriesData);
      setValues({...values, territory: value});
    };

  return (
    <form  className="grid grid-cols-1 gap-y-5 lg:grid-cols-2 gap-x-10 p-5 md:p-10">
          <div className="w-[98%] md:w-3/4 mx-auto">
            <div className="flex items-center space-x-10 ">
              <Button
                  onClick={()=>{
                      navigate(`/projects/${project._id}`)
                  }}
                  className="text-black flex items-center space-x-2 hover:text-white h-6 md:h-9 text-sm md:text-xl max-w-fit px-2 md:px-3 rounded-[100px]  bg-gray-300 hover:bg-lightBlue"
              >
                  <IoChevronBack size={20} />
                  Back
              </Button>
              <span className="font-bold text-2xl">Edit Project({project?.name})</span>
            </div>
            <div className="">
              <div className="grid w-full gap-2 mt-10">
                <Label htmlFor="project-name">Project Name</Label>
                <Textarea 
                  onChange={(e)=>setValues({...values,name:e.target.value})}
                  rows={2} 
                  placeholder={project.name} 
                  id="project-name" 
                />
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
                      <Select onValueChange={handleCategoryChange}>
                        <SelectTrigger className="w-full h-10 border border-gray-200 mt-1">
                          <SelectValue placeholder={project?.category.name} />
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
              </div>
              <div className="grid w-full gap-2 mt-5">
                <Label htmlFor="project-description">Project Description</Label>
                <Textarea 
                  onChange={(e)=>setValues({...values,Description:e.target.value})}
                  rows={5} 
                  placeholder={project?.description} 
                  id="project-description" 
                />
              </div>
              <div className="grid grid-cols-2 mt-5 gap-x-5">
                  <div className="flex flex-col space-y-1 my-5">
                    <label className="font-semibold">Currency</label>
                    <Select onValueChange={(value) => setValues({...values,currency: value})}>
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
                        onChange={(e)=>setValues({...values,targetAmount:Number(e.target.value)})}
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
                      <Select onValueChange={handleProvinceChange}>
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
                      <Select onValueChange={handleTerritoryChange}>
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
              {/* <div className="flex flex-col space-y-1 my-5">
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
                      <Calendar mode="single"  onSelect={setDate} />
                    </div>
                  </PopoverContent>
                </Popover>
              </div> */}
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
                  <MediaUpload isDisabled={next} accept="image/*" onFilesChange={handleMediasChange} />
              </div>
            </div>
            <div className="w-3/4 mx-auto mt-5">
              <span className="text-black font-semibold text-2xl">Project Attachments</span>
              
              <div className="mt-8">
                  <MediaUpload isDisabled={next} accept="application/pdf,application/docx,application/xlsx" onFilesChange={handleAttachmentsChange} />
              </div>
            </div>
            {
              !next && 
              <Button
                type="submit"
                onClick={onsubmit}
                className="h-12 w-[50%] ml-[15%] mt-5 text-white bg-darkBlue rounded-[100px]"
              >
                {editProjectIsLoading ? <LoadingComponent /> : "Edit project"}
              </Button>
            }
          </div>
        
    </form>
  )
}

export default EditProject