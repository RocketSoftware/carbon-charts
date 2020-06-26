#!/usr/bin/env bash

set -e # exit with nonzero exit code if anything fails

node scripts/clean-package-jsons.js

lerna publish from-package --yes --force-publish --contents dist