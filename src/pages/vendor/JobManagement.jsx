import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../assets/css/vendor/JobManagement.module.css";
import VendorSidebar from "./VendorSidebar";

const JobManagement = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("job-management");

  // 메뉴 변경 핸들러
  const handleMenuChange = (menuId) => {
    setActiveMenu(menuId);
    // 메뉴 변경 시 필요한 라우팅 로직 추가 가능
  };

  // 상세보기 버튼 클릭 핸들러
  const handleViewDetail = (jobId) => {
    navigate(`/vendor/job/management/detail/${jobId}`);
  };

  return (
    <div className={styles.mypageWrap}>
      {/* 사이드바 컴포넌트 사용 */}
      <VendorSidebar
        activeMenu={activeMenu}
        handleMenuChange={handleMenuChange}
      />

      <section className={styles.mainContent}>
        <div className={styles.mainHeader}>
          <h1>내 공고 관리</h1>
          {/* <button className={styles.btnPrimary}>+ 새 공고 등록</button> */}
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>공고명</th>
              <th>모집부문</th>
              <th>상태</th>
              <th>지원자 수</th>
              <th>마감일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {/* 채용 공고 상세페이지와 연결 필요 */}
                <Link to={`/job/management/detail/1`}> 
                  웹 접근성 담당자 채용
                </Link>
              </td>
              <td>웹 접근성 개선</td>
              <td>
                <span className={`${styles.statusBadge} ${styles.statusOpen}`}>
                  모집중
                </span>
              </td>
              <td>5명</td>
              <td>2025-05-10</td>
              <td>
                <button
                  className={styles.btnSecondary}
                  onClick={() => handleViewDetail(1)}
                >
                  상세보기
                </button>
                <button className={styles.btnSecondary}>수정</button>
                <button className={styles.btnSecondary}>마감</button>
              </td>
            </tr>
            <tr>
              <td>
                <Link to={`/job/management/detail/2`}>
                  프론트엔드 개발자 채용
                </Link>
              </td>
              <td>프론트엔드 개발</td>
              <td>
                <span className={`${styles.statusBadge} ${styles.statusClose}`}>
                  모집완료
                </span>
              </td>
              <td>3명</td>
              <td>2025-04-10</td>
              <td>
                <button
                  className={styles.btnSecondary}
                  onClick={() => handleViewDetail(2)}
                >
                  상세보기
                </button>
                <button className={styles.btnSecondary}>수정</button>
              </td>
            </tr>
            <tr>
              <td>
                <Link to={`/job/management/detail/3`}>
                  사무보조 채용
                </Link>
              </td>
              <td>사무보조</td>
              <td>
                <span className={`${styles.statusBadge} ${styles.statusEnd}`}>
                  마감
                </span>
              </td>
              <td>0명</td>
              <td>2025-03-01</td>
              <td>
                <button
                  className={styles.btnSecondary}
                  onClick={() => handleViewDetail(3)}
                >
                  상세보기
                </button>
              </td>
            </tr>
            {/* 반복 */}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default JobManagement;
