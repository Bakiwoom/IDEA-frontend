import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/css/vendor/CompanySidebar.module.css";

import {useAuth} from "../../contexts/user/AuthProvider";

const VendorSidebar = ({ activeMenu, handleMenuChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {logout} = useAuth();

  const handleLogout = ()=>{
    logout();
    navigate('/');
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarTitle}>기업 마이페이지</div>
      <ul className={styles.sidebarMenu}>
        <li className={activeMenu === "job-management" ? styles.active : ""}>
          <Link
            to="/company/job/management"
            className={styles.menuLink}
            onClick={() => handleMenuChange("job-management")}
          >
            내 공고 관리
          </Link>
        </li>
        {/* <li
          className={activeMenu === "applicant-management" ? styles.active : ""}
        >
          <Link
            to="/company/applicant/management"
            className={styles.menuLink}
            onClick={() => handleMenuChange("applicant-management")}
          >
            지원자 관리
          </Link>
        </li> */}
        <li className={activeMenu === "info-management" ? styles.active : ""}>
          <Link
            to="/company/info/management"
            className={styles.menuLink}
            onClick={() => handleMenuChange("info-management")}
          >
            내 정보 관리
          </Link>
        </li>
        <li
          className={
            activeMenu === "notification-settings" ? styles.active : ""
          }
        >
          {/* <Link
            to="/vendor/notification/settings"
            className={styles.menuLink}
            onClick={() => handleMenuChange("notification-settings")}
          >
            알림 설정
          </Link> */}
        </li>
        <li className={activeMenu === "main" ? styles.active : ""}>
          <Link
            to="/"
            className={styles.menuLink}
            onClick={() => handleMenuChange("main")}
          >
            홈으로 가기
          </Link>
        </li>
        <li className={styles.logoutItem} onClick={handleLogout}><Link to="/">로그아웃</Link></li>
      </ul>
    </div>
  );
};

export default VendorSidebar;
