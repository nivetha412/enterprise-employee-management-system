CREATE TABLE login_attempts (
    attempt_key CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    attempt_count INT NOT NULL,
    window_started_at DATETIME(6) NOT NULL,
    blocked_until DATETIME(6) NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (attempt_key),
    KEY idx_login_attempts_updated_at (updated_at),
    KEY idx_login_attempts_blocked_until (blocked_until)
) ENGINE=InnoDB;