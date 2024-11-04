import React, { useContext, useEffect, useState } from 'react'
import Title from '../Components/Title'
import axios from 'axios';
import { ShopContext } from '../Context/ShopContext';
import { toast } from 'react-toastify';
import Loading from '../Components/Loading';

const MyProfile = ({ loading }) => {
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { backendUrl, token, navigate, setToken } = useContext(ShopContext)
    const [userData, setUserData] = useState({});

    const userProfile = async () => {

        try {
            if (token) {
                const response = await axios.post(backendUrl + '/api/user/profile', {}, { headers: { token } });
                if (response.data.success) {
                    setUserData(response.data.user);


                }
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }


    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(backendUrl + '/api/user/update', { newEmail, newName, newPassword }, { headers: { token } })
            if (response.data.success) {
                toast.success('Profile updated successfully')
                setUserData(response.data.user)
                setNewName('')
                setNewEmail('')
                setNewPassword('')
                userProfile()
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);

        }
    }
    useEffect(() => {
        if (!token) {
            const savedToken = localStorage.getItem('token')
            if (savedToken) {
                setToken(savedToken)
                userProfile()
            }
            else {
                navigate('/')
                toast.error(error.message)
            }
        }
        else {
            userProfile()
        }
    }, [token, navigate])



    return (
        <div>
            {
                loading ? (<Loading show={loading} />)
                    : (
                        <form onSubmit={submitHandler}>
                            <div className='flex items-center justify-center text-[40px]'>
                                <Title text1={"My"} text2={"Profile"} />
                            </div>
                            <div className='items-center justify-center mt-5  flex gap-5'>
                                <div >
                                    <p className='text-[20px]'>Name : {userData.name}</p>
                                    <input onChange={(e) => setNewName(e.target.value)} value={newName} className='w-full px-3 py-2 border border-gray-800' type="text" placeholder='Enter your new Name' />
                                </div>
                                <div>
                                    <p className='text-[20px]'>Email : {userData.email}</p>
                                    <input onChange={(e) => setNewEmail(e.target.value)} value={newEmail} className='w-full px-3 py-2 border border-gray-800' type="text" placeholder='Enter your new email' />
                                </div>
                                <div>
                                    <p className='text-[20px]'>Change Password</p>
                                    <input onChange={(e) => setNewPassword(e.target.value)} value={newPassword} className='w-full px-3 py-2 border border-gray-800' type="text" placeholder='Enter your new Password' />
                                </div>

                            </div>
                            <div className='flex justify-center'>
                                <button type='submit' className='bg-black text-white font-light px-8 py-2 mt-4'>Update</button>
                            </div>

                        </form>
                    )
            }
        </div>
    )
}

export default MyProfile