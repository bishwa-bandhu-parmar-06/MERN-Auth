import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  axios.defaults.withCredentials = true;

  const backendUri = import.meta.env.VITE_BACKEND_URL; // Ensure this is set in your environment variables
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null); // Use null instead of false for better semantic




    const getAuthState = async () =>{
        try {
            const {data} = await axios.get(backendUri + "/api/auth/is-auth" )
            if(data.success){
                setIsLoggedin(true)
                getUserData()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getUserData = async () => {
        try {
            const {data} = await axios.get(backendUri + "/api/user/get-user-data")
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }


    useEffect(() => {
        getAuthState();
    },[])


  const value = {
    backendUri,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
