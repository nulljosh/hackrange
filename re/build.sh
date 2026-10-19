#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
mkdir -p bin
for f in crackmes/*.c; do
  name=$(basename "$f" .c)
  clang -O0 -o "bin/$name" "$f"
  strip "bin/$name"
done
echo "built: $(ls bin)"
