-- delete existing tables from the database
drop table if exists users;
drop table if exists payments;
drop table if exists pendingPayments;
drop table if exists privateKeys;
drop table if exists transactions;
drop table if exists APIKeys;
drop table if exists platforms;
drop table if exists commissions;
drpo table if exists platformAdministrators;

-- create new users table
create table if not exists users (
  index int auto_increment primary key,
  created timestamp default current_timestamp,
  payoutAddress varchar(60),
  payoutXPUB varchar(115),
  payoutMethod varchar(10) default "address",
  totalSales int(15) default 0,
  merchantID varchar(16),
  passwordHash varchar(64),
  passwordSalt varchar(64),
  username varchar(24),
  contributionPercentage varchar(6) default "0.00",
  contributionAmount varchar(8) default "0.00",
  contributionCurrency varchar(3) default "BCH",
  contributionLessMore varchar(4) default "less",
  contributionTotal varchar(15) default 0,
  platformUser int(1) default 0,
  platformIndex int(8)
);

-- create new payments table
create table if not exists payments (
  index int auto_increment primary key,
  created timestamp default current_timestamp,
  paymentAddress varchar(60),
  paymentID varchar(64) default "",
  merchantID varchar(16),
  callbackURL varchar(250) default "",
  invoiceAmount int(15) default 0,
  complete int(1) default 0
);

--- create new transactions table
create table if not exists transactions (
  index int auto_increment primary key,
  created timestamp default current_timestamp,
  type varchar(10),
  TXID varchar(64),
  paymentIndex int(8)
);

--- create new privateKeys table
create table if not exists privateKeys (
  index int auto_increment primary key,
  created timestamp default current_timestamp,
  paymentIndex int(8),
  privateKey varchar(80)
)

-- create new pendingPayments table
create table if not exists pendingPayments (
  index int auto_increment primary key,
  created timestamp default current_timestamp,
  paymentIndex int(8),
  attempts int(3) default 0
);

--- create new APIKeys table
create table if not exists APIKeys (
  index int auto_increment primary key,
  created timestamp default current_timestamp,
  active int(1) default 1,
  revokedDate timestamp default 0,
  userIndex int(8),
  label varchar(36),
  APIKey varchar(64)
);

--- create new platforms table
create table if not exists platforms (
  index int auto_increment primary key,
  created timestamp default current_timestamp,
  platformID varchar(16),
  name varchar(36),
  description varchar(160),
  owner varchar(8),
  totalSales int(15) default 0
);

--- create new commissions table
create table if not exists commissions (
  index int auto_increment primary key,
  platformIndex int(8),
  commissionAddress varchar(60),
  commissionXPUB varchar(115),
  commissionMethod varchar(10) default "address",
  commissionPercentage varchar(6) default "0.00",
  commissionAmount varchar(8) default "0.00",
  commissionCurrency varchar(3) default "BCH",
  commissionLessMore varchar(4) default "less",
  commissionTotal varchar(15) default 0
);

--- create new platformAdministrators table
create table if not exists platformAdministrators (
  index int auto_increment primary key,
  created timestamp default current_timestamp,
  active int(1) default 1,
  revokedDate timestamp default 0,
  revokedReason varchar(160),
  userIndex int(8),
  platformIndex int(8)
);

-- create a test user
insert into users (
  merchantID,
  password,
  salt,
  username,
  APIKey,
  payoutAddress
) values (
  "deadbeef20181111",
  "1e79982e5189b4acb72018535d1b02dc75e554212dc06e411490ba1e56ee24c3",
  "d8245dbc8c67cf0f849e9b5c73122bed3f84207852091f70f4fa2a12923a5700",
  "gwtestuser1",
  "aaaa00001111ed3f8429e9b5c73122bed3f8429e9b5c73122bed3f842deaddea",
  "bitcoincash:pz3txlyql9vc08px98v69a7700g6aecj5gc0q3xhng"
)
