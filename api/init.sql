CREATE TABLE IF NOT EXISTS votes (
  created_at TIMESTAMP DEFAULT now(),
  value numeric
);
