#!/usr/bin/env bash

# get base dir so that we source from the correct location
DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi


# Concatenate front matter and API.md
# http://stackoverflow.com/questions/23929235/bash-multi-line-string-with-extra-space

read -r -d '' APItext <<- EOM
	---
	title: API
	description: All the little details...
	---

	$(git show master:src/js/quest/API.md)
EOM

# create 0.0 directory if needed
mkdir -p "$DIR/../src/0.0"

# create API.md
echo "$APItext" > "$DIR/../src/0.0/API.md"




#
# echo "$APIfrontMatter $(git show master:src/js/quest/API.md)" > ../src/0.0/API.md