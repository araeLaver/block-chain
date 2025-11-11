// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LoyaltyToken
 * @dev 블록체인 기반 포인트 토큰 시스템
 *
 * 기능:
 * - ERC-20 표준 토큰
 * - 포인트 적립 (민팅)
 * - 포인트 사용 (소각)
 * - 포인트 전송
 * - 이벤트 기록
 */
contract LoyaltyToken is ERC20, Ownable {

    // ============================================
    // 상태 변수
    // ============================================

    // 포인트 소수점 자리수 (0 = 정수만)
    uint8 private constant DECIMALS = 0;

    // 총 발행량 제한 (옵션)
    uint256 public maxSupply;

    // 사용자별 포인트 적립/사용 통계
    struct UserStats {
        uint256 totalEarned;    // 총 적립량
        uint256 totalSpent;     // 총 사용량
        uint256 earnCount;      // 적립 횟수
        uint256 spendCount;     // 사용 횟수
    }

    mapping(address => UserStats) public userStats;

    // ============================================
    // 이벤트
    // ============================================

    event PointsEarned(
        address indexed user,
        uint256 amount,
        string reason,
        uint256 newBalance
    );

    event PointsSpent(
        address indexed user,
        uint256 amount,
        string reason,
        uint256 newBalance
    );

    event PointsTransferred(
        address indexed from,
        address indexed to,
        uint256 amount
    );

    event MaxSupplyUpdated(
        uint256 oldMaxSupply,
        uint256 newMaxSupply
    );

    // ============================================
    // 생성자
    // ============================================

    /**
     * @dev 컨트랙트 생성자
     * @param _maxSupply 최대 발행량 (0 = 무제한)
     */
    constructor(uint256 _maxSupply) ERC20("Loyalty Points", "LPT") {
        maxSupply = _maxSupply;
        _transferOwnership(msg.sender);
    }

    // ============================================
    // 핵심 기능
    // ============================================

    /**
     * @dev 포인트 적립 (관리자만 가능)
     * @param user 적립받을 사용자 주소
     * @param amount 적립할 포인트 양
     * @param reason 적립 사유
     */
    function earnPoints(
        address user,
        uint256 amount,
        string memory reason
    ) external onlyOwner {
        require(user != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than 0");

        // 최대 발행량 체크
        if (maxSupply > 0) {
            require(
                totalSupply() + amount <= maxSupply,
                "Exceeds max supply"
            );
        }

        // 포인트 민팅
        _mint(user, amount);

        // 통계 업데이트
        userStats[user].totalEarned += amount;
        userStats[user].earnCount += 1;

        emit PointsEarned(user, amount, reason, balanceOf(user));
    }

    /**
     * @dev 포인트 사용 (사용자가 직접 호출)
     * @param amount 사용할 포인트 양
     * @param reason 사용 사유
     */
    function spendPoints(uint256 amount, string memory reason) external {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        // 포인트 소각
        _burn(msg.sender, amount);

        // 통계 업데이트
        userStats[msg.sender].totalSpent += amount;
        userStats[msg.sender].spendCount += 1;

        emit PointsSpent(msg.sender, amount, reason, balanceOf(msg.sender));
    }

    /**
     * @dev 포인트 전송 (ERC-20 transfer 오버라이드)
     * @param to 받는 사람 주소
     * @param amount 전송할 포인트 양
     */
    function transfer(address to, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        bool success = super.transfer(to, amount);
        if (success) {
            emit PointsTransferred(msg.sender, to, amount);
        }
        return success;
    }

    /**
     * @dev 대신 전송 (ERC-20 transferFrom 오버라이드)
     */
    function transferFrom(address from, address to, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        bool success = super.transferFrom(from, to, amount);
        if (success) {
            emit PointsTransferred(from, to, amount);
        }
        return success;
    }

    // ============================================
    // 조회 기능 (view 함수 - 가스비 없음)
    // ============================================

    /**
     * @dev 사용자 통계 조회
     * @param user 조회할 사용자 주소
     */
    function getUserStats(address user)
        external
        view
        returns (
            uint256 currentBalance,
            uint256 totalEarned,
            uint256 totalSpent,
            uint256 earnCount,
            uint256 spendCount
        )
    {
        UserStats memory stats = userStats[user];
        return (
            balanceOf(user),
            stats.totalEarned,
            stats.totalSpent,
            stats.earnCount,
            stats.spendCount
        );
    }

    /**
     * @dev 포인트 소수점 자리수 반환
     */
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    // ============================================
    // 관리자 기능
    // ============================================

    /**
     * @dev 최대 발행량 변경 (관리자만 가능)
     * @param _newMaxSupply 새로운 최대 발행량
     */
    function updateMaxSupply(uint256 _newMaxSupply) external onlyOwner {
        require(
            _newMaxSupply == 0 || _newMaxSupply >= totalSupply(),
            "New max supply must be >= current supply"
        );

        uint256 oldMaxSupply = maxSupply;
        maxSupply = _newMaxSupply;

        emit MaxSupplyUpdated(oldMaxSupply, _newMaxSupply);
    }

    /**
     * @dev 긴급 상황 시 포인트 회수 (관리자만 가능)
     * @param user 회수할 사용자 주소
     * @param amount 회수할 포인트 양
     * @param reason 회수 사유
     */
    function emergencyBurn(
        address user,
        uint256 amount,
        string memory reason
    ) external onlyOwner {
        require(user != address(0), "Invalid address");
        require(balanceOf(user) >= amount, "Insufficient balance");

        _burn(user, amount);

        emit PointsSpent(user, amount, reason, balanceOf(user));
    }

    /**
     * @dev 대량 포인트 적립 (관리자만 가능)
     * @param users 사용자 주소 배열
     * @param amounts 적립할 포인트 배열
     * @param reason 적립 사유
     */
    function batchEarnPoints(
        address[] memory users,
        uint256[] memory amounts,
        string memory reason
    ) external onlyOwner {
        require(users.length == amounts.length, "Array length mismatch");
        require(users.length > 0, "Empty array");

        for (uint256 i = 0; i < users.length; i++) {
            require(users[i] != address(0), "Invalid address");
            require(amounts[i] > 0, "Amount must be greater than 0");

            // 최대 발행량 체크
            if (maxSupply > 0) {
                require(
                    totalSupply() + amounts[i] <= maxSupply,
                    "Exceeds max supply"
                );
            }

            _mint(users[i], amounts[i]);

            userStats[users[i]].totalEarned += amounts[i];
            userStats[users[i]].earnCount += 1;

            emit PointsEarned(users[i], amounts[i], reason, balanceOf(users[i]));
        }
    }
}
