-- delete existing tables from the database
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS payments;
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
  XPUBIndex INT(8) DEFAULT 0,
  payoutMethod VARCHAR(10) DEFAULT "address",
  nativeCurrency VARCHAR(4) DEFAULT "BCH",
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
  platformIndex INT(8) DEFAULT 0
);
ALTER TABLE users AUTO_INCREMENT = 1;

-- create new payments table
CREATE TABLE IF NOT EXISTS payments (
  tableIndex INT AUTO_INCREMENT PRIMARY KEY,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paymentAddress VARCHAR(60),
  privateKey VARCHAR(80) DEFAULT "",
  paymentID VARCHAR(64) DEFAULT "",
  merchantID VARCHAR(16),
  callbackURL VARCHAR(250) DEFAULT "",
  callbackStatus VARCHAR(30) DEFAULT "",
  invoiceAmount INT(15) DEFAULT 0,
  status VARCHAR(30) DEFAULT "clicked",
  platformID VARCHAR(16) DEFAULT ""
);
ALTER TABLE payments AUTO_INCREMENT = 1;

-- create new transactions table
CREATE TABLE IF NOT EXISTS transactions (
  tableIndex INT AUTO_INCREMENT PRIMARY KEY,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  type VARCHAR(30) DEFAULT "payment",
  TXID VARCHAR(64),
  paymentIndex INT(8)
);
ALTER TABLE transactions AUTO_INCREMENT = 1;

-- create new APIKeys table
CREATE TABLE IF NOT EXISTS APIKeys (
  tableIndex INT AUTO_INCREMENT PRIMARY KEY,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  active INT(1) DEFAULT 1,
  revokedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  userIndex INT(8),
  label VARCHAR(36) DEFAULT "API Key",
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
  ownerUserIndex VARCHAR(8),
  totalSales INT(15) DEFAULT 0
);
ALTER TABLE platforms AUTO_INCREMENT = 1;

