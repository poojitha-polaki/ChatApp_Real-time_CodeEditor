import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [data , setData] = useState({
        name: '',
        email: '',
        password: '',
        profile_pic: ''
    });
    const [uploadPhoto, setUploadPhoto] = useState('');

    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUploadPhoto = async(e) => {
        const file = e.target.files[0];
        const uploadedPhoto = await uploadFile(file);
        setUploadPhoto(file);
        setData((prev) => ({
            ...prev,
            profile_pic: uploadedPhoto?.url
        }));
    };

    const handleClearUploadPhoto = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setUploadPhoto('');
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        e.stopPropagation();

        const URL = `${process.env.REACT_APP_API_URL}/api/register`;

        try {
            const response = await axios.post(URL, data);
            toast.success(response?.data?.message);

            if(response?.data?.success) {
                setData({
                    name: '',
                    email: '',
                    password: '',
                    profile_pic: ''
                });
                setUploadPhoto('');
                navigate('/email');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#E0F7FA] to-[#00796B]">
            <div className="bg-white w-[90%] max-w-md overflow-hidden p-6 rounded-lg shadow-lg mx-auto">
                <h3 className="font-semibold text-center text-2xl text-gray-700 mt-2">Join Our Chat App</h3>
                <p className="text-center text-gray-500 mb-4">Create your account and start chatting!</p>
                <form className="grid gap-6" onSubmit={handleSubmit}>
                    {/* Name Input */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name" className="text-gray-600 font-medium">Name:</label>
                        <input 
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your name"
                            className="bg-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
                            value={data.name}
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-gray-600 font-medium">Email:</label>
                        <input 
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            className="bg-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
                            value={data.email}
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-gray-600 font-medium">Password:</label>
                        <input 
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            className="bg-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
                            value={data.password}
                            onChange={handleOnChange}
                            required
                        />  
                    </div>

                    {/* Profile Picture Upload */}
                    <div className='flex flex-col gap-1 cursor-pointer'>
                        <label htmlFor='profile_pic' className='text-gray-600 font-medium'>Profile Picture:</label>
                        <div className={`h-[56px] bg-gray-100 flex justify-between items-center border border-dashed hover:border-indigo-400 rounded-lg cursor-pointer px-4 py-2 ${uploadPhoto ? 'border-indigo-400' : ''}`}>
                            <p className={`text-sm truncate ${uploadPhoto ? 'text-indigo-700' : 'text-gray-500'}`}>
                                {uploadPhoto?.name ? uploadPhoto?.name : 'Upload your profile picture'}
                            </p>
                            
                            {uploadPhoto?.name &&   
                                <button className='text-red-500 ml-auto' onClick={handleClearUploadPhoto}>
                                    <IoClose size={20} />
                                </button>
                            }
                        </div>
                        <input 
                            type='file'
                            id='profile_pic'
                            name='profile_pic'
                            className='hidden'
                            onChange={handleUploadPhoto}
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        type='submit' 
                        className='bg-indigo-500 text-white text-lg px-4 py-[10px] rounded-lg hover:bg-indigo-600 transition duration-200 mt-[10px] font-bold'>
                        Register
                    </button>
                </form>

                {/* Already have an account? */}
                <p className='mt-[20px] text-center text-gray-600'>Already have an account? 
                    <Link to={'/email'} className='ml-[5px] text-indigo-500 hover:text-indigo-600 font-semibold'>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;