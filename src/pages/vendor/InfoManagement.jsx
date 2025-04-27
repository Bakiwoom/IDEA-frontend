import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../assets/css/vendor/InfoManagement.module.css";
import VendorSidebar from "./VendorSidebar";

const InfoManagement = () => {
  const [activeMenu, setActiveMenu] = useState("info-management");
  const [activeTab, setActiveTab] = useState("company-info");
  const navigate = useNavigate();
  //const token = localStorage.getItem('token'); // JWT 토큰 가져오기

  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    businessNumber: "",
    businessType: "",
    size: "",
    foundingYear: "",
    employeeCount: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    logo: null,
    intro: "",
  });

  // useEffect 추가 - 컴포넌트 마운트 시 회사 정보 불러오기
  useEffect(() => {
    getCompanyDetail();
  }, []);

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

  // 회사 정보 업데이트 핸들러 (커리 함수 방식)
  const handleCompanyInfoChange = (field) => (e) => {
    if (field === 'logo' && e.target.files && e.target.files[0]) {
      setCompanyInfo({ ...companyInfo, logoFile: e.target.files[0] });
    } else {
      setCompanyInfo({ ...companyInfo, [field]: e.target.value });
    }
  };

  // 담당자 정보 업데이트 핸들러 (커리 함수 방식)
  const handleManagerInfoChange = (field) => (e) => {
    if (field === 'receiveNotifications') {
      setManagerInfo({ ...managerInfo, [field]: e.target.checked });
    } else {
      setManagerInfo({ ...managerInfo, [field]: e.target.value });
    }
  };

  // 계정 정보 업데이트 핸들러 (커리 함수 방식)
  const handleAccountInfoChange = (field) => (e) => {
    setAccountInfo({ ...accountInfo, [field]: e.target.value });
  };

  // 기업 정보 저장 핸들러
  const handleCompanyInfoSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // 기업 정보 데이터 추가
      formData.append('name', companyInfo.name);
      formData.append('businessNumber', companyInfo.businessNumber);
      formData.append('businessType', companyInfo.businessType);
      formData.append('size', companyInfo.size);
      formData.append('foundingYear', companyInfo.foundingYear);
      formData.append('employeeCount', companyInfo.employeeCount);
      formData.append('address', companyInfo.address);
      formData.append('phone', companyInfo.phone);
      formData.append('email', companyInfo.email);
      formData.append('website', companyInfo.website);
      formData.append('intro', companyInfo.intro);

      console.log("=== FormData 내용 확인 ===");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // 로고 파일이 있는 경우에만 추가
      if (companyInfo.logoFile) {
        formData.append('logo', companyInfo.logoFile);
      }

      const response = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/api/companies/me/company/save`,
        headers: {
          //Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      });

      if (response.data.result === "success") {
        alert("기업 정보가 저장되었습니다.");
      } else {
        alert("기업 정보 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("기업 정보 저장 실패:", error);
      alert("기업 정보 저장 중 오류가 발생했습니다.");
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "company-info") {
      handleCompanyInfoSubmit(e);
    } else {
      alert("해당 기능은 아직 구현되지 않았습니다.");
    }
  };

  // 회사 정보 가져오기 함수 수정
  const getCompanyDetail = async () => {
    //const token = localStorage.getItem("token");
    
    try {
      const response = await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/api/companies/me/company/detail`,
        responseType: "json",
        // headers: {
        //   Authorization: `Bearer ${token}`
        // }
      });
  
      if (response.data.result === "success") {
        const detail = response.data.apiData;
        
        console.log(detail); // 데이터 확인 로그
        
        // 회사 정보 설정 - null 값은 빈 문자열로 처리
        setCompanyInfo({
          name: detail.name || "",
          businessNumber: detail.businessNumber || "",
          businessType: detail.businessType || "",
          size: detail.size || "",
          foundingYear: detail.foundingYear || "",
          employeeCount: detail.employeeCount || "",
          address: detail.address || "",
          phone: detail.phone || "",
          email: detail.email || "",
          website: detail.website || "",
          logo: detail.logo || null,
          intro: detail.intro || "",
        });
        
      } else {
        console.log("회사 정보를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("회사 정보 불러오기 실패:", error);
      // 오류 발생 시 조용히 처리 (필요한 경우 에러 상태를 설정할 수 있음)
    }
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
        </div>

        {/* 탭 네비게이션 */}
        <div className={styles.tabs}>
          <div
            className={`${styles.tab} ${activeTab === "company-info" ? styles.active : ""
              }`}
            onClick={() => handleTabChange("company-info")}
          >
            기업 정보
          </div>
          <div
            className={`${styles.tab} ${activeTab === "manager-info" ? styles.active : ""
              }`}
            onClick={() => handleTabChange("manager-info")}
          >
            담당자 정보
          </div>

          <div
            className={`${styles.tab} ${activeTab === "account-settings" ? styles.active : ""
              }`}
            onClick={() => handleTabChange("account-settings")}
          >
            계정 설정
          </div>
        </div>

        {/* 기업 정보 탭 */}
        <div
          className={`${styles.tabContent} ${activeTab === "company-info" ? styles.active : ""
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
                  onChange={handleCompanyInfoChange('name')}
                  placeholder="기업명을 입력하세요"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="business-number">사업자등록번호</label>
                <input
                  type="text"
                  id="business-number"
                  value={companyInfo.businessNumber}
                  onChange={handleCompanyInfoChange('businessNumber')}
                  placeholder="사업자등록번호를 입력하세요"
                />
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
                  onChange={handleCompanyInfoChange('businessType')}
                >
                  <option value="">선택하세요</option>
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
                  onChange={handleCompanyInfoChange('size')}
                >
                  <option value="">선택하세요</option>
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
                  onChange={handleCompanyInfoChange('foundingYear')}
                  placeholder="설립년도를 입력하세요"
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
                  onChange={handleCompanyInfoChange('employeeCount')}
                  placeholder="임직원 수를 입력하세요"
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
                onChange={handleCompanyInfoChange('address')}
                placeholder="회사 주소를 입력하세요"
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
                  onChange={handleCompanyInfoChange('phone')}
                  placeholder="대표 연락처를 입력하세요"
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
                  onChange={handleCompanyInfoChange('email')}
                  placeholder="대표 이메일을 입력하세요"
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
                onChange={handleCompanyInfoChange('website')}
                placeholder="회사 웹사이트 URL을 입력하세요"
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="company-logo">회사 로고</label>
                <input
                  type="file"
                  id="company-logo"
                  onChange={handleCompanyInfoChange('logo')}
                />
                <div className={styles.inputHelp}>
                  JPG, PNG 파일만 가능 (최대 2MB)
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>현재 로고</label>
                <div className={styles.logoPreview}>
                  {companyInfo.logo && typeof companyInfo.logo === 'string' ? (
                    <img 
                      src={companyInfo.logo} 
                      alt="회사 로고" 
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '100px', 
                        objectFit: 'contain' 
                      }} 
                    />
                  ) : (
                    <span>로고 없음</span>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="company-intro">회사 소개</label>
              <textarea
                id="company-intro"
                rows="4"
                value={companyInfo.intro}
                onChange={handleCompanyInfoChange('intro')}
                placeholder="회사 소개를 입력하세요"
              ></textarea>
            </div>
          </div>
        </div>

        {/* 담당자 정보 탭 */}
        <div
          className={`${styles.tabContent} ${activeTab === "manager-info" ? styles.active : ""
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
                  onChange={handleManagerInfoChange('name')}
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
                  onChange={handleManagerInfoChange('position')}
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
                  onChange={handleManagerInfoChange('phone')}
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
                  onChange={handleManagerInfoChange('email')}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="manager-department">부서</label>
              <input
                type="text"
                id="manager-department"
                value={managerInfo.department}
                onChange={handleManagerInfoChange('department')}
              />
            </div>
            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={managerInfo.receiveNotifications}
                  onChange={handleManagerInfoChange('receiveNotifications')}
                  style={{ width: "auto", marginRight: "8px" }}
                />
                담당자 정보로 알림 수신 (이메일, SMS)
              </label>
            </div>
          </div>
        </div>

        {/* 계정 설정 탭 */}
        <div
          className={`${styles.tabContent} ${activeTab === "account-settings" ? styles.active : ""
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
                  onChange={handleAccountInfoChange('currentPassword')}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="new-password">새 비밀번호</label>
                <input
                  type="password"
                  id="new-password"
                  placeholder="새 비밀번호 입력"
                  value={accountInfo.newPassword}
                  onChange={handleAccountInfoChange('newPassword')}
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
                  onChange={handleAccountInfoChange('confirmPassword')}
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
                onChange={handleAccountInfoChange('loginEmail')}
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