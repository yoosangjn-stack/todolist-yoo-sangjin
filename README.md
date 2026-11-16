# DAILY LIST | JavaScript Todo

담당: 유상진

CH2 프론트엔드 개발 평가 과제입니다. 일정을 추가·조회·수정·삭제하고, 브라우저 저장소를 이용해 새로고침 후에도 목록을 유지합니다.

## 실행

`index.html`을 브라우저에서 열거나, 프로젝트 폴더에서 아래 명령으로 실행합니다.

```bash
python -m http.server 8000
```

브라우저에서 `http://localhost:8000`에 접속합니다. 별도 서버 API나 회원가입은 사용하지 않습니다. 일정은 사용 중인 브라우저의 localStorage에만 저장됩니다.

## 기능과 역할

| 기능 | 동작 | 주요 코드 |
|---|---|---|
| 추가 | 날짜·제목·내용 입력 후 등록 | `add()` |
| 조회 | 전체/미완료/완료 목록 표시 | `render()`, `filter()` |
| 수정 | Edit에서 제목·내용 변경 | `edit()` |
| 삭제 | Delete 확인 후 제거 | `remove()` |
| 완료 | 체크박스로 완료 상태 전환 | `toggle()` |
| 저장 | 변경 후 저장, 재접속 시 복원 | `save()`, localStorage |

처리 흐름: **입력 → 배열 변경 → 저장 → 화면 갱신**. DOM 이벤트는 목록에 연결하고, 클릭한 버튼의 `data-uid`로 대상을 찾습니다.

## 파일 구조

```text
index.html              화면과 목록 템플릿
css/style.css           배치·색상·700px 반응형
js/todo.js              데이터·CRUD·이벤트 처리
tests/todo.test.cjs      로직 단위 테스트
docs/unit-test-results.txt  테스트 결과
```

## 시연 영상

[실제 브라우저 CRUD 시연 영상 보기](docs/video/todo-crud-demo.webm)

Chrome 브라우저에서 실제 작업본을 실행한 30초 시연입니다. 테스트 데이터만 사용했습니다.
1. 제목·내용 입력 후 일정 추가
2. 목록 조회 및 새로고침 후 저장 유지 확인
3. Edit로 제목·내용 수정 후 결과 확인
4. 완료 표시 및 Completed/All 필터 전환
5. Delete로 삭제 후 빈 목록 확인

## 검증

```bash
node --check js/todo.js
node tests/todo.test.cjs
```

- 문법 검사 통과
- DOM 모의 환경에서 CRUD, 취소, 필터, 복원, 빈 입력, 안전한 문자 출력, 손상 저장값 처리 등 **10개 로직 검사 통과**
- 실제 Chrome 브라우저: 추가·조회·새로고침 저장 유지·수정·완료·필터·삭제 검증 통과. 실행 중 페이지 오류 없음. [검증 기록](docs/browser-test-results.json)
- 모바일 화면은 별도 검증 필요

## 제출본 보완 내용

기존 화면과 단순한 객체·함수 구조를 유지했습니다.
- 사용자 입력을 HTML이 아닌 글자로 표시하도록 이스케이프 처리
- PC의 지역 날짜를 사용하도록 오늘 날짜 계산 수정
- 저장된 데이터가 손상되어도 빈 목록으로 열리도록 처리
- 폼 필드를 명시적으로 조회하고 label과 입력칸 연결

## 원본

본인의 공유 저장소 작업본 [TodoList_YooSangJin](https://github.com/aiagentohms/todo_list_3th/tree/main/TodoList_YooSangJin)을 개인 제출용으로 정리했습니다. 공유 저장소와 기존 PC 파일은 변경하지 않았습니다.
