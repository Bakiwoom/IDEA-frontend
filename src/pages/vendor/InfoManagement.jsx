import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../assets/css/vendor/InfoManagement.module.css";
import VendorSidebar from "./VendorSidebar";
import CompanyInfoTab from "./tabs/CompanyInfoTab";
import ManagerInfoTab from "./tabs/ManagerInfoTab";
import AccountSettingsTab from "./tabs/AccountSettingsTab";

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

  const [managerInfo, setManagerInfo] = useState({
    name: "홍길동",
    position: "인사팀장",
    phone: "010-9876-5432",
    email: "hong@deartech.co.kr",
    department: "인사팀",
    receiveNotifications: true,
  });

  const [accountInfo, setAccountInfo] = useState({
    userId: "deartech",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    loginEmail: "admin@deartech.co.kr",
  });

  // useEffect 추가 - 컴포넌트 마운트 시 회사 정보 불러오기
  useEffect(() => {
    getCompanyDetail();
  }, []);

  // 메뉴 변경 핸들러
  const handleMenuChange = (menuId) => {
    setActiveMenu(menuId);
  };

  // 탭 변경 핸들러
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // 회사 정보 업데이트 핸들러
  const handleCompanyInfoChange = (field) => (e) => {
    if (field === 'logo' && e.target.files && e.target.files[0]) {
      setCompanyInfo({ ...companyInfo, logoFile: e.target.files[0] });
    } else {
      setCompanyInfo({ ...companyInfo, [field]: e.target.value });
    }
  };

  // 담당자 정보 업데이트 핸들러
  const handleManagerInfoChange = (field) => (e) => {
    if (field === 'receiveNotifications') {
      setManagerInfo({ ...managerInfo, [field]: e.target.checked });
    } else {
      setManagerInfo({ ...managerInfo, [field]: e.target.value });
    }
  };

  // 계정 정보 업데이트 핸들러
  const handleAccountInfoChange = (field) => (e) => {
    setAccountInfo({ ...accountInfo, [field]: e.target.value });
  };

  // 기업 정보 저장 핸들러
  const handleCompanyInfoSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      
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

      if (companyInfo.logoFile) {
        formData.append('logo', companyInfo.logoFile);
      }

      const response = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/api/companies/me/company/save`,
        headers: {
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

  // 회사 정보 가져오기 함수
  const getCompanyDetail = async () => {
    try {
      const response = await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/api/companies/me/company/detail`,
        responseType: "json",
      });
  
      if (response.data.result === "success") {
        const detail = response.data.apiData;
        
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
      }
    } catch (error) {
      console.error("회사 정보 불러오기 실패:", error);
    }
  };

  return (
    <div className={styles.container}>
      <VendorSidebar
        activeMenu={activeMenu}
        handleMenuChange={handleMenuChange}
      />

      <div className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>내 정보 관리</h1>
        </div>

        <div className={styles.tabs}>
          <div
            className={`${styles.tab} ${activeTab === "company-info" ? styles.active : ""}`}
            onClick={() => handleTabChange("company-info")}
          >
            기업 정보
          </div>
          <div
            className={`${styles.tab} ${activeTab === "manager-info" ? styles.active : ""}`}
            onClick={() => handleTabChange("manager-info")}
          >
            담당자 정보
          </div>
          <div
            className={`${styles.tab} ${activeTab === "account-settings" ? styles.active : ""}`}
            onClick={() => handleTabChange("account-settings")}
          >
            계정 설정
          </div>
        </div>

        {activeTab === "company-info" && (
          <CompanyInfoTab
            companyInfo={companyInfo}
            handleChange={handleCompanyInfoChange}
            styles={styles}
          />
        )}

        {activeTab === "manager-info" && (
          <ManagerInfoTab
            managerInfo={managerInfo}
            handleChange={handleManagerInfoChange}
            styles={styles}
          />
        )}

        {activeTab === "account-settings" && (
          <AccountSettingsTab
            accountInfo={accountInfo}
            handleChange={handleAccountInfoChange}
            styles={styles}
          />
        )}

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