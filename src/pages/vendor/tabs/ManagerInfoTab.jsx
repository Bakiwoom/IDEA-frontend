import React from "react";

const ManagerInfoTab = ({ managerInfo, handleChange, styles }) => {
  return (
    <div className={`${styles.tabContent} ${styles.active}`}>
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
              onChange={handleChange('name')}
              placeholder="담당자 이름을 입력하세요"
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
              onChange={handleChange('position')}
              placeholder="직책을 입력하세요"
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
              onChange={handleChange('phone')}
              placeholder="연락처를 입력하세요"
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
              onChange={handleChange('email')}
              placeholder="이메일을 입력하세요"
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="manager-department">부서</label>
          <input
            type="text"
            id="manager-department"
            value={managerInfo.department}
            onChange={handleChange('department')}
            placeholder="부서를 입력하세요"
          />
        </div>
        {/* <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              checked={managerInfo.receiveNotifications}
              onChange={handleChange('receiveNotifications')}
              style={{ width: "auto", marginRight: "8px" }}
            />
            담당자 정보로 알림 수신 (이메일, SMS)
          </label>
        </div> */}
      </div>
    </div>
  );
};

export default ManagerInfoTab;