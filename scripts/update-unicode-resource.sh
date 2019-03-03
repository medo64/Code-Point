#!/bin/bash

TEMPORARY_DIRECTORY=`mktemp -d`
trap 'rm -rf "$TEMPORARY_DIRECTORY"' EXIT

curl -o "$TEMPORARY_DIRECTORY/UnicodeData.txt" https://unicode.org/Public/UCD/latest/ucd/UnicodeData.txt
if [[ ! -f "$TEMPORARY_DIRECTORY/UnicodeData.txt" ]]; then
    echo "File download failed!" >&2
    exit 1
fi

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
    }
    END {
        print "    { \"code\": \"" code "\", \"description\": \"" description "\" }"
        print "]"
    }
    ' "$TEMPORARY_DIRECTORY/UnicodeData.txt" > "$TEMPORARY_DIRECTORY/UnicodeData.new.txt"

if [[ ! -f "$TEMPORARY_DIRECTORY/UnicodeData.new.txt" ]]; then
    echo "File processing failed!" >&2
    exit 1
fi

SCRIPT_DIRECTORY=`dirname "$0"`
mv "$TEMPORARY_DIRECTORY/UnicodeData.new.txt" "$SCRIPT_DIRECTORY/../resources/unicode.json"
