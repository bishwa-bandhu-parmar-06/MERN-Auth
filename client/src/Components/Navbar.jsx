import React, { useContext } from 'react'
import { assets } from "../assets/assets"
import "../Components/styles/navbar.css"
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

  const navigate = useNavigate()
  const {userData, backendUri, setIsLoggedin, setUserData} = useContext(AppContext);

  return (
    <div className='navbar'>    
      <img src={assets.logo} alt="logo" className='logo' />

      {userData ? 
        <div>
          {userData.name[0].toUpperCase()}
        </div>
        : 
        <button onClick={() =>navigate('/login')} className='login'>Login</button>
    }

    </div>
  )
}

export default Navbar
