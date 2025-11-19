import React, { useRef, useState } from 'react'
import Avatar from './Avatar';
import uploadFile from '../helpers/uploadFile';
import Divider from './Divider';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const EditUserDetails = ({onClose , user}) => {
    const [data , setData] = useState({
        name: user?.name,
        profile_pic: user?.profile_pic
    })
    const uplaodPhotoRef = useRef();
    const dispatch = useDispatch();

    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleOpenUploadPhoto = (e) => {
        e.preventDefault();
        e.stopPropagation();
        uplaodPhotoRef.current.click();
    }

    const handleUploadPhoto = async(e) => {
        const file = e.target.files[0];
        const uplaodPhoto = await uploadFile(file);
        setData((prev) => {
            return {
                ...prev,
                profile_pic: uplaodPhoto?.url
            }
        });
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const URL = `${process.env.REACT_APP_API_URL}/api/update-user`;
            const response = await axios({
                method: 'POST',
                url: URL,
                data: data,
                withCredentials: true
            });

            if(response?.data?.success) {
                toast.success(response?.data?.message);
                dispatch(setUser(response?.data?.data));
                onClose();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || 'Something went wrong');
        }
    }

    return (
        <div className='h-full fixed top-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
            <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm'>
                <h2 className='font-semibold'>Profile Detail</h2>
                <p className='text-sm mt-1'>Edit User Detail</p>
                <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='name'>Name: </label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={data?.name}
                            onChange={handleOnChange}
                            className='w-full p-1 px-2 focus:outline-secondary border'   
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <div>Photo </div>
                        <div className='mt-1 flex items-center gap-3'>
                            <Avatar 
                                width={40}
                                height={40}
                                imageUrl={data?.profile_pic}
                                name={data?.name}
                                userId={user?._id}
                            />
                            <label htmlFor='profile_pic'>
                                <button className='bg-gray-100 rounded  p-1  font-semibold' onClick={handleOpenUploadPhoto}>Change Photo</button>
                                <input 
                                    type='file'
                                    id='profile_pic'
                                    name='profile_pic'
                                    className='hidden'
                                    onChange={handleUploadPhoto}
                                    ref={uplaodPhotoRef}
                                />
                                </label>
                        </div>
                    </div>
                    <Divider />
                    <div className='flex gap-2 w-fit ml-auto mt-2'>
                        <button className='border-secondary border px-4 text-secondary py-1 rounded hover:border-red-400 hover:text-red-400' onClick={onClose}>Close</button>
                        <button className='border-secondary border px-4 bg-secondary text-white font-semibold py-1 rounded hover:border-third hover:bg-third' onSubmit={handleSubmit}>Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditUserDetails