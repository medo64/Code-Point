#!/bin/bash

TEMPORARY_DIRECTORY=`mktemp -d`
trap 'rm -rf "$TEMPORARY_DIRECTORY"' EXIT

curl -o "$TEMPORARY_DIRECTORY/UnicodeData.txt" https://unicode.org/Public/UCD/latest/ucd/UnicodeData.txt
if [[ ! -f "$TEMPORARY_DIRECTORY/UnicodeData.txt" ]]; then
    echo "File download failed!" >&2
    exit 1
fi


# Descriptions

awk '
    BEGIN {
        FS=";"
        print "["
    }
    NR>1 {
        if (description !~ /, (First|Last)>$/) {
            if (NR > 2) { printf ",\n" }
            printf "{\"c\":\"" code "\",\"d\":\"" description "\"}"
        }
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
        printf "\n"
        print "]"
    }
    ' "$TEMPORARY_DIRECTORY/UnicodeData.txt" > "$TEMPORARY_DIRECTORY/unicode.json"

if [[ ! -f "$TEMPORARY_DIRECTORY/unicode.json" ]]; then
    echo "File processing failed!" >&2
    exit 1
fi

SCRIPT_DIRECTORY=`dirname "$0"`
mv "$TEMPORARY_DIRECTORY/unicode.json" "$SCRIPT_DIRECTORY/../resources/unicode.json"


# Unicode JS

echo '"use strict"' > "$TEMPORARY_DIRECTORY/unicode.js"

## Combining marks

awk -Wposix '
    BEGIN {
        FS=";"
        print ""
        print "function isCombiningMark(cp) {"
        firstCodeDec = 0
        firstCodeHex = 0
        lastCodeDec = 0
        lastCodeHex = 0
    }
    NR>1 {
        if (class ~ /^M.$/) {
            codeDec = sprintf("%d", "0x" code)
            if (firstCodeDec == 0) {
                firstCodeDec = codeDec
                firstCodeHex = code
                lastCodeDec = codeDec - 1
                lastCodeHex = code
            }
            if (codeDec != lastCodeDec + 1) {
                if (firstCodeHex == lastCodeHex) {
                    print "    if (cp == 0x" firstCodeHex ") { return true }"
                } else {
                    print "    if ((cp >= 0x" firstCodeHex ") && (cp <= 0x" lastCodeHex ")) { return true }"
                }
                firstCodeDec = codeDec
                firstCodeHex = code
                lastCodeDec = codeDec
                lastCodeHex = code
            } else {
                lastCodeDec = codeDec
                lastCodeHex = code
            }
        }
    }
    {
        code = $1
        class = $3
    }
    END {
        if (firstCodeHex == lastCodeHex) {
            print "    if (cp == 0x" firstCodeHex ") { return true }"
        } else {
            print "    if ((cp >= 0x" firstCodeHex ") && (cp <= 0x" lastCodeHex ")) { return true }"
        }
        print "    return false"
        print "}"
        print "exports.isCombiningMark = isCombiningMark"
    }
    ' "$TEMPORARY_DIRECTORY/UnicodeData.txt" >> "$TEMPORARY_DIRECTORY/unicode.js"

## Range descriptions


awk -Wposix '
    BEGIN {
        FS=";"
        print ""
        firstCode = ""
        print "function getRangeDescription(cp) {"
    }
    NR>1 {
        if (description ~ /, First>$/) {
            firstCode = code
        } else if (description ~ /, Last>$/) {
            gsub(/^</, "", description)
            gsub(/, Last>$/, "", description)
            print "    if ((cp >= 0x" firstCode ") && (cp <= 0x" code ")) { return \"" toupper(description) "\" }"
        }
    }
    {
        code = $1
        description = $2
    }
    END {
        print "    return null"
        print "}"
        print "exports.getRangeDescription = getRangeDescription"
    }
    ' "$TEMPORARY_DIRECTORY/UnicodeData.txt" >> "$TEMPORARY_DIRECTORY/unicode.js"

if [[ ! -f "$TEMPORARY_DIRECTORY/unicode.js" ]]; then
    echo "File processing failed!" >&2
    exit 1
fi

SCRIPT_DIRECTORY=`dirname "$0"`
mv "$TEMPORARY_DIRECTORY/unicode.js" "$SCRIPT_DIRECTORY/../out/unicode.js"
