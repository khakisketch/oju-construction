# Build Project Documentation

## 목적

이 디렉토리는 **외주 프로젝트 자동 개발**을 위한 문서 시스템입니다.
Claude Code (LLM)가 이 문서들을 읽고 새 프로젝트를 빠르게 개발할 수 있도록 설계되었습니다.

## 디렉토리 구조

```
build-project/
├── README.md                       # 이 파일
├── 00-PROJECT-OVERVIEW.md          # 프로젝트 개요
├── 01-TECH-STACK.md                # 기술 스택 설명
│
├── architecture/                   # 아키텍처 문서
│   ├── directory-structure.md      # 디렉토리 구조 설명
│   ├── naming-conventions.md       # 네이밍 규칙
│   └── design-decisions.md         # 아키텍처 결정 기록
│
├── workflows/                      # 개발 워크플로우
│   ├── new-project-setup.md        # 새 프로젝트 시작
│   ├── development-workflow.md     # 개발 프로세스
│   ├── deployment.md               # 배포 프로세스
│   └── testing.md                  # 테스트 전략
│
├── admin/                          # Admin 패널 표준
│   ├── overview.md                 # Admin 개요
│   ├── standard-features.md        # 표준 기능 목록
│   └── component-guide.md          # 컴포넌트 가이드
│
├── home/                           # Home 페이지 가이드
│   ├── figma-integration.md        # Figma MCP 사용법
│   ├── customization.md            # 커스터마이징 가이드
│   └── common-patterns.md          # 자주 쓰는 패턴
│
├── templates/                      # 코드 템플릿
│   ├── feature-template.md         # 기능 템플릿
│   ├── component-template.md       # 컴포넌트 템플릿
│   └── service-template.md         # 서비스 템플릿
│
└── examples/                       # 실제 코드 예시
    ├── feature-example.md          # 기능 구현 예시
    └── integration-example.md      # 통합 예시
```

## 사용 방법

### Claude Code에게 요청할 때:

```
"build-project/00-PROJECT-OVERVIEW.md 읽고 프로젝트 이해해줘.
 그 다음 build-project/workflows/new-project-setup.md 따라서
 새 프로젝트 시작해줘."
```

### 문서 작성 원칙:

1. **명확성**: LLM이 오해 없이 이해할 수 있도록 명확하게
2. **구체성**: 추상적 개념보다 구체적 예시 포함
3. **완전성**: 필요한 모든 정보 포함
4. **일관성**: 모든 문서의 형식과 용어 통일

## 유지보수

- 프로젝트 구조 변경 시 `architecture/directory-structure.md` 업데이트
- 새로운 패턴 발견 시 `examples/` 에 추가
- 워크플로우 개선 시 `workflows/` 업데이트
