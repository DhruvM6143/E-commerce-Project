import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext';
const Navbar = () => {
    const location = useLocation();

    const { setShowSearch, showSearch, getCartCount, navigate, token, setToken, setCartItems, visible, setVisible } = useContext(ShopContext)

    const logout = () => {
        navigate('/login')
        setToken('')
        localStorage.removeItem('token')
        setCartItems({})

    }








    return (
        <div className='flex items-center justify-between py-3 font-medium'>
            <Link to='/'><img src={assets.Dhruv} alt="" className='w-36' /></Link>
            <ul className='hidden sm:flex gap-5 text-sm text-gray-700 '>

                <NavLink to='/' className="flex flex-col items-center gap-1">
                    <p>HOME</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden ' />
                </NavLink>
                <NavLink to='/collection' className="flex flex-col items-center gap-1">
                    <p>COLLECTION</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden ' />
                </NavLink>
                <NavLink to='/about' className="flex flex-col items-center gap-1">
                    <p>ABOUT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden ' />
                </NavLink>
                <NavLink to='/contact' className="flex flex-col items-center gap-1">
                    <p>CONTACT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden ' />
                </NavLink>

            </ul>
            <div className='flex items-center gap-6'>
                {
                    location.pathname.includes('collection') ? <img src={assets.search_icon} onClick={() => {
                        setShowSearch(!showSearch); console.log("Clicked");
                    }} className='w-5 cursor-pointer' alt="" />
                        : null
                }
                <div className='relative flex items-center gap-4 group'>
                    {/* Profile Icon or Login Button */}
                    {token ? (
                        <img
                            onClick={() => token ? null : navigate('/login')}
                            src={assets.profile_icon}
                            className='w-5 sm:w-6 md:w-7 cursor-pointer'
                            alt="Profile"
                        />
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className='mb-2 rounded-md bg-black text-white font-light px-4 py-3 sm:px-5 sm:py-2 mt-4 text-xs sm:text-sm'
                        >
                            Login
                        </button>
                    )}

                    {/* Admin Login Link */}
                    {!token && (
                        <a
                            href='https://naruto-admin.vercel.app'
                            className='mb-2 rounded-md bg-black text-white font-light px-4 py-1 sm:px-5 sm:py-2 mt-4 text-center text-xs sm:text-sm'
                        >
                            Admin Login
                        </a>
                    )}

                    {/* Dropdown Menu */}
                    {token && (
                        <div className='hidden group-hover:block absolute right-0 pt-4 w-full sm:w-48 top-4'>
                            <div className='flex flex-col gap-2 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                                <Link to='/orders'>
                                    <p className='cursor-pointer hover:text-black text-sm md:text-base'>Orders</p>
                                </Link>
                                <Link to='/profile'>
                                    <p className='cursor-pointer hover:text-black text-sm md:text-base'>Update Profile</p>
                                </Link>
                                <p onClick={logout} className='cursor-pointer hover:text-black text-sm md:text-base'>
                                    Logout
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <Link to="/cart" className='relative'>
                    <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white font-bold aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
                </Link>
                <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
            </div>

            {/* sidebar menu for small screen */}
            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className=' cursor-pointer flex items-center gap-4 p-3'>
                        <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
                        <p>Back</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection'>COLLECTION</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/about'>ABOUT`</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
                </div>
            </div>
        </div>
    )
}

export default Navbar