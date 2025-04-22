import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../assets/css/layout/Header.module.css";
import ProfileDropdown from "./ProfileDropdown";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

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

  return (
    <header className={styles.header}>
      <div className={`${styles.container} ${styles.headerContainer}`}>
        <Link to="/" className={styles.logo}>
          IDEA
        </Link>
        <div className={styles.headerRight}>
          <button
            className={styles.profileButton}
            onClick={toggleDropdown}
            ref={buttonRef}
          >
            <div className={styles.profileImage}>차</div>
            <span className={styles.userName}>차은우님</span>
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
      </div>
    </header>
  );
};

export default Header;
