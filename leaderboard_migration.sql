-- ===================================================
-- Leaderboard & Highscore System Migration
-- Run this SQL on NeonDB to create the game_scores table
-- ===================================================

CREATE TABLE IF NOT EXISTS game_scores (
  score_id   SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  score      INTEGER NOT NULL DEFAULT 0,
  phase      INTEGER NOT NULL DEFAULT 1,
  played_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Index for fast leaderboard queries (ordered by score DESC)
CREATE INDEX IF NOT EXISTS idx_game_scores_score ON game_scores(score DESC);
