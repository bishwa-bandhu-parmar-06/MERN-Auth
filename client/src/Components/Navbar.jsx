import React, { useContext } from 'react'
import { assets } from "../assets/assets"
import "../Components/styles/navbar.css"
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Navbar = () => {

  const navigate = useNavigate()
  const {userData, backendUri, setIsLoggedin, setUserData} = useContext(AppContext);


  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendUri + "/api/auth/send-verify-otp")

      if(data.success){
        navigate("/email-verify")
        toast.success(data.message)
      }else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.get(backendUri + "/api/auth/logout")

      if(data.success){
        setIsLoggedin(false)
        setUserData(null)
        navigate('/')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  return (
    <div className='navbar'>    
      <img src={assets.logo} alt="logo" className='logo' />

      {userData ? 
        <div className="relative">
          {userData.name[0].toUpperCase()}

          <div className='dropdown'>
            <ul>
              {!userData.isAccountVerified && <li onClick={sendVerificationOtp}>Verify Email</li>}
              
              <li onClick={logout}>Logout</li>
            </ul>
          </div>
        </div>
        : 
        <button onClick={() =>navigate('/login')} className='login'>Login</button>
    }

    </div>
  )
}

export default Navbar
