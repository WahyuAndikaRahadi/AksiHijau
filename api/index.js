import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Muat variabel lingkungan dari .env jika bukan di lingkungan produksi
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const { Pool } = pg;
const app = express();

// Konfigurasi koneksi database PostgreSQL menggunakan Pool (Neon DB)
const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_ILAhyxw70zOt@ep-noisy-wave-ad17xbgh-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: {
        rejectUnauthorized: false
    }
});

// JWT Secret
const JWT_SECRET = 'VqZ3x&Rk7y!pA9sT2uF4gHj8nK0lM1bC6dE5aO$q@W#eYzX%vBnMqZ3xRk7yP9sT2uF4gHj8nK0lM1b';

// Middleware
app.use(cors());
app.use(express.json());

// Middleware kustom untuk membersihkan URL masuk
app.use((req, res, next) => {
    console.log(`Original Incoming request: ${req.method} ${req.url}`);

    // Hapus prefiks /api/ jika ada
    if (req.url.startsWith('/api/')) {
        req.url = req.url.substring(4);
    }

    // Hapus parameter query '?path=' jika ada (Vercel)
    const queryParamIndex = req.url.indexOf('?path=');
    if (queryParamIndex !== -1) {
        req.url = req.url.substring(0, queryParamIndex);
    }

    console.log(`Cleaned Request URL for Express: ${req.method} ${req.url}`);
    next();
});

// Middleware untuk mencatat setiap permintaan
app.use((req, res, next) => {
    console.log(`Incoming request (after cleanup): ${req.method} ${req.url}`);
    next();
});

// ============================================
// MIDDLEWARE - Authentication
// ============================================
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token tidak ditemukan' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token tidak valid' });
        }
        req.user = user;
        next();
    });
};

// Admin Only Middleware
const adminOnly = (req, res, next) => {
    if (!req.user?.is_admin) {
        return res.status(403).json({ error: 'Akses ditolak. Hanya admin yang diizinkan.' });
    }
    next();
};

// ============================================
// AUTH ROUTES
// ============================================

