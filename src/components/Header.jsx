import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../assets/css/layout/Header.module.css";
import ProfileDropdown from "./ProfileDropdown";
import { USER_MYPAGE_MAIN ,LOGIN_PAGE ,SIGNUP_PAGE } from "../routes/contantsRoutes";
import {useAuth} from "../contexts/user/AuthProvider";

const Header = ({type}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  //로컬스토리지 정보가져오기
  const {authUser, memberId, name} = useAuth();
  

  // 드롭다운 토글 함수
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  // 외부 클릭 감지 함수
  useEffect(() => {
    
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener("mousedown", handleClickOutside);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    <header className={styles.header}>
      <div className={`${styles.container} ${styles.headerContainer}`}>
        <Link to="/" className={styles.logo}>
          IDEA
        </Link>
        {!memberId ? (
          <div className={styles.loginBox}>
            <span className={styles.loginBTN}><Link to={LOGIN_PAGE}>로그인</Link></span>
            <span>|</span> <span className={styles.signupBTN}><Link to={SIGNUP_PAGE}>회원가입</Link></span>
          </div>
        ) : (
          <div className={styles.headerRight}>
            <button
              className={styles.profileButton}
              onClick={toggleDropdown}
              ref={buttonRef}
            > 
              <div className={styles.profileImage}>{name?.charAt(0) === '(' ? name?.charAt(1) : name?.charAt(0) ?? ''}</div>
              <span className={styles.userName}>{name} 님</span>
              <span className={styles.arrowIcon}>
                {isDropdownOpen ? "▲" : "▼"}
              </span>
            </button>

            {/* 조건부 렌더링으로 드롭다운 표시/숨김 */}
            {isDropdownOpen && (
              <div className={styles.dropdownContainer} ref={dropdownRef}>
                <ProfileDropdown />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
