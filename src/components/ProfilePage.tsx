import Avatar from '../assets/Avatars Base.png'
import { Button } from './ui/button'
import { SlCloudUpload } from "react-icons/sl";
import { Trash2 } from "lucide-react";
import { FaTrashCan } from "react-icons/fa6";
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectUser, setUser, selectToken } from '@/redux/slices/userSlice';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import LoadingComponent from './LoadingComponent';
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaMapMarkerAlt, FaInfoCircle, FaBuilding } from "react-icons/fa";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from 'axios';
import { AxiosError } from 'axios';
import { apiUrl } from '@/lib/env';
import { useNavigate, useParams } from 'react-router-dom';

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
  isStillRegistering?: boolean;
  isDeactivated?: boolean;
  deactivateReason?: string;
  googleId?: string | null;
  updatedAt?: string;
  profile?: string;
  projects?: any[];
  cryptoWallet?: any[];
}

const formSchema = z.object({
    gender: z.enum(["M", "F", "OTHER"]).optional(),
    location: z.string().max(100, "Location must be less than 100 characters").optional(),
    bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
    name: z.string().max(100, "Name must be less than 100 characters").optional(),
    type: z.enum(["INDIVIDUAL", "ENTREPRISE", "DONATOR", "ENTREPRENEUR"]).optional(),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional()
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

// Type for API success response
interface ApiResponse {
  message: string;
  updatedUser: ExtendedUser;
}

function ProfilePage() {
    const user = useAppSelector(selectUser) as unknown as ExtendedUser;
    const token = useAppSelector(selectToken);
    const [preview, setPreview] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const [edit, setEdit] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("profile");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // Store the actual file object separately to ensure it's available during form submission
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    // Track upload progress
    const [uploadProgress, setUploadProgress] = useState(0);
    // Store potential server-side errors
    const [serverError, setServerError] = useState<string | null>(null);
    // Use for navigation
    const navigate = useNavigate();
    
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isDirty },
      } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            gender: user?.gender,
            location: user?.location || '',
            bio: user?.bio || '',
            name: user?.name || '',
            type: user?.type,
            email: user?.email || '',
            phone: user?.phone || user?.phone_number || ''
        }
      });

      // Initialize form with user data when edit mode is enabled
      useEffect(() => {
        if (edit && user) {
            setValue("gender", user.gender);
            setValue("location", user.location || '');
            setValue("bio", user.bio || '');
            setValue("name", user.name || '');
            setValue("type", user.type);
            setValue("email", user.email || '');
            setValue("phone", user.phone || user?.phone_number || '');
        }
      }, [edit, user, setValue]);

      // Fetch user profile on component mount
      useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user?._id || !token) {
                console.log("[DEBUG] Skipping profile fetch - missing user ID or token");
                setIsLoading(false);
                return;
            }
            
            console.log("[DEBUG] Fetching user profile for ID:", user._id);
            try {
                const endpoint = `${apiUrl}auth/me/${user._id}`;
                console.log("[DEBUG] GET request to:", endpoint);
                
                const response = await axios.get<ExtendedUser>(
                    endpoint,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                console.log("[DEBUG] Profile fetch response status:", response.status);
                console.log("[DEBUG] Profile data received:", JSON.stringify(response.data, null, 2));
                
                // Update user data in Redux store
                if (response.data) {
                    console.log("[DEBUG] Updating user in Redux store from profile fetch");
                    dispatch(setUser(response.data));
                }
            } catch (error) {
                console.error("[DEBUG ERROR] Error fetching user profile:", error);
                if (axios.isAxiosError(error)) {
                    console.error("[DEBUG ERROR] Axios error details:", {
                        status: error.response?.status,
                        data: error.response?.data
                    });
                    if (error.response?.status === 404) {
                        toast.error("User profile not found. Please check your account.");
                    }
                }
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUserProfile();
    }, [user?._id, token, dispatch]);

      const onsubmit = async (data: FormValues) => {
        if (!user?._id) {
            toast.error("User ID not found. Please log in again.");
            return;
        }

        if (!token) {
            toast.error("Authentication token not found. Please log in again.");
            return;
        }

        console.log("[DEBUG] Starting profile update submission");
        console.log("[DEBUG] User ID:", user._id);
        console.log("[DEBUG] Token present:", !!token);
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Show loading toast
            const loadingToast = toast.loading("Updating your profile...");
            
            // Get the file from our direct state variable rather than form data
            const file = avatarFile;
            console.log("[DEBUG] Avatar file at submission:", file ? file.name : "No file");
            
            const formData = new FormData();
            
            // Log the data being processed
            console.log("[DEBUG] Form data being processed:", JSON.stringify(data, (key, value) => {
                if (key === 'avatar' && value) return `File: ${value[0]?.name || 'no file'}`;
                return value;
            }, 2));
            
            // Only append fields with values - be explicit about each field to ensure data is sent
            if (file) {
                console.log("[DEBUG] Adding file to request:", file.name, "size:", file.size, "type:", file.type);
                
                // Use a single consistent field name for the avatar file
                // In this case we'll use "avatar" which is what the API field name appears to be
                formData.append("avatar", file);
                
                // Log file object details for debugging
                console.log("[DEBUG] File object details:", {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    lastModified: file.lastModified
                });
            }
            
            // Always send these fields even if empty to ensure the API receives them
            formData.append("gender", data.gender || '');
            formData.append("location", data.location || '');
            formData.append("bio", data.bio || '');
            formData.append("name", data.name || '');
            formData.append("type", data.type || 'INDIVIDUAL');
            formData.append("email", data.email || '');
            formData.append("phone", data.phone || '');
            
            // Log the FormData entries (for debugging)
            console.log("[DEBUG] FormData entries:");
            for (const pair of formData.entries()) {
                console.log(`  ${pair[0]}: ${pair[1] instanceof File ? `File: ${(pair[1] as File).name}` : pair[1]}`);
            }
            
            // Call the API directly using axios for more control - use correct endpoint format
            const endpoint = `${apiUrl}auth/me/${user._id}/edit`;
            console.log("[DEBUG] Sending request to:", endpoint);
            console.log("[DEBUG] Request headers:", {
                'Authorization': 'Bearer [TOKEN HIDDEN]',
                'Content-Type': 'multipart/form-data'
            });
            
            // Add more detailed debugging of the request
            console.log("[DEBUG] Request method: PUT");
            
            // Create a debug object of all form values for logging
            const debugFormValues = {
                gender: data.gender || '',
                location: data.location || '',
                bio: data.bio || '',
                name: data.name || '',
                type: data.type || 'INDIVIDUAL',
                email: data.email || '',
                phone: data.phone || '',
                hasFile: !!file
            };
            console.log("[DEBUG] Form values about to be sent:", JSON.stringify(debugFormValues, null, 2));
            
            // Make the request with upload progress tracking
            const response = await axios.put<ApiResponse>(
                endpoint,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    // Add upload progress tracking
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress(percentCompleted);
                            console.log(`[DEBUG] Upload progress: ${percentCompleted}%`);
                        }
                    }
                }
            );
            
            console.log("[DEBUG] Response status:", response.status);
            console.log("[DEBUG] Response data:", JSON.stringify(response.data, null, 2));
            
            // If the avatar update didn't work, try to diagnose further
            if (file && (!response.data.updatedUser.avatar || response.data.updatedUser.avatar === "")) {
                console.log("[DEBUG] Avatar update failed - server returned empty avatar despite file being sent");
                console.log("[DEBUG] This might indicate the server isn't properly processing the file");
                console.log("[DEBUG] Verify the API endpoint is configured to accept and process file uploads");
                
                // Set a specific server error for avatar upload failure
                setServerError("Avatar upload failed. The server accepted the profile update but didn't process the image file.");
                
                // Dismiss loading toast
                toast.dismiss(loadingToast);
                
                // Still show a success message for other profile fields
                toast.success("Profile information updated, but profile picture upload failed.");
            } else {
                // Dismiss loading toast
                toast.dismiss(loadingToast);
                
                // Show success message
                toast.success("Profile updated successfully!");
                setServerError(null);
                
                // If avatar was updated successfully, force a navigation refresh to update navbar
                if (file && response.data.updatedUser.avatar) {
                    console.log("[DEBUG] Avatar updated successfully, forcing UI refresh");
                    
                    // Small delay to ensure Redux state is updated before refresh
                    setTimeout(() => {
                        // Navigate to the same page to force a refresh of all components including navbar
                        navigate("/profile", { replace: true });
                    }, 100);
                }
            }
            
            // Update user data in the Redux store
            if (response.data && response.data.updatedUser) {
                console.log("[DEBUG] Updating user in Redux store");
                dispatch(setUser(response.data.updatedUser));
                
                // If we received a new avatar URL from the server, update it in the preview
                if (response.data.updatedUser.avatar) {
                    console.log("[DEBUG] Updated avatar URL in Redux store:", response.data.updatedUser.avatar);
                    console.log("[DEBUG] Avatar URL format check:", {
                        isString: typeof response.data.updatedUser.avatar === 'string',
                        length: response.data.updatedUser.avatar.length,
                        startsWithHttp: response.data.updatedUser.avatar.startsWith('http'),
                        containsImageExt: /\.(jpg|jpeg|png|gif|webp)/i.test(response.data.updatedUser.avatar)
                    });
                }
            }
            
            // Reset form state
            setActiveTab("profile");
            setPreview(null);
            setAvatarFile(null);
            setEdit(false);
            reset();
        } catch (error) {
            // Handle different types of errors
            let errorMessage = "Failed to update profile. Please try again.";
            
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<any>;
                
                // Log the full error for debugging
                console.error("[DEBUG ERROR] Full error object:", axiosError);
                console.error("[DEBUG ERROR] Request config:", axiosError.config);
                if (axiosError.request) {
                    console.error("[DEBUG ERROR] Request data sent:", axiosError.request);
                }
                
                // Handle specific HTTP status codes
                if (axiosError.response) {
                    console.error("[DEBUG ERROR] Response status:", axiosError.response.status);
                    console.error("[DEBUG ERROR] Response data:", JSON.stringify(axiosError.response.data, null, 2));
                    const status = axiosError.response.status;
                    
                    if (status === 400) {
                        errorMessage = "Invalid user data. Please check your inputs.";
                        if (avatarFile) {
                            setServerError("The server rejected the image file. Please try a different image.");
                        }
                    } else if (status === 404) {
                        errorMessage = "User not found. Please log in again.";
                    } else if (status === 413) {
                        errorMessage = "File too large. Please upload a smaller image (max 5MB).";
                        setServerError("File too large. Please upload a smaller image (max 5MB).");
                    } else if (axiosError.response.data?.message) {
                        errorMessage = axiosError.response.data.message;
                        
                        // Check if the error message is related to the avatar
                        if (errorMessage.toLowerCase().includes('avatar') || 
                            errorMessage.toLowerCase().includes('image') || 
                            errorMessage.toLowerCase().includes('file')) {
                            setServerError(errorMessage);
                        }
                    }
                } else if (axiosError.request) {
                    // Request was made but no response received (network error)
                    console.error("[DEBUG ERROR] Network error - no response received");
                    errorMessage = "Network error. Please check your connection and try again.";
                }
            } else {
                console.error("[DEBUG ERROR] Non-Axios error:", error);
            }
            
            // Show error message
            toast.error(errorMessage);
            setSubmitError(errorMessage);
            console.error("[DEBUG ERROR] Profile update error:", error);
        } finally {
            console.log("[DEBUG] Form submission process completed");
            setIsSubmitting(false);
            setUploadProgress(0);
        }
      };

      // Handle file selection and validation - completely revised implementation
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !files[0]) {
            console.log("[DEBUG] No file selected");
            return;
        }
        
        const file = files[0];
        console.log("[DEBUG] File selected:", file.name, "size:", file.size, "type:", file.type);
        
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            console.log("[DEBUG] File too large:", file.size, "bytes (max:", MAX_FILE_SIZE, "bytes)");
            toast.error("File is too large. Maximum size is 5MB.");
            e.target.value = '';
            return;
        }
        
        // Validate file type
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            console.log("[DEBUG] Invalid file type:", file.type, "accepted types:", ACCEPTED_IMAGE_TYPES);
            toast.error("Invalid file type. Only JPG, PNG and WebP are supported.");
            e.target.value = '';
            return;
        }
        
        // Show preview and update form state
        console.log("[DEBUG] File validation passed, creating preview and updating form");
        
        // Create a URL for the preview image and set it
        const previewURL = URL.createObjectURL(file);
        setPreview(previewURL);
        
        // Store the actual file in a state variable to ensure it's available during submission
        setAvatarFile(file);
        
        toast.success("Image selected successfully!");
      };

      // Cancel edit mode
      const handleCancel = () => {
        // Ask for confirmation if user has made changes
        if (isDirty || preview) {
            if (confirm("You have unsaved changes. Are you sure you want to cancel?")) {
                setActiveTab("profile");
                setPreview(null);
                setAvatarFile(null);
                setEdit(false);
                reset();
            }
        } else {
            setActiveTab("profile");
            setPreview(null);
            setAvatarFile(null);
            setEdit(false);
            reset();
        }
      };

      // Handle tab change
      const handleTabChange = (value: string) => {
        // If switching from edit to profile and there are unsaved changes, ask for confirmation
        if (activeTab === "edit" && value === "profile" && (isDirty || preview)) {
            if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
                setActiveTab(value);
                // Reset form if switching back to profile tab
                if (value === "profile") {
                    setPreview(null);
                    reset();
                }
            }
        } else {
            setActiveTab(value);
            // Reset form if switching to edit tab
            if (value === "edit") {
                setEdit(true);
            }
        }
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
      {isLoading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <LoadingComponent />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="profile" value={activeTab} onValueChange={handleTabChange} className="w-full">
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
                    onClick={() => setActiveTab("edit")}
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
                    {submitError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                        {submitError}
                      </div>
                    )}
                    
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
                              alt="preview-img"
                            />
                          )}
                          
                          {/* Show upload progress bar when uploading */}
                          {isSubmitting && avatarFile && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
                              <div className="w-4/5 bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                              <p className="mt-2 text-xs">{uploadProgress}%</p>
                            </div>
                          )}
                        </div>
                        
                        {preview && (
                          <button
                            type="button"
                            onClick={() => {
                              setPreview(null);
                              setAvatarFile(null);
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
                        
                        <div className="flex flex-col mt-2">
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
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            
                            {avatarFile && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAvatarFile(null);
                                  setPreview(null);
                                }}
                                className="ml-2 flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                              >
                                <Trash2 size={16} />
                                <span>Remove</span>
                              </button>
                            )}
                          </div>
                          
                          {/* Show file info */}
                          {avatarFile && (
                            <p className="text-sm text-gray-500 mt-1">
                              {avatarFile.name} ({Math.round(avatarFile.size / 1024)}KB)
                            </p>
                          )}
                          
                          {/* Show server errors if any */}
                          {serverError && (
                            <p className="text-sm text-red-500 mt-1">{serverError}</p>
                          )}
                        </div>
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
                        <label className="font-medium">Email</label>
                        <Input 
                          {...register("email")}
                          placeholder="Your email address"
                          className="h-10"
                          type="email"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm">{errors.email.message as string}</p>
                        )}
                    </div>
                      
                      <div className="space-y-2">
                        <label className="font-medium">Phone</label>
                        <Input 
                          {...register("phone")}
                          placeholder="Your phone number"
                          className="h-10"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm">{errors.phone.message as string}</p>
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
                      onClick={handleCancel}
                      variant="outline"
                      className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                        <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                        >
                      {isSubmitting ? <LoadingComponent /> : "Save Changes"}
                        </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
                    </div>
      )}
    </div>
  );
}

export default ProfilePage