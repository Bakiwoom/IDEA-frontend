import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../assets/css/vendor/NotificationSettings.module.css";
import VendorSidebar from "./VendorSidebar";

const NotificationSettings = () => {
  const [activeMenu, setActiveMenu] = useState("notification-settings");
  const [notificationSettings, setNotificationSettings] = useState({
    channels: {
      email: true,
      sms: true,
      push: false,
    },
    types: {
      newApplicant: true,
      statusChange: true,
      interview: true,
      deadlineApproaching: true,
      policyUpdate: false,
      reportGenerated: true,
      subsidyDeadline: true,
    },
    timing: {
      interview: "3시간 전",
      deadline: "3일 전",
    },
  });

  // 알림 수신 주소 상태 추가
  const [contactInfo, setContactInfo] = useState({
    email: "hong@deartech.co.kr",
    phone: "010-9876-5432",
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      content: "김장애 님이 웹 개발자 채용에 지원했습니다.",
      date: "2025-04-15 14:30",
      channels: "이메일, SMS",
    },
    {
      id: 2,
      content: "이지원 님 면접이 내일 오후 2시에 예정되어 있습니다.",
      date: "2025-04-14 10:00",
      channels: "이메일, SMS",
    },
    {
      id: 3,
      content: "웹 개발자 채용 공고가 3일 후 마감됩니다.",
      date: "2025-04-12 09:00",
      channels: "이메일",
    },
    {
      id: 4,
      content: "2025년 1분기 장애인 고용 혜택 분석 리포트가 생성되었습니다",
      date: "2025-04-12 09:00",
      channels: "이메일",
    },
    {
      id: 5,
      content: "2025년 1분기 장애인 고용장려금 신청 마감일이 1주일 남았습니다.",
      date: "2025-04-08 09:00",
      channels: "이메일, SMS",
    },
  ]);

  // 메뉴 변경 핸들러
  const handleMenuChange = (menuId) => {
    setActiveMenu(menuId);
    // 메뉴 변경 시 필요한 라우팅 로직 추가 가능
  };

  // 이메일 변경 핸들러
  const handleEmailChange = (e) => {
    setContactInfo({
      ...contactInfo,
      email: e.target.value,
    });
  };

  // 휴대폰 번호 변경 핸들러
  const handlePhoneChange = (e) => {
    setContactInfo({
      ...contactInfo,
      phone: e.target.value,
    });
  };

  return (
    <>
      <div className={styles.container}>
        {/* 사이드바 컴포넌트 사용 */}
        <VendorSidebar
          activeMenu={activeMenu}
          handleMenuChange={handleMenuChange}
        />

        {/* 알림 설정 화면 */}
        <div
          className={`${styles.mainContent} ${styles.screen} ${styles.active}`}
          id="notification-settings"
        >
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>알림 설정</h1>
            {/* <button className={styles.actionButton}>변경사항 저장</button> */}
          </div>

          {/* 탭 메뉴 (선택사항) */}
          {/* <div className={styles.tabs}>
            <div className={`${styles.tab} ${styles.active}`}>알림 채널</div>
            <div className={styles.tab}>알림 유형</div>
            <div className={styles.tab}>알림 내역</div>
          </div> */}

          {/* 정보 안내 */}
          <div className={styles.infoBox}>
            알림 설정을 통해 중요한 정보를 놓치지 않고 받아보세요. '알림
            채널'에서는 알림을 수신할 방법을, '알림 유형'에서는 받고 싶은 알림의
            종류를 설정할 수 있습니다.
          </div>

          {/* 알림 수신 주소 설정 섹션 */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>알림 수신 주소 설정</h2>

            <div className={styles.formGroup}>
              <label htmlFor="email-address">이메일 주소</label>
              <input
                type="email"
                id="email-address"
                value={contactInfo.email}
                onChange={handleEmailChange}
              />
              <div className={styles.inputDescription}>
                알림을 받을 이메일 주소입니다. 담당자 이메일과 다르게 설정할 수
                있습니다.
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone-number">휴대폰 번호</label>
              <input
                type="text"
                id="phone-number"
                value={contactInfo.phone}
                onChange={handlePhoneChange}
              />
              <div className={styles.inputDescription}>
                SMS 알림을 받을 휴대폰 번호입니다.
              </div>
            </div>
          </div>

          {/* 최근 알림 내역 */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>최근 알림 내역</h2>
            <div className={styles.tableContainer}>
              <table className={styles.notificationTable}>
                <thead>
                  <tr>
                    <th>알림 내용</th>
                    <th>날짜/시간</th>
                    <th>채널</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => (
                    <tr key={notification.id}>
                      <td>{notification.content}</td>
                      <td>{notification.date}</td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            notification.channels.includes("SMS")
                              ? styles.statusBoth
                              : styles.statusEmail
                          }`}
                        >
                          {notification.channels}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.buttonCenter}>
              <button className={styles.buttonSecondary}>
                모든 알림 내역 보기
              </button>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className={styles.buttonRow}>
            <button className={styles.buttonSecondary}>취소</button>
            <button className={styles.actionButton}>변경사항 저장</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationSettings;
