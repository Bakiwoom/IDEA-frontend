import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SideNavigation from "./SideNavigation";
import styles from "../../assets/css/main/Main.module.css";
import { CATEGORY_PAGE } from "../../routes/contantsRoutes";
import { useAuth } from "../../contexts/user/AuthProvider"; // AuthContext 불러오기

const Main = () => {
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [popularJobs, setPopularJobs] = useState([]);
  const [trendingJobs, setTrendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarks, setBookmarks] = useState(new Set());

  // 토큰 가져오기
  const token = localStorage.getItem('token');

  // AuthContext에서 사용자 정보 가져오기
  const { name, role } = useAuth();

  const navigate = useNavigate();

  // 공고 데이터 새로고침 함수 추가
  const fetchAllJobs = useCallback(async () => {
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
  }, [token]);

  // 북마크 조회 함수
  const fetchUserBookmarks = useCallback(async () => {
    try {
      console.log('북마크 목록 조회 요청');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/main/bookmarks/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('북마크 목록 응답:', response.data);

      if (response.data.result === "success") {
        const bookmarkJobIds = response.data.apiData.map(bookmark => bookmark.jobId);
        console.log('북마크된 공고 ID:', bookmarkJobIds);
        setBookmarks(new Set(bookmarkJobIds));
      }
    } catch (err) {
      console.error("북마크를 불러오는데 실패했습니다:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchAllJobs();
    if (token) {
      fetchUserBookmarks();
    }
  }, [token, fetchAllJobs, fetchUserBookmarks]);

  // 북마크 토글
  const toggleBookmark = async (e, jobId) => {
    // 이벤트 전파 방지
    e.preventDefault();
    e.stopPropagation();

    try {
      if (!token) {
        alert("로그인이 필요한 서비스입니다.");
        return;
      }

      console.log(`북마크 토글 시작: jobId=${jobId}, 현재상태=${bookmarks.has(jobId)}`);

      // 즉시 UI 업데이트 (낙관적 업데이트)
      setBookmarks(prev => {
        const newSet = new Set(prev);
        if (newSet.has(jobId)) {
          newSet.delete(jobId);
        } else {
          newSet.add(jobId);
        }
        return newSet;
      });

      if (bookmarks.has(jobId)) {
        // 북마크 제거
        console.log(`북마크 제거 요청: jobId=${jobId}`);
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/main/bookmarks/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log('북마크 제거 응답:', response.data);

        // 실패 시 원상복구
        if (response.data.result !== "success") {
          setBookmarks(prev => new Set([...prev, jobId]));
          console.log('북마크 제거 실패, UI 원상복구');
        }
      } else {
        // 북마크 추가
        console.log(`북마크 추가 요청: jobId=${jobId}`);
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/main/bookmarks`,
          { jobId },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log('북마크 추가 응답:', response.data);

        // 실패 시 원상복구
        if (response.data.result !== "success") {
          setBookmarks(prev => {
            const newSet = new Set(prev);
            newSet.delete(jobId);
            return newSet;
          });
          console.log('북마크 추가 실패, UI 원상복구');
        }
      }

      // fetchAllJobs 호출을 제거하여 페이지 새로고침 방지

    } catch (err) {
      console.error("북마크 처리에 실패했습니다:", err);
      console.error("에러 내용:", err.response ? err.response.data : err.message);

      // 오류 시 UI 원상복구
      setBookmarks(prev => {
        const newSet = new Set(prev);
        if (newSet.has(jobId)) {
          newSet.delete(jobId);
        } else {
          newSet.add(jobId);
        }
        return newSet;
      });

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
    // 북마크 클릭 핸들러를 별도 함수로 분리
    const handleBookmarkClick = (e) => {
      toggleBookmark(e, job.jobId);
    };
    const handleCardClick = () => {
      navigate(`/company/job/management/detail/${job.jobId}`);
    };
    return (
      <div className={`${styles.card} ${isTopBordered ? styles.topBorderedCard : ''}`} onClick={handleCardClick} style={{cursor:'pointer'}}>
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
            <span className={`${styles.cardDate}`}>{formatDeadline(job.deadline)}</span>
            {role !== 'company' && (
              <button
                type="button"
                className={`${styles.likeButton} ${bookmarks.has(job.jobId) ? styles.likeButtonActive : ''}`}
                onClick={handleBookmarkClick}
              >
                {bookmarks.has(job.jobId) ? '♥' : '♡'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 맞춤 공고가 없을 때 대체 데이터 준비
  // const getDefaultRecommendedJobs = () => {
  //   if (role === 'user') {
  //     // TODO: 장애, 지역, 성별, 연령 기반 인기 공고(북마크/클릭수 많은 공고) API 호출 또는 필터링
  //     return popularJobs.slice(0, 3); // 임시: 인기 공고 상위 3개
  //   } else if (role === 'company') {
  //     // TODO: 동종 업종, 지역 내 구직 희망자(지원의향서) API 호출 또는 필터링
  //     return []; // 임시: 기업회원은 별도 컴포넌트/메시지
  //   }
  //   return [];
  // };

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
        {token && role === 'user' && (
          <section id="recommended-jobs" className={styles.mainSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                {(name || '사용자') + "님이 꼭 봐야 할 공고"}
              </h2>
            </div>

            <div className={styles.cardGrid}>
              {recommendedJobs.length > 0 ? (
                recommendedJobs.map(job => (
                  <JobCard key={job.jobId} job={job} isTopBordered={true} />
                ))
              ) : (
                <p className={styles.noDataMessage}>
                  현재 회원님의 장애유형과 일치하는 공고가 없습니다.<br />
                  다른 공고를 살펴보시거나 새로운 공고가 등록되면 알려드리겠습니다.
                </p>
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


    </div>
  );
};

export default Main;