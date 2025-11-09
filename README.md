# 🔗 블록체인 완벽 가이드 & 실전 프로젝트

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)](https://soliditylang.org)

> **백엔드 개발자를 위한 블록체인 입문서** 📚
>
> 블록체인이 처음이신가요? 이 저장소는 백엔드 개발 경험이 있는 분들이 블록체인을 쉽게 이해하고 시작할 수 있도록 만들어졌습니다.

---

## 📖 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 특징](#-주요-특징)
- [프로젝트 구조](#-프로젝트-구조)
- [빠른 시작](#-빠른-시작)
- [학습 가이드](#-학습-가이드)
- [실전 샘플 프로젝트](#-실전-샘플-프로젝트)
- [기술 스택](#-기술-스택)
- [문서](#-문서)
- [로드맵](#-로드맵)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)

---

## 🎯 프로젝트 소개

이 프로젝트는 **백엔드 개발자**가 **블록체인 개발자**로 전환하거나, 블록체인 기술을 이해하고 싶을 때 필요한 모든 것을 담고 있습니다.

### 🤔 이런 분들을 위한 프로젝트입니다

- ✅ 백엔드 개발 경험은 있지만 블록체인은 처음인 분
- ✅ "블록체인이 뭔지는 아는데 어떻게 개발하는지 모르겠어요"
- ✅ "백엔드랑 블록체인이 정확히 뭐가 다른가요?"
- ✅ "실제로 동작하는 코드를 보고 싶어요"
- ✅ 블록체인 개발자로 커리어 전환을 고민하는 분

### 💡 왜 이 프로젝트를 만들었나요?

블록체인 학습의 가장 큰 어려움:
1. **개념은 어렵고 추상적**이다
2. **실제 코드 예제**가 부족하다
3. **백엔드와 비교**한 자료가 없다
4. **어디서부터 시작**해야 할지 모른다

→ **이 모든 문제를 해결하기 위해 만들었습니다!**

---

## ✨ 주요 특징

### 📚 1. 완벽한 학습 자료
- **초보자 친화적 설명**: 중학생도 이해할 수 있는 쉬운 설명
- **일상 생활 비유**: 반 회비, 게임 아이템, 해외 송금 등
- **단계별 학습**: 기초 → 중급 → 고급 (6개월 로드맵)

### 💻 2. 실제 동작하는 샘플 코드
- **백엔드 버전** (Node.js + Express + MySQL)
- **블록체인 버전** (Solidity + Hardhat + ethers.js)
- **프론트엔드** (React + ethers.js)
- **비교 분석**: 같은 기능을 두 방식으로 구현

### 🔍 3. 심도 있는 비교
| 항목 | 백엔드 | 블록체인 |
|-----|-------|---------|
| 속도 | 즉시 (~10ms) | 15초~5분 |
| 비용 | 서버비 (월 5만원) | 가스비 (건당 $0.1~$5) |
| 수정 | ✅ 언제든 | ❌ 불가능 |
| 투명성 | ❌ 제한적 | ✅ 완전 공개 |

### 🎓 4. 체계적인 학습 로드맵
- **24주 커리큘럼** (완전 초보 → 취업 준비)
- **실습 프로젝트** (난이도별 6개)
- **추천 학습 자료** (무료/유료)

---

## 📂 프로젝트 구조

```
block-chain/
│
├── 📄 README.md                          # 이 파일
│
├── 📚 문서 (Documents)
│   ├── 블록체인_기초_완벽_가이드.md      # 기술적 설명 (500줄+)
│   └── 블록체인_쉬운_설명_실전_비교.md   # 쉬운 설명 + 실전 비교
│
└── 💻 샘플 프로젝트 (samples/)
    │
    ├── 📄 README.md                      # 샘플 프로젝트 상세 가이드
    ├── 📄 QUICKSTART.md                  # 5분 빠른 시작 가이드
    │
    ├── 🖥️ backend/                       # 백엔드 버전
    │   ├── server.js                     # Express API 서버 (300줄)
    │   ├── database/schema.sql           # MySQL 스키마
    │   ├── package.json
    │   └── .env.example
    │
    ├── ⛓️ blockchain/                    # 블록체인 버전
    │   ├── contracts/
    │   │   └── LoyaltyToken.sol         # 스마트 컨트랙트 (250줄)
    │   ├── scripts/deploy.js            # 배포 스크립트
    │   ├── test/LoyaltyToken.test.js    # 테스트 (15개)
    │   ├── hardhat.config.js
    │   └── package.json
    │
    └── 🌐 frontend/                      # 프론트엔드
        ├── src/
        │   ├── App.jsx                   # React DApp (350줄)
        │   └── App.css
        └── package.json
```

---

## 🚀 빠른 시작

### 📋 사전 요구사항

- **Node.js** 18 이상
- **Git**
- **MySQL** (백엔드 샘플 실행 시)
- **MetaMask** (블록체인 샘플 실행 시)

### 1️⃣ 저장소 클론

```bash
git clone https://github.com/araeLaver/block-chain.git
cd block-chain
```

### 2️⃣ 학습 문서 읽기

```bash
# 기초부터 시작
블록체인_기초_완벽_가이드.md

# 실전 비교와 쉬운 설명
블록체인_쉬운_설명_실전_비교.md
```

### 3️⃣ 샘플 프로젝트 실행

#### 방법 1: 빠른 시작 (추천)
```bash
cd samples
# QUICKSTART.md 파일 참고
```

#### 방법 2: 백엔드 먼저
```bash
cd samples/backend
npm install
# .env 설정 후
npm start
```

#### 방법 3: 블록체인 먼저
```bash
cd samples/blockchain
npm install
npm run compile
npm test
```

---

## 📖 학습 가이드

### 🎯 추천 학습 순서

#### 1단계: 개념 이해 (1주)
```
1. 블록체인_쉬운_설명_실전_비교.md 읽기
   - 일상 생활 비유로 이해
   - 백엔드와 차이점 파악

2. 블록체인_기초_완벽_가이드.md 읽기
   - 블록, 해시, 체인 이해
   - 채굴, 합의 알고리즘 학습
```

#### 2단계: 코드 비교 (1~2주)
```
1. 백엔드 샘플 실행 및 분석
   - samples/backend/server.js
   - API 호출해보기
   - DB에서 데이터 확인

2. 블록체인 샘플 실행 및 분석
   - samples/blockchain/contracts/LoyaltyToken.sol
   - 테스트 코드 실행
   - Solidity 문법 학습

3. 같은 기능 비교
   - 포인트 적립: DB UPDATE vs 스마트 컨트랙트 mint
   - 데이터 조회: SQL vs view 함수
   - 권한 관리: 서버 로직 vs onlyOwner
```

#### 3단계: 직접 개발 (2~4주)
```
1. 로컬 환경에서 실습
   - Hardhat 로컬 네트워크 사용
   - 컨트랙트 수정해보기
   - 프론트엔드 연동

2. 테스트넷 배포
   - Sepolia 테스트넷 사용
   - 실제 블록체인에 배포
   - Etherscan에서 확인

3. 나만의 프로젝트
   - 새로운 기능 추가
   - 다른 유형의 DApp 만들기
```

#### 4단계: 심화 학습 (지속적)
```
1. 보안
   - 일반적인 취약점 학습
   - 감사(Audit) 보고서 읽기

2. 최적화
   - Gas 최적화 기법
   - 스토리지 효율화

3. 고급 패턴
   - Proxy 패턴
   - Diamond 패턴
   - EIP 표준들
```

### 📚 문서별 학습 목적

| 문서 | 대상 | 학습 시간 | 내용 |
|-----|------|----------|------|
| **블록체인_쉬운_설명_실전_비교.md** | 완전 초보 | 1~2시간 | 일상 비유, 쉬운 설명, 현업 코드 비교 |
| **블록체인_기초_완벽_가이드.md** | 기초 학습자 | 3~4시간 | 기술 개념, 코드 예제, 체계적 설명 |
| **samples/README.md** | 실습 중심 | 2~3시간 | 샘플 프로젝트 가이드, API 문서 |
| **samples/QUICKSTART.md** | 빠른 시작 | 10분 | 최소한의 설정으로 빠르게 실행 |

---

## 💻 실전 샘플 프로젝트

### 🏪 포인트 시스템 (Loyalty Points)

동일한 기능을 **백엔드**와 **블록체인** 두 방식으로 구현

#### 주요 기능

| 기능 | 백엔드 API | 블록체인 함수 |
|-----|-----------|--------------|
| 포인트 적립 | POST /api/points/earn | earnPoints() |
| 포인트 사용 | POST /api/points/spend | spendPoints() |
| 포인트 전송 | - | transfer() |
| 잔액 조회 | GET /api/users/:id | balanceOf() |
| 거래 내역 | GET /api/points/history | 이벤트 조회 |
| 통계 | GET /api/points/stats | getUserStats() |

#### 기술 스택 비교

**백엔드 버전**
```
- Node.js + Express
- MySQL
- JWT 인증
- REST API
```

**블록체인 버전**
```
- Solidity 0.8.20
- Hardhat
- ethers.js
- ERC-20 표준
```

#### 실행 결과 비교

**백엔드**
```bash
$ curl http://localhost:3000/api/points/earn -X POST \
  -d '{"userId": 1, "amount": 1000}'

응답 시간: 8ms
비용: 무료 (서버 비용만)
수정 가능: ✅ DB 직접 수정 가능
```

**블록체인**
```bash
$ npx hardhat run scripts/earnPoints.js

트랜잭션 해시: 0x7a8b9c...
블록 번호: #12345
확정 시간: 15초
가스비: 0.002 ETH ($4)
수정 가능: ❌ 영구 기록
```

---

## 🛠️ 기술 스택

### 백엔드
- **런타임**: Node.js 18+
- **프레임워크**: Express.js
- **데이터베이스**: MySQL 8.0
- **인증**: JWT
- **검증**: Joi

### 블록체인
- **언어**: Solidity 0.8.20
- **프레임워크**: Hardhat
- **라이브러리**: OpenZeppelin Contracts
- **테스트**: Chai, Mocha
- **표준**: ERC-20

### 프론트엔드
- **프레임워크**: React 18
- **블록체인 연동**: ethers.js 6
- **번들러**: Vite
- **스타일**: CSS

---

## 📚 문서

### 학습 문서
- [블록체인 기초 완벽 가이드](./블록체인_기초_완벽_가이드.md) - 기술적 설명, 500줄 이상
- [블록체인 쉬운 설명 & 실전 비교](./블록체인_쉬운_설명_실전_비교.md) - 일상 비유, 현업 코드

### 실습 가이드
- [샘플 프로젝트 README](./samples/README.md) - 상세한 실행 가이드
- [빠른 시작 가이드](./samples/QUICKSTART.md) - 5분 안에 시작하기

### 코드 문서
- [백엔드 API 문서](./samples/backend/README.md) - REST API 명세
- [스마트 컨트랙트 문서](./samples/blockchain/README.md) - 함수 설명

---

## 🗺️ 로드맵

### ✅ 완료된 기능
- [x] 블록체인 기초 개념 문서
- [x] 쉬운 설명 + 실전 비교 문서
- [x] 백엔드 샘플 (Node.js + Express)
- [x] 블록체인 샘플 (Solidity + Hardhat)
- [x] 프론트엔드 DApp (React)
- [x] 테스트 코드
- [x] 배포 스크립트
- [x] 상세한 README

### 🚧 진행 중
- [ ] 영상 강의 자료
- [ ] 더 많은 실습 예제
- [ ] 한글 커밋 메시지 가이드

### 📅 예정된 기능
- [ ] NFT 마켓플레이스 예제
- [ ] DeFi 스테이킹 예제
- [ ] DAO 투표 시스템 예제
- [ ] Layer 2 (Polygon) 예제
- [ ] 고급 보안 가이드
- [ ] Gas 최적화 팁
- [ ] 업그레이드 가능한 컨트랙트 패턴

---

## 🎓 학습 자료

### 무료 자료

**온라인 강의**
- [CryptoZombies](https://cryptozombies.io/ko) - 게임으로 Solidity 배우기
- [Ethereum.org](https://ethereum.org/ko/developers/) - 공식 개발자 문서
- [Solidity by Example](https://solidity-by-example.org) - 예제로 배우기

**책 (무료)**
- [Mastering Ethereum](https://github.com/ethereumbook/ethereumbook)
- [Solidity 문서 (한글)](https://solidity-kr.readthedocs.io)

**유튜브**
- Patrick Collins (영어, 최고의 Solidity 강의)
- Dapp University (영어, 초보자 친화적)

### 유료 자료

**강의**
- Udemy "Ethereum and Solidity: The Complete Developer's Guide" (~$15)
- [Alchemy University](https://university.alchemy.com) - 무료!

**부트캠프**
- ChainShot
- ConsenSys Academy
- 코드스테이츠 블록체인 부트캠프

---

## 🤝 기여하기

이 프로젝트는 오픈소스입니다! 기여를 환영합니다.

### 기여 방법

1. **Fork** 이 저장소
2. **Clone** 포크한 저장소
   ```bash
   git clone https://github.com/YOUR_USERNAME/block-chain.git
   ```
3. **Branch** 생성
   ```bash
   git checkout -b feature/새로운기능
   ```
4. **Commit** (한글 메시지 권장)
   ```bash
   git commit -m "추가: 새로운 NFT 예제"
   ```
5. **Push**
   ```bash
   git push origin feature/새로운기능
   ```
6. **Pull Request** 생성

### 커밋 메시지 컨벤션 (한글)

```
추가: 새로운 기능 추가
수정: 기존 기능 변경
삭제: 기능 제거
문서: 문서 업데이트
스타일: 코드 포맷팅
리팩토링: 코드 구조 개선
테스트: 테스트 코드 추가/수정
빌드: 빌드 시스템 변경
```

**예시:**
```bash
git commit -m "추가: NFT 마켓플레이스 예제 프로젝트"
git commit -m "문서: README에 설치 가이드 상세화"
git commit -m "수정: LoyaltyToken 가스 최적화"
```

### 기여할 수 있는 것들

- 📝 문서 개선 (오타 수정, 설명 추가)
- 💻 새로운 예제 프로젝트
- 🐛 버그 수정
- ✨ 새로운 기능 제안
- 🌍 번역 (영어 버전)
- 📹 영상 자료 제작

---

## 📞 문의 및 지원

### 질문하기
- **GitHub Issues**: 버그 리포트, 기능 제안
- **GitHub Discussions**: 일반 질문, 아이디어 공유

### 도움이 필요하신가요?
1. 먼저 [문서](./블록체인_기초_완벽_가이드.md)를 확인해주세요
2. [FAQ](#-자주-묻는-질문) 섹션을 확인해주세요
3. [Issues](https://github.com/araeLaver/block-chain/issues)에서 검색해보세요
4. 새로운 Issue를 생성해주세요

---

## ❓ 자주 묻는 질문

### Q1. 백엔드 경험이 없어도 되나요?
A: 이 프로젝트는 백엔드 경험이 있는 분들을 대상으로 합니다. 하지만 JavaScript 기초가 있다면 충분히 따라하실 수 있습니다.

### Q2. 얼마나 시간이 걸리나요?
A:
- 문서 읽기: 5~10시간
- 샘플 실행: 2~3시간
- 직접 개발: 2~4주
- 취업 준비: 3~6개월

### Q3. 블록체인 개발자로 취업하려면?
A:
1. Solidity 중급 이상 실력
2. 포트폴리오 프로젝트 2~3개
3. GitHub 활동 (오픈소스 기여)
4. 기술 블로그 운영 (선택)

### Q4. 가스비가 부담되는데...
A:
- **학습 단계**: 무료 테스트넷 사용 (Sepolia, Goerli)
- **테스트**: Hardhat 로컬 네트워크 (완전 무료)
- **배포**: Layer 2 사용 (Polygon, Arbitrum - 저렴)

### Q5. 스마트 컨트랙트 실수로 배포했어요!
A:
- 배포 후 수정 불가능합니다
- 새로운 버전을 새 주소로 배포해야 합니다
- 테스트넷에서 충분히 테스트하세요!
- Proxy 패턴을 사용하면 업그레이드 가능합니다

### Q6. 실무에서는 어떻게 사용하나요?
A: 대부분 **하이브리드** 방식 사용:
- 블록체인: 소유권, 거래, 중요 기록
- 백엔드: 검색, 통계, 알림, 이미지 저장

---

## 📊 프로젝트 통계

- **총 코드 라인**: 2,000+ 줄
- **문서 라인**: 1,500+ 줄
- **예제 프로젝트**: 3개
- **테스트 케이스**: 15개
- **학습 시간**: 약 40시간 분량

---

## 🌟 Star 히스토리

이 프로젝트가 도움이 되셨다면 ⭐ Star를 눌러주세요!

[![Star History Chart](https://api.star-history.com/svg?repos=araeLaver/block-chain&type=Date)](https://star-history.com/#araeLaver/block-chain&Date)

---

## 📜 라이선스

이 프로젝트는 [MIT License](LICENSE)로 배포됩니다.

```
MIT License

Copyright (c) 2025 araeLaver

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🎉 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들의 도움을 받았습니다:

- [Hardhat](https://hardhat.org) - 이더리움 개발 환경
- [OpenZeppelin](https://openzeppelin.com) - 검증된 스마트 컨트랙트 라이브러리
- [ethers.js](https://docs.ethers.org) - 이더리움 JavaScript 라이브러리
- [Express.js](https://expressjs.com) - Node.js 웹 프레임워크

---

## 📮 연락처

- **GitHub**: [@araeLaver](https://github.com/araeLaver)
- **Issues**: [GitHub Issues](https://github.com/araeLaver/block-chain/issues)

---

<div align="center">

**⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요! ⭐**

**Made with ❤️ for 블록체인 입문자**

[맨 위로 ⬆](#-블록체인-완벽-가이드--실전-프로젝트)

</div>
