DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
    id INTEGER PRIMARY KEY,
    message TEXT NOT NULL
);
INSERT INTO messages (message) VALUES ('First Message');
