import React, { useState } from 'react';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';

const ClientSearchCard = ({ user, onClose, isSelected, toggleSelect }) => {
  return (
    <Link
      onClick={(e) => {
        e.preventDefault(); // Prevent default link behavior
        toggleSelect(user?._id);
      }}
      className={`flex items-center gap-4 p-2 lg:p-4 border ${
        isSelected ? 'bg-gray-200 border-secondary' : 'border-transparent border-b-gray-200'
      }  hover:border-secondary cursor-pointer rounded`}
    >
      <div>
        <Avatar
          width={50}
          height={50}
          name={user?.name}
          imageUrl={user?.profile_pic}
          userId={user?._id}
        />
      </div>
      <div className='overflow-hidden'>
        <div className='font-semibold text-ellipsis truncate'>
          {user?.name}
        </div>
        <p className='text-sm text-ellipsis truncate'>
          {user?.email}
        </p>
      </div>
    </Link>
  );
};

export default ClientSearchCard;
