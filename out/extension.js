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

    var lookupCode
    var doubleClickTimerId

    vscode.commands.registerTextEditorCommand("codepoint.describe", () => {
        if (doubleClickTimerId) { //if timer still exists, it's a double-click
            clearTimeout(doubleClickTimerId) //cancel timer
            doubleClickTimerId = undefined

            updateStatusbar(vscode.window.activeTextEditor)
            if (lookupCode == null) {
                vscode.commands.executeCommand("vscode.open", vscode.Uri.parse("https://www.compart.com/en/unicode/"))
            } else {
                vscode.commands.executeCommand("vscode.open", vscode.Uri.parse("https://www.compart.com/en/unicode/U+" + lookupCode))
            }
        } else {
            doubleClickTimerId = setTimeout(nextStyle, 250); //do single-click once timer has elapsed
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
        const selectionRange = new vscode.Range(selection.active, document.validatePosition(selection.active.translate(0, 5)))
        const selectionText = document.getText(selectionRange)
        if (selectionText) {
            const codePoint = selectionText.codePointAt(0)
            if ((codePoint >= 0x1F1E6) && (codePoint <= 0x1F1FF)) { //special flag handling
                const codePoint2 = selectionText.codePointAt(2);
                if ((codePoint2 >= 0x1F1E6) && (codePoint2 <= 0x1F1FF)) {
                    return [ codePoint, codePoint2 ]
                }
            }
            return [ codePoint ]
        }

        //get code point for character before selection, if it's the last character
        if (selection.isEmpty) {
            const selectionLine = document.lineAt(selection.active)
            if ((selectionLine.range.end.character > 0) && (selection.active.character >= selectionLine.range.end.character)) {
                const backwardSelectionStart = new vscode.Position(selection.active.line,
                    (selectionLine.range.end.character >= 4) ? selectionLine.range.end.character - 4 :
                    (selectionLine.range.end.character >= 3) ? selectionLine.range.end.character - 3 :
                    (selectionLine.range.end.character >= 2) ? selectionLine.range.end.character - 2 :
                    selectionLine.range.end.character - 1)
                const backwardSelectionRange = new vscode.Range(backwardSelectionStart, selection.active)
                const backwardSelectionText = document.getText(backwardSelectionRange)
                if (backwardSelectionText) {
                    if (backwardSelectionText.length == 1) { //only single character
                        return [ backwardSelectionText.codePointAt(0) ]
                    } else {
                        const backwardCodePoint2 = backwardSelectionText.codePointAt(backwardSelectionText.length - 2)
                        const backwardCodePoint1 = backwardSelectionText.codePointAt(backwardSelectionText.length - 1)
                        if ((backwardCodePoint2 >= 0x1F1E6) && (backwardCodePoint2 <= 0x1F1FF) && (backwardSelectionText.length >= 4)) { //special flag handling
                            const backwardCodePoint4 = backwardSelectionText.codePointAt(backwardSelectionText.length - 4)
                            if ((backwardCodePoint4 >= 0x1F1E6) && (backwardCodePoint4 <= 0x1F1FF)) { //special flag handling
                                return [ backwardCodePoint4, backwardCodePoint2 ]
                            }
                        } else if (backwardCodePoint2 >= 0x10000) { //check if 2-char codepoint applies
                            return [ backwardCodePoint2 ]
                        }
                        return [ backwardCodePoint1 ] //return only last character
                    }
                }
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
            decimalText += decimal;

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
        });

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
