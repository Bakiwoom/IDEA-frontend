import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../assets/css/vendor/ApplicantManagement.module.css";
import VendorSidebar from "./CompanySidebar";

const ApplicantManagement = () => {
  const [activeMenu, setActiveMenu] = useState("applicant-management");
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 필터와 검색을 위한 상태 추가
  const [sortOrder, setSortOrder] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApplicants, setFilteredApplicants] = useState([]);

  // 로컬 스토리지에서 토큰 가져오기
  const token = localStorage.getItem('token');

  useEffect(() => {
    // 지원자 목록 데이터 가져오기
    const fetchApplicants = async () => {
      try {
        setLoading(true);

        // 토큰 인증 부분 주석 처리
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/companies/me/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // 백엔드 응답 구조에 맞게 데이터 추출
        if (response.data && response.data.result === "success") {
          console.log('API 응답 데이터:', response.data);
          setApplicants(response.data.apiData || []);
        } else {
          throw new Error(response.data?.message || "데이터를 불러오는데 실패했습니다.");
        }

        setLoading(false);
      } catch (err) {
        console.error("지원자 목록을 불러오는데 실패했습니다:", err);
        setError(err.message || "지원자 목록을 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  // 필터링과 정렬 로직 추가
  useEffect(() => {
    let result = [...applicants];

    // 검색 필터링
    if (searchTerm) {
      result = result.filter(applicant =>
        applicant.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.userPhone.includes(searchTerm) ||
        applicant.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.disabilityType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 정렬
    if (sortOrder === "latest") {
      result.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
    } else if (sortOrder === "oldest") {
      result.sort((a, b) => new Date(a.appliedDate) - new Date(b.appliedDate));
    }

    setFilteredApplicants(result);
  }, [applicants, sortOrder, searchTerm]);

  // 메뉴 변경 핸들러
  const handleMenuChange = (menuId) => {
    setActiveMenu(menuId);
    // 메뉴 변경 시 필요한 라우팅 로직 추가 가능
  };

  // 정렬 변경 핸들러
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 아래 코드 생략 (변경 없음)
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
          </div>

          {/* 필터 섹션 */}
          <div className={styles.formSection}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="job-filter">공고별 필터</label>
                <select
                  id="job-filter"
                  value={sortOrder}
                  onChange={handleSortChange}
                >
                  <option value="all">모든 공고</option>
                  <option value="latest">최신순</option>
                  <option value="oldest">오래된 순</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="search">검색</label>
                <input
                  type="text"
                  id="search"
                  placeholder="검색어를 입력하세요."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>

          {/* 지원자 목록 테이블 */}
          <div className={styles.tableContainer}>
            {loading ? (
              <p>로딩 중...</p>
            ) : error ? (
              <p className={styles.errorMessage}>{error}</p>
            ) : (
              <table className={styles.tableContent}>
                <thead className={styles.tableHead}>
                  <tr>
                    <th>프로필</th>
                    <th>지원 공고</th>
                    <th>장애 유형/등급</th>
                    <th>지원일자</th>
                  </tr>
                </thead>
                <tbody className={styles.tableBody}>
                  {filteredApplicants && filteredApplicants.length > 0 ? (
                    filteredApplicants.map((applicant) => (
                      <tr key={applicant.applicationId}>
                        <td>
                          {applicant.userName}
                          <br />
                          {applicant.userPhone}
                        </td>
                        <td>{applicant.jobTitle}</td>
                        <td>{applicant.disabilityType}</td>
                        <td>{applicant.appliedDate}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className={styles.noData}>
                        지원자 데이터가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicantManagement;