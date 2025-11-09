const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const Joi = require('joi');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors());
app.use(express.json());

// 데이터베이스 연결 풀
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ============================================
// 유효성 검증 스키마
// ============================================
const earnPointsSchema = Joi.object({
    userId: Joi.number().integer().positive().required(),
    amount: Joi.number().integer().positive().required(),
    description: Joi.string().max(200).required()
});

const spendPointsSchema = Joi.object({
    userId: Joi.number().integer().positive().required(),
    amount: Joi.number().integer().positive().required(),
    description: Joi.string().max(200).required()
});

// ============================================
// API 엔드포인트
// ============================================

// 1. 모든 사용자 조회
app.get('/api/users', async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, username, email, points, created_at FROM users ORDER BY created_at DESC'
        );

        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('사용자 조회 오류:', error);
        res.status(500).json({
            success: false,
            error: '사용자 조회 실패'
        });
    }
});

// 2. 특정 사용자 조회
app.get('/api/users/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const [users] = await pool.query(
            'SELECT id, username, email, points, created_at FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                error: '사용자를 찾을 수 없습니다'
            });
        }

        res.json({
            success: true,
            data: users[0]
        });
    } catch (error) {
        console.error('사용자 조회 오류:', error);
        res.status(500).json({
            success: false,
            error: '사용자 조회 실패'
        });
    }
});

// 3. 포인트 적립 (중요!)
app.post('/api/points/earn', async (req, res) => {
    // 입력 검증
    const { error, value } = earnPointsSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            error: error.details[0].message
        });
    }

    const { userId, amount, description } = value;
    const connection = await pool.getConnection();

    try {
        // 트랜잭션 시작
        await connection.beginTransaction();

        // 1. 사용자 존재 확인
        const [users] = await connection.query(
            'SELECT id, points FROM users WHERE id = ? FOR UPDATE',
            [userId]
        );

        if (users.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                error: '사용자를 찾을 수 없습니다'
            });
        }

        const currentPoints = users[0].points;
        const newPoints = currentPoints + amount;

        // 2. 포인트 증가
        await connection.query(
            'UPDATE users SET points = ? WHERE id = ?',
            [newPoints, userId]
        );

        // 3. 거래 내역 기록
        const [result] = await connection.query(
            'INSERT INTO point_transactions (user_id, amount, type, description, balance_after) VALUES (?, ?, ?, ?, ?)',
            [userId, amount, 'earn', description, newPoints]
        );

        // 커밋
        await connection.commit();

        res.json({
            success: true,
            message: '포인트 적립 완료',
            data: {
                transactionId: result.insertId,
                userId: userId,
                amount: amount,
                balanceBefore: currentPoints,
                balanceAfter: newPoints,
                description: description
            }
        });

    } catch (error) {
        // 에러 시 롤백
        await connection.rollback();
        console.error('포인트 적립 오류:', error);
        res.status(500).json({
            success: false,
            error: '포인트 적립 실패'
        });
    } finally {
        connection.release();
    }
});

// 4. 포인트 사용
app.post('/api/points/spend', async (req, res) => {
    // 입력 검증
    const { error, value } = spendPointsSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            error: error.details[0].message
        });
    }

    const { userId, amount, description } = value;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. 사용자 존재 확인 및 잔액 확인
        const [users] = await connection.query(
            'SELECT id, points FROM users WHERE id = ? FOR UPDATE',
            [userId]
        );

        if (users.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                error: '사용자를 찾을 수 없습니다'
            });
        }

        const currentPoints = users[0].points;

        // 2. 잔액 부족 확인
        if (currentPoints < amount) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                error: '포인트 잔액이 부족합니다',
                data: {
                    required: amount,
                    available: currentPoints,
                    shortage: amount - currentPoints
                }
            });
        }

        const newPoints = currentPoints - amount;

        // 3. 포인트 차감
        await connection.query(
            'UPDATE users SET points = ? WHERE id = ?',
            [newPoints, userId]
        );

        // 4. 거래 내역 기록
        const [result] = await connection.query(
            'INSERT INTO point_transactions (user_id, amount, type, description, balance_after) VALUES (?, ?, ?, ?, ?)',
            [userId, amount, 'spend', description, newPoints]
        );

        await connection.commit();

        res.json({
            success: true,
            message: '포인트 사용 완료',
            data: {
                transactionId: result.insertId,
                userId: userId,
                amount: amount,
                balanceBefore: currentPoints,
                balanceAfter: newPoints,
                description: description
            }
        });

    } catch (error) {
        await connection.rollback();
        console.error('포인트 사용 오류:', error);
        res.status(500).json({
            success: false,
            error: '포인트 사용 실패'
        });
    } finally {
        connection.release();
    }
});

