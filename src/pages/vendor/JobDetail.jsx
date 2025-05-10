// src/components/vendor/JobDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../../assets/css/vendor/JobDetail.module.css";
import CompanySidebar from "./CompanySidebar";
import { useAuth } from "../../contexts/user/AuthProvider";

const disabilityOptions = [
  { id: 1, name: "경증남성" },
  { id: 2, name: "경증여성" },
  { id: 3, name: "중증남성" },
  { id: 4, name: "중증여성" },
  { id: 5, name: "선택안함" },
];

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const token    = localStorage.getItem("token");
  const { role } = useAuth();  // "company" | "user" | undefined

  const [activeMenu, setActiveMenu] = useState("job-management");
  const [jobData,     setJobData]   = useState(null);
  const [loading,     setLoading]   = useState(true);
  const [error,       setError]     = useState(null);

  const handleMenuChange     = (menuId) => setActiveMenu(menuId);
  const handleViewApplicants = ()       => navigate("/company/applicant/management");
  const handleApply          = ()       => navigate(token ? "/apply" : "/login");
  const handleBookmark       = ()       => navigate(token ? "/bookmark" : "/login");
  const handleHome           = ()       => navigate("/");

  // 데이터 로드
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/job/${jobId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setJobData(res.data);
      } catch {
        setError("공고 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId, token]);

  if (loading)  return <div className={styles.loading}>로딩 중...</div>;
  if (error)    return <div className={styles.error}>{error}</div>;
  if (!jobData) return <div className={styles.error}>공고 정보를 찾을 수 없습니다.</div>;

  // ID → 이름 매핑
  const disabilityLabel = (() => {
    const id = parseInt(jobData.disabilityTypeName, 10);
    const opt = disabilityOptions.find(o => o.id === id);
    return opt ? opt.name : "미등록";
  })();

  return (
    <div
      className={
        role === "company"
          ? styles.companyWrapper
          : styles.userGuestWrapper
      }
    >
      {role === "company" && (
        <CompanySidebar activeMenu={activeMenu} handleMenuChange={handleMenuChange} />
      )}

      <section
        className={`${styles.mainContent} ${
          role === "company" ? styles.companyContent : styles.userGuestContent
        }`}
      >
        {/* ── 공통 디테일 ── */}
        <div className={styles.jobInfoBox}>
          <h1 className={styles.title}>
            {role === "company" ? `[공고] ${jobData.title}` : jobData.title}
            {/* 상태가 closed면 '마감' 배지 표시 */}
            {jobData.status === 'closed' && (
              <span className={styles.closedBadge}>마감</span>
            )}
          </h1>
          {role !== "company" && (
            <div className={styles.companyInfo}>
              <img
                src={jobData.companyLogo}
                alt={jobData.companyName}
                className={styles.companyLogo}
              />
              <h2>{jobData.companyName}</h2>
            </div>
          )}
          <div className={styles.infoBox}>
            <p><strong>근무지:</strong> {jobData.location}</p>
            <p><strong>직무 유형:</strong> {jobData.jobType}</p>
            <p><strong>고용 형태:</strong> {jobData.employmentType}</p>
            <p><strong>경력:</strong> {jobData.experienceLevel} ({jobData.experienceYears})</p>
            <p><strong>장애 유형:</strong> {disabilityLabel}</p>
            <p><strong>마감일:</strong> {jobData.deadline}</p>
            <p><strong>업무 설명:</strong> {jobData.description}</p>
            <p><strong>자격 요건:</strong> {jobData.requirements}</p>
            <p><strong>우대 조건:</strong> {jobData.preferred}</p>
          </div>
        </div>

        {/* ── 역할별 액션 ── */}
        {role === "company" && jobData.status !== 'closed' && (
          <div className={styles.jobActions}>
            <button className={styles.btnPrimary} onClick={handleViewApplicants}>
              지원자 상세보기
            </button>
          </div>
        )}

        {role === "user" && (
          <div className={styles.userActions}>
            {jobData.status !== 'closed' && (
              <button className={styles.applyButton} onClick={handleApply}>
                지원하기
              </button>
            )}
            <button className={styles.bookmarkButton} onClick={handleBookmark}>
              북마크
            </button>
           <button className={styles.applyButton} onClick={handleHome}>
             홈으로
           </button>
          </div>
        )}

        {!role && (
          <div className={styles.loginPrompt}>
            <p>지원 및 북마크는 로그인 후 이용할 수 있습니다.</p>
            <div>
              <Link to="/login" className={styles.loginLink}>
                로그인하러 가기
              </Link>
             <Link to="/" className={styles.loginLink}>
             홈으로 가기
             </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobDetail;