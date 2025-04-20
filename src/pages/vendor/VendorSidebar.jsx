import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../../assets/css/vendor/VendorSidebar.module.css";

const VendorSidebar = ({ activeMenu, handleMenuChange }) => {
  const location = useLocation();

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarTitle}>기업 마이페이지</div>
      <ul className={styles.sidebarMenu}>
        <li className={activeMenu === "job-management" ? styles.active : ""}>
          <Link
            to="/vendor/job/management"
            className={styles.menuLink}
            onClick={() => handleMenuChange("job-management")}
          >
            공고 관리
          </Link>
        </li>
        <li
          className={activeMenu === "applicant-management" ? styles.active : ""}
        >
          <Link
            to="/vendor/applicant/management"
            className={styles.menuLink}
            onClick={() => handleMenuChange("applicant-management")}
          >
            지원자 관리
          </Link>
        </li>
        <li className={activeMenu === "info-management" ? styles.active : ""}>
          <Link
            to="/vendor/info/management"
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
          <Link
            to="/vendor/notification/settings"
            className={styles.menuLink}
            onClick={() => handleMenuChange("notification-settings")}
          >
            알림 설정
          </Link>
        </li>
        <li className={styles.logoutItem}>로그아웃</li>
      </ul>
    </div>
  );
};

export default VendorSidebar;
