#!/bin/bash

# The "concurrently" command runs multiple things at once.
# Each command is passed as a string to the concurrrently command.

# The first command builds the paybutton docs and then the API docs, which can't
# be built side-by-side and must come one after the other.

# The second command builds the PayButton

# The third command builds the injector

# After all of the commands, finish, the site is built

echo "Starting the build..."
concurrently "yarn paybutton-docs-build && yarn api-docs-build" "yarn paybutton-build && yarn inject-build" && yarn site-build
