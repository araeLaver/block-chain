# 🚀 5분 빠른 시작 가이드

> 가장 빠르게 백엔드와 블록체인 샘플을 실행해보는 방법

---

## ⚡ 백엔드 버전 (3분)

### 1단계: 준비
```bash
# MySQL 설치 (없다면)
# Windows: https://dev.mysql.com/downloads/installer/
# Mac: brew install mysql

# MySQL 실행 확인
mysql --version
```

### 2단계: 실행
```bash
cd samples/backend

# 패키지 설치
npm install

# .env 설정
echo "DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=loyalty_points
PORT=3000" > .env

# DB 스키마 생성
mysql -u root -p < database/schema.sql
# 비밀번호 입력

# 서버 실행
npm start
```

### 3단계: 테스트
새 터미널에서:
```bash
# 사용자 조회
curl http://localhost:3000/api/users

# 포인트 적립
curl -X POST http://localhost:3000/api/points/earn \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "amount": 1000, "description": "테스트"}'

# 결과 확인
curl http://localhost:3000/api/users/1
```

✅ 성공! 백엔드 버전 완료

---

## ⛓️ 블록체인 버전 (5분)

### 1단계: 준비
```bash
# Node.js 18+ 설치 확인
node --version

# MetaMask 브라우저 확장 설치
# https://metamask.io
```

### 2단계: 실행
```bash
cd samples/blockchain

# 패키지 설치
npm install

# 컴파일
npm run compile

# 테스트 (선택사항)
npm test
```

### 3단계: 로컬 배포
**터미널 1 - 로컬 블록체인 실행:**
```bash
npm run node

# 출력된 개인키 중 하나 복사 (Account #0)
# Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**터미널 2 - 배포:**
```bash
npm run deploy:local

# 출력:
# ✅ 배포 완료!
# 컨트랙트 주소: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 4단계: MetaMask 설정

1. **네트워크 추가**
   - MetaMask 열기
   - 네트워크 드롭다운 → 네트워크 추가
   - 수동으로 네트워크 추가:
     ```
     네트워크 이름: Hardhat Local
     RPC URL: http://127.0.0.1:8545
     체인 ID: 31337
     통화 기호: ETH
     ```

2. **계정 가져오기**
   - 계정 아이콘 → 계정 가져오기
   - 개인 키 입력 (터미널 1에서 복사한 키)
   - 가져오기

✅ 성공! 10000 ETH를 볼 수 있어야 함

### 5단계: 프론트엔드 실행
```bash
cd samples/frontend

npm install

# App.jsx에서 컨트랙트 주소 변경
# CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

npm run dev
```

브라우저: http://localhost:5173

1. "지갑 연결" 클릭
2. MetaMask에서 승인
3. DApp 사용 시작!

✅ 성공! 블록체인 버전 완료

---

## 🎯 다음 단계

### 백엔드 학습
1. `backend/server.js` 코드 읽기
2. 다른 API 엔드포인트 호출해보기
3. MySQL에서 데이터 직접 확인

```bash
mysql -u root -p loyalty_points
SELECT * FROM users;
SELECT * FROM point_transactions;
```

### 블록체인 학습
1. `contracts/LoyaltyToken.sol` 코드 읽기
2. 테스트 코드 분석 (`test/LoyaltyToken.test.js`)
3. Hardhat 콘솔에서 컨트랙트 상호작용

```bash
npx hardhat console --network localhost

const Token = await ethers.getContractFactory("LoyaltyToken");
const token = await Token.attach("0x5FbDB...");
await token.balanceOf("주소");
```

---

## 🐛 문제 해결

### 백엔드

**MySQL 연결 실패**
```bash
# MySQL 서비스 시작
# Windows: 서비스에서 MySQL 시작
# Mac: brew services start mysql
# Linux: sudo systemctl start mysql
```

**포트 충돌**
```bash
# .env에서 포트 변경
PORT=3001
```

### 블록체인

**`npm run node` 실행 안 됨**
```bash
# Hardhat 재설치
rm -rf node_modules package-lock.json
npm install
```

**MetaMask 연결 안 됨**
1. 브라우저 새로고침
2. MetaMask 잠금 해제
3. 올바른 네트워크 선택 (Hardhat Local)
4. 사이트 연결 권한 확인

**트랜잭션 실패**
```bash
# MetaMask에서 계정 재설정
# 설정 → 고급 → 계정 재설정
```

---

## 📝 체크리스트

### 백엔드 ✅
- [ ] MySQL 설치 및 실행
- [ ] 패키지 설치 (`npm install`)
- [ ] 환경 변수 설정 (`.env`)
- [ ] 데이터베이스 스키마 생성
- [ ] 서버 실행 (`npm start`)
- [ ] API 테스트 (curl)

### 블록체인 ✅
- [ ] Node.js 18+ 설치
- [ ] MetaMask 설치
- [ ] 패키지 설치 (`npm install`)
- [ ] 컴파일 (`npm run compile`)
- [ ] 로컬 노드 실행 (`npm run node`)
- [ ] 컨트랙트 배포 (`npm run deploy:local`)
- [ ] MetaMask 네트워크 추가
- [ ] MetaMask 계정 가져오기
- [ ] 프론트엔드 실행 (`npm run dev`)
- [ ] 지갑 연결 및 테스트

---

## 🎓 다음 학습 추천

1. **비교하기**
   - 같은 기능을 백엔드/블록체인에서 어떻게 구현했는지 비교
   - `README.md`의 "기능 비교" 섹션 참고

2. **수정해보기**
   - 새로운 기능 추가 (예: 포인트 만료일)
   - 백엔드와 블록체인 버전 모두 수정

3. **배포하기**
   - 백엔드: AWS, Heroku에 배포
   - 블록체인: Sepolia 테스트넷에 배포

4. **심화 학습**
   - Gas 최적화
   - 보안 감사
   - 업그레이드 패턴

---

**도움이 필요하면**:
- 📚 `README.md` 전체 가이드 참고
- 💬 GitHub Issues에 질문하기
