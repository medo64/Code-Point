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
            for (let i=0; i<unicodeDictionaryObject.length; i++) {
                const entry = unicodeDictionaryObject[i]
                const code = entry.code
                const description = entry.description
                unicodeDescriptions[code] = description
            }
        }
    });

    var lookupCode

    const commandRegistration = vscode.commands.registerTextEditorCommand("codepoint.describe", () => {
        if (lookupCode == null) {
            vscode.commands.executeCommand("vscode.open", vscode.Uri.parse("https://www.compart.com/en/unicode/"))
        } else {
            vscode.commands.executeCommand("vscode.open", vscode.Uri.parse("https://www.compart.com/en/unicode/U+" + lookupCode))
        }
    });

    var showAsDecimal


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
        if (!selectionCodePoint) {
            statusBarItem.hide()
            return
        }

        const selectionCodePointAsHex = selectionCodePoint.toString(16).toUpperCase()

        let text
        if (showAsDecimal) {
            text = selectionCodePoint.toString()
        } else if (selectionCodePoint <= 0xFF) {
            text = "0x" + "0".repeat(2 - selectionCodePointAsHex.length) + selectionCodePointAsHex
        } else if (selectionCodePoint <= 0xFFFF) {
            text = "0x" + "0".repeat(4 - selectionCodePointAsHex.length) + selectionCodePointAsHex
        } else {
            text = "0x" + selectionCodePointAsHex
        }

        lookupCode = (selectionCodePoint <= 0xFFF) ? "0".repeat(4 - selectionCodePointAsHex.length) + selectionCodePointAsHex : selectionCodePointAsHex
        let description = unicodeDescriptions[lookupCode]
        if (!description) { description = "Unrecognized character code point" }

        statusBarItem.text = text
        statusBarItem.tooltip = description
        statusBarItem.show() //just in case it was hidden before
    }


    function updateConfiguration() {
        var anyChanges = false

        var customConfiguration = vscode.workspace.getConfiguration('codepoint', null)
        var newShowAsDecimal = customConfiguration.get('decimal', false)

        if (showAsDecimal !== newShowAsDecimal) {
            showAsDecimal = newShowAsDecimal
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
