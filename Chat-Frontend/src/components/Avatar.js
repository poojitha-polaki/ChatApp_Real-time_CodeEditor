import React from 'react';
import { FaUserAstronaut } from "react-icons/fa6";
import { useSelector } from 'react-redux';

const Avatar = ({ userId, name, imageUrl, width, height }) => {
  const bgColors = [
    'bg-red-200',
    'bg-blue-200',
    'bg-green-200',
    'bg-yellow-200',
    'bg-purple-200',
    'bg-pink-200',
    'bg-indigo-200',
    'bg-teal-200',
    'bg-orange-200',
    'bg-rose-200',
    'bg-lime-200',
    'bg-emerald-200',
    'bg-cyan-200',
    'bg-violet-200',
  ];
  let avatarName = '';
  const randomBgColor = Math.floor(Math.random() * bgColors.length);
  const onlineUser = useSelector((state) => state?.user?.onlineUser);
  const isOnline = onlineUser?.includes(userId);
  
  if (name) {
    const splitName = name?.split(" ");
    if (splitName?.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
  }


  return (
    <div 
      style= {{width: width+'px', height: height+'px'}}
      className={`text-slate-800 rounded-full font-bold relative`}
    >
      {imageUrl ? (
        <img    
          src={imageUrl}
          alt={name}
          width={width}
          height={height}
          className= 'overflow-hidden rounded-full'
        />
      ) : (
        name ? (
          <div 
            style= {{width: width+'px', height: height+'px'}}
            className= {`overflow-hidden rounded-full flex justify-center items-center text-lg ${bgColors[randomBgColor]}`}
          >
            {avatarName}
          </div>
        ) : (
          <FaUserAstronaut 
            size={width}
          />
        )
      )}
      {isOnline && (
        <div 
          className= ' bg-green-600 p-1 absolute bottom-2 -right-1 rounded-full'
        >
        </div>
      )}
    </div>
  );
}

export default Avatar;
