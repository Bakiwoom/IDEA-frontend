import React, { useState } from "react";
import styles from "../../assets/css/main/SideNavigation.module.css";
import { Star, Target, Flame, TrendingUp, ArrowUp } from "lucide-react";

const SideNavigation = () => {
  // 활성화된 섹션 상태만 유지
  const [activeSection, setActiveSection] = useState("");

  // 특정 섹션으로 스크롤하는 함수
  const scrollToSection = (id) => {
    // 클릭 시 active 섹션 업데이트
    setActiveSection(id);

    const element = document.getElementById(id);
    if (element) {
      // 헤더 높이를 고려하여 약간 위로 스크롤 (필요에 따라 조정)
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // 맨 위로 스크롤 함수
  const scrollToTop = () => {
    setActiveSection("");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.sideNavContainer}>
      <div className={styles.sideNav}>
        <ul>
          <li>
            <button
              onClick={() => scrollToSection("recommended-jobs")}
              className={`${styles.navItem} ${
                activeSection === "recommended-jobs" ? styles.active : ""
              }`}
            >
              <Star className={styles.icon} size={20} />
              <span className={styles.text}>추천 공고</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("popular-jobs")}
              className={`${styles.navItem} ${
                activeSection === "popular-jobs" ? styles.active : ""
              }`}
            >
              <Flame className={styles.icon} size={20} />
              <span className={styles.text}>인기 공고</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("trending-jobs")}
              className={`${styles.navItem} ${
                activeSection === "trending-jobs" ? styles.active : ""
              }`}
            >
              <TrendingUp className={styles.icon} size={20} />
              <span className={styles.text}>주목받는 공고</span>
            </button>
          </li>
          <li>
            <button onClick={scrollToTop} className={styles.navItem}>
              <ArrowUp className={styles.icon} size={20} />
              <span className={styles.text}>TOP</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideNavigation;
