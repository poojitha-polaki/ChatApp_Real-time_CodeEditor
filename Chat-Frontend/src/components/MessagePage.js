import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'
import Avatar from './Avatar';
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft} from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa";
import { IoClose, IoVideocam } from "react-icons/io5";
import uploadFile from '../helpers/uploadFile';
import Loading from './Loading';
import backgroundImage from '../assets/wallpaper.jpeg';
import { IoSendSharp } from "react-icons/io5";
import moment from 'moment';
import { FaUserSlash } from "react-icons/fa";
import { GrClearOption } from "react-icons/gr";
import { useDispatch } from 'react-redux';

const MessagePage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  const user = useSelector(state => state?.user);
  const [userData , setUserData] = useState({
    name: '',
    email: '',
    profile_pic: '',
    online: false,
    _id: ''
  });
  const [openImageVideoUpload , setOpenImageVideoUpload] = useState(false);
  const [message , setMessage] = useState({
    text: '',
    imageUrl: '',
    videoUrl: ''
  });
  const [loading , setLoading] = useState(false);
  const [allMessage , setAllMessage] = useState([]);
  const [newAllMessage , setNewAllMessage] = useState([]);
  const [openMenu , setOpenMenu] = useState(false);
  const currentMessage = useRef();
  const [reRender , setReRender] = useState(false);
  const [viewMessageOf , setViewMessageOf] = useState('');
  
  const handleOpenMenu = () => {
    setOpenImageVideoUpload(false);
    setOpenMenu((prev) => !prev);
  }

  const handleUploadImageVideoOpen = () => {
    setOpenMenu(false);
    setOpenImageVideoUpload((prev) => !prev);
  }

  const handleUploadImage = async(e) => {
    setOpenImageVideoUpload(false);
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: ''
      }
    });
    const file = e.target.files[0];
    setLoading(true);
    const uplaodPhoto = await uploadFile(file);
    setLoading(false);

    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: uplaodPhoto?.url
      }
    });
  }

  const handleUploadVideo = async(e) => {
    setOpenImageVideoUpload(false);
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: ''
      }
    });
    const file = e.target.files[0];
    setLoading(true);
    const uplaodVideo = await uploadFile(file);
    setLoading(false);

    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: uplaodVideo?.url
      }
    });
  }

  const handleClearUploadImageVideo = (e) => {
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: '',
        videoUrl: ''
      }
    });
  }

  const handleOnChange = (e) => {
    setMessage((prev) => {
      return {
        ...prev,
        text: e.target.value
      }
    });
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if(message?.text || message?.imageUrl || message?.videoUrl) {
      if(socketConnection) {
        socketConnection.emit('new-message', {
          sender : user?._id,
          receiver : params?.userId,
          text : message?.text,
          imageUrl : message?.imageUrl,
          videoUrl : message?.videoUrl,
          msgByUserId : user?._id
        });
        setMessage((prev) => {
          return {
            ...prev,
            text: '',
            imageUrl: '',
            videoUrl: ''
          }
        });
      }
    }
    setReRender((prev) => !prev);
  }

  const handleRemove = (e) => {
    handleOpenMenu(false);
    if(socketConnection) {
      socketConnection.emit('remove', params?.userId);
      navigate('/');
    }
  }

  const handleClearChats = (e) => {
    handleOpenMenu(false);
    if(socketConnection) {
      socketConnection.emit('clear-chats', params?.userId);
      setReRender((prev) => !prev);
    } 
  }

  useEffect(() => {
    if(viewMessageOf && params?.userId !== viewMessageOf) {
      setAllMessage(newAllMessage);
    } else {
      setNewAllMessage(allMessage);
    }
    if(currentMessage?.current) {
      currentMessage?.current?.scrollIntoView({behavior: 'smooth', block: 'end'});
    }
  }, [allMessage]);

  useEffect(() => {
    setTimeout(() => {
      if(socketConnection) {
        socketConnection?.emit('message-page', params?.userId);
  
        socketConnection?.emit('seen', params?.userId);
  
        socketConnection?.on('message-user', (data) => {
          setUserData(data);
        });
  
        socketConnection?.on('message' , (data) => {
          setViewMessageOf(data?.viewMessageOf);
          setAllMessage(data?.messages);
        })
      }
    } , 100);
  },[socketConnection , params?.userId , reRender]);

  return (
    <div style={{backgroundImage: `url(${backgroundImage})`}} className='bg-no-repeat bg-cover'>
      <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
        <div className='flex items-center gap-4'>
          <Link to={'/'} className='lg:hidden'>
            <FaAngleLeft 
              size={20}
              className='cursor-pointer hover:text-secondary'
            />
          </Link>
          <div>
            <Avatar 
              width={50}
              height={50}
              name={userData?.name}
              imageUrl={userData?.profile_pic}
              userId={userData?._id}
            />
          </div>
          <div>
            <h3 className='font-semibold text-lg text-ellipsis line-clamp-1'>
              {userData?.name}
            </h3>
            <p className='-my-1 text-sm'>
              {userData?.online ? <span className='text-green-600'>Online</span> : <span className='text-gray-400'>Offline</span>}
            </p>
          </div>
        </div>
        <div>
          <button onClick={handleOpenMenu} className='cursor-pointer hover:text-secondary'>
            <HiDotsVertical 
              size={20}
            />
          </button>
        </div>
        {/* Video and image popup */}
      </header>
      {openMenu && (
        <div className='bg-white shadow rounded absolute mt-1 w-36 p-2 right-4 z-20'>
          <button onClick={handleRemove} className='w-full text-[#FF6B6B] flex items-center p-2 gap-3 border border-transparent border-b-gray-200 hover:bg-gray-100 hover:border-secondary cursor-pointer'>
            <FaUserSlash
              size={22}
            />
            <p>Remove</p>
          </button>
          <button onClick={handleClearChats} className='w-full text-[#6C63FF] flex p-2 gap-3 border border-transparent border-b-gray-200 hover:bg-gray-100 hover:border-secondary cursor-pointer'>
            <GrClearOption 
              size={22}
            />
            <p>Clear All</p>
          </button>
        </div>
      )}

      {/* Show all messages here */}
      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-gray-300 bg-opacity-30'>


        {/* Showing all messages  */}
        <div className='flex flex-col gap-4 py-4 px-4' ref={currentMessage}>
          {allMessage?.map((message , index) => {
             const isUserMessage = user?._id === message?.msgByUserId;
            return(
              <div
                key={index}
                className={`p-1 rounded-lg shadow-md w-fit max-w-[230px] md:max-w-sm lg:max-w-md ${
                  isUserMessage ? 'bg-teal-100 ml-auto' : 'bg-white'
                }`}
              >
                <div className='w-full'>
                  {message?.imageUrl && ( 
                    <img 
                      src={message?.imageUrl}
                      className='w-full h-full object-scale-down'
                    />
                  )}
                  {message?.videoUrl && ( 
                    <video 
                      src={message?.videoUrl}
                      className='w-full h-full object-scale-down'
                      controls
                    />
                  )}
                </div>
                <p className='px-2'>{message.text}</p>
                <p className='text-xs ml-auto w-fit'>{moment(message?.createdAt).format('hh:mm')}</p>
              </div>
            )
          })}
        </div>

        {/* Upload image display */}
        {message?.imageUrl && (
          <div className='w-full h-full sticky bottom-0 bg-gray-400 bg-opacity-80 flex justify-center items-center rounded overflow-hidden'>
            <div>
                <button onClick={handleClearUploadImageVideo} className='top-2 right-2 p-1   hover:text-red-600 absolute'>
                    <IoClose 
                        size={28}
                    />
                </button>
            </div>
            <div className='bg-white p-3'>
              <img 
                src={message?.imageUrl} 
                alt='image' 
                className='aspect-square h-full w-full max-w-sm m-2 object-scale-down'
              />
            </div>
          </div>
        )}

        {/* Upload video display */}
        {message?.videoUrl && (
          <div className='w-full h-full sticky bottom-0 bg-gray-400 bg-opacity-80 flex justify-center items-center rounded overflow-hidden'>
            <div>
                <button onClick={handleClearUploadImageVideo} className='top-2 right-2 p-1   hover:text-red-600 absolute'>
                    <IoClose 
                        size={28}
                    />
                </button>
            </div>
            <div className='bg-white p-3'>
              <video 
                src={message?.videoUrl} 
                className='aspect-square h-full w-full max-w-sm m-2 object-scale-down'
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}

        {/* Loading... */}
        {loading && (
          <div className='w-full h-full sticky bottom-0 flex justify-center items-center'>
            <Loading />
          </div>
        )}
      </section>

      {/* Send message */}
      <section className='h-16 bg-white flex items-center p-2'>
        <div className='relative '>
          {!openImageVideoUpload ? (
            <button title='Upload' onClick={handleUploadImageVideoOpen} className='flex justify-center items-center w-12 h-12 rounded-full text-gray-600 hover:bg-secondary hover:text-white cursor-pointer'>
              <FaPlus
                size={22}
              />
            </button>
          ): (
            <button title='Close' onClick={handleUploadImageVideoOpen} className='flex justify-center items-center w-12 h-12 rounded-full text-gray-600 hover:bg-red-400 hover:text-white cursor-pointer'>
              <IoClose
                size={25}
              />
            </button>
          )}

          {/* Video and image popup */}
          {openImageVideoUpload && (
            <div className='bg-white shadow rounded absolute bottom-14 w-36 p-2'>
              <form>
                <label htmlFor='uploadImage' className='flex items-center p-2 gap-3 border border-transparent border-b-gray-200  hover:bg-gray-100 hover:border-secondary cursor-pointer'>
                  <div className='text-secondary'>
                    <FaImage 
                      size={22}
                    />
                  </div>
                  <p>Image</p>
                </label>
                <label htmlFor='uploadVideo' className='flex  p-2 gap-3 border border-transparent border-b-gray-200  hover:bg-gray-100 hover:border-secondary cursor-pointer'>
                  <div className='text-purple-400'>
                    <IoVideocam 
                      size={22}
                    />
                  </div>
                  <p>Video</p>
                </label>
                <input 
                  type='file' 
                  id='uploadImage' 
                  onChange={handleUploadImage}
                  className='hidden'
                />
                <input 
                  type='file' 
                  id='uploadVideo'
                  onChange={handleUploadVideo}
                  className='hidden'
                />
              </form>
            </div>
          )}
        </div>

        {/* Show input */}
        <form  className='w-full h-full flex gap-2' onSubmit={handleSendMessage}>
          <input 
            type='text'
            placeholder='Type a message...'
            className='p-3 outline-none w-full border border-gray-200 rounded m-1'
            value={message?.text}
            onChange={handleOnChange}
          />
          <div className='flex justify-center items-center pr-4'>
            <button className={`flex justify-center items-center  ${message?.imageUrl || message?.videoUrl ? 'w-14 h-14 text-white rounded-full bg-third' : `${message?.text ? 'text-third hover:text-fourth' : ''}`}`}>
              <IoSendSharp 
                size={27}
              />
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default MessagePage