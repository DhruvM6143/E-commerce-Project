import React, { useContext, useState } from 'react'
import Title from './Components/Title'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from './Context/ShopContext'
import Loading from './Components/Loading'
const ResetPassword = ({ loading }) => {
    const [password, setPassword] = useState('')
    const [isValidP, setIsValidP] = useState(true)
    const [isValidCp, setIsValidCp] = useState(true)
    const { backendUrl, navigate } = useContext(ShopContext)
    const [confirmPassword, setConfirmPassword] = useState('')
    const { token } = useParams()

    const passwordChange = (e) => {
        const passwordValue = e.target.value;
        setPassword(passwordValue)

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        setIsValidP(passwordPattern.test(passwordValue))
    }
    const confirmPasswordChange = (e) => {
        const passwordValue = e.target.value;
        setConfirmPassword(passwordValue)

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        setIsValidCp(passwordPattern.test(passwordValue))
    }
    const submitHandler = async (e) => {
        e.preventDefault()
        if (isValidCp && isValidP) {
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
        else {
            toast.error("Invalid Password. Password must contain at least 8 characters, including uppercase and lowercase letters, numbers, and special characters.")
            return;
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
                                <input onChange={passwordChange} value={password} className='w-full px-3 py-2 border border-gray-800' type="text" />
                            </div>
                            <div>
                                <p>Re-Enter your Password</p>
                                <input onChange={confirmPasswordChange} value={confirmPassword} className='w-full px-3 py-2 border border-gray-800' type="text" />
                            </div>
                            <button type='submit' className='bg-black text-white font-light px-8 py-2 mt-4'>Change Password</button>
                        </form>
                    </div>)
            }
        </div>
    )
}

export default ResetPassword