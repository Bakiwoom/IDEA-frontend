import React from "react";
import { Link } from "react-router-dom";
import styles from "../assets/css/main/ProfileDropdown.module.css";

import { USER_MYPAGE_MAIN,EDIT_PAGE } from "../routes/contantsRoutes";

const ProfileDropdown = ({type}) => {
  let title = "";

  switch (type) {
    case "signUpTypeChoicePage":
      title = "회원가입";
      break;
    case "userSignUpPage":
      title = "개인 회원가입";
      break;
    case "vendorSignUpPage":
      title = "기업 회원가입";
      break;
    case "loginPage":
      title = "로그인";
      break;
    default:
      title = "";
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.menuItem}>
        <div className={styles.menuTitle}>지원현황</div>
        <div className={styles.menuCount}>0</div>
      </div>

      <div className={styles.myMenuSection}>
        <ul className={styles.menuList}>
          <li className={styles.menuListItem}>
            <Link to={USER_MYPAGE_MAIN}>MY홈</Link>
          </li>
          {/* <li className={styles.menuListItem}>
            <Link to="/my-page/management">이력서/자소서 관리</Link>
          </li> */}
          <li className={styles.menuListItem}>
            <Link to="/my-page/application">지원내역 관리</Link>
          </li>
          <li className={styles.menuListItem}>
            <Link to="/my-page/info">회원정보 수정</Link>
          </li>
        </ul>
      </div>

      <div className={styles.logoutButtonContainer}>
         <Link to="/">로그아웃</Link>
      </div>
    </div>
  );
};

export default ProfileDropdown;
