import React from "react";

const AccountSettingsTab = ({ accountInfo, handleChange, styles }) => {

  return (
    <div className={`${styles.tabContent} ${styles.active}`}>
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
              onChange={handleChange('currentPassword')}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="new-password">새 비밀번호</label>
            <input
              type="password"
              id="new-password"
              placeholder="새 비밀번호 입력"
              value={accountInfo.newPassword}
              onChange={handleChange('newPassword')}
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
              onChange={handleChange('confirmPassword')}
            />
          </div>
          <div className={styles.formGroup} style={{ visibility: "hidden" }}>
            {/* 이 부분은 레이아웃 균형을 위해 비워둠 */}
          </div>
        </div>

        {/* 에러와 성공 메시지는 더 이상 여기서 표시하지 않음 - InfoManagement.js의 alert로 대체 */}
      </div>
    </div>
  );
};

export default AccountSettingsTab;