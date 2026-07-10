import { Transform } from "node:stream";
import { i as iconv } from "./iconv-lite.mjs";
import { w as whatwgEncodingExports } from "./whatwg-encoding.mjs";
var State;
(function(State2) {
  State2[State2["Begin"] = 0] = "Begin";
  State2[State2["BOM16BE"] = 1] = "BOM16BE";
  State2[State2["BOM16LE"] = 2] = "BOM16LE";
  State2[State2["BOM8"] = 3] = "BOM8";
  State2[State2["UTF16LE_XML_PREFIX"] = 4] = "UTF16LE_XML_PREFIX";
  State2[State2["BeginLT"] = 5] = "BeginLT";
  State2[State2["UTF16BE_XML_PREFIX"] = 6] = "UTF16BE_XML_PREFIX";
  State2[State2["BeforeTag"] = 7] = "BeforeTag";
  State2[State2["BeforeTagName"] = 8] = "BeforeTagName";
  State2[State2["BeforeCloseTagName"] = 9] = "BeforeCloseTagName";
  State2[State2["CommentStart"] = 10] = "CommentStart";
  State2[State2["CommentEnd"] = 11] = "CommentEnd";
  State2[State2["TagNameMeta"] = 12] = "TagNameMeta";
  State2[State2["TagNameOther"] = 13] = "TagNameOther";
  State2[State2["XMLDeclaration"] = 14] = "XMLDeclaration";
  State2[State2["XMLDeclarationBeforeEncoding"] = 15] = "XMLDeclarationBeforeEncoding";
  State2[State2["XMLDeclarationAfterEncoding"] = 16] = "XMLDeclarationAfterEncoding";
  State2[State2["XMLDeclarationBeforeValue"] = 17] = "XMLDeclarationBeforeValue";
  State2[State2["XMLDeclarationValue"] = 18] = "XMLDeclarationValue";
  State2[State2["WeirdTag"] = 19] = "WeirdTag";
  State2[State2["BeforeAttribute"] = 20] = "BeforeAttribute";
  State2[State2["MetaAttribHttpEquiv"] = 21] = "MetaAttribHttpEquiv";
  State2[State2["MetaAttribHttpEquivValue"] = 22] = "MetaAttribHttpEquivValue";
  State2[State2["MetaAttribC"] = 23] = "MetaAttribC";
  State2[State2["MetaAttribContent"] = 24] = "MetaAttribContent";
  State2[State2["MetaAttribCharset"] = 25] = "MetaAttribCharset";
  State2[State2["MetaAttribAfterName"] = 26] = "MetaAttribAfterName";
  State2[State2["MetaContentValueQuotedBeforeEncoding"] = 27] = "MetaContentValueQuotedBeforeEncoding";
  State2[State2["MetaContentValueQuotedAfterEncoding"] = 28] = "MetaContentValueQuotedAfterEncoding";
  State2[State2["MetaContentValueQuotedBeforeValue"] = 29] = "MetaContentValueQuotedBeforeValue";
  State2[State2["MetaContentValueQuotedValueQuoted"] = 30] = "MetaContentValueQuotedValueQuoted";
  State2[State2["MetaContentValueQuotedValueUnquoted"] = 31] = "MetaContentValueQuotedValueUnquoted";
  State2[State2["MetaContentValueUnquotedBeforeEncoding"] = 32] = "MetaContentValueUnquotedBeforeEncoding";
  State2[State2["MetaContentValueUnquotedBeforeValue"] = 33] = "MetaContentValueUnquotedBeforeValue";
  State2[State2["MetaContentValueUnquotedValueQuoted"] = 34] = "MetaContentValueUnquotedValueQuoted";
  State2[State2["MetaContentValueUnquotedValueUnquoted"] = 35] = "MetaContentValueUnquotedValueUnquoted";
  State2[State2["AnyAttribName"] = 36] = "AnyAttribName";
  State2[State2["AfterAttributeName"] = 37] = "AfterAttributeName";
  State2[State2["BeforeAttributeValue"] = 38] = "BeforeAttributeValue";
  State2[State2["AttributeValueQuoted"] = 39] = "AttributeValueQuoted";
  State2[State2["AttributeValueUnquoted"] = 40] = "AttributeValueUnquoted";
})(State || (State = {}));
var ResultType;
(function(ResultType2) {
  ResultType2[ResultType2["BOM"] = 0] = "BOM";
  ResultType2[ResultType2["PASSED"] = 1] = "PASSED";
  ResultType2[ResultType2["XML_PREFIX"] = 2] = "XML_PREFIX";
  ResultType2[ResultType2["META_TAG"] = 3] = "META_TAG";
  ResultType2[ResultType2["XML_ENCODING"] = 4] = "XML_ENCODING";
  ResultType2[ResultType2["DEFAULT"] = 5] = "DEFAULT";
})(ResultType || (ResultType = {}));
var AttribType;
(function(AttribType2) {
  AttribType2[AttribType2["None"] = 0] = "None";
  AttribType2[AttribType2["HttpEquiv"] = 1] = "HttpEquiv";
  AttribType2[AttribType2["Content"] = 2] = "Content";
  AttribType2[AttribType2["Charset"] = 3] = "Charset";
})(AttribType || (AttribType = {}));
var Chars;
(function(Chars2) {
  Chars2[Chars2["NIL"] = 0] = "NIL";
  Chars2[Chars2["TAB"] = 9] = "TAB";
  Chars2[Chars2["LF"] = 10] = "LF";
  Chars2[Chars2["CR"] = 13] = "CR";
  Chars2[Chars2["SPACE"] = 32] = "SPACE";
  Chars2[Chars2["EXCLAMATION"] = 33] = "EXCLAMATION";
  Chars2[Chars2["DQUOTE"] = 34] = "DQUOTE";
  Chars2[Chars2["SQUOTE"] = 39] = "SQUOTE";
  Chars2[Chars2["DASH"] = 45] = "DASH";
  Chars2[Chars2["SLASH"] = 47] = "SLASH";
  Chars2[Chars2["SEMICOLON"] = 59] = "SEMICOLON";
  Chars2[Chars2["LT"] = 60] = "LT";
  Chars2[Chars2["EQUALS"] = 61] = "EQUALS";
  Chars2[Chars2["GT"] = 62] = "GT";
  Chars2[Chars2["QUESTION"] = 63] = "QUESTION";
  Chars2[Chars2["UpperA"] = 65] = "UpperA";
  Chars2[Chars2["UpperZ"] = 90] = "UpperZ";
  Chars2[Chars2["LowerA"] = 97] = "LowerA";
  Chars2[Chars2["LowerZ"] = 122] = "LowerZ";
})(Chars || (Chars = {}));
const SPACE_CHARACTERS = /* @__PURE__ */ new Set([Chars.SPACE, Chars.LF, Chars.CR, Chars.TAB]);
const END_OF_UNQUOTED_ATTRIBUTE_VALUE = /* @__PURE__ */ new Set([
  Chars.SPACE,
  Chars.LF,
  Chars.CR,
  Chars.TAB,
  Chars.GT
]);
function toUint8Array(str) {
  const arr = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    arr[i] = str.charCodeAt(i);
  }
  return arr;
}
const STRINGS = {
  UTF8_BOM: new Uint8Array([239, 187, 191]),
  UTF16LE_BOM: new Uint8Array([255, 254]),
  UTF16BE_BOM: new Uint8Array([254, 255]),
  UTF16LE_XML_PREFIX: new Uint8Array([60, 0, 63, 0, 120, 0]),
  UTF16BE_XML_PREFIX: new Uint8Array([0, 60, 0, 63, 0, 120]),
  XML_DECLARATION: toUint8Array("<?xml"),
  ENCODING: toUint8Array("encoding"),
  META: toUint8Array("meta"),
  HTTP_EQUIV: toUint8Array("http-equiv"),
  CONTENT: toUint8Array("content"),
  CONTENT_TYPE: toUint8Array("content-type"),
  CHARSET: toUint8Array("charset"),
  COMMENT_START: toUint8Array("<!--"),
  COMMENT_END: toUint8Array("-->")
};
function isAsciiAlpha(c) {
  return c >= Chars.UpperA && c <= Chars.UpperZ || c >= Chars.LowerA && c <= Chars.LowerZ;
}
function isQuote(c) {
  return c === Chars.DQUOTE || c === Chars.SQUOTE;
}
class Sniffer {
  setResult(label, type) {
    if (this.resultType === ResultType.DEFAULT || this.resultType > type) {
      const encoding = whatwgEncodingExports.labelToName(label);
      if (encoding) {
        this.encoding = // Check if we are in a meta tag and the encoding is `x-user-defined`
        type === ResultType.META_TAG && encoding === "x-user-defined" ? "windows-1252" : (
          // Check if we are in a meta tag or xml declaration, and the encoding is UTF-16
          (type === ResultType.META_TAG || type === ResultType.XML_ENCODING) && (encoding === "UTF-16LE" || encoding === "UTF-16BE") ? "UTF-8" : encoding
        );
        this.resultType = type;
      }
    }
  }
  constructor({ maxBytes = 1024, userEncoding, transportLayerEncodingLabel, defaultEncoding } = {}) {
    this.offset = 0;
    this.state = State.Begin;
    this.sectionIndex = 0;
    this.attribType = AttribType.None;
    this.gotPragma = null;
    this.needsPragma = null;
    this.inMetaTag = false;
    this.encoding = "windows-1252";
    this.resultType = ResultType.DEFAULT;
    this.quoteCharacter = 0;
    this.attributeValue = [];
    this.maxBytes = maxBytes;
    if (userEncoding) {
      this.setResult(userEncoding, ResultType.PASSED);
    }
    if (transportLayerEncodingLabel) {
      this.setResult(transportLayerEncodingLabel, ResultType.PASSED);
    }
    if (defaultEncoding) {
      this.setResult(defaultEncoding, ResultType.DEFAULT);
    }
  }
  stateBegin(c) {
    switch (c) {
      case STRINGS.UTF16BE_BOM[0]: {
        this.state = State.BOM16BE;
        break;
      }
      case STRINGS.UTF16LE_BOM[0]: {
        this.state = State.BOM16LE;
        break;
      }
      case STRINGS.UTF8_BOM[0]: {
        this.sectionIndex = 1;
        this.state = State.BOM8;
        break;
      }
      case Chars.NIL: {
        this.state = State.UTF16BE_XML_PREFIX;
        this.sectionIndex = 1;
        break;
      }
      case Chars.LT: {
        this.state = State.BeginLT;
        break;
      }
      default: {
        this.state = State.BeforeTag;
      }
    }
  }
  stateBeginLT(c) {
    if (c === Chars.NIL) {
      this.state = State.UTF16LE_XML_PREFIX;
      this.sectionIndex = 2;
    } else if (c === Chars.QUESTION) {
      this.state = State.XMLDeclaration;
      this.sectionIndex = 2;
    } else {
      this.state = State.BeforeTagName;
      this.stateBeforeTagName(c);
    }
  }
  stateUTF16BE_XML_PREFIX(c) {
    if (this.advanceSection(STRINGS.UTF16BE_XML_PREFIX, c)) {
      if (this.sectionIndex === STRINGS.UTF16BE_XML_PREFIX.length) {
        this.setResult("utf-16be", ResultType.XML_PREFIX);
      }
    } else {
      this.state = State.BeforeTag;
      this.stateBeforeTag(c);
    }
  }
  stateUTF16LE_XML_PREFIX(c) {
    if (this.advanceSection(STRINGS.UTF16LE_XML_PREFIX, c)) {
      if (this.sectionIndex === STRINGS.UTF16LE_XML_PREFIX.length) {
        this.setResult("utf-16le", ResultType.XML_PREFIX);
      }
    } else {
      this.state = State.BeforeTag;
      this.stateBeforeTag(c);
    }
  }
  stateBOM16LE(c) {
    if (c === STRINGS.UTF16LE_BOM[1]) {
      this.setResult("utf-16le", ResultType.BOM);
    } else {
      this.state = State.BeforeTag;
      this.stateBeforeTag(c);
    }
  }
  stateBOM16BE(c) {
    if (c === STRINGS.UTF16BE_BOM[1]) {
      this.setResult("utf-16be", ResultType.BOM);
    } else {
      this.state = State.BeforeTag;
      this.stateBeforeTag(c);
    }
  }
  stateBOM8(c) {
    if (this.advanceSection(STRINGS.UTF8_BOM, c) && this.sectionIndex === STRINGS.UTF8_BOM.length) {
      this.setResult("utf-8", ResultType.BOM);
    }
  }
  stateBeforeTag(c) {
    if (c === Chars.LT) {
      this.state = State.BeforeTagName;
      this.inMetaTag = false;
    }
  }
  /**
   * We have seen a `<`, and now have to figure out what to do.
   *
   * Options:
   *  - `<meta`
   *  - Any other tag
   *  - A closing tag
   *  - `<!--`
   *  - An XML declaration
   *
   */
  stateBeforeTagName(c) {
    if (isAsciiAlpha(c)) {
      if ((c | 32) === STRINGS.META[0]) {
        this.sectionIndex = 1;
        this.state = State.TagNameMeta;
      } else {
        this.state = State.TagNameOther;
      }
    } else
      switch (c) {
        case Chars.SLASH: {
          this.state = State.BeforeCloseTagName;
          break;
        }
        case Chars.EXCLAMATION: {
          this.state = State.CommentStart;
          this.sectionIndex = 2;
          break;
        }
        case Chars.QUESTION: {
          this.state = State.WeirdTag;
          break;
        }
        default: {
          this.state = State.BeforeTag;
          this.stateBeforeTag(c);
        }
      }
  }
  stateBeforeCloseTagName(c) {
    this.state = isAsciiAlpha(c) ? (
      // Switch to `TagNameOther`; the HTML spec allows attributes here as well.
      State.TagNameOther
    ) : State.WeirdTag;
  }
  stateCommentStart(c) {
    if (this.advanceSection(STRINGS.COMMENT_START, c)) {
      if (this.sectionIndex === STRINGS.COMMENT_START.length) {
        this.state = State.CommentEnd;
        this.sectionIndex = 2;
      }
    } else {
      this.state = State.WeirdTag;
      this.stateWeirdTag(c);
    }
  }
  stateCommentEnd(c) {
    if (this.advanceSection(STRINGS.COMMENT_END, c)) {
      if (this.sectionIndex === STRINGS.COMMENT_END.length) {
        this.state = State.BeforeTag;
      }
    } else if (c === Chars.DASH) {
      this.sectionIndex = 2;
    }
  }
  /**
   * Any section starting with `<!`, `<?`, `</`, without being a closing tag or comment.
   */
  stateWeirdTag(c) {
    if (c === Chars.GT) {
      this.state = State.BeforeTag;
    }
  }
  /**
   * Advances the section, ignoring upper/lower case.
   *
   * Make sure the section has left-over characters before calling.
   *
   * @returns `false` if we did not match the section.
   */
  advanceSectionIC(section, c) {
    return this.advanceSection(section, c | 32);
  }
  /**
   * Advances the section.
   *
   * Make sure the section has left-over characters before calling.
   *
   * @returns `false` if we did not match the section.
   */
  advanceSection(section, c) {
    if (section[this.sectionIndex] === c) {
      this.sectionIndex++;
      return true;
    }
    this.sectionIndex = 0;
    return false;
  }
  stateTagNameMeta(c) {
    if (this.sectionIndex < STRINGS.META.length) {
      if (this.advanceSectionIC(STRINGS.META, c)) {
        return;
      }
    } else if (SPACE_CHARACTERS.has(c)) {
      this.inMetaTag = true;
      this.gotPragma = null;
      this.needsPragma = null;
      this.state = State.BeforeAttribute;
      return;
    }
    this.state = State.TagNameOther;
    this.stateTagNameOther(c);
  }
  stateTagNameOther(c) {
    if (SPACE_CHARACTERS.has(c)) {
      this.state = State.BeforeAttribute;
    } else if (c === Chars.GT) {
      this.state = State.BeforeTag;
    }
  }
  stateBeforeAttribute(c) {
    if (SPACE_CHARACTERS.has(c))
      return;
    if (this.inMetaTag) {
      const lower = c | 32;
      if (lower === STRINGS.HTTP_EQUIV[0]) {
        this.sectionIndex = 1;
        this.state = State.MetaAttribHttpEquiv;
        return;
      } else if (lower === STRINGS.CHARSET[0]) {
        this.sectionIndex = 1;
        this.state = State.MetaAttribC;
        return;
      }
    }
    this.state = c === Chars.SLASH || c === Chars.GT ? State.BeforeTag : State.AnyAttribName;
  }
  handleMetaAttrib(c, section, type) {
    if (this.advanceSectionIC(section, c)) {
      if (this.sectionIndex === section.length) {
        this.attribType = type;
        this.state = State.MetaAttribAfterName;
      }
    } else {
      this.state = State.AnyAttribName;
      this.stateAnyAttribName(c);
    }
  }
  stateMetaAttribHttpEquiv(c) {
    this.handleMetaAttrib(c, STRINGS.HTTP_EQUIV, AttribType.HttpEquiv);
  }
  stateMetaAttribC(c) {
    const lower = c | 32;
    if (lower === STRINGS.CHARSET[1]) {
      this.sectionIndex = 2;
      this.state = State.MetaAttribCharset;
    } else if (lower === STRINGS.CONTENT[1]) {
      this.sectionIndex = 2;
      this.state = State.MetaAttribContent;
    } else {
      this.state = State.AnyAttribName;
      this.stateAnyAttribName(c);
    }
  }
  stateMetaAttribCharset(c) {
    this.handleMetaAttrib(c, STRINGS.CHARSET, AttribType.Charset);
  }
  stateMetaAttribContent(c) {
    this.handleMetaAttrib(c, STRINGS.CONTENT, AttribType.Content);
  }
  stateMetaAttribAfterName(c) {
    if (SPACE_CHARACTERS.has(c) || c === Chars.EQUALS) {
      this.state = State.AfterAttributeName;
      this.stateAfterAttributeName(c);
    } else {
      this.state = State.AnyAttribName;
      this.stateAnyAttribName(c);
    }
  }
  stateAnyAttribName(c) {
    if (SPACE_CHARACTERS.has(c)) {
      this.attribType = AttribType.None;
      this.state = State.AfterAttributeName;
    } else if (c === Chars.SLASH || c === Chars.GT) {
      this.state = State.BeforeTag;
    } else if (c === Chars.EQUALS) {
      this.state = State.BeforeAttributeValue;
    }
  }
  stateAfterAttributeName(c) {
    if (SPACE_CHARACTERS.has(c))
      return;
    if (c === Chars.EQUALS) {
      this.state = State.BeforeAttributeValue;
    } else {
      this.state = State.BeforeAttribute;
      this.stateBeforeAttribute(c);
    }
  }
  stateBeforeAttributeValue(c) {
    if (SPACE_CHARACTERS.has(c))
      return;
    this.attributeValue.length = 0;
    this.sectionIndex = 0;
    if (isQuote(c)) {
      this.quoteCharacter = c;
      this.state = this.attribType === AttribType.Content ? State.MetaContentValueQuotedBeforeEncoding : this.attribType === AttribType.HttpEquiv ? State.MetaAttribHttpEquivValue : State.AttributeValueQuoted;
    } else if (this.attribType === AttribType.Content) {
      this.state = State.MetaContentValueUnquotedBeforeEncoding;
      this.stateMetaContentValueUnquotedBeforeEncoding(c);
    } else if (this.attribType === AttribType.HttpEquiv) {
      this.quoteCharacter = 0;
      this.sectionIndex = 0;
      this.state = State.MetaAttribHttpEquivValue;
      this.stateMetaAttribHttpEquivValue(c);
    } else {
      this.state = State.AttributeValueUnquoted;
      this.stateAttributeValueUnquoted(c);
    }
  }
  // The value has to be `content-type`
  stateMetaAttribHttpEquivValue(c) {
    if (this.sectionIndex === STRINGS.CONTENT_TYPE.length) {
      if (this.quoteCharacter === 0 ? END_OF_UNQUOTED_ATTRIBUTE_VALUE.has(c) : c === this.quoteCharacter) {
        if (this.needsPragma !== null) {
          this.setResult(this.needsPragma, ResultType.META_TAG);
        } else if (this.gotPragma === null) {
          this.gotPragma = true;
        }
        this.state = State.BeforeAttribute;
        return;
      }
    } else if (this.advanceSectionIC(STRINGS.CONTENT_TYPE, c)) {
      return;
    }
    this.gotPragma = false;
    if (this.quoteCharacter === 0) {
      this.state = State.AttributeValueUnquoted;
      this.stateAttributeValueUnquoted(c);
    } else {
      this.state = State.AttributeValueQuoted;
      this.stateAttributeValueQuoted(c);
    }
  }
  handleMetaContentValue() {
    if (this.attributeValue.length === 0)
      return;
    const encoding = String.fromCharCode(...this.attributeValue);
    if (this.gotPragma) {
      this.setResult(encoding, ResultType.META_TAG);
    } else if (this.needsPragma === null) {
      this.needsPragma = encoding;
    }
    this.attributeValue.length = 0;
  }
  handleAttributeValue() {
    if (this.attribType === AttribType.Charset) {
      this.setResult(String.fromCharCode(...this.attributeValue), ResultType.META_TAG);
    }
  }
  stateAttributeValueUnquoted(c) {
    if (SPACE_CHARACTERS.has(c)) {
      this.handleAttributeValue();
      this.state = State.BeforeAttribute;
    } else if (c === Chars.SLASH || c === Chars.GT) {
      this.handleAttributeValue();
      this.state = State.BeforeTag;
    } else if (this.attribType === AttribType.Charset) {
      this.attributeValue.push(c | (c >= 65 && c <= 90 ? 32 : 0));
    }
  }
  findMetaContentEncoding(c) {
    if (this.advanceSectionIC(STRINGS.CHARSET, c)) {
      if (this.sectionIndex === STRINGS.CHARSET.length) {
        return true;
      }
    } else {
      this.sectionIndex = Number(c === STRINGS.CHARSET[0]);
    }
    return false;
  }
  stateMetaContentValueUnquotedBeforeEncoding(c) {
    if (END_OF_UNQUOTED_ATTRIBUTE_VALUE.has(c)) {
      this.stateAttributeValueUnquoted(c);
    } else if (this.sectionIndex === STRINGS.CHARSET.length) {
      if (c === Chars.EQUALS) {
        this.state = State.MetaContentValueUnquotedBeforeValue;
      }
    } else {
      this.findMetaContentEncoding(c);
    }
  }
  stateMetaContentValueUnquotedBeforeValue(c) {
    if (isQuote(c)) {
      this.quoteCharacter = c;
      this.state = State.MetaContentValueUnquotedValueQuoted;
    } else if (END_OF_UNQUOTED_ATTRIBUTE_VALUE.has(c)) {
      this.stateAttributeValueUnquoted(c);
    } else {
      this.state = State.MetaContentValueUnquotedValueUnquoted;
      this.stateMetaContentValueUnquotedValueUnquoted(c);
    }
  }
  stateMetaContentValueUnquotedValueQuoted(c) {
    if (END_OF_UNQUOTED_ATTRIBUTE_VALUE.has(c)) {
      this.stateAttributeValueUnquoted(c);
    } else if (c === this.quoteCharacter) {
      this.handleMetaContentValue();
      this.state = State.AttributeValueUnquoted;
    } else {
      this.attributeValue.push(c | (c >= 65 && c <= 90 ? 32 : 0));
    }
  }
  stateMetaContentValueUnquotedValueUnquoted(c) {
    if (END_OF_UNQUOTED_ATTRIBUTE_VALUE.has(c) || c === Chars.SEMICOLON) {
      this.handleMetaContentValue();
      this.state = State.AttributeValueUnquoted;
      this.stateAttributeValueUnquoted(c);
    } else {
      this.attributeValue.push(c | (c >= 65 && c <= 90 ? 32 : 0));
    }
  }
  stateMetaContentValueQuotedValueUnquoted(c) {
    if (isQuote(c) || SPACE_CHARACTERS.has(c) || c === Chars.SEMICOLON) {
      this.handleMetaContentValue();
      this.state = State.AttributeValueQuoted;
      this.stateAttributeValueQuoted(c);
    } else {
      this.attributeValue.push(c | (c >= 65 && c <= 90 ? 32 : 0));
    }
  }
  stateMetaContentValueQuotedValueQuoted(c) {
    if (isQuote(c)) {
      if (c !== this.quoteCharacter) {
        this.handleMetaContentValue();
      }
      this.state = State.AttributeValueQuoted;
      this.stateAttributeValueQuoted(c);
    } else {
      this.attributeValue.push(c | (c >= 65 && c <= 90 ? 32 : 0));
    }
  }
  stateMetaContentValueQuotedBeforeEncoding(c) {
    if (c === this.quoteCharacter) {
      this.stateAttributeValueQuoted(c);
    } else if (this.findMetaContentEncoding(c)) {
      this.state = State.MetaContentValueQuotedAfterEncoding;
    }
  }
  stateMetaContentValueQuotedAfterEncoding(c) {
    if (c === Chars.EQUALS) {
      this.state = State.MetaContentValueQuotedBeforeValue;
    } else if (!SPACE_CHARACTERS.has(c)) {
      this.state = State.MetaContentValueQuotedBeforeEncoding;
      this.stateMetaContentValueQuotedBeforeEncoding(c);
    }
  }
  stateMetaContentValueQuotedBeforeValue(c) {
    if (c === this.quoteCharacter) {
      this.stateAttributeValueQuoted(c);
    } else if (isQuote(c)) {
      this.state = State.MetaContentValueQuotedValueQuoted;
    } else if (!SPACE_CHARACTERS.has(c)) {
      this.state = State.MetaContentValueQuotedValueUnquoted;
      this.stateMetaContentValueQuotedValueUnquoted(c);
    }
  }
  stateAttributeValueQuoted(c) {
    if (c === this.quoteCharacter) {
      this.handleAttributeValue();
      this.state = State.BeforeAttribute;
    } else if (this.attribType === AttribType.Charset) {
      this.attributeValue.push(c | (c >= 65 && c <= 90 ? 32 : 0));
    }
  }
  // Read STRINGS.XML_DECLARATION
  stateXMLDeclaration(c) {
    if (this.advanceSection(STRINGS.XML_DECLARATION, c)) {
      if (this.sectionIndex === STRINGS.XML_DECLARATION.length) {
        this.sectionIndex = 0;
        this.state = State.XMLDeclarationBeforeEncoding;
      }
    } else {
      this.state = State.WeirdTag;
    }
  }
  stateXMLDeclarationBeforeEncoding(c) {
    if (this.advanceSection(STRINGS.ENCODING, c)) {
      if (this.sectionIndex === STRINGS.ENCODING.length) {
        this.state = State.XMLDeclarationAfterEncoding;
      }
    } else if (c === Chars.GT) {
      this.state = State.BeforeTag;
    } else {
      this.sectionIndex = Number(c === STRINGS.ENCODING[0]);
    }
  }
  stateXMLDeclarationAfterEncoding(c) {
    if (c === Chars.EQUALS) {
      this.state = State.XMLDeclarationBeforeValue;
    } else if (c > Chars.SPACE) {
      this.state = State.WeirdTag;
      this.stateWeirdTag(c);
    }
  }
  stateXMLDeclarationBeforeValue(c) {
    if (isQuote(c)) {
      this.attributeValue.length = 0;
      this.state = State.XMLDeclarationValue;
    } else if (c > Chars.SPACE) {
      this.state = State.WeirdTag;
      this.stateWeirdTag(c);
    }
  }
  stateXMLDeclarationValue(c) {
    if (isQuote(c)) {
      this.setResult(String.fromCharCode(...this.attributeValue), ResultType.XML_ENCODING);
      this.state = State.WeirdTag;
    } else if (c === Chars.GT) {
      this.state = State.BeforeTag;
    } else if (c <= Chars.SPACE) {
      this.state = State.WeirdTag;
    } else {
      this.attributeValue.push(c | (c >= 65 && c <= 90 ? 32 : 0));
    }
  }
  write(buffer) {
    let index = 0;
    for (; index < buffer.length && this.offset + index < this.maxBytes; index++) {
      const c = buffer[index];
      switch (this.state) {
        case State.Begin: {
          this.stateBegin(c);
          break;
        }
        case State.BOM16BE: {
          this.stateBOM16BE(c);
          break;
        }
        case State.BOM16LE: {
          this.stateBOM16LE(c);
          break;
        }
        case State.BOM8: {
          this.stateBOM8(c);
          break;
        }
        case State.UTF16LE_XML_PREFIX: {
          this.stateUTF16LE_XML_PREFIX(c);
          break;
        }
        case State.BeginLT: {
          this.stateBeginLT(c);
          break;
        }
        case State.UTF16BE_XML_PREFIX: {
          this.stateUTF16BE_XML_PREFIX(c);
          break;
        }
        case State.BeforeTag: {
          const idx = buffer.indexOf(Chars.LT, index);
          if (idx === -1) {
            index = buffer.length;
          } else {
            index = idx;
            this.stateBeforeTag(Chars.LT);
          }
          break;
        }
        case State.BeforeTagName: {
          this.stateBeforeTagName(c);
          break;
        }
        case State.BeforeCloseTagName: {
          this.stateBeforeCloseTagName(c);
          break;
        }
        case State.CommentStart: {
          this.stateCommentStart(c);
          break;
        }
        case State.CommentEnd: {
          this.stateCommentEnd(c);
          break;
        }
        case State.TagNameMeta: {
          this.stateTagNameMeta(c);
          break;
        }
        case State.TagNameOther: {
          this.stateTagNameOther(c);
          break;
        }
        case State.XMLDeclaration: {
          this.stateXMLDeclaration(c);
          break;
        }
        case State.XMLDeclarationBeforeEncoding: {
          this.stateXMLDeclarationBeforeEncoding(c);
          break;
        }
        case State.XMLDeclarationAfterEncoding: {
          this.stateXMLDeclarationAfterEncoding(c);
          break;
        }
        case State.XMLDeclarationBeforeValue: {
          this.stateXMLDeclarationBeforeValue(c);
          break;
        }
        case State.XMLDeclarationValue: {
          this.stateXMLDeclarationValue(c);
          break;
        }
        case State.WeirdTag: {
          this.stateWeirdTag(c);
          break;
        }
        case State.BeforeAttribute: {
          this.stateBeforeAttribute(c);
          break;
        }
        case State.MetaAttribHttpEquiv: {
          this.stateMetaAttribHttpEquiv(c);
          break;
        }
        case State.MetaAttribHttpEquivValue: {
          this.stateMetaAttribHttpEquivValue(c);
          break;
        }
        case State.MetaAttribC: {
          this.stateMetaAttribC(c);
          break;
        }
        case State.MetaAttribContent: {
          this.stateMetaAttribContent(c);
          break;
        }
        case State.MetaAttribCharset: {
          this.stateMetaAttribCharset(c);
          break;
        }
        case State.MetaAttribAfterName: {
          this.stateMetaAttribAfterName(c);
          break;
        }
        case State.MetaContentValueQuotedBeforeEncoding: {
          this.stateMetaContentValueQuotedBeforeEncoding(c);
          break;
        }
        case State.MetaContentValueQuotedAfterEncoding: {
          this.stateMetaContentValueQuotedAfterEncoding(c);
          break;
        }
        case State.MetaContentValueQuotedBeforeValue: {
          this.stateMetaContentValueQuotedBeforeValue(c);
          break;
        }
        case State.MetaContentValueQuotedValueQuoted: {
          this.stateMetaContentValueQuotedValueQuoted(c);
          break;
        }
        case State.MetaContentValueQuotedValueUnquoted: {
          this.stateMetaContentValueQuotedValueUnquoted(c);
          break;
        }
        case State.MetaContentValueUnquotedBeforeEncoding: {
          this.stateMetaContentValueUnquotedBeforeEncoding(c);
          break;
        }
        case State.MetaContentValueUnquotedBeforeValue: {
          this.stateMetaContentValueUnquotedBeforeValue(c);
          break;
        }
        case State.MetaContentValueUnquotedValueQuoted: {
          this.stateMetaContentValueUnquotedValueQuoted(c);
          break;
        }
        case State.MetaContentValueUnquotedValueUnquoted: {
          this.stateMetaContentValueUnquotedValueUnquoted(c);
          break;
        }
        case State.AnyAttribName: {
          this.stateAnyAttribName(c);
          break;
        }
        case State.AfterAttributeName: {
          this.stateAfterAttributeName(c);
          break;
        }
        case State.BeforeAttributeValue: {
          this.stateBeforeAttributeValue(c);
          break;
        }
        case State.AttributeValueQuoted: {
          this.stateAttributeValueQuoted(c);
          break;
        }
        case State.AttributeValueUnquoted: {
          this.stateAttributeValueUnquoted(c);
          break;
        }
      }
    }
    this.offset += index;
  }
}
function getEncoding(buffer, options) {
  const sniffer = new Sniffer(options);
  sniffer.write(buffer);
  return sniffer.encoding;
}
function decodeBuffer(buffer, options = {}) {
  return iconv.decode(buffer, getEncoding(buffer, options));
}
class DecodeStream extends Transform {
  constructor(options) {
    var _a;
    super({ decodeStrings: false, encoding: "utf-8" });
    this.buffers = [];
    this.iconv = null;
    this.readBytes = 0;
    this.sniffer = new Sniffer(options);
    this.maxBytes = (_a = options === null || options === void 0 ? void 0 : options.maxBytes) !== null && _a !== void 0 ? _a : 1024;
  }
  _transform(chunk, _encoding, callback) {
    if (this.readBytes < this.maxBytes) {
      this.sniffer.write(chunk);
      this.readBytes += chunk.length;
      if (this.readBytes < this.maxBytes) {
        this.buffers.push(chunk);
        callback();
        return;
      }
    }
    this.getIconvStream().write(chunk, callback);
  }
  getIconvStream() {
    if (this.iconv) {
      return this.iconv;
    }
    const stream = iconv.decodeStream(this.sniffer.encoding);
    stream.on("data", (chunk) => this.push(chunk, "utf-8"));
    stream.on("end", () => this.push(null));
    this.iconv = stream;
    for (const buffer of this.buffers) {
      stream.write(buffer);
    }
    this.buffers.length = 0;
    return stream;
  }
  _flush(callback) {
    this.getIconvStream().end(callback);
  }
}
export {
  DecodeStream as D,
  decodeBuffer as d
};
