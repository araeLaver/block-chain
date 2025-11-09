const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LoyaltyToken 테스트", function () {
  let token;
  let owner;
  let user1;
  let user2;

  const MAX_SUPPLY = ethers.parseUnits("1000000", 0); // 100만 포인트

  beforeEach(async function () {
    // 계정 가져오기
    [owner, user1, user2] = await ethers.getSigners();

    // 컨트랙트 배포
    const LoyaltyToken = await ethers.getContractFactory("LoyaltyToken");
    token = await LoyaltyToken.deploy(MAX_SUPPLY);
    await token.waitForDeployment();
  });

  describe("배포 테스트", function () {
    it("올바른 토큰 정보를 가져야 함", async function () {
      expect(await token.name()).to.equal("Loyalty Points");
      expect(await token.symbol()).to.equal("LPT");
      expect(await token.decimals()).to.equal(0);
    });

    it("올바른 소유자를 가져야 함", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });

    it("올바른 최대 발행량을 가져야 함", async function () {
      expect(await token.maxSupply()).to.equal(MAX_SUPPLY);
    });
  });

  describe("포인트 적립 (earnPoints)", function () {
    it("소유자는 포인트를 적립할 수 있어야 함", async function () {
      const amount = ethers.parseUnits("1000", 0);

      await expect(
        token.earnPoints(user1.address, amount, "테스트 적립")
      )
        .to.emit(token, "PointsEarned")
        .withArgs(user1.address, amount, "테스트 적립", amount);

      expect(await token.balanceOf(user1.address)).to.equal(amount);
    });

    it("통계가 올바르게 업데이트되어야 함", async function () {
      const amount = ethers.parseUnits("1000", 0);

      await token.earnPoints(user1.address, amount, "테스트 적립");

      const stats = await token.getUserStats(user1.address);
      expect(stats.totalEarned).to.equal(amount);
      expect(stats.earnCount).to.equal(1);
    });

    it("소유자가 아닌 사람은 적립할 수 없어야 함", async function () {
      const amount = ethers.parseUnits("1000", 0);

      await expect(
        token.connect(user1).earnPoints(user2.address, amount, "테스트")
      ).to.be.reverted;
    });

    it("0 포인트는 적립할 수 없어야 함", async function () {
      await expect(
        token.earnPoints(user1.address, 0, "테스트")
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("최대 발행량을 초과할 수 없어야 함", async function () {
      const overAmount = MAX_SUPPLY + ethers.parseUnits("1", 0);

      await expect(
        token.earnPoints(user1.address, overAmount, "테스트")
      ).to.be.revertedWith("Exceeds max supply");
    });
  });

  describe("포인트 사용 (spendPoints)", function () {
    beforeEach(async function () {
      // 먼저 포인트 적립
      const amount = ethers.parseUnits("1000", 0);
      await token.earnPoints(user1.address, amount, "초기 적립");
    });

    it("포인트를 사용할 수 있어야 함", async function () {
      const spendAmount = ethers.parseUnits("300", 0);
      const remainingBalance = ethers.parseUnits("700", 0);

      await expect(
        token.connect(user1).spendPoints(spendAmount, "상품 구매")
      )
        .to.emit(token, "PointsSpent")
        .withArgs(user1.address, spendAmount, "상품 구매", remainingBalance);

      expect(await token.balanceOf(user1.address)).to.equal(remainingBalance);
    });

    it("통계가 올바르게 업데이트되어야 함", async function () {
      const spendAmount = ethers.parseUnits("300", 0);

      await token.connect(user1).spendPoints(spendAmount, "상품 구매");

      const stats = await token.getUserStats(user1.address);
      expect(stats.totalSpent).to.equal(spendAmount);
      expect(stats.spendCount).to.equal(1);
    });

    it("잔액이 부족하면 사용할 수 없어야 함", async function () {
      const overAmount = ethers.parseUnits("2000", 0);

      await expect(
        token.connect(user1).spendPoints(overAmount, "테스트")
      ).to.be.revertedWith("Insufficient balance");
    });

    it("0 포인트는 사용할 수 없어야 함", async function () {
      await expect(
        token.connect(user1).spendPoints(0, "테스트")
      ).to.be.revertedWith("Amount must be greater than 0");
    });
  });

  describe("포인트 전송 (transfer)", function () {
    beforeEach(async function () {
      const amount = ethers.parseUnits("1000", 0);
      await token.earnPoints(user1.address, amount, "초기 적립");
    });

    it("포인트를 전송할 수 있어야 함", async function () {
      const transferAmount = ethers.parseUnits("300", 0);

      await expect(
        token.connect(user1).transfer(user2.address, transferAmount)
      )
        .to.emit(token, "PointsTransferred")
        .withArgs(user1.address, user2.address, transferAmount);

      expect(await token.balanceOf(user1.address)).to.equal(
        ethers.parseUnits("700", 0)
      );
      expect(await token.balanceOf(user2.address)).to.equal(transferAmount);
    });

    it("잔액이 부족하면 전송할 수 없어야 함", async function () {
      const overAmount = ethers.parseUnits("2000", 0);

      await expect(
        token.connect(user1).transfer(user2.address, overAmount)
      ).to.be.reverted;
    });
  });

  describe("대량 적립 (batchEarnPoints)", function () {
    it("여러 사용자에게 동시에 적립할 수 있어야 함", async function () {
      const users = [user1.address, user2.address];
      const amounts = [
        ethers.parseUnits("1000", 0),
        ethers.parseUnits("2000", 0)
      ];

      await token.batchEarnPoints(users, amounts, "대량 적립");

      expect(await token.balanceOf(user1.address)).to.equal(amounts[0]);
      expect(await token.balanceOf(user2.address)).to.equal(amounts[1]);
    });

    it("배열 길이가 다르면 실패해야 함", async function () {
      const users = [user1.address, user2.address];
      const amounts = [ethers.parseUnits("1000", 0)];

      await expect(
        token.batchEarnPoints(users, amounts, "테스트")
      ).to.be.revertedWith("Array length mismatch");
    });
  });

  describe("통계 조회 (getUserStats)", function () {
    it("올바른 통계를 반환해야 함", async function () {
      // 적립
      const earnAmount = ethers.parseUnits("1000", 0);
      await token.earnPoints(user1.address, earnAmount, "적립 1");
      await token.earnPoints(user1.address, earnAmount, "적립 2");

      // 사용
      const spendAmount = ethers.parseUnits("300", 0);
      await token.connect(user1).spendPoints(spendAmount, "사용 1");

      const stats = await token.getUserStats(user1.address);

      expect(stats.currentBalance).to.equal(
        ethers.parseUnits("1700", 0)
      );
      expect(stats.totalEarned).to.equal(
        ethers.parseUnits("2000", 0)
      );
      expect(stats.totalSpent).to.equal(spendAmount);
      expect(stats.earnCount).to.equal(2);
      expect(stats.spendCount).to.equal(1);
    });
  });
});
