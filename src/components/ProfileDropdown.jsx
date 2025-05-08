import React from "react";
import { Link } from "react-router-dom";
import styles from "../assets/css/main/ProfileDropdown.module.css";
import { useNavigate } from "react-router-dom";

import { USER_MYPAGE_MAIN,EDIT_PAGE } from "../routes/contantsRoutes";
import {useAuth} from "../contexts/user/AuthProvider";

const ProfileDropdown = ({type}) => {

  const {logout, role} = useAuth();
  const navigate = useNavigate();

  const handleLogout = ()=>{
    logout();
    navigate('/');
  }

  

  return (
    <div className={styles.sidebar}>

      {role === 'user' ? (
        // user
        <>
          <div className={styles.menuItem}>
            <div className={styles.menuTitle}>지원현황</div>
            <div className={styles.menuCount}>0</div>
          </div>

          <div className={styles.myMenuSection}>
            <ul className={styles.menuList}>
              <li className={styles.menuListItem}>
                <Link to={USER_MYPAGE_MAIN}>MY홈</Link>
              </li>
              <li className={styles.menuListItem}>
                <Link to="/my-page/application">지원내역 관리</Link>
              </li>
              <li className={styles.menuListItem}>
                <Link to={EDIT_PAGE}>회원정보 수정</Link>
              </li>
            </ul>
          </div>
        </>
      ) : (
        //company
        <>
          <div className={styles.menuItem}>
            <div className={styles.menuTitle}>지원현황</div>
            <div className={styles.menuCount}>0</div>
          </div>

          <div className={styles.myMenuSection}>
            <ul className={styles.menuList}>
              <li className={styles.menuListItem}>
                <Link to='/company/job/management'>MY홈</Link>
              </li>
              <li className={styles.menuListItem}>
                <Link to="/company/info/management">내정보 관리</Link>
              </li>
            </ul>
          </div>
        </>
      )}
      

      <div className={styles.logoutButtonContainer} onClick={handleLogout}>
         <Link to="/">로그아웃</Link>
      </div>
    </div>
  );
};

export default ProfileDropdown;
