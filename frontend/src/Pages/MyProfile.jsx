import React, { useContext, useEffect, useState } from 'react';
import Title from '../Components/Title';
import axios from 'axios';
import { ShopContext } from '../Context/ShopContext';
import { toast } from 'react-toastify';
import Loading from '../Components/Loading';

const MyProfile = ({ loading }) => {
    const [newName, setNewName] = useState('');
    const [isNameValid, setIsNameValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isValid, setIsValid] = useState(true);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { backendUrl, token, navigate, setToken } = useContext(ShopContext);
    const [userData, setUserData] = useState({});

    const handleEmail = (e) => {
        const emailvalue = e.target.value;
        setNewEmail(emailvalue);

        const emailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
        setIsValid(emailPattern.test(emailvalue));
    };

    const nameChange = (e) => {
        const namevalue = e.target.value;
        setNewName(namevalue);

        const namePattern = /^[a-zA-Z0-9 .'-]+$/;
        setIsNameValid(namePattern.test(namevalue));
    };

    const passwordChange = (e) => {
        const passwordValue = e.target.value;
        setNewPassword(passwordValue);

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        setIsPasswordValid(passwordPattern.test(passwordValue));
    };

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
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(backendUrl + '/api/user/update', { newEmail, newName, newPassword }, { headers: { token } });
            if (response.data.success) {
                toast.success('Profile updated successfully');
                setUserData(response.data.user);
                setNewName('');
                setNewEmail('');
                setNewPassword('');
                userProfile();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (!token) {
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                setToken(savedToken);
                userProfile();
            } else {
                navigate('/');
                toast.error('You must be logged in');
            }
        } else {
            userProfile();
        }
    }, [token, navigate]);

    return (
        <div className="p-4">
            {loading ? (
                <Loading show={loading} />
            ) : (
                <form onSubmit={submitHandler} className="max-w-lg mx-auto">
                    <div className="flex items-center justify-center text-[32px] md:text-[40px]">
                        <Title text1="My" text2="Profile" />
                    </div>
                    <div className="flex flex-col gap-5 mt-5">
                        <div>
                            <p className="text-[16px] md:text-[20px]">Name : {userData.name}</p>
                            <input
                                onChange={nameChange}
                                value={newName}
                                className="w-full px-3 py-2 border border-gray-800 mt-1 rounded-md"
                                type="text"
                                placeholder="Enter your new Name"
                            />
                            {!isNameValid && <p style={{ color: 'red' }}>Name can only contain letters, spaces, ., ', and -</p>}
                        </div>
                        <div>
                            <p className="text-[16px] md:text-[20px]">Email : {userData.email}</p>
                            <input
                                onChange={handleEmail}
                                value={newEmail}
                                className="w-full px-3 py-2 border border-gray-800 mt-1 rounded-md"
                                type="text"
                                placeholder="Enter your new email"
                            />
                            {!isValid && <p style={{ color: 'red' }}>Email must end with @gmail.com and can only contain letters, numbers, ., _, and -</p>}
                        </div>
                        <div>
                            <p className="text-[16px] md:text-[20px]">Change Password</p>
                            <input
                                onChange={passwordChange}
                                value={newPassword}
                                className="w-full px-3 py-2 border border-gray-800 mt-1 rounded-md"
                                type="password"
                                placeholder="Enter your new Password"
                            />
                            {!isPasswordValid && (
                                <p style={{ color: 'red' }}>
                                    Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character.
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-center mt-4">
                        <button type="submit" className="bg-black text-white font-light px-8 py-2 rounded-md">
                            Update
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default MyProfile;