// POST: Register user baru
app.post('/auth/register', async (req, res) => {
    console.log('POST /auth/register hit!');
    const { username, email, password } = req.body;

    try {
        // Validasi input
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Semua field harus diisi' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password minimal 6 karakter' });
        }

        // Cek apakah email atau username sudah ada
        const checkUser = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (checkUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email atau username sudah terdaftar' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insert user baru
        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, eco_level, is_admin) 
             VALUES ($1, $2, $3, 1, false) 
             RETURNING user_id, username, email, eco_level, is_admin, created_at`,
            [username, email, password_hash]
        );

        const newUser = result.rows[0];

        // Berikan badge pertama (Eco Seed - Level 1)
        await pool.query(
            `INSERT INTO user_badges (user_id, badge_id) 
             VALUES ($1, (SELECT badge_id FROM badges WHERE required_level = 1))`,
            [newUser.user_id]
        );

        res.status(201).json({
            message: 'Registrasi berhasil!',
            user: {
                user_id: newUser.user_id,
                username: newUser.username,
                email: newUser.email,
                eco_level: newUser.eco_level,
                is_admin: newUser.is_admin
            }
        });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// POST: Login user
app.post('/auth/login', async (req, res) => {
    console.log('POST /auth/login hit!');
    const { email, password } = req.body;

    try {
        // Validasi input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email dan password harus diisi' });
        }

        // Cari user berdasarkan email
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Email atau password salah' });
        }

        const user = result.rows[0];

        // Verifikasi password
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Email atau password salah' });
        }

        // Buat JWT token
        const token = jwt.sign(
            {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                is_admin: user.is_admin,
                eco_level: user.eco_level
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login berhasil',
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                eco_level: user.eco_level,
                is_admin: user.is_admin
            }
        });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// GET: Mengambil data user yang sedang login
app.get('/auth/me', authenticateToken, async (req, res) => {
    console.log('GET /auth/me hit!');
    try {
        const result = await pool.query(
            `SELECT user_id, username, email, eco_level, is_admin, created_at 
             FROM users WHERE user_id = $1`,
            [req.user.user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }

        // Get user badges
        const badges = await pool.query(
            `SELECT b.badge_id, b.badge_name, b.description, b.required_level, ub.awarded_at
             FROM user_badges ub
             JOIN badges b ON ub.badge_id = b.badge_id
             WHERE ub.user_id = $1
             ORDER BY b.required_level`,
            [req.user.user_id]
        );

        res.json({
            user: result.rows[0],
            badges: badges.rows
        });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// ============================================
// EVENTS ROUTES
// ============================================

// GET: Mengambil semua events
app.get('/events', async (req, res) => {
    console.log('GET /events hit!');
    try {
        const { status } = req.query;
        
        let query = `
            SELECT e.*, u.username as creator_name,
                   COUNT(DISTINCT ev.upvote_id) as upvote_count
            FROM events e
            JOIN users u ON e.created_by = u.user_id
            LEFT JOIN event_upvotes ev ON e.event_id = ev.event_id
        `;

        const params = [];
        
        if (status) {
            query += ` WHERE e.status = $1`;
            params.push(status);
        } else {
            // Public hanya lihat event yang sudah di-approve
            query += ` WHERE e.status = 'ACCEPTED'`;
        }

        query += `
            GROUP BY e.event_id, u.username
            ORDER BY upvote_count DESC, e.event_date DESC
        `;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// POST: Membuat event baru
app.post('/events', authenticateToken, async (req, res) => {
    console.log('POST /events hit!');
    const { title, description, event_date, location } = req.body;

    try {
        if (!title || !description || !event_date) {
            return res.status(400).json({ error: 'Title, description, dan event_date harus diisi' });
        }

        const result = await pool.query(
            `INSERT INTO events (title, description, event_date, location, created_by, status)
             VALUES ($1, $2, $3, $4, $5, 'PENDING')
             RETURNING *`,
            [title, description, event_date, location || '', req.user.user_id]
        );

        res.status(201).json({
            message: 'Event berhasil dibuat dan menunggu persetujuan admin',
            event: result.rows[0]
        });
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// POST: Upvote/Unupvote event
app.post('/events/:eventId/upvote', authenticateToken, async (req, res) => {
    console.log(`POST /events/${req.params.eventId}/upvote hit!`);
    const { eventId } = req.params;

    try {
        // Cek apakah sudah upvote
        const check = await pool.query(
            'SELECT * FROM event_upvotes WHERE event_id = $1 AND user_id = $2',
            [eventId, req.user.user_id]
        );

        if (check.rows.length > 0) {
            // Hapus upvote
            await pool.query(
                'DELETE FROM event_upvotes WHERE event_id = $1 AND user_id = $2',
                [eventId, req.user.user_id]
            );
            return res.json({ message: 'Upvote dihapus', upvoted: false });
        }

        // Tambah upvote
        await pool.query(
            'INSERT INTO event_upvotes (event_id, user_id) VALUES ($1, $2)',
            [eventId, req.user.user_id]
        );

        res.json({ message: 'Event berhasil di-upvote', upvoted: true });
    } catch (err) {
        console.error('Error upvoting event:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// ============================================
// SOCIAL POSTS ROUTES
// ============================================

// GET: Mengambil semua posts
app.get('/posts', async (req, res) => {
    console.log('GET /posts hit!');
    try {
        const { status } = req.query;
        
        let query = `
            SELECT p.*, u.username, u.eco_level,
                   COUNT(DISTINCT pl.like_id) as like_count,
                   COUNT(DISTINCT c.comment_id) as comment_count
            FROM social_posts p
            JOIN users u ON p.created_by = u.user_id
            LEFT JOIN post_likes pl ON p.post_id = pl.post_id
            LEFT JOIN comments c ON p.post_id = c.post_id
        `;

        const params = [];
        
        if (status) {
            query += ` WHERE p.status = $1`;
            params.push(status);
        } else {
            query += ` WHERE p.status = 'ACCEPTED'`;
        }

        query += `
            GROUP BY p.post_id, u.username, u.eco_level
            ORDER BY p.created_at DESC
        `;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// POST: Membuat post baru
app.post('/posts', authenticateToken, async (req, res) => {
    console.log('POST /posts hit!');
    const { content, image_url } = req.body;

    try {
        if (!content) {
            return res.status(400).json({ error: 'Content harus diisi' });
        }

        const result = await pool.query(
            `INSERT INTO social_posts (content, image_url, created_by, status)
             VALUES ($1, $2, $3, 'PENDING')
             RETURNING *`,
            [content, image_url || null, req.user.user_id]
        );

        res.status(201).json({
            message: 'Post berhasil dibuat dan menunggu persetujuan admin',
            post: result.rows[0]
        });
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// POST: Like/Unlike post
app.post('/posts/:postId/like', authenticateToken, async (req, res) => {
    console.log(`POST /posts/${req.params.postId}/like hit!`);
    const { postId } = req.params;

    try {
        // Cek apakah sudah like
        const check = await pool.query(
            'SELECT * FROM post_likes WHERE post_id = $1 AND user_id = $2',
            [postId, req.user.user_id]
        );

        if (check.rows.length > 0) {
            // Unlike
            await pool.query(
                'DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2',
                [postId, req.user.user_id]
            );
            return res.json({ message: 'Like dihapus', liked: false });
        }

        // Like
        await pool.query(
            'INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)',
            [postId, req.user.user_id]
        );

        res.json({ message: 'Post berhasil di-like', liked: true });
    } catch (err) {
        console.error('Error liking post:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// GET: Mengambil komentar dari post tertentu
app.get('/posts/:postId/comments', async (req, res) => {
    console.log(`GET /posts/${req.params.postId}/comments hit!`);
    const { postId } = req.params;

    try {
        const result = await pool.query(
            `SELECT c.*, u.username, u.eco_level
             FROM comments c
             JOIN users u ON c.user_id = u.user_id
             WHERE c.post_id = $1
             ORDER BY c.created_at DESC`,
            [postId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// POST: Menambahkan komentar ke post
app.post('/posts/:postId/comments', authenticateToken, async (req, res) => {
    console.log(`POST /posts/${req.params.postId}/comments hit!`);
    const { postId } = req.params;
    const { content } = req.body;

    try {
        if (!content) {
            return res.status(400).json({ error: 'Content harus diisi' });
        }

        const result = await pool.query(
            `INSERT INTO comments (post_id, user_id, content)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [postId, req.user.user_id, content]
        );

        // Get username untuk response
        const userResult = await pool.query(
            'SELECT username, eco_level FROM users WHERE user_id = $1',
            [req.user.user_id]
        );

        res.status(201).json({
            ...result.rows[0],
            username: userResult.rows[0].username,
            eco_level: userResult.rows[0].eco_level
        });
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// ============================================
// ADMIN ROUTES
// ============================================

