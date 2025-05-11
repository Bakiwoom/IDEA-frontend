// ✅ ApplicantManagement.jsx - 지원자 목록 + AI 혜택 분석 표시 컴포넌트

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../assets/css/vendor/ApplicantManagement.module.css";
import VendorSidebar from "./CompanySidebar";

const ApplicantManagement = () => {
  const [activeMenu, setActiveMenu] = useState("applicant-management");
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTitleFilter, setJobTitleFilter] = useState("all");
  const [uniqueJobTitles, setUniqueJobTitles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchApplicants(page);
  }, []);

  const fetchApplicants = async (pageNum) => {
    try {
      setLoading(true);
      const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/companies/me/applications?page=${pageNum}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      if (response.data?.result === "success") {
        const newData = response.data.apiData || [];
        if (newData.length === 0) setHasMore(false);
        else {
          const merged = [...applicants, ...newData];
          setApplicants(merged);
          setUniqueJobTitles([...new Set(merged.map((a) => a.jobTitle))]);
        }
      } else {
        throw new Error(response.data?.message || "데이터 불러오기 실패");
      }
      setLoading(false);
    } catch (err) {
      console.error("지원자 목록 오류:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...applicants];
    if (searchTerm) {
      result = result.filter((a) =>
          [a.userName, a.userPhone, a.jobTitle, a.disabilityType].some((field) =>
              field?.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }
    if (jobTitleFilter !== "all") {
      result = result.filter((a) => a.jobTitle === jobTitleFilter);
    }
    if (sortOrder === "latest") {
      result.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
    } else if (sortOrder === "oldest") {
      result.sort((a, b) => new Date(a.appliedDate) - new Date(b.appliedDate));
    }
    setFilteredApplicants(result);
  }, [applicants, searchTerm, sortOrder, jobTitleFilter]);

  return (
      <div className={styles.container}>
        <VendorSidebar activeMenu={activeMenu} handleMenuChange={setActiveMenu} />
        <div className={`${styles.mainContent} ${styles.screen} ${styles.active}`}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>지원자 관리</h1>
          </div>

          <div className={styles.formSection}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>정렬</label>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                  <option value="all">모든 순서</option>
                  <option value="latest">최신순</option>
                  <option value="oldest">오래된 순</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>공고명 필터</label>
                <select value={jobTitleFilter} onChange={(e) => setJobTitleFilter(e.target.value)}>
                  <option value="all">전체 공고</option>
                  {uniqueJobTitles.map((title, idx) => (
                      <option key={idx} value={title}>{title}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>검색</label>
                <input
                    type="text"
                    placeholder="이름, 연락처, 공고명 등"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.tableContainer}>
            {loading && page === 1 ? (
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
                    <th>AI 혜택 분석</th>
                  </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
                  {filteredApplicants.length > 0 ? (
                      filteredApplicants.map((a) => (
                          <tr key={a.applicationId}>
                            <td>{a.userName}<br />{a.userPhone}</td>
                            <td>{a.jobTitle}</td>
                            <td>{a.disabilityType}</td>
                            <td>{a.appliedDate}</td>
                            <td>
                              <div className={styles.aiBenefitBox}>
                                <div className={styles.analysisHeader}>📊 AI 혜택 분석</div>
                                {a.benefitAnalysis ? (
                                    <div className={styles.analysisContent}>
                                      <div><strong>기업:</strong> {a.benefitAnalysis.company}</div>
                                      <div><strong>지원자:</strong> {a.benefitAnalysis.user}</div>
                                    </div>
                                ) : (
                                    <div className={styles.analysisLoading}>분석 중 또는 준비되지 않음</div>
                                )}
                              </div>
                            </td>
                          </tr>
                      ))
                  ) : (
                      <tr><td colSpan="5" className={styles.noData}>지원자 데이터가 없습니다.</td></tr>
                  )}
                  </tbody>
                </table>
            )}
          </div>
        </div>
      </div>
  );
};

export default ApplicantManagement;
