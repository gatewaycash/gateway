#!/bin/bash

# This parallelizes things as much as possible without breaking things.
# TODO do not build the PayButton in the inject script

# Two commands get run through "concurrently" which runs multiple commands at
# once.

# The first command builds the paybutton docs and then the API docs, which can't
# be built side-by-side and must come one after another.

# The second command (run alongside the doc builds) is itself another call to
# "concurrently".

# The second command:
# - Builds the PayButton and the inject script at the same time
# - Once those are both done it builds the website

# Both the inject and PayButton need to be done before the website gets built.

echo "Starting the build..."
concurrently "yarn paybutton-docs-build && yarn api-docs-build" "concurrently \"yarn paybutton-build\" \"yarn inject-build\" && yarn site-build"
