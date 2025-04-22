import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../assets/css/vendor/ApplicantManagement.module.css";
import VendorSidebar from "./VendorSidebar";

const ApplicantManagement = () => {
  const [activeMenu, setActiveMenu] = useState("applicant-management");
  const [applicants, setApplicants] = useState([
    {
      id: 1,
      name: "김장애",
      phone: "010-1234-5678",
      position: "웹 개발자 채용",
      disability: "지체장애 3급",
      applyDate: "2025-04-15",
      status: "검토중",
      benefits: 5,
    },
    {
      id: 2,
      name: "이지원",
      phone: "010-2345-6789",
      position: "웹 개발자 채용",
      disability: "시각장애 2급",
      applyDate: "2025-04-14",
      status: "서류통과",
      benefits: 7,
    },
    {
      id: 3,
      name: "박지민",
      phone: "010-3456-7890",
      position: "프론트엔드 개발자",
      disability: "청각장애 2급",
      applyDate: "2025-04-13",
      status: "면접예정",
      benefits: 4,
    },
    {
      id: 4,
      name: "최현우",
      phone: "010-4567-8901",
      position: "백엔드 개발자",
      disability: "지체장애 4급",
      applyDate: "2025-04-10",
      status: "합격",
      benefits: 6,
    },
    {
      id: 5,
      name: "정민지",
      phone: "010-5678-9012",
      position: "웹 디자이너",
      disability: "지적장애 3급",
      applyDate: "2025-04-09",
      status: "불합격",
      benefits: 3,
    },
  ]);

  // 메뉴 변경 핸들러
  const handleMenuChange = (menuId) => {
    setActiveMenu(menuId);
    // 메뉴 변경 시 필요한 라우팅 로직 추가 가능
  };

  return (
    <>
      <div className={styles.container}>
        {/* 사이드바 컴포넌트 사용 */}
        <VendorSidebar
          activeMenu={activeMenu}
          handleMenuChange={handleMenuChange}
        />

        {/* 지원자 관리 화면 */}
        <div
          className={`${styles.mainContent} ${styles.screen} ${styles.active}`}
          id="applicant-management"
        >
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>지원자 관리</h1>
            <button className={styles.actionButton}>+ 면접 일정 등록</button>
          </div>

          {/* 필터 섹션 */}
          <div className={styles.formSection}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="job-filter">공고별 필터</label>
                <select id="job-filter">
                  <option>모든 공고</option>
                  <option>웹 개발자 채용</option>
                  <option>프론트엔드 개발자</option>
                  <option>백엔드 개발자</option>
                  <option>웹 디자이너</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="status-filter">지원 상태별 필터</label>
                <select id="status-filter">
                  <option>모든 상태</option>
                  <option>검토중</option>
                  <option>서류통과</option>
                  <option>면접예정</option>
                  <option>합격</option>
                  <option>불합격</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="search">검색</label>
                <input
                  type="text"
                  id="search"
                  placeholder="이름, 이메일 등으로 검색"
                />
              </div>
            </div>
          </div>

          {/* 지원자 목록 테이블 */}
          <div className={styles.tableContainer}>
            <table className={styles.tableContent}>
              <thead className={styles.tableHead}>
                <tr>
                  <th>프로필</th>
                  <th>지원 공고</th>
                  <th>장애 유형/등급</th>
                  <th>지원일자</th>
                  <th>상태</th>
                  <th>적합 혜택 수</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {applicants.map((applicant) => (
                  <tr key={applicant.id}>
                    <td>
                      {applicant.name}
                      <br />
                      {applicant.phone}
                    </td>
                    <td>{applicant.position}</td>
                    <td>{applicant.disability}</td>
                    <td>{applicant.applyDate}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          applicant.status === "불합격"
                            ? styles.statusClosed
                            : applicant.status === "검토중"
                            ? styles.statusReview
                            : styles.statusOpen
                        }`}
                      >
                        {applicant.status}
                      </span>
                    </td>
                    <td>{applicant.benefits}</td>
                    <td className={styles.actionCell}>
                      <button className={styles.actionButtonSmall}>
                        상세보기
                      </button>
                      <button className={styles.actionButtonSmall}>
                        상태변경
                      </button>
                      <button className={styles.actionButtonSmall}>
                        메시지
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 액션 버튼 섹션 */}
          <div className={styles.formSection}>
            <div className={styles.formRow}>
              <button className={styles.actionButtonSmall}>
                선택 지원자 면접 일정 등록
              </button>
              <button className={styles.actionButtonSmall}>
                선택 지원자 상태 일괄 변경
              </button>
              <button className={styles.actionButtonSmall}>
                혜택 리포트 일괄 생성
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicantManagement;
