#!/bin/sh
echo "--- AGEND'APP ---\n"
echo "=> bundling meteor app...\n"

/bin/sh meteor-bundle.sh

echo "=> lauching app...\n"

/bin/sh meteor-launch-bundle.sh
