import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import CompanySidebar from "./CompanySidebar";
import { useAuth } from "../../contexts/user/AuthProvider";
import styles from "../../assets/css/vendor/JobDetail.module.css";

const disabilityOptions = [
  { id: 1, name: "중증" },
  { id: 2, name: "경증" },
  { id: 3, name: "없음" },

];

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { role, userId } = useAuth();

  const [activeMenu, setActiveMenu] = useState("job-management");
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);



  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/job/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobData(res.data);
        setHasApplied(res.data.hasApplied);
      } catch (e) {
        setError("공고 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId, token]);

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!jobData) return <div className={styles.error}>공고 정보를 찾을 수 없습니다.</div>;

  const disabilityLabel = (() => {
    const id = parseInt(jobData.disabilityTypeName, 10);
    const opt = disabilityOptions.find((o) => o.id === id);
    return opt ? opt.name : "미등록";
  })();


  const handleApply = async () => {
    if (!token || !userId) {
      alert("로그인 정보가 없거나 만료되었습니다.");
      return navigate("/login");
    }

    try {
      // 1단계: Spring Boot에 지원 요청
      await axios.post(`${process.env.REACT_APP_API_URL}/api/job/${jobId}/apply`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHasApplied(true);
      alert("지원이 완료되었습니다!");

      const jobInfo = jobData;

      console.log("전송 데이터 확인", { userId, jobId, jobInfo });

      // 2단계: Spring Boot → FastAPI 분석 요청
      await axios.post(`${process.env.REACT_APP_API_URL}/api/ai/benefits`, {
        user_info: { id: userId },   // ✅ 이 구조로 바꿔야 함!
        job_info: jobData,
      });

      console.log("✅ 분석 요청 완료");

    } catch (err) {
      console.error("❌ 분석 요청 실패:", err);
      alert(err.response?.data?.message || "지원 중 오류가 발생했습니다.");
    }
  };

  const handleCancelApply = async () => {
    if (!token) return navigate("/login");
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/job/${jobId}/cancel`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHasApplied(false);
      alert("지원이 취소되었습니다.");
    } catch (err) {
      alert(err.response?.data?.message || "지원 취소 중 오류 발생");
    }
  };

  return (
      <div className={role === "company" ? styles.companyWrapper : styles.userGuestWrapper}>
        {role === "company" && <CompanySidebar activeMenu={activeMenu} handleMenuChange={setActiveMenu} />}

        <section className={`${styles.mainContent} ${role === "company" ? styles.companyContent : styles.userGuestContent}`}>
          <div className={styles.jobInfoBox}>
            <h1 className={styles.title}>
              {role === "company" ? `[공고] ${jobData.title}` : jobData.title}
              {jobData.status === "closed" && <span className={styles.closedBadge}>마감</span>}
            </h1>

            {role !== "company" && (
                <div className={styles.companyInfo}>
                  <img src={jobData.companyLogo} alt={jobData.companyName} className={styles.companyLogo} />
                  <h2>{jobData.companyName}</h2>
                </div>
            )}

            <div className={styles.infoBox}>
              <h2 className={styles.sectionTitle}>🧭 기본 정보</h2>
              <p><strong>근무지:</strong> {jobData.location}</p>
              <p><strong>직무 유형:</strong> {jobData.jobType}</p>
              <p><strong>고용 형태:</strong> {jobData.employmentType}</p>
              <p><strong>경력:</strong> {jobData.experienceLevel} ({jobData.experienceYears})</p>
              <p><strong>장애 유형:</strong> {disabilityLabel}</p>
              <p><strong>마감일:</strong> {jobData.deadline}</p>

              <h2 className={styles.sectionTitle}>💼 상세 설명</h2>
              <p><strong>업무 설명:</strong> {jobData.description}</p>
              <p><strong>자격 요건:</strong> {jobData.requirements}</p>
              <p><strong>우대 조건:</strong> {jobData.preferred}</p>
            </div>
          </div>

          {role === "company" && (
              <div className={styles.jobActions}>
                <button className={styles.applyButton} onClick={() => navigate("/company/applicant/management")}>지원자 현황보기</button>
              </div>
          )}

          {role === "user" && (
              <div className={styles.userActions}>
                {!hasApplied && jobData.status !== 'closed' && (
                    <button className={styles.applyButton} onClick={handleApply}>지원하기</button>
                )}
                {hasApplied && (
                    <div className={styles.appliedNotice}>
                      ✅ 이미 지원하셨습니다.
                      <button className={styles.cancelButton} onClick={handleCancelApply}>지원취소</button>
                    </div>
                )}
                <button className={styles.bookmarkButton} onClick={() => navigate(token ? "/bookmark" : "/login")}>북마크</button>
                <button className={styles.applyButton} onClick={() => navigate("/")}>홈으로</button>
              </div>
          )}

          {!role && (
              <div className={styles.loginPrompt}>
                <p>지원 및 북마크는 로그인 후 이용할 수 있습니다.</p>
                <div>
                  <Link to="/login" className={styles.loginLink}>로그인하러 가기</Link>
                  <Link to="/" className={styles.loginLink}>홈으로 가기</Link>
                </div>
              </div>
          )}
        </section>
      </div>
  );
};

export default JobDetail;