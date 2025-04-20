import React from "react";
import { Link } from "react-router-dom";
import styles from "../assets/css/layout/Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={`${styles.container} ${styles.headerContainer}`}>
        <Link to="/" className={styles.logo}>
          Dear
        </Link>
        <div className={styles.headerRight}>
          <button className={styles.profileButton}>
            <div className={styles.profileImage}>홍</div>
            <span>홍길동님</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
