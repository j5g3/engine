set -e
tsc -b tsconfig.test.json
esbuild ../dist/core/index.js --minify --bundle --format=esm --tsconfig=tsconfig.json --platform=browser --define:CXL_DEBUG=false --outfile=../dist/core/index.bundle.js