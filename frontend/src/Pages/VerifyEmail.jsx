import React, { useContext, useState } from 'react'
import Title from '../Components/Title'
import { ShopContext } from '../Context/ShopContext';
import axios from 'axios'
import { toast } from 'react-toastify';
import Loading from '../Components/Loading'
const VerifyEmail = ({ loading }) => {
    const { backendUrl, navigate, setToken } = useContext(ShopContext)
    const [code, setCode] = useState('');
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(backendUrl + '/api/user/verify-email', { code })
            if (response.data.success) {

                setToken(response.data.token)
                localStorage.setItem('token', response.data.token)
                toast.success("Email verified successfully")
                navigate('/login')
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to verify email")

        }

    }
    return (
        <div>
            {
                loading ? (<Loading show={loading} />)
                    : (<div>
                        <div className='text-[35px]'>
                            <Title text1={"Please Verify Your"} text2={"Email !!"} />
                        </div>
                        <form onSubmit={submitHandler}>
                            <div>
                                <p className='text-lg'>Please Enter the Verification code that is sent to your provided Email</p>
                                <input className='w-full px-3 py-2 border border-gray-800' onChange={(e) => setCode(e.target.value)} type="number" required value={code} placeholder='Enter your code' />
                            </div>
                            <button type='submit' className='bg-black text-white font-light px-8 py-2 mt-4'>Verify</button>
                        </form>
                    </div>)
            }
        </div>
    )
}

export default VerifyEmail