// PATCH: Moderasi event (Accept/Reject)
app.patch('/admin/events/:eventId/moderate', authenticateToken, adminOnly, async (req, res) => {
    console.log(`PATCH /admin/events/${req.params.eventId}/moderate hit!`);
    const { eventId } = req.params;
    const { status } = req.body;

    try {
        if (!['ACCEPTED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ error: 'Status tidak valid' });
        }

        await pool.query(
            'UPDATE events SET status = $1 WHERE event_id = $2',
            [status, eventId]
        );

        res.json({ message: `Event berhasil di-${status.toLowerCase()}` });
    } catch (err) {
        console.error('Error moderating event:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// PATCH: Moderasi post (Accept/Reject)
app.patch('/admin/posts/:postId/moderate', authenticateToken, adminOnly, async (req, res) => {
    console.log(`PATCH /admin/posts/${req.params.postId}/moderate hit!`);
    const { postId } = req.params;
    const { status } = req.body;

    try {
        if (!['ACCEPTED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ error: 'Status tidak valid' });
        }

        await pool.query(
            'UPDATE social_posts SET status = $1 WHERE post_id = $2',
            [status, postId]
        );

        res.json({ message: `Post berhasil di-${status.toLowerCase()}` });
    } catch (err) {
        console.error('Error moderating post:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// POST: Memberikan badge ke user
app.post('/admin/users/:userId/badge', authenticateToken, adminOnly, async (req, res) => {
    console.log(`POST /admin/users/${req.params.userId}/badge hit!`);
    const { userId } = req.params;
    const { badge_id } = req.body;

    try {
        // Cek apakah user sudah punya badge ini
        const check = await pool.query(
            'SELECT * FROM user_badges WHERE user_id = $1 AND badge_id = $2',
            [userId, badge_id]
        );

        if (check.rows.length > 0) {
            return res.status(400).json({ error: 'User sudah memiliki badge ini' });
        }

        // Berikan badge
        await pool.query(
            'INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2)',
            [userId, badge_id]
        );

        // Update user eco_level berdasarkan badge
        const badge = await pool.query(
            'SELECT required_level FROM badges WHERE badge_id = $1',
            [badge_id]
        );

        await pool.query(
            'UPDATE users SET eco_level = $1 WHERE user_id = $2',
            [badge.rows[0].required_level, userId]
        );

        res.json({ message: 'Badge berhasil diberikan' });
    } catch (err) {
        console.error('Error awarding badge:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// GET: Mengambil semua users (untuk admin)
app.get('/admin/users', authenticateToken, adminOnly, async (req, res) => {
    console.log('GET /admin/users hit!');
    try {
        const result = await pool.query(
            `SELECT u.user_id, u.username, u.email, u.eco_level, u.is_admin, u.created_at,
                    COUNT(DISTINCT p.post_id) as post_count,
                    COUNT(DISTINCT e.event_id) as event_count
             FROM users u
             LEFT JOIN social_posts p ON u.user_id = p.created_by
             LEFT JOIN events e ON u.user_id = e.created_by
             GROUP BY u.user_id
             ORDER BY u.created_at DESC`
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// GET: Mengambil semua badges available
app.get('/badges', async (req, res) => {
    console.log('GET /badges hit!');
    try {
        const result = await pool.query(
            'SELECT * FROM badges ORDER BY required_level ASC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching badges:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// Middleware penanganan 404
app.use((req, res, next) => {
    console.warn(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ error: '404: Route not found' });
});

// Middleware penanganan error umum
app.use((err, req, res, next) => {
    console.error('Unhandled backend error:', err);
    res.status(500).json({ error: '500: Internal Server Error' });
});

// Export aplikasi Express untuk Vercel
export default app;

// Jalankan server hanya jika file ini dieksekusi langsung
if (import.meta.url === (await import('url')).pathToFileURL(process.argv[1]).href) {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`🌱 Eco Heroes API berjalan di http://localhost:${port}`);
    });
}