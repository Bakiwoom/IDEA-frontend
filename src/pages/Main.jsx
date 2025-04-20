import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../assets/css/main/Main.module.css";

const Main = ({ activeMenu, handleMenuChange }) => {
  const [activeTab, setActiveTab] = useState("장애인 채용");

  return (
    <div>
      {/* 구직자 메인화면 */}
      <div className={styles.active} id="job-seeker-screen">
        {/* 헤더 */}
        <header className={styles.header}>
          <div className={`${styles.container} ${styles.headerContainer}`}>
            <Link to="/" className={styles.logo}>
              Dear
            </Link>
            <div className={styles.headerRight}>
              <button className={styles.profileButton}>
                <div className={styles.profileImage}>홍</div>
                <span>홍길동님</span>
              </button>
            </div>
          </div>
        </header>

        {/* 네비게이션 */}
        <nav className={styles.nav}>
          <div className={`${styles.container} ${styles.navContainer}`}>
            <button className={styles.menuButton}>☰</button>
            <ul className={styles.navMenu}>
              <li>
                <Link to="#" className={styles.active}>
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
          <section className={styles.mainSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                차은우님이 꼭 봐야 할 공고
              </h2>
              <Link to="#" className={styles.viewAll}>
                내 조건 정보 입력하기
              </Link>
            </div>

            <div className={styles.cardGrid}>
              {/* 채용 카드 1 */}
              <div className={styles.card}>
                <img
                  src="#"
                  alt="쿠팡 로고"
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
                  <span className={styles.cardTag}>
                    <i>♿</i> 학력무관
                  </span>
                </div>
                <div className={styles.cardBottom}>
                  <div>
                    <span
                      className={`${styles.cardBadge} ${styles.cardBadgeHot}`}
                    >
                      인기공고 주간 TOP100
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
                  src="#"
                  alt="쿠팡 로고"
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
                  <span className={styles.cardTag}>
                    <i>♿</i> 학력무관
                  </span>
                </div>
                <div className={styles.cardBottom}>
                  <div>
                    <span
                      className={`${styles.cardBadge} ${styles.cardBadgeHot}`}
                    >
                      마감임박 스크랩 지원 TOP100
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
                  src="#"
                  alt="SC제일은행 로고"
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
                  <span className={styles.cardTag}>
                    <i>♿</i> 초대졸 ↑
                  </span>
                </div>
                <div className={styles.cardBottom}>
                  <div>
                    <span
                      className={`${styles.cardBadge} ${styles.cardBadgeNew}`}
                    >
                      취업축하금
                    </span>
                  </div>
                  <div>
                    <span>~05.08(목)</span>
                    <button className={styles.likeButton}>♡</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Main;
