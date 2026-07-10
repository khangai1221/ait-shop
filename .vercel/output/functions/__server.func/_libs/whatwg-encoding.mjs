import { r as requireLib } from "./iconv-lite.mjs";
var whatwgEncoding = {};
const require$$1 = [
  "UTF-8",
  "IBM866",
  "ISO-8859-2",
  "ISO-8859-3",
  "ISO-8859-4",
  "ISO-8859-5",
  "ISO-8859-6",
  "ISO-8859-7",
  "ISO-8859-8",
  "ISO-8859-10",
  "ISO-8859-13",
  "ISO-8859-14",
  "ISO-8859-15",
  "ISO-8859-16",
  "KOI8-R",
  "KOI8-U",
  "macintosh",
  "windows-874",
  "windows-1250",
  "windows-1251",
  "windows-1252",
  "windows-1253",
  "windows-1254",
  "windows-1255",
  "windows-1256",
  "windows-1257",
  "windows-1258",
  "GBK",
  "gb18030",
  "Big5",
  "EUC-JP",
  "Shift_JIS",
  "EUC-KR",
  "UTF-16BE",
  "UTF-16LE",
  "x-user-defined"
];
const unicode11utf8 = "UTF-8";
const unicode20utf8 = "UTF-8";
const utf8 = "UTF-8";
const cp866 = "IBM866";
const csibm866 = "IBM866";
const ibm866 = "IBM866";
const csisolatin2 = "ISO-8859-2";
const iso88592 = "ISO-8859-2";
const l2 = "ISO-8859-2";
const latin2 = "ISO-8859-2";
const csisolatin3 = "ISO-8859-3";
const iso88593 = "ISO-8859-3";
const l3 = "ISO-8859-3";
const latin3 = "ISO-8859-3";
const csisolatin4 = "ISO-8859-4";
const iso88594 = "ISO-8859-4";
const l4 = "ISO-8859-4";
const latin4 = "ISO-8859-4";
const csisolatincyrillic = "ISO-8859-5";
const cyrillic = "ISO-8859-5";
const iso88595 = "ISO-8859-5";
const arabic = "ISO-8859-6";
const csiso88596e = "ISO-8859-6";
const csiso88596i = "ISO-8859-6";
const csisolatinarabic = "ISO-8859-6";
const iso88596 = "ISO-8859-6";
const csisolatingreek = "ISO-8859-7";
const elot_928 = "ISO-8859-7";
const greek = "ISO-8859-7";
const greek8 = "ISO-8859-7";
const iso88597 = "ISO-8859-7";
const sun_eu_greek = "ISO-8859-7";
const csiso88598e = "ISO-8859-8";
const csisolatinhebrew = "ISO-8859-8";
const hebrew = "ISO-8859-8";
const iso88598 = "ISO-8859-8";
const visual = "ISO-8859-8";
const csisolatin6 = "ISO-8859-10";
const iso885910 = "ISO-8859-10";
const l6 = "ISO-8859-10";
const latin6 = "ISO-8859-10";
const iso885913 = "ISO-8859-13";
const iso885914 = "ISO-8859-14";
const csisolatin9 = "ISO-8859-15";
const iso885915 = "ISO-8859-15";
const l9 = "ISO-8859-15";
const cskoi8r = "KOI8-R";
const koi = "KOI8-R";
const koi8 = "KOI8-R";
const koi8_r = "KOI8-R";
const csmacintosh = "macintosh";
const mac = "macintosh";
const macintosh = "macintosh";
const iso885911 = "windows-874";
const cp1250 = "windows-1250";
const cp1251 = "windows-1251";
const ascii = "windows-1252";
const cp1252 = "windows-1252";
const cp819 = "windows-1252";
const csisolatin1 = "windows-1252";
const ibm819 = "windows-1252";
const iso88591 = "windows-1252";
const l1 = "windows-1252";
const latin1 = "windows-1252";
const cp1253 = "windows-1253";
const cp1254 = "windows-1254";
const csisolatin5 = "windows-1254";
const iso88599 = "windows-1254";
const l5 = "windows-1254";
const latin5 = "windows-1254";
const cp1255 = "windows-1255";
const cp1256 = "windows-1256";
const cp1257 = "windows-1257";
const cp1258 = "windows-1258";
const chinese = "GBK";
const csgb2312 = "GBK";
const csiso58gb231280 = "GBK";
const gb2312 = "GBK";
const gb_2312 = "GBK";
const gbk = "GBK";
const gb18030 = "gb18030";
const big5 = "Big5";
const csbig5 = "Big5";
const cseucpkdfmtjapanese = "EUC-JP";
const csshiftjis = "Shift_JIS";
const ms932 = "Shift_JIS";
const ms_kanji = "Shift_JIS";
const shift_jis = "Shift_JIS";
const sjis = "Shift_JIS";
const cseuckr = "EUC-KR";
const csksc56011987 = "EUC-KR";
const korean = "EUC-KR";
const ksc5601 = "EUC-KR";
const ksc_5601 = "EUC-KR";
const unicodefffe = "UTF-16BE";
const csunicode = "UTF-16LE";
const unicode = "UTF-16LE";
const unicodefeff = "UTF-16LE";
const require$$2 = {
  "866": "IBM866",
  "unicode-1-1-utf-8": "UTF-8",
  unicode11utf8,
  unicode20utf8,
  "utf-8": "UTF-8",
  utf8,
  "x-unicode20utf8": "UTF-8",
  cp866,
  csibm866,
  ibm866,
  csisolatin2,
  "iso-8859-2": "ISO-8859-2",
  "iso-ir-101": "ISO-8859-2",
  "iso8859-2": "ISO-8859-2",
  iso88592,
  "iso_8859-2": "ISO-8859-2",
  "iso_8859-2:1987": "ISO-8859-2",
  l2,
  latin2,
  csisolatin3,
  "iso-8859-3": "ISO-8859-3",
  "iso-ir-109": "ISO-8859-3",
  "iso8859-3": "ISO-8859-3",
  iso88593,
  "iso_8859-3": "ISO-8859-3",
  "iso_8859-3:1988": "ISO-8859-3",
  l3,
  latin3,
  csisolatin4,
  "iso-8859-4": "ISO-8859-4",
  "iso-ir-110": "ISO-8859-4",
  "iso8859-4": "ISO-8859-4",
  iso88594,
  "iso_8859-4": "ISO-8859-4",
  "iso_8859-4:1988": "ISO-8859-4",
  l4,
  latin4,
  csisolatincyrillic,
  cyrillic,
  "iso-8859-5": "ISO-8859-5",
  "iso-ir-144": "ISO-8859-5",
  "iso8859-5": "ISO-8859-5",
  iso88595,
  "iso_8859-5": "ISO-8859-5",
  "iso_8859-5:1988": "ISO-8859-5",
  arabic,
  "asmo-708": "ISO-8859-6",
  csiso88596e,
  csiso88596i,
  csisolatinarabic,
  "ecma-114": "ISO-8859-6",
  "iso-8859-6": "ISO-8859-6",
  "iso-8859-6-e": "ISO-8859-6",
  "iso-8859-6-i": "ISO-8859-6",
  "iso-ir-127": "ISO-8859-6",
  "iso8859-6": "ISO-8859-6",
  iso88596,
  "iso_8859-6": "ISO-8859-6",
  "iso_8859-6:1987": "ISO-8859-6",
  csisolatingreek,
  "ecma-118": "ISO-8859-7",
  elot_928,
  greek,
  greek8,
  "iso-8859-7": "ISO-8859-7",
  "iso-ir-126": "ISO-8859-7",
  "iso8859-7": "ISO-8859-7",
  iso88597,
  "iso_8859-7": "ISO-8859-7",
  "iso_8859-7:1987": "ISO-8859-7",
  sun_eu_greek,
  csiso88598e,
  csisolatinhebrew,
  hebrew,
  "iso-8859-8": "ISO-8859-8",
  "iso-8859-8-e": "ISO-8859-8",
  "iso-ir-138": "ISO-8859-8",
  "iso8859-8": "ISO-8859-8",
  iso88598,
  "iso_8859-8": "ISO-8859-8",
  "iso_8859-8:1988": "ISO-8859-8",
  visual,
  csisolatin6,
  "iso-8859-10": "ISO-8859-10",
  "iso-ir-157": "ISO-8859-10",
  "iso8859-10": "ISO-8859-10",
  iso885910,
  l6,
  latin6,
  "iso-8859-13": "ISO-8859-13",
  "iso8859-13": "ISO-8859-13",
  iso885913,
  "iso-8859-14": "ISO-8859-14",
  "iso8859-14": "ISO-8859-14",
  iso885914,
  csisolatin9,
  "iso-8859-15": "ISO-8859-15",
  "iso8859-15": "ISO-8859-15",
  iso885915,
  "iso_8859-15": "ISO-8859-15",
  l9,
  "iso-8859-16": "ISO-8859-16",
  cskoi8r,
  koi,
  koi8,
  "koi8-r": "KOI8-R",
  koi8_r,
  "koi8-ru": "KOI8-U",
  "koi8-u": "KOI8-U",
  csmacintosh,
  mac,
  macintosh,
  "x-mac-roman": "macintosh",
  "dos-874": "windows-874",
  "iso-8859-11": "windows-874",
  "iso8859-11": "windows-874",
  iso885911,
  "tis-620": "windows-874",
  "windows-874": "windows-874",
  cp1250,
  "windows-1250": "windows-1250",
  "x-cp1250": "windows-1250",
  cp1251,
  "windows-1251": "windows-1251",
  "x-cp1251": "windows-1251",
  "ansi_x3.4-1968": "windows-1252",
  ascii,
  cp1252,
  cp819,
  csisolatin1,
  ibm819,
  "iso-8859-1": "windows-1252",
  "iso-ir-100": "windows-1252",
  "iso8859-1": "windows-1252",
  iso88591,
  "iso_8859-1": "windows-1252",
  "iso_8859-1:1987": "windows-1252",
  l1,
  latin1,
  "us-ascii": "windows-1252",
  "windows-1252": "windows-1252",
  "x-cp1252": "windows-1252",
  cp1253,
  "windows-1253": "windows-1253",
  "x-cp1253": "windows-1253",
  cp1254,
  csisolatin5,
  "iso-8859-9": "windows-1254",
  "iso-ir-148": "windows-1254",
  "iso8859-9": "windows-1254",
  iso88599,
  "iso_8859-9": "windows-1254",
  "iso_8859-9:1989": "windows-1254",
  l5,
  latin5,
  "windows-1254": "windows-1254",
  "x-cp1254": "windows-1254",
  cp1255,
  "windows-1255": "windows-1255",
  "x-cp1255": "windows-1255",
  cp1256,
  "windows-1256": "windows-1256",
  "x-cp1256": "windows-1256",
  cp1257,
  "windows-1257": "windows-1257",
  "x-cp1257": "windows-1257",
  cp1258,
  "windows-1258": "windows-1258",
  "x-cp1258": "windows-1258",
  chinese,
  csgb2312,
  csiso58gb231280,
  gb2312,
  gb_2312,
  "gb_2312-80": "GBK",
  gbk,
  "iso-ir-58": "GBK",
  "x-gbk": "GBK",
  gb18030,
  big5,
  "big5-hkscs": "Big5",
  "cn-big5": "Big5",
  csbig5,
  "x-x-big5": "Big5",
  cseucpkdfmtjapanese,
  "euc-jp": "EUC-JP",
  "x-euc-jp": "EUC-JP",
  csshiftjis,
  ms932,
  ms_kanji,
  "shift-jis": "Shift_JIS",
  shift_jis,
  sjis,
  "windows-31j": "Shift_JIS",
  "x-sjis": "Shift_JIS",
  cseuckr,
  csksc56011987,
  "euc-kr": "EUC-KR",
  "iso-ir-149": "EUC-KR",
  korean,
  "ks_c_5601-1987": "EUC-KR",
  "ks_c_5601-1989": "EUC-KR",
  ksc5601,
  ksc_5601,
  "windows-949": "EUC-KR",
  unicodefffe,
  "utf-16be": "UTF-16BE",
  csunicode,
  "iso-10646-ucs-2": "UTF-16LE",
  "ucs-2": "UTF-16LE",
  unicode,
  unicodefeff,
  "utf-16": "UTF-16LE",
  "utf-16le": "UTF-16LE",
  "x-user-defined": "x-user-defined"
};
var hasRequiredWhatwgEncoding;
function requireWhatwgEncoding() {
  if (hasRequiredWhatwgEncoding) return whatwgEncoding;
  hasRequiredWhatwgEncoding = 1;
  (function(exports) {
    const iconvLite = requireLib();
    const supportedNames = require$$1;
    const labelsToNames = require$$2;
    const supportedNamesSet = new Set(supportedNames);
    exports.labelToName = (label) => {
      label = String(label).trim().toLowerCase();
      return labelsToNames[label] || null;
    };
    exports.decode = (uint8Array, fallbackEncodingName) => {
      let encoding = fallbackEncodingName;
      if (!exports.isSupported(encoding)) {
        throw new RangeError(`"${encoding}" is not a supported encoding name`);
      }
      const bomEncoding = exports.getBOMEncoding(uint8Array);
      if (bomEncoding !== null) {
        encoding = bomEncoding;
      }
      if (encoding === "x-user-defined") {
        let result = "";
        for (const byte of uint8Array) {
          if (byte <= 127) {
            result += String.fromCodePoint(byte);
          } else {
            result += String.fromCodePoint(63360 + byte - 128);
          }
        }
        return result;
      }
      return iconvLite.decode(uint8Array, encoding);
    };
    exports.getBOMEncoding = (uint8Array) => {
      if (uint8Array[0] === 254 && uint8Array[1] === 255) {
        return "UTF-16BE";
      } else if (uint8Array[0] === 255 && uint8Array[1] === 254) {
        return "UTF-16LE";
      } else if (uint8Array[0] === 239 && uint8Array[1] === 187 && uint8Array[2] === 191) {
        return "UTF-8";
      }
      return null;
    };
    exports.isSupported = (name) => {
      return supportedNamesSet.has(String(name));
    };
  })(whatwgEncoding);
  return whatwgEncoding;
}
var whatwgEncodingExports = requireWhatwgEncoding();
export {
  whatwgEncodingExports as w
};
