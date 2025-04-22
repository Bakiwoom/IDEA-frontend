import React from "react";
import { Link } from "react-router-dom";
import styles from "../assets/css/layout/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.menu}>
          <Link to="/intro" className={styles.menuItem}>
            회사소개
          </Link>
          <Link to="/terms" className={styles.menuItem}>
            인재채용
          </Link>
          <Link to="/privacy" className={styles.menuItem}>
            회원약관
          </Link>
          <Link to="/privacy" className={styles.menuItem}>
            개인정보처리방침
          </Link>
          <Link to="/email-policy" className={styles.menuItem}>
            이메일무단수집거부
          </Link>
          <Link to="/api" className={styles.menuItem}>
            제휴정보 API
          </Link>
          <Link to="/contact" className={styles.menuItem}>
            제휴문의
          </Link>
          <Link to="/customer" className={styles.menuItem}>
            고객센터
          </Link>
        </div>

        <div className={styles.infoContainer}>
          <div className={styles.logoContainer}>
            <h1 className={styles.logo}>IDEA</h1>
          </div>

          <div className={styles.info}>
            <p className={styles.infoText}>
              사용자 고객센터 02-8282-5959 (평일 09:00~19:00, 주말·공휴일 휴무)
            </p>
            <p className={styles.infoText}>
              이메일 : help@idea.co.kr, Fax : 02-7777-0000(대표),
              02-8888-1111(세금계산서)
            </p>
            <p className={styles.infoText}>
              (주)아이디어, 우 : 01234, 서울특별시 강남구 상상대로 77, 아이디어타워
              11층, 대표 : 임진황
            </p>
            <p className={styles.infoText}>
              사업자등록 : 119-99-00000, 직업정보제공사업 : 서울 관악 제
              2025-1호, 통신판매업 : 제 2025-서울강서-9999호
            </p>
            <p className={styles.infoText}>
              Copyright (c) (주)아이디어. All rights reserved.
            </p>
          </div>

          {/* <div className={styles.buttonsContainer}>
            <Link to="/email-policy" className={styles.emailButton}>
              이메일문의
            </Link>
            <div className={styles.socialButtons}>
              <Link to="#" className={styles.socialButton}>
                B
              </Link>
              <Link to="#" className={styles.socialButton}>
                f
              </Link>
            </div>
            <div className={styles.certificateContainer}>
              <Link to="#" className={styles.certificate}>
                사업자정보확인
              </Link>
              <Link to="#" className={styles.ismsP}>
                <img
                  src="/path/to/isms-p-logo.png"
                  alt="ISMS-P 인증"
                  className={styles.ismsPLogo}
                />
              </Link>
            </div>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
