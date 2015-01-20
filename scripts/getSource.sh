#!/usr/bin/env bash

PROGNAME=$(basename $0)
function error_exit
{

#	----------------------------------------------------------------
#	Function for exit due to fatal program error
#		Accepts 1 argument:
#			string containing descriptive error message
#	----------------------------------------------------------------

	echo "${PROGNAME}: ${1:-"Unknown Error"}" 1>&2
	exit 1
}


require_clean_work_tree () {
    # Update the index
    git update-index -q --ignore-submodules --refresh
    err=0

    # Disallow unstaged changes in the working tree
    if ! git diff-files --quiet --ignore-submodules --
    then
        echo >&2 "cannot $1: you have unstaged changes."
        git diff-files --name-status -r --ignore-submodules -- >&2
        err=1
    fi

    # Disallow uncommitted changes in the index
    if ! git diff-index --cached --quiet HEAD --ignore-submodules --
    then
        echo >&2 "cannot $1: your index contains uncommitted changes."
        git diff-index --cached --name-status -r --ignore-submodules HEAD -- >&2
        err=1
    fi

    if [ $err = 1 ]
    then
        echo >&2 "Please commit or stash them."
        exit 1
    fi
}

require_clean_work_tree "get piQuest 0.0 source"

# http://unix.stackexchange.com/questions/30091/fix-or-alternative-for-mktemp-in-os-x
TMPDIR=`mktemp -d 2>/dev/null || mktemp -d -t 'myTMPDIR'`
echo "git --work-tree=$TMPDIR checkout master -- dist"
git --work-tree=$TMPDIR checkout master -- dist || error_exit "$LINENO: failed getting dist."
git --work-tree=$TMPDIR checkout master -- bower_components || error_exit "$LINENO: failed getting bower_components."

rm -rf 0.0/{dist,bower_components}
mv $TMPDIR/** 0.0