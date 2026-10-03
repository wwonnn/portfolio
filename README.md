# 성원희 포트폴리오

원본 PDF의 프로젝트 11개와 이력, 기술, 소개, 스크린샷, 외부 링크를 HTML 웹사이트로 옮긴 버전입니다. 배경은 밝게, 글자는 짙게, 포인트는 차분한 녹색으로 구성했습니다.

## 먼저 보기

`index.html`을 더블 클릭하면 브라우저에서 열립니다. 프로그램 설치나 빌드 과정 없이 사용할 수 있습니다. 프로젝트 카드를 누르면 각각의 상세 페이지로 이동합니다. 스크린샷은 클릭하여 확대할 수 있고, Esc로 닫을 수 있습니다.

## GitHub Pages에 올리기

`wwonnn.github.io` 주소를 사용하려면 계정에 **wwonnn.github.io**라는 이름의 저장소가 필요합니다. 이미 같은 이름의 저장소가 있다면 그 저장소를 사용합니다.

1. GitHub에 로그인하고 [새 저장소 만들기](https://github.com/new)를 엽니다.
2. Owner는 `wwonnn`, Repository name은 `wwonnn.github.io`로 입력합니다.
3. GitHub Free를 사용한다면 공개 저장소인 **Public**을 선택합니다. Add README를 켜고 저장소를 만듭니다.
4. 압축 파일을 풉니다. 저장소에서 **Add file → Upload files**를 선택하고, `portfolio` 폴더 **안에 있는 파일과 폴더**를 업로드합니다. `portfolio` 폴더 자체를 올리는 것이 아니라, 최상위에 `index.html`, `assets`, `projects`가 있어야 합니다. zip 파일 자체는 올리지 않습니다.
5. 업로드를 Commit한 뒤, 저장소의 **Settings → Pages**로 이동합니다.
6. **Build and deployment → Source**에서 **Deploy from a branch**를 선택합니다.
7. Branch는 **main**, 폴더는 **/ (root)**로 선택하고 **Save**를 누릅니다.
8. 게시가 완료되면 `https://wwonnn.github.io/`에서 확인합니다. 반영에는 최대 10분 정도 걸릴 수 있습니다.

`.nojekyll` 파일도 함께 올려두면 정적 파일을 그대로 제공할 수 있습니다. GitHub 웹 업로드에서 숨김 파일이 선택되지 않아도 이 사이트의 일반 파일 구조는 그대로 작동합니다.

이 완성본은 로컬 파일로 준비되어 있으며, GitHub 저장소 생성이나 실제 공개 배포는 수행하지 않았습니다.

공식 안내: [GitHub Pages 사이트 만들기](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site), [게시 소스 설정하기](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## 파일 구성과 수정

| 파일 | 역할 |
| --- | --- |
| `index.html` | 첫 화면, 프로젝트 목록, 소개, 기술, 이력, 연락처 |
| `projects/*.html` | 프로젝트별 상세 소개, 기여 내용, 기술 설명, 트러블슈팅 |
| `assets/style.css` | 색상, 여백, 글꼴, 데스크톱·모바일 레이아웃 |
| `assets/app.js` | 기술별 필터, 이미지 확대, 상세 목차 표시 |
| `assets/images/` | 원본 PDF에서 가져온 WebP 이미지 |
| `assets/portfolio-original.pdf` | 원본 PDF 다운로드 |
| `assets/content.json` | PDF에서 옮긴 내용을 모아둔 참고용 데이터 |

본문은 해당 HTML에서 수정하면 됩니다. `content.json`은 참고용 보관본이며, 이 파일만 수정해서는 화면이 자동으로 갱신되지 않습니다. 내용 수정 시 HTML과 보관본을 함께 맞추면 좋습니다. 색상은 `style.css` 첫 줄의 `--bg`, `--ink`, `--green`, `--lime` 등을 수정하면 바꿀 수 있습니다.

외부 글꼴, 외부 이미지 서버, 프레임워크에 의존하지 않습니다. 상대 경로를 사용하여 GitHub Pages의 사용자 사이트와 저장소 하위 경로, 로컬 파일 모두에서 사용할 수 있습니다. 영상·Fab·논문·GitHub는 PDF의 기존 링크로 연결합니다.

## 원문에서 확인이 필요한 표기

요청에 따라 PDF의 각 위치에 있는 내용을 유지했습니다. 다음 항목은 원본에서 서로 다르게 적혀 있어 실제 최신 내용으로 확인 후 통일하는 것을 권합니다.

- KUMI: 이력 표는 `2025.7 ~ 2026.2`, 프로젝트 소개는 `2025.7 ~ 진행중`입니다.
- The Neverland: 이력 표는 `2023.6 ~ 2024.2`, 프로젝트 소개는 `2023.6 ~ 2024.1`입니다.
- AR 프로젝트: 이력 표는 `보이냐 내 마음`, 프로젝트 소개 제목은 `보이냐? 내 고민`입니다.
- 마법약학과 이화연의 재난: 개발 기간과 수상 이력은 2023년, 소개 문장에는 `2024 제 4회 메이킹잼`이라고 적혀 있습니다.

프로젝트의 기여 내용을 임의로 개인 단독 성과로 바꾸지 않았습니다. D3D11의 기능 설명은 원본처럼 프로젝트 구현 내용으로 보존했습니다. 영상 링크는 원본 PDF의 실제 하이퍼링크를 사용하였으며, 링크 대상의 접근 권한·재생 가능 여부는 별도로 검증하지 않았습니다.

## 확인한 동작

- 11개 프로젝트 상세 페이지와 로컬 이미지·스타일·스크립트 경로
- 전체 / Unreal Engine / Unity / 자체 엔진 필터
- 이미지 확대, Esc 닫기, 본문·프로젝트 탐색 링크
- 데스크톱과 모바일 반응형 레이아웃
- 메인 콘텐츠가 JavaScript 없이도 HTML로 표시되는 구조
