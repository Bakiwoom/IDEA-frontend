import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../assets/css/main/ProfileDropdown.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { USER_MYPAGE_MAIN, EDIT_PAGE } from "../routes/contantsRoutes";
import { useAuth } from "../contexts/user/AuthProvider";

const ProfileDropdown = ({ type }) => {
  const { logout, role } = useAuth();
  const navigate = useNavigate();
  const [applyCount, setApplyCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  // 지원현황 카운트 가져오기
  useEffect(() => {
    if (role === 'company') {
      fetchApplyCount();
    }
  }, [role]);

  const fetchApplyCount = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/companies/me/apply/count`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.result === "success") {
        console.log('지원현황 데이터:', response.data);
        // applyCount 값만 추출
        setApplyCount(response.data.apiData.applyCount || 0);
      } else {
        console.error("지원현황을 불러오는데 실패했습니다:", response.data?.message);
      }
    } catch (err) {
      console.error("지원현황을 불러오는데 실패했습니다:", err);
    } finally {
      setLoading(false);
    }
  };

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
            <div className={styles.menuCount}>
              {loading ? '로딩중...' : applyCount}
            </div>
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