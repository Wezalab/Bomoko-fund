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
import { RxCross2 } from "react-icons/rx"
import logo from '../assets/logoDark.webp'
import lightLogo from '../assets/logoLight.webp'

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
import { IoMdMenu } from "react-icons/io";
import { ProjectInitialState, setProject } from '@/redux/slices/projectSlice'




interface navbarProps{
    signIn:boolean
    setResetPassword:any
    signUp:boolean
    setSignIn:any
    setSignUp:any
}

function Navbar({signIn,signUp,setResetPassword,setSignUp,setSignIn}:navbarProps) {
    const user=useAppSelector(selectUser)
    const [sideBar,setSideBar]=useState(false)
    const [selectedLang,setSelectedLang]=useState("English")
    const navigate=useNavigate()
    const dispatch=useAppDispatch()

    const handleLogout=()=>{
        dispatch(setUser(initialState.user))
        dispatch(setProject(ProjectInitialState.project))
        //window.location.reload() reload the entire page
    }


    //console.log("user",user)
  return (
    <>
        <nav className='flex sticky top-0 z-30 shadow-md py-3 px-2 bg-white justify-between items-center md:hidden'>
            <IoMdMenu onClick={()=>setSideBar(true)} size={28} />
            <div className='flex items-center space-x-1'>
                {
                    user.email && (
                        <div className='w-6 h-6'>
                            <img 
                                src={profileImage}
                                className='w-full h-full object-cover'
                                alt='user-profile'
                            />
                        </div>
                    )
                }
                {
                    !user.email && (
                        <Button
                            onClick={()=>setSignIn(true)}
                            className='max-w-fit text-sm px-3 py-2 text-white bg-darkBlue rounded-md'
                        >
                            Login
                        </Button>
                    )
                }
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className='font-bold uppercase'>{selectedLang.slice(0,2)}</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[100px] gap-3 p-4">
                                    <li onClick={()=>setSelectedLang("English")} className='hover:text-lightBlue cursor-pointer'>En</li>
                                    <li onClick={()=>setSelectedLang("French")} className='hover:text-lightBlue cursor-pointer'>Fr</li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
            <aside 
                className={
                    sideBar ?
                        'translate-x-0  transform top-0 left-0 w-64 bg-darkBlue fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30':
                        '-translate-x-full transform top-0 left-0 w-64 bg-darkBlue fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30'
                }
            >
                <RxCross2 
                    size={26} 
                    onClick={()=>setSideBar(false)}
                    className='text-white top-2 absolute right-3' 
                />
                <div className='w-56 h-36'>
                    <img src={logo} alt="app-logo" className='w-full h-full object-cover'  />
                </div>
                <div className='mt-5 flex flex-col px-5 text-white space-y-2'>
                    {
                        navItems.filter(n=>!["Privacy policy"].includes(n.name)).map((nav)=>(
                            <span key={nav.name} className='p-2'>
                                <NavLink to={nav.link} className={({isActive})=>(isActive ? "nav-active  w-full py-2 px-4" : "px-4")}>
                                    {nav.name}
                                </NavLink>
                            </span>
                        ))
                    }
                    {
                        user.email && (
                            <span
                                onClick={()=>{
                                    handleLogout()
                                    setSideBar(false)
                                }} 
                                className='p-2 text-red-600'>
                                Logout
                            </span>
                        )
                    }
                </div>
            </aside>
        </nav>
        <nav className='hidden md:py-5  lg:py-[16px] sticky top-0 z-30 md:px-5 lg:px-[80px] md:flex items-center justify-between bg-white shadow-sm'>
            <div className='flex items-center md:space-x-2 lg:space-x-[8px]'>
                <img 
                    onClick={()=>navigate("/")}
                    src={lightLogo}
                    className='md:h-[70px] md:w-[150px] cursor-pointer lg:w-[250px] lg:h-[100px]'
                    alt='app-image'
                />
                {/* <h1 className='font-semibold md:hidden lg:inline capitalize md:text-[16px] text-nowrap lg:text-[24px] text-lightBlue'>bomoko fund</h1> */}
            </div>
            <div className=''>
                <ul className='flex items-center space-x-2 lg:gap-x-8 font-semibold bg-[#F6F8FA] rounded-[100px] border-[1px] border-[lightGray]'>
                    {
                        navItems.filter(n=>!["FAQ","Privacy policy","Profile"].includes(n.name)).map((nav)=>(
                            <li key={nav.name} className='lg:py-[8px] p-2'>
                                <NavLink to={nav.link} className={({isActive})=>(isActive ? "nav-active text-nowrap rounded-[100px] py-2 px-4" : "text-nowrap")}>
                                    {nav.name}
                                </NavLink>
                            </li>
                        ))
                    }
                    <li className='lg:py-[8px] lg:px-2 md:px-4 md:py-2 flex space-x-2'>
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
                <div className='flex md:flex-col lg:flex-row items-center md:gap-2 lg:gap-5'>
                    
                    <Button
                        disabled={signIn}
                        onClick={()=>setSignIn(true)}
                        className={signIn ?"md:py-[4px] lg:py-[8px] bg-white cursor-not-allowed md:h-[28px] lg:h-[48px] w-[95px] border-[1px] border-darkBlue text-darkBlue rounded-[100px] hover:bg-lightBlue hover:border-none hover:text-white" :"md:py-[4px] lg:py-[8px] bg-white md:h-[36px] lg:h-[48px] w-[95px] border-[1px] border-darkBlue text-darkBlue rounded-[100px] hover:bg-lightBlue hover:border-none hover:text-white"}
                    >
                        Log In
                    </Button>
                    <Button
                        disabled={signUp}
                        onClick={()=>setSignUp(true)}
                        className={signUp ?'text-white h-[48px] cursor-not-allowed w-[95px] font-semibold bg-darkBlue py-[8px] rounded-[100px]':'text-white h-[36px] lg:h-[48px] w-[95px] font-semibold bg-darkBlue py-[8px] rounded-[100px]'}
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
                                    <div onClick={()=>navigate("/profile")} className='flex items-center space-x-2 cursor-pointer'>
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
    </>
  )
}

export default Navbar