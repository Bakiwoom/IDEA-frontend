import React from "react";
import { useNavigate } from "react-router-dom";

import styles from "../../assets/css/user/UserSidebar.module.css";
import { Link } from "react-router-dom";
import { USER_MYPAGE_MAIN, EDIT_PAGE } from "../../routes/contantsRoutes";
import {useAuth} from "../../contexts/user/AuthProvider";

const UserSidebar = () =>{

    const {logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = ()=>{
        logout();
        navigate('/');
      }

    return(
        <>
            <div className={styles.container}>
                <p className={styles.title}>마이페이지</p>
                <div className={styles.liBox}>
                    <ul>
                        <Link to={USER_MYPAGE_MAIN}><li>홈</li></Link>
                        <Link to="#"><li>지원내역</li></Link>
                        <Link to={EDIT_PAGE}><li>내정보 수정 </li></Link>
                        <li className={styles.logout} onClick={handleLogout}><span>↪︎</span>로그아웃</li>
                    </ul>
                </div>
            </div>
        </>
    );
}
export default UserSidebar;