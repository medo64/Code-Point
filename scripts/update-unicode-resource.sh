#!/bin/bash

SCRIPT_DIRECTORY=`dirname "$0"`
TEMPORARY_DIRECTORY=`mktemp -d`
trap 'rm -rf "$TEMPORARY_DIRECTORY"' EXIT

curl -o "$TEMPORARY_DIRECTORY/UnicodeData.txt" https://unicode.org/Public/UCD/latest/ucd/UnicodeData.txt
if [[ ! -s "$TEMPORARY_DIRECTORY/UnicodeData.txt" ]]; then
    echo "Unicode data file download failed!" >&2
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
    ' "$TEMPORARY_DIRECTORY/UnicodeData.txt" > "$TEMPORARY_DIRECTORY/unicode.descriptions.json"

if [[ ! -s "$TEMPORARY_DIRECTORY/unicode.descriptions.json" ]]; then
    echo "Unicode file processing failed (descriptions)!" >&2
    exit 1
fi

mv "$TEMPORARY_DIRECTORY/unicode.descriptions.json" "$SCRIPT_DIRECTORY/../resources/unicode.json"


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
    ' "$TEMPORARY_DIRECTORY/UnicodeData.txt" > "$TEMPORARY_DIRECTORY/unicode.combiningmarks.js"

if [[ ! -s "$TEMPORARY_DIRECTORY/unicode.combiningmarks.js" ]]; then
    echo "Unicode file processing failed (combining marks)!" >&2
    exit 1
fi


# Range descriptions


awk -Wposix '
    BEGIN {
        FS=";"
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
    ' "$TEMPORARY_DIRECTORY/UnicodeData.txt" > "$TEMPORARY_DIRECTORY/unicode.rangedescriptions.js"

if [[ ! -f "$TEMPORARY_DIRECTORY/unicode.rangedescriptions.js" ]]; then
    echo "Unicode file processing failed (range descriptions)!" >&2
    exit 1
fi


# Unicode JS

echo '"use strict"' > "$TEMPORARY_DIRECTORY/unicode.js"
echo >> "$TEMPORARY_DIRECTORY/unicode.js"
cat "$TEMPORARY_DIRECTORY/unicode.combiningmarks.js" >> "$TEMPORARY_DIRECTORY/unicode.js"
echo >> "$TEMPORARY_DIRECTORY/unicode.js"
cat "$TEMPORARY_DIRECTORY/unicode.rangedescriptions.js" >> "$TEMPORARY_DIRECTORY/unicode.js"

mv "$TEMPORARY_DIRECTORY/unicode.js" "$SCRIPT_DIRECTORY/../out/unicode.js"
