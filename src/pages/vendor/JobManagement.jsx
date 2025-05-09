import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../assets/css/vendor/JobManagement.module.css";
import VendorSidebar from "./CompanySidebar";

const JobManagement = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("job-management");
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 토큰 가져오기
  const token = localStorage.getItem('token');

  // 메뉴 변경 핸들러
  const handleMenuChange = (menuId) => {
    setActiveMenu(menuId);
    // 메뉴 변경 시, 필요한 라우팅 로직 추가 가능
  };

  // 상세보기 버튼 클릭 핸들러
  const handleViewDetail = (jobId) => {
    navigate(`/company/job/management/detail/${jobId}`);
  };

  // 공고 데이터 가져오기
  const fetchJobPostings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/companies/me/jobs/posting`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.result === "success") {
        setJobPostings(response.data.apiData || []);
        console.log('공고글 데이터:', response.data.apiData);
      } else {
        setError(response.data.message || "데이터를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      console.error("공고 데이터 로드 실패:", err);
      setError("공고 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchJobPostings();
  }, []);

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
              <th>채용담당</th>
              <th>직무 유형</th>
              <th>지원자 수</th>
              <th>마감일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className={styles.messageCell}>데이터를 불러오는 중입니다...</td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan="6" className={`${styles.messageCell} ${styles.errorMessage}`}>{error}</td>
              </tr>
            )}
            {!loading && !error && jobPostings.length === 0 && (
              <tr>
                <td colSpan="6" className={styles.messageCell}>등록된 공고가 없습니다.</td>
              </tr>
            )}
            {!loading && !error && jobPostings.length > 0 && 
              jobPostings.map((job, index) => (
                <tr key={job.jobId || index}>
                  <td>{job.title || '제목 없음'}</td>
                  <td>{job.department || '-'}</td>
                  <td>{job.jobType || '-'}</td>
                  <td>{job.applyCount || '-'}</td>
                  <td>{formatDate(job.deadline)}</td>
                  <td>
                    <button
                      className={styles.btnSecondary}
                      onClick={() => handleViewDetail(job.jobId)}
                    >
                      상세보기
                    </button>
                    <button 
                      className={styles.btnSecondary}
                      onClick={() => navigate(`/company/job/edit/${job.jobId}`)}
                    >
                      수정
                    </button>
                    <button 
                      className={styles.btnSecondary}
                    >
                      마감
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default JobManagement;