#!/usr/bin/env bash

# get base dir so that we source from the correct location
DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi

# get helpers
source "$DIR/errorExit.sh" || error_exit "$LINENO: errorExit not found."
source "$DIR/cleanGitTree.sh" || error_exit "$LINENO: cleanGitTree not found."

# clean
rm -rf "$DIR/../0.0" || error_exit "$LINENO: could not remove 0.0"

# get piQuest source
source "$DIR/getSource.sh" || error_exit "$LINENO: could not get piQuest source."

# get API.md
source "$DIR/getAPImd.sh" || error_exit "$LINENO: could not get API.md"

