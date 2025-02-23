import Avatar from '../assets/Avatars Base.png'
import { Button } from './ui/button'
import { SlCloudUpload } from "react-icons/sl";
import { FaTrashCan } from "react-icons/fa6";
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/userSlice';
import { useEffect, useState } from 'react';
import { useEditProfileMutation} from '@/redux/services/userServices';
import toast from 'react-hot-toast';
import LoadingComponent from './LoadingComponent';


const formSchema=z.object({
    avatar: z
        .instanceof(FileList)
        .nullable()
        .optional(),
    gender:z.string().optional(),
    location:z.string().optional(),
    bio:z.string().optional()
})

type FormValues = z.infer<typeof formSchema>;

function ProfilePage() {
    const user=useAppSelector(selectUser)
    const [preview, setPreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
      } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
      });

      const [
        EditProfile,
        {
            data:editProfileData,
            error:editProfileError,
            isError:editProfileIsError,
            isSuccess:editProfileIsSuccess,
            isLoading:editProfileIsLoading
        }
      ]=useEditProfileMutation()

      

      const onsubmit = (data: FormValues) => {
        //console.log("save button pressed")
        const file = data.avatar?.[0]; // Get the selected file
        //console.log("Uploading file:", file);
    
        // Example: Create FormData to send the image

        const formData = new FormData();
        file && formData.append("avatar", file);
        data.gender && formData.append("gender",data.gender)
        data.location && formData.append("location",data.location)
        data.bio && formData.append("bio",data.bio)
    
        EditProfile({
            userId:user._id,
            data:formData
        })
        
      };

      useEffect(()=>{
        if(editProfileIsSuccess && editProfileData){
            console.log("profile edited successfully",editProfileData)
            toast.success("profile edited successfully!")
            reset()
        }
        if(editProfileIsError){
            console.log("error while editing profile",editProfileError)
            toast.error("unable to edit profile")
        }
      },[editProfileIsSuccess,editProfileIsError])

      

      //track errors
      useEffect(()=>{
        console.log("errors",errors)
      },[errors])

      //console.log("user details",user)
  return (
    <div className="bg-gray-200 h-[90vh] md:h-[70vh] p-2 md:pt-10">
        <form onSubmit={handleSubmit(onsubmit)} className='md:hidden'>
            <span className='text-semibold text-xl'>Profile</span>
            <div className='flex items-center space-x-5'>
                <div className="w-[100px] h-[100px] rounded-full mt-5">
                    {
                        !preview && 
                        <img 
                            src={Avatar}
                            className='w-full h-full rounded-full object-cover'
                            alt="profile-img"
                        />
                    }
                    {
                        preview && 
                        <img 
                            src={preview}
                            className='w-full h-full rounded-full object-cover'
                            alt="profile-img"
                        />
                    }
                </div>
                <div className=''>
                    <div
                        className='flex items-center space-x-2 px-5 py-1 rounded-[100px] hover:bg-blue-200 bg-lightBlue'
                    >
                        <SlCloudUpload color='white' />
                        <Input 
                            placeholder='Upload new picture'  
                            accept="image/*" 
                            type="file" 
                            {...register("avatar")}
                            className='border-none text-white' 
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setPreview(URL.createObjectURL(file));
                                    setValue("avatar",  e.target.files); // Update the form state
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className='mt-5 w-[90%]'>
            <div className="flex flex-col space-y-1 my-5">
                <div className=''>
                    <label className="font-semibold">Gender</label>
                    <Select onValueChange={(value) => setValue("gender", value as "M"| "F")}>
                        <SelectTrigger className="w-full h-10 border border-gray-200 mt-1">
                        <SelectValue placeholder="Select project category" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Gender</SelectLabel>
                            <SelectItem value="M">Male</SelectItem>
                            <SelectItem value="F">Female</SelectItem>
                        </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                  
                </div>
                <div className='flex flex-col space-y-1'>
                    <label>Location</label>
                    <Input 
                        {...register("location")}
                        placeholder="Goma"
                        className='h-10 border-[1px] border-black rounded-[100px]'
                    />
                </div>
                <div className='mt-5'>
                    <label>Bio</label>
                    <Textarea 
                        {...register("bio")}
                        placeholder='Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, '
                        className='border-[1px] border-black'
                        rows={5}
                    />
                </div>
                <Button
                    type="submit"
                    className='bg-darkBlue px-5 text-white rounded-[100px] w-full mt-5 h-10'
                >
                    {editProfileIsLoading ? <LoadingComponent /> :"Save changes"}
                </Button>
            </div>
        </form>
        {/* Small devices and large devices */}
        <form onSubmit={handleSubmit(onsubmit)} className="hidden md:block w-3/4 lg:w-2/4 rounded-md px-5 py-10 mx-auto bg-white">
            <span className="font-bold text-xl ml-2">Profile</span>
            <div className="flex items-center space-x-5">
                <div className="w-[100px] h-[100px] rounded-full mt-5">
                    {
                        !preview && 
                        <img 
                            src={Avatar}
                            className='w-full h-full rounded-full object-cover'
                            alt="profile-img"
                        />
                    }
                    {
                        preview && 
                        <img 
                            src={preview}
                            className='w-full h-full rounded-full object-cover'
                            alt="profile-img"
                        />
                    }
                    
                </div>
                <div className='flex items-center space-x-5'>
                    <div
                        className='flex items-center space-x-2 px-5 py-1 rounded-[100px] hover:bg-blue-200 bg-lightBlue'
                    >
                        <SlCloudUpload color='white' />
                        <Input 
                            placeholder='Upload new picture'  
                            accept="image/*" 
                            type="file" 
                            {...register("avatar")}
                            className='border-none text-white' 
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setPreview(URL.createObjectURL(file));
                                    setValue("avatar",  e.target.files); // Update the form state
                                }
                            }}
                        />
                    </div>
                    <Button
                        onClick={() => {
                            setPreview(null);
                            setValue("avatar", undefined); // Reset form file state
                        }}
                        className='flex items-center space-x-2 px-5 border-[1px] hover:bg-gray-100 border-black text-black rounded-[100px] bg-white'
                    >
                        <FaTrashCan color='black' />
                        Delete Picture
                    </Button>
                </div>
            </div>
            <div className='my-5'>
                <div className='grid grid-cols-2 gap-x-5'>
                    <div className=''>
                        <label className="font-semibold">Gender</label>
                        <Select onValueChange={(value) => setValue("gender", value as "M"| "F")}>
                            <SelectTrigger className="w-full h-10 border border-gray-200 mt-1">
                            <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Gender</SelectLabel>
                                <SelectItem value="M">Male</SelectItem>
                                <SelectItem value="F">Female</SelectItem>
                            </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className=''>
                        <label>Location</label>
                        <Input 
                            {...register("location")}
                            placeholder="Goma"
                            className='h-10 rounded-[100px]'
                        />
                    </div>
                </div>
                <div className='mt-5'>
                    <label>Bio</label>
                    <Textarea 
                        {...register("bio")}
                        placeholder='Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, '
                        className=''
                        rows={5}
                    />
                </div>
                <div className='mt-5 flex space-x-5'>
                    <Button
                        type="submit"
                        disabled={editProfileIsLoading}
                        className='bg-darkBlue px-5 text-white rounded-[100px] h-10'
                    >
                        {editProfileIsLoading ? <LoadingComponent />:"Save"}
                    </Button>
                    <Button
                        className='bg-white text-black border-[1px] border-black rounded-[100px] h-10'
                    >
                        Cancel
                    </Button>

                </div>
            </div>
        </form>
    </div>
  )
}

export default ProfilePage