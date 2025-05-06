import { createContext,useContext,useState,useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const apiUrl = process.env.REACT_APP_API_URL;


export const AuthProvider = ({ children }) => {
    
    const [authUser, setAuthUser] = useState(null);
    const [memberId, setMemberId] = useState(null);
    const [name, setName] = useState("");
    const [role, setRole] = useState('');

    //로컬스토리지 정보 가져오기
    useEffect(()=>{
        const storedUser = localStorage.getItem('authUser');

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setAuthUser(parsedUser);
            setMemberId(parsedUser.memberId ?? null);

          }else{
            setAuthUser(null);
            setMemberId(null);
          }
    },[]);

    //로그인상태일시 회원이름 가져오기
    useEffect(()=>{

        const getMemberData = async ()=>{
            if (!authUser || !authUser.memberId) return;

            axios({
                method: "get",
                url: `${apiUrl}/api/member/data/${authUser.memberId}`,
                responseType: "json",
                
              }).then((response) => {
                    setName(response.data.apiData.name);
                    setRole(response.data.apiData.role);
                    
                }).catch((error) => {
                    console.error("member정보가져오기 오류:", error);
                    alert("서버와의 연결 중 문제가 발생했습니다. 다시 시도해 주세요.");
                });
        }
        getMemberData();
    },[authUser]);

    //로그아웃
    const logout = () =>{
        localStorage.removeItem('authUser');
        localStorage.removeItem('token');
        
        setAuthUser(null)
        setMemberId(null)
        setName('');
    }


    return(
        <AuthContext.Provider value={{ authUser, memberId, name, role, logout }}>
            {children}
        </AuthContext.Provider>
    )

};

// 커스텀 훅
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;