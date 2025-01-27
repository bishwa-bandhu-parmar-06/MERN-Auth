import React, { useContext, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {

  const {backendUri} = useContext(AppContext)
  axios.defaults.withCredentials = true;


  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState('')
  const [otp, setOtp] = useState(0)
  const [isOtpSubmited, setIsOtpSubmited] = useState(false)

   const inputRefs = useRef([]); 
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    try {
      e.preventDefault()
      const {data} = await axios.post(backendUri + "/api/auth/send-reset-otp", {email})

      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setIsEmailSent(true)

    } catch (error) {
      toast.error(error.message)
    }
  }


  const onSubmitOtp = async (e) => {
    try {
      e.preventDefault()
      const otpArray = inputRefs.current.map((e) => e.value);
      const enteredOtp = otpArray.join(''); // Combine into a string
      setOtp(enteredOtp); // Update state for OTP
      // setOtp(otpArray.join(''));
      setIsOtpSubmited(true)
    } catch (error) {
      toast.error(error.message)
    }
  }


const onSubmitNewPassword = async (e) => {
  e.preventDefault()
  try {
    // console.log("Email:", email);
    // console.log("OTP:", otp);
    // console.log("New Password:", newPassword);

    const {data} = await axios.post(backendUri + "/api/auth/reset-password", {email, otp, newPassword})

    data.success ? toast.success(data.message) : toast.error(data.message)
    data.success && navigate('/login')

  } catch (error) {
    toast.error(error.message)
  }
}

  return (
    <div>
      <img src={assets.logo} alt="logo" className='logo' />


{/* Email input form */}

{!isEmailSent && 
      <form  onSubmit={onSubmitEmail}>
        <h1>Reset Password </h1>

        <p>Enter Your Registered Email ID : </p>
        <div>
          <img src={assets.mail_icon} alt="" />
          <input type="email" placeholder='Email Id' 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required
          />
        </div>

        <button type="submit">Submit</button>
      </form>
}
{/* OTP input form */}

{!isOtpSubmited && isEmailSent &&
<form onSubmit={onSubmitOtp} className="email-verify-form">
        <h1 className="email-verify-title">Reset Password  OTP</h1>
        <p className="email-verify-instructions">
          Enter the 6 digit OTP sent to your email
        </p>
        <div className="email-verify-otp-container" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                placeholder="0"
                ref={(e) => (inputRefs.current[index] = e)}
                className="otp-input"
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button className="email-verify-button">Submit</button>
      </form>
}
{/* Enter New password */}

{isOtpSubmited && isEmailSent &&
      <form onSubmit={onSubmitNewPassword}>
        <h1>New Password </h1>

        <p>Enter New Password : </p>
        <div>
          <img src={assets.lock_icon} alt="" />
          <input type="password" placeholder='New Password' 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)}
          required
          />
        </div>

        <button>Submit</button>
      </form>
}
    </div>
  )
}

export default ResetPassword