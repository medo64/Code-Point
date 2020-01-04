'use strict'

const vscode = require('vscode')
const fs = require("fs")
const path = require("path")


function activate(context) {
    var statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 28433)
    statusBarItem.command = "codepoint.describe"
    statusBarItem.tooltip = "Character code point"

    var unicodeDescriptions = {}

    const unicodeResourcePath = path.resolve(context.extensionPath, "resources/unicode.json")
    fs.readFile(unicodeResourcePath, "utf8", (err, data) => {
        if (!err) {
            var unicodeDictionaryObject = JSON.parse(data)
            for (let i = 0; i < unicodeDictionaryObject.length; i++) {
                const entry = unicodeDictionaryObject[i]
                const code = entry.code
                const description = entry.description
                unicodeDescriptions[code] = description
            }
        }
    })

    var lastCodePoints
    var doubleClickTimerId

    vscode.commands.registerTextEditorCommand("codepoint.describe", () => {
        if (doubleClickTimerId) { //if timer still exists, it's a double-click
            clearTimeout(doubleClickTimerId) //cancel timer
            doubleClickTimerId = undefined

            updateStatusbar(vscode.window.activeTextEditor)
            if (lastCodePoints == null) {
                vscode.commands.executeCommand("vscode.open", vscode.Uri.parse("https://www.compart.com/en/unicode/"))
            } else {
                lastCodePoints.forEach(codePoint => {
                    const lookupCode = toHexadecimalLookup(codePoint)
                    vscode.commands.executeCommand("vscode.open", vscode.Uri.parse("https://www.compart.com/en/unicode/U+" + lookupCode))
                })
            }
        } else {
            doubleClickTimerId = setTimeout(nextStyle, 250) //do single-click once timer has elapsed
        }
    })

    function nextStyle() {
        clearTimeout(doubleClickTimerId) //cancel timer
        doubleClickTimerId = undefined

        statusbarStyle = (statusbarStyle + 1) % 4 //advance to next display style
        updateStatusbar(vscode.window.activeTextEditor)
    }

    var statusbarStyle
    var statusbarStyleAsText


    function getCodePoints(document, selection) {
        //get code point for character after selection
        const selectionRange = new vscode.Range(selection.active, document.validatePosition(selection.active.translate(0, 20))) //get enough characters to deal with decomposing them
        const selectionText = document.getText(selectionRange)

        if (selectionText) {
            let result = []
            let prevCodePoint = undefined
            let useNext = 1
            let checkNext = 2
            for (const ch of selectionText) {
                const codePoint = ch.codePointAt(0)

                if (result.length >= 1) { //start checking for specials once we have first character
                    if ((codePoint >= 0x300) && (codePoint <= 0x36F)) { //combining characters
                        result.push(codePoint) //return this and previous character
                        break
                    } else if ((prevCodePoint >= 0x1F1E6) && (prevCodePoint <= 0x1F1FF) && (codePoint >= 0x1F1E6) && (codePoint <= 0x1F1FF)) { //flags
                        result.push(codePoint) //return this and previous character
                        break
                    } else if ((codePoint >= 0x1F1E6) && (codePoint <= 0x1F1FF)) { //ignore start of flag after normal character
                        break
                    } else if (codePoint == 0x200D) { //zero-width joiner
                        useNext = 2
                        checkNext = 2
                    } else if ((codePoint >= 0xFE00) && (codePoint <= 0xFE0F)) { //variation selector
                        useNext = 2
                        checkNext = 2
                    } else if (useNext == 0) { //special sequence has ended
                        break
                    }
                }

                if (useNext > 0) {
                    result.push(codePoint)
                    useNext -= 1
                }
                prevCodePoint = codePoint

                if (checkNext == 0) { //no more characters to check for joiners or combining marks
                    break
                } else {
                    checkNext -= 1
                }
            }

            return result
        }

        if (selection.isEmpty) { //get code point for EOL
            const LF = 1
            const CRLF = 2
            if (document.eol === LF) {
                return [ 10 ]
            } else if (document.eol === CRLF) {
                return [ 13, 10 ]
            }
        }

        return null
    }

    function toHexadecimal(codePoint) {
        const selectionCodePointAsHex = codePoint.toString(16).toUpperCase()

        if (codePoint <= 0xFF) {
            return "0x" + "0".repeat(2 - selectionCodePointAsHex.length) + selectionCodePointAsHex
        } else if (codePoint <= 0xFFFF) {
            return "0x" + "0".repeat(4 - selectionCodePointAsHex.length) + selectionCodePointAsHex
        } else {
            return "0x" + selectionCodePointAsHex
        }
    }

    function toHexadecimalLookup(codePoint) {
        const selectionCodePointAsHex = codePoint.toString(16).toUpperCase()
        return (codePoint <= 0xFFF) ? "0".repeat(4 - selectionCodePointAsHex.length) + selectionCodePointAsHex : selectionCodePointAsHex
    }

    function updateStatusbar(editor) {
        if (statusbarStyle === STATUSBARSTYLE_NONE) {
            statusBarItem.hide() //just in case we have extension loaded but don't want output
            return
        }

        if (!editor) {
            statusBarItem.hide()
            return
        }

        const document = editor.document
        if (!document) {
            statusBarItem.hide()
            return
        }

        const selection = editor.selection
        if (!selection) {
            statusBarItem.hide()
            return
        }

        const codePoints = getCodePoints(document, selection)
        if ((codePoints === undefined) || (codePoints === null)) {
            statusBarItem.hide()
            return
        }

        let decimalText = ""
        let hexadecimalText = ""
        let descriptionText = ""
        let unicodeText = ""
        let tooltipText = ""
        codePoints.forEach(codePoint => {
            const decimal = codePoint.toString()
            if (decimalText.length > 0) { decimalText += ", " }
            decimalText += decimal

            const hexadecimal = toHexadecimal(codePoint)
            if (hexadecimalText.length > 0) { hexadecimalText += ", " }
            hexadecimalText += hexadecimal

            const lookupCode = toHexadecimalLookup(codePoint)
            let description = unicodeDescriptions[lookupCode]
            if (!description) { description = "?" }

            if (descriptionText.length > 0) { descriptionText += ", " }
            descriptionText += description

            const unicode = "U+" + lookupCode
            if (unicodeText.length > 0) { unicodeText += ", " }
            unicodeText += unicode

            const tooltip = unicode + "   " + hexadecimal + "   " + decimal + "\n" + description
            if (tooltipText.length > 0) { tooltipText += "\n\n" }
            tooltipText += tooltip
        })
        lastCodePoints = codePoints

        switch(statusbarStyle) {
            case STATUSBARSTYLE_DECIMAL:
                statusBarItem.text = decimalText
                break
            case STATUSBARSTYLE_HEXADECIMAL:
                statusBarItem.text = hexadecimalText
                break
            case STATUSBARSTYLE_DESCRIPTION:
                statusBarItem.text = descriptionText
                break
            default:
                statusBarItem.text = unicodeText
                break
        }

        statusBarItem.tooltip = tooltipText
        statusBarItem.show() //just in case it was hidden before
    }


    const STATUSBARSTYLE_NONE = -1
    const STATUSBARSTYLE_DECIMAL = 0
    const STATUSBARSTYLE_HEXADECIMAL = 1
    const STATUSBARSTYLE_UNICODE = 2
    const STATUSBARSTYLE_DESCRIPTION = 3

    function updateConfiguration() {
        var anyChanges = false

        var customConfiguration = vscode.workspace.getConfiguration('codepoint', null)

        const newStatusbarStyleAsText = customConfiguration.get('statusbar', "hexadecimal").toLowerCase()
        var newStatusbarStyle
        if (newStatusbarStyleAsText.startsWith("none") || (newStatusbarStyleAsText === "")) {
            newStatusbarStyle = STATUSBARSTYLE_NONE
        } else if (newStatusbarStyleAsText.startsWith("dec")) {
            newStatusbarStyle = STATUSBARSTYLE_DECIMAL
        } else if (newStatusbarStyleAsText.startsWith("hex")) {
            newStatusbarStyle = STATUSBARSTYLE_HEXADECIMAL
        } else if (newStatusbarStyleAsText.startsWith("desc")) {
            newStatusbarStyle = STATUSBARSTYLE_DESCRIPTION
        } else {
            newStatusbarStyle = STATUSBARSTYLE_UNICODE
        }

        if (statusbarStyleAsText !== newStatusbarStyleAsText) { //detect on text so it leaves statubar click functionality alone
            statusbarStyleAsText = newStatusbarStyleAsText
            statusbarStyle = newStatusbarStyle
            anyChanges = true
        }

        return anyChanges
    }


    updateConfiguration()
    updateStatusbar(vscode.window.activeTextEditor)


    vscode.window.onDidChangeActiveTextEditor((e) => {
        updateStatusbar(e)
    }, null, context.subscriptions)

    vscode.window.onDidChangeTextEditorSelection((e) => {
        updateStatusbar(e.textEditor)
    }, null, context.subscriptions)

    vscode.workspace.onDidChangeTextDocument(() => {
        updateStatusbar(vscode.window.activeTextEditor)
    }, null, context.subscriptions)

    vscode.workspace.onDidChangeConfiguration(() => {
        if (updateConfiguration()) {
            updateStatusbar(vscode.window.activeTextEditor)
        }
    }, null, context.subscriptions)
}
exports.activate = activate


function deactivate() {
}
exports.deactivate = deactivate
