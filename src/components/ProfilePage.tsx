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
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaMapMarkerAlt, FaInfoCircle, FaBuilding } from "react-icons/fa";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Extended User type to match backend model
interface ExtendedUser {
  _id: string;
  name?: string;
  gender?: "M" | "F" | "OTHER";
  avatar?: string;
  bio?: string;
  location?: string;
  email: string;
  phone_number?: string;
  phone?: string;
  type?: "INDIVIDUAL" | "ENTREPRISE" | "DONATOR" | "ENTREPRENEUR";
  isGoogleUser?: boolean;
  profile?: string;
  projects?: any[];
  cryptoWallet?: any[];
}

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
    gender: z.enum(["M", "F", "OTHER"]).optional(),
    location: z.string().max(100, "Location must be less than 100 characters").optional(),
    bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
    name: z.string().max(100, "Name must be less than 100 characters").optional(),
    type: z.enum(["INDIVIDUAL", "ENTREPRISE", "DONATOR", "ENTREPRENEUR"]).optional()
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
    const user = useAppSelector(selectUser) as unknown as ExtendedUser;
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
            gender: user?.gender,
            location: user?.location || '',
            bio: user?.bio || '',
            name: user?.name || '',
            type: user?.type
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
            setValue("gender", user.gender);
            setValue("location", user.location || '');
            setValue("bio", user.bio || '');
            setValue("name", user.name || '');
            setValue("type", user.type);
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
            if (data.name) formData.append("name", data.name);
            if (data.type) formData.append("type", data.type);
            
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

      // Get account type display name
      const getAccountTypeDisplay = (type?: string) => {
        if (!type) return 'Not specified';
        
        switch(type) {
          case 'INDIVIDUAL': return 'Individual';
          case 'ENTREPRISE': return 'Enterprise';
          case 'DONATOR': return 'Donator';
          case 'ENTREPRENEUR': return 'Entrepreneur';
          default: return type;
        }
      };

      // Get gender display name
      const getGenderDisplay = (gender?: string) => {
        if (!gender) return 'Not specified';
        
        switch(gender) {
          case 'M': return 'Male';
          case 'F': return 'Female';
          case 'OTHER': return 'Other';
          default: return gender;
        }
      };

  return (
    <div className="bg-gray-100 min-h-[90vh] py-5 p-4 md:pt-10 pb-20 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          </TabsList>
          
          {/* Profile Information Tab */}
          <TabsContent value="profile">
            <Card className="border-none shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white">
                    <img 
                      src={user?.avatar || Avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      {user?.name || 'User Profile'}
                    </CardTitle>
                    <CardDescription className="text-gray-100 mt-1">
                      {getAccountTypeDisplay(user?.type)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6 px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaUser className="text-blue-500 text-xl" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{user?.name || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaEnvelope className="text-blue-500 text-xl" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaPhone className="text-blue-500 text-xl" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{user?.phone_number || user?.phone || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaVenusMars className="text-blue-500 text-xl" />
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium">{getGenderDisplay(user?.gender)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaMapMarkerAlt className="text-blue-500 text-xl" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{user?.location || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaBuilding className="text-blue-500 text-xl" />
                      <div>
                        <p className="text-sm text-gray-500">Account Type</p>
                        <p className="font-medium">{getAccountTypeDisplay(user?.type)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {user?.bio && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FaInfoCircle className="text-blue-500" />
                      <h3 className="font-semibold">Bio</h3>
                    </div>
                    <p className="text-gray-700">{user.bio}</p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-end border-t p-6">
                <Button 
                  onClick={() => document.querySelector('[data-value="edit"]')?.dispatchEvent(new MouseEvent('click'))}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Edit Profile Tab */}
          <TabsContent value="edit">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Edit Your Profile</CardTitle>
                <CardDescription>
                  Update your profile information and settings
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit(onsubmit)}>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 pb-6 border-b">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
                        {!preview && user?.avatar ? (
                          <img 
                            src={user.avatar}
                            className="w-full h-full object-cover"
                            alt="profile-img"
                          />
                        ) : !preview ? (
                          <img 
                            src={Avatar}
                            className="w-full h-full object-cover"
                            alt="profile-img"
                          />
                        ) : (
                          <img 
                            src={preview}
                            className="w-full h-full object-cover"
                            alt="profile-img"
                          />
                        )}
                      </div>
                      
                      {preview && (
                        <button
                          type="button"
                          onClick={() => {
                            setPreview(null);
                            setValue("avatar", undefined);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <FaTrashCan size={14} />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">Profile Picture</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Upload a new profile picture. JPG, PNG or WebP (max. 5MB)
                      </p>
                      
                      <div className="flex items-center">
                        <label 
                          htmlFor="avatar-upload" 
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                        >
                          <SlCloudUpload />
                          <span>Upload Image</span>
                        </label>
                        <Input 
                          id="avatar-upload"
                          type="file"
                          accept={ACCEPTED_IMAGE_TYPES.join(',')} 
                          {...register("avatar")}
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                      
                      {errors.avatar && (
                        <p className="text-red-500 text-sm mt-2">{errors.avatar.message as string}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-medium">Name</label>
                      <Input 
                        {...register("name")}
                        placeholder="Your full name"
                        className="h-10"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name.message as string}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="font-medium">Location</label>
                      <Input 
                        {...register("location")}
                        placeholder="Your location"
                        className="h-10"
                      />
                      {errors.location && (
                        <p className="text-red-500 text-sm">{errors.location.message as string}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="font-medium">Gender</label>
                      <Select 
                        defaultValue={user?.gender}
                        onValueChange={(value) => setValue("gender", value as "M"| "F" | "OTHER")}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Gender</SelectLabel>
                            <SelectItem value="M">Male</SelectItem>
                            <SelectItem value="F">Female</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.gender && (
                        <p className="text-red-500 text-sm">{errors.gender.message as string}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="font-medium">Account Type</label>
                      <Select 
                        defaultValue={user?.type}
                        onValueChange={(value) => setValue("type", value as "INDIVIDUAL" | "ENTREPRISE" | "DONATOR" | "ENTREPRENEUR")}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Account Type</SelectLabel>
                            <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                            <SelectItem value="ENTREPRISE">Enterprise</SelectItem>
                            <SelectItem value="DONATOR">Donator</SelectItem>
                            <SelectItem value="ENTREPRENEUR">Entrepreneur</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.type && (
                        <p className="text-red-500 text-sm">{errors.type.message as string}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-medium">Bio</label>
                    <Textarea 
                      {...register("bio")}
                      placeholder="Tell us about yourself..."
                      className="min-h-[120px]"
                    />
                    {errors.bio && (
                      <p className="text-red-500 text-sm">{errors.bio.message as string}</p>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end border-t p-6">
                  <Button
                    type="button"
                    onClick={() => document.querySelector('[data-value="profile"]')?.dispatchEvent(new MouseEvent('click'))}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={editProfileIsLoading}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                  >
                    {editProfileIsLoading ? <LoadingComponent /> : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ProfilePage