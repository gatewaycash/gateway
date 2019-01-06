-- delete existing tables from the database
drop table if exists users;
drop table if exists payments;
drop table if exists pending;

-- create new users table
create table if not exists users (
  userID int auto_increment primary key,
  payoutAddress varchar(60),
  totalSales int(15) default 0,
  created timestamp default current_timestamp,
  merchantID varchar(16),
  password varchar(64),
  salt varchar(64),
  username varchar(24),
  APIKey varchar(64)
);

-- create new payments table
create table if not exists payments (
  paymentIndex int auto_increment primary key,
  paymentAddress varchar(60),
  paidAmount int(15),
  created timestamp default current_timestamp,
  paymentID varchar(64),
  merchantID varchar(16),
  paymentKey varchar(80),
  paymentTXID varchar(64),
  transferTXID varchar(64),
  callbackURL varchar(250)
);

-- create new pending table
CREATE table if not exists pending (
  created timestamp default current_timestamp,
  address varchar(60),
  txid varchar(64),
  attempts int(3) default 0
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
