import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../../assets/css/vendor/InfoManagement.module.css";
import VendorSidebar from "./CompanySidebar";
import CompanyInfoTab from "./tabs/CompanyInfoTab";
import ManagerInfoTab from "./tabs/ManagerInfoTab";
import AccountSettingsTab from "./tabs/AccountSettingsTab";

const InfoManagement = () => {
  const [activeMenu, setActiveMenu] = useState("info-management");
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token'); // JWT 토큰 가져오기

  // URL에서 탭 파라미터 가져오기
  const getTabFromURL = () => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    return tab === 'manager-info' || tab === 'account-settings' ? tab : 'company-info';
  };

  const [activeTab, setActiveTab] = useState(getTabFromURL());

  // 컴포넌트 마운트시 URL에서 탭 정보 가져오기
  useEffect(() => {
    setActiveTab(getTabFromURL());
  }, [location.search]);

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
    name: "",
    position: "",
    phone: "",
    email: "",
    department: "",
    // receiveNotifications: true,
  });

  const [accountInfo, setAccountInfo] = useState({
    userId: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 회사 정보 가져오기 함수
  const getCompanyDetail = useCallback(async () => {
    try {
      const response = await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/api/companies/me/company/detail`,
        responseType: "json",
        headers: {
          Authorization: `Bearer ${token}`
        }
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
      if (error.response?.status === 404) {
        // 회사 정보가 없는 경우 (신규 회원)
        console.log("회사 정보가 없습니다. 새로 등록해주세요.");
      }
    }
  }, []);

  // 담당자 정보 가져오기 함수
  const getManagerDetail = useCallback(async () => {
    try {
      const response = await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/api/companies/me/manager/detail`,
        responseType: "json",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.result === "success") {
        const detail = response.data.apiData;

        setManagerInfo({
          name: detail.name || "",
          position: detail.position || "",
          phone: detail.phone || "",
          email: detail.email || "",
          department: detail.department || "",
          // receiveNotifications: detail.receiveNotifications !== undefined 
          //   ? detail.receiveNotifications 
          //   : true, // 기본값으로 true 설정
        });
      }
    } catch (error) {
      console.error("담당자 정보 불러오기 실패:", error);
      if (error.response?.status === 404) {
        // 담당자 정보가 없는 경우 (신규 정보)
        console.log("담당자 정보가 없습니다. 새로 등록해주세요.");
        // 기본값으로 초기화
        setManagerInfo({
          name: "",
          position: "",
          phone: "",
          email: "",
          department: "",
          // receiveNotifications: true,
        });
      }
    }
  }, []);

  // 계정 정보 가져오기 함수
  const getAccountDetail = useCallback(async () => {
    console.log("계정 정보 가져오기 함수 호출됨");

    try {
      console.log("API 요청 시작: /api/companies/me/account/detail");

      const response = await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/api/companies/me/account/detail`,
        responseType: "json",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("API 응답 전체:", response);

      if (response.data.result === "success") {
        const detail = response.data.apiData;
        console.log("계정 정보 응답 데이터:", detail);

        setAccountInfo(prevState => {
          const newState = {
            ...prevState,
            userId: detail.userId || detail.id || "",
            loginEmail: detail.email || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
          };
          console.log("상태 업데이트:", newState);
          return newState;
        });
      } else {
        console.error("계정 정보 API 응답 실패:", response.data);
      }
    } catch (error) {
      console.error("계정 정보 불러오기 실패:", error);
      // 기본값 유지
    }
  }, []);

  // useEffect 추가 - 컴포넌트 마운트 시 회사 정보와 담당자 정보 불러오기
  useEffect(() => {
    getCompanyDetail();
    getManagerDetail();
    getAccountDetail(); // 계정 정보 불러오기 추가
  }, [getCompanyDetail, getManagerDetail, getAccountDetail]);

  // 메뉴 변경 핸들러
  const handleMenuChange = (menuId) => {
    setActiveMenu(menuId);
  };

  // 탭 변경 핸들러
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // URL 업데이트하여 탭 정보 유지
    navigate(`?tab=${tabId}`, { replace: true });
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
  // const handleManagerInfoChange = (field) => (e) => {
  //   if (field === 'receiveNotifications') {
  //     setManagerInfo({ ...managerInfo, [field]: e.target.checked });
  //   } else {
  //     setManagerInfo({ ...managerInfo, [field]: e.target.value });
  //   }
  // };

  // 담당자 정보 업데이트 핸들러
  const handleManagerInfoChange = (field) => (e) => {
    // receiveNotifications 관련 코드 제거
    setManagerInfo({ ...managerInfo, [field]: e.target.value });
  };

  // 계정 정보 업데이트 핸들러
  const handleAccountInfoChange = (field) => (e) => {
    setAccountInfo({ ...accountInfo, [field]: e.target.value });
  };

  // 기업 정보 수정 핸들러 (수정)
  const handleCompanyInfoSubmit = async (e) => {
    e.preventDefault();

    try {

      // 필수 항목 검증
      if (!companyInfo.name || !companyInfo.businessNumber || !companyInfo.businessType ||
        !companyInfo.size || !companyInfo.foundingYear || !companyInfo.employeeCount ||
        !companyInfo.address || !companyInfo.phone || !companyInfo.email) {
        alert("필수 항목을 모두 입력해주세요.");
        return;
      }

      // 이메일 형식 검사
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(companyInfo.email)) {
        alert("유효한 이메일 주소를 입력해주세요.");
        return;
      }

      // 전화번호 형식 검사
      const phoneRegex = /^[0-9-]+$/;
      if (!phoneRegex.test(companyInfo.phone)) {
        alert("유효한 전화번호를 입력해주세요.");
        return;
      }

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
      formData.append('website', companyInfo.website || '');
      formData.append('intro', companyInfo.intro || '');

      if (companyInfo.logoFile) {
        formData.append('logo', companyInfo.logoFile);
      }

      const response = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/api/companies/me/company/update`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      });

      if (response.data.result === "success") {
        alert("기업 정보가 수정되었습니다.");
        // 수정 후 다시 정보 불러오기
        getCompanyDetail();
      } else {
        alert("기업 정보 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("기업 정보 수정 실패:", error);
      if (error.response?.status === 404) {
        alert("회사 정보가 존재하지 않습니다. 먼저 등록해주세요.");
      } else {
        alert("기업 정보 수정 중 오류가 발생했습니다.");
      }
    }
  };

  // 담당자 정보 수정 핸들러
  const handleManagerInfoSubmit = async (e) => {
    e.preventDefault();

    try {
      // 담당자 정보의 유효성 검사
      if (!managerInfo.name || !managerInfo.position || !managerInfo.phone || !managerInfo.email) {
        alert("필수 항목을 모두 입력해주세요.");
        return;
      }

      // 이메일 형식 검사
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(managerInfo.email)) {
        alert("유효한 이메일 주소를 입력해주세요.");
        return;
      }

      // 전화번호 형식 검사 (간단한 예시)
      const phoneRegex = /^[0-9-]+$/;
      if (!phoneRegex.test(managerInfo.phone)) {
        alert("유효한 전화번호를 입력해주세요.");
        return;
      }

      const response = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/api/companies/me/manager/update`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          name: managerInfo.name,
          position: managerInfo.position,
          phone: managerInfo.phone,
          email: managerInfo.email,
          department: managerInfo.department || '',
        }
      });

      if (response.data.result === "success") {
        alert("담당자 정보가 성공적으로 저장되었습니다.");
        // 수정 후 다시 정보 불러오기
        getManagerDetail();
      } else {
        alert("담당자 정보 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("담당자 정보 처리 실패:", error);
      alert("담당자 정보 처리 중 오류가 발생했습니다.");
    }
  };

  // 계정 정보 수정 핸들러 - 수정됨
  const handleAccountSettingsSubmit = async (e) => {
    e.preventDefault();

    try {
      // 현재 비밀번호와 새 비밀번호 확인
      if (!accountInfo.currentPassword) {
        alert("현재 비밀번호를 입력해주세요.");
        return;
      }

      if (!accountInfo.newPassword) {
        alert("새 비밀번호를 입력해주세요.");
        return;
      }

      // 비밀번호 형식 검사
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      if (!passwordRegex.test(accountInfo.newPassword)) {
        alert("비밀번호는 영문, 숫자, 특수문자 조합 8자 이상이어야 합니다.");
        return;
      }

      // 비밀번호 일치 확인
      if (accountInfo.newPassword !== accountInfo.confirmPassword) {
        alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
        return;
      }

      console.log("비밀번호 변경 요청 전송:", {
        currentPassword: accountInfo.currentPassword,
        newPassword: accountInfo.newPassword
      });

      const response = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/api/companies/me/account/password`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          currentPassword: accountInfo.currentPassword,
          newPassword: accountInfo.newPassword
        }
      });

      console.log("비밀번호 변경 응답:", response.data);

      if (response.data.result === "success") {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        // 입력 필드 초기화
        setAccountInfo(prevState => ({
          ...prevState,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
      } else {
        // 서버에서 보낸 메시지 표시
        alert(response.data.message || "비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("계정 설정 업데이트 실패:", error);

      // 오류 응답 상세 로깅
      if (error.response) {
        console.error("에러 응답 데이터:", error.response.data);
        console.error("에러 상태:", error.response.status);

        // 401 오류 처리 - 비밀번호 불일치
        if (error.response.status === 401) {
          alert("현재 비밀번호가 일치하지 않습니다.");
        } else if (error.response.data && error.response.data.message) {
          // 서버에서 보낸 에러 메시지가 있으면 표시
          alert(error.response.data.message);
        } else {
          alert("계정 설정 업데이트 중 오류가 발생했습니다.");
        }
      } else {
        alert("계정 설정 업데이트 중 오류가 발생했습니다.");
      }
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "company-info") {
      handleCompanyInfoSubmit(e);
    } else if (activeTab === "manager-info") {
      handleManagerInfoSubmit(e);
    } else if (activeTab === "account-settings") {
      handleAccountSettingsSubmit(e);
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
          <button
            className={styles.buttonSecondary}
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <button
            className={styles.actionButton}
            onClick={handleSubmit}
          >
            {activeTab === "company-info"
              ? "기업 정보 수정"
              : activeTab === "manager-info"
                ? "담당자 정보 저장"
                : "변경사항 저장"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoManagement;