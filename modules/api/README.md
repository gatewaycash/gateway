# Gateway API and Backend Server

A sever for managing merchants and payments

## Initial Setup

To set up the API for the first time:

```
yarn api-setup
```

You will need a local MySQL server for development. Create a new database and a
user with read/write privileges for the database. Enter the information when
prompted.

Test tables will be created in the database for users, payments and pending
payments. A test user will be created, with a username of "gwtestuser1" and a
password of "Gateway1111".
