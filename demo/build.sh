set -e

cxl-build $@

rm -f ../docs/demo/*
mkdir -p ../docs/demo 
cp ../dist/demo/*.js *.html orbs.json clock.json ../docs/demo

esbuild ../dist/demo/index.js --minify --bundle --format=esm --tsconfig=tsconfig.json --platform=browser --define:CXL_DEBUG=false --outfile=../docs/demo/index.js

