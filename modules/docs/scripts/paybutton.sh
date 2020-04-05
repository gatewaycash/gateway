#!/bin/sh
cp -f docs/paybutton.html.md source/index.html.md
bundle install && bundle exec middleman build --clean
mkdir -p ../website/public/docs
cp -r build/* ../website/public/docs
rm -f source/index.html.md