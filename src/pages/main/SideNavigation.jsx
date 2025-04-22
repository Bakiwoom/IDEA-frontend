import React, { useEffect, useState } from "react";
import styles from "../../assets/css/main/SideNavigation.module.css";
import { Star, Target, Flame, TrendingUp, ArrowUp } from "lucide-react";

const SideNavigation = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  // 스크롤 위치 감지
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 특정 섹션으로 스크롤하는 함수
  const scrollToSection = (id) => {
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
              className={styles.navItem}
            >
              <Star className={styles.icon} size={20} />
              <span className={styles.text}>추천 공고</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("popular-jobs")}
              className={styles.navItem}
            >
              <Flame className={styles.icon} size={20} />
              <span className={styles.text}>인기 공고</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("trending-jobs")}
              className={styles.navItem}
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
