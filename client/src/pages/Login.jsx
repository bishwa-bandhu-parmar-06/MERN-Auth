import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import '../Components/styles/login.css'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import {toast} from "react-toastify"
import { AppContext } from '../context/AppContext';

const Login = () => {

    const {backendUri, setIsLoggedin, getUserData} = useContext(AppContext);

    const navigate = useNavigate();
  const [state, setState] = useState('Sign Up');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    try {
        e.preventDefault();

        axios.defaults.withCredentials = true;
        if(state === "Sign Up"){
            const {data} = await axios.post(backendUri + "/api/auth/register", {name, email, password})

            if(data.success){
                setIsLoggedin(true)
                getUserData()
                navigate('/')
            }else{
                toast.error(data.message)
            }
        }else{
            const {data} = await axios.post(backendUri + "/api/auth/login", { email, password})

            if(data.success){
                setIsLoggedin(true)
                getUserData()
                navigate('/')
            }else{
                toast.error(data.message)
            }
        }
    } catch (error) {
        toast.error(error.message)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <img onClick={() => navigate("/")}  src={assets.logo} alt="Logo" className="login-logo" />
        <h2 className="login-title">
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </h2>
        <p className="login-subtitle">
          {state === 'Sign Up' ? 'Create Your Account' : 'Login to Your Account!'}
        </p>

        <form  onSubmit={onSubmitHandler} className="login-form">

            {state === "Sign Up" && (
                <div className="input-group">
                    <img src={assets.person_icon} alt="Person Icon" className="input-icon" />
                    <input onChange={e => setName(e.target.value)} value={name} type="text" placeholder="Full Name" required className="input-field" />
                </div>
            )}
          

          <div className="input-group">
            <img src={assets.mail_icon} alt="Mail Icon" className="input-icon" />
            <input  onChange={e => setEmail(e.target.value)} value={email}  type="email" placeholder="Email Id" required className="input-field" />
          </div>

          <div className="input-group">
            <img src={assets.lock_icon} alt="Lock Icon" className="input-icon" />
            <input  onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder="Password" required className="input-field" />
          </div>

          <p  onClick={() => navigate("/reset-password")} className="forgot-password">Forgot password?</p>
          <button type="submit" className="login-button">
            {state}
          </button>
        </form>

        {state === 'Sign Up' ? (
            <p>Already have an Account?{" "} <span onClick={() => setState("Login")}>Login here</span></p>
            )
            : 
            (
            <p>Don't have an Account?{" "} <span onClick={() => setState("Sign Up")}>Signup here</span></p>
            )
        }
        
        
      </div>
    </div>
  )
}

export default Login
