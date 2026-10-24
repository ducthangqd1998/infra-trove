-- Guide comments. Raw IP addresses are never stored: ip_hash is an HMAC of the
-- address and the UTC day, used only to rate-limit posting.
CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  post TEXT NOT NULL,
  name TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'visible' CHECK (status IN ('visible', 'hidden')),
  ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX comments_post_created ON comments (post, created_at);
CREATE INDEX comments_ip_created ON comments (ip_hash, created_at);
