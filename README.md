# IDEA (React Frontend)
> **장애인 구직자와 고용주를 연결하고, 정부의 고용 지원 정책을 쉽게 확인할 수 있는 서비스**  
> 공공데이터와 AI 요약 기능을 결합해, 복잡한 정책을 더 쉽게 이해할 수 있도록 돕습니다.


📆 개발 기간: 2024.03 ~ 2024.04  
👥 팀원: 임현성, 진소영, 황주영

## 💡 프로젝트 개요

장애인 고용률을 높이고, 고용의 진입 장벽을 줄이기 위한 플랫폼입니다.  
**장애인 구직자**의 정보를 기반으로, **고용주(업체)**가 해당 인원을 채용할 경우 **어떤 정부지원 혜택이나 장점이 있는지**를 **AI 요약** 기능을 통해 제공하는 것이 핵심입니다.

본 리포지토리는 **React로 구성된 프론트엔드**이며, AI 요약 기능은 **Python 기반 백엔드에서 처리**합니다.

## 주요 기능

- ✅ 사용자(고용주)가 해당 지원자를 고용했을 때 받을 수 있는 **정부 지원 정보** 확인
- ✅ **AI 기반 요약 기능**으로 복잡한 정책 내용을 간결하게 보여줌 *(Python기반 백엔드에서 처리 예정)*
- ✅ 사용자 유형별 페이지 분리: 일반 사용자(User) / 고용업체(Vendor)

## 📊 공공데이터 활용

본 서비스는 다음과 같은 공공데이터를 활용하여 구성됩니다:

| 출처 | 활용 내용 |
|------|-----------|
| 고용노동부 | 수집중 |
| 워크넷 | 수집중 |
| 기타 관련기관 | 수집중 |

> 해당 데이터는 OpenAPI 또는 정제된 CSV 형태로 수집되며, 사용자별 맞춤형 정보 제공에 활용됩니다.

## 🗂️ 폴더 구조

`
src ├── assets │ ├── images │ └── css │ ├── contexts │ ├── index.js │ ├── user │ │ └── index.js │ ├── vendor │ │ └── index.js │ └── css │ └── index.js │ ├── pages │ ├── user │ ├── vendor │ └── main.jsx │ ├── routes │ ├── user │ └── vendor │ └── App.js
`
---

### 🌿 Git 브랜치 네이밍 가이드

팀 협업 시 일관된 브랜치 네이밍으로 관리 효율성을 높이기 위해 아래 규칙을 따릅니다.

---

#### ✅ 브랜치 네이밍 규칙

`<브랜치타입>/<도메인>/<기능 또는 작업내용>`

- `브랜치타입`: 작업 목적에 따른 구분 (`feature`, `fix`, `hotfix`, `refactor`, `chore` 등)  
- `도메인`: 기능이 속하는 모듈 또는 영역 (`product`, `order`, `review` 등)  
- `기능명`: 구현하거나 수정할 기능 명칭 (`create`, `update`, `option-add` 등)

---

#### ✅ 브랜치 타입 목록

| 타입       | 설명                             |
|------------|----------------------------------|
| `feature`  | 새로운 기능 개발 시              |
| `fix`      | 버그 수정 시                     |
| `hotfix`   | 운영 중 긴급 패치 필요 시        |
| `refactor` | 코드 리팩토링 (기능 변화 없음)   |
| `chore`    | 빌드 설정, 문서 등 잡일 변경 시  |

---

#### ✅ 브랜치 이름 예시

| 브랜치 이름                    | 설명                       |
|-------------------------------|----------------------------|
| `feature/product/create`      | 상품 등록 기능 개발        |
| `feature/product/option-add`  | 상품 옵션 추가 기능        |
| `feature/order/create`        | 주문 생성 기능             |
| `fix/order/cancel-error`      | 주문 취소 오류 수정        |
| `refactor/review/handler`     | 리뷰 관련 로직 리팩토링    |
| `chore/env/config-cleanup`    | 환경설정 정리              |

---

#### ✅ 브랜치 전략 예시

```
main or master        # 실제 서비스 배포용  
develop               # 전체 개발 병합용 (테스트 포함)  
feature/*/*           # 기능 개발 브랜치  
fix/*/*               # 버그 수정 브랜치  
refactor/*/*          # 코드 개선 브랜치  
hotfix/*/*            # 운영 중 긴급 수정 브랜치  
```

---

#### 🔖 참고

- 브랜치명은 **소문자**로 작성하고, 단어 구분은 **하이픈(-)** 을 사용합니다.  
- 브랜치명은 **간결하고 명확하게** 작성합니다.  
- 모든 기능 브랜치는 `develop` 브랜치에서 분기하여 작업 후 Pull Request로 병합합니다.

---

#### ✅ 사용 예시

```bash
# 상품 등록 기능 시작
git checkout -b feature/product/create

# 주문 생성 버그 수정
git checkout -b fix/order/submit-failure
```

---
