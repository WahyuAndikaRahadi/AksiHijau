import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const { Pool } = pg;
const app = express();

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_ILAhyxw70zOt@ep-noisy-wave-ad17xbgh-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: {
        rejectUnauthorized: false
    }
});

const JWT_SECRET = 'VqZ3x&Rk7y!pA9sT2uF4gHj8nK0lM1bC6dE5aO$q@W#eYzX%vBnMqZ3xRk7yP9sT2uF4gHj8nK0lM1b';

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`Original Incoming request: ${req.method} ${req.url}`);

    if (req.url.startsWith('/api/')) {
        req.url = req.url.substring(4);
    }

    const queryParamIndex = req.url.indexOf('?path=');
    if (queryParamIndex !== -1) {
        req.url = req.url.substring(0, queryParamIndex);
    }

    console.log(`Cleaned Request URL for Express: ${req.method} ${req.url}`);
    next();
});

app.use((req, res, next) => {
    console.log(`Incoming request (after cleanup): ${req.method} ${req.url}`);
    next();
});


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

const adminOnly = (req, res, next) => {
    if (!req.user?.is_admin) {
        return res.status(403).json({ error: 'Akses ditolak. Hanya admin yang diizinkan.' });
    }
    next();
};


app.post('/auth/register', async (req, res) => {
    console.log('POST /auth/register hit!');
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Semua field harus diisi' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password minimal 6 karakter' });
        }

        const checkUser = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (checkUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email atau username sudah terdaftar' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);


        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, eco_level, is_admin, last_password_change, last_username_change) 
             VALUES ($1, $2, $3, 1, false, NOW(), NOW()) 
             RETURNING user_id, username, email, eco_level, is_admin, created_at`,
            [username, email, password_hash]
        );

        const newUser = result.rows[0];

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

app.post('/auth/login', async (req, res) => {
    console.log('POST /auth/login hit!');
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email dan password harus diisi' });
        }

        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Email atau password salah' });
        }

        const user = result.rows[0];

        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Email atau password salah' });
        }

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

app.get('/auth/me', authenticateToken, async (req, res) => {
    console.log('GET /auth/me hit!');
    try {
        const result = await pool.query(
            `SELECT user_id, username, email, eco_level, is_admin, created_at, last_password_change, last_username_change
             FROM users WHERE user_id = $1`,
            [req.user.user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }

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


app.get('/users/profile', authenticateToken, async (req, res) => {
    console.log(`GET /users/profile hit! User ID: ${req.user.user_id}`);
    const userId = req.user.user_id;

    try {
        const result = await pool.query(
            'SELECT user_id, username, email, is_admin, created_at, eco_level FROM users WHERE user_id = $1',
            [userId]
        );

        if (result.rowCount === 0) {
            console.warn(`Profile not found for user_id: ${userId}`);
            return res.status(404).json({ error: 'Profil pengguna tidak ditemukan.' });
        }

        const profileData = result.rows[0];
        res.json(profileData);
        
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ error: 'Gagal mengambil data profil dari database', details: err.message });
    }
});

app.put('/users/profile', authenticateToken, async (req, res) => {
    console.log(`PUT /users/profile hit! User ID: ${req.user.user_id}`);
    const userId = req.user.user_id;
    const { username, email } = req.body; 

    if (!username || !email) {
        return res.status(400).json({ error: 'Username dan Email diperlukan untuk update.' });
    }

    try {
        const emailCheck = await pool.query(
            'SELECT user_id FROM users WHERE email = $1 AND user_id != $2',
            [email, userId]
        );

        if (emailCheck.rowCount > 0) {
            return res.status(409).json({ error: 'Email ini sudah digunakan oleh pengguna lain.' });
        }

        const updateResult = await pool.query(
            'UPDATE users SET username = $1, email = $2 WHERE user_id = $3 RETURNING user_id, username, email, is_admin, created_at, eco_level',
            [username, email, userId]
        );

        if (updateResult.rowCount === 0) {
            return res.status(404).json({ error: 'Gagal memperbarui profil. Pengguna tidak ditemukan.' });
        }
        
        const updatedProfile = updateResult.rows[0];
        res.json(updatedProfile);

    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({ error: 'Gagal memperbarui data profil', details: err.message });
    }
});

app.patch('/auth/profile/password', authenticateToken, async (req, res) => {
    console.log('PATCH /auth/profile/password hit!');
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.user_id;

    try {
        if (!currentPassword || !newPassword || newPassword.length < 6) {
            return res.status(400).json({ error: 'Password saat ini dan password baru minimal 6 karakter harus diisi' });
        }

        const userResult = await pool.query(
            'SELECT password_hash, last_password_change FROM users WHERE user_id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }

        const user = userResult.rows[0];

        const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Password saat ini salah' });
        }

        const lastChange = new Date(user.last_password_change).getTime();
        const currentTime = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;

        if (currentTime - lastChange < oneWeek) {
            const timeRemaining = oneWeek - (currentTime - lastChange);
            const remainingHours = Math.ceil(timeRemaining / (1000 * 60 * 60));
            return res.status(429).json({ 
                error: `Anda hanya dapat mengubah password 1x dalam 7 hari. Coba lagi dalam waktu kurang lebih ${remainingHours} jam.`,
                retry_after_ms: timeRemaining
            });
        }

        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        await pool.query(
            `UPDATE users SET password_hash = $1, last_password_change = NOW() WHERE user_id = $2`,
            [newPasswordHash, userId]
        );

        res.json({ message: 'Password berhasil diperbarui.' });

    } catch (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

app.patch('/auth/profile/username', authenticateToken, async (req, res) => {
    console.log('PATCH /auth/profile/username hit!');
    const { newUsername } = req.body;
    const userId = req.user.user_id;

    try {
        if (!newUsername || newUsername.length < 3) {
            return res.status(400).json({ error: 'Username baru minimal 3 karakter harus diisi' });
        }
        
        const userResult = await pool.query(
            'SELECT username, last_username_change FROM users WHERE user_id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }

        const user = userResult.rows[0];

        if (user.username === newUsername) {
            return res.status(400).json({ error: 'Username baru sama dengan username saat ini' });
        }

        const lastChange = new Date(user.last_username_change).getTime();
        const currentTime = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000; 
        if (currentTime - lastChange < oneWeek) {
            const timeRemaining = oneWeek - (currentTime - lastChange);
            const remainingHours = Math.ceil(timeRemaining / (1000 * 60 * 60));
            return res.status(429).json({ 
                error: `Anda hanya dapat mengubah username 1x dalam 7 hari. Coba lagi dalam waktu kurang lebih ${remainingHours} jam.`,
                retry_after_ms: timeRemaining
            });
        }
        
        const checkUsername = await pool.query(
            'SELECT user_id FROM users WHERE username = $1',
            [newUsername]
        );
        
        if (checkUsername.rows.length > 0) {
            return res.status(400).json({ error: 'Username ini sudah digunakan oleh pengguna lain' });
        }

        await pool.query(
            `UPDATE users SET username = $1, last_username_change = NOW() WHERE user_id = $2`,
            [newUsername, userId]
        );
       
        res.json({ message: 'Username berhasil diperbarui.', newUsername });

    } catch (err) {
        console.error('Error updating username:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});


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

app.post('/events/:eventId/upvote', authenticateToken, async (req, res) => {
    console.log(`POST /events/${req.params.eventId}/upvote hit!`);
    const { eventId } = req.params;

    try {
        const check = await pool.query(
            'SELECT * FROM event_upvotes WHERE event_id = $1 AND user_id = $2',
            [eventId, req.user.user_id]
        );

        if (check.rows.length > 0) {
            await pool.query(
                'DELETE FROM event_upvotes WHERE event_id = $1 AND user_id = $2',
                [eventId, req.user.user_id]
            );
            return res.json({ message: 'Upvote dihapus', upvoted: false });
        }

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
           
        }

        query += `
            GROUP BY p.post_id, u.username, u.eco_level
            ORDER BY p.created_at DESC
        `;

        const result = await pool.query(query, params);
        
        const posts = result.rows.map(post => ({
            ...post,
            like_count: parseInt(post.like_count, 10) || 0,
            comment_count: parseInt(post.comment_count, 10) || 0,
        }));
        
        res.json(posts); 

    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});



app.post('/posts', authenticateToken, async (req, res) => {
    console.log('POST /posts hit!');
    const { content, image_url } = req.body;

    try {
        if (!content) {
            return res.status(400).json({ error: 'Content harus diisi' });
        }

        const result = await pool.query(
            `INSERT INTO social_posts (content, image_url, created_by, status)
             VALUES ($1, $2, $3, 'ACCEPTED') -- Post langsung ACCEPTED
             RETURNING *`,
            [content, image_url || null, req.user.user_id]
        );
        
        const newPost = result.rows[0];

        const completePost = {
            ...newPost,
            username: req.user.username, 
            eco_level: req.user.eco_level, 
            like_count: 0, 
            comment_count: 0, 
        };

        res.status(201).json(completePost);
        
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

app.post('/posts/:postId/like', authenticateToken, async (req, res) => {
    console.log(`POST /posts/${req.params.postId}/like hit!`);
    const { postId } = req.params;

    try {
        const check = await pool.query(
            'SELECT * FROM post_likes WHERE post_id = $1 AND user_id = $2',
            [postId, req.user.user_id]
        );

        if (check.rows.length > 0) {
            await pool.query(
                'DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2',
                [postId, req.user.user_id]
            );
            return res.json({ message: 'Like dihapus', liked: false });
        }

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

app.get('/user/liked-posts', authenticateToken, async (req, res) => {
    console.log('GET /user/liked-posts hit!');
    try {
        const result = await pool.query(
            'SELECT post_id FROM post_likes WHERE user_id = $1',
            [req.user.user_id]
        );
        
        const likedPostIds = result.rows.map(row => row.post_id);
        res.json(likedPostIds);
        
    } catch (err) {
        console.error('Error fetching liked post IDs:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

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

        const newComment = {
            ...result.rows[0],
            username: req.user.username, 
            eco_level: req.user.eco_level 
        };

        res.status(201).json(newComment);
        
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});


app.patch('/admin/events/:eventId/moderate', authenticateToken, adminOnly, async (req, res) => {
    console.log(`PATCH /admin/events/${req.params.eventId}/moderate hit!`);
    const { eventId } = req.params;
    const { status } = req.body;

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ error: 'Status tidak valid' });
    }

    try {
        const result = await pool.query(
            `UPDATE events SET status = $1 WHERE event_id = $2 RETURNING *`,
            [status, eventId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Event tidak ditemukan' });
        }

        res.json({ 
            message: `Event berhasil dimoderasi menjadi ${status}`,
            event: result.rows[0]
        });
    } catch (err) {
        console.error('Error moderating event:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

app.get('/admin/events', authenticateToken, adminOnly, async (req, res) => {
    console.log('GET /admin/events hit!');
    try {
        const result = await pool.query(
            `SELECT e.*, u.username as creator_name,
                    COUNT(DISTINCT ev.upvote_id) as upvote_count
             FROM events e
             JOIN users u ON e.created_by = u.user_id
             LEFT JOIN event_upvotes ev ON e.event_id = ev.event_id
             GROUP BY e.event_id, u.username
             ORDER BY e.created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching all events for admin:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

