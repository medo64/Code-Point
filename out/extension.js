'use strict'

const vscode = require('vscode')
const fs = require("fs");
const path = require("path");


function activate(context) {
    var statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 28433)
    statusBarItem.tooltip = "Character code point"

    var unicodeDescriptions = {};

    let unicodeResourcePath = path.resolve(context.extensionPath, "resources/unicode.json")
    fs.readFile(unicodeResourcePath, "utf8", (err, data) => {
        if (!err) {
            var unicodeDictionaryObject = JSON.parse(data)
            for (let i=0; i<unicodeDictionaryObject.length; i++) {
                let entry = unicodeDictionaryObject[i]
                let code = entry.code
                let description = entry.description
                unicodeDescriptions[code] = description
            }
        }
    });

    var showAsDecimal


    function updateStatusbar(editor) {
        if (!editor) {
            statusBarItem.hide()
            return
        }

        const document = editor.document
        if (!document) {
            statusBarItem.hide()
            return
        }

        let selection = editor.selection.active
        if (!selection) {
            statusBarItem.hide()
            return
        }

        let selectionRange = new vscode.Range(selection, selection.translate(0, 2))
        let selectionText = document.getText(selectionRange)
        if (!selectionText) {
            statusBarItem.hide()
            return
        }

        let selectionCodePoint = selectionText.codePointAt(0)
        let selectionCodePointAsHex = selectionCodePoint.toString(16).toUpperCase()

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

        let lookupCode = (selectionCodePoint <= 0xFFF) ? "0".repeat(4 - selectionCodePointAsHex.length) + selectionCodePointAsHex : selectionCodePointAsHex
        let description = unicodeDescriptions[lookupCode]
        if (!description) { description = "Character code point" }

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
