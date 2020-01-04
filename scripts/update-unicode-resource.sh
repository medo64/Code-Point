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
        if ((code != "F0000") && (code != "FFFFD") && (code != "100000") && (code != "10FFFD")) {
            if (NR > 2) { printf ",\n" }
            printf "    { \"code\": \"" code "\", \"description\": \"" description "\" }"
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


# Combining marks

awk -Wposix '
    BEGIN {
        FS=";"
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
    ' "$TEMPORARY_DIRECTORY/UnicodeData.txt" > "$TEMPORARY_DIRECTORY/unicode.js"

if [[ ! -f "$TEMPORARY_DIRECTORY/unicode.js" ]]; then
    echo "File processing failed!" >&2
    exit 1
fi

SCRIPT_DIRECTORY=`dirname "$0"`
mv "$TEMPORARY_DIRECTORY/unicode.js" "$SCRIPT_DIRECTORY/../out/unicode.js"
