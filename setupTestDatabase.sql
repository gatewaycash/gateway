create database gateway;

use gateway;

create user 'gateway'@'localhost';

set password for 'gateway'@'localhost' = password('gateway123');

grant all privileges on gateway.* to 'gateway'@'localhost';

create table users (
userID int auto_increment primary key,
payoutAddress varchar(60),
totalSales int(15),
created timestamp default current_timestamp,
merchantID varchar(16),
password varchar(256),
salt varchar(256),
username varchar(24)
);

create table payments (
paymentIndex int auto_increment primary key,
paymentAddress varchar(60),
paidAmount varchar(15),
created timestamp default current_timestamp,
paymentID varchar(32),
merchantID varchar(16),
paymentKey varchar(80),
paymentTXID varchar(64),
transferTXID varchar(64)
);

CREATE table pending (
created timestamp default current_timestamp,
address varchar(60),
txid varchar(64)
);
