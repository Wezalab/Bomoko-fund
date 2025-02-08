import qrcode from '../assets/qrCode.png'
import appleIcon from '../assets/apple.png'
import googlePlayIcon from '../assets/googlePlay.png'
import { MdLocationOn,MdEmail,MdOutlinePhoneIphone, MdOutlineArrowOutward } from "react-icons/md";
import { FaInstagramSquare,FaLinkedin,FaTwitterSquare,FaFacebookSquare,FaYoutube } from "react-icons/fa";
import { navItems } from '@/constants/navItems';
import { NavLink, useLocation } from 'react-router-dom';

import appLogo from '../assets/footerImg.png'


function Footer() {
  const location=useLocation()
  return (
    <div className='bg-darkBlue pt-10 relative'>
      <div className=' grid grid-cols-6 gap-x-10 p-5 text-white'>
          <div className="col-span-3">
            <span className="text-white font-semibold text-[26px] ml-10">Scan to get our App</span>
            <div className="flex">
              <div className="flex items-center space-x-5 mt-10 pr-3 border-r-2  border-white">
                <div className="w-full  rounded-[14px] h-[150px]">
                  <img 
                    className="w-full h-full object-contain"
                    src={qrcode}
                    alt="qr-code"
                  />
                </div>
                <div className=''>
                  <span className='text-[18px] font-semibold'>
                    Download our app to unlock its full potential and enjoy an enhanced experience with Bomoko Fund App, 
                    From personalized features to seamless performance
                  </span>
                </div>
              </div>
              <div className='px-5  mt-10'>
                <span className='text-white font-semibold text-[18px]'>
                  Available on App Store 
                  and Play Store
                </span>
                <div className='flex items-center space-x-4 mt-10'>
                  <div className='w-[70px] h-[70px]'>
                    <img 
                      src={appleIcon}
                      className='w-full h-full object-cover rounded-lg'
                      alt='apple-icon'
                    />
                  </div>
                  <div className='w-[70px] h-[70px]'>
                    <img 
                      src={googlePlayIcon}
                      className='w-full h-full object-cover rounded-lg'
                      alt='apple-icon'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-span-1'></div>
          <div className='col-span-2'>
            <div className=''>
              <span className="text-white font-semibold text-[26px]">Contact Info</span>
            </div>
            <div className='mt-10 flex flex-col '>
              <div className='flex items-center space-x-5 mb-5'>
                <MdLocationOn size={24} className='text-white' />
                <span className="text-white">
                  Kin Plazza, Patrice Lumumba Avenue, Kinshasa, DRC
                </span>
              </div>
              <div className='flex items-center space-x-5 mb-5'>
                <MdEmail size={24} className='text-white' />
                <a href='mailto:info@crowdfund.com' className="text-white">
                  info@crowdfund.com
                </a>
              </div>
              <div className='flex items-center space-x-5 mb-5'>
                <MdOutlinePhoneIphone size={24} className='text-white' />
                <a href="tel:+243 821 123 456" className="text-white">
                  +243 821 123 456
                </a>
              </div>
            </div>
            <div className='mt-5 flex items-center space-x-5'>
              <div className='flex items-center justify-center w-[36px] h-[36px] rounded-full bg-blue-300/20 cursor-pointer'>
                <FaLinkedin size={18} color='lightBlue' />
              </div>
              <div className='flex items-center justify-center w-[36px] h-[36px] rounded-full bg-blue-300/20 cursor-pointer'>
                <FaTwitterSquare size={18} color='lightBlue' />
              </div>
              <div className='flex items-center justify-center w-[36px] h-[36px] rounded-full bg-blue-300/20 cursor-pointer'>
                <FaInstagramSquare size={18} color='lightBlue' />
              </div>
              <div className='flex items-center justify-center w-[36px] h-[36px] rounded-full bg-blue-300/20 cursor-pointer'>
                <FaFacebookSquare size={18} color='lightBlue' />
              </div>
              <div className='flex items-center justify-center w-[36px] h-[36px] rounded-full bg-blue-300/20 cursor-pointer'>
                <FaYoutube size={18} color='lightBlue' />
              </div>
            </div>
          </div>
      </div>
      <div className='w-full mt-10 pr-10'>
          <ul className='flex items-center justify-end gap-8 font-semibold '>
              {
                  navItems.map((nav)=>(
                      <li key={nav.name} className='py-[8px] px-2 text-lightGray'>
                          <NavLink to={nav.link} className={({isActive})=>(isActive ? "nav-active" : "flex items-center space-x-2")}>
                              {nav.name}
                              <MdOutlineArrowOutward size={20} color={location.pathname ===nav.link ?"white":"gray" } />
                          </NavLink>
                      </li>
                  ))
              }
              
          </ul>
      </div>
      <div className='rounded-l-xl absolute bottom-0 left-10 w-[270px] h-[130px] p-3'>
          <img 
            src={appLogo}
            className=''
            alt="footer-img"
          />
      </div>
   </div>
  )
}

export default Footer