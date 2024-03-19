-- Database Quiz
CREATE DATABASE quiz;

-- Tabel roles
CREATE TABLE roles (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Tabel users
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role_id CHAR(36),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Tabel subjects
CREATE TABLE subjects (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Tabel videos
CREATE TABLE videos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    subject_id CHAR(36),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    created_at TIMESTAMP DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Tabel quizzes
CREATE TABLE quizzes (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    subject_id CHAR(36),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    created_at TIMESTAMP DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Tabel questions
CREATE TABLE quetions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    discuss TEXT DEFAULT NULL,
    quiz_id CHAR(36),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
    created_at TIMESTAMP DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Tabel options
CREATE TABLE options (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    quetion_id CHAR(36),
    FOREIGN KEY (quetion_id) REFERENCES quetions(id),
    created_at TIMESTAMP DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Tabel answers
CREATE TABLE answers (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    quetions TEXT NOT NULL,
    point DOUBLE NOT NULL,
    duration INT NOT NULL
    quiz_id CHAR(36),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
    user_id CHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Insert data roles
INSERT INTO roles (id, name, created_at, updated_at)
VALUES 
(UUID(), 'admin', NOW(), NOW()),
(UUID(), 'student', NOW(), NOW());