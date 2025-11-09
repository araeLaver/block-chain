# 블록체인 vs 백엔드 실전 샘플 프로젝트

> 백엔드 개발자를 위한 블록체인 학습 프로젝트
>
> 동일한 포인트 시스템을 **백엔드**와 **블록체인** 두 가지 방식으로 구현

---

## 📁 프로젝트 구조

```
samples/
├── backend/                  # 백엔드 버전 (Node.js + Express + MySQL)
│   ├── database/
│   │   └── schema.sql       # 데이터베이스 스키마
│   ├── server.js            # Express 서버
│   ├── package.json
│   └── .env.example
│
├── blockchain/              # 블록체인 버전 (Solidity + Hardhat)
│   ├── contracts/
│   │   └── LoyaltyToken.sol # 스마트 컨트랙트
│   ├── scripts/
│   │   └── deploy.js        # 배포 스크립트
│   ├── test/
│   │   └── LoyaltyToken.test.js # 테스트
│   ├── hardhat.config.js
│   └── package.json
│
└── frontend/                # 프론트엔드 (React + ethers.js)
    ├── src/
    │   ├── App.jsx          # 메인 컴포넌트
    │   └── App.css          # 스타일
    └── package.json
```

---

## 🚀 빠른 시작

### 1️⃣ 백엔드 버전 (Node.js + Express + MySQL)

#### 필요 사항
- Node.js 18+
- MySQL 8.0+

#### 실행 방법

```bash
# 1. 백엔드 디렉토리로 이동
cd samples/backend

# 2. 패키지 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env
# .env 파일에서 DB 정보 수정

# 4. 데이터베이스 설정
mysql -u root -p < database/schema.sql

# 5. 서버 실행
npm start

# 또는 개발 모드 (자동 재시작)
npm run dev
```

서버가 실행되면: http://localhost:3000

#### API 엔드포인트 테스트

```bash
# 1. 모든 사용자 조회
curl http://localhost:3000/api/users

# 2. 포인트 적립
curl -X POST http://localhost:3000/api/points/earn \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "amount": 1000,
    "description": "회원가입 보너스"
  }'

# 3. 포인트 사용
curl -X POST http://localhost:3000/api/points/spend \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "amount": 300,
    "description": "상품 구매"
  }'

# 4. 거래 내역 조회
curl http://localhost:3000/api/points/history/1

# 5. 통계 조회
curl http://localhost:3000/api/points/stats/1
```

---

### 2️⃣ 블록체인 버전 (Solidity + Hardhat)

#### 필요 사항
- Node.js 18+
- MetaMask (브라우저 확장)

#### 실행 방법

```bash
# 1. 블록체인 디렉토리로 이동
cd samples/blockchain

# 2. 패키지 설치
npm install

# 3. 환경 변수 설정 (선택사항 - 테스트넷 배포 시)
cp .env.example .env
# .env 파일에서 개인키, RPC URL 설정

# 4. 컴파일
npm run compile

# 5. 테스트 실행
npm test

# 6. 로컬 블록체인 실행 (새 터미널)
npm run node

# 7. 로컬에 배포 (다른 터미널)
npm run deploy:local
```

#### 테스트넷 배포 (Sepolia)

```bash
# 1. .env 파일 설정
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_api_key

# 2. Sepolia 테스트 ETH 받기
# https://sepoliafaucet.com

# 3. 배포
npm run deploy:sepolia

# 4. 배포된 주소 복사
# 출력: 컨트랙트 주소: 0x...
```

---

### 3️⃣ 프론트엔드 (React DApp)

#### 필요 사항
- Node.js 18+
- MetaMask 설치 및 설정
- 배포된 컨트랙트 주소

#### 실행 방법

```bash
# 1. 프론트엔드 디렉토리로 이동
cd samples/frontend

# 2. 패키지 설치
npm install

# 3. 컨트랙트 주소 설정
# src/App.jsx 파일에서 CONTRACT_ADDRESS 수정

# 4. 개발 서버 실행
npm run dev
```

브라우저에서: http://localhost:5173

#### MetaMask 설정

1. **로컬 네트워크 추가** (로컬 테스트 시)
   - 네트워크 이름: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - 체인 ID: 31337
   - 통화 기호: ETH

2. **계정 가져오기**
   - Hardhat 노드 실행 시 출력되는 개인키 중 하나 사용
   - MetaMask → 계정 가져오기 → 개인키 입력

---

## 📊 기능 비교

| 기능 | 백엔드 | 블록체인 |
|-----|-------|---------|
| **포인트 적립** | ✅ POST /api/points/earn | ✅ earnPoints() |
| **포인트 사용** | ✅ POST /api/points/spend | ✅ spendPoints() |
| **포인트 전송** | ❌ (구현 가능) | ✅ transfer() |
| **거래 내역** | ✅ GET /api/points/history | ✅ 이벤트 조회 |
| **통계** | ✅ GET /api/points/stats | ✅ getUserStats() |
| **처리 속도** | 즉시 (~10ms) | 15초~5분 |
| **비용** | 서버비 (월 5만원) | 가스비 (건당 $0.1~$5) |
| **수정 가능** | ✅ 언제든 | ❌ 불가능 |
| **투명성** | ❌ DB 접근 제한 | ✅ 모두 조회 가능 |

---

## 🧪 테스트

### 백엔드 테스트

```bash
cd samples/backend
npm test
```

### 블록체인 테스트

```bash
cd samples/blockchain
npm test
```

