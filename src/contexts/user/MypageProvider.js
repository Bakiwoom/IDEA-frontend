import { createContext,useContext,useState,useEffect } from "react";
import axios from "axios";

const MypageContext = createContext();
const apiUrl = process.env.REACT_APP_API_URL;

export const MypageProvider = ({ children }) => {


    return(
        <MypageContext.Provider>
            {children}
        </MypageContext.Provider>
    )

};

// 커스텀 훅
export const useMypage = () => useContext(MypageContext);

export default MypageProvider;