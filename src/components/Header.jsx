import React from "react";
import { Link } from "react-router-dom";
import styles from "../assets/css/layout/Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={`${styles.container} ${styles.headerContainer}`}>
        <Link to="/" className={styles.logo}>
          IDEA
        </Link>
        <div className={styles.headerRight}>
          <button className={styles.profileButton}>
            <div className={styles.profileImage}>차</div>
            <span className={styles.userName}>차은우님</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
