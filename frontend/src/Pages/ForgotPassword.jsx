import React, { useContext, useState } from 'react'
import Title from '../Components/Title'
import axios from 'axios'
import { ShopContext } from '../Context/ShopContext'
import { toast } from 'react-toastify'
import Loading from '../Components/Loading'
const ForgotPassword = ({ loading }) => {
    const [email, setEmail] = useState('')
    const { backendUrl, navigate } = useContext(ShopContext)
    const submitHandler = async (e) => {
        e.preventDefault();
        // Send Email to the provided email address

        const response = await axios.post(backendUrl + '/api/user/forgot-password', { email });
        if (response.data.success) {
            toast.success('Email sent successfully. Please check your inbox.')
            setEmail('')
            navigate('/login')
        }

    }
    return (
        <div>
            {
                loading ? (<Loading show={loading} />)
                    : <div>
                        <div className='text-[35px]' >
                            <Title text1={"Forgot"} text2={"Password ? "} />
                        </div>



                        <form onSubmit={submitHandler} >
                            <p className='text-[20px]'>Enter Your Email !</p>
                            <input className='w-full px-3 py-2 border border-gray-800' placeholder=' your Email....' onChange={(e) => setEmail(e.target.value)} value={email} type="email" required />
                            <button type='submit' className='bg-black text-white font-light px-8 py-2 mt-4'>Send Mail</button>
                        </form>
                    </div>
            }


        </div>

    )
}

export default ForgotPassword