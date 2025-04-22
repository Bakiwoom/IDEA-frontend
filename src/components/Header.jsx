import React from "react";
import { Link } from "react-router-dom";
import styles from "../assets/css/layout/Header.module.css";

import { USER_MYPAGE_MAIN } from "../routes/contantsRoutes";

const Header = ({type}) => {
  
  let title = '';

  switch (type){
    case "signUpTypeChoicePage":
      title = '회원가입';
      break;
    case "userSignUpPage":
      title = '개인 회원가입';
      break;
    case "vendorSignUpPage":
      title = '기업 회원가입';
      break;
    case "loginPage":
      title = '로그인';
      break;
    default:
      title = '';
  }
  
  return (
    <header className={styles.header}>
      <div className={`${styles.container} ${styles.headerContainer}`}>
        <div className={styles.headerLeft}>
          <Link to="/" className={styles.logo}>
            IDEA 
          </Link>
          <span>{title}</span>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.profileButton}>
            <div className={styles.profileImage}>차</div>
            <Link to={USER_MYPAGE_MAIN}><span>님</span></Link>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
