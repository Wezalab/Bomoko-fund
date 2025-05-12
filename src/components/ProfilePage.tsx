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
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectUser, setUser } from '@/redux/slices/userSlice';
import { useEffect, useState } from 'react';
import { useEditProfileMutation} from '@/redux/services/userServices';
import toast from 'react-hot-toast';
import LoadingComponent from './LoadingComponent';

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
    avatar: z
        .instanceof(FileList)
        .refine(files => !files.length || files[0].size <= MAX_FILE_SIZE, {
            message: `Max file size is 5MB.`,
        })
        .refine(
            files => !files.length || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
            {
                message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
            }
        )
        .nullable()
        .optional(),
    gender: z.string().optional(),
    location: z.string().max(100, "Location must be less than 100 characters").optional(),
    bio: z.string().max(500, "Bio must be less than 500 characters").optional()
})

type FormValues = z.infer<typeof formSchema>;

// Type for API error response
interface ApiError {
    data?: {
        message?: string;
        errors?: Record<string, string[]>;
    };
    status?: number;
    message?: string;
}

function ProfilePage() {
    const user = useAppSelector(selectUser)
    const [preview, setPreview] = useState<string | null>(null);
    const dispatch = useAppDispatch()
    const [edit, setEdit] = useState(false)
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
      } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            gender: user?.gender || undefined,
            location: user?.location || '',
            bio: user?.bio || ''
        }
      });

      const [
        EditProfile,
        {
            data: editProfileData,
            error: editProfileError,
            isError: editProfileIsError,
            isSuccess: editProfileIsSuccess,
            isLoading: editProfileIsLoading
        }
      ] = useEditProfileMutation()

      // Initialize form with user data when edit mode is enabled
      useEffect(() => {
        if (edit && user) {
            setValue("gender", user.gender || undefined);
            setValue("location", user.location || '');
            setValue("bio", user.bio || '');
        }
      }, [edit, user, setValue]);

      const onsubmit = (data: FormValues) => {
        if (!user?._id) {
            toast.error("User ID not found. Please log in again.");
            return;
        }

        try {
            const file = data.avatar?.[0]; // Get the selected file
            const formData = new FormData();
            
            // Only append file if it exists
            if (file) {
                formData.append("avatar", file);
            }
            
            // Only append fields with values
            if (data.gender) formData.append("gender", data.gender);
            if (data.location) formData.append("location", data.location);
            if (data.bio) formData.append("bio", data.bio);
            
            // Call the API
            EditProfile({
                userId: user._id,
                data: formData
            });
        } catch (err) {
            console.error("Error submitting form:", err);
            toast.error("An unexpected error occurred. Please try again.");
        }
      };

      useEffect(() => {
        if (editProfileIsSuccess && editProfileData) {
            dispatch(setUser(editProfileData.updatedUser));
            toast.success("Profile updated successfully!");
            setEdit(false);
            setPreview(null);
            reset();
        }
        
        if (editProfileIsError && editProfileError) {
            const error = editProfileError as ApiError;
            
            // Handle different types of errors
            if (error.status === 413) {
                toast.error("File too large. Please upload a smaller image.");
            } else if (error.data?.message) {
                toast.error(error.data.message);
            } else if (error.message) {
                toast.error(error.message);
            } else {
                toast.error("Failed to update profile. Please try again.");
            }
            
            console.error("Profile update error:", error);
        }
      }, [editProfileIsSuccess, editProfileIsError, editProfileData, editProfileError, dispatch, reset]);

      // Handle file selection and validation
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            toast.error("File is too large. Maximum size is 5MB.");
            e.target.value = '';
            return;
        }
        
        // Validate file type
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            toast.error("Invalid file type. Only JPG, PNG and WebP are supported.");
            e.target.value = '';
            return;
        }
        
        setPreview(URL.createObjectURL(file));
        setValue("avatar", e.target.files);
      };

      // Cancel edit mode
      const handleCancel = () => {
        setEdit(false);
        setPreview(null);
        reset();
      };

  return (
    <div className="bg-gray-200 h-[90vh] py-5 p-2 md:pt-10">
        
        <form onSubmit={handleSubmit(onsubmit)} className='md:hidden'>
            <span className='text-semibold text-xl'>Profile</span>
            <div className='flex items-center space-x-5'>
                <div className="w-[100px] h-[100px] rounded-full mt-5">
                    {
                        !preview && user?.avatar ? (
                            <img 
                                src={user.avatar}
                                className='w-full h-full rounded-full object-cover'
                                alt="profile-img"
                            />
                        ) : !preview ? (
                            <img 
                                src={Avatar}
                                className='w-full h-full rounded-full object-cover'
                                alt="profile-img"
                            />
                        ) : (
                            <img 
                                src={preview}
                                className='w-full h-full rounded-full object-cover'
                                alt="profile-img"
                            />
                        )
                    }
                </div>
                <div className=''>
                    <div
                        className='flex items-center space-x-2 px-5 py-1 rounded-[100px] hover:bg-blue-200 bg-lightBlue'
                    >
                        <SlCloudUpload color='white' />
                        <Input 
                            disabled={!edit}
                            placeholder='Upload new picture'  
                            accept={ACCEPTED_IMAGE_TYPES.join(',')} 
                            type="file" 
                            {...register("avatar")}
                            className='border-none text-white' 
                            onChange={handleFileChange}
                        />
                    </div>
                    {errors.avatar && (
                        <p className="text-red-500 text-sm mt-1">{errors.avatar.message as string}</p>
                    )}
                </div>
            </div>
            {
                edit && (
                    <div className='my-5 w-[90%]'>
                        <div className="flex flex-col space-y-1 my-5">
                            <div className=''>
                                <label className="font-semibold">Gender</label>
                                <Select 
                                    defaultValue={user?.gender}
                                    onValueChange={(value) => setValue("gender", value as "M"| "F")}
                                >
                                    <SelectTrigger className="w-full h-10 border border-gray-200 mt-1">
                                    <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Gender</SelectLabel>
                                        <SelectItem value="M">Male</SelectItem>
                                        <SelectItem value="F">Female</SelectItem>
                                    </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.gender && (
                                    <p className="text-red-500 text-sm mt-1">{errors.gender.message as string}</p>
                                )}
                            </div>
                            
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <label>Location</label>
                            <Input 
                                {...register("location")}
                                placeholder="Goma"
                                className='h-10 border-[1px] border-black rounded-[100px]'
                            />
                            {errors.location && (
                                <p className="text-red-500 text-sm mt-1">{errors.location.message as string}</p>
                            )}
                        </div>
                        <div className='mt-5'>
                            <label>Bio</label>
                            <Textarea 
                                {...register("bio")}
                                placeholder='Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, '
                                className='border-[1px] border-black'
                                rows={5}
                            />
                            {errors.bio && (
                                <p className="text-red-500 text-sm mt-1">{errors.bio.message as string}</p>
                            )}
                        </div>
                        <div className="flex space-x-3 mt-5">
                            <Button
                                type="submit"
                                disabled={editProfileIsLoading}
                                className='bg-darkBlue px-5 text-white rounded-[100px] w-full h-10'
                            >
                                {editProfileIsLoading ? <LoadingComponent /> :"Save changes"}
                            </Button>
                            <Button
                                type="button"
                                onClick={handleCancel}
                                className='bg-white text-black border-[1px] border-black rounded-[100px] w-full h-10'
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )
            }
            {
                !edit && (
                    <div className='my-5'>
                        <div className='flex items-center mb-4 space-x-2'>
                            <span className='font-bold'>Email:</span>
                            <span className='font-thin'>{user?.email}</span>
                        </div>
                        {
                            user?.phone_number &&
                            <div className='flex items-center mb-4 space-x-2'>
                                <span className='font-bold'>Phone:</span>
                                <span className='font-thin'>{user?.phone_number}</span>
                            </div>
                        }
                        <div className='flex items-center mb-4 space-x-2'>
                            <span className='font-bold'>Location:</span>
                            <span className='font-thin'>{user?.location || 'Not specified'}</span>
                        </div>
                        {
                            user?.bio && (
                                <div className='flex items-center mb-4 space-x-2'>
                                    <span className='font-bold'>Bio:</span>
                                    <span className='font-thin'>{user?.bio}</span>
                                </div>
                            )
                        }
                        <Button
                            onClick={()=>setEdit(true)}
                            className='max-w-fit px-10 mt-5 bg-lightBlue py-2 rounded-[100px]'
                        >
                            Edit
                        </Button>
                        
                    </div>
                )
            }
            
        </form>
        {/* Small devices and large devices */}
        <form onSubmit={handleSubmit(onsubmit)} className="hidden md:block w-3/4 lg:w-2/4 rounded-md px-5 py-10 mx-auto bg-white">
            <span className="font-bold text-xl ml-2">Profile</span>
            <div className="flex items-center space-x-5">
                <div className="w-[100px] h-[100px] rounded-full mt-5">
                    {
                        !preview && user?.avatar ? (
                            <img 
                                src={user.avatar}
                                className='w-full h-full rounded-full object-cover'
                                alt="profile-img"
                            />
                        ) : !preview ? (
                            <img 
                                src={Avatar}
                                className='w-full h-full rounded-full object-cover'
                                alt="profile-img"
                            />
                        ) : (
                            <img 
                                src={preview}
                                className='w-full h-full rounded-full object-cover'
                                alt="profile-img"
                            />
                        )
                    }
                </div>
                <div className='flex items-center space-x-5'>
                    <div
                        className='flex items-center space-x-2 px-5 py-1 rounded-[100px] hover:bg-blue-200 bg-lightBlue'
                    >
                        <SlCloudUpload color='white' />
                        <Input 
                            disabled={!edit}
                            placeholder='Upload new picture'  
                            accept={ACCEPTED_IMAGE_TYPES.join(',')} 
                            type="file" 
                            {...register("avatar")}
                            className='border-none text-white' 
                            onChange={handleFileChange}
                        />
                    </div>
                    <Button
                        disabled={!edit || !preview}
                        onClick={() => {
                            setPreview(null);
                            setValue("avatar", undefined); // Reset form file state
                        }}
                        className='hidden md:flex items-center space-x-2 px-5 border-[1px] hover:bg-gray-100 border-black text-black rounded-[100px] bg-white'
                    >
                        <FaTrashCan color='black' />
                        Delete Picture
                    </Button>
                </div>
            </div>
            {errors.avatar && (
                <p className="text-red-500 text-sm mt-1 ml-2">{errors.avatar.message as string}</p>
            )}
            {
                edit && (
                    <div className='my-10'>
                        <div className='grid grid-cols-2 gap-x-5'>
                            <div className=''>
                                <label className="font-semibold">Gender</label>
                                <Select 
                                    defaultValue={user?.gender}
                                    onValueChange={(value) => setValue("gender", value as "M"| "F")}
                                >
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
                                {errors.gender && (
                                    <p className="text-red-500 text-sm mt-1">{errors.gender.message as string}</p>
                                )}
                            </div>
                            <div className=''>
                                <label>Location</label>
                                <Input 
                                    {...register("location")}
                                    placeholder="Goma"
                                    className='h-10 rounded-[100px]'
                                />
                                {errors.location && (
                                    <p className="text-red-500 text-sm mt-1">{errors.location.message as string}</p>
                                )}
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
                            {errors.bio && (
                                <p className="text-red-500 text-sm mt-1">{errors.bio.message as string}</p>
                            )}
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
                                type="button"
                                onClick={handleCancel}
                                className='bg-white text-black border-[1px] border-black rounded-[100px] h-10'
                            >
                                Cancel
                            </Button>

                        </div>
                    </div>
                )
            }
            {
                !edit && (
                    <div className='mt-5'>
                        <div className='flex items-center mb-4 space-x-2'>
                            <span className='font-bold'>Email:</span>
                            <span className='font-thin'>{user?.email}</span>
                        </div>
                        {
                            user?.phone_number &&
                            <div className='flex items-center mb-4 space-x-2'>
                                <span className='font-bold'>Phone:</span>
                                <span className='font-thin'>{user?.phone_number}</span>
                            </div>
                        }
                        <div className='flex items-center mb-4 space-x-2'>
                            <span className='font-bold'>Location:</span>
                            <span className='font-thin'>{user?.location || 'Not specified'}</span>
                        </div>
                        {
                            user?.bio && (
                                <div className='flex items-center mb-4 space-x-2'>
                                    <span className='font-bold'>Bio:</span>
                                    <span className='font-thin'>{user?.bio}</span>
                                </div>
                            )
                        }
                        <Button
                            onClick={()=>setEdit(true)}
                            className='max-w-fit px-10 mt-5 bg-lightBlue py-2 rounded-[100px]'
                        >
                            Edit
                        </Button>
                        
                    </div>
                )
            }
        </form>
    </div>
  )
}

export default ProfilePage