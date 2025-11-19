import React from 'react'
import toast from 'react-hot-toast'

const handleError = (navigate , e) => {
    console.log('Socket error ', e)
    toast.error('An error occured. Please try again later')
    navigate('/email')
}

export default handleError