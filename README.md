# Gateway

[![Build Status](https://travis-ci.org/gatewaycash/gateway.png?branch=master)](https://travis-ci.org/gatewaycash/gateway)

Simple Bitcoin Payments

## Overview

Gateway is a payment processor enabling merchants to easily accept
Bitcoin Cash on their sites without the need for hassle or technical
know-how. Check out the [Gateway Project Charter](CHARTER.md)
for our roadmap, use-cases and a lot more info.

## Development

In order to get established with a development workflow, there are a few extra
things you need to do aside from simply cloning the repository.

### MySQL Server Requirement

To work with the API and backend server, a MySQL database is required. Install
a MySQL server on your local machine, or you can always play around with our
production API server over at [api.gateway.cash](https://api.gateway.cash).

After you've installed MySQL, create a blank database and a new user with full
permissions over the database. Make sure your SQL database is running while you
work.

### Ruby and Bundler

In order to build the documentation websites (yes, we have multiple), you will
need to install Ruby and Bundler. Once you've installed Ruby, simply run
`gem install bundler` before you build the project.

### NodeJS and Yarn

Being a "pure JavaScript" project, Gateway development requires you to install
NodeJS (v8 or later) as well as Yarn.

```bash
# cd to your projects folder
cd ~/projects

# clone the repo
git clone https://github.com/gatewaycash/gateway.git

# cd to the repository root
cd gateway

# install dependencies
yarn

# set up the database (if you plan on working with the API)
yarn setup
# [follow the prompts]
# first-time developers answer YES to set up a new database

# fire up your editor and start coding!
yarn dev
```

More information specific to each module can be found in the README.md for
that module:

- [PayButton](modules/paybutton/README.md)
- [API](modules/api/README.md)
- [Website](modules/website/README.md)
- [The Documentation module](modules/docs/README.md)

### Issues and Pull Requests

Always feel free to open an issue. Issues are how discussions get started and
how bugs get resolved. If you see something wrong or some room for improvement,
please don't hesitate to open an issue and be the one to start the discussion.

Pull requests should serve to make the changes discussed in an issue. If a
discussion has taken place in the issue and it looks like something you want
to be responsible for, self-assign the issue and start a pull request.

## Questions and Concerns

Feel free to send email to <hello@gateway.cash> with any ideas, questions or
feedback. If you'd like to become a contributor, join the [ambassador.cash
Discord server](http://ambassador.cash) and chat with us in the #gatewaycash
channel.

## Weekly Community & Development Meetings

There are weekly community meetings to discuss development, ideas and tech
every Saturday at 9AM PST (17:00 UTC) in the Discord server voice channel. All
parties are welcome.

## Donations

Gateway is accepting donations to fund development, accelerate adoption and pay
bounties to developers who work on certain tasks. Donations are made and
bounties are paid in Bitcoin Cash (or Bitcoin SV, while supplies last).

Our donation and bounty payout address is a secure two-of-three multisignature
address controlled by prominent contributors to the project.

```
bitcoincash:pz3txlyql9vc08px98v69a7700g6aecj5gc0q3xhng
```

## License

This project is licensed under the terms of the GNU AGPL 3.0 license. it shall
eternally remain free and open-source software. Any derivatives of this code
must be made public in accordance with GNU AGPL 3.0. Please see
[here](https://opensource.org/licenses/AGPL-3.0) for details.
