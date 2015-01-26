#!/usr/bin/env bash

# get base dir so that we source from the correct location
DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi

# get helpers
source "$DIR/errorExit.sh" || error_exit "$LINENO: errorExit not found."
source "$DIR/cleanGitTree.sh" || error_exit "$LINENO: cleanGitTree not found."

# make sure that this directory has no changes
require_clean_work_tree "get piQuest 0.0 source"

# create temporary directory that we can use for our stuff...
# http://unix.stackexchange.com/questions/30091/fix-or-alternative-for-mktemp-in-os-x
TMPDIR=`mktemp -d 2>/dev/null || mktemp -d -t 'myTMPDIR'`

# checkout master
git checkout master || error_exit "$LINENO: could not checkout master."

# copy dirs that we want to temporary dir
cp -r dist $TMPDIR || error_exit "$LINENO: could not export to TMPDIR."
cp -r bower_components $TMPDIR || error_exit "$LINENO: could not export to TMPDIR."

# come back to gh-pages
git checkout gh-pages || error_exit "$LINENO: could not checkout gh-pages."

# copy dirs that we want back to gh-pages
rm -rf 0.0/{dist,bower_components}
mv $TMPDIR/** 0.0 || error_exit "$LINENO: could not import from TMPDIR."