app.get('/admin/posts', authenticateToken, adminOnly, async (req, res) => {
    console.log('GET /admin/posts hit!');
    try {
        const result = await pool.query(
            `SELECT p.*, u.username, u.eco_level,
                   COUNT(DISTINCT pl.like_id) as like_count,
                   COUNT(DISTINCT c.comment_id) as comment_count
            FROM social_posts p
            JOIN users u ON p.created_by = u.user_id
            LEFT JOIN post_likes pl ON p.post_id = pl.post_id
            LEFT JOIN comments c ON p.post_id = c.post_id
            GROUP BY p.post_id, u.username, u.eco_level
            ORDER BY p.created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching all posts for admin:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

app.post('/admin/users/:userId/badge', authenticateToken, adminOnly, async (req, res) => {
    console.log(`POST /admin/users/${req.params.userId}/badge hit!`);
    const { userId } = req.params;
    const { badge_id } = req.body;

    try {
        const check = await pool.query(
            'SELECT * FROM user_badges WHERE user_id = $1 AND badge_id = $2',
            [userId, badge_id]
        );

        if (check.rows.length > 0) {
            return res.status(400).json({ error: 'User sudah memiliki badge ini' });
        }

        await pool.query(
            'INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2)',
            [userId, badge_id]
        );

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

app.delete('/admin/events/:eventId', authenticateToken, adminOnly, async (req, res) => {
    console.log(`DELETE /admin/events/${req.params.eventId} hit!`);
    const { eventId } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM events WHERE event_id = $1 RETURNING event_id',
            [eventId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Event tidak ditemukan' });
        }

        res.json({ message: 'Event berhasil dihapus' });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

app.delete('/admin/posts/:postId', authenticateToken, adminOnly, async (req, res) => {
    console.log(`DELETE /admin/posts/${req.params.postId} hit!`);
    const { postId } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM social_posts WHERE post_id = $1 RETURNING post_id',
            [postId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Post tidak ditemukan' });
        }

        res.json({ message: 'Post berhasil dihapus' });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

app.use((req, res, next) => {
    console.warn(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ error: '404: Route not found' });
});

app.use((err, req, res, next) => {
    console.error('Unhandled backend error:', err);
    res.status(500).json({ error: '500: Internal Server Error' });
});

export default app;

if (import.meta.url === (await import('url')).pathToFileURL(process.argv[1]).href) {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`🌱 Eco Heroes API berjalan di http://localhost:${port}`);
    });
}