import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaUserAstronaut } from "react-icons/fa6";

const CheckEmailPage = () => {
    const navigate = useNavigate();
    const [data , setData] = useState({
        email: '',
    });

    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        e.stopPropagation();

        const URL = `${process.env.REACT_APP_API_URL}/api/email`;

        try {
            const response = await axios.post(URL, data);
            toast.success(response?.data?.message);

            if(response?.data?.success) {
                setData({ email: '' });
                navigate('/password', { state: response?.data?.user });
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0F7FA] to-[#00796B]">
            <div className="bg-white w-[90%] max-w-lg p-8 rounded-xl shadow-lg flex flex-col items-center">
                <div className="flex justify-center mb-6">
                    <FaUserAstronaut size={80} className="text-[#00796B]" />
                </div>
                <h3 className="text-3xl font-bold text-center text-[#00796B]">Welcome to Chat App</h3>
                <p className="text-gray-600 text-center mt-2">Enter your email to get started</p>
                <form className="mt-6 w-full space-y-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm font-medium text-gray-600">Email:</label>
                        <input 
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-[#00796B]"
                            value={data.email}
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    <button 
                 className="w-full px-4 py-2 mt-4 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 transition duration-300 ease-in-out">
                  Let's Go
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">New User?  
                  <Link to="/register" className="ml-1 text-[#00796B] hover:text-[#004D40] font-semibold">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default CheckEmailPage;