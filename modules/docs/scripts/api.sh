#!/bin/sh
cp -f docs/api.html.md source/index.html.md
bundle install
bundle exec middleman build --clean
mkdir -p ../api/public
cp -r build/* ../api/public/
rm -f source/index.html.md