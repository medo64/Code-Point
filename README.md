Character Code Point
====================

This extension shows character code point in status bar.


## Features

Shows character code point in hexadecimal or decimal notation.

If more details about characters are desired, one can click on status bar to
quickly switch display style or double-clic to get get plenty more Unicode
related information provided by [compart](https://www.compart.com/en/unicode/).

![Screenshot](https://raw.githubusercontent.com/medo64/code-point/main/images/screenshot.gif)

## Extension Settings

This extension contributes the following settings:

* `codepoint.statusbar`: Determines what will be shown in statusbar:
  * `none`: Nothing;
  * `decimal`: Decimal value of code point (e.g. `77`);
  * `hexadecimal`: Hexadecimal value of code point (e.g. `0x4D`);
  * `unicode`: Unicode code point (e.g. `U+004D`);
  * `description`: Full description is shown (e.g. `LATIN CAPITAL LETTER M`).


## Known Issues

### Mixed Line Endings Are Not Supported

Visual Studio Code normalizes line endings upon load and thus this extension
will only show one kind of line ending character. Currently it is not possible
to have multiple different line endings (see [issue 127](https://github.com/Microsoft/vscode/issues/127)).

### CR Line Ending Is Not Supported

Visual Studio does not support CR line ending (see [issue 35797](https://github.com/Microsoft/vscode/issues/35797)).
Therefore you will never see CR as a line ending.
