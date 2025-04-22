import React from "react";
import { Link } from "react-router-dom";
import styles from "../assets/css/main/ProfileDropdown.module.css";

const ProfileDropdown = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.menuItem}>
        <div className={styles.menuTitle}>지원현황</div>
        <div className={styles.menuCount}>0</div>
      </div>

      <div className={styles.myMenuSection}>
        <div className={styles.myMenuTitle}>MY홈</div>
        <ul className={styles.menuList}>
          <li className={styles.menuListItem}>
            <Link to="/my-page/management">이력서/자소서 관리</Link>
          </li>
          <li className={styles.menuListItem}>
            <Link to="/my-page/application">지원내역 관리</Link>
          </li>
          <li className={styles.menuListItem}>
            <Link to="/my-page/info">회원정보 수정</Link>
          </li>
        </ul>
      </div>

      <div className={styles.logoutButtonContainer}>
        <button className={styles.logoutButton}>로그아웃</button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
