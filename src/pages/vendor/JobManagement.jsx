// src/components/vendor/JobManagement.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../assets/css/vendor/JobManagement.module.css";
import VendorSidebar from "./CompanySidebar";

const API_URL = process.env.REACT_APP_API_URL;

const JobManagement = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("job-management");
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const headers = { Authorization: `Bearer ${token}` };

  const handleMenuChange = (menuId) => {
    setActiveMenu(menuId);
  };

  const handleViewDetail = (jobId) => {
    navigate(`/company/job/management/detail/${jobId}`);
  };

  // 삭제
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("정말 이 공고를 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`${API_URL}/api/job/${jobId}`, { headers });
      fetchJobPostings();
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  // 마감
  const handleCloseJob = async (jobId) => {
    if (!window.confirm("이 공고를 마감 처리하시겠습니까?")) return;
    try {
      await axios.patch(`${API_URL}/api/job/${jobId}/close`, {}, { headers });
      fetchJobPostings();
    } catch (err) {
      console.error("마감 실패:", err);
      alert("마감 처리에 실패했습니다.");
    }
  };

  // 공고 데이터 가져오기
  const fetchJobPostings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/companies/me/jobs/posting`, { headers });
      if (res.data.result === "success") {
        setJobPostings(res.data.apiData || []);
      } else {
        setError(res.data.message || "데이터를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      console.error("공고 데이터 로드 실패:", err);
      setError("공고 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 날짜 포맷
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  useEffect(() => {
    fetchJobPostings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.mypageWrap}>
      <VendorSidebar activeMenu={activeMenu} handleMenuChange={handleMenuChange} />

      <section className={styles.mainContent}>
        <div className={styles.mainHeader}>
          <h1>내 공고 관리</h1>
          <button
            className={styles.btnPrimary}
            onClick={() => navigate("/company/job/create")}
          >
            + 새 공고 등록
          </button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>공고명</th>
              <th>채용 담당</th>
              <th>직무 유형</th>
              <th>지원자 수</th>
              <th>마감일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className={styles.messageCell}>
                  데이터를 불러오는 중입니다...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan="6" className={`${styles.messageCell} ${styles.errorMessage}`}>
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && jobPostings.length === 0 && (
              <tr>
                <td colSpan="6" className={styles.messageCell}>
                  등록된 공고가 없습니다.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              jobPostings.map((job) => (
                <tr key={job.jobId}>
                  <td>{job.title || "제목 없음"}</td>
                  <td>{job.department || "-"}</td>
                  <td>{job.jobType || "-"}</td>
                  <td>{job.applyCount ?? "-"}</td>
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
                      onClick={() => handleDeleteJob(job.jobId)}
                    >
                      삭제
                    </button>
                    {job.status !== "closed" && (
                    <button
                      className={styles.btnSecondary}
                      onClick={() => handleCloseJob(job.jobId)}
                    >
                      마감
                    </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default JobManagement;
