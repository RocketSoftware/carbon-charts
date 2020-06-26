#!/usr/bin/env bash

set -e # exit with nonzero exit code if anything fails

echo "The commit is a tag, publish to NPM!"

# authenticate with the npm registry
npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN -q

node scripts/clean-package-jsons.js

lerna publish from-git --yes --force-publish --contents dist

