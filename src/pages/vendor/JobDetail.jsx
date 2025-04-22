import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../assets/css/vendor/JobDetail.module.css";
import VendorSidebar from "./VendorSidebar";

const JobDetail = () => {
  const [activeMenu, setActiveMenu] = useState("job-management");

  // 메뉴 변경 핸들러
  const handleMenuChange = (menuId) => {
    setActiveMenu(menuId);
    // 메뉴 변경 시 필요한 라우팅 로직 추가 가능
  };

  return (
    <div className={styles.mypageWrap}>
      {/* 사이드바 컴포넌트 사용 */}
      <VendorSidebar
        activeMenu={activeMenu}
        handleMenuChange={handleMenuChange}
      />

      <section className={styles.mainContent}>
        <div className={styles.jobSection}>
          <div className={styles.jobTitle}>[공고] 웹 접근성 담당자 채용</div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>지원자명</th>
                <th>장애 유형</th>
                <th>장애 경도</th>
                <th>경력</th>
                <th>AI 분석 혜택</th>
                <th>상세</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>홍길동</td>
                <td>지체장애</td>
                <td>
                  <span className={`${styles.degreeTag} ${styles.degreeHeavy}`}>
                    중증
                  </span>
                </td>
                <td>3년</td>
                <td>
                  <div className={styles.benefitBox}>
                    <ul>
                      <li>
                        기업: 고용장려금 <b>월 60만 원</b>
                      </li>
                      <li>
                        지원자: 직무적응훈련비 <b>최대 300만 원</b>
                      </li>
                    </ul>
                  </div>
                </td>
                <td>
                  <button className={styles.btnSecondary}>상세보기</button>
                </td>
              </tr>
              <tr>
                <td>김영희</td>
                <td>청각장애</td>
                <td>
                  <span className={`${styles.degreeTag} ${styles.degreeLight}`}>
                    경증
                  </span>
                </td>
                <td>1년</td>
                <td>
                  <div className={styles.benefitBox}>
                    <ul>
                      <li>
                        기업: 고용장려금 <b>월 30만 원</b>
                      </li>
                      <li>
                        지원자: 직무적응훈련비 <b>최대 200만 원</b>
                      </li>
                    </ul>
                  </div>
                </td>
                <td>
                  <button className={styles.btnSecondary}>상세보기</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* 추가 공고/지원자 반복 가능 */}
      </section>
    </div>
  );
};

export default JobDetail;
