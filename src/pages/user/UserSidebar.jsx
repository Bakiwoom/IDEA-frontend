import React from "react";

import styles from "../../assets/css/user/UserSidebar.module.css";
import { Link } from "react-router-dom";

const UserSidebar = () =>{
    return(
        <>
            <div className={styles.container}>
                <p className={styles.title}>마이페이지</p>
                <div className={styles.liBox}>
                    <ul>
                        <Link to="#"><li>홈</li></Link>
                        <Link to="#"><li>지원내역</li></Link>
                        <Link to="#"><li>내정보 수정 </li></Link>
                        <Link to="#"><li>로그아웃</li></Link>
                    </ul>
                </div>
            </div>
        </>
    );
}
export default UserSidebar;