#!/usr/bin/env bash

# path to repo
DIR=$(git rev-parse --show-toplevel)

# get helpers
source "$DIR/scripts/errorExit.sh" || error_exit "$LINENO: errorExit not found."

# create temporary directory that we can use for our stuff...
# http://unix.stackexchange.com/questions/30091/fix-or-alternative-for-mktemp-in-os-x
TMPDIR=`mktemp -d 2>/dev/null || mktemp -d -t 'myTMPDIR'`
# TMPDIR=$(cd "$(dirname "$TEMPDIR")"; pwd) # get absolute path to $TMPDIR
trap "rm -Rf $TEMPDIR" EXIT

# make sure current repository is up to date
git fetch --quiet
git fetch --quiet --tags

# create repository clone
cd $TMPDIR
git clone --quiet $DIR .

# checkout_latest($version): $LATESTTAG
function checkout_latest {
	VERSION=$1

	# Get latest tag name
	LATESTTAG=$(git describe --tags $(git rev-list --tags="v$VERSION*" --max-count=1))

	# Checkout latest tag
	git checkout --quiet $LATESTTAG || error_exit "$LINENO: could not checkout $LATESTTAG."

	echo $LATESTTAG
}


###################################################################
#	copy in all the interestin files...
###################################################################

# copy_dist($SOURCE_DIR, $TARGET_DIR): void
function copy_dist {
	SOURCE_DIR=$1
	TARGET_DIR=$2
	# creat target directory just in gase
	mkdir -p $TARGET_DIR

	# copy dirs that we want to gh-pages
	rm -rf $TARGET_DIR{dist,bower_components,package.json}
	cp -r $SOURCE_DIR/{dist,bower_components,package.json} $TARGET_DIR || error_exit "$LINENO: could not import dist/bower_components."

	# create 0.0 directory if needed
	mkdir -p "$DIR/../src/0.0"
}

LATESTTAG=$(checkout_latest 0.0)
copy_dist $TMPDIR $DIR/0.0

# Concatenate front matter and API.md
# http://stackoverflow.com/questions/23929235/bash-multi-line-string-with-extra-space
######## quest ########
read -r -d '' APItext <<- EOM
	---
	title: API
	description: All the little details...
	---

	$(git show $LATESTTAG:src/js/quest/API.md)
EOM

# create API.md
echo "$APItext" > "$DIR/src/0.0/quest/API.md"

######## manager ########
read -r -d '' APItext <<- EOM
	---
	title: API
	description: All the little details...
	---

	$(git show $LATESTTAG:src/js/taskManager/readme.md)
EOM

# create API.md
echo "$APItext" > "$DIR/src/0.0/manager/API.md"


read -r -d '' APItext <<- EOM
	---
	title: Sequencer
	description: The tools to create dynamic tasks.
	---

	$(git show $LATESTTAG:src/js/utils/database/sequencer.md)
EOM

# create API.md
echo "$APItext" > "$DIR/src/0.0/basics/sequencer.md"
