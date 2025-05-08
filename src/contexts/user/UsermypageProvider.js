import { createContext,useContext,useState,useEffect } from "react";
import axios from "axios";

import {useAuth} from "../user/AuthProvider";

const UserMypageContext = createContext();

export const UsermypageProvider = ({ children }) => {

    const {userId} = useAuth();
    const apiUrl = process.env.REACT_APP_API_URL;

    const [applicationList, setApplicationList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    
    

    const getApplications = ()=>{

        axios({
            method: "get",
            url: `${apiUrl}/api/mypage/getApplications/${userId}`,
            headers: { "Content-Type": "application/json; charset=utf-8" },
            responseType: "json",
            
          })
            .then((response) => {
                setTotalCount(response.data.apiData.totalCount)
                
                if(response.data.apiData.isEmpty){
                    console.log('지원공고 없음')
                }else{
                    setApplicationList(response.data.apiData.applicationList)
                }

            })
            .catch((error) => {
              console.error("disabilityPage리스트 가져오기 실패:", error);
              alert("서버와의 연결 중 문제가 발생했습니다. 다시 시도해 주세요.");
            });


    };



    return(
        <UserMypageContext.Provider value={{ getApplications, applicationList, totalCount }}>
            {children}
        </UserMypageContext.Provider>
    )
};


// 커스텀 훅
export const useUserMypage = () => useContext(UserMypageContext);

export default UsermypageProvider;