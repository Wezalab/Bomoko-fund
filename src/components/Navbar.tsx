import { useState } from 'react'
import { navItems } from '../constants/navItems'
import { NavLink } from 'react-router-dom'
import appLogo from  '../assets/appNameIcon.png'
import { Button } from './ui/button'
import profileImage  from '../assets/profileImage.png'
import { GoChevronDown } from "react-icons/go";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger
  } from "@/components/ui/navigation-menu"


function Navbar() {
    const [user]=useState('')
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
                                <NavigationMenuTrigger className='font-bold'>English</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[100px] gap-3 p-4">
                                        <li className='hover:text-lightBlue cursor-pointer'>English</li>
                                        <li className='hover:text-lightBlue cursor-pointer'>French</li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </li>
            </ul>
        </div>
        {
            !user &&
            <div className='flex items-center gap-5'>
                <Button
                    className="py-[8px] bg-white h-[48px] w-[95px] border-[1px] border-darkBlue text-darkBlue rounded-[100px] hover:bg-lightBlue hover:border-none hover:text-white"
                >
                    Log In
                </Button>
                <Button
                    className='text-white h-[48px] w-[95px] font-semibold bg-darkBlue py-[8px] rounded-[100px]'
                >
                    Sign Up
                </Button>
            </div>
        }
        {
            user && 
            <div className=''>
                <Button
                    className='flex items-center bg-[#ECEFF3] py-[8px] rounded-[100px] h-[52px] hover:bg-lightBlue'
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
            </div>
        }
        
    </nav>
  )
}

export default Navbar