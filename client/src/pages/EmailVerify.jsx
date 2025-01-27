import React, { useContext, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import '../Components/styles/email-verify.css';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const { backendUri, isLoggedin, userData, getUserData } = useContext(AppContext);
  const inputRefs = useRef([]);

  const navigate = useNavigate();

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

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join('');
      const { data } = await axios.post(backendUri + '/api/auth/verify-account', { otp });

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate('/');
  }, [isLoggedin, userData]);

  return (
    <div className="email-verify-container">
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Logo"
        className="login-logo"
      />
      <form className="email-verify-form" onSubmit={onSubmitHandler}>
        <h1 className="email-verify-title">Email Verify OTP</h1>
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
        <button className="email-verify-button">Verify Email</button>
      </form>
    </div>
  );
};

export default EmailVerify;