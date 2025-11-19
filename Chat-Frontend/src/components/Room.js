import React, { useEffect, useRef, useState } from 'react'
import SideBar from './SideBar'
import logo2 from '../assets/logo2.png'
import Avatar from './Avatar';
import { IoIosSearch } from 'react-icons/io';
import Loading from './Loading';
import axios from 'axios';
import toast from 'react-hot-toast';
import ClientSearchCard from './ClientSearchCard';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { RxCross1 } from "react-icons/rx";
import { io } from 'socket.io-client';
import initSocket from './Socket';
import ACTIONS from '../Action';
import handleError from './Error';
import EditorComponent from './Editor';

const Room = () => {
    const location = useLocation();
    const { name, profile_pic, _id } = location.state || {};
    const params = useParams();
    const socketConnection = useSelector(state => state?.user?.socketConnection);
    const [loading, setLoading] = useState(false);
    const [searchUser, setSearchUser] = useState([]);
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [client, setClient] = useState([]);
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [showSideBar, setShowSideBar] = useState(false);

    // Now i will use useRef to avoid re-rendering of the component
    const socketRef = useRef(null);

    useEffect(() => {
        if(socketConnection) 
            socketRef.current = socketConnection;

        if(socketRef.current) {
            socketRef.current?.on(ACTIONS.SYNC_CODE , (newCode) => {
                setCode(newCode);
            });

            socketRef.current?.on('language-update', (newLanguage) => {
                setLanguage(newLanguage);
            });
        }
        return () => {
            socketRef.current?.off(ACTIONS.SYNC_CODE);
            socketRef.current?.off('language-update');
        }
    }, []);

    // Socket connection
    useEffect(() => {
        let init = async () => {
            if(!socketConnection) {
                socketRef.current = await initSocket(dispatch);
            }
            setTimeout(() => {
                if(socketConnection) {
                    socketRef.current = socketConnection;
                }
                if(socketRef.current && params?.roomId && name) {
                    socketRef.current.emit(ACTIONS.JOIN, {
                        roomId: params?.roomId,
                        userId: _id
                    });
                    socketRef.current.on(ACTIONS.JOINED, (data) => {
                        const { populatedClients, user, socketId } = data;
                        if (user?._id !== _id) {
                            toast.success(`${user?.name} joined the room`);
                        }
                        setClient(populatedClients);
                    });

                    socketRef.current?.on('language-update', (newLanguage) => {
                        setLanguage(newLanguage);
                    });

                    socketRef.current?.on(ACTIONS.SYNC_CODE , (newCode) => {
                        setCode(newCode);
                    });
                }
            }, 1000);
        };
        init();
}, []);


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

    const onClose = () => {
        setSearchUser([]);
        setSearch('');
    };

    const fetchUserDetails = async() => {
        try {
            const URL = `${process.env.REACT_APP_API_URL}/api/user-details`;
            const response = await axios({
                url: URL,
                withCredentials: true,
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
    
    const toggleSelect = (userId) => {
      setSelectedUserIds((prevSelected) =>
        prevSelected.includes(userId)
          ? prevSelected.filter((id) => id !== userId)
          : [...prevSelected, userId]
      );
    };

    const handleInviteUsers = async() => {
        // setTimeout(() => {
            if(socketConnection) {
                for(let selectedUserId of selectedUserIds) {
                    socketConnection.emit('new-message', {
                        sender : _id,
                        receiver : selectedUserId,
                        text : params?.roomId,
                        msgByUserId : _id
                    });
                }
                setSearch('');
                toast.success('Invitation sent successfully');
            }
        // } ,  100);
    };
    
    useEffect(() => {
        if(search?.length > 0) {
            handleSearchUser();
        } else {
            setSearchUser([]);
            setSelectedUserIds([]);
        }
    } , [search]);

    useEffect(() => {
        fetchUserDetails();
    } , []);


    // handle code change
    const handleCodeChange = (value) => {
        setCode(value);
        if(setSocketConnection) 
            socketRef.current = socketConnection;
            if(socketRef.current) {
                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                    roomId: params?.roomId,
                    code: value
                });
            }
    };

    // handle language change
    const handleLanguageChange = (e) => {
        let newLanguage = e.target.value;
        setLanguage(newLanguage);

        if(socketConnection)
            socketRef.current = socketConnection;

        if(socketRef.current) {
            socketRef.current.emit('language-change', {
                roomId: params?.roomId,
                language: newLanguage
            });
        }
    };

    // handle copy room id
    const handleCopyRoomID = () => {
        navigator.clipboard.writeText(params?.roomId);
        toast.success('Room ID copied to clipboard');
    };

    // handle leave room
    const handleLeaveRoom = () => {
        if(socketConnection) 
            socketRef.current = socketConnection;
        if(socketRef.current) {
            socketRef.current.emit(ACTIONS.LEAVE, {
                roomId: params?.roomId,
                userId: _id
            });
        }
        localStorage.removeItem('roomID');
        toast.success('You left the room');
        navigate('/');
    }

    return (
        <div className='flex h-screen overflow-hidden'>
            <div className='h-screen'>
                <SideBar name={'Room'} />
            </div>
            <div className={`flex flex-col bg-gray-50 p-2 relative w-[90%] lg:w-[25%] rounded shadow-xl ${showSideBar ? 'hidden' : ''} `}> 
                <div className='flex flex-col'>
                    <div className='border-b border-gray-300'>
                        <img 
                            src={logo2} 
                            alt='logo' 
                            width={200}
                        />
                    </div>
                    {/* Search User */}
                    <div className='rounded h-12 overflow-hidden flex border mt-2 shadow-md'>
                        <input 
                            type='text' 
                            placeholder='Add Users' 
                            className='w-full outline-none h-full px-4 py-1' 
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />   
                        {search.length === 0 ? (
                            <div className='h-12 w-8 flex justify-center items-center cursor-pointer'>
                                <IoIosSearch
                                    size={25}
                                    className='text-gray-500'
                                />
                            </div>
                        ) : (
                            <div 
                                onClick = {() => {
                                    setSearch('')
                                }} 
                                className='h-12 w-8 flex justify-center items-center cursor-pointer'
                            >
                                <RxCross1
                                    size={20}
                                    className='text-gray-500'
                                />
                            </div>
                        )}
                    </div>
                    {/* Display searched user */}
                    {search.length > 0 && (
                        <div className='bg-white mt-[60%] lg:mt-[50%] md:mt-[50%] p-2 w-[94%] rounded absolute z-10 border shadow-md'>
                            {/* No user found */}
                            {search.length > 0 && searchUser.length === 0 && !loading && (
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
                                <>
                                    <div className='max-h-[300px] overflow-y-auto'>
                                        {searchUser?.map((user) => (
                                            <ClientSearchCard
                                                key={user?._id}
                                                user={user}
                                                onClose={onClose}
                                                isSelected={selectedUserIds.includes(user?._id)}
                                                toggleSelect={toggleSelect}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleInviteUsers}
                                        className='border px-4 py-1 w-full rounded bg-secondary text-white font-bold mt-1 hover:bg-third'>
                                        Invite
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    <h3 className='font-semibold text-lg mt-3'>
                        Connected
                    </h3>
                    <div>
                        {client?.map((client) => (
                            <div key={client.socketId} className='flex items-center my-3'>
                                <Avatar 
                                    width={45}
                                    height={45}
                                    name={client?.userId?.name}
                                    imageUrl={client?.userId?.profile_pic}
                                    userId={client?.userId?._id}
                                />
                                <h3 className='text-ellipsis line-clamp-1 font-semibold text-base ml-3'>{client?.userId?.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='flex flex-col gap-3 mt-auto mb-6'>
                    <select className='p-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-[20%]'
                        value={language}
                        onChange={handleLanguageChange}
                    >
                        <option value='javascript'>JavaScript</option>
                        <option value='python'>Python</option>
                        <option value='java'>Java</option>
                        <option value='c'>C</option>
                        <option value='c++'>C++</option>
                        <option value='html'>HTML</option>
                        <option value='css'>CSS</option>
                    </select>
                    <button onClick={handleCopyRoomID} className='border-gray-200 border px-4 bg-gray-200 font-semibold py-1 rounded hover:border-gray-400 hover:bg-gray-400 hover:font-bold'>Copy Room ID</button>
                    <button onClick={handleLeaveRoom} className='border-red-400 border px-4 py-1 rounded bg-red-400  hover:border-red-500 hover:bg-red-500 text-white hover:font-bold'>Leave Room</button>
                </div>
            </div>
            <div className='w-full h-full'>
                <div className='h-[5%] bg-gray-200 flex justify-between items-center p-2'>
                    <h3 className={` ${!showSideBar ? 'hidden lg:block md:block' : 'block'} lg:text-xl font-semibold text-gray-700 p-2 md:text-lg`}>
                        Code Editor
                    </h3>
                    <button onClick = {() => setShowSideBar(!showSideBar)} className='w-[23%] p-1.5 border border-gray-300 rounded-md shadow-sm bg-white sm:hidden'>
                        Menu
                    </button>
                </div>
                <EditorComponent 
                    language={language}
                    roomId={params?.roomId}
                    socketRef={socketRef}
                    code={code}
                    onChange={handleCodeChange}
                />
            </div>
        </div>
    )
}

export default Room