#!/usr/bin/env bash

# path to repo
DOCDIR=$(git rev-parse --show-toplevel)

# get helpers
source "$DOCDIR/scripts/errorExit.sh" || error_exit "$LINENO: errorExit not found."

# create temporary directory that we can use for our stuff...
# http://unix.stackexchange.com/questions/30091/fix-or-alternative-for-mktemp-in-os-x
TMPDIR=`mktemp -d 2>/dev/null || mktemp -d -t 'myTMPDIR'`
# TMPDIR=$(cd "$(dirname "$TEMPDIR")"; pwd) # get absolute path to $TMPDIR
trap "rm -Rf $TMPDIR" EXIT

# make sure current repository is up to date
git fetch --quiet
git fetch --quiet --tags

# create repository clone
cd $TMPDIR
git clone --quiet $DOCDIR .

# checkout_latest($version): $LATESTTAG
function checkout_latest {
	VERSION=$1

	# Get latest tag name
	LATESTTAG=$(git describe --tags $(git rev-list --tags="v$VERSION*" --max-count=1))

	# Checkout latest tag
	git checkout --quiet $LATESTTAG || error_exit "$LINENO: could not checkout $LATESTTAG."
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

}

# import_apis($VERSION, SOURCE_DIR, TARGET_DIR): VOID
function import_apis {
	VERSION=$1
	SOURCE_DIR=$2
	TARGET_DIR=$3

	# create target directory if needed
	mkdir -p $TARGET_DIR

	# Concatenate front matter and API.md
	# http://stackoverflow.com/questions/23929235/bash-multi-line-string-with-extra-space
	######## quest ########
	read -r -d '' APItext <<- EOM
		---
		title: API
		description: All the little details...
		---

		$(cat $SOURCE_DIR/src/js/quest/API.md)
	EOM

	# create API.md
	echo "$APItext" > "$TARGET_DIR/src/$VERSION/quest/API.md"

	######## manager ########
	read -r -d '' APItext <<- EOM
		---
		title: API
		description: All the little details...
		---

		$(cat $SOURCE_DIR/src/js/taskManager/readme.md)
	EOM

	# create API.md
	echo "$APItext" > "$TARGET_DIR/src/$VERSION/manager/API.md"


	read -r -d '' APItext <<- EOM
		---
		title: Sequencer
		description: The tools to create dynamic tasks.
		---

		$(cat $SOURCE_DIR/src/js/utils/database/sequencer.md)
	EOM

	# create API.md
	echo "$APItext" > "$TARGET_DIR/src/$VERSION/basics/sequencer.md"
}

checkout_latest 0.0
copy_dist $TMPDIR $DOCDIR/0.0
import_apis 0.0 $TMPDIR $DOCDIR

checkout_latest 0.1
copy_dist $TMPDIR $DOCDIR/0.1
import_apis 0.1 $TMPDIR $DOCDIR
