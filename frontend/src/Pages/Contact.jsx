import React from 'react'
import Title from '../Components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsLetter from '../Components/NewsLetter'

const Contact = () => {
    return (
        <div>
            <div className='text-center text-2xl pt-10 border-t'>
                <Title text1={'CONTACT'} text2={'US'} />

            </div>
            <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
                <img src={assets.contact_img} className='w-full md:max-w-[480px]' alt="" />
                <div className='flex flex-col justify-center items-start gap-6'>
                    <p className='font-bold text-xl text-gray-600'>Our Store</p>
                    <p className='text-gray-500 font-semibold'>DLF Phase-2 Cyberhub <br />Metrostation, <br />Gururgram ,India</p>
                    <p className='text-gray-500 font-semibold'>Tel: (123) 456-7890 <br />Email: contact@gmail.com</p>
                    <p className='font-semibold text-xl text-gray-600'>Careers At Naruto.com</p>
                    <p className='text-gray-500 font-semibold'>Lear more about our teams and job openings</p>
                    <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500 rounded-sm'>Expore Jobs</button>
                </div>

            </div>
            <NewsLetter />
        </div>
    )
}

export default Contact