-- create new commissions table
CREATE TABLE IF NOT EXISTS commissions (
  tableIndex INT AUTO_INCREMENT PRIMARY KEY,
  platformIndex INT(8),
  commissionID VARCHAR(16),
  label VARCHAR(36),
  commissionAddress VARCHAR(60),
  commissionXPUB VARCHAR(115),
  XPUBIndex INT(8) DEFAULT 0,
  commissionMethod VARCHAR(10) DEFAULT "address",
  commissionPercentage VARCHAR(6) DEFAULT "0.00",
  commissionAmount VARCHAR(8) DEFAULT "0.00",
  commissionCurrency VARCHAR(3) DEFAULT "BCH",
  commissionLessMore VARCHAR(4) DEFAULT "less",
  minimumTransactionAmount INT(8) DEFAULT -1,
  maximumTransactionAmount INT(8) DEFAULT -1,
  maximumCommissionAmount INT(8) DEFAULT -1,
  minimumCommissionAmount INT(8) DEFAULT -1
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

-- TEST USERS, PLATFORMS AND PAYMENTS

-- create three test users, first two with payoutAddress, third with payoutXPUB
INSERT INTO users (
  payoutAddress,
  merchantID,
  passwordHash,
  passwordSalt,
  username
) VALUES (
  'bitcoincash:pz3txlyql9vc08px98v69a7700g6aecj5gc0q3xhng',
  'deadbeef20191111',
  '4aba048f2605a9e41baa0509ad280ccfdbb8a6ff9fdb317eab36e92e35384de1',
  'b6faa3ea7b1882a3eb6bc22a5f96f557cc280d14a8fb168e22d28a0a4015b8e5',
  'gwtestuser1'
);
INSERT INTO users (
  payoutAddress,
  merchantID,
  passwordHash,
  passwordSalt,
  username
) VALUES (
  'bitcoincash:pz3txlyql9vc08px98v69a7700g6aecj5gc0q3xhng',
  'deadbeef20192222',
  '4aba048f2605a9e41baa0509ad280ccfdbb8a6ff9fdb317eab36e92e35384de1',
  'b6faa3ea7b1882a3eb6bc22a5f96f557cc280d14a8fb168e22d28a0a4015b8e5',
  'gwtestuser2'
);
INSERT INTO users (
  payoutXPUB,
  payoutMethod,
  merchantID,
  passwordHash,
  passwordSalt,
  username
) VALUES (
  'xpub661MyMwAqRbcF9Z9FLyFogJWptKTF9JJCLf3axd43h6FQRCH2NU6b42YoFSNrQieJqV5HywBGjAtr393tBhu3yfUK6dtEhY2UV5dgbLoYhU',
  'XPUB',
  'deadbeef20193333',
  '4aba048f2605a9e41baa0509ad280ccfdbb8a6ff9fdb317eab36e92e35384de1',
  'b6faa3ea7b1882a3eb6bc22a5f96f557cc280d14a8fb168e22d28a0a4015b8e5',
  'gwtestuser3'
);

-- create three test API keys for user 1 and 3, one revoked and two active
INSERT INTO APIKeys (
  userIndex,
  APIKey,
  label
) VALUES (
  1,
  'user1key1',
  'User 1 test key 1'
);
INSERT INTO APIKeys (
  userIndex,
  APIKey,
  label
) VALUES (
  1,
  'user1key2',
  'User 1 test key 2'
);
INSERT INTO APIKeys (
  userIndex,
  APIKey,
  label,
  active
) VALUES (
  1,
  'user1key3',
  'User 1 test key 3',
  0
);
INSERT INTO APIKeys (
  userIndex,
  APIKey,
  label
) VALUES (
  3,
  'user3key1',
  'User 3 test key 1'
);
INSERT INTO APIKeys (
  userIndex,
  APIKey,
  label
) VALUES (
  3,
  'user3key1',
  'User 3 test key 2'
);
INSERT INTO APIKeys (
  userIndex,
  APIKey,
  label,
  active
) VALUES (
  3,
  'user3key3',
  'User 3 test key 3',
  0
);

-- create a test platform owned by the first test user
INSERT INTO platforms (
  platformID,
  name,
  description,
  ownerUserIndex
) VALUES (
  'deadbeef20191121',
  'gwtestplatform1',
  'test platform 1',
  1
);

-- add 1% commission to Gateway donation address on the platform
INSERT INTO commissions (
  platformIndex,
  commissionID,
  label,
  commissionAddress,
  commissionPercentage,
  commissionLessMore
) VALUES (
  1,
  'deadbeef20191131',
  'commission',
  'bitcoincash:pz3txlyql9vc08px98v69a7700g6aecj5gc0q3xhng',
  '1.00',
  'more'
);

-- make second test user an administrator of the platform
insert into platformAdministrators (
  userIndex,
  platformIndex
) VALUES (
  2,
  1
);

-- make third test user an administrator who has been revoked
INSERT INTO platformAdministrators (
  userIndex,
  platformIndex,
  active,
  revokedReason
) VALUES (
  3,
  1,
  0,
  "You stole fizzy lifting drinks"
);

-- create another test platform owned by the third test user
INSERT INTO platforms (
  platformID,
  name,
  description,
  ownerUserIndex
) VALUES (
  'deadbeef20191122',
  'gwtestplatform2',
  'test platform 2',
  3
);

-- add 0.01BCH commissio to an XPUB
INSERT INTO commissions (
  platformIndex,
  commissionID,
  label,
  commissionXPUB,
  commissionMethod,
  commissionAmount,
  commissionLessMore
) VALUES (
  2,
  'deadbeef20191132',
  'commission',
  'xpub661MyMwAqRbcF9Z9FLyFogJWptKTF9JJCLf3axd43h6FQRCH2NU6b42YoFSNrQieJqV5HywBGjAtr393tBhu3yfUK6dtEhY2UV5dgbLoYhU',
  'XPUB',
  '0.01',
  'more'
);
