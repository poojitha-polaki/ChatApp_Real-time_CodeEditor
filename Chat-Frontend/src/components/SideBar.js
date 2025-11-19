import React, { useEffect, useState } from 'react'
import { MdChat } from "react-icons/md";
import { FaImage, FaUserPlus, FaVideo } from "react-icons/fa6";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import Avatar from './Avatar';
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from './SearchUser';
import { logout, setUser } from '../redux/userSlice';
import { FcCollaboration } from "react-icons/fc";
import CodeShare from './CodeShare';
import axios from 'axios';

const SideBar = ({name}) => {
    const user = useSelector(state => state?.user);
    const [title , setTitle] = useState(name);
    const [editUserOpen , setEditUserOpen] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [openSearchUser, setOpenSearchUser] = useState(false);
    const [openCodeShare, setOpenCodeShare] = useState(false);
    const socketConnection = useSelector(state => state?.user?.socketConnection);
    const [hideRoom , setHideRoom] = useState(false);
    const location = useLocation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchUserDetails = async() => {
        try {
            const token = localStorage.getItem('token');
            const URL = `${process.env.REACT_APP_API_URL}/api/user-details`;
            const response = await axios({
                method: 'POST',
                url: URL,
                data : {
                  token: token,
                }
            });
            
            dispatch(setUser(response?.data?.data));
    
            if(response?.data?.data?.logout) {
              dispatch(logout());
              navigate('/email');
            }
    
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(() => {
    fetchUserDetails();
    } , []);

    useEffect(() => {
        if(user?.name === 'TokenExpiredError') {
            dispatch(logout());
            localStorage.clear();
            navigate('/email');
        }
    },[user]);

    const handleLogOut = () => {
        dispatch(logout());
        navigate('/email');
        localStorage.clear();
        window.location.reload();
    }

    useEffect(() => {
        if(socketConnection){
            socketConnection?.emit('sidebar', user?._id);
            socketConnection?.on('conversation', async(data) => {
                const conversationUserData = await data?.map((conversationUser , index) => {
                    if(conversationUser?.sender?._id === conversationUser?.receiver?._id) {
                        return {
                            ...conversationUser,
                            userDetails : conversationUser?.sender
                        }
                    } else if(conversationUser?.receiver?._id !== user?._id) {
                        return {
                            ...conversationUser,
                            userDetails : conversationUser?.receiver
                        }
                    } else {
                        return {
                            ...conversationUser,
                            userDetails : conversationUser?.sender
                        }
                    }
                })

                setAllUsers(conversationUserData);
            });
        }
    },[socketConnection , user , dispatch , location?.pathname]);

    
    return (
        <div className='w-full h-full grid grid-cols-[56px,1fr] bg-white'>
            <div className='bg-gray-200 w-14 h-full py-4 text-gray-600 flex flex-col justify-between'>
                <div>
                    <NavLink 
                        onClick={() => {    
                            navigate('/')
                            setTitle('Chat')
                        }}
                        className={`w-14 h-12 flex justify-center items-center cursor-pointer hover:bg-gray-300 rounded ${title === 'Chat' ? 'bg-gray-300' : ''} `} title='chat'>
                        <MdChat  
                            size={22}
                        />
                    </NavLink>
                    {title !== 'Room' && (
                        <div 
                            onClick={() => {
                                setOpenSearchUser(true) 
                                setTitle('Search')
                            }} 
                            className={`w-14 h-12 flex justify-center items-center cursor-pointer hover:bg-gray-300 rounded mt-5 ${title === 'Search' ? 'bg-gray-300' : ''}`} title='Add Friend'>
                            <FaUserPlus 
                                size={22}
                            />
                        </div>
                    )}
                    <div 
                        onClick={() => {
                            if(title !== 'Room') {
                                setOpenCodeShare(true)
                                setTitle('Room')
                                return;
                            } else {
                                setHideRoom(!hideRoom)
                            }
                        }} 
                        className={`w-14 h-12 flex justify-center items-center cursor-pointer hover:bg-gray-300 rounded mt-5 ${title === 'Room' ? 'bg-gray-300' : ''}`} title='Code Share'>
                        <FcCollaboration 
                            size={22}
                        />
                    </div>
                </div>
                <div className='flex flex-col items-center'>
                    <button className='mx-auto' title={user?.name} onClick={() => setEditUserOpen(true)}>
                        <Avatar 
                            width={50}
                            height={50}
                            name={user?.name}
                            imageUrl={user?.profile_pic}
                            userId={user?._id}
                        />
                    </button>
                    <button onClick={handleLogOut} className='w-14 h-12 flex justify-center items-center cursor-pointer hover:bg-gray-300 rounded mt-5' title='LogOut' >
                        <span className='-ml-2'>
                            <BiLogOut
                                size={22}
                            />
                        </span>
                    </button>
                </div>
            </div>

            {title !== 'Room' && (
                <div className='w-full'>
                    <div className='h-16 flex items-center'>
                        <p className='text-xl font-bold p-4 text-gray-800'>
                            Message
                        </p>
                    </div>
                    <div className='bg-gray-200 p-[0.5px]'>
                    </div>
                    <div className=' h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
                        {allUsers?.length === 0 && (
                            <div className='mt-20'>
                                <div className='flex justify-center items-center mt-4 text-gray-400'> 
                                    <FiArrowUpLeft 
                                        size={50}
                                    />
                                </div>
                                <p className='text-lg text-center text-gray-400'>Explore users to start a conversation with</p>
                            </div>
                        )}
                        {allUsers?.map((conv , index) => {
                            return (
                                <NavLink to={'/'+conv?.userDetails?._id} key={conv?._id} className='flex items-center gap-2 py-3 px-2 border hover:border-primay rounded hover:bg-gray-100 cursor-pointer'>
                                    <div>
                                        <Avatar 
                                            width={45}
                                            height={45}
                                            name={conv?.userDetails?.name}
                                            imageUrl={conv?.userDetails?.profile_pic}
                                            userId={conv?.userDetails?._id}
                                        />
                                    </div>
                                    <div>
                                        <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>{conv?.userDetails?.name}</h3>
                                        <div className='text-gray-400 text-xs flex items-center gap-1'>
                                            <div className='flex items-center gap-1'>
                                                {conv?.lastMsg?.imageUrl && (
                                                    <div className='flex items-center gap-1'>
                                                        <span className='text-secondary'>
                                                            <FaImage />
                                                        </span>
                                                        {!conv?.lastMsg?.text && <span>Image</span>}
                                                    </div>
                                                )}
                                                {conv?.lastMsg?.videoUrl && (
                                                    <div className='flex items-center gap-1'>
                                                        <span className='text-purple-400'>
                                                            <FaVideo />
                                                        </span>
                                                        {!conv?.lastMsg?.text && <span>Video</span>}
                                                    </div>
                                                )}
                                            </div>
                                            <p className='text-ellipsis line-clamp-1'>
                                                {conv?.lastMsg?.text}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Unseen Message */}
                                    {Boolean(conv?.unseenMsg) && 
                                        <p className='flex justify-center items-center text-xs w-6 h-6 ml-auto p-1 bg-third text-white font-semibold rounded-full'>{conv?.unseenMsg}</p>
                                    }
                                </NavLink>
                            )
                        })}
                    </div>
                </div>
            )}
            

            {/* Edit User Detail */}
            {editUserOpen &&
                <EditUserDetails  
                    onClose = {() =>{
                        setEditUserOpen(false)
                    }}
                    user = {user}
                />
            }

            {/* Search User */}
            {openSearchUser && (
                <SearchUser 
                    onClose={() => {
                        setOpenSearchUser(false)
                        setTitle('Chat')
                    }}
                />
            )}
                
            {/* Code Share */}
            {openCodeShare && (
                <CodeShare 
                    onClose={() => {
                        setOpenCodeShare(false)
                        setTitle('Chat')
                    }}
                    user = {user}
                />
            )}

        </div>
    )
}

export default SideBar