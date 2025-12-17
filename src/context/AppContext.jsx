// import { createContext, useState } from "react";
// import { toast } from 'react-toastify'
// import axios from 'axios'

// export const AppContext = createContext()

// export const AppContextProvider = (props) => {
//     const backend_url = import.meta.env.VITE_BACKEND_URL

//     const [isLoggedIn, setIsLoggedIn] = useState(false)
//     const [userData, setUserData] = useState(false)

//     const getUserData = async () => {
//         try {
//             const { data } = await axios.get(backend_url + '/api/user/userData')
//             data.success ? setUserData(data.userData) : toast.error(data.message)
//         } catch (err) {
//             const message = err.response?.data?.message || "Unable to fetch user data";
//             toast.error(message);
//         }
//     }


//     const value = {
//         backend_url,
//         isLoggedIn, setIsLoggedIn,
//         userData, setUserData,
//         getUserData
//     }
//     return (
//         <AppContext.Provider value={value}>
//             {props.children}
//         </AppContext.Provider>
//     )
// }







import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    axios.defaults.withCredentials = true

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    
    const getAuthState = async () => {
        try{
            const {data} = await axios.get(
                backend_url + "/api/auth/is-auth",
            )
            if(data.success){
                setIsLoggedIn(true)
                getUserData()
            }
        }catch(err){
            // toast.error(err.message)
            const message = err.response?.data?.message || "Something went wrong";
            toast.error(message);
        }
    }

    const getUserData = async () => {
        try {
            const { data } = await axios.get(
                backend_url + "/api/user/userData",
                // { withCredentials: true }
            );

            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            const message = err.response?.data?.message || "Unable to fetch user data";
            toast.error(message);
        }
    };


    useEffect(()=>{
        getAuthState();
    },[])

    useEffect(() => {
        if (isLoggedIn) {
            getUserData();
        } else {
            setUserData(null);
        }
    }, [isLoggedIn]);

    const value = {
        backend_url,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
