#!/bin/bash

# Starts the watch scripts and builds a new copy of the documentation.

# The watch scripts all run concurrently and the documentation is built
# synchronously.

echo "Starting development environment..."
concurrently -n site,api,inject,docs -c blue.bold,yellow.bold,green.bold,red.bold "yarn site-dev" "yarn api-start" "yarn inject-dev" "yarn paybutton-docs-build && yarn api-docs-build"
