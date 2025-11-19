import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken} from '../redux/userSlice';

const CheckPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [data , setData] = useState({
        password: '',
    })

    useEffect(() => {
        if(!location?.state?.name) {
            navigate('/email');
        } 
    }, []);

    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        e.stopPropagation();

        const URL = `${process.env.REACT_APP_API_URL}/api/password`;

        try {
            const response = await axios({
                method: 'POST',
                url: URL,
                data: {
                    userId: location?.state?._id,
                    password: data?.password,
                },
                withCredentials: true,
            })
            toast.success(response?.data?.message);

            if(response?.data?.success) {
                dispatch(setToken(response?.data?.token));
                localStorage.setItem('token', response?.data?.token);
                setData({
                    password: '',
                });
                navigate('/');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    return (
        <div className='mt-10'>
            <div className='bg-white w-[90%] max-w-md overflow-hidden p-4 rounded-lg shadow-lg mx-auto'>
            <div className='w-fit mx-auto mb-2 flex justify-center items-center flex-col'>
                <Avatar 
                  width={70}
                  height={70}
                  imageUrl={location?.state?.profile_pic}
                  name={location?.state?.name}
                />
                <h2 className='font-semibold text-lg mt-1'>{location?.state?.name}</h2>
              </div>
                <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='password'>Password: </label>
                        <input 
                            type='password'
                            id='password'
                            name='password'
                            placeholder='Enter your password'
                            className='bg-slate-100 px-2 py-1 focus:outline-primay rounded pt-2 pb-2'
                            value={data.password}
                            onChange={handleOnChange}
                            required
                        />  
                    </div>
                    <button className='bg-indigo-500 text-white text-lg px-4 py-[10px] rounded-lg hover:bg-indigo-600 transition duration-200 mt-[10px] font-bold'>
                        Let's Go
                    </button>
                </form>
                <p className='my-3 text-center'><Link to={'/forgot-password'} className='hover:text-secondary font-semibold'>Forgot Password ?</Link></p>
            </div>
        </div>
    )
}

export default CheckPasswordPage