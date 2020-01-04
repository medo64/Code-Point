#!/bin/bash

TEMPORARY_DIRECTORY=`mktemp -d`
trap 'rm -rf "$TEMPORARY_DIRECTORY"' EXIT

curl -o "$TEMPORARY_DIRECTORY/UnicodeData.txt" https://unicode.org/Public/UCD/latest/ucd/UnicodeData.txt
if [[ ! -f "$TEMPORARY_DIRECTORY/UnicodeData.txt" ]]; then
    echo "File download failed!" >&2
    exit 1
fi


# General information file

awk '
    BEGIN {
        FS=";"
        print "["
    }
    NR>1 {
        print "    { \"code\": \"" code "\", \"description\": \"" description "\" },"
    }
    {
        code = $1
        description = $2
        if ((description ~ /^<.*>$/) && ($11 != "")) {
            gsub(/ \(.*\)$/, "", $11)
            description = "<" $11 ">"
        }
    }
    END {
        print "    { \"code\": \"" code "\", \"description\": \"" description "\" }"
        print "]"
    }
    ' "$TEMPORARY_DIRECTORY/UnicodeData.txt" > "$TEMPORARY_DIRECTORY/unicode.json"

if [[ ! -f "$TEMPORARY_DIRECTORY/unicode.json" ]]; then
    echo "File processing failed!" >&2
    exit 1
fi

SCRIPT_DIRECTORY=`dirname "$0"`
mv "$TEMPORARY_DIRECTORY/unicode.json" "$SCRIPT_DIRECTORY/../resources/unicode.json"


# Combining marks

awk '
    BEGIN {
        FS=";"
        print "function isCombiningMark(cp) {"
    }
    NR>1 {
        if (class ~ /^M.$/) {
            print "    if (cp === 0x" code ") { return true }"
        }
    }
    {
        code = $1
        class = $3
    }
    END {
        print "    return false"
        print "}"
        print "exports.isCombiningMark = isCombiningMark"
    }
    ' "$TEMPORARY_DIRECTORY/UnicodeData.txt" > "$TEMPORARY_DIRECTORY/unicode.js"

if [[ ! -f "$TEMPORARY_DIRECTORY/unicode.js" ]]; then
    echo "File processing failed!" >&2
    exit 1
fi

SCRIPT_DIRECTORY=`dirname "$0"`
mv "$TEMPORARY_DIRECTORY/unicode.js" "$SCRIPT_DIRECTORY/../out/unicode.js"
