-- Thai Lottery Database Schema

CREATE DATABASE IF NOT EXISTS thai_lottery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE thai_lottery;

-- Main lottery draws table
CREATE TABLE IF NOT EXISTS lottery_draws (
    id INT AUTO_INCREMENT PRIMARY KEY,
    draw_id VARCHAR(20) NOT NULL UNIQUE,
    draw_date VARCHAR(100) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_draw_id (draw_id),
    INDEX idx_draw_date (draw_date),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Prizes table
CREATE TABLE IF NOT EXISTS prizes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lottery_draw_id INT NOT NULL,
    prize_id VARCHAR(50) NOT NULL,
    prize_name VARCHAR(100) NOT NULL,
    reward VARCHAR(20) NOT NULL,
    amount INT NOT NULL,
    number VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lottery_draw_id) REFERENCES lottery_draws(id) ON DELETE CASCADE,
    INDEX idx_lottery_draw_id (lottery_draw_id),
    INDEX idx_prize_id (prize_id),
    INDEX idx_number (number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Running numbers table
CREATE TABLE IF NOT EXISTS running_numbers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lottery_draw_id INT NOT NULL,
    running_id VARCHAR(50) NOT NULL,
    running_name VARCHAR(100) NOT NULL,
    reward VARCHAR(20) NOT NULL,
    amount INT NOT NULL,
    number VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lottery_draw_id) REFERENCES lottery_draws(id) ON DELETE CASCADE,
    INDEX idx_lottery_draw_id (lottery_draw_id),
    INDEX idx_running_id (running_id),
    INDEX idx_number (number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
