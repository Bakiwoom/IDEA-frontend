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
            onChange={handleChange('loginEmail')}
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
  );
};

export default AccountSettingsTab;