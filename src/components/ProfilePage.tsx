import Avatar from '../assets/Avatars Base.png'
import { Button } from './ui/button'
import { SlCloudUpload } from "react-icons/sl";
import { FaTrashCan } from "react-icons/fa6";
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { Textarea } from './ui/textarea';


function ProfilePage() {

    const  {
        register,
        handleSubmit,
        reset,
        formState:{errors}
    }=useForm()

  return (
    <div className="bg-gray-200 h-[90vh] md:h-[70vh] p-2 md:pt-10">
        <div className='md:hidden'>
            <span className='text-semibold text-xl'>Profile</span>
            <div className='flex items-center space-x-5'>
                <div className="w-[100px] h-[100px] rounded-full mt-5">
                    <img 
                        src={Avatar}
                        className='w-full h-full object-cover'
                        alt="profile-img"
                    />
                </div>
                <div className=''>
                    <Button
                        className='flex items-center space-x-2 rounded-[100px] hover:bg-blue-200 bg-lightBlue'
                    >
                        <SlCloudUpload color='white' />
                        Upload new picture
                    </Button>
                </div>
            </div>
            <form className='mt-5 w-[90%]'>
                <div className='flex flex-col space-y-1'>
                    <label>Names</label>
                    <Input 
                        placeholder='Kanana john'
                        className='h-10 border-[1px] border-black rounded-[100px]'
                    />
                </div>
                <div className='flex flex-col space-y-1'>
                    <label>Location</label>
                    <Input 
                        placeholder='Goma, North kivu'
                        className='h-10 border-[1px] border-black rounded-[100px]'
                    />
                </div>
                <div className='mt-5'>
                    <label>Bio</label>
                    <Textarea 
                        placeholder='Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, '
                        className='border-[1px] border-black'
                        rows={5}
                    />
                </div>
                <Button
                    className='bg-darkBlue px-5 text-white rounded-[100px] w-full mt-5 h-10'
                >
                    Save changes
                </Button>
            </form>
        </div>
        {/* Small devices and large devices */}
        <div className="hidden w-3/4 lg:w-2/4 rounded-md px-5 py-10 mx-auto bg-white">
            <span className="font-bold text-xl ml-2">Profile</span>
            <div className="flex items-center space-x-5">
                <div className="w-[100px] h-[100px] rounded-full mt-5">
                    <img 
                        src={Avatar}
                        className='w-full h-full object-cover'
                        alt="profile-img"
                    />
                </div>
                <div className='flex items-center space-x-5'>
                    <Button
                        className='flex items-center space-x-2 rounded-[100px] hover:bg-blue-200 bg-lightBlue'
                    >
                        <SlCloudUpload color='white' />
                        Upload new picture
                    </Button>
                    <Button
                        className='flex items-center space-x-2 px-5 border-[1px] hover:bg-gray-100 border-black text-black rounded-[100px] bg-white'
                    >
                        <FaTrashCan color='black' />
                        Delete Picture
                    </Button>
                </div>
            </div>
            <form className='my-5'>
                <div className='grid grid-cols-2 gap-x-5'>
                    <div className=''>
                        <label>Names</label>
                        <Input 
                            placeholder='Kanana john'
                            className='h-10 rounded-[100px]'
                        />
                    </div>
                    <div className=''>
                        <label>Location</label>
                        <Input 
                            placeholder='North-Kivu, Masisi'
                            className='h-10 rounded-[100px]'
                        />
                    </div>
                </div>
                <div className='mt-5'>
                    <label>Bio</label>
                    <Textarea 
                        placeholder='Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, '
                        className=''
                        rows={5}
                    />
                </div>
                <div className='mt-5 flex space-x-5'>
                    <Button
                        className='bg-darkBlue px-5 text-white rounded-[100px] h-10'
                    >
                        Save
                    </Button>
                    <Button
                        className='bg-white text-black border-[1px] border-black rounded-[100px] h-10'
                    >
                        Cancel
                    </Button>

                </div>
            </form>
        </div>
    </div>
  )
}

export default ProfilePage