// 5. 포인트 거래 내역 조회
app.get('/api/points/history/:userId', async (req, res) => {
    const { userId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    try {
        // 전체 개수 조회
        const [countResult] = await pool.query(
            'SELECT COUNT(*) as total FROM point_transactions WHERE user_id = ?',
            [userId]
        );

        // 거래 내역 조회
        const [transactions] = await pool.query(
            `SELECT
                id,
                amount,
                type,
                description,
                balance_after,
                created_at
            FROM point_transactions
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?`,
            [userId, parseInt(limit), parseInt(offset)]
        );

        res.json({
            success: true,
            data: {
                total: countResult[0].total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                transactions: transactions
            }
        });

    } catch (error) {
        console.error('거래 내역 조회 오류:', error);
        res.status(500).json({
            success: false,
            error: '거래 내역 조회 실패'
        });
    }
});

// 6. 포인트 통계 조회
app.get('/api/points/stats/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const [stats] = await pool.query(
            `SELECT
                SUM(CASE WHEN type = 'earn' THEN amount ELSE 0 END) as total_earned,
                SUM(CASE WHEN type = 'spend' THEN amount ELSE 0 END) as total_spent,
                COUNT(CASE WHEN type = 'earn' THEN 1 END) as earn_count,
                COUNT(CASE WHEN type = 'spend' THEN 1 END) as spend_count
            FROM point_transactions
            WHERE user_id = ?`,
            [userId]
        );

        const [user] = await pool.query(
            'SELECT points FROM users WHERE id = ?',
            [userId]
        );

        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                error: '사용자를 찾을 수 없습니다'
            });
        }

        res.json({
            success: true,
            data: {
                currentBalance: user[0].points,
                totalEarned: stats[0].total_earned || 0,
                totalSpent: stats[0].total_spent || 0,
                earnCount: stats[0].earn_count || 0,
                spendCount: stats[0].spend_count || 0
            }
        });

    } catch (error) {
        console.error('통계 조회 오류:', error);
        res.status(500).json({
            success: false,
            error: '통계 조회 실패'
        });
    }
});

// 헬스 체크
app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'error', database: 'disconnected' });
    }
});

// 404 핸들러
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: '요청한 엔드포인트를 찾을 수 없습니다'
    });
});

// 에러 핸들러
app.use((err, req, res, next) => {
    console.error('서버 에러:', err);
    res.status(500).json({
        success: false,
        error: '서버 내부 오류가 발생했습니다'
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║  백엔드 포인트 시스템 서버 실행 중    ║
╠════════════════════════════════════════╣
║  포트: ${PORT}                         ║
║  환경: ${process.env.NODE_ENV || 'development'}        ║
╚════════════════════════════════════════╝

API 엔드포인트:
  GET    /api/users              - 모든 사용자 조회
  GET    /api/users/:userId      - 특정 사용자 조회
  POST   /api/points/earn        - 포인트 적립
  POST   /api/points/spend       - 포인트 사용
  GET    /api/points/history/:userId - 거래 내역
  GET    /api/points/stats/:userId   - 포인트 통계
  GET    /health                 - 헬스 체크
    `);
});

module.exports = app;
