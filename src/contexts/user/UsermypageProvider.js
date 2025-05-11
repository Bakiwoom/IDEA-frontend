import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../user/AuthProvider";

const UserMypageContext = createContext();

export const UsermypageProvider = ({ children }) => {
    const { userId } = useAuth();
    const apiUrl = process.env.REACT_APP_API_URL;

    const [applicationList, setApplicationList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const getApplications = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${apiUrl}/api/mypage/getApplications`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("📦 API 응답:", res.data);

            const { applicationList, totalCount } = res.data.apiData;

            setApplicationList(applicationList ?? []);
            setTotalCount(totalCount ?? 0);
        } catch (err) {
            console.error("지원공고리스트 가져오기 실패:", err);
            setApplicationList([]);
            setTotalCount(0);
        }
    };

    return (
        <UserMypageContext.Provider value={{ getApplications, applicationList, totalCount }}>
            {children}
        </UserMypageContext.Provider>
    );
};

export const useUserMypage = () => useContext(UserMypageContext);
export default UsermypageProvider;
