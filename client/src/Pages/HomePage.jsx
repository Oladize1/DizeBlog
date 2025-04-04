import React from 'react'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Posts from '../Component/Posts'

const HomePage = () => {
  return (
    <>
    <ToastContainer />
    <Posts />       
    </>
  )
}

export default HomePage