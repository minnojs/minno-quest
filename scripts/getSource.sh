#!/usr/bin/env bash

# get base dir so that we source from the correct location
DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi

# get absolute path to the base repository
DIR=$(readlink -f $DIR/..)

# get helpers
source "$DIR/scripts/errorExit.sh" || error_exit "$LINENO: errorExit not found."

# create temporary directory that we can use for our stuff...
# http://unix.stackexchange.com/questions/30091/fix-or-alternative-for-mktemp-in-os-x
TMPDIR=`mktemp -d 2>/dev/null || mktemp -d -t 'myTMPDIR'`
TMPDIR=$(readlink -f $TMPDIR)
trap "rm -Rf $TEMPDIR" EXIT

git fetch --quiet

# create repository clone
cd $TMPDIR
git clone --quiet $DIR .

# Get new tags from remote
git fetch --quiet --tags

VERSION="0.0"

# Get latest tag name
LATESTTAG=$(git describe --tags $(git rev-list --tags="v$VERSION*" --max-count=1))

# Checkout latest tag
git checkout --quiet $LATESTTAG || error_exit "$LINENO: could not checkout LATESTTAG."

# copy dirs that we want to gh-pages
rm -rf $DIR/$VERSION/{dist,bower_components}

cp -r dist $DIR/$VERSION/ || error_exit "$LINENO: could not import dist."
cp -r bower_components $DIR/$VERSION/ || error_exit "$LINENO: could not import bower_components."