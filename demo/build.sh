set -e

cxl-build $@

mkdir -p ../docs/demo 
cp ../dist/demo/*.js *.html *.json ../docs/demo

esbuild ../dist/demo/index.js --minify --bundle --format=esm --tsconfig=tsconfig.json --platform=browser --define:CXL_DEBUG=false --outfile=../docs/demo/index.js

