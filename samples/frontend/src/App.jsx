import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

// 컨트랙트 ABI (실제로는 JSON 파일에서 import)
const CONTRACT_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function earnPoints(address user, uint256 amount, string reason)",
  "function spendPoints(uint256 amount, string reason)",
  "function transfer(address to, uint256 amount)",
  "function getUserStats(address user) view returns (uint256, uint256, uint256, uint256, uint256)",
  "function owner() view returns (address)",
  "event PointsEarned(address indexed user, uint256 amount, string reason, uint256 newBalance)",
  "event PointsSpent(address indexed user, uint256 amount, string reason, uint256 newBalance)",
  "event PointsTransferred(address indexed from, address indexed to, uint256 amount)"
];

// 컨트랙트 주소 (배포 후 업데이트 필요)
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";

function App() {
  // 상태 관리
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [stats, setStats] = useState(null);
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 폼 입력값
  const [earnAddress, setEarnAddress] = useState('');
  const [earnAmount, setEarnAmount] = useState('');
  const [earnReason, setEarnReason] = useState('');
  const [spendAmount, setSpendAmount] = useState('');
  const [spendReason, setSpendReason] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  // ============================================
  // 지갑 연결
  // ============================================
  const connectWallet = async () => {
    try {
      setError('');

      if (!window.ethereum) {
        setError('MetaMask를 설치해주세요!');
        return;
      }

      // MetaMask 연결 요청
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      setAccount(userAddress);

      // 컨트랙트 연결
      const tokenContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      setContract(tokenContract);

      // 소유자 확인
      const ownerAddress = await tokenContract.owner();
      setIsOwner(ownerAddress.toLowerCase() === userAddress.toLowerCase());

      // 잔액 조회
      await loadBalance(tokenContract, userAddress);
      await loadStats(tokenContract, userAddress);

      setSuccess('지갑 연결 성공!');

    } catch (err) {
      console.error('지갑 연결 오류:', err);
      setError('지갑 연결 실패: ' + err.message);
    }
  };

  // ============================================
  // 데이터 로드
  // ============================================
  const loadBalance = async (contractInstance, address) => {
    try {
      const bal = await contractInstance.balanceOf(address);
      setBalance(ethers.formatUnits(bal, 0));
    } catch (err) {
      console.error('잔액 조회 오류:', err);
    }
  };

  const loadStats = async (contractInstance, address) => {
    try {
      const userStats = await contractInstance.getUserStats(address);
      setStats({
        currentBalance: ethers.formatUnits(userStats[0], 0),
        totalEarned: ethers.formatUnits(userStats[1], 0),
        totalSpent: ethers.formatUnits(userStats[2], 0),
        earnCount: userStats[3].toString(),
        spendCount: userStats[4].toString()
      });
    } catch (err) {
      console.error('통계 조회 오류:', err);
    }
  };

  // ============================================
  // 포인트 적립 (관리자만)
  // ============================================
  const handleEarnPoints = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const tx = await contract.earnPoints(
        earnAddress,
        ethers.parseUnits(earnAmount, 0),
        earnReason
      );

      setSuccess('트랜잭션 전송 중...');
      const receipt = await tx.wait();

      setSuccess(`포인트 적립 완료! (Tx: ${receipt.hash.slice(0, 10)}...)`);

      // 데이터 새로고침
      await loadBalance(contract, account);
      await loadStats(contract, account);

      // 폼 초기화
      setEarnAddress('');
      setEarnAmount('');
      setEarnReason('');

    } catch (err) {
      console.error('포인트 적립 오류:', err);
      setError('포인트 적립 실패: ' + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 포인트 사용
  // ============================================
  const handleSpendPoints = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const tx = await contract.spendPoints(
        ethers.parseUnits(spendAmount, 0),
        spendReason
      );

      setSuccess('트랜잭션 전송 중...');
      const receipt = await tx.wait();

      setSuccess(`포인트 사용 완료! (Tx: ${receipt.hash.slice(0, 10)}...)`);

      // 데이터 새로고침
      await loadBalance(contract, account);
      await loadStats(contract, account);

      // 폼 초기화
      setSpendAmount('');
      setSpendReason('');

    } catch (err) {
      console.error('포인트 사용 오류:', err);
      setError('포인트 사용 실패: ' + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 포인트 전송
  // ============================================
  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const tx = await contract.transfer(
        transferTo,
        ethers.parseUnits(transferAmount, 0)
      );

      setSuccess('트랜잭션 전송 중...');
      const receipt = await tx.wait();

      setSuccess(`포인트 전송 완료! (Tx: ${receipt.hash.slice(0, 10)}...)`);

      // 데이터 새로고침
      await loadBalance(contract, account);
      await loadStats(contract, account);

      // 폼 초기화
      setTransferTo('');
      setTransferAmount('');

    } catch (err) {
      console.error('포인트 전송 오류:', err);
      setError('포인트 전송 실패: ' + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 계정 변경 감지
  // ============================================
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          window.location.reload();
        } else {
          setAccount(null);
          setContract(null);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  // ============================================
  // UI 렌더링
  // ============================================
  return (
    <div className="app">
      <header className="header">
        <h1>🪙 Loyalty Points DApp</h1>
        {account ? (
          <div className="account-info">
            <p>연결된 계정: {account.slice(0, 6)}...{account.slice(-4)}</p>
            {isOwner && <span className="badge">관리자</span>}
          </div>
        ) : (
          <button onClick={connectWallet} className="connect-btn">
            지갑 연결
          </button>
        )}
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {account && contract && (
        <div className="container">
          {/* 잔액 및 통계 */}
          <div className="card stats-card">
            <h2>📊 내 포인트</h2>
            <div className="balance">
              <span className="balance-amount">{balance}</span>
              <span className="balance-label">포인트</span>
            </div>

            {stats && (
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-label">총 적립</div>
                  <div className="stat-value">{stats.totalEarned}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">총 사용</div>
                  <div className="stat-value">{stats.totalSpent}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">적립 횟수</div>
                  <div className="stat-value">{stats.earnCount}회</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">사용 횟수</div>
                  <div className="stat-value">{stats.spendCount}회</div>
                </div>
              </div>
            )}
          </div>

          {/* 포인트 적립 (관리자만) */}
          {isOwner && (
            <div className="card">
              <h2>➕ 포인트 적립 (관리자)</h2>
              <form onSubmit={handleEarnPoints}>
                <div className="form-group">
                  <label>사용자 주소</label>
                  <input
                    type="text"
                    value={earnAddress}
                    onChange={(e) => setEarnAddress(e.target.value)}
                    placeholder="0x..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>포인트 양</label>
                  <input
                    type="number"
                    value={earnAmount}
                    onChange={(e) => setEarnAmount(e.target.value)}
                    placeholder="1000"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>적립 사유</label>
                  <input
                    type="text"
                    value={earnReason}
                    onChange={(e) => setEarnReason(e.target.value)}
                    placeholder="회원가입 보너스"
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? '처리 중...' : '포인트 적립'}
                </button>
              </form>
            </div>
          )}

          {/* 포인트 사용 */}
          <div className="card">
            <h2>💸 포인트 사용</h2>
            <form onSubmit={handleSpendPoints}>
              <div className="form-group">
                <label>사용할 포인트</label>
                <input
                  type="number"
                  value={spendAmount}
                  onChange={(e) => setSpendAmount(e.target.value)}
                  placeholder="100"
                  max={balance}
                  required
                />
              </div>
              <div className="form-group">
                <label>사용 사유</label>
                <input
                  type="text"
                  value={spendReason}
                  onChange={(e) => setSpendReason(e.target.value)}
                  placeholder="상품 구매"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-danger">
                {loading ? '처리 중...' : '포인트 사용'}
              </button>
            </form>
          </div>

          {/* 포인트 전송 */}
          <div className="card">
            <h2>🔄 포인트 전송</h2>
            <form onSubmit={handleTransfer}>
              <div className="form-group">
                <label>받는 사람 주소</label>
                <input
                  type="text"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  placeholder="0x..."
                  required
                />
              </div>
              <div className="form-group">
                <label>전송할 포인트</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="100"
                  max={balance}
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? '처리 중...' : '포인트 전송'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
