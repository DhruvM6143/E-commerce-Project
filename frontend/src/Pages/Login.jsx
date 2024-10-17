import React, { useState } from 'react'
import { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const Login = () => {
    const { token, setToken, navigate, backendUrl, setCartItems } = useContext(ShopContext)
    const [email, setEmail] = useState('')
    const [curr, setCurr] = useState('Login');
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const onSubmitHandler = async (e) => {

        e.preventDefault();
        try {
            if (curr === 'Sign up') {
                const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
                if (response.data.success) {
                    setToken(response.data.token);
                    localStorage.setItem('token', response.data.token);
                    toast.success(response.data.message)
                }
                else {
                    toast.error(response.data.message)

                }

            }
            else {
                const response = await axios.post(backendUrl + '/api/user/login', { email, password })
                if (response.data.success) {
                    setToken(response.data.token);
                    localStorage.setItem('token', response.data.token);
                    toast.success(response.data.message, {
                        toastId: "succes1"
                    })
                    await fetchCartItems(response.data.token)
                }
                else {
                    toast.error(response.data.message, {
                        toastId: "error1"
                    })

                }

            }
        } catch (error) {
            console.log(error);
            toast.error('Error occurred')
        }
    }

    const fetchCartItems = async (token) => {
        try {
            const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token } }) // Correctly setting the authorization header
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
            else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)

        }
    }

    useEffect(() => {
        if (token) {
            navigate('/')
        }
    }, [token, navigate])



    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800' action="">
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='prata-regular text-3xl'>{curr}</p>
                <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
            </div>
            {
                curr === 'Login' ? '' : <input type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder='Name' className='w-full px-3 py-2 border border-gray-800' name="" id="" required />
            }

            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder='Email' className='w-full px-3 py-2 border border-gray-800' required />
            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder='Password' className='w-full px-3 py-2 border border-gray-800' required />
            <div className='w-full flex justify-between text-sm mt-[-9px]'>
                <p className='cursor-pointer'>Forgot your password ?</p>
                {
                    curr === 'Login'
                        ? <p className='cursor-pointer' onClick={() => setCurr('Sign up')}>Create Account</p>
                        : <p className='cursor-pointer' onClick={() => setCurr('Login')}>Login Here</p>
                }
            </div>
            <button className='bg-black text-white font-light px-8 py-2 mt-4'>{curr === 'Login' ? 'Sign In' : 'Sign Up'}</button>
        </form>
    )
}

export default Login