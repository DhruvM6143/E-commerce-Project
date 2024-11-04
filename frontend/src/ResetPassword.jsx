import React, { useContext, useState } from 'react'
import Title from './Components/Title'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from './Context/ShopContext'
import Loading from './Components/Loading'
const ResetPassword = ({ loading }) => {
    const [password, setPassword] = useState('')
    const { backendUrl, navigate } = useContext(ShopContext)
    const [confirmPassword, setConfirmPassword] = useState('')
    const { token } = useParams()
    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            if (password !== confirmPassword) {
                toast.error("Password does not match")
                return;
            }
            const response = await axios.post(backendUrl + `/api/user/reset-password/${token}`, { password })
            if (response.data.success) {
                toast.success("Password changed successfully")
                navigate("/login")
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)

        }

    }
    return (
        <div>
            {
                loading ? (<Loading show={loading} />)
                    : (<div>
                        <div className='text-[35px]'>
                            <Title text1={"Reset Your"} text2={"Password here !!"} />
                        </div>
                        <form onSubmit={submitHandler}>
                            <div>
                                <p>Enter your new Password</p>
                                <input onChange={(e) => setPassword(e.target.value)} value={password} className='w-full px-3 py-2 border border-gray-800' type="text" />
                            </div>
                            <div>
                                <p>Re-Enter your Password</p>
                                <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} className='w-full px-3 py-2 border border-gray-800' type="text" />
                            </div>
                            <button type='submit' className='bg-black text-white font-light px-8 py-2 mt-4'>Change Password</button>
                        </form>
                    </div>)
            }
        </div>
    )
}

export default ResetPassword