import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/frontend_assets/assets';
import Loading from '../Components/Loading';

const Login = ({ loading }) => {
    const { token, setToken, navigate, backendUrl } = useContext(ShopContext)
    const [email, setEmail] = useState('')
    const [curr, setCurr] = useState('Login');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const toastId = 'auth';

    const onSubmitHandler = async (e) => {

        e.preventDefault();
        try {
            if (curr === 'Sign up') {
                const response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
                if (response.data.success) {
                    setToken(response.data.token);
                    localStorage.setItem('token', response.data.token);
                    if (!toast.isActive(toastId)) {
                        toast.success(response.data.message, { toastId })
                    }
                } else {
                    if (!toast.isActive(toastId)) {
                        toast.error(response.data.message, { toastId })
                    }
                }
            } else {
                const response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
                if (response.data.success) {
                    setToken(response.data.token);
                    localStorage.setItem('token', response.data.token);
                    if (!toast.isActive(toastId)) {
                        toast.success(response.data.message, { toastId })
                    }
                }
                else {
                    if (!toast.isActive(toastId)) {
                        toast.error(response.data.message, { toastId })
                    }

                }

            }
        } catch (error) {
            console.log(error);
            if (!toast.isActive(toastId)) {
                toast.error(error.message, { toastId })
            }
        }
    }

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token])



    return (
        <div>
            {
                loading ? (<Loading show={loading} />)
                    : (<form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
                        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                            <p className='prata-regular text-3xl'>{curr}</p>
                            <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
                        </div>
                        {curr === 'Login' ? null : (
                            <input
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                placeholder='Name'
                                className='w-full px-3 py-2 border border-gray-800'
                                required
                            />
                        )}
                        <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder='Email'
                            className='w-full px-3 py-2 border border-gray-800'
                            required
                        />
                        <div className='relative w-full'>
                            <input
                                type={showPassword ? 'text' : 'password'} // Toggle password visibility
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                placeholder='Password'
                                className='w-full px-3 py-2 border border-gray-800'
                                required
                            />
                            <button
                                type="button"
                                className='absolute right-3 top-1/2 transform -translate-y-1/2' // Positioning the eye icon
                                onClick={() => setShowPassword(prev => !prev)} // Toggle password visibility
                            >
                                <img className='w-[23px]' src={showPassword ? assets.eye : assets.hidden} alt="Toggle password visibility" />
                            </button>
                        </div>
                        <div className='w-full flex justify-between text-sm mt-[-9px]'>
                            <p className='cursor-pointer'>Forgot your password?</p>
                            {curr === 'Login' ? (
                                <p className='cursor-pointer' onClick={() => setCurr('Sign up')}>Create Account</p>
                            ) : (
                                <p className='cursor-pointer' onClick={() => setCurr('Login')}>Login Here</p>
                            )}
                        </div>
                        <button className='bg-black text-white font-light px-8 py-2 mt-4'>{curr === 'Login' ? 'Sign In' : 'Sign Up'}</button>
                    </form>)
            }
        </div>
    );
};

export default Login;
