-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS loyalty_points;
USE loyalty_points;

-- 사용자 테이블
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 포인트 거래 내역 테이블
CREATE TABLE point_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    amount INT NOT NULL,
    type ENUM('earn', 'spend') NOT NULL,
    description VARCHAR(200),
    balance_after INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- 샘플 데이터 삽입
INSERT INTO users (username, email, points) VALUES
    ('alice', 'alice@example.com', 1000),
    ('bob', 'bob@example.com', 500),
    ('charlie', 'charlie@example.com', 0);

INSERT INTO point_transactions (user_id, amount, type, description, balance_after) VALUES
    (1, 1000, 'earn', '회원가입 보너스', 1000),
    (2, 500, 'earn', '첫 구매 적립', 500);
