import { useState } from 'react'
import { navItems } from '../constants/navItems'
import { NavLink, useNavigate } from 'react-router-dom'
import appLogo from  '../assets/appNameIcon.png'
import { Button } from './ui/button'
import profileImage  from '../assets/profileImage.png'
import { GoChevronDown } from "react-icons/go";
import { FiBell } from "react-icons/fi";
import { CiGrid41,CiLock } from "react-icons/ci";
import { GoPerson } from "react-icons/go";
import { IoMdLogOut } from "react-icons/io";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger
  } from "@/components/ui/navigation-menu"
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuGroup,
DropdownMenuItem,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { initialState, selectUser, setUser } from '@/redux/slices/userSlice'

interface navbarProps{
    signIn:boolean
    setResetPassword:any
    signUp:boolean
    setSignIn:any
    setSignUp:any
}

function Navbar({signIn,signUp,setResetPassword,setSignUp,setSignIn}:navbarProps) {
    const user=useAppSelector(selectUser)
    const [selectedLang,setSelectedLang]=useState("English")
    const navigate=useNavigate()
    const dispatch=useAppDispatch()

    const handleLogout=()=>{
        dispatch(setUser(initialState.user))
        //window.location.reload() reload the entire page
    }


    //console.log("user",user)
  return (
    <nav className='py-[16px] sticky top-0 z-30 px-[80px] flex items-center justify-between bg-white shadow-sm'>
        <div className='flex items-center space-x-[8px]'>
            <img 
                src={appLogo}
                className='w-[36px] h-[36px]'
                alt='app-image'
            />
            <h1 className='font-semibold capitalize text-[24px] text-lightBlue'>bomoko fund</h1>
        </div>
        <div className=''>
            <ul className='flex items-center gap-8 font-semibold bg-[#F6F8FA] rounded-[100px] border-[1px] border-[lightGray]'>
                {
                    navItems.filter(n=>!["FAQ","Privacy policy"].includes(n.name)).map((nav)=>(
                        <li key={nav.name} className='py-[8px] px-2'>
                            <NavLink to={nav.link} className={({isActive})=>(isActive ? "nav-active" : "")}>
                                {nav.name}
                            </NavLink>
                        </li>
                    ))
                }
                <li className='py-[8px] px-2 flex space-x-2'>
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className='font-bold'>{selectedLang}</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[100px] gap-3 p-4">
                                        <li onClick={()=>setSelectedLang("English")} className='hover:text-lightBlue cursor-pointer'>English</li>
                                        <li onClick={()=>setSelectedLang("French")} className='hover:text-lightBlue cursor-pointer'>French</li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </li>
            </ul>
        </div>
        {
            !user.email &&
            <div className='flex items-center gap-5'>
                
                <Button
                    disabled={signIn}
                    onClick={()=>setSignIn(true)}
                    className={signIn ?"py-[8px] bg-white cursor-not-allowed h-[48px] w-[95px] border-[1px] border-darkBlue text-darkBlue rounded-[100px] hover:bg-lightBlue hover:border-none hover:text-white" :"py-[8px] bg-white h-[48px] w-[95px] border-[1px] border-darkBlue text-darkBlue rounded-[100px] hover:bg-lightBlue hover:border-none hover:text-white"}
                >
                    Log In
                </Button>
                <Button
                    disabled={signUp}
                    onClick={()=>setSignUp(true)}
                    className={signUp ?'text-white h-[48px] cursor-not-allowed w-[95px] font-semibold bg-darkBlue py-[8px] rounded-[100px]':'text-white h-[48px] w-[95px] font-semibold bg-darkBlue py-[8px] rounded-[100px]'}
                >
                    Sign Up
                </Button>
            </div>
        }
        {
            user.email && 
            <div className=''>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className='flex items-center bg-[#ECEFF3] py-[8px] rounded-full  h-[50px] hover:bg-lightBlue'
                        >
                            <img 
                                src={profileImage}
                                className='w-[39px] h-[39px] rounded-full'
                                alt='profile-image'
                            />
                            <GoChevronDown 
                                className="font-bold hover:text-white"
                                color="darkBlue"
                                size={44}
                            />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='p-3'>
                        <div className='flex items-center space-x-5'>
                            <img 
                                src={profileImage}
                                className='w-[30px] h-[30px] rounded-full'
                                alt='profile-image'
                            />
                            <div className='flex flex-col'>
                                <span className='text-black font-semibold text-sm'>{user.email.split("@")[0]}</span>
                                <span className='text-lightGray text-sm'>{user.email}</span>
                            </div>
                        </div>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem className='p-3'>
                                <div className='flex items-center space-x-2 cursor-pointer'>
                                    <FiBell size={18} />
                                    <span className='text-sm'>Notifications</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className='p-3'>
                                <div onClick={()=>navigate("/projects")} className='flex items-center space-x-2 cursor-pointer'>
                                    <CiGrid41 size={18} />
                                    <span className='text-sm'>Projects</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className='p-3'>
                                <div className='flex items-center space-x-2 cursor-pointer'>
                                    <GoPerson size={18} />
                                    <span className='text-sm'>Profile</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className='p-3'>
                                <div onClick={()=>setResetPassword(true)} className='flex items-center space-x-2 cursor-pointer'>
                                    <CiLock size={18} />
                                    <span className='text-sm'>Change Password</span>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='p-3'>
                            <div onClick={handleLogout} className='flex items-center space-x-2 cursor-pointer'>
                                <IoMdLogOut color='red' size={18} />
                                <span className='text-sm text-red-600'>Logout</span>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                
            </div>
        }
        
    </nav>
  )
}

export default Navbar