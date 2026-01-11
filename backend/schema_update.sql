USE milk_tracker;

CREATE TABLE IF NOT EXISTS fat_rate_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rate_per_fat DECIMAL(5, 2) NOT NULL DEFAULT 9.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Initialize default row if empty
INSERT INTO fat_rate_config (id, rate_per_fat)
SELECT 1, 9.00 WHERE NOT EXISTS (SELECT 1 FROM fat_rate_config);
