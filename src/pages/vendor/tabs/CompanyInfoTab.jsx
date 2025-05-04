import React from "react";

const CompanyInfoTab = ({ companyInfo, handleChange, styles }) => {
  return (
    <div className={`${styles.tabContent} ${styles.active}`}>
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
              onChange={handleChange('name')}
              placeholder="기업명을 입력하세요"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="business-number">사업자등록번호</label>
            <input
              type="text"
              id="business-number"
              value={companyInfo.businessNumber}
              onChange={handleChange('businessNumber')}
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
              onChange={handleChange('businessType')}
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
              onChange={handleChange('size')}
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
              onChange={handleChange('foundingYear')}
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
              onChange={handleChange('employeeCount')}
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
            onChange={handleChange('address')}
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
              onChange={handleChange('phone')}
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
              onChange={handleChange('email')}
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
            onChange={handleChange('website')}
            placeholder="회사 웹사이트 URL을 입력하세요"
          />
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="company-logo">회사 로고</label>
            <input
              type="file"
              id="company-logo"
              onChange={handleChange('logo')}
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
            onChange={handleChange('intro')}
            placeholder="회사 소개를 입력하세요"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoTab;