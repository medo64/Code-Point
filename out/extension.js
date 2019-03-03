'use strict'

const vscode = require('vscode')


function activate(context) {
    var statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 28433)
    statusBarItem.tooltip = "Character code point"

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

        if (showAsDecimal) {
            statusBarItem.text = selectionCodePoint.toString()
        } else {
            let hex = selectionCodePoint.toString(16).toUpperCase()
            if (selectionCodePoint <= 0xFF) {
                hex = "0".repeat(2 - hex.length) + hex
            } else if (selectionCodePoint <= 0xFFFF) {
                hex = "0".repeat(4 - hex.length) + hex
            }
            statusBarItem.text = "0x" + hex
        }

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
