#!/bin/bash

# Sets up the development environment by running first the API and then the
# Website setup scripts.

clear
echo 'Creating an initial build of the documentation, please wait...'
yarn api-docs-build &>/dev/null
yarn paybutton-docs-build &>/dev/null
clear
yarn api-setup
clear
yarn site-setup
