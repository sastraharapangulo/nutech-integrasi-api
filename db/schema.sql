CREATE TYPE transaction_type_enum AS ENUM ('PAYMENT', 'TOPUP');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile_image TEXT,
  balance BIGINT DEFAULT 0
);

CREATE TABLE services (
  service_code VARCHAR(50) PRIMARY KEY,
  service_name VARCHAR(255) NOT NULL,
  service_icon TEXT,
  service_tariff BIGINT NOT NULL
);

CREATE TABLE banners (
  id SERIAL PRIMARY KEY,
  banner_name VARCHAR(255) NOT NULL,
  banner_image TEXT,
  description TEXT
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  service_code VARCHAR(50),
  service_name VARCHAR(255),
  transaction_type transaction_type_enum NOT NULL,
  total_amount BIGINT NOT NULL,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
