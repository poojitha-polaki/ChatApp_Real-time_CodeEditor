import axios from 'axios';
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
import SideBar from '../components/SideBar';
import logo2 from '../assets/logo2.png';
import io from 'socket.io-client';
import initSocket from '../components/Socket';
import handleError from '../components/Error';
import { stringify } from 'uuid';

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const socketConnection = useSelector(state => state?.user?.socketConnection);

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

    // Now i will use useRef to avoid re-rendering of the component
    const socketRef = useRef(null);

  // Socket connection
  useEffect(() => {
    // const socketConnection = io(process.env.REACT_APP_API_URL, {
    //   auth: {
    //     token: localStorage.getItem('token')
    //   }
    // });

    // socketConnection.on('onlineUser', (data) => {
    //   dispatch(setOnlineUser(data));
    // });

    // dispatch(setSocketConnection(socketConnection));
    // // dispatch(setSocketConnection(true));
    // return () => {
    //   socketConnection.disconnect();
    // };
    let init = async () => {
      socketRef.current = await initSocket(dispatch);

      socketRef.current.on('connect_error', (error) => handleError(navigate , error));
      socketRef.current.on('connect_failed', (error) => handleError(navigate , error));
    };
    init();
  // }, [location?.pathname]);
}, []);

  const basePath = location.pathname === '/';
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className={`bg-white ${!basePath && 'hidden'} lg:block`}>
        <SideBar name={'Chat'}/>
      </section>

      {/* Message Component */}
      <section className={`${basePath && 'hidden'} `}>
          <Outlet />
      </section>

      <div className={`hidden flex-col justify-center items-center ${!basePath ? 'hidden' : "hidden lg:flex"}`}>
        <div>
          <img 
            src={logo2}
            alt='logo'
            width={300}
          />
        </div>
        <p className='text-lg  text-gray-500'>Select user to send message</p>
      </div>
    </div>
  )
}

export default Home