import React, { useContext } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { ShopContext } from '../Context/ShopContext'
const Footer = () => {
    const { navigate } = useContext(ShopContext)
    return (
        <div>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div>
                    <img src={assets.Dhruv} className='mb-3 w-32' alt="" />
                    <p className='w-full md:w-2/3 text-gray-600'>
                        Discover fashion that defines you. Shop our curated collections for timeless pieces, trendy must-haves, and everyday essentials—all designed with quality, style, and affordability in mind. Elevate your wardrobe today!
                    </p>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='cursor-pointer flex flex-col gap-1 text-gray-600'>
                        <li onClick={() => navigate('/')}>HOME</li>
                        <li onClick={() => navigate('/about')}>ABOUT US</li>
                        <li onClick={() => navigate('/')}>DELIVERY</li>
                        <li onClick={() => navigate('/')}>PRIVACY POLICY</li>
                    </ul>
                </div>
                <div>
                    <p className='text-cl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>+1-212-456-7890</li>
                        <li>contact@naruto.com</li>
                    </ul>
                </div>
            </div>
            <div className=''>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2024@ naruto.com - All Right Reserved.</p>
            </div>
        </div>
    )
}

export default Footer