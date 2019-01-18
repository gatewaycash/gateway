-- delete existing tables from the database
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS pendingPayments;
DROP TABLE IF EXISTS privateKeys;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS APIKeys;
DROP TABLE IF EXISTS platforms;
DROP TABLE IF EXISTS commissions;
DROP TABLE IF EXISTS platformAdministrators;

-- create new users table
CREATE TABLE IF NOT EXISTS users (
  tableIndex INT AUTO_INCREMENT PRIMARY KEY,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payoutAddress VARCHAR(60),
  payoutXPUB VARCHAR(115),
  payoutMethod VARCHAR(10) DEFAULT "address",
  totalSales INT(15) DEFAULT 0,
  merchantID VARCHAR(16),
  passwordHash VARCHAR(64),
  passwordSalt VARCHAR(64),
  username VARCHAR(24),
  contributionPercentage VARCHAR(6) DEFAULT "0.00",
  contributionAmount VARCHAR(8) DEFAULT "0.00",
  contributionCurrency VARCHAR(3) DEFAULT "BCH",
  contributionLessMore VARCHAR(4) DEFAULT "less",
  contributionTotal VARCHAR(15) DEFAULT 0,
  platformUser INT(1) DEFAULT 0,
  platformIndex INT(8)
);
ALTER TABLE users AUTO_INCREMENT = 1;

-- create new payments table
CREATE TABLE IF NOT EXISTS payments (
  tableIndex INT AUTO_INCREMENT PRIMARY KEY,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paymentAddress VARCHAR(60),
  paymentID VARCHAR(64) DEFAULT "",
  merchantID VARCHAR(16),
  callbackURL VARCHAR(250) DEFAULT "",
  invoiceAmount INT(15) DEFAULT 0,
  complete INT(1) DEFAULT 0
);
ALTER TABLE payments AUTO_INCREMENT = 1;

-- create new transactions table
CREATE TABLE IF NOT EXISTS transactions (
  tableIndex INT AUTO_INCREMENT PRIMARY KEY,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  type VARCHAR(10),
  TXID VARCHAR(64),
  paymentIndex INT(8)
);
ALTER TABLE transactions AUTO_INCREMENT = 1;

-- create new privateKeys table
CREATE TABLE IF NOT EXISTS privateKeys (
  tableIndex INT AUTO_INCREMENT PRIMARY KEY,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paymentIndex INT(8),
  privateKey VARCHAR(80)
);
ALTER TABLE privateKeys AUTO_INCREMENT = 1;

-- create new pendingPayments table
CREATE TABLE IF NOT EXISTS pendingPayments (
  tableIndex INT AUTO_INCREMENT PRIMARY KEY,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paymentIndex INT(8),
  attempts INT(3) DEFAULT 0
);
ALTER TABLE pendingPayments AUTO_INCREMENT = 1;

-- create new APIKeys table
CREATE TABLE IF NOT EXISTS APIKeys (
  tableIndex INT AUTO_INCREMENT PRIMARY KEY,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  active INT(1) DEFAULT 1,
  revokedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  userIndex INT(8),
  label VARCHAR(36),
  APIKey VARCHAR(64)
);
ALTER TABLE APIKeys AUTO_INCREMENT = 1;

-- create new platforms table
CREATE TABLE IF NOT EXISTS platforms (
  tableIndex INT AUTO_INCREMENT PRIMARY KEY,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  platformID VARCHAR(16),
  name VARCHAR(36),
  description VARCHAR(160),
  owner VARCHAR(8),
  totalSales INT(15) DEFAULT 0
);
ALTER TABLE platforms AUTO_INCREMENT = 1;

-- create new commissions table
CREATE TABLE IF NOT EXISTS commissions (
  tableIndex INT AUTO_INCREMENT PRIMARY KEY,
  platformIndex INT(8),
  commissionAddress VARCHAR(60),
  commissionXPUB VARCHAR(115),
  commissionMethod VARCHAR(10) DEFAULT "address",
  commissionPercentage VARCHAR(6) DEFAULT "0.00",
  commissionAmount VARCHAR(8) DEFAULT "0.00",
  commissionCurrency VARCHAR(3) DEFAULT "BCH",
  commissionLessMore VARCHAR(4) DEFAULT "less",
  commissionTotal VARCHAR(15) DEFAULT 0
);
ALTER TABLE commissions AUTO_INCREMENT = 1;

-- create new platformAdministrators table
CREATE TABLE IF NOT EXISTS platformAdministrators (
  tableIndex INT AUTO_INCREMENT PRIMARY KEY,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  active INT(1) DEFAULT 1,
  revokedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revokedReason VARCHAR(160),
  userIndex INT(8),
  platformIndex INT(8)
);
ALTER TABLE platformAdministrators AUTO_INCREMENT = 1;
