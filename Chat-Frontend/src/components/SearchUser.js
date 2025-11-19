import React, { useEffect, useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import toast from 'react-hot-toast';
import axios from 'axios';
import { IoClose } from "react-icons/io5";

const SearchUser = ({onClose}) => {
    const [searchUser, setSearchUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const handleSearchUser = async () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/search-user`;
        try {
            setLoading(true);

            const response = await axios.post(URL, {
                search: search
            });

            setSearchUser(response?.data?.data);
            setLoading(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || error);
            setLoading(false);
        }
    }

    useEffect(() => {
        // if(search?.length > 0) {
            handleSearchUser();
        // }
    } , [search]);

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 p-2 z-10'>
            <div className='w-full max-w-lg mx-auto mt-10'>
                {/* Input search user */}
                <div className='bg-white rounded h-12 overflow-hidden flex'>
                    <input 
                        type='text' 
                        placeholder='Search User by name or email....' 
                        className='w-full outline-none h-full px-4 py-1' 
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />   
                    <div className='h-12 w-14 flex justify-center items-center cursor-pointer'>
                        <IoIosSearch 
                            size={25}
                            className='text-gray-500'
                        />
                    </div>
                </div>

                {/* Display searched user */}
                <div className='bg-white mt-2 p-2 w-full rounded'>
                    {/* No user found */}
                    {searchUser.length === 0 && !loading && (
                        <p className='text-gray-400 text-center p-1'>No user found!</p>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div>
                            <Loading />
                        </div>
                    )}

                    {/* User found */}
                    {searchUser?.length > 0 && !loading && (
                        <div>
                            {searchUser?.map((user , index) => (
                                <UserSearchCard key={user?._id} user={user} onClose={onClose}/>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div >
                <button onClick={onClose} className='fixed top-2 right-2 p-1 bg-white  rounded-full hover:bg-red-400 hover:text-white'>
                    <IoClose 
                        size={25}
                    />
                </button>
            </div>
        </div>
    )
}

export default SearchUser