import React from 'react'

const NewsLetter = () => {

    const onSubmitHandler = (e) => {
        e.preventDefault();

    }

    return (
        <div className='text-center'>
            <p className='text-2xl font-bold text-gray-800'>Subscribe now & get 20% off</p>
            <p className='text-gray-400 mt-3 font-semibold'>
                Join now and enjoy 20% off your first purchase! Don't miss out on exclusive deals, new arrivals, and the latest trends delivered straight to your inbox. Shop smarter, save more!
            </p>
            <form className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
                <input className='w-full sm:flex-1 outline-none' type="email" required placeholder='Enter your email' />
                <button onClick={onSubmitHandler} className='bg-black text-white text-xs px-10 py-4' type='submit'>SUBSCRIBE</button>
            </form>
        </div>
    )
}

export default NewsLetter