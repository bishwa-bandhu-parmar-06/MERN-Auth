import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import "../Components/styles/header.css";
import { AppContext } from '../context/AppContext';

const Header = () => {

    const {userData} = useContext(AppContext);
  return (
    <div className="header-container">
      <img src={assets.header_img} alt="Header" className="header-img" />
      <h1 className="header-title">Hey!,{userData ? userData.name : "Developer" }!</h1>
      <p className="header-subtitle">Welcome to your coding journey.</p>
      <div className="header-line"></div>
      <p className="header-welcome">"Keep building, keep creating."</p>
    </div>
  );
};

export default Header;
