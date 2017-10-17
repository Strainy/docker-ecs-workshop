CREATE DATABASE votify;
\connect votify

CREATE TABLE votes (
  created_at TIMESTAMP DEFAULT now(),
  value numeric
);
