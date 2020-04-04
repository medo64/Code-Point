"use strict"

function isCombiningMark(cp) {
    if ((cp >= 0x0300) && (cp <= 0x036F)) { return true }
    if ((cp >= 0x0483) && (cp <= 0x0489)) { return true }
    if ((cp >= 0x0591) && (cp <= 0x05BD)) { return true }
    if (cp == 0x05BF) { return true }
    if ((cp >= 0x05C1) && (cp <= 0x05C2)) { return true }
    if ((cp >= 0x05C4) && (cp <= 0x05C5)) { return true }
    if (cp == 0x05C7) { return true }
    if ((cp >= 0x0610) && (cp <= 0x061A)) { return true }
    if ((cp >= 0x064B) && (cp <= 0x065F)) { return true }
    if (cp == 0x0670) { return true }
    if ((cp >= 0x06D6) && (cp <= 0x06DC)) { return true }
    if ((cp >= 0x06DF) && (cp <= 0x06E4)) { return true }
    if ((cp >= 0x06E7) && (cp <= 0x06E8)) { return true }
    if ((cp >= 0x06EA) && (cp <= 0x06ED)) { return true }
    if (cp == 0x0711) { return true }
    if ((cp >= 0x0730) && (cp <= 0x074A)) { return true }
    if ((cp >= 0x07A6) && (cp <= 0x07B0)) { return true }
    if ((cp >= 0x07EB) && (cp <= 0x07F3)) { return true }
    if (cp == 0x07FD) { return true }
    if ((cp >= 0x0816) && (cp <= 0x0819)) { return true }
    if ((cp >= 0x081B) && (cp <= 0x0823)) { return true }
    if ((cp >= 0x0825) && (cp <= 0x0827)) { return true }
    if ((cp >= 0x0829) && (cp <= 0x082D)) { return true }
    if ((cp >= 0x0859) && (cp <= 0x085B)) { return true }
    if ((cp >= 0x08D3) && (cp <= 0x08E1)) { return true }
    if ((cp >= 0x08E3) && (cp <= 0x0903)) { return true }
    if ((cp >= 0x093A) && (cp <= 0x093C)) { return true }
    if ((cp >= 0x093E) && (cp <= 0x094F)) { return true }
    if ((cp >= 0x0951) && (cp <= 0x0957)) { return true }
    if ((cp >= 0x0962) && (cp <= 0x0963)) { return true }
    if ((cp >= 0x0981) && (cp <= 0x0983)) { return true }
    if (cp == 0x09BC) { return true }
    if ((cp >= 0x09BE) && (cp <= 0x09C4)) { return true }
    if ((cp >= 0x09C7) && (cp <= 0x09C8)) { return true }
    if ((cp >= 0x09CB) && (cp <= 0x09CD)) { return true }
    if (cp == 0x09D7) { return true }
    if ((cp >= 0x09E2) && (cp <= 0x09E3)) { return true }
    if (cp == 0x09FE) { return true }
    if ((cp >= 0x0A01) && (cp <= 0x0A03)) { return true }
    if (cp == 0x0A3C) { return true }
    if ((cp >= 0x0A3E) && (cp <= 0x0A42)) { return true }
    if ((cp >= 0x0A47) && (cp <= 0x0A48)) { return true }
    if ((cp >= 0x0A4B) && (cp <= 0x0A4D)) { return true }
    if (cp == 0x0A51) { return true }
    if ((cp >= 0x0A70) && (cp <= 0x0A71)) { return true }
    if (cp == 0x0A75) { return true }
    if ((cp >= 0x0A81) && (cp <= 0x0A83)) { return true }
    if (cp == 0x0ABC) { return true }
    if ((cp >= 0x0ABE) && (cp <= 0x0AC5)) { return true }
    if ((cp >= 0x0AC7) && (cp <= 0x0AC9)) { return true }
    if ((cp >= 0x0ACB) && (cp <= 0x0ACD)) { return true }
    if ((cp >= 0x0AE2) && (cp <= 0x0AE3)) { return true }
    if ((cp >= 0x0AFA) && (cp <= 0x0AFF)) { return true }
    if ((cp >= 0x0B01) && (cp <= 0x0B03)) { return true }
    if (cp == 0x0B3C) { return true }
    if ((cp >= 0x0B3E) && (cp <= 0x0B44)) { return true }
    if ((cp >= 0x0B47) && (cp <= 0x0B48)) { return true }
    if ((cp >= 0x0B4B) && (cp <= 0x0B4D)) { return true }
    if ((cp >= 0x0B55) && (cp <= 0x0B57)) { return true }
    if ((cp >= 0x0B62) && (cp <= 0x0B63)) { return true }
    if (cp == 0x0B82) { return true }
    if ((cp >= 0x0BBE) && (cp <= 0x0BC2)) { return true }
    if ((cp >= 0x0BC6) && (cp <= 0x0BC8)) { return true }
    if ((cp >= 0x0BCA) && (cp <= 0x0BCD)) { return true }
    if (cp == 0x0BD7) { return true }
    if ((cp >= 0x0C00) && (cp <= 0x0C04)) { return true }
    if ((cp >= 0x0C3E) && (cp <= 0x0C44)) { return true }
    if ((cp >= 0x0C46) && (cp <= 0x0C48)) { return true }
    if ((cp >= 0x0C4A) && (cp <= 0x0C4D)) { return true }
    if ((cp >= 0x0C55) && (cp <= 0x0C56)) { return true }
    if ((cp >= 0x0C62) && (cp <= 0x0C63)) { return true }
    if ((cp >= 0x0C81) && (cp <= 0x0C83)) { return true }
    if (cp == 0x0CBC) { return true }
    if ((cp >= 0x0CBE) && (cp <= 0x0CC4)) { return true }
    if ((cp >= 0x0CC6) && (cp <= 0x0CC8)) { return true }
    if ((cp >= 0x0CCA) && (cp <= 0x0CCD)) { return true }
    if ((cp >= 0x0CD5) && (cp <= 0x0CD6)) { return true }
    if ((cp >= 0x0CE2) && (cp <= 0x0CE3)) { return true }
    if ((cp >= 0x0D00) && (cp <= 0x0D03)) { return true }
    if ((cp >= 0x0D3B) && (cp <= 0x0D3C)) { return true }
    if ((cp >= 0x0D3E) && (cp <= 0x0D44)) { return true }
    if ((cp >= 0x0D46) && (cp <= 0x0D48)) { return true }
    if ((cp >= 0x0D4A) && (cp <= 0x0D4D)) { return true }
    if (cp == 0x0D57) { return true }
    if ((cp >= 0x0D62) && (cp <= 0x0D63)) { return true }
    if ((cp >= 0x0D81) && (cp <= 0x0D83)) { return true }
    if (cp == 0x0DCA) { return true }
    if ((cp >= 0x0DCF) && (cp <= 0x0DD4)) { return true }
    if (cp == 0x0DD6) { return true }
    if ((cp >= 0x0DD8) && (cp <= 0x0DDF)) { return true }
    if ((cp >= 0x0DF2) && (cp <= 0x0DF3)) { return true }
    if (cp == 0x0E31) { return true }
    if ((cp >= 0x0E34) && (cp <= 0x0E3A)) { return true }
    if ((cp >= 0x0E47) && (cp <= 0x0E4E)) { return true }
    if (cp == 0x0EB1) { return true }
    if ((cp >= 0x0EB4) && (cp <= 0x0EBC)) { return true }
    if ((cp >= 0x0EC8) && (cp <= 0x0ECD)) { return true }
    if ((cp >= 0x0F18) && (cp <= 0x0F19)) { return true }
    if (cp == 0x0F35) { return true }
    if (cp == 0x0F37) { return true }
    if (cp == 0x0F39) { return true }
    if ((cp >= 0x0F3E) && (cp <= 0x0F3F)) { return true }
    if ((cp >= 0x0F71) && (cp <= 0x0F84)) { return true }
    if ((cp >= 0x0F86) && (cp <= 0x0F87)) { return true }
    if ((cp >= 0x0F8D) && (cp <= 0x0F97)) { return true }
    if ((cp >= 0x0F99) && (cp <= 0x0FBC)) { return true }
    if (cp == 0x0FC6) { return true }
    if ((cp >= 0x102B) && (cp <= 0x103E)) { return true }
    if ((cp >= 0x1056) && (cp <= 0x1059)) { return true }
    if ((cp >= 0x105E) && (cp <= 0x1060)) { return true }
    if ((cp >= 0x1062) && (cp <= 0x1064)) { return true }
    if ((cp >= 0x1067) && (cp <= 0x106D)) { return true }
    if ((cp >= 0x1071) && (cp <= 0x1074)) { return true }
    if ((cp >= 0x1082) && (cp <= 0x108D)) { return true }
    if (cp == 0x108F) { return true }
    if ((cp >= 0x109A) && (cp <= 0x109D)) { return true }
    if ((cp >= 0x135D) && (cp <= 0x135F)) { return true }
    if ((cp >= 0x1712) && (cp <= 0x1714)) { return true }
    if ((cp >= 0x1732) && (cp <= 0x1734)) { return true }
    if ((cp >= 0x1752) && (cp <= 0x1753)) { return true }
    if ((cp >= 0x1772) && (cp <= 0x1773)) { return true }
    if ((cp >= 0x17B4) && (cp <= 0x17D3)) { return true }
    if (cp == 0x17DD) { return true }
    if ((cp >= 0x180B) && (cp <= 0x180D)) { return true }
    if ((cp >= 0x1885) && (cp <= 0x1886)) { return true }
    if (cp == 0x18A9) { return true }
    if ((cp >= 0x1920) && (cp <= 0x192B)) { return true }
    if ((cp >= 0x1930) && (cp <= 0x193B)) { return true }
    if ((cp >= 0x1A17) && (cp <= 0x1A1B)) { return true }
    if ((cp >= 0x1A55) && (cp <= 0x1A5E)) { return true }
    if ((cp >= 0x1A60) && (cp <= 0x1A7C)) { return true }
    if (cp == 0x1A7F) { return true }
    if ((cp >= 0x1AB0) && (cp <= 0x1AC0)) { return true }
    if ((cp >= 0x1B00) && (cp <= 0x1B04)) { return true }
    if ((cp >= 0x1B34) && (cp <= 0x1B44)) { return true }
    if ((cp >= 0x1B6B) && (cp <= 0x1B73)) { return true }
    if ((cp >= 0x1B80) && (cp <= 0x1B82)) { return true }
    if ((cp >= 0x1BA1) && (cp <= 0x1BAD)) { return true }
    if ((cp >= 0x1BE6) && (cp <= 0x1BF3)) { return true }
    if ((cp >= 0x1C24) && (cp <= 0x1C37)) { return true }
    if ((cp >= 0x1CD0) && (cp <= 0x1CD2)) { return true }
    if ((cp >= 0x1CD4) && (cp <= 0x1CE8)) { return true }
    if (cp == 0x1CED) { return true }
    if (cp == 0x1CF4) { return true }
    if ((cp >= 0x1CF7) && (cp <= 0x1CF9)) { return true }
    if ((cp >= 0x1DC0) && (cp <= 0x1DF9)) { return true }
    if ((cp >= 0x1DFB) && (cp <= 0x1DFF)) { return true }
    if ((cp >= 0x20D0) && (cp <= 0x20F0)) { return true }
    if ((cp >= 0x2CEF) && (cp <= 0x2CF1)) { return true }
    if (cp == 0x2D7F) { return true }
    if ((cp >= 0x2DE0) && (cp <= 0x2DFF)) { return true }
    if ((cp >= 0x302A) && (cp <= 0x302F)) { return true }
    if ((cp >= 0x3099) && (cp <= 0x309A)) { return true }
    if ((cp >= 0xA66F) && (cp <= 0xA672)) { return true }
    if ((cp >= 0xA674) && (cp <= 0xA67D)) { return true }
    if ((cp >= 0xA69E) && (cp <= 0xA69F)) { return true }
    if ((cp >= 0xA6F0) && (cp <= 0xA6F1)) { return true }
    if (cp == 0xA802) { return true }
    if (cp == 0xA806) { return true }
    if (cp == 0xA80B) { return true }
    if ((cp >= 0xA823) && (cp <= 0xA827)) { return true }
    if (cp == 0xA82C) { return true }
    if ((cp >= 0xA880) && (cp <= 0xA881)) { return true }
    if ((cp >= 0xA8B4) && (cp <= 0xA8C5)) { return true }
    if ((cp >= 0xA8E0) && (cp <= 0xA8F1)) { return true }
    if (cp == 0xA8FF) { return true }
    if ((cp >= 0xA926) && (cp <= 0xA92D)) { return true }
    if ((cp >= 0xA947) && (cp <= 0xA953)) { return true }
    if ((cp >= 0xA980) && (cp <= 0xA983)) { return true }
    if ((cp >= 0xA9B3) && (cp <= 0xA9C0)) { return true }
    if (cp == 0xA9E5) { return true }
    if ((cp >= 0xAA29) && (cp <= 0xAA36)) { return true }
    if (cp == 0xAA43) { return true }
    if ((cp >= 0xAA4C) && (cp <= 0xAA4D)) { return true }
    if ((cp >= 0xAA7B) && (cp <= 0xAA7D)) { return true }
    if (cp == 0xAAB0) { return true }
    if ((cp >= 0xAAB2) && (cp <= 0xAAB4)) { return true }
    if ((cp >= 0xAAB7) && (cp <= 0xAAB8)) { return true }
    if ((cp >= 0xAABE) && (cp <= 0xAABF)) { return true }
    if (cp == 0xAAC1) { return true }
    if ((cp >= 0xAAEB) && (cp <= 0xAAEF)) { return true }
    if ((cp >= 0xAAF5) && (cp <= 0xAAF6)) { return true }
    if ((cp >= 0xABE3) && (cp <= 0xABEA)) { return true }
    if ((cp >= 0xABEC) && (cp <= 0xABED)) { return true }
    if (cp == 0xFB1E) { return true }
    if ((cp >= 0xFE00) && (cp <= 0xFE0F)) { return true }
    if ((cp >= 0xFE20) && (cp <= 0xFE2F)) { return true }
    if (cp == 0x101FD) { return true }
    if (cp == 0x102E0) { return true }
    if ((cp >= 0x10376) && (cp <= 0x1037A)) { return true }
    if ((cp >= 0x10A01) && (cp <= 0x10A03)) { return true }
    if ((cp >= 0x10A05) && (cp <= 0x10A06)) { return true }
    if ((cp >= 0x10A0C) && (cp <= 0x10A0F)) { return true }
    if ((cp >= 0x10A38) && (cp <= 0x10A3A)) { return true }
    if (cp == 0x10A3F) { return true }
    if ((cp >= 0x10AE5) && (cp <= 0x10AE6)) { return true }
    if ((cp >= 0x10D24) && (cp <= 0x10D27)) { return true }
    if ((cp >= 0x10EAB) && (cp <= 0x10EAC)) { return true }
    if ((cp >= 0x10F46) && (cp <= 0x10F50)) { return true }
    if ((cp >= 0x11000) && (cp <= 0x11002)) { return true }
    if ((cp >= 0x11038) && (cp <= 0x11046)) { return true }
    if ((cp >= 0x1107F) && (cp <= 0x11082)) { return true }
    if ((cp >= 0x110B0) && (cp <= 0x110BA)) { return true }
    if ((cp >= 0x11100) && (cp <= 0x11102)) { return true }
    if ((cp >= 0x11127) && (cp <= 0x11134)) { return true }
    if ((cp >= 0x11145) && (cp <= 0x11146)) { return true }
    if (cp == 0x11173) { return true }
    if ((cp >= 0x11180) && (cp <= 0x11182)) { return true }
    if ((cp >= 0x111B3) && (cp <= 0x111C0)) { return true }
    if ((cp >= 0x111C9) && (cp <= 0x111CC)) { return true }
    if ((cp >= 0x111CE) && (cp <= 0x111CF)) { return true }
    if ((cp >= 0x1122C) && (cp <= 0x11237)) { return true }
    if (cp == 0x1123E) { return true }
    if ((cp >= 0x112DF) && (cp <= 0x112EA)) { return true }
    if ((cp >= 0x11300) && (cp <= 0x11303)) { return true }
    if ((cp >= 0x1133B) && (cp <= 0x1133C)) { return true }
    if ((cp >= 0x1133E) && (cp <= 0x11344)) { return true }
    if ((cp >= 0x11347) && (cp <= 0x11348)) { return true }
    if ((cp >= 0x1134B) && (cp <= 0x1134D)) { return true }
    if (cp == 0x11357) { return true }
    if ((cp >= 0x11362) && (cp <= 0x11363)) { return true }
    if ((cp >= 0x11366) && (cp <= 0x1136C)) { return true }
    if ((cp >= 0x11370) && (cp <= 0x11374)) { return true }
    if ((cp >= 0x11435) && (cp <= 0x11446)) { return true }
    if (cp == 0x1145E) { return true }
    if ((cp >= 0x114B0) && (cp <= 0x114C3)) { return true }
    if ((cp >= 0x115AF) && (cp <= 0x115B5)) { return true }
    if ((cp >= 0x115B8) && (cp <= 0x115C0)) { return true }
    if ((cp >= 0x115DC) && (cp <= 0x115DD)) { return true }
    if ((cp >= 0x11630) && (cp <= 0x11640)) { return true }
    if ((cp >= 0x116AB) && (cp <= 0x116B7)) { return true }
    if ((cp >= 0x1171D) && (cp <= 0x1172B)) { return true }
    if ((cp >= 0x1182C) && (cp <= 0x1183A)) { return true }
    if ((cp >= 0x11930) && (cp <= 0x11935)) { return true }
    if ((cp >= 0x11937) && (cp <= 0x11938)) { return true }
    if ((cp >= 0x1193B) && (cp <= 0x1193E)) { return true }
    if (cp == 0x11940) { return true }
    if ((cp >= 0x11942) && (cp <= 0x11943)) { return true }
    if ((cp >= 0x119D1) && (cp <= 0x119D7)) { return true }
    if ((cp >= 0x119DA) && (cp <= 0x119E0)) { return true }
    if (cp == 0x119E4) { return true }
    if ((cp >= 0x11A01) && (cp <= 0x11A0A)) { return true }
    if ((cp >= 0x11A33) && (cp <= 0x11A39)) { return true }
    if ((cp >= 0x11A3B) && (cp <= 0x11A3E)) { return true }
    if (cp == 0x11A47) { return true }
    if ((cp >= 0x11A51) && (cp <= 0x11A5B)) { return true }
    if ((cp >= 0x11A8A) && (cp <= 0x11A99)) { return true }
    if ((cp >= 0x11C2F) && (cp <= 0x11C36)) { return true }
    if ((cp >= 0x11C38) && (cp <= 0x11C3F)) { return true }
    if ((cp >= 0x11C92) && (cp <= 0x11CA7)) { return true }
    if ((cp >= 0x11CA9) && (cp <= 0x11CB6)) { return true }
    if ((cp >= 0x11D31) && (cp <= 0x11D36)) { return true }
    if (cp == 0x11D3A) { return true }
    if ((cp >= 0x11D3C) && (cp <= 0x11D3D)) { return true }
    if ((cp >= 0x11D3F) && (cp <= 0x11D45)) { return true }
    if (cp == 0x11D47) { return true }
    if ((cp >= 0x11D8A) && (cp <= 0x11D8E)) { return true }
    if ((cp >= 0x11D90) && (cp <= 0x11D91)) { return true }
    if ((cp >= 0x11D93) && (cp <= 0x11D97)) { return true }
    if ((cp >= 0x11EF3) && (cp <= 0x11EF6)) { return true }
    if ((cp >= 0x16AF0) && (cp <= 0x16AF4)) { return true }
    if ((cp >= 0x16B30) && (cp <= 0x16B36)) { return true }
    if (cp == 0x16F4F) { return true }
    if ((cp >= 0x16F51) && (cp <= 0x16F87)) { return true }
    if ((cp >= 0x16F8F) && (cp <= 0x16F92)) { return true }
    if (cp == 0x16FE4) { return true }
    if ((cp >= 0x16FF0) && (cp <= 0x16FF1)) { return true }
    if ((cp >= 0x1BC9D) && (cp <= 0x1BC9E)) { return true }
    if ((cp >= 0x1D165) && (cp <= 0x1D169)) { return true }
    if ((cp >= 0x1D16D) && (cp <= 0x1D172)) { return true }
    if ((cp >= 0x1D17B) && (cp <= 0x1D182)) { return true }
    if ((cp >= 0x1D185) && (cp <= 0x1D18B)) { return true }
    if ((cp >= 0x1D1AA) && (cp <= 0x1D1AD)) { return true }
    if ((cp >= 0x1D242) && (cp <= 0x1D244)) { return true }
    if ((cp >= 0x1DA00) && (cp <= 0x1DA36)) { return true }
    if ((cp >= 0x1DA3B) && (cp <= 0x1DA6C)) { return true }
    if (cp == 0x1DA75) { return true }
    if (cp == 0x1DA84) { return true }
    if ((cp >= 0x1DA9B) && (cp <= 0x1DA9F)) { return true }
    if ((cp >= 0x1DAA1) && (cp <= 0x1DAAF)) { return true }
    if ((cp >= 0x1E000) && (cp <= 0x1E006)) { return true }
    if ((cp >= 0x1E008) && (cp <= 0x1E018)) { return true }
    if ((cp >= 0x1E01B) && (cp <= 0x1E021)) { return true }
    if ((cp >= 0x1E023) && (cp <= 0x1E024)) { return true }
    if ((cp >= 0x1E026) && (cp <= 0x1E02A)) { return true }
    if ((cp >= 0x1E130) && (cp <= 0x1E136)) { return true }
    if (cp == 0x1E2AE) { return true }
    if ((cp >= 0x1E2EC) && (cp <= 0x1E2EF)) { return true }
    if ((cp >= 0x1E8D0) && (cp <= 0x1E8D6)) { return true }
    if ((cp >= 0x1E944) && (cp <= 0x1E94A)) { return true }
    if ((cp >= 0xE0100) && (cp <= 0xE01EF)) { return true }
    return false
}
exports.isCombiningMark = isCombiningMark

