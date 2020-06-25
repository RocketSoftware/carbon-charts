#!/usr/bin/env bash

set -e

rm -rf dist

echo "linking local packages (non-lerna)"
# we run this outside of lerna, since lerna seems to have issues with correctly linking to the dist
rm -f node_modules/@rocketsoftware/charts
ln -sf $(pwd)/../core/dist node_modules/@rocketsoftware/charts

echo "compiling js to js"
babel src --out-dir dist

echo "bundling..."
rollup -c

echo "copying metadata"
cp *.md dist/
cp package.json dist/
