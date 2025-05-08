import { createContext,useContext,useState,useEffect } from "react";
import axios from "axios";

const UserMypageContext = createContext();

export const UsermypageProvider = ({ children }) => {




    return(
        <UserMypageContext.Provider value={{  }}>
            {children}
        </UserMypageContext.Provider>
    )
};


// 커스텀 훅
export const useUserMypage = () => useContext(UserMypageContext);

export default UsermypageProvider;