출력 예시:
```
  LoyaltyToken 테스트
    배포 테스트
      ✔ 올바른 토큰 정보를 가져야 함
      ✔ 올바른 소유자를 가져야 함
    포인트 적립 (earnPoints)
      ✔ 소유자는 포인트를 적립할 수 있어야 함
      ✔ 통계가 올바르게 업데이트되어야 함
    ...

  15 passing (2s)
```

---

## 💡 학습 가이드

### 단계별 학습

#### 1단계: 백엔드 이해하기
1. `backend/server.js` 읽기
2. API 직접 호출해보기 (Postman 또는 curl)
3. 데이터베이스에서 변경 사항 확인

#### 2단계: 블록체인 기초
1. `blockchain/contracts/LoyaltyToken.sol` 읽기
2. Solidity 문법 이해하기
3. 테스트 코드 실행 및 분석

#### 3단계: 배포 및 테스트
1. 로컬 Hardhat 네트워크에 배포
2. Hardhat 콘솔에서 컨트랙트 상호작용
3. Sepolia 테스트넷에 배포

#### 4단계: DApp 개발
1. 프론트엔드 코드 분석
2. MetaMask 연결 로직 이해
3. 트랜잭션 전송 및 이벤트 구독

---

## 🔍 주요 차이점 비교

### 1. 포인트 적립

**백엔드 (server.js)**
```javascript
app.post('/api/points/earn', async (req, res) => {
    const { userId, amount, description } = req.body;

    await db.beginTransaction();
    await db.query('UPDATE users SET points = points + ?', [amount]);
    await db.query('INSERT INTO point_transactions ...');
    await db.commit();

    res.json({ success: true });
});
```

**블록체인 (LoyaltyToken.sol)**
```solidity
function earnPoints(address user, uint256 amount, string memory reason)
    external onlyOwner
{
    _mint(user, amount);
    userStats[user].totalEarned += amount;
    emit PointsEarned(user, amount, reason, balanceOf(user));
}
```

**차이점:**
- 백엔드: DB 트랜잭션, 롤백 가능
- 블록체인: 블록에 영구 기록, 롤백 불가능

### 2. 데이터 조회

**백엔드**
```javascript
// 복잡한 쿼리 가능
SELECT SUM(amount), COUNT(*), AVG(amount)
FROM point_transactions
WHERE user_id = ? AND created_at > ?
GROUP BY type
```

**블록체인**
```solidity
// 간단한 조회만 가능
function balanceOf(address account) view returns (uint256)
function getUserStats(address user) view returns (...)
```

**차이점:**
- 백엔드: SQL로 복잡한 집계 가능
- 블록체인: 미리 정의된 함수만 사용

### 3. 접근 제어

**백엔드**
```javascript
// 서버 코드로 제어
if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
}
```

**블록체인**
```solidity
// 스마트 컨트랙트 코드로 제어
modifier onlyOwner() {
    require(msg.sender == owner, "소유자만 실행 가능");
    _;
}
```

**차이점:**
- 백엔드: 서버 관리자가 언제든 변경 가능
- 블록체인: 코드에 명시된 규칙만 따름, 변경 불가

---

## 🐛 문제 해결

### 백엔드

**문제: MySQL 연결 실패**
```
해결:
1. MySQL 서비스 실행 확인
2. .env 파일의 DB 정보 확인
3. 방화벽 설정 확인
```

**문제: 포트 이미 사용 중**
```bash
# 포트 변경
PORT=3001 npm start
```

### 블록체인

**문제: 가스비 부족**
```
해결:
1. 테스트넷 faucet에서 ETH 받기
2. https://sepoliafaucet.com
```

**문제: 컨트랙트 배포 실패**
```bash
# 상세 에러 로그 확인
npx hardhat run scripts/deploy.js --network sepolia --show-stack-traces
```

**문제: MetaMask 연결 안 됨**
```
해결:
1. MetaMask 설치 확인
2. 올바른 네트워크 선택
3. 계정 잠금 해제
4. 브라우저 새로고침
```

---

## 📚 추가 학습 자료

### 백엔드
- Express 공식 문서: https://expressjs.com
- MySQL 튜토리얼: https://dev.mysql.com/doc/

### 블록체인
- Solidity 문서: https://docs.soliditylang.org
- Hardhat 가이드: https://hardhat.org/getting-started
- ethers.js 문서: https://docs.ethers.org
- OpenZeppelin: https://docs.openzeppelin.com

### 비디오 강의
- Patrick Collins (영어): https://www.youtube.com/@PatrickAlphaC
- CryptoZombies (한글): https://cryptozombies.io/ko

---

## 💬 자주 묻는 질문

**Q: 백엔드와 블록체인 중 어떤 걸 써야 하나요?**

A:
- 빠른 속도, 낮은 비용 → 백엔드
- 투명성, 탈중앙화 → 블록체인
- 대부분의 경우 둘 다 사용 (하이브리드)

**Q: 블록체인 개발자가 되려면?**

A:
1. 백엔드 개발 경험 (1년+)
2. Solidity 학습 (3개월)
3. 포트폴리오 프로젝트 3개
4. 오픈소스 기여

**Q: 가스비를 줄이는 방법은?**

A:
- 불필요한 storage 변수 제거
- view/pure 함수 활용
- 배치 처리 (batchEarnPoints)
- Layer 2 솔루션 사용 (Polygon, Arbitrum)

**Q: 스마트 컨트랙트 수정이 필요하면?**

A:
- 새 주소로 재배포
- Proxy 패턴 사용 (고급)
- 사용자들에게 마이그레이션 안내

---

## 📄 라이선스

MIT License

## 🤝 기여

이슈 및 PR 환영합니다!

---

**작성일**: 2025-01-08
**버전**: 1.0
**문의**: GitHub Issues
