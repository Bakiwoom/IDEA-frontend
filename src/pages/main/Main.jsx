import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SideNavigation from "./SideNavigation";
import styles from "../../assets/css/main/Main.module.css";
import { CATEGORY_PAGE } from "../../routes/contantsRoutes";
import { useChat } from "../../contexts/ChatContext";

const Main = () => {
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [popularJobs, setPopularJobs] = useState([]);
  const [trendingJobs, setTrendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarks, setBookmarks] = useState(new Set());

  // 토큰 가져오기
  const token = localStorage.getItem('token');

  const { openChat, isOpen } = useChat();

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        setLoading(true);

        // 인기 공고 가져오기 (인증 필요 없음)
        const popularResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/main/popular`
        );

        // 주목받는 공고 가져오기 (인증 필요 없음)
        const trendingResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/main/trending`
        );

        if (popularResponse.data.result === "success") {
          setPopularJobs(popularResponse.data.apiData || []);
        }

        if (trendingResponse.data.result === "success") {
          setTrendingJobs(trendingResponse.data.apiData || []);
        }

        // 맞춤 공고는 로그인한 경우에만 가져오기
        if (token) {
          const recommendedResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/main/recommended`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          console.log('추천 공고 API 데이터:', recommendedResponse.data.apiData);

          if (recommendedResponse.data.result === "success") {
            setRecommendedJobs(recommendedResponse.data.apiData || []);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("채용공고를 불러오는데 실패했습니다:", err);
        setError("채용공고를 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };

    const fetchUserBookmarks = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/main/bookmarks/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.result === "success") {
          const bookmarkJobIds = response.data.apiData.map(bookmark => bookmark.jobId);
          setBookmarks(new Set(bookmarkJobIds));
        }
      } catch (err) {
        console.error("북마크를 불러오는데 실패했습니다:", err);
      }
    };

    fetchAllJobs();
    if (token) {
      fetchUserBookmarks();
    }
  }, [token]);

  // 북마크 토글
  const toggleBookmark = async (jobId) => {
    try {
      if (!token) {
        alert("로그인이 필요한 서비스입니다.");
        return;
      }

      if (bookmarks.has(jobId)) {
        // 북마크 제거
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/main/bookmarks/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setBookmarks(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      } else {
        // 북마크 추가
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/main/bookmarks`,
          { jobId },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setBookmarks(prev => new Set([...prev, jobId]));
      }

      // 공고 데이터 새로고침 (북마크 카운트 업데이트를 위해)
      // fetchAllJobs()를 직접 호출하는 대신 상태를 업데이트하여 리렌더링
      // 또는 별도의 API 호출로 카운트만 업데이트
    } catch (err) {
      console.error("북마크 처리에 실패했습니다:", err);
      alert("북마크 처리에 실패했습니다.");
    }
  };

  // 마감일 포맷팅
  const formatDeadline = (deadline) => {
    if (!deadline) return '';

    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return '마감';
    if (diffDays === 0) return 'D-Day';
    if (diffDays <= 7) return `D-${diffDays}`;

    return `~${(deadlineDate.getMonth() + 1).toString().padStart(2, '0')}.${deadlineDate.getDate().toString().padStart(2, '0')}`;
  };

  // 채용 카드 컴포넌트
  const JobCard = ({ job, isTopBordered = false }) => {
    return (
      <div className={`${styles.card} ${isTopBordered ? styles.topBorderedCard : ''}`}>
        <img
          src={job.companyLogo || "/images/default-company-logo.png"}
          alt={`${job.companyName} 로고`}
          className={styles.cardCompanyLogo}
        />
        <h3 className={styles.cardTitle}>{job.title}</h3>
        <p className={styles.cardCompany}>{job.companyName}</p>
        <div className={styles.cardTags}>
          <span className={styles.cardTag}>
            <i>📍</i> {job.location}
          </span>
          <span className={styles.cardTag}>
            <i>🏢</i> {job.experienceLevel || "경력무관"}
          </span>
        </div>
        <div className={styles.cardBottom}>
          <div>
            <span className={`${styles.cardBadge} ${styles.cardBadgeHot}`}>
              {job.disabilityTypeName || "장애무관"}
            </span>
          </div>
          <div>
            <span>{formatDeadline(job.deadline)}</span>
            <button
              className={styles.likeButton}
              onClick={() => toggleBookmark(job.jobId)}
            >
              {bookmarks.has(job.jobId) ? '♥' : '♡'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>채용공고를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className={styles.active} id="job-seeker-screen">
      {/* 네비게이션 */}
      <nav className={styles.nav}>
        <div className={`${styles.container} ${styles.navContainer}`}>
          <button className={styles.menuButton}>☰</button>
          <ul className={styles.navMenu}>
            <li>
              <Link to={CATEGORY_PAGE} className={styles.active}>
                채용정보
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className={styles.container} style={{ paddingTop: "30px" }}>
        {/* 배너 */}
        <div className={styles.banner}>
          <h1>나에게 맞는 일자리와 함께 받을 수 있는 혜택까지!</h1>
          <p>
            장애인 구직자를 위한 맞춤형 혜택 정보와 채용 공고를 확인하세요.
          </p>
        </div>

        {/* 맞춤 공고 섹션 */}
        {token && (
          <section id="recommended-jobs" className={styles.mainSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                {recommendedJobs[0].userName || '사용자'}님이 꼭 봐야 할 공고
              </h2>
            </div>

            <div className={styles.cardGrid}>
              {recommendedJobs.length > 0 ? (
                recommendedJobs.map(job => (
                  <JobCard key={job.jobId} job={job} isTopBordered={true} />
                ))
              ) : (
                <p className={styles.noDataMessage}>맞춤 공고가 없습니다.</p>
              )}
            </div>
          </section>
        )}

        {/* 최고의 인기 공고 */}
        <section id="popular-jobs" className={styles.mainSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>최고의 인기 공고</h2>
          </div>

          <div className={styles.cardGrid}>
            {popularJobs.length > 0 ? (
              popularJobs.map(job => (
                <JobCard key={job.jobId} job={job} />
              ))
            ) : (
              <p className={styles.noDataMessage}>인기 공고가 없습니다.</p>
            )}
          </div>
        </section>

        {/* 요즘 주목받는 공고 */}
        <section id="trending-jobs" className={styles.mainSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>요즘 주목받는 공고</h2>
          </div>

          <div className={styles.cardGrid}>
            {trendingJobs.length > 0 ? (
              trendingJobs.map(job => (
                <JobCard key={job.jobId} job={job} />
              ))
            ) : (
              <p className={styles.noDataMessage}>주목받는 공고가 없습니다.</p>
            )}
          </div>
        </section>
      </main>

      {/* 사이드 내비게이션 */}
      <SideNavigation />

      {/* 챗봇 */}
      {!isOpen && (
        <div className={styles.chatbotContainer} onClick={openChat} style={{ cursor: 'pointer' }}>
          <img
            src="/images/chatbot.png"
            alt="챗봇"
            className={styles.chatbotIcon}
          />
        </div>
      )}
    </div>
  );
};

export default Main;