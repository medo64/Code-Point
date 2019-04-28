'use strict'

const vscode = require('vscode')
const fs = require("fs");
const path = require("path");


function activate(context) {
    var statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 28433)
    statusBarItem.command = "codepoint.describe"
    statusBarItem.tooltip = "Character code point"

    var unicodeDescriptions = {};

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
    });

    var lookupCode

    vscode.commands.registerTextEditorCommand("codepoint.describe", () => {
        if (lookupCode == null) {
            vscode.commands.executeCommand("vscode.open", vscode.Uri.parse("https://www.compart.com/en/unicode/"))
        } else {
            vscode.commands.executeCommand("vscode.open", vscode.Uri.parse("https://www.compart.com/en/unicode/U+" + lookupCode))
        }
    });

    var statusbarStyle


    function getCodePoint(document, selection) {
        //get code point for character after selection
        const selectionRange = new vscode.Range(selection.active, document.validatePosition(selection.active.translate(0, 2)))
        const selectionText = document.getText(selectionRange)
        if (selectionText) { return selectionText.codePointAt(0) }

        //get code point for character before selection, if it's the last character
        if (selection.isEmpty) {
            const selectionLine = document.lineAt(selection.active)
            if ((selectionLine.range.end.character > 0) && (selection.active.character >= selectionLine.range.end.character)) {
                const backwardSelectionStart = new vscode.Position(selection.active.line, (selectionLine.range.end.character >= 2) ? selectionLine.range.end.character - 2 : selectionLine.range.end.character - 1)
                const backwardSelectionRange = new vscode.Range(backwardSelectionStart, selection.active)
                const backwardSelectionText = document.getText(backwardSelectionRange)
                if (backwardSelectionText) {
                    const backwardCodePoint = backwardSelectionText.codePointAt(0)
                    if (backwardSelectionText.length == 1) { //only single character
                        return backwardSelectionText.codePointAt(0)
                    } else if (backwardCodePoint >= 0x10000) { //check if 2-char codepoint applies
                        return backwardCodePoint
                    } else { //ignore first character
                        return backwardSelectionText.codePointAt(1)
                    }
                }
            }
        }

        return null
    }

    function updateStatusbar(editor) {
        lookupCode = null

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

        const selectionCodePoint = getCodePoint(document, selection)
        if (selectionCodePoint === undefined) {
            statusBarItem.hide()
            return
        }

        const selectionCodePointAsHex = selectionCodePoint.toString(16).toUpperCase()

        const decimal = selectionCodePoint.toString()
        let hexadecimal
        if (selectionCodePoint <= 0xFF) {
            hexadecimal = "0x" + "0".repeat(2 - selectionCodePointAsHex.length) + selectionCodePointAsHex
        } else if (selectionCodePoint <= 0xFFFF) {
            hexadecimal = "0x" + "0".repeat(4 - selectionCodePointAsHex.length) + selectionCodePointAsHex
        } else {
            hexadecimal = "0x" + selectionCodePointAsHex
        }

        lookupCode = (selectionCodePoint <= 0xFFF) ? "0".repeat(4 - selectionCodePointAsHex.length) + selectionCodePointAsHex : selectionCodePointAsHex
        let title = unicodeDescriptions[lookupCode]
        let description = title
        if (!title) { title = hexadecimal }
        if (!description) { description = "Unrecognized character code point" }

        if (statusbarStyle.startsWith("dec")) {
            statusBarItem.text = decimal;
        } else if (statusbarStyle.startsWith("hex")) {
            statusBarItem.text = hexadecimal
        } else if (statusbarStyle.startsWith("description")) {
            statusBarItem.text = title
        } else {
            statusBarItem.text = "U+" + lookupCode
        }

        statusBarItem.tooltip = "U+" + lookupCode + ": " + description + "\n\n" + hexadecimal + " (" + decimal + ")"

        if (statusbarStyle.startsWith("none")) {
            statusBarItem.hide() //just in case we have extension loaded but don't want output
        } else {
            statusBarItem.show() //just in case it was hidden before
        }
    }


    function updateConfiguration() {
        var anyChanges = false

        var customConfiguration = vscode.workspace.getConfiguration('codepoint', null)

        var newStatusbarStyle = customConfiguration.get('statusbar', "hexadecimal").toLowerCase()
        if (statusbarStyle !== newStatusbarStyle) {
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
