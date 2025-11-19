import React, { useEffect, useRef, useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import toast from 'react-hot-toast';
import axios from 'axios';
import Divider from './Divider';
import {v4 as uuidv4} from 'uuid';
import { useNavigate } from 'react-router-dom';

const CodeShare = ({onClose , user}) => {
    const [roomID, setRoomID] = useState('');
    const [name, setName] = useState(user?.name);
    const navigate = useNavigate();
    const roomIDInputRef = useRef(null);
    const [preRoomID, setPreRoomID] = useState('');

    const handleOnChangeID = (e) => {
        setRoomID(e.target.value);
    };

    const createNewRoom = async(e) => {
        e.preventDefault();
        let newId = uuidv4();
        setRoomID(newId);
        if(newId) {
            toast.success('New Room Created');
            roomIDInputRef.current.focus(); 
        } else {
            toast.error('Error in creating new room');
        }
    };

    const handleJoinRoom = async(e) => {
        if(!roomID || !name) {
            toast.error('Please fill the details');
            return;
        }
        // Redirect to the room
        localStorage.setItem('roomID', roomID);
        navigate(`/room/${roomID}`, {
            state: { 
                name : name,
                profile_pic : user?.profile_pic ,
                _id : user?._id
            },
        });

    };

    const handleReJoinRoom = async(e) => {
        if(!preRoomID) {
            toast.error('Please fill the details');
            return;
        }

        // Redirect to the room
        if(!name) 
            setName('Guest');

        navigate(`/room/${preRoomID}`, {
            state: {
                name : name,
                profile_pic : user?.profile_pic ,
                _id : user?._id
            },
        }); 
    };

    const handleOpenCreateRoom = async(e) => {
        setPreRoomID('');
        localStorage.removeItem('roomID');
    };

    const handleInputEnter = (e) => {
        if(e.code === 'Enter') {
            handleJoinRoom();
        }
    }

    useEffect(() => {
        setPreRoomID(localStorage.getItem('roomID'));
    } , []);

    return (
        <div className='h-full fixed top-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
            {preRoomID ? (
                <div className='bg-white w-full max-w-sm rounded-md'>
                    <h2 className='font-bold text-center text-lg lg:text-2xl shadow-sm rounded-lg pt-2'>Real Time Code Editor</h2>
                    <div className='flex flex-col'>
                        <div className='flex flex-row justify-around items-center mt-[3%] lg:mt-[5%]'>
                            <button className='border-secondary border px-2 lg:px-4 bg-secondary text-white font-semibold py-1 rounded hover:border-third hover:bg-third text-sm' onClick={handleReJoinRoom}>Re-Join</button>
                            <button className='border-secondary border px-2 lg:px-4 bg-secondary text-white font-semibold py-1 rounded hover:border-third hover:bg-third text-sm' onClick={handleOpenCreateRoom}>New Room</button>
                        </div>
                        <div className='flex flex-row justify-around items-center mt-[3%] lg:mt-[5%] mb-[3%] lg:mb-[5%]'>
                            <button className='border px-2 lg:px-4  py-1 rounded border-red-400 text-red-400 hover:bg-red-400 hover:text-white text-sm' onClick={onClose}>Close</button>
                        </div>
                    </div>
                </div>
                ) : (
                    <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm'>
                        <h2 className='font-bold text-center text-2xl shadow-sm rounded-lg'>Real Time Code Editor</h2>
                        <div className='grid gap-3 mt-3'>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='name'>Room ID </label>
                                <input
                                    type='text'
                                    id='name'
                                    name='name'
                                    placeholder='Enter Room ID'
                                    value={roomID}
                                    onChange={handleOnChangeID}
                                    onKeyUp={handleInputEnter}
                                    ref={roomIDInputRef}
                                    className='w-full p-1 px-2 focus:outline-secondary border'   
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='name'>Name: </label>
                                <input
                                    type='text'
                                    id='name'
                                    name='name'
                                    placeholder='Enter Name'
                                    value={name}
                                    disabled={true}
                                    onKeyUp={handleInputEnter}
                                    className='w-full p-1 px-2 focus:outline-secondary border'   
                                />
                            </div>
                            <Divider />
                            <div className='flex gap-2 w-fit ml-auto mt-2'>
                                <button className='border-secondary border px-4 text-secondary py-1 rounded hover:border-red-400 hover:text-red-400' onClick={onClose}>Close</button>
                                <button className='border-secondary border px-4 bg-secondary text-white font-semibold py-1 rounded hover:border-third hover:bg-third' onClick={handleJoinRoom}>Join</button>
                            </div>
                        </div>
                        <p className='my-3 text-center'>If you don't have invite then create <a onClick={createNewRoom} className='text-third hover:text-fourth hover:font-bold font-semibold cursor-pointer'>New Room</a></p>
                        <p className='text-xs text-gray-400 mt-2'>Note: You can share the Room ID with your friends to collaborate in real time</p>
                    </div>
                )
            }
        </div>
    )
}

export default CodeShare