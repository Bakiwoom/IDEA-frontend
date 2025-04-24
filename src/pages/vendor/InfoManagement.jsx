import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../assets/css/vendor/InfoManagement.module.css";
import VendorSidebar from "./VendorSidebar";

const InfoManagement = () => {
  const [activeMenu, setActiveMenu] = useState("info-management");
  const [activeTab, setActiveTab] = useState("company-info");

  const [companyInfo, setCompanyInfo] = useState({
    name: "(주)디어테크",
    businessNumber: "123-45-67890",
    businessType: "정보통신업",
    size: "중견기업",
    foundingYear: "2020",
    employeeCount: "350",
    address: "서울시 강남구 테헤란로 123, 7층",
    phone: "02-1234-5678",
    email: "contact@deartech.co.kr",
    website: "https://www.deartech.co.kr",
    logo: null,
    intro:
      "(주)디어테크는 AI 기술을 활용하여 사회적 가치를 창출하는 기업입니다. 장애인 고용 및 복지 향상을 위한 혁신적인 서비스를 개발하고 있습니다.",
  });

  const [managerInfo, setManagerInfo] = useState({
    name: "홍길동",
    position: "인사팀장",
    phone: "010-9876-5432",
    email: "hong@deartech.co.kr",
    department: "인사팀",
    receiveNotifications: true,
  });

  const [employmentInfo, setEmploymentInfo] = useState({
    currentEmployed: 8,
    requiredEmployed: 10,
    employmentRate: "2.29%",
    shortage: 2,
    fulltime: 5,
    contract: 3,
    parttime: 0,
    physical: 3,
    visual: 1,
    hearing: 2,
    intellectual: 1,
    mental: 0,
    developmental: 1,
    benefits: {
      incentive: true,
      taxCredit: true,
      facility: false,
      jobCoach: false,
      support: false,
      commuting: false,
    },
    preferredBenefit: "tax",
  });

  const [accountInfo, setAccountInfo] = useState({
    userId: "deartech",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    loginEmail: "admin@deartech.co.kr",
  });

  // 메뉴 변경 핸들러
  const handleMenuChange = (menuId) => {
    setActiveMenu(menuId);
  };

  // 탭 변경 핸들러
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // 회사 정보 업데이트 핸들러
  const handleCompanyInfoChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "company-logo" && files && files[0]) {
      setCompanyInfo({ ...companyInfo, logo: files[0] });
    } else {
      const fieldName = id.replace("company-", "").replace("-", "");
      setCompanyInfo({ ...companyInfo, [fieldName]: value });
    }
  };

  // 담당자 정보 업데이트 핸들러
  const handleManagerInfoChange = (e) => {
    const { id, value, checked, type } = e.target;
    const fieldName = id.replace("manager-", "");
    if (type === "checkbox") {
      setManagerInfo({ ...managerInfo, [fieldName]: checked });
    } else {
      setManagerInfo({ ...managerInfo, [fieldName]: value });
    }
  };

  // 고용 정보 업데이트 핸들러
  const handleEmploymentInfoChange = (e) => {
    const { id, value, checked, type } = e.target;

    if (type === "checkbox") {
      setEmploymentInfo({
        ...employmentInfo,
        benefits: {
          ...employmentInfo.benefits,
          [id]: checked,
        },
      });
    } else {
      const fieldName = id.replace("disabled-", "").replace("-count", "");
      setEmploymentInfo({
        ...employmentInfo,
        [fieldName]: type === "number" ? parseInt(value) : value,
      });
    }
  };

  // 계정 정보 업데이트 핸들러
  const handleAccountInfoChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id.replace("-password", "Password").replace("login-", "");
    setAccountInfo({ ...accountInfo, [fieldName]: value });
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 데이터 저장 로직 추가
    alert("변경사항이 저장되었습니다.");
  };

  return (
    <div className={styles.container}>
      {/* 사이드바 컴포넌트 사용 */}
      <VendorSidebar
        activeMenu={activeMenu}
        handleMenuChange={handleMenuChange}
      />

      {/* 메인 콘텐츠 */}
      <div className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>내 정보 관리</h1>
          {/* <button className={styles.actionButton} onClick={handleSubmit}>
            저장
          </button> */}
        </div>

        {/* 정보 완성도 표시 */}
        {/* <div className={styles.completionStatus}>
          <div className={styles.completionBar}>
            <div className={styles.completionProgress}></div>
          </div>
          <div className={styles.completionText}>
            프로필 완성도: <strong>65%</strong> | 인증 상태:
            <span className={`${styles.statusBadge} ${styles.statusVerified}`}>
              인증 완료
            </span>
          </div>
        </div> */}

        {/* 탭 네비게이션 */}
        <div className={styles.tabs}>
          <div
            className={`${styles.tab} ${
              activeTab === "company-info" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("company-info")}
          >
            기업 정보
          </div>
          <div
            className={`${styles.tab} ${
              activeTab === "manager-info" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("manager-info")}
          >
            담당자 정보
          </div>
          {/* <div
            className={`${styles.tab} ${
              activeTab === "employment-status" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("employment-status")}
          >
            장애인 고용 현황
          </div> */}
          <div
            className={`${styles.tab} ${
              activeTab === "account-settings" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("account-settings")}
          >
            계정 설정
          </div>
        </div>

        {/* 기업 정보 탭 */}
        <div
          className={`${styles.tabContent} ${
            activeTab === "company-info" ? styles.active : ""
          }`}
          id="company-info"
        >
          <div className={styles.infoBox}>
            기업 정보를 상세히 입력할수록 더 정확한 맞춤형 혜택 리포트를
            받아보실 수 있습니다.
            <strong>*</strong> 표시는 필수 입력 항목입니다.
          </div>

          {/* 기본 정보 섹션 */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>기본 정보</h2>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="company-name">
                  기업명 <span className={styles.requiredMark}>*</span>
                </label>
                <input
                  type="text"
                  id="company-name"
                  value={companyInfo.name}
                  onChange={handleCompanyInfoChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="business-number">사업자등록번호</label>
                <input
                  type="text"
                  id="business-number"
                  value={companyInfo.businessNumber}
                  disabled
                />
                <span
                  className={`${styles.statusBadge} ${styles.statusVerified}`}
                >
                  인증완료
                </span>
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="business-type">
                  업종 <span className={styles.requiredMark}>*</span>
                </label>
                <select
                  id="business-type"
                  value={companyInfo.businessType}
                  onChange={handleCompanyInfoChange}
                >
                  <option>선택하세요</option>
                  <option value="제조업">제조업</option>
                  <option value="정보통신업">정보통신업</option>
                  <option value="서비스업">서비스업</option>
                  <option value="건설업">건설업</option>
                  <option value="금융보험업">금융보험업</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="company-size">
                  기업 규모 <span className={styles.requiredMark}>*</span>
                </label>
                <select
                  id="company-size"
                  value={companyInfo.size}
                  onChange={handleCompanyInfoChange}
                >
                  <option>선택하세요</option>
                  <option value="소기업">소기업</option>
                  <option value="중기업">중기업</option>
                  <option value="중견기업">중견기업</option>
                  <option value="대기업">대기업</option>
                </select>
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="founding-year">설립년도</label>
                <input
                  type="text"
                  id="founding-year"
                  value={companyInfo.foundingYear}
                  onChange={handleCompanyInfoChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="employee-count">
                  임직원 수 <span className={styles.requiredMark}>*</span>
                </label>
                <input
                  type="number"
                  id="employee-count"
                  value={companyInfo.employeeCount}
                  onChange={handleCompanyInfoChange}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="company-address">
                주소 <span className={styles.requiredMark}>*</span>
              </label>
              <input
                type="text"
                id="company-address"
                value={companyInfo.address}
                onChange={handleCompanyInfoChange}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="company-phone">
                  대표 연락처 <span className={styles.requiredMark}>*</span>
                </label>
                <input
                  type="text"
                  id="company-phone"
                  value={companyInfo.phone}
                  onChange={handleCompanyInfoChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="company-email">
                  대표 이메일 <span className={styles.requiredMark}>*</span>
                </label>
                <input
                  type="email"
                  id="company-email"
                  value={companyInfo.email}
                  onChange={handleCompanyInfoChange}
                />
              </div>
            </div>
          </div>

          {/* 추가 정보 섹션 */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>추가 정보</h2>
            <div className={styles.formGroup}>
              <label htmlFor="company-website">회사 웹사이트</label>
              <input
                type="url"
                id="company-website"
                value={companyInfo.website}
                onChange={handleCompanyInfoChange}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="company-logo">회사 로고</label>
                <input
                  type="file"
                  id="company-logo"
                  onChange={handleCompanyInfoChange}
                />
                <div className={styles.inputHelp}>
                  JPG, PNG 파일만 가능 (최대 2MB)
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>현재 로고</label>
                <div className={styles.logoPreview}>
                  <span>로고 없음</span>
                </div>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="company-intro">회사 소개</label>
              <textarea
                id="company-intro"
                rows="4"
                value={companyInfo.intro}
                onChange={handleCompanyInfoChange}
              ></textarea>
            </div>
          </div>
        </div>

        {/* 담당자 정보 탭 */}
        <div
          className={`${styles.tabContent} ${
            activeTab === "manager-info" ? styles.active : ""
          }`}
          id="manager-info"
        >
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>담당자 정보</h2>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="manager-name">
                  담당자 이름 <span className={styles.requiredMark}>*</span>
                </label>
                <input
                  type="text"
                  id="manager-name"
                  value={managerInfo.name}
                  onChange={handleManagerInfoChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="manager-position">
                  직책 <span className={styles.requiredMark}>*</span>
                </label>
                <input
                  type="text"
                  id="manager-position"
                  value={managerInfo.position}
                  onChange={handleManagerInfoChange}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="manager-phone">
                  연락처 <span className={styles.requiredMark}>*</span>
                </label>
                <input
                  type="text"
                  id="manager-phone"
                  value={managerInfo.phone}
                  onChange={handleManagerInfoChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="manager-email">
                  이메일 <span className={styles.requiredMark}>*</span>
                </label>
                <input
                  type="email"
                  id="manager-email"
                  value={managerInfo.email}
                  onChange={handleManagerInfoChange}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="manager-department">부서</label>
              <input
                type="text"
                id="manager-department"
                value={managerInfo.department}
                onChange={handleManagerInfoChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={managerInfo.receiveNotifications}
                  onChange={(e) =>
                    setManagerInfo({
                      ...managerInfo,
                      receiveNotifications: e.target.checked,
                    })
                  }
                  style={{ width: "auto", marginRight: "8px" }}
                />
                담당자 정보로 알림 수신 (이메일, SMS)
              </label>
            </div>
          </div>
        </div>

        {/* 장애인 고용 현황 탭
        <div
          className={`${styles.tabContent} ${
            activeTab === "employment-status" ? styles.active : ""
          }`}
          id="employment-status"
        >
          <div className={styles.infoBox}>
            장애인 고용 현황 정보는 더 정확한 혜택 분석에 활용됩니다. 정확한
            정보를 입력할수록 맞춤형 혜택 정보를 받아보실 수 있습니다.
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>장애인 고용 현황</h2>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="disabled-employee-count">
                  현재 장애인 고용 인원{" "}
                  <span className={styles.requiredMark}>*</span>
                </label>
                <input
                  type="number"
                  id="disabled-employee-count"
                  value={employmentInfo.currentEmployed}
                  onChange={handleEmploymentInfoChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="mandatory-count">의무 고용 인원</label>
                <input
                  type="number"
                  id="mandatory-count"
                  value={employmentInfo.requiredEmployed}
                  disabled
                />
                <div className={styles.inputHelp}>
                  전체 임직원 수 기준으로 자동 계산됩니다 (3.1%)
                </div>
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="employment-rate">장애인 고용률</label>
                <input
                  type="text"
                  id="employment-rate"
                  value={employmentInfo.employmentRate}
                  disabled
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="shortage">미달 인원</label>
                <input
                  type="number"
                  id="shortage"
                  value={employmentInfo.shortage}
                  disabled
                />
              </div>
            </div>

            <h3 className={styles.subSectionTitle}>고용 유형별 현황</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="fulltime-count">정규직</label>
                <input
                  type="number"
                  id="fulltime-count"
                  value={employmentInfo.fulltime}
                  onChange={handleEmploymentInfoChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="contract-count">계약직</label>
                <input
                  type="number"
                  id="contract-count"
                  value={employmentInfo.contract}
                  onChange={handleEmploymentInfoChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="parttime-count">시간제</label>
                <input
                  type="number"
                  id="parttime-count"
                  value={employmentInfo.parttime}
                  onChange={handleEmploymentInfoChange}
                />
              </div>
            </div>

            <h3 className={styles.subSectionTitle}>장애 유형별 현황</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="physical-count">지체장애</label>
                <input
                  type="number"
                  id="physical-count"
                  value={employmentInfo.physical}
                  onChange={handleEmploymentInfoChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="visual-count">시각장애</label>
                <input
                  type="number"
                  id="visual-count"
                  value={employmentInfo.visual}
                  onChange={handleEmploymentInfoChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="hearing-count">청각장애</label>
                <input
                  type="number"
                  id="hearing-count"
                  value={employmentInfo.hearing}
                  onChange={handleEmploymentInfoChange}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="intellectual-count">지적장애</label>
                <input
                  type="number"
                  id="intellectual-count"
                  value={employmentInfo.intellectual}
                  onChange={handleEmploymentInfoChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="mental-count">정신장애</label>
                <input
                  type="number"
                  id="mental-count"
                  value={employmentInfo.mental}
                  onChange={handleEmploymentInfoChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="developmental-count">발달장애</label>
                <input
                  type="number"
                  id="developmental-count"
                  value={employmentInfo.developmental}
                  onChange={handleEmploymentInfoChange}
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>혜택 현황</h2>
            <div className={styles.formGroup}>
              <label>현재 받고 있는 장애인 고용 관련 혜택</label>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    id="incentive"
                    checked={employmentInfo.benefits.incentive}
                    onChange={handleEmploymentInfoChange}
                    style={{ width: "auto", marginRight: "8px" }}
                  />
                  고용장려금
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    id="taxCredit"
                    checked={employmentInfo.benefits.taxCredit}
                    onChange={handleEmploymentInfoChange}
                    style={{ width: "auto", marginRight: "8px" }}
                  />
                  장애인 고용 세액공제
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    id="facility"
                    checked={employmentInfo.benefits.facility}
                    onChange={handleEmploymentInfoChange}
                    style={{ width: "auto", marginRight: "8px" }}
                  />
                  편의시설 지원금
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    id="jobCoach"
                    checked={employmentInfo.benefits.jobCoach}
                    onChange={handleEmploymentInfoChange}
                    style={{ width: "auto", marginRight: "8px" }}
                  />
                  직무지도원 지원
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    id="support"
                    checked={employmentInfo.benefits.support}
                    onChange={handleEmploymentInfoChange}
                    style={{ width: "auto", marginRight: "8px" }}
                  />
                  근로지원인 지원
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    id="commuting"
                    checked={employmentInfo.benefits.commuting}
                    onChange={handleEmploymentInfoChange}
                    style={{ width: "auto", marginRight: "8px" }}
                  />
                  통근 지원
                </label>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="preferred-benefit">
                우선적으로 받고 싶은 혜택
              </label>
              <select
                id="preferred-benefit"
                value={employmentInfo.preferredBenefit}
                onChange={handleEmploymentInfoChange}
              >
                <option value="">선택하세요</option>
                <option value="tax">세액공제/세금감면</option>
                <option value="subsidy">인건비 지원</option>
                <option value="facility">시설/장비 지원</option>
                <option value="training">직무훈련 지원</option>
                <option value="support">근로지원인/직무지도원</option>
                <option value="consulting">컨설팅 지원</option>
              </select>
            </div>
          </div>
        </div> */}

        {/* 계정 설정 탭 */}
        <div
          className={`${styles.tabContent} ${
            activeTab === "account-settings" ? styles.active : ""
          }`}
          id="account-settings"
        >
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>계정 정보</h2>
            <div className={styles.formGroup}>
              <label htmlFor="user-id">아이디</label>
              <input
                type="text"
                id="user-id"
                value={accountInfo.userId}
                disabled
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="current-password">현재 비밀번호</label>
                <input
                  type="password"
                  id="current-password"
                  placeholder="현재 비밀번호 입력"
                  value={accountInfo.currentPassword}
                  onChange={handleAccountInfoChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="new-password">새 비밀번호</label>
                <input
                  type="password"
                  id="new-password"
                  placeholder="새 비밀번호 입력"
                  value={accountInfo.newPassword}
                  onChange={handleAccountInfoChange}
                />
                <div className={styles.inputHelp}>
                  영문, 숫자, 특수문자 조합 8자 이상
                </div>
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="confirm-password">새 비밀번호 확인</label>
                <input
                  type="password"
                  id="confirm-password"
                  placeholder="새 비밀번호 재입력"
                  value={accountInfo.confirmPassword}
                  onChange={handleAccountInfoChange}
                />
              </div>
              <div
                className={styles.formGroup}
                style={{ display: "flex", alignItems: "flex-end" }}
              >
                <button className={styles.actionButton}>비밀번호 변경</button>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>계정 관리</h2>
            <div className={styles.formGroup}>
              <label htmlFor="login-email">로그인 이메일 변경</label>
              <input
                type="email"
                id="login-email"
                value={accountInfo.loginEmail}
                onChange={handleAccountInfoChange}
              />
              <div className={styles.inputHelp}>
                계정 관련 알림 및 로그인에 사용됩니다
              </div>
            </div>
            <div className={styles.formGroup}>
              <div className={styles.warningBox}>
                계정 삭제 시 모든 정보가 영구적으로 삭제되며 복구할 수 없습니다.
                진행 중인 채용 공고와 지원자 정보도 모두 삭제됩니다.
              </div>
              <button className={styles.deleteButton}>계정 삭제 요청</button>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className={styles.buttonRow}>
          <button className={styles.buttonSecondary}>취소</button>
          <button className={styles.actionButton} onClick={handleSubmit}>
            변경사항 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoManagement;
