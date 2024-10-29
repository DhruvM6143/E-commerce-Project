import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const Login = ({ setToken, loading }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault()
            const response = await axios.post(backendUrl + '/api/user/admin', { email, password })
            if (response.data.success) {
                setToken(response.data.token)
            }
            else {
                toast.error(response.data.message)
            }


        } catch (error) {
            console.log(error);
            toast.error(error.message)

        }
    }
    return (
        <div>
            {
                loading ? (<Loading show={loading} />) : (
                    <div className='min-h-screen flex items-center justify-center w-full'>
                        <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
                            <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
                            <form onSubmit={onSubmitHandler}>
                                <div className='mb-3 min-w-72'>
                                    <p className='text-sm font-medium mb-2 text-gray-700'>Email Address</p>
                                    <input className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder='your@email.com' required />
                                </div>
                                <div className='mb-3 min-w-72'>
                                    <p className='text-sm font-medium mb-2 text-gray-700'>Password</p>
                                    <input className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="text" onChange={(e) => setPassword(e.target.value)} value={password} placeholder='Enter your password' required />
                                </div>
                                <div className='flex flex-col'>
                                    <button className='mt-2 w-full px-4 py-2 rounded-md bg-black text-white mb-3' type='submit'>Login</button>
                                    <a className='mt-2 w-full px-4 py-2 rounded-md bg-black text-white text-center' href='https://naruto-frontend.vercel.app/login' >User Login</a>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Login