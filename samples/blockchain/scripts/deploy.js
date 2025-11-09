const hre = require("hardhat");

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  LoyaltyToken 컨트랙트 배포 시작");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // 배포 계정 정보
  const [deployer] = await hre.ethers.getSigners();
  console.log("배포 계정:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("계정 잔액:", hre.ethers.formatEther(balance), "ETH\n");

  // 컨트랙트 배포
  console.log("컨트랙트 컴파일 및 배포 중...");

  const maxSupply = hre.ethers.parseUnits("1000000", 0); // 최대 100만 포인트
  const LoyaltyToken = await hre.ethers.getContractFactory("LoyaltyToken");
  const token = await LoyaltyToken.deploy(maxSupply);

  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();

  console.log("\n✅ 배포 완료!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("컨트랙트 주소:", tokenAddress);
  console.log("토큰 이름:", await token.name());
  console.log("토큰 심볼:", await token.symbol());
  console.log("최대 발행량:", hre.ethers.formatUnits(await token.maxSupply(), 0));
  console.log("소유자:", await token.owner());
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // 컨트랙트 검증 명령어 출력
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("컨트랙트 검증 (Etherscan):");
    console.log(`npx hardhat verify --network ${hre.network.name} ${tokenAddress} ${maxSupply.toString()}\n`);
  }

  // 샘플 트랜잭션 실행 (로컬/테스트넷만)
  if (hre.network.name === "localhost" || hre.network.name === "hardhat") {
    console.log("샘플 트랜잭션 실행 중...\n");

    // 1. 포인트 적립
    console.log("1️⃣ 포인트 적립:");
    const earnTx = await token.earnPoints(
      deployer.address,
      1000,
      "회원가입 보너스"
    );
    await earnTx.wait();
    console.log("   ✓ 1,000 포인트 적립 완료");

    // 2. 잔액 확인
    const balance1 = await token.balanceOf(deployer.address);
    console.log("   현재 잔액:", hre.ethers.formatUnits(balance1, 0), "포인트\n");

    // 3. 포인트 사용
    console.log("2️⃣ 포인트 사용:");
    const spendTx = await token.spendPoints(300, "상품 구매");
    await spendTx.wait();
    console.log("   ✓ 300 포인트 사용 완료");

    // 4. 최종 잔액
    const balance2 = await token.balanceOf(deployer.address);
    console.log("   현재 잔액:", hre.ethers.formatUnits(balance2, 0), "포인트\n");

    // 5. 통계 조회
    console.log("3️⃣ 사용자 통계:");
    const stats = await token.getUserStats(deployer.address);
    console.log("   현재 잔액:", hre.ethers.formatUnits(stats.currentBalance, 0));
    console.log("   총 적립:", hre.ethers.formatUnits(stats.totalEarned, 0));
    console.log("   총 사용:", hre.ethers.formatUnits(stats.totalSpent, 0));
    console.log("   적립 횟수:", stats.earnCount.toString());
    console.log("   사용 횟수:", stats.spendCount.toString());
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  배포 및 테스트 완료!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ 에러 발생:");
    console.error(error);
    process.exit(1);
  });