function getRangeDescription(cp) {
    if ((cp >= 0x3400) && (cp <= 0x4DBF)) { return "CJK IDEOGRAPH EXTENSION A" }
    if ((cp >= 0x4E00) && (cp <= 0x9FFC)) { return "CJK IDEOGRAPH" }
    if ((cp >= 0xAC00) && (cp <= 0xD7A3)) { return "HANGUL SYLLABLE" }
    if ((cp >= 0xD800) && (cp <= 0xDB7F)) { return "NON PRIVATE USE HIGH SURROGATE" }
    if ((cp >= 0xDB80) && (cp <= 0xDBFF)) { return "PRIVATE USE HIGH SURROGATE" }
    if ((cp >= 0xDC00) && (cp <= 0xDFFF)) { return "LOW SURROGATE" }
    if ((cp >= 0xE000) && (cp <= 0xF8FF)) { return "PRIVATE USE" }
    if ((cp >= 0x17000) && (cp <= 0x187F7)) { return "TANGUT IDEOGRAPH" }
    if ((cp >= 0x18D00) && (cp <= 0x18D08)) { return "TANGUT IDEOGRAPH SUPPLEMENT" }
    if ((cp >= 0x20000) && (cp <= 0x2A6DD)) { return "CJK IDEOGRAPH EXTENSION B" }
    if ((cp >= 0x2A700) && (cp <= 0x2B734)) { return "CJK IDEOGRAPH EXTENSION C" }
    if ((cp >= 0x2B740) && (cp <= 0x2B81D)) { return "CJK IDEOGRAPH EXTENSION D" }
    if ((cp >= 0x2B820) && (cp <= 0x2CEA1)) { return "CJK IDEOGRAPH EXTENSION E" }
    if ((cp >= 0x2CEB0) && (cp <= 0x2EBE0)) { return "CJK IDEOGRAPH EXTENSION F" }
    if ((cp >= 0x30000) && (cp <= 0x3134A)) { return "CJK IDEOGRAPH EXTENSION G" }
    if ((cp >= 0xF0000) && (cp <= 0xFFFFD)) { return "PLANE 15 PRIVATE USE" }
    return null
}
exports.getRangeDescription = getRangeDescription
