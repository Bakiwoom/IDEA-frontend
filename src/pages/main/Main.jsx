import React, { useState } from "react";
import { Link } from "react-router-dom";
import SideNavigation from "./SideNavigation";
import styles from "../../assets/css/main/Main.module.css";

const Main = () => {

  return (
    <div>
      {/* 구직자 메인화면 */}
      <div className={styles.active} id="job-seeker-screen">
        {/* 네비게이션 */}
        <nav className={styles.nav}>
          <div className={`${styles.container} ${styles.navContainer}`}>
            <button className={styles.menuButton}>☰</button>
            <ul className={styles.navMenu}>
              <li>
                <Link to="/vendor/sidebar" className={styles.active}>
                  채용정보
                </Link>
              </li>
              {/* <li>
                <Link to="#">혜택 시뮬레이션</Link>
              </li>
              <li>
                <Link to="#">맞춤 공고</Link>
              </li>
              <li>
                <Link to="#">혜택 안내</Link>
              </li>
              <li>
                <Link to="#">북마크</Link>
              </li>
              <li>
                <Link to="#">내 혜택 리포트</Link>
              </li> */}
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
            {/* <button className={styles.mainButton}>
              나의 혜택 시뮬레이션 하기
            </button>
            <button className={styles.outlineButton}>맞춤 공고 보기</button> */}
          </div>

          {/* 맞춤 공고 섹션 */}
          <section id="recommended-jobs" className={styles.mainSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                차은우님이 꼭 봐야 할 공고
              </h2>
              {/* <Link to="#" className={styles.viewAll}>
                내 조건 정보 입력하기
              </Link> */}
            </div>

            <div className={styles.cardGrid}>
              {/* 채용 카드 1 */}
              <div className={`${styles.card} ${styles.topBorderedCard}`}>
                <img
                  src="/images/쿠팡로고.png"
                  alt="쿠팡로고"
                  className={styles.cardCompanyLogo}
                />
                <h3 className={styles.cardTitle}>
                  [쿠팡 CFS] 지역허브 셀러보상 전문가 림핑크룸 정규직 채용
                </h3>
                <p className={styles.cardCompany}>쿠팡풀필먼트서비스(주)</p>
                <div className={styles.cardTags}>
                  <span className={styles.cardTag}>
                    <i>📍</i> 경기/인천
                  </span>
                  <span className={styles.cardTag}>
                    <i>🏢</i> 신입/경력
                  </span>
                </div>
                <div className={styles.cardBottom}>
                  <div>
                    <span
                      className={`${styles.cardBadge} ${styles.cardBadgeHot}`}
                    >
                      시각장애
                    </span>
                  </div>
                  <div>
                    <span>~04.30(화)</span>
                    <button className={styles.likeButton}>♡</button>
                  </div>
                </div>
              </div>

              {/* 채용 카드 2 */}
              <div className={`${styles.card} ${styles.topBorderedCard}`}>
                <img
                  src="/images/쿠팡로고.png"
                  alt="쿠팡로고"
                  className={styles.cardCompanyLogo}
                />
                <h3 className={styles.cardTitle}>
                  쿠팡이츠서비스 CXM 대규모 채용
                </h3>
                <p className={styles.cardCompany}>쿠팡(주)</p>
                <div className={styles.cardTags}>
                  <span className={styles.cardTag}>
                    <i>📍</i> 경기/인천
                  </span>
                  <span className={styles.cardTag}>
                    <i>🏢</i> 신입/경력
                  </span>
                </div>
                <div className={styles.cardBottom}>
                  <div>
                    <span
                      className={`${styles.cardBadge} ${styles.cardBadgeHot}`}
                    >
                      청각장애
                    </span>
                  </div>
                  <div>
                    <span>D-3</span>
                    <button className={styles.likeButton}>♡</button>
                  </div>
                </div>
              </div>

              {/* 채용 카드 3 */}
              <div className={`${styles.card} ${styles.topBorderedCard}`}>
                <img
                  src="/images/SC제일은행로고.png"
                  alt="SC제일은행로고"
                  className={styles.cardCompanyLogo}
                />
                <h3 className={styles.cardTitle}>소프트웨어 기술지원 채용</h3>
                <p className={styles.cardCompany}>(주)디에이씨</p>
                <div className={styles.cardTags}>
                  <span className={styles.cardTag}>
                    <i>📍</i> 서울전체
                  </span>
                  <span className={styles.cardTag}>
                    <i>🏢</i> 신입/경력
                  </span>
                </div>
                <div className={styles.cardBottom}>
                  <div>
                    <span
                      className={`${styles.cardBadge} ${styles.cardBadgeNew}`}
                    >
                      지체장애
                    </span>
                  </div>
                  <div>
                    <span>~05.08(목)</span>
                    <button className={styles.likeButton}>♡</button>
                  </div>
                </div>
              </div>

              {/* 채용 카드 4 */}
              <div className={`${styles.card} ${styles.topBorderedCard}`}>
                <img
                  src="/images/삼성로고.png"
                  alt="삼성로고"
                  className={styles.cardCompanyLogo}
                />
                <h3 className={styles.cardTitle}>
                  시스템 소프트웨어 개발 엔지니어 채용
                </h3>
                <p className={styles.cardCompany}>삼성전자(주)</p>
                <div className={styles.cardTags}>
                  <span className={styles.cardTag}>
                    <i>📍</i> 경기/수원
                  </span>
                  <span className={styles.cardTag}>
                    <i>🏢</i> 신입/경력
                  </span>
                </div>
                <div className={styles.cardBottom}>
                  <div>
                    <span
                      className={`${styles.cardBadge} ${styles.cardBadgeHot}`}
                    >
                      내부기관장애
                    </span>
                  </div>
                  <div>
                    <span>~05.15(수)</span>
                    <button className={styles.likeButton}>♡</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 최고의 인기 공고 */}
          <section id="popular-jobs" className={styles.mainSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>최고의 인기 공고</h2>
            </div>

            <div className={styles.cardGrid}>
              {/* 채용 카드 1 */}
              <div className={styles.card}>
                <img
                  src="/images/쿠팡로고.png"
                  alt="쿠팡로고"
                  className={styles.cardCompanyLogo}
                />
                <h3 className={styles.cardTitle}>
                  [쿠팡 CFS] 지역허브 셀러보상 전문가 림핑크룸 정규직 채용
                </h3>
                <p className={styles.cardCompany}>쿠팡풀필먼트서비스(주)</p>
                <div className={styles.cardTags}>
                  <span className={styles.cardTag}>
                    <i>📍</i> 경기/인천
                  </span>
                  <span className={styles.cardTag}>
                    <i>🏢</i> 신입/경력
                  </span>
                </div>
                <div className={styles.cardBottom}>
                  <div>
                    <span
                      className={`${styles.cardBadge} ${styles.cardBadgeHot}`}
                    >
                      시각장애
                    </span>
                  </div>
                  <div>
                    <span>~04.30(화)</span>
                    <button className={styles.likeButton}>♡</button>
                  </div>
                </div>
              </div>

              {/* 채용 카드 2 */}
              <div className={styles.card}>
                <img
                  src="/images/쿠팡로고.png"
                  alt="쿠팡로고"
                  className={styles.cardCompanyLogo}
                />
                <h3 className={styles.cardTitle}>
                  쿠팡이츠서비스 CXM 대규모 채용
                </h3>
                <p className={styles.cardCompany}>쿠팡(주)</p>
                <div className={styles.cardTags}>
                  <span className={styles.cardTag}>
                    <i>📍</i> 경기/인천
                  </span>
                  <span className={styles.cardTag}>
                    <i>🏢</i> 신입/경력
                  </span>
                </div>
                <div className={styles.cardBottom}>
                  <div>
                    <span
                      className={`${styles.cardBadge} ${styles.cardBadgeHot}`}
                    >
                      청각장애
                    </span>
                  </div>
                  <div>
                    <span>D-3</span>
                    <button className={styles.likeButton}>♡</button>
                  </div>
                </div>
              </div>

              {/* 채용 카드 3 */}
              <div className={styles.card}>
                <img
                  src="/images/SC제일은행로고.png"
                  alt="SC제일은행로고"
                  className={styles.cardCompanyLogo}
                />
                <h3 className={styles.cardTitle}>소프트웨어 기술지원 채용</h3>
                <p className={styles.cardCompany}>(주)디에이씨</p>
                <div className={styles.cardTags}>
                  <span className={styles.cardTag}>
                    <i>📍</i> 서울전체
                  </span>
                  <span className={styles.cardTag}>
                    <i>🏢</i> 신입/경력
                  </span>
                </div>
                <div className={styles.cardBottom}>
                  <div>
                    <span
                      className={`${styles.cardBadge} ${styles.cardBadgeNew}`}
                    >
                      지체장애
                    </span>
                  </div>
                  <div>
                    <span>~05.08(목)</span>
                    <button className={styles.likeButton}>♡</button>
                  </div>
                </div>
              </div>

              {/* 채용 카드 4 */}
              <div className={styles.card}>
                <img
                  src="/images/삼성로고.png"
                  alt="삼성로고"
                  className={styles.cardCompanyLogo}
                />
                <h3 className={styles.cardTitle}>
                  시스템 소프트웨어 개발 엔지니어 채용
                </h3>
                <p className={styles.cardCompany}>삼성전자(주)</p>
                <div className={styles.cardTags}>
                  <span className={styles.cardTag}>
                    <i>📍</i> 경기/수원
                  </span>
                  <span className={styles.cardTag}>
                    <i>🏢</i> 신입/경력
                  </span>
                </div>
                <div className={styles.cardBottom}>
                  <div>
                    <span
                      className={`${styles.cardBadge} ${styles.cardBadgeHot}`}
                    >
                      내부기관장애
                    </span>
                  </div>
                  <div>
                    <span>~05.15(수)</span>
                    <button className={styles.likeButton}>♡</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 요즘 주목받는 공고 */}
          <section id="trending-jobs" className={styles.mainSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>요즘 주목받는 공고</h2>
            </div>

            <div className={styles.cardGrid}>
              {/* 채용 카드 1 */}
              <div className={styles.card}>
                <img
                  src="/images/쿠팡로고.png"
                  alt="쿠팡로고"
                  className={styles.cardCompanyLogo}
                />
                <h3 className={styles.cardTitle}>
                  [쿠팡 CFS] 지역허브 셀러보상 전문가 림핑크룸 정규직 채용
                </h3>
                <p className={styles.cardCompany}>쿠팡풀필먼트서비스(주)</p>
                <div className={styles.cardTags}>
                  <span className={styles.cardTag}>
                    <i>📍</i> 경기/인천
                  </span>
                  <span className={styles.cardTag}>
                    <i>🏢</i> 신입/경력
                  </span>
                </div>
                <div className={styles.cardBottom}>
                  <div>
                    <span
                      className={`${styles.cardBadge} ${styles.cardBadgeHot}`}
                    >
                      시각장애
                    </span>
                  </div>
                  <div>
                    <span>~04.30(화)</span>
                    <button className={styles.likeButton}>♡</button>
                  </div>
                </div>
              </div>

              {/* 채용 카드 2 */}
              <div className={styles.card}>
                <img
                  src="/images/쿠팡로고.png"
                  alt="쿠팡로고"
                  className={styles.cardCompanyLogo}
                />
                <h3 className={styles.cardTitle}>
                  쿠팡이츠서비스 CXM 대규모 채용
                </h3>
                <p className={styles.cardCompany}>쿠팡(주)</p>
                <div className={styles.cardTags}>
                  <span className={styles.cardTag}>
                    <i>📍</i> 경기/인천
                  </span>
                  <span className={styles.cardTag}>
                    <i>🏢</i> 신입/경력
                  </span>
                </div>
                <div className={styles.cardBottom}>
                  <div>
                    <span
                      className={`${styles.cardBadge} ${styles.cardBadgeHot}`}
                    >
                     청각장애
                    </span>
                  </div>
                  <div>
                    <span>D-3</span>
                    <button className={styles.likeButton}>♡</button>
                  </div>
                </div>
              </div>

              {/* 채용 카드 3 */}
              <div className={styles.card}>
                <img
                  src="/images/SC제일은행로고.png"
                  alt="SC제일은행로고"
                  className={styles.cardCompanyLogo}
                />
                <h3 className={styles.cardTitle}>소프트웨어 기술지원 채용</h3>
                <p className={styles.cardCompany}>(주)디에이씨</p>
                <div className={styles.cardTags}>
                  <span className={styles.cardTag}>
                    <i>📍</i> 서울전체
                  </span>
                  <span className={styles.cardTag}>
                    <i>🏢</i> 신입/경력
                  </span>
                </div>
                <div className={styles.cardBottom}>
                  <div>
                    <span
                      className={`${styles.cardBadge} ${styles.cardBadgeNew}`}
                    >
                      지체장애
                    </span>
                  </div>
                  <div>
                    <span>~05.08(목)</span>
                    <button className={styles.likeButton}>♡</button>
                  </div>
                </div>
              </div>

              {/* 채용 카드 4 */}
              <div className={styles.card}>
                <img
                  src="/images/삼성로고.png"
                  alt="삼성로고"
                  className={styles.cardCompanyLogo}
                />
                <h3 className={styles.cardTitle}>
                  시스템 소프트웨어 개발 엔지니어 채용
                </h3>
                <p className={styles.cardCompany}>삼성전자(주)</p>
                <div className={styles.cardTags}>
                  <span className={styles.cardTag}>
                    <i>📍</i> 경기/수원
                  </span>
                  <span className={styles.cardTag}>
                    <i>🏢</i> 신입/경력
                  </span>
                </div>
                <div className={styles.cardBottom}>
                  <div>
                    <span
                      className={`${styles.cardBadge} ${styles.cardBadgeHot}`}
                    >
                      내부기관장애
                    </span>
                  </div>
                  <div>
                    <span>~05.15(수)</span>
                    <button className={styles.likeButton}>♡</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* 사이드 내비게이션 */}
        <SideNavigation />

        {/* 챗봇 */}
        <div className={styles.chatbotContainer}>
          <img
            src="/images/chatbot.png"
            alt="챗봇"
            className={styles.chatbotIcon}
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
