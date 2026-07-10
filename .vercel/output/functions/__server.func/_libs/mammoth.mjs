import require$$1 from "url";
import require$$3 from "path";
import { g as getDefaultExportFromCjs } from "./react.mjs";
import { r as requireUnderscoreNode } from "./underscore.mjs";
import { r as requirePromise } from "./bluebird.mjs";
import { r as requireBase64Js } from "./base64-js.mjs";
import { r as requireLib$1 } from "./jszip.mjs";
import { r as requireLib$2, a as requireDom } from "./xmldom__xmldom.mjs";
import { r as requireLib$3 } from "./xmlbuilder.mjs";
import { r as requireDist } from "./dingbat-to-unicode.mjs";
import require$$0 from "fs";
import os from "os";
import { r as requirePathIsAbsolute } from "./path-is-absolute.mjs";
import { r as requireLop } from "./lop.mjs";
function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k in e) {
        if (k !== "default" && !(k in n)) {
          const d = Object.getOwnPropertyDescriptor(e, k);
          if (d) {
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: function() {
                return e[k];
              }
            });
          }
        }
      }
    }
  }
  return Object.freeze(n);
}
var lib = {};
var docxReader = {};
var promises = {};
var hasRequiredPromises;
function requirePromises() {
  if (hasRequiredPromises) return promises;
  hasRequiredPromises = 1;
  var _ = requireUnderscoreNode();
  var bluebird = requirePromise()();
  promises.defer = defer;
  promises.when = bluebird.resolve;
  promises.resolve = bluebird.resolve;
  promises.all = bluebird.all;
  promises.props = bluebird.props;
  promises.reject = bluebird.reject;
  promises.promisify = bluebird.promisify;
  promises.mapSeries = bluebird.mapSeries;
  promises.attempt = bluebird.attempt;
  promises.nfcall = function(func) {
    var args = Array.prototype.slice.call(arguments, 1);
    var promisedFunc = bluebird.promisify(func);
    return promisedFunc.apply(null, args);
  };
  bluebird.prototype.fail = bluebird.prototype.caught;
  bluebird.prototype.also = function(func) {
    return this.then(function(value) {
      var returnValue = _.extend({}, value, func(value));
      return bluebird.props(returnValue);
    });
  };
  function defer() {
    var resolve;
    var reject;
    var promise = new bluebird.Promise(function(resolveArg, rejectArg) {
      resolve = resolveArg;
      reject = rejectArg;
    });
    return {
      resolve,
      reject,
      promise
    };
  }
  return promises;
}
var documents = {};
var hasRequiredDocuments;
function requireDocuments() {
  if (hasRequiredDocuments) return documents;
  hasRequiredDocuments = 1;
  var _ = requireUnderscoreNode();
  var types = documents.types = {
    document: "document",
    paragraph: "paragraph",
    run: "run",
    text: "text",
    tab: "tab",
    checkbox: "checkbox",
    hyperlink: "hyperlink",
    noteReference: "noteReference",
    image: "image",
    note: "note",
    commentReference: "commentReference",
    comment: "comment",
    table: "table",
    tableRow: "tableRow",
    tableCell: "tableCell",
    "break": "break",
    bookmarkStart: "bookmarkStart"
  };
  function Document(children, options) {
    options = options || {};
    return {
      type: types.document,
      children,
      notes: options.notes || new Notes({}),
      comments: options.comments || []
    };
  }
  function Paragraph(children, properties) {
    properties = properties || {};
    var indent = properties.indent || {};
    return {
      type: types.paragraph,
      children,
      styleId: properties.styleId || null,
      styleName: properties.styleName || null,
      numbering: properties.numbering || null,
      alignment: properties.alignment || null,
      indent: {
        start: indent.start || null,
        end: indent.end || null,
        firstLine: indent.firstLine || null,
        hanging: indent.hanging || null
      }
    };
  }
  function Run(children, properties) {
    properties = properties || {};
    return {
      type: types.run,
      children,
      styleId: properties.styleId || null,
      styleName: properties.styleName || null,
      isBold: !!properties.isBold,
      isUnderline: !!properties.isUnderline,
      isItalic: !!properties.isItalic,
      isStrikethrough: !!properties.isStrikethrough,
      isAllCaps: !!properties.isAllCaps,
      isSmallCaps: !!properties.isSmallCaps,
      verticalAlignment: properties.verticalAlignment || verticalAlignment.baseline,
      font: properties.font || null,
      fontSize: properties.fontSize || null,
      highlight: properties.highlight || null
    };
  }
  var verticalAlignment = {
    baseline: "baseline",
    superscript: "superscript",
    subscript: "subscript"
  };
  function Text(value) {
    return {
      type: types.text,
      value
    };
  }
  function Tab() {
    return {
      type: types.tab
    };
  }
  function Checkbox(options) {
    return {
      type: types.checkbox,
      checked: options.checked
    };
  }
  function Hyperlink(children, options) {
    return {
      type: types.hyperlink,
      children,
      href: options.href,
      anchor: options.anchor,
      targetFrame: options.targetFrame
    };
  }
  function NoteReference(options) {
    return {
      type: types.noteReference,
      noteType: options.noteType,
      noteId: options.noteId
    };
  }
  function Notes(notes) {
    this._notes = _.indexBy(notes, function(note) {
      return noteKey(note.noteType, note.noteId);
    });
  }
  Notes.prototype.resolve = function(reference) {
    return this.findNoteByKey(noteKey(reference.noteType, reference.noteId));
  };
  Notes.prototype.findNoteByKey = function(key) {
    return this._notes[key] || null;
  };
  function Note(options) {
    return {
      type: types.note,
      noteType: options.noteType,
      noteId: options.noteId,
      body: options.body
    };
  }
  function commentReference(options) {
    return {
      type: types.commentReference,
      commentId: options.commentId
    };
  }
  function comment(options) {
    return {
      type: types.comment,
      commentId: options.commentId,
      body: options.body,
      authorName: options.authorName,
      authorInitials: options.authorInitials
    };
  }
  function noteKey(noteType, id) {
    return noteType + "-" + id;
  }
  function Image(options) {
    return {
      type: types.image,
      // `read` is retained for backwards compatibility, but other read
      // methods should be preferred.
      read: function(encoding) {
        if (encoding) {
          return options.readImage(encoding);
        } else {
          return options.readImage().then(function(arrayBuffer) {
            return Buffer.from(arrayBuffer);
          });
        }
      },
      readAsArrayBuffer: function() {
        return options.readImage();
      },
      readAsBase64String: function() {
        return options.readImage("base64");
      },
      readAsBuffer: function() {
        return options.readImage().then(function(arrayBuffer) {
          return Buffer.from(arrayBuffer);
        });
      },
      altText: options.altText,
      contentType: options.contentType
    };
  }
  function Table(children, properties) {
    properties = properties || {};
    return {
      type: types.table,
      children,
      styleId: properties.styleId || null,
      styleName: properties.styleName || null
    };
  }
  function TableRow(children, options) {
    options = options || {};
    return {
      type: types.tableRow,
      children,
      isHeader: options.isHeader || false
    };
  }
  function TableCell(children, options) {
    options = options || {};
    return {
      type: types.tableCell,
      children,
      colSpan: options.colSpan == null ? 1 : options.colSpan,
      rowSpan: options.rowSpan == null ? 1 : options.rowSpan
    };
  }
  function Break(breakType) {
    return {
      type: types["break"],
      breakType
    };
  }
  function BookmarkStart(options) {
    return {
      type: types.bookmarkStart,
      name: options.name
    };
  }
  documents.document = documents.Document = Document;
  documents.paragraph = documents.Paragraph = Paragraph;
  documents.run = documents.Run = Run;
  documents.text = documents.Text = Text;
  documents.tab = documents.Tab = Tab;
  documents.checkbox = documents.Checkbox = Checkbox;
  documents.Hyperlink = Hyperlink;
  documents.noteReference = documents.NoteReference = NoteReference;
  documents.Notes = Notes;
  documents.Note = Note;
  documents.commentReference = commentReference;
  documents.comment = comment;
  documents.Image = Image;
  documents.Table = Table;
  documents.TableRow = TableRow;
  documents.TableCell = TableCell;
  documents.lineBreak = Break("line");
  documents.pageBreak = Break("page");
  documents.columnBreak = Break("column");
  documents.BookmarkStart = BookmarkStart;
  documents.verticalAlignment = verticalAlignment;
  return documents;
}
var results = {};
var hasRequiredResults;
function requireResults() {
  if (hasRequiredResults) return results;
  hasRequiredResults = 1;
  var _ = requireUnderscoreNode();
  results.Result = Result;
  results.success = success;
  results.warning = warning;
  results.error = error;
  function Result(value, messages) {
    this.value = value;
    this.messages = messages || [];
  }
  Result.prototype.map = function(func) {
    return new Result(func(this.value), this.messages);
  };
  Result.prototype.flatMap = function(func) {
    var funcResult = func(this.value);
    return new Result(funcResult.value, combineMessages([this, funcResult]));
  };
  Result.prototype.flatMapThen = function(func) {
    var that = this;
    return func(this.value).then(function(otherResult) {
      return new Result(otherResult.value, combineMessages([that, otherResult]));
    });
  };
  Result.combine = function(results2) {
    var values = _.flatten(_.pluck(results2, "value"));
    var messages = combineMessages(results2);
    return new Result(values, messages);
  };
  function success(value) {
    return new Result(value, []);
  }
  function warning(message) {
    return {
      type: "warning",
      message
    };
  }
  function error(exception) {
    return {
      type: "error",
      message: exception.message,
      error: exception
    };
  }
  function combineMessages(results2) {
    var messages = [];
    _.flatten(_.pluck(results2, "messages"), true).forEach(function(message) {
      if (!containsMessage(messages, message)) {
        messages.push(message);
      }
    });
    return messages;
  }
  function containsMessage(messages, message) {
    return _.find(messages, isSameMessage.bind(null, message)) !== void 0;
  }
  function isSameMessage(first, second) {
    return first.type === second.type && first.message === second.message;
  }
  return results;
}
var zipfile = {};
var hasRequiredZipfile;
function requireZipfile() {
  if (hasRequiredZipfile) return zipfile;
  hasRequiredZipfile = 1;
  var base64js = requireBase64Js();
  var JSZip = requireLib$1();
  zipfile.openArrayBuffer = openArrayBuffer;
  zipfile.splitPath = splitPath;
  zipfile.joinPath = joinPath;
  function openArrayBuffer(arrayBuffer) {
    return JSZip.loadAsync(arrayBuffer).then(function(zipFile) {
      function exists(name) {
        return zipFile.file(name) !== null;
      }
      function read(name, encoding) {
        return zipFile.file(name).async("uint8array").then(function(array) {
          if (encoding === "base64") {
            return base64js.fromByteArray(array);
          } else if (encoding) {
            var decoder = new TextDecoder(encoding);
            return decoder.decode(array);
          } else {
            return array;
          }
        });
      }
      function write(name, contents) {
        zipFile.file(name, contents);
      }
      function toArrayBuffer() {
        return zipFile.generateAsync({ type: "arraybuffer" });
      }
      return {
        exists,
        read,
        write,
        toArrayBuffer
      };
    });
  }
  function splitPath(path) {
    var lastIndex = path.lastIndexOf("/");
    if (lastIndex === -1) {
      return { dirname: "", basename: path };
    } else {
      return {
        dirname: path.substring(0, lastIndex),
        basename: path.substring(lastIndex + 1)
      };
    }
  }
  function joinPath() {
    var nonEmptyPaths = Array.prototype.filter.call(arguments, function(path) {
      return path;
    });
    var relevantPaths = [];
    nonEmptyPaths.forEach(function(path) {
      if (/^\//.test(path)) {
        relevantPaths = [path];
      } else {
        relevantPaths.push(path);
      }
    });
    return relevantPaths.join("/");
  }
  return zipfile;
}
var officeXmlReader = {};
var xml = {};
var nodes = {};
var hasRequiredNodes;
function requireNodes() {
  if (hasRequiredNodes) return nodes;
  hasRequiredNodes = 1;
  var _ = requireUnderscoreNode();
  nodes.Element = Element;
  nodes.element = function(name, attributes, children) {
    return new Element(name, attributes, children);
  };
  nodes.text = function(value) {
    return {
      type: "text",
      value
    };
  };
  var emptyElement = nodes.emptyElement = {
    first: function() {
      return null;
    },
    firstOrEmpty: function() {
      return emptyElement;
    },
    attributes: {},
    children: []
  };
  function Element(name, attributes, children) {
    this.type = "element";
    this.name = name;
    this.attributes = attributes || {};
    this.children = children || [];
  }
  Element.prototype.first = function(name) {
    return _.find(this.children, function(child) {
      return child.name === name;
    });
  };
  Element.prototype.firstOrEmpty = function(name) {
    return this.first(name) || emptyElement;
  };
  Element.prototype.getElementsByTagName = function(name) {
    var elements = _.filter(this.children, function(child) {
      return child.name === name;
    });
    return toElementList(elements);
  };
  Element.prototype.text = function() {
    if (this.children.length === 0) {
      return "";
    } else if (this.children.length !== 1 || this.children[0].type !== "text") {
      throw new Error("Not implemented");
    }
    return this.children[0].value;
  };
  var elementListPrototype = {
    getElementsByTagName: function(name) {
      return toElementList(_.flatten(this.map(function(element) {
        return element.getElementsByTagName(name);
      }, true)));
    }
  };
  function toElementList(array) {
    return _.extend(array, elementListPrototype);
  }
  return nodes;
}
var reader = {};
var xmldom = {};
var hasRequiredXmldom;
function requireXmldom() {
  if (hasRequiredXmldom) return xmldom;
  hasRequiredXmldom = 1;
  var xmldom$1 = requireLib$2();
  var dom = requireDom();
  function parseFromString(string) {
    var error = null;
    var domParser = new xmldom$1.DOMParser({
      errorHandler: function(level, message) {
        error = { level, message };
      }
    });
    var document = domParser.parseFromString(string);
    if (error === null) {
      return document;
    } else {
      throw new Error(error.level + ": " + error.message);
    }
  }
  xmldom.parseFromString = parseFromString;
  xmldom.Node = dom.Node;
  return xmldom;
}
var hasRequiredReader;
function requireReader() {
  if (hasRequiredReader) return reader;
  hasRequiredReader = 1;
  var promises2 = requirePromises();
  var _ = requireUnderscoreNode();
  var xmldom2 = requireXmldom();
  var nodes2 = requireNodes();
  var Element = nodes2.Element;
  reader.readString = readString;
  var Node = xmldom2.Node;
  function readString(xmlString, namespaceMap) {
    namespaceMap = namespaceMap || {};
    try {
      var document = xmldom2.parseFromString(xmlString, "text/xml");
    } catch (error) {
      return promises2.reject(error);
    }
    if (document.documentElement.tagName === "parsererror") {
      return promises2.resolve(new Error(document.documentElement.textContent));
    }
    function convertNode(node) {
      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          return convertElement(node);
        case Node.TEXT_NODE:
          return nodes2.text(node.nodeValue);
      }
    }
    function convertElement(element) {
      var convertedName = convertName(element);
      var convertedChildren = [];
      _.forEach(element.childNodes, function(childNode) {
        var convertedNode = convertNode(childNode);
        if (convertedNode) {
          convertedChildren.push(convertedNode);
        }
      });
      var convertedAttributes = {};
      _.forEach(element.attributes, function(attribute) {
        convertedAttributes[convertName(attribute)] = attribute.value;
      });
      return new Element(convertedName, convertedAttributes, convertedChildren);
    }
    function convertName(node) {
      if (node.namespaceURI) {
        var mappedPrefix = namespaceMap[node.namespaceURI];
        var prefix;
        if (mappedPrefix) {
          prefix = mappedPrefix + ":";
        } else {
          prefix = "{" + node.namespaceURI + "}";
        }
        return prefix + node.localName;
      } else {
        return node.localName;
      }
    }
    return promises2.resolve(convertNode(document.documentElement));
  }
  return reader;
}
var writer = {};
var hasRequiredWriter;
function requireWriter() {
  if (hasRequiredWriter) return writer;
  hasRequiredWriter = 1;
  var _ = requireUnderscoreNode();
  var xmlbuilder = requireLib$3();
  writer.writeString = writeString;
  function writeString(root, namespaces) {
    var uriToPrefix = _.invert(namespaces);
    var nodeWriters = {
      element: writeElement,
      text: writeTextNode
    };
    function writeNode(builder, node) {
      return nodeWriters[node.type](builder, node);
    }
    function writeElement(builder, element) {
      var elementBuilder = builder.element(mapElementName(element.name), element.attributes);
      element.children.forEach(function(child) {
        writeNode(elementBuilder, child);
      });
    }
    function mapElementName(name) {
      var longFormMatch = /^\{(.*)\}(.*)$/.exec(name);
      if (longFormMatch) {
        var prefix = uriToPrefix[longFormMatch[1]];
        return prefix + (prefix === "" ? "" : ":") + longFormMatch[2];
      } else {
        return name;
      }
    }
    function writeDocument(root2) {
      var builder = xmlbuilder.create(mapElementName(root2.name), {
        version: "1.0",
        encoding: "UTF-8",
        standalone: true
      });
      _.forEach(namespaces, function(uri, prefix) {
        var key = "xmlns" + (prefix === "" ? "" : ":" + prefix);
        builder.attribute(key, uri);
      });
      root2.children.forEach(function(child) {
        writeNode(builder, child);
      });
      return builder.end();
    }
    return writeDocument(root);
  }
  function writeTextNode(builder, node) {
    builder.text(node.value);
  }
  return writer;
}
var hasRequiredXml;
function requireXml() {
  if (hasRequiredXml) return xml;
  hasRequiredXml = 1;
  var nodes2 = requireNodes();
  xml.Element = nodes2.Element;
  xml.element = nodes2.element;
  xml.emptyElement = nodes2.emptyElement;
  xml.text = nodes2.text;
  xml.readString = requireReader().readString;
  xml.writeString = requireWriter().writeString;
  return xml;
}
var hasRequiredOfficeXmlReader;
function requireOfficeXmlReader() {
  if (hasRequiredOfficeXmlReader) return officeXmlReader;
  hasRequiredOfficeXmlReader = 1;
  var _ = requireUnderscoreNode();
  var promises2 = requirePromises();
  var xml2 = requireXml();
  officeXmlReader.read = read;
  officeXmlReader.readXmlFromZipFile = readXmlFromZipFile;
  var xmlNamespaceMap = {
    // Transitional format
    "http://schemas.openxmlformats.org/wordprocessingml/2006/main": "w",
    "http://schemas.openxmlformats.org/officeDocument/2006/relationships": "r",
    "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing": "wp",
    "http://schemas.openxmlformats.org/drawingml/2006/main": "a",
    "http://schemas.openxmlformats.org/drawingml/2006/picture": "pic",
    // Strict format
    "http://purl.oclc.org/ooxml/wordprocessingml/main": "w",
    "http://purl.oclc.org/ooxml/officeDocument/relationships": "r",
    "http://purl.oclc.org/ooxml/drawingml/wordprocessingDrawing": "wp",
    "http://purl.oclc.org/ooxml/drawingml/main": "a",
    "http://purl.oclc.org/ooxml/drawingml/picture": "pic",
    // Common
    "http://schemas.openxmlformats.org/package/2006/content-types": "content-types",
    "http://schemas.openxmlformats.org/package/2006/relationships": "relationships",
    "http://schemas.openxmlformats.org/markup-compatibility/2006": "mc",
    "urn:schemas-microsoft-com:vml": "v",
    "urn:schemas-microsoft-com:office:word": "office-word",
    // [MS-DOCX]: Word Extensions to the Office Open XML (.docx) File Format
    // https://learn.microsoft.com/en-us/openspecs/office_standards/ms-docx/b839fe1f-e1ca-4fa6-8c26-5954d0abbccd
    "http://schemas.microsoft.com/office/word/2010/wordml": "wordml"
  };
  function read(xmlString) {
    return xml2.readString(xmlString, xmlNamespaceMap).then(function(document) {
      return collapseAlternateContent(document)[0];
    });
  }
  function readXmlFromZipFile(docxFile, path) {
    if (docxFile.exists(path)) {
      return docxFile.read(path, "utf-8").then(stripUtf8Bom).then(read);
    } else {
      return promises2.resolve(null);
    }
  }
  function stripUtf8Bom(xmlString) {
    return xmlString.replace(/^\uFEFF/g, "");
  }
  function collapseAlternateContent(node) {
    if (node.type === "element") {
      if (node.name === "mc:AlternateContent") {
        return node.firstOrEmpty("mc:Fallback").children;
      } else {
        node.children = _.flatten(node.children.map(collapseAlternateContent, true));
        return [node];
      }
    } else {
      return [node];
    }
  }
  return officeXmlReader;
}
var bodyReader = {};
var transforms = {};
var hasRequiredTransforms;
function requireTransforms() {
  if (hasRequiredTransforms) return transforms;
  hasRequiredTransforms = 1;
  var _ = requireUnderscoreNode();
  transforms.paragraph = paragraph;
  transforms.run = run;
  transforms._elements = elements;
  transforms._elementsOfType = elementsOfType;
  transforms.getDescendantsOfType = getDescendantsOfType;
  transforms.getDescendants = getDescendants;
  function paragraph(transform) {
    return elementsOfType("paragraph", transform);
  }
  function run(transform) {
    return elementsOfType("run", transform);
  }
  function elementsOfType(elementType, transform) {
    return elements(function(element) {
      if (element.type === elementType) {
        return transform(element);
      } else {
        return element;
      }
    });
  }
  function elements(transform) {
    return function transformElement(element) {
      if (element.children) {
        var children = _.map(element.children, transformElement);
        element = _.extend(element, { children });
      }
      return transform(element);
    };
  }
  function getDescendantsOfType(element, type) {
    return getDescendants(element).filter(function(descendant) {
      return descendant.type === type;
    });
  }
  function getDescendants(element) {
    var descendants = [];
    visitDescendants(element, function(descendant) {
      descendants.push(descendant);
    });
    return descendants;
  }
  function visitDescendants(element, visit) {
    if (element.children) {
      element.children.forEach(function(child) {
        visitDescendants(child, visit);
        visit(child);
      });
    }
  }
  return transforms;
}
var uris = {};
var hasRequiredUris;
function requireUris() {
  if (hasRequiredUris) return uris;
  hasRequiredUris = 1;
  uris.uriToZipEntryName = uriToZipEntryName;
  uris.replaceFragment = replaceFragment;
  function uriToZipEntryName(base, uri) {
    if (uri.charAt(0) === "/") {
      return uri.substr(1);
    } else {
      return base + "/" + uri;
    }
  }
  function replaceFragment(uri, fragment) {
    var hashIndex = uri.indexOf("#");
    if (hashIndex !== -1) {
      uri = uri.substring(0, hashIndex);
    }
    return uri + "#" + fragment;
  }
  return uris;
}
var hasRequiredBodyReader;
function requireBodyReader() {
  if (hasRequiredBodyReader) return bodyReader;
  hasRequiredBodyReader = 1;
  bodyReader.createBodyReader = createBodyReader;
  bodyReader._readNumberingProperties = readNumberingProperties;
  var dingbatToUnicode = requireDist();
  var _ = requireUnderscoreNode();
  var documents2 = requireDocuments();
  var Result = requireResults().Result;
  var warning = requireResults().warning;
  var xml2 = requireXml();
  var transforms2 = requireTransforms();
  var uris2 = requireUris();
  function createBodyReader(options) {
    return {
      readXmlElement: function(element) {
        return new BodyReader(options).readXmlElement(element);
      },
      readXmlElements: function(elements) {
        return new BodyReader(options).readXmlElements(elements);
      }
    };
  }
  function BodyReader(options) {
    var complexFieldStack = [];
    var currentInstrText = [];
    var deletedParagraphContents = [];
    var relationships = options.relationships;
    var contentTypes = options.contentTypes;
    var docxFile = options.docxFile;
    var files2 = options.files;
    var numbering = options.numbering;
    var styles = options.styles;
    function readXmlElements(elements) {
      var results2 = elements.map(readXmlElement);
      return combineResults(results2);
    }
    function readXmlElement(element) {
      if (element.type === "element") {
        var handler = xmlElementReaders[element.name];
        if (handler) {
          return handler(element);
        } else if (!Object.prototype.hasOwnProperty.call(ignoreElements, element.name)) {
          var message = warning("An unrecognised element was ignored: " + element.name);
          return emptyResultWithMessages([message]);
        }
      }
      return emptyResult();
    }
    function readParagraphProperties(element) {
      return readParagraphStyle(element).map(function(style) {
        return {
          type: "paragraphProperties",
          styleId: style.styleId,
          styleName: style.name,
          alignment: element.firstOrEmpty("w:jc").attributes["w:val"],
          numbering: readNumberingProperties(style.styleId, element.firstOrEmpty("w:numPr"), numbering),
          indent: readParagraphIndent(element.firstOrEmpty("w:ind"))
        };
      });
    }
    function readParagraphIndent(element) {
      return {
        start: element.attributes["w:start"] || element.attributes["w:left"],
        end: element.attributes["w:end"] || element.attributes["w:right"],
        firstLine: element.attributes["w:firstLine"],
        hanging: element.attributes["w:hanging"]
      };
    }
    function readRunProperties(element) {
      return readRunStyle(element).map(function(style) {
        var fontSizeString = element.firstOrEmpty("w:sz").attributes["w:val"];
        var fontSize = /^[0-9]+$/.test(fontSizeString) ? parseInt(fontSizeString, 10) / 2 : null;
        return {
          type: "runProperties",
          styleId: style.styleId,
          styleName: style.name,
          verticalAlignment: element.firstOrEmpty("w:vertAlign").attributes["w:val"],
          font: element.firstOrEmpty("w:rFonts").attributes["w:ascii"],
          fontSize,
          isBold: readBooleanElement(element.first("w:b")),
          isUnderline: readUnderline(element.first("w:u")),
          isItalic: readBooleanElement(element.first("w:i")),
          isStrikethrough: readBooleanElement(element.first("w:strike")),
          isAllCaps: readBooleanElement(element.first("w:caps")),
          isSmallCaps: readBooleanElement(element.first("w:smallCaps")),
          highlight: readHighlightValue(element.firstOrEmpty("w:highlight").attributes["w:val"])
        };
      });
    }
    function readUnderline(element) {
      if (element) {
        var value = element.attributes["w:val"];
        return value !== void 0 && value !== "false" && value !== "0" && value !== "none";
      } else {
        return false;
      }
    }
    function readBooleanElement(element) {
      if (element) {
        var value = element.attributes["w:val"];
        return value !== "false" && value !== "0";
      } else {
        return false;
      }
    }
    function readBooleanAttributeValue(value) {
      return value !== "false" && value !== "0";
    }
    function readHighlightValue(value) {
      if (!value || value === "none") {
        return null;
      } else {
        return value;
      }
    }
    function readParagraphStyle(element) {
      return readStyle(element, "w:pStyle", "Paragraph", styles.findParagraphStyleById);
    }
    function readRunStyle(element) {
      return readStyle(element, "w:rStyle", "Run", styles.findCharacterStyleById);
    }
    function readTableStyle(element) {
      return readStyle(element, "w:tblStyle", "Table", styles.findTableStyleById);
    }
    function readStyle(element, styleTagName, styleType, findStyleById) {
      var messages = [];
      var styleElement = element.first(styleTagName);
      var styleId = null;
      var name = null;
      if (styleElement) {
        styleId = styleElement.attributes["w:val"];
        if (styleId) {
          var style = findStyleById(styleId);
          if (style) {
            name = style.name;
          } else {
            messages.push(undefinedStyleWarning(styleType, styleId));
          }
        }
      }
      return elementResultWithMessages({ styleId, name }, messages);
    }
    function readFldChar(element) {
      var type = element.attributes["w:fldCharType"];
      if (type === "begin") {
        complexFieldStack.push({ type: "begin", fldChar: element });
        currentInstrText = [];
      } else if (type === "end") {
        var complexFieldEnd = complexFieldStack.pop();
        if (complexFieldEnd.type === "begin") {
          complexFieldEnd = parseCurrentInstrText(complexFieldEnd);
        }
        if (complexFieldEnd.type === "checkbox") {
          return elementResult(documents2.checkbox({
            checked: complexFieldEnd.checked
          }));
        }
      } else if (type === "separate") {
        var complexFieldSeparate = complexFieldStack.pop();
        var complexField = parseCurrentInstrText(complexFieldSeparate);
        complexFieldStack.push(complexField);
      }
      return emptyResult();
    }
    function currentHyperlinkOptions() {
      var topHyperlink = _.last(complexFieldStack.filter(function(complexField) {
        return complexField.type === "hyperlink";
      }));
      return topHyperlink ? topHyperlink.options : null;
    }
    function parseCurrentInstrText(complexField) {
      return parseInstrText(
        currentInstrText.join(""),
        complexField.type === "begin" ? complexField.fldChar : xml2.emptyElement
      );
    }
    function parseInstrText(instrText, fldChar) {
      var linkResult = /^\s*HYPERLINK\s+(\\l\s+)?(?:"(.*)"|([^\\]\S*))/.exec(instrText);
      if (linkResult) {
        var location = linkResult[2] === void 0 ? linkResult[3] : linkResult[2];
        var options2 = linkResult[1] === void 0 ? { href: location } : { anchor: location };
        return { type: "hyperlink", options: options2 };
      }
      var checkboxResult = /\s*FORMCHECKBOX\s*/.exec(instrText);
      if (checkboxResult) {
        var checkboxElement = fldChar.firstOrEmpty("w:ffData").firstOrEmpty("w:checkBox");
        var checkedElement = checkboxElement.first("w:checked");
        var checked = checkedElement == null ? readBooleanElement(checkboxElement.first("w:default")) : readBooleanElement(checkedElement);
        return { type: "checkbox", checked };
      }
      return { type: "unknown" };
    }
    function readInstrText(element) {
      currentInstrText.push(element.text());
      return emptyResult();
    }
    function readSymbol(element) {
      var font = element.attributes["w:font"];
      var char = element.attributes["w:char"];
      var unicodeCharacter = dingbatToUnicode.hex(font, char);
      if (unicodeCharacter == null && /^F0..$/.test(char)) {
        unicodeCharacter = dingbatToUnicode.hex(font, char.substring(2));
      }
      if (unicodeCharacter == null) {
        return emptyResultWithMessages([warning(
          "A w:sym element with an unsupported character was ignored: char " + char + " in font " + font
        )]);
      } else {
        return elementResult(new documents2.Text(unicodeCharacter.string));
      }
    }
    function noteReferenceReader(noteType) {
      return function(element) {
        var noteId = element.attributes["w:id"];
        return elementResult(new documents2.NoteReference({
          noteType,
          noteId
        }));
      };
    }
    function readCommentReference(element) {
      return elementResult(documents2.commentReference({
        commentId: element.attributes["w:id"]
      }));
    }
    function readChildElements(element) {
      return readXmlElements(element.children);
    }
    var xmlElementReaders = {
      "w:p": function(element) {
        var paragraphPropertiesElement = element.firstOrEmpty("w:pPr");
        var isDeleted = !!paragraphPropertiesElement.firstOrEmpty("w:rPr").first("w:del");
        if (isDeleted) {
          element.children.forEach(function(child) {
            deletedParagraphContents.push(child);
          });
          return emptyResult();
        } else {
          var childrenXml = element.children;
          if (deletedParagraphContents.length > 0) {
            childrenXml = deletedParagraphContents.concat(childrenXml);
            deletedParagraphContents = [];
          }
          return ReadResult.map(
            readParagraphProperties(paragraphPropertiesElement),
            readXmlElements(childrenXml),
            function(properties, children) {
              return new documents2.Paragraph(children, properties);
            }
          ).insertExtra();
        }
      },
      "w:r": function(element) {
        return ReadResult.map(
          readRunProperties(element.firstOrEmpty("w:rPr")),
          readXmlElements(element.children),
          function(properties, children) {
            var hyperlinkOptions = currentHyperlinkOptions();
            if (hyperlinkOptions !== null) {
              children = [new documents2.Hyperlink(children, hyperlinkOptions)];
            }
            return new documents2.Run(children, properties);
          }
        );
      },
      "w:fldChar": readFldChar,
      "w:instrText": readInstrText,
      "w:t": function(element) {
        return elementResult(new documents2.Text(element.text()));
      },
      "w:tab": function(element) {
        return elementResult(new documents2.Tab());
      },
      "w:noBreakHyphen": function() {
        return elementResult(new documents2.Text("‑"));
      },
      "w:softHyphen": function(element) {
        return elementResult(new documents2.Text("­"));
      },
      "w:sym": readSymbol,
      "w:hyperlink": function(element) {
        var relationshipId = element.attributes["r:id"];
        var anchor = element.attributes["w:anchor"];
        return readXmlElements(element.children).map(function(children) {
          function create(options2) {
            var targetFrame = element.attributes["w:tgtFrame"] || null;
            return new documents2.Hyperlink(
              children,
              _.extend({ targetFrame }, options2)
            );
          }
          if (relationshipId) {
            var href = relationships.findTargetByRelationshipId(relationshipId);
            if (anchor) {
              href = uris2.replaceFragment(href, anchor);
            }
            return create({ href });
          } else if (anchor) {
            return create({ anchor });
          } else {
            return children;
          }
        });
      },
      "w:tbl": readTable,
      "w:tr": readTableRow,
      "w:tc": readTableCell,
      "w:footnoteReference": noteReferenceReader("footnote"),
      "w:endnoteReference": noteReferenceReader("endnote"),
      "w:commentReference": readCommentReference,
      "w:br": function(element) {
        var breakType = element.attributes["w:type"];
        if (breakType == null || breakType === "textWrapping") {
          return elementResult(documents2.lineBreak);
        } else if (breakType === "page") {
          return elementResult(documents2.pageBreak);
        } else if (breakType === "column") {
          return elementResult(documents2.columnBreak);
        } else {
          return emptyResultWithMessages([warning("Unsupported break type: " + breakType)]);
        }
      },
      "w:bookmarkStart": function(element) {
        var name = element.attributes["w:name"];
        if (name === "_GoBack") {
          return emptyResult();
        } else {
          return elementResult(new documents2.BookmarkStart({ name }));
        }
      },
      "mc:AlternateContent": function(element) {
        return readChildElements(element.firstOrEmpty("mc:Fallback"));
      },
      "w:sdt": function(element) {
        var contentResult = readXmlElements(element.firstOrEmpty("w:sdtContent").children);
        return contentResult.map(function(content) {
          var checkbox = element.firstOrEmpty("w:sdtPr").first("wordml:checkbox");
          if (checkbox) {
            var checkedElement = checkbox.first("wordml:checked");
            var isChecked = !!checkedElement && readBooleanAttributeValue(
              checkedElement.attributes["wordml:val"]
            );
            var documentCheckbox = documents2.checkbox({
              checked: isChecked
            });
            var hasCheckbox = false;
            var replacedContent = content.map(transforms2._elementsOfType(
              documents2.types.text,
              function(text) {
                if (text.value.length > 0 && !hasCheckbox) {
                  hasCheckbox = true;
                  return documentCheckbox;
                } else {
                  return text;
                }
              }
            ));
            if (hasCheckbox) {
              return replacedContent;
            } else {
              return documentCheckbox;
            }
          } else {
            return content;
          }
        });
      },
      "w:ins": readChildElements,
      "w:object": readChildElements,
      "w:smartTag": readChildElements,
      "w:drawing": readChildElements,
      "w:pict": function(element) {
        return readChildElements(element).toExtra();
      },
      "v:roundrect": readChildElements,
      "v:shape": readChildElements,
      "v:textbox": readChildElements,
      "w:txbxContent": readChildElements,
      "wp:inline": readDrawingElement,
      "wp:anchor": readDrawingElement,
      "v:imagedata": readImageData,
      "v:group": readChildElements,
      "v:rect": readChildElements
    };
    return {
      readXmlElement,
      readXmlElements
    };
    function readTable(element) {
      var propertiesResult = readTableProperties(element.firstOrEmpty("w:tblPr"));
      return readXmlElements(element.children).flatMap(calculateRowSpans).flatMap(function(children) {
        return propertiesResult.map(function(properties) {
          return documents2.Table(children, properties);
        });
      });
    }
    function readTableProperties(element) {
      return readTableStyle(element).map(function(style) {
        return {
          styleId: style.styleId,
          styleName: style.name
        };
      });
    }
    function readTableRow(element) {
      var properties = element.firstOrEmpty("w:trPr");
      var isDeleted = !!properties.first("w:del");
      if (isDeleted) {
        return emptyResult();
      }
      var isHeader = !!properties.first("w:tblHeader");
      return readXmlElements(element.children).map(function(children) {
        return documents2.TableRow(children, { isHeader });
      });
    }
    function readTableCell(element) {
      return readXmlElements(element.children).map(function(children) {
        var properties = element.firstOrEmpty("w:tcPr");
        var gridSpan = properties.firstOrEmpty("w:gridSpan").attributes["w:val"];
        var colSpan = gridSpan ? parseInt(gridSpan, 10) : 1;
        var cell = documents2.TableCell(children, { colSpan });
        cell._vMerge = readVMerge(properties);
        return cell;
      });
    }
    function readVMerge(properties) {
      var element = properties.first("w:vMerge");
      if (element) {
        var val = element.attributes["w:val"];
        return val === "continue" || !val;
      } else {
        return null;
      }
    }
    function calculateRowSpans(rows) {
      var unexpectedNonRows = _.any(rows, function(row) {
        return row.type !== documents2.types.tableRow;
      });
      if (unexpectedNonRows) {
        removeVMergeProperties(rows);
        return elementResultWithMessages(rows, [warning(
          "unexpected non-row element in table, cell merging may be incorrect"
        )]);
      }
      var unexpectedNonCells = _.any(rows, function(row) {
        return _.any(row.children, function(cell) {
          return cell.type !== documents2.types.tableCell;
        });
      });
      if (unexpectedNonCells) {
        removeVMergeProperties(rows);
        return elementResultWithMessages(rows, [warning(
          "unexpected non-cell element in table row, cell merging may be incorrect"
        )]);
      }
      var columns = {};
      rows.forEach(function(row) {
        var cellIndex = 0;
        row.children.forEach(function(cell) {
          if (cell._vMerge && columns[cellIndex]) {
            columns[cellIndex].rowSpan++;
          } else {
            columns[cellIndex] = cell;
            cell._vMerge = false;
          }
          cellIndex += cell.colSpan;
        });
      });
      rows.forEach(function(row) {
        row.children = row.children.filter(function(cell) {
          return !cell._vMerge;
        });
        row.children.forEach(function(cell) {
          delete cell._vMerge;
        });
      });
      return elementResult(rows);
    }
    function removeVMergeProperties(rows) {
      rows.forEach(function(row) {
        var cells = transforms2.getDescendantsOfType(row, documents2.types.tableCell);
        cells.forEach(function(cell) {
          delete cell._vMerge;
        });
      });
    }
    function readDrawingElement(element) {
      var blips = element.getElementsByTagName("a:graphic").getElementsByTagName("a:graphicData").getElementsByTagName("pic:pic").getElementsByTagName("pic:blipFill").getElementsByTagName("a:blip");
      return combineResults(blips.map(readBlip.bind(null, element)));
    }
    function readBlip(element, blip) {
      var propertiesElement = element.firstOrEmpty("wp:docPr");
      var properties = propertiesElement.attributes;
      var altText = isBlank(properties.descr) ? properties.title : properties.descr;
      var blipImageFile = findBlipImageFile(blip);
      if (blipImageFile === null) {
        return emptyResultWithMessages([warning("Could not find image file for a:blip element")]);
      }
      return readImage(blipImageFile, altText).map(function(imageElement) {
        var hlinkClickElement = propertiesElement.firstOrEmpty("a:hlinkClick");
        var relationshipId = hlinkClickElement.attributes["r:id"];
        if (relationshipId) {
          var href = relationships.findTargetByRelationshipId(relationshipId);
          return new documents2.Hyperlink([imageElement], { href });
        } else {
          return imageElement;
        }
      });
    }
    function isBlank(value) {
      return value == null || /^\s*$/.test(value);
    }
    function findBlipImageFile(blip) {
      var embedRelationshipId = blip.attributes["r:embed"];
      var linkRelationshipId = blip.attributes["r:link"];
      if (embedRelationshipId) {
        return findEmbeddedImageFile(embedRelationshipId);
      } else if (linkRelationshipId) {
        var imagePath = relationships.findTargetByRelationshipId(linkRelationshipId);
        return {
          path: imagePath,
          read: files2.read.bind(files2, imagePath)
        };
      } else {
        return null;
      }
    }
    function readImageData(element) {
      var relationshipId = element.attributes["r:id"];
      if (relationshipId) {
        return readImage(
          findEmbeddedImageFile(relationshipId),
          element.attributes["o:title"]
        );
      } else {
        return emptyResultWithMessages([warning("A v:imagedata element without a relationship ID was ignored")]);
      }
    }
    function findEmbeddedImageFile(relationshipId) {
      var path = uris2.uriToZipEntryName("word", relationships.findTargetByRelationshipId(relationshipId));
      return {
        path,
        read: docxFile.read.bind(docxFile, path)
      };
    }
    function readImage(imageFile, altText) {
      var contentType = contentTypes.findContentType(imageFile.path);
      var image = documents2.Image({
        readImage: imageFile.read,
        altText,
        contentType
      });
      var warnings = supportedImageTypes[contentType] ? [] : warning("Image of type " + contentType + " is unlikely to display in web browsers");
      return elementResultWithMessages(image, warnings);
    }
    function undefinedStyleWarning(type, styleId) {
      return warning(
        type + " style with ID " + styleId + " was referenced but not defined in the document"
      );
    }
  }
  function readNumberingProperties(styleId, element, numbering) {
    var level = element.firstOrEmpty("w:ilvl").attributes["w:val"];
    var numId = element.firstOrEmpty("w:numId").attributes["w:val"];
    if (level !== void 0 && numId !== void 0) {
      return numbering.findLevel(numId, level);
    }
    if (styleId != null) {
      var levelByStyleId = numbering.findLevelByParagraphStyleId(styleId);
      if (levelByStyleId != null) {
        return levelByStyleId;
      }
    }
    if (numId !== void 0) {
      return numbering.findLevel(numId, "0");
    }
    return null;
  }
  var supportedImageTypes = {
    "image/png": true,
    "image/gif": true,
    "image/jpeg": true,
    "image/svg+xml": true,
    "image/tiff": true
  };
  var ignoreElements = {
    "office-word:wrap": true,
    "v:shadow": true,
    "v:shapetype": true,
    "w:annotationRef": true,
    "w:bookmarkEnd": true,
    "w:sectPr": true,
    "w:proofErr": true,
    "w:lastRenderedPageBreak": true,
    "w:commentRangeStart": true,
    "w:commentRangeEnd": true,
    "w:del": true,
    "w:footnoteRef": true,
    "w:endnoteRef": true,
    "w:pPr": true,
    "w:rPr": true,
    "w:tblPr": true,
    "w:tblGrid": true,
    "w:trPr": true,
    "w:tcPr": true
  };
  function emptyResultWithMessages(messages) {
    return new ReadResult(null, null, messages);
  }
  function emptyResult() {
    return new ReadResult(null);
  }
  function elementResult(element) {
    return new ReadResult(element);
  }
  function elementResultWithMessages(element, messages) {
    return new ReadResult(element, null, messages);
  }
  function ReadResult(element, extra, messages) {
    this.value = element || [];
    this.extra = extra || [];
    this._result = new Result({
      element: this.value,
      extra
    }, messages);
    this.messages = this._result.messages;
  }
  ReadResult.prototype.toExtra = function() {
    return new ReadResult(null, joinElements(this.extra, this.value), this.messages);
  };
  ReadResult.prototype.insertExtra = function() {
    var extra = this.extra;
    if (extra && extra.length) {
      return new ReadResult(joinElements(this.value, extra), null, this.messages);
    } else {
      return this;
    }
  };
  ReadResult.prototype.map = function(func) {
    var result = this._result.map(function(value) {
      return func(value.element);
    });
    return new ReadResult(result.value, this.extra, result.messages);
  };
  ReadResult.prototype.flatMap = function(func) {
    var result = this._result.flatMap(function(value) {
      return func(value.element)._result;
    });
    return new ReadResult(result.value.element, joinElements(this.extra, result.value.extra), result.messages);
  };
  ReadResult.map = function(first, second, func) {
    return new ReadResult(
      func(first.value, second.value),
      joinElements(first.extra, second.extra),
      first.messages.concat(second.messages)
    );
  };
  function combineResults(results2) {
    var result = Result.combine(_.pluck(results2, "_result"));
    return new ReadResult(
      _.flatten(_.pluck(result.value, "element")),
      _.filter(_.flatten(_.pluck(result.value, "extra")), identity),
      result.messages
    );
  }
  function joinElements(first, second) {
    return _.flatten([first, second]);
  }
  function identity(value) {
    return value;
  }
  return bodyReader;
}
var documentXmlReader = {};
var hasRequiredDocumentXmlReader;
function requireDocumentXmlReader() {
  if (hasRequiredDocumentXmlReader) return documentXmlReader;
  hasRequiredDocumentXmlReader = 1;
  documentXmlReader.DocumentXmlReader = DocumentXmlReader;
  var documents2 = requireDocuments();
  var Result = requireResults().Result;
  function DocumentXmlReader(options) {
    var bodyReader2 = options.bodyReader;
    function convertXmlToDocument(element) {
      var body = element.first("w:body");
      if (body == null) {
        throw new Error("Could not find the body element: are you sure this is a docx file?");
      }
      var result = bodyReader2.readXmlElements(body.children).map(function(children) {
        return new documents2.Document(children, {
          notes: options.notes,
          comments: options.comments
        });
      });
      return new Result(result.value, result.messages);
    }
    return {
      convertXmlToDocument
    };
  }
  return documentXmlReader;
}
var relationshipsReader = {};
var hasRequiredRelationshipsReader;
function requireRelationshipsReader() {
  if (hasRequiredRelationshipsReader) return relationshipsReader;
  hasRequiredRelationshipsReader = 1;
  relationshipsReader.readRelationships = readRelationships;
  relationshipsReader.defaultValue = new Relationships([]);
  relationshipsReader.Relationships = Relationships;
  function readRelationships(element) {
    var relationships = [];
    element.children.forEach(function(child) {
      if (child.name === "relationships:Relationship") {
        var relationship = {
          relationshipId: child.attributes.Id,
          target: child.attributes.Target,
          type: child.attributes.Type
        };
        relationships.push(relationship);
      }
    });
    return new Relationships(relationships);
  }
  function Relationships(relationships) {
    var targetsByRelationshipId = {};
    relationships.forEach(function(relationship) {
      targetsByRelationshipId[relationship.relationshipId] = relationship.target;
    });
    var targetsByType = {};
    relationships.forEach(function(relationship) {
      if (!targetsByType[relationship.type]) {
        targetsByType[relationship.type] = [];
      }
      targetsByType[relationship.type].push(relationship.target);
    });
    return {
      findTargetByRelationshipId: function(relationshipId) {
        return targetsByRelationshipId[relationshipId];
      },
      findTargetsByType: function(type) {
        return targetsByType[type] || [];
      }
    };
  }
  return relationshipsReader;
}
var contentTypesReader = {};
var hasRequiredContentTypesReader;
function requireContentTypesReader() {
  if (hasRequiredContentTypesReader) return contentTypesReader;
  hasRequiredContentTypesReader = 1;
  contentTypesReader.readContentTypesFromXml = readContentTypesFromXml;
  var fallbackContentTypes = {
    "png": "png",
    "gif": "gif",
    "jpeg": "jpeg",
    "jpg": "jpeg",
    "tif": "tiff",
    "tiff": "tiff",
    "bmp": "bmp"
  };
  contentTypesReader.defaultContentTypes = contentTypes({}, {});
  function readContentTypesFromXml(element) {
    var extensionDefaults = {};
    var overrides = {};
    element.children.forEach(function(child) {
      if (child.name === "content-types:Default") {
        extensionDefaults[child.attributes.Extension] = child.attributes.ContentType;
      }
      if (child.name === "content-types:Override") {
        var name = child.attributes.PartName;
        if (name.charAt(0) === "/") {
          name = name.substring(1);
        }
        overrides[name] = child.attributes.ContentType;
      }
    });
    return contentTypes(overrides, extensionDefaults);
  }
  function contentTypes(overrides, extensionDefaults) {
    return {
      findContentType: function(path) {
        var overrideContentType = overrides[path];
        if (overrideContentType) {
          return overrideContentType;
        } else {
          var pathParts = path.split(".");
          var extension = pathParts[pathParts.length - 1];
          if (extensionDefaults.hasOwnProperty(extension)) {
            return extensionDefaults[extension];
          } else {
            var fallback = fallbackContentTypes[extension.toLowerCase()];
            if (fallback) {
              return "image/" + fallback;
            } else {
              return null;
            }
          }
        }
      }
    };
  }
  return contentTypesReader;
}
var numberingXml = {};
var hasRequiredNumberingXml;
function requireNumberingXml() {
  if (hasRequiredNumberingXml) return numberingXml;
  hasRequiredNumberingXml = 1;
  var _ = requireUnderscoreNode();
  numberingXml.readNumberingXml = readNumberingXml;
  numberingXml.Numbering = Numbering;
  numberingXml.defaultNumbering = new Numbering({}, {});
  function Numbering(nums, abstractNums, styles) {
    var allLevels = _.flatten(_.values(abstractNums).map(function(abstractNum) {
      return _.values(abstractNum.levels);
    }));
    var levelsByParagraphStyleId = _.indexBy(
      allLevels.filter(function(level) {
        return level.paragraphStyleId != null;
      }),
      "paragraphStyleId"
    );
    function findLevel(numId, level) {
      var num = nums[numId];
      if (num) {
        var abstractNum = abstractNums[num.abstractNumId];
        if (!abstractNum) {
          return null;
        } else if (abstractNum.numStyleLink == null) {
          return abstractNums[num.abstractNumId].levels[level];
        } else {
          var style = styles.findNumberingStyleById(abstractNum.numStyleLink);
          return findLevel(style.numId, level);
        }
      } else {
        return null;
      }
    }
    function findLevelByParagraphStyleId(styleId) {
      return levelsByParagraphStyleId[styleId] || null;
    }
    return {
      findLevel,
      findLevelByParagraphStyleId
    };
  }
  function readNumberingXml(root, options) {
    if (!options || !options.styles) {
      throw new Error("styles is missing");
    }
    var abstractNums = readAbstractNums(root);
    var nums = readNums(root);
    return new Numbering(nums, abstractNums, options.styles);
  }
  function readAbstractNums(root) {
    var abstractNums = {};
    root.getElementsByTagName("w:abstractNum").forEach(function(element) {
      var id = element.attributes["w:abstractNumId"];
      abstractNums[id] = readAbstractNum(element);
    });
    return abstractNums;
  }
  function readAbstractNum(element) {
    var levels = {};
    var levelWithoutIndex = null;
    element.getElementsByTagName("w:lvl").forEach(function(levelElement) {
      var levelIndex = levelElement.attributes["w:ilvl"];
      var numFmt = levelElement.firstOrEmpty("w:numFmt").attributes["w:val"];
      var isOrdered = numFmt !== "bullet";
      var paragraphStyleId = levelElement.firstOrEmpty("w:pStyle").attributes["w:val"];
      if (levelIndex === void 0) {
        levelWithoutIndex = {
          isOrdered,
          level: "0",
          paragraphStyleId
        };
      } else {
        levels[levelIndex] = {
          isOrdered,
          level: levelIndex,
          paragraphStyleId
        };
      }
    });
    if (levelWithoutIndex !== null && levels[levelWithoutIndex.level] === void 0) {
      levels[levelWithoutIndex.level] = levelWithoutIndex;
    }
    var numStyleLink = element.firstOrEmpty("w:numStyleLink").attributes["w:val"];
    return { levels, numStyleLink };
  }
  function readNums(root) {
    var nums = {};
    root.getElementsByTagName("w:num").forEach(function(element) {
      var numId = element.attributes["w:numId"];
      var abstractNumId = element.first("w:abstractNumId").attributes["w:val"];
      nums[numId] = { abstractNumId };
    });
    return nums;
  }
  return numberingXml;
}
var stylesReader = {};
var hasRequiredStylesReader;
function requireStylesReader() {
  if (hasRequiredStylesReader) return stylesReader;
  hasRequiredStylesReader = 1;
  stylesReader.readStylesXml = readStylesXml;
  stylesReader.Styles = Styles;
  stylesReader.defaultStyles = new Styles({}, {});
  function Styles(paragraphStyles, characterStyles, tableStyles, numberingStyles) {
    return {
      findParagraphStyleById: function(styleId) {
        return paragraphStyles[styleId];
      },
      findCharacterStyleById: function(styleId) {
        return characterStyles[styleId];
      },
      findTableStyleById: function(styleId) {
        return tableStyles[styleId];
      },
      findNumberingStyleById: function(styleId) {
        return numberingStyles[styleId];
      }
    };
  }
  Styles.EMPTY = new Styles({}, {}, {}, {});
  function readStylesXml(root) {
    var paragraphStyles = {};
    var characterStyles = {};
    var tableStyles = {};
    var numberingStyles = {};
    var styles = {
      "paragraph": paragraphStyles,
      "character": characterStyles,
      "table": tableStyles,
      "numbering": numberingStyles
    };
    root.getElementsByTagName("w:style").forEach(function(styleElement) {
      var style = readStyleElement(styleElement);
      var styleSet = styles[style.type];
      if (styleSet && styleSet[style.styleId] === void 0) {
        styleSet[style.styleId] = style;
      }
    });
    return new Styles(paragraphStyles, characterStyles, tableStyles, numberingStyles);
  }
  function readStyleElement(styleElement) {
    var type = styleElement.attributes["w:type"];
    if (type === "numbering") {
      return readNumberingStyleElement(type, styleElement);
    } else {
      var styleId = readStyleId(styleElement);
      var name = styleName(styleElement);
      return { type, styleId, name };
    }
  }
  function styleName(styleElement) {
    var nameElement = styleElement.first("w:name");
    return nameElement ? nameElement.attributes["w:val"] : null;
  }
  function readNumberingStyleElement(type, styleElement) {
    var styleId = readStyleId(styleElement);
    var numId = styleElement.firstOrEmpty("w:pPr").firstOrEmpty("w:numPr").firstOrEmpty("w:numId").attributes["w:val"];
    return { type, numId, styleId };
  }
  function readStyleId(styleElement) {
    return styleElement.attributes["w:styleId"];
  }
  return stylesReader;
}
var notesReader = {};
var hasRequiredNotesReader;
function requireNotesReader() {
  if (hasRequiredNotesReader) return notesReader;
  hasRequiredNotesReader = 1;
  var documents2 = requireDocuments();
  var Result = requireResults().Result;
  notesReader.createFootnotesReader = createReader.bind(notesReader, "footnote");
  notesReader.createEndnotesReader = createReader.bind(notesReader, "endnote");
  function createReader(noteType, bodyReader2) {
    function readNotesXml(element) {
      return Result.combine(element.getElementsByTagName("w:" + noteType).filter(isFootnoteElement).map(readFootnoteElement));
    }
    function isFootnoteElement(element) {
      var type = element.attributes["w:type"];
      return type !== "continuationSeparator" && type !== "separator";
    }
    function readFootnoteElement(footnoteElement) {
      var id = footnoteElement.attributes["w:id"];
      return bodyReader2.readXmlElements(footnoteElement.children).map(function(body) {
        return documents2.Note({ noteType, noteId: id, body });
      });
    }
    return readNotesXml;
  }
  return notesReader;
}
var commentsReader = {};
var hasRequiredCommentsReader;
function requireCommentsReader() {
  if (hasRequiredCommentsReader) return commentsReader;
  hasRequiredCommentsReader = 1;
  var documents2 = requireDocuments();
  var Result = requireResults().Result;
  function createCommentsReader(bodyReader2) {
    function readCommentsXml(element) {
      return Result.combine(element.getElementsByTagName("w:comment").map(readCommentElement));
    }
    function readCommentElement(element) {
      var id = element.attributes["w:id"];
      function readOptionalAttribute(name) {
        return (element.attributes[name] || "").trim() || null;
      }
      return bodyReader2.readXmlElements(element.children).map(function(body) {
        return documents2.comment({
          commentId: id,
          body,
          authorName: readOptionalAttribute("w:author"),
          authorInitials: readOptionalAttribute("w:initials")
        });
      });
    }
    return readCommentsXml;
  }
  commentsReader.createCommentsReader = createCommentsReader;
  return commentsReader;
}
var files = {};
var hasRequiredFiles;
function requireFiles() {
  if (hasRequiredFiles) return files;
  hasRequiredFiles = 1;
  var fs = require$$0;
  var url = require$$1;
  var os$1 = os;
  var dirname = require$$3.dirname;
  var resolvePath = require$$3.resolve;
  var isAbsolutePath = requirePathIsAbsolute();
  var promises2 = requirePromises();
  files.Files = Files;
  files.uriToPath = uriToPath;
  function Files(options) {
    options = options || {};
    if (!options.externalFileAccess) {
      return {
        read: function(uri) {
          return promises2.reject(new Error("could not read external image '" + uri + "', external file access is disabled"));
        }
      };
    }
    var base = options.relativeToFile ? dirname(options.relativeToFile) : null;
    function read(uri, encoding) {
      return resolveUri(uri).then(function(path) {
        return readFile(path, encoding).caught(function(error) {
          var message = "could not open external image: '" + uri + "' (document directory: '" + base + "')\n" + error.message;
          return promises2.reject(new Error(message));
        });
      });
    }
    function resolveUri(uri) {
      var path = uriToPath(uri);
      if (isAbsolutePath(path)) {
        return promises2.resolve(path);
      } else if (base) {
        return promises2.resolve(resolvePath(base, path));
      } else {
        return promises2.reject(new Error("could not find external image '" + uri + "', path of input document is unknown"));
      }
    }
    return {
      read
    };
  }
  var readFile = promises2.promisify(fs.readFile.bind(fs));
  function uriToPath(uriString, platform) {
    if (!platform) {
      platform = os$1.platform();
    }
    var uri = url.parse(uriString);
    if (isLocalFileUri(uri) || isRelativeUri(uri)) {
      var path = decodeURIComponent(uri.path);
      if (platform === "win32" && /^\/[a-z]:/i.test(path)) {
        return path.slice(1);
      } else {
        return path;
      }
    } else {
      throw new Error("Could not convert URI to path: " + uriString);
    }
  }
  function isLocalFileUri(uri) {
    return uri.protocol === "file:" && (!uri.host || uri.host === "localhost");
  }
  function isRelativeUri(uri) {
    return !uri.protocol && !uri.host;
  }
  return files;
}
var hasRequiredDocxReader;
function requireDocxReader() {
  if (hasRequiredDocxReader) return docxReader;
  hasRequiredDocxReader = 1;
  docxReader.read = read;
  docxReader._findPartPaths = findPartPaths;
  var promises2 = requirePromises();
  var documents2 = requireDocuments();
  var Result = requireResults().Result;
  var zipfile2 = requireZipfile();
  var readXmlFromZipFile = requireOfficeXmlReader().readXmlFromZipFile;
  var createBodyReader = requireBodyReader().createBodyReader;
  var DocumentXmlReader = requireDocumentXmlReader().DocumentXmlReader;
  var relationshipsReader2 = requireRelationshipsReader();
  var contentTypesReader2 = requireContentTypesReader();
  var numberingXml2 = requireNumberingXml();
  var stylesReader2 = requireStylesReader();
  var notesReader2 = requireNotesReader();
  var commentsReader2 = requireCommentsReader();
  var Files = requireFiles().Files;
  function read(docxFile, input, options) {
    input = input || {};
    options = options || {};
    var files2 = new Files({
      externalFileAccess: options.externalFileAccess,
      relativeToFile: input.path
    });
    return promises2.props({
      contentTypes: readContentTypesFromZipFile(docxFile),
      partPaths: findPartPaths(docxFile),
      docxFile,
      files: files2
    }).also(function(result) {
      return {
        styles: readStylesFromZipFile(docxFile, result.partPaths.styles)
      };
    }).also(function(result) {
      return {
        numbering: readNumberingFromZipFile(docxFile, result.partPaths.numbering, result.styles)
      };
    }).also(function(result) {
      return {
        footnotes: readXmlFileWithBody(result.partPaths.footnotes, result, function(bodyReader2, xml2) {
          if (xml2) {
            return notesReader2.createFootnotesReader(bodyReader2)(xml2);
          } else {
            return new Result([]);
          }
        }),
        endnotes: readXmlFileWithBody(result.partPaths.endnotes, result, function(bodyReader2, xml2) {
          if (xml2) {
            return notesReader2.createEndnotesReader(bodyReader2)(xml2);
          } else {
            return new Result([]);
          }
        }),
        comments: readXmlFileWithBody(result.partPaths.comments, result, function(bodyReader2, xml2) {
          if (xml2) {
            return commentsReader2.createCommentsReader(bodyReader2)(xml2);
          } else {
            return new Result([]);
          }
        })
      };
    }).also(function(result) {
      return {
        notes: result.footnotes.flatMap(function(footnotes) {
          return result.endnotes.map(function(endnotes) {
            return new documents2.Notes(footnotes.concat(endnotes));
          });
        })
      };
    }).then(function(result) {
      return readXmlFileWithBody(result.partPaths.mainDocument, result, function(bodyReader2, xml2) {
        return result.notes.flatMap(function(notes) {
          return result.comments.flatMap(function(comments) {
            var reader2 = new DocumentXmlReader({
              bodyReader: bodyReader2,
              notes,
              comments
            });
            return reader2.convertXmlToDocument(xml2);
          });
        });
      });
    });
  }
  function findPartPaths(docxFile) {
    return readPackageRelationships(docxFile).then(function(packageRelationships) {
      var mainDocumentPath = findPartPath({
        docxFile,
        relationships: packageRelationships,
        relationshipType: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
        basePath: "",
        fallbackPath: "word/document.xml"
      });
      if (!docxFile.exists(mainDocumentPath)) {
        throw new Error("Could not find main document part. Are you sure this is a valid .docx file?");
      }
      return xmlFileReader({
        filename: relationshipsFilename(mainDocumentPath),
        readElement: relationshipsReader2.readRelationships,
        defaultValue: relationshipsReader2.defaultValue
      })(docxFile).then(function(documentRelationships) {
        function findPartRelatedToMainDocument(name) {
          return findPartPath({
            docxFile,
            relationships: documentRelationships,
            relationshipType: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/" + name,
            basePath: zipfile2.splitPath(mainDocumentPath).dirname,
            fallbackPath: "word/" + name + ".xml"
          });
        }
        return {
          mainDocument: mainDocumentPath,
          comments: findPartRelatedToMainDocument("comments"),
          endnotes: findPartRelatedToMainDocument("endnotes"),
          footnotes: findPartRelatedToMainDocument("footnotes"),
          numbering: findPartRelatedToMainDocument("numbering"),
          styles: findPartRelatedToMainDocument("styles")
        };
      });
    });
  }
  function findPartPath(options) {
    var docxFile = options.docxFile;
    var relationships = options.relationships;
    var relationshipType = options.relationshipType;
    var basePath = options.basePath;
    var fallbackPath = options.fallbackPath;
    var targets = relationships.findTargetsByType(relationshipType);
    var normalisedTargets = targets.map(function(target) {
      return stripPrefix(zipfile2.joinPath(basePath, target), "/");
    });
    var validTargets = normalisedTargets.filter(function(target) {
      return docxFile.exists(target);
    });
    if (validTargets.length === 0) {
      return fallbackPath;
    } else {
      return validTargets[0];
    }
  }
  function stripPrefix(value, prefix) {
    if (value.substring(0, prefix.length) === prefix) {
      return value.substring(prefix.length);
    } else {
      return value;
    }
  }
  function xmlFileReader(options) {
    return function(zipFile) {
      return readXmlFromZipFile(zipFile, options.filename).then(function(element) {
        return element ? options.readElement(element) : options.defaultValue;
      });
    };
  }
  function readXmlFileWithBody(filename, options, func) {
    var readRelationshipsFromZipFile = xmlFileReader({
      filename: relationshipsFilename(filename),
      readElement: relationshipsReader2.readRelationships,
      defaultValue: relationshipsReader2.defaultValue
    });
    return readRelationshipsFromZipFile(options.docxFile).then(function(relationships) {
      var bodyReader2 = new createBodyReader({
        relationships,
        contentTypes: options.contentTypes,
        docxFile: options.docxFile,
        numbering: options.numbering,
        styles: options.styles,
        files: options.files
      });
      return readXmlFromZipFile(options.docxFile, filename).then(function(xml2) {
        return func(bodyReader2, xml2);
      });
    });
  }
  function relationshipsFilename(filename) {
    var split = zipfile2.splitPath(filename);
    return zipfile2.joinPath(split.dirname, "_rels", split.basename + ".rels");
  }
  var readContentTypesFromZipFile = xmlFileReader({
    filename: "[Content_Types].xml",
    readElement: contentTypesReader2.readContentTypesFromXml,
    defaultValue: contentTypesReader2.defaultContentTypes
  });
  function readNumberingFromZipFile(zipFile, path, styles) {
    return xmlFileReader({
      filename: path,
      readElement: function(element) {
        return numberingXml2.readNumberingXml(element, { styles });
      },
      defaultValue: numberingXml2.defaultNumbering
    })(zipFile);
  }
  function readStylesFromZipFile(zipFile, path) {
    return xmlFileReader({
      filename: path,
      readElement: stylesReader2.readStylesXml,
      defaultValue: stylesReader2.defaultStyles
    })(zipFile);
  }
  var readPackageRelationships = xmlFileReader({
    filename: "_rels/.rels",
    readElement: relationshipsReader2.readRelationships,
    defaultValue: relationshipsReader2.defaultValue
  });
  return docxReader;
}
var styleMap = {};
var hasRequiredStyleMap;
function requireStyleMap() {
  if (hasRequiredStyleMap) return styleMap;
  hasRequiredStyleMap = 1;
  var _ = requireUnderscoreNode();
  var promises2 = requirePromises();
  var xml2 = requireXml();
  styleMap.writeStyleMap = writeStyleMap;
  styleMap.readStyleMap = readStyleMap;
  var schema = "http://schemas.zwobble.org/mammoth/style-map";
  var styleMapPath = "mammoth/style-map";
  var styleMapAbsolutePath = "/" + styleMapPath;
  function writeStyleMap(docxFile, styleMap2) {
    docxFile.write(styleMapPath, styleMap2);
    return updateRelationships(docxFile).then(function() {
      return updateContentTypes(docxFile);
    });
  }
  function updateRelationships(docxFile) {
    var path = "word/_rels/document.xml.rels";
    var relationshipsUri = "http://schemas.openxmlformats.org/package/2006/relationships";
    var relationshipElementName = "{" + relationshipsUri + "}Relationship";
    return docxFile.read(path, "utf8").then(xml2.readString).then(function(relationshipsContainer) {
      var relationships = relationshipsContainer.children;
      addOrUpdateElement(relationships, relationshipElementName, "Id", {
        "Id": "rMammothStyleMap",
        "Type": schema,
        "Target": styleMapAbsolutePath
      });
      var namespaces = { "": relationshipsUri };
      return docxFile.write(path, xml2.writeString(relationshipsContainer, namespaces));
    });
  }
  function updateContentTypes(docxFile) {
    var path = "[Content_Types].xml";
    var contentTypesUri = "http://schemas.openxmlformats.org/package/2006/content-types";
    var overrideName = "{" + contentTypesUri + "}Override";
    return docxFile.read(path, "utf8").then(xml2.readString).then(function(typesElement) {
      var children = typesElement.children;
      addOrUpdateElement(children, overrideName, "PartName", {
        "PartName": styleMapAbsolutePath,
        "ContentType": "text/prs.mammoth.style-map"
      });
      var namespaces = { "": contentTypesUri };
      return docxFile.write(path, xml2.writeString(typesElement, namespaces));
    });
  }
  function addOrUpdateElement(elements, name, identifyingAttribute, attributes) {
    var existingElement = _.find(elements, function(element) {
      return element.name === name && element.attributes[identifyingAttribute] === attributes[identifyingAttribute];
    });
    if (existingElement) {
      existingElement.attributes = attributes;
    } else {
      elements.push(xml2.element(name, attributes));
    }
  }
  function readStyleMap(docxFile) {
    if (docxFile.exists(styleMapPath)) {
      return docxFile.read(styleMapPath, "utf8");
    } else {
      return promises2.resolve(null);
    }
  }
  return styleMap;
}
var documentToHtml = {};
var htmlPaths = {};
var html = {};
var ast = {};
var hasRequiredAst;
function requireAst() {
  if (hasRequiredAst) return ast;
  hasRequiredAst = 1;
  var htmlPaths2 = requireHtmlPaths();
  function nonFreshElement(tagName, attributes, children) {
    return elementWithTag(
      htmlPaths2.element(tagName, attributes, { fresh: false }),
      children
    );
  }
  function freshElement(tagName, attributes, children) {
    var tag = htmlPaths2.element(tagName, attributes, { fresh: true });
    return elementWithTag(tag, children);
  }
  function elementWithTag(tag, children) {
    return {
      type: "element",
      tag,
      children: children || []
    };
  }
  function text(value) {
    return {
      type: "text",
      value
    };
  }
  var forceWrite = {
    type: "forceWrite"
  };
  ast.freshElement = freshElement;
  ast.nonFreshElement = nonFreshElement;
  ast.elementWithTag = elementWithTag;
  ast.text = text;
  ast.forceWrite = forceWrite;
  var voidTagNames = {
    "br": true,
    "hr": true,
    "img": true,
    "input": true
  };
  function isVoidElement(node) {
    return node.children.length === 0 && voidTagNames[node.tag.tagName];
  }
  ast.isVoidElement = isVoidElement;
  return ast;
}
var simplify_1;
var hasRequiredSimplify;
function requireSimplify() {
  if (hasRequiredSimplify) return simplify_1;
  hasRequiredSimplify = 1;
  var _ = requireUnderscoreNode();
  var ast2 = requireAst();
  function simplify(nodes2) {
    return collapse(removeEmpty(nodes2));
  }
  function collapse(nodes2) {
    var children = [];
    nodes2.map(collapseNode).forEach(function(child) {
      appendChild(children, child);
    });
    return children;
  }
  function collapseNode(node) {
    return collapsers[node.type](node);
  }
  var collapsers = {
    element: collapseElement,
    text: identity,
    forceWrite: identity
  };
  function collapseElement(node) {
    return ast2.elementWithTag(node.tag, collapse(node.children));
  }
  function identity(value) {
    return value;
  }
  function appendChild(children, child) {
    var lastChild = children[children.length - 1];
    if (child.type === "element" && !child.tag.fresh && lastChild && lastChild.type === "element" && child.tag.matchesElement(lastChild.tag)) {
      if (child.tag.separator) {
        appendChild(lastChild.children, ast2.text(child.tag.separator));
      }
      child.children.forEach(function(grandChild) {
        appendChild(lastChild.children, grandChild);
      });
    } else {
      children.push(child);
    }
  }
  function removeEmpty(nodes2) {
    return flatMap(nodes2, function(node) {
      return emptiers[node.type](node);
    });
  }
  function flatMap(values, func) {
    return _.flatten(_.map(values, func), true);
  }
  var emptiers = {
    element: elementEmptier,
    text: textEmptier,
    forceWrite: neverEmpty
  };
  function neverEmpty(node) {
    return [node];
  }
  function elementEmptier(element) {
    var children = removeEmpty(element.children);
    if (children.length === 0 && !ast2.isVoidElement(element)) {
      return [];
    } else {
      return [ast2.elementWithTag(element.tag, children)];
    }
  }
  function textEmptier(node) {
    if (node.value.length === 0) {
      return [];
    } else {
      return [node];
    }
  }
  simplify_1 = simplify;
  return simplify_1;
}
var hasRequiredHtml;
function requireHtml() {
  if (hasRequiredHtml) return html;
  hasRequiredHtml = 1;
  var ast2 = requireAst();
  html.freshElement = ast2.freshElement;
  html.nonFreshElement = ast2.nonFreshElement;
  html.elementWithTag = ast2.elementWithTag;
  html.text = ast2.text;
  html.forceWrite = ast2.forceWrite;
  html.simplify = requireSimplify();
  function write(writer2, nodes2) {
    nodes2.forEach(function(node) {
      writeNode(writer2, node);
    });
  }
  function writeNode(writer2, node) {
    toStrings[node.type](writer2, node);
  }
  var toStrings = {
    element: generateElementString,
    text: generateTextString,
    forceWrite: function() {
    }
  };
  function generateElementString(writer2, node) {
    if (ast2.isVoidElement(node)) {
      writer2.selfClosing(node.tag.tagName, node.tag.attributes);
    } else {
      writer2.open(node.tag.tagName, node.tag.attributes);
      write(writer2, node.children);
      writer2.close(node.tag.tagName);
    }
  }
  function generateTextString(writer2, node) {
    writer2.text(node.value);
  }
  html.write = write;
  return html;
}
var hasRequiredHtmlPaths;
function requireHtmlPaths() {
  if (hasRequiredHtmlPaths) return htmlPaths;
  hasRequiredHtmlPaths = 1;
  var _ = requireUnderscoreNode();
  var html2 = requireHtml();
  htmlPaths.topLevelElement = topLevelElement;
  htmlPaths.elements = elements;
  htmlPaths.element = element;
  function topLevelElement(tagName, attributes) {
    return elements([element(tagName, attributes, { fresh: true })]);
  }
  function elements(elementStyles) {
    return new HtmlPath(elementStyles.map(function(elementStyle) {
      if (_.isString(elementStyle)) {
        return element(elementStyle);
      } else {
        return elementStyle;
      }
    }));
  }
  function HtmlPath(elements2) {
    this._elements = elements2;
  }
  HtmlPath.prototype.wrap = function wrap(children) {
    var result = children();
    for (var index2 = this._elements.length - 1; index2 >= 0; index2--) {
      result = this._elements[index2].wrapNodes(result);
    }
    return result;
  };
  function element(tagName, attributes, options) {
    options = options || {};
    return new Element(tagName, attributes, options);
  }
  function Element(tagName, attributes, options) {
    var tagNames = {};
    if (_.isArray(tagName)) {
      tagName.forEach(function(tagName2) {
        tagNames[tagName2] = true;
      });
      tagName = tagName[0];
    } else {
      tagNames[tagName] = true;
    }
    this.tagName = tagName;
    this.tagNames = tagNames;
    this.attributes = attributes || {};
    this.fresh = options.fresh;
    this.separator = options.separator;
  }
  Element.prototype.matchesElement = function(element2) {
    return this.tagNames[element2.tagName] && _.isEqual(this.attributes || {}, element2.attributes || {});
  };
  Element.prototype.wrap = function wrap(generateNodes) {
    return this.wrapNodes(generateNodes());
  };
  Element.prototype.wrapNodes = function wrapNodes(nodes2) {
    return [html2.elementWithTag(this, nodes2)];
  };
  htmlPaths.empty = elements([]);
  htmlPaths.ignore = {
    wrap: function() {
      return [];
    }
  };
  return htmlPaths;
}
var images = {};
var hasRequiredImages;
function requireImages() {
  if (hasRequiredImages) return images;
  hasRequiredImages = 1;
  (function(exports) {
    var _ = requireUnderscoreNode();
    var promises2 = requirePromises();
    var Html = requireHtml();
    exports.imgElement = imgElement;
    function imgElement(func) {
      return function(element, messages) {
        return promises2.when(func(element)).then(function(result) {
          var attributes = {};
          if (element.altText) {
            attributes.alt = element.altText;
          }
          _.extend(attributes, result);
          return [Html.freshElement("img", attributes)];
        });
      };
    }
    exports.inline = exports.imgElement;
    exports.dataUri = imgElement(function(element) {
      return element.readAsBase64String().then(function(imageBuffer) {
        return {
          src: "data:" + element.contentType + ";base64," + imageBuffer
        };
      });
    });
  })(images);
  return images;
}
var writers = {};
var htmlWriter = {};
var hasRequiredHtmlWriter;
function requireHtmlWriter() {
  if (hasRequiredHtmlWriter) return htmlWriter;
  hasRequiredHtmlWriter = 1;
  var _ = requireUnderscoreNode();
  htmlWriter.writer = writer2;
  function writer2(options) {
    options = options || {};
    if (options.prettyPrint) {
      return prettyWriter();
    } else {
      return simpleWriter();
    }
  }
  var indentedElements = {
    div: true,
    p: true,
    ul: true,
    li: true
  };
  function prettyWriter() {
    var indentationLevel = 0;
    var indentation = "  ";
    var stack = [];
    var start = true;
    var inText = false;
    var writer3 = simpleWriter();
    function open(tagName, attributes) {
      if (indentedElements[tagName]) {
        indent();
      }
      stack.push(tagName);
      writer3.open(tagName, attributes);
      if (indentedElements[tagName]) {
        indentationLevel++;
      }
      start = false;
    }
    function close(tagName) {
      if (indentedElements[tagName]) {
        indentationLevel--;
        indent();
      }
      stack.pop();
      writer3.close(tagName);
    }
    function text(value) {
      startText();
      var text2 = isInPre() ? value : value.replace("\n", "\n" + indentation);
      writer3.text(text2);
    }
    function selfClosing(tagName, attributes) {
      indent();
      writer3.selfClosing(tagName, attributes);
    }
    function insideIndentedElement() {
      return stack.length === 0 || indentedElements[stack[stack.length - 1]];
    }
    function startText() {
      if (!inText) {
        indent();
        inText = true;
      }
    }
    function indent() {
      inText = false;
      if (!start && insideIndentedElement() && !isInPre()) {
        writer3._append("\n");
        for (var i = 0; i < indentationLevel; i++) {
          writer3._append(indentation);
        }
      }
    }
    function isInPre() {
      return _.some(stack, function(tagName) {
        return tagName === "pre";
      });
    }
    return {
      asString: writer3.asString,
      open,
      close,
      text,
      selfClosing
    };
  }
  function simpleWriter() {
    var fragments = [];
    function open(tagName, attributes) {
      var attributeString = generateAttributeString(attributes);
      fragments.push("<" + tagName + attributeString + ">");
    }
    function close(tagName) {
      fragments.push("</" + tagName + ">");
    }
    function selfClosing(tagName, attributes) {
      var attributeString = generateAttributeString(attributes);
      fragments.push("<" + tagName + attributeString + " />");
    }
    function generateAttributeString(attributes) {
      return _.map(attributes, function(value, key) {
        return " " + key + '="' + escapeHtmlAttribute(value) + '"';
      }).join("");
    }
    function text(value) {
      fragments.push(escapeHtmlText(value));
    }
    function append(html2) {
      fragments.push(html2);
    }
    function asString() {
      return fragments.join("");
    }
    return {
      asString,
      open,
      close,
      text,
      selfClosing,
      _append: append
    };
  }
  function escapeHtmlText(value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function escapeHtmlAttribute(value) {
    return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  return htmlWriter;
}
var markdownWriter = {};
var hasRequiredMarkdownWriter;
function requireMarkdownWriter() {
  if (hasRequiredMarkdownWriter) return markdownWriter;
  hasRequiredMarkdownWriter = 1;
  var _ = requireUnderscoreNode();
  function symmetricMarkdownElement(end) {
    return markdownElement(end, end);
  }
  function markdownElement(start, end) {
    return function() {
      return { start, end };
    };
  }
  function markdownLink(attributes) {
    var href = attributes.href || "";
    if (href) {
      return {
        start: "[",
        end: "](" + href + ")",
        anchorPosition: "before"
      };
    } else {
      return {};
    }
  }
  function markdownImage(attributes) {
    var src = attributes.src || "";
    var altText = attributes.alt || "";
    if (src || altText) {
      return { start: "![" + altText + "](" + src + ")" };
    } else {
      return {};
    }
  }
  function markdownList(options) {
    return function(attributes, list) {
      return {
        start: list ? "\n" : "",
        end: list ? "" : "\n",
        list: {
          isOrdered: options.isOrdered,
          indent: list ? list.indent + 1 : 0,
          count: 0
        }
      };
    };
  }
  function markdownListItem(attributes, list, listItem) {
    list = list || { indent: 0, isOrdered: false, count: 0 };
    list.count++;
    listItem.hasClosed = false;
    var bullet = list.isOrdered ? list.count + "." : "-";
    var start = repeatString("	", list.indent) + bullet + " ";
    return {
      start,
      end: function() {
        if (!listItem.hasClosed) {
          listItem.hasClosed = true;
          return "\n";
        }
      }
    };
  }
  var htmlToMarkdown = {
    "p": markdownElement("", "\n\n"),
    "br": markdownElement("", "  \n"),
    "ul": markdownList({ isOrdered: false }),
    "ol": markdownList({ isOrdered: true }),
    "li": markdownListItem,
    "strong": symmetricMarkdownElement("__"),
    "em": symmetricMarkdownElement("*"),
    "a": markdownLink,
    "img": markdownImage
  };
  (function() {
    for (var i = 1; i <= 6; i++) {
      htmlToMarkdown["h" + i] = markdownElement(repeatString("#", i) + " ", "\n\n");
    }
  })();
  function repeatString(value, count) {
    return new Array(count + 1).join(value);
  }
  function markdownWriter$1() {
    var fragments = [];
    var elementStack = [];
    var list = null;
    var listItem = {};
    function open(tagName, attributes) {
      attributes = attributes || {};
      var createElement = htmlToMarkdown[tagName] || function() {
        return {};
      };
      var element = createElement(attributes, list, listItem);
      elementStack.push({ end: element.end, list });
      if (element.list) {
        list = element.list;
      }
      var anchorBeforeStart = element.anchorPosition === "before";
      if (anchorBeforeStart) {
        writeAnchor(attributes);
      }
      fragments.push(element.start || "");
      if (!anchorBeforeStart) {
        writeAnchor(attributes);
      }
    }
    function writeAnchor(attributes) {
      if (attributes.id) {
        fragments.push('<a id="' + attributes.id + '"></a>');
      }
    }
    function close(tagName) {
      var element = elementStack.pop();
      list = element.list;
      var end = _.isFunction(element.end) ? element.end() : element.end;
      fragments.push(end || "");
    }
    function selfClosing(tagName, attributes) {
      open(tagName, attributes);
      close();
    }
    function text(value) {
      fragments.push(escapeMarkdown(value));
    }
    function asString() {
      return fragments.join("");
    }
    return {
      asString,
      open,
      close,
      text,
      selfClosing
    };
  }
  markdownWriter.writer = markdownWriter$1;
  function escapeMarkdown(value) {
    return value.replace(/\\/g, "\\\\").replace(/([\`\*_\{\}\[\]\(\)\#\+\-\.\!])/g, "\\$1");
  }
  return markdownWriter;
}
var hasRequiredWriters;
function requireWriters() {
  if (hasRequiredWriters) return writers;
  hasRequiredWriters = 1;
  var htmlWriter2 = requireHtmlWriter();
  var markdownWriter2 = requireMarkdownWriter();
  writers.writer = writer2;
  function writer2(options) {
    options = options || {};
    if (options.outputFormat === "markdown") {
      return markdownWriter2.writer();
    } else {
      return htmlWriter2.writer(options);
    }
  }
  return writers;
}
var hasRequiredDocumentToHtml;
function requireDocumentToHtml() {
  if (hasRequiredDocumentToHtml) return documentToHtml;
  hasRequiredDocumentToHtml = 1;
  var _ = requireUnderscoreNode();
  var promises2 = requirePromises();
  var documents2 = requireDocuments();
  var htmlPaths2 = requireHtmlPaths();
  var results2 = requireResults();
  var images2 = requireImages();
  var Html = requireHtml();
  var writers2 = requireWriters();
  documentToHtml.DocumentConverter = DocumentConverter;
  function DocumentConverter(options) {
    return {
      convertToHtml: function(element) {
        var comments = _.indexBy(
          element.type === documents2.types.document ? element.comments : [],
          "commentId"
        );
        var conversion = new DocumentConversion(options, comments);
        return conversion.convertToHtml(element);
      }
    };
  }
  function DocumentConversion(options, comments) {
    var noteNumber = 1;
    var noteReferences = [];
    var referencedComments = [];
    options = _.extend({ ignoreEmptyParagraphs: true }, options);
    var idPrefix = options.idPrefix === void 0 ? "" : options.idPrefix;
    var ignoreEmptyParagraphs = options.ignoreEmptyParagraphs;
    var defaultParagraphStyle = htmlPaths2.topLevelElement("p");
    var styleMap2 = options.styleMap || [];
    function convertToHtml(document) {
      var messages = [];
      var html2 = elementToHtml(document, messages, {});
      var deferredNodes = [];
      walkHtml(html2, function(node) {
        if (node.type === "deferred") {
          deferredNodes.push(node);
        }
      });
      var deferredValues = {};
      return promises2.mapSeries(deferredNodes, function(deferred) {
        return deferred.value().then(function(value) {
          deferredValues[deferred.id] = value;
        });
      }).then(function() {
        function replaceDeferred(nodes2) {
          return flatMap(nodes2, function(node) {
            if (node.type === "deferred") {
              return deferredValues[node.id];
            } else if (node.children) {
              return [
                _.extend({}, node, {
                  children: replaceDeferred(node.children)
                })
              ];
            } else {
              return [node];
            }
          });
        }
        var writer2 = writers2.writer({
          prettyPrint: options.prettyPrint,
          outputFormat: options.outputFormat
        });
        Html.write(writer2, Html.simplify(replaceDeferred(html2)));
        return new results2.Result(writer2.asString(), messages);
      });
    }
    function convertElements(elements, messages, options2) {
      return flatMap(elements, function(element) {
        return elementToHtml(element, messages, options2);
      });
    }
    function elementToHtml(element, messages, options2) {
      if (!options2) {
        throw new Error("options not set");
      }
      var handler = elementConverters[element.type];
      if (handler) {
        return handler(element, messages, options2);
      } else {
        return [];
      }
    }
    function convertParagraph(element, messages, options2) {
      return htmlPathForParagraph(element, messages).wrap(function() {
        var content = convertElements(element.children, messages, options2);
        if (ignoreEmptyParagraphs) {
          return content;
        } else {
          return [Html.forceWrite].concat(content);
        }
      });
    }
    function htmlPathForParagraph(element, messages) {
      var style = findStyle(element);
      if (style) {
        return style.to;
      } else {
        if (element.styleId) {
          messages.push(unrecognisedStyleWarning("paragraph", element));
        }
        return defaultParagraphStyle;
      }
    }
    function convertRun(run, messages, options2) {
      var nodes2 = function() {
        return convertElements(run.children, messages, options2);
      };
      var paths = [];
      if (run.highlight !== null) {
        var path = findHtmlPath({ type: "highlight", color: run.highlight });
        if (path) {
          paths.push(path);
        }
      }
      if (run.isSmallCaps) {
        paths.push(findHtmlPathForRunProperty("smallCaps"));
      }
      if (run.isAllCaps) {
        paths.push(findHtmlPathForRunProperty("allCaps"));
      }
      if (run.isStrikethrough) {
        paths.push(findHtmlPathForRunProperty("strikethrough", "s"));
      }
      if (run.isUnderline) {
        paths.push(findHtmlPathForRunProperty("underline"));
      }
      if (run.verticalAlignment === documents2.verticalAlignment.subscript) {
        paths.push(htmlPaths2.element("sub", {}, { fresh: false }));
      }
      if (run.verticalAlignment === documents2.verticalAlignment.superscript) {
        paths.push(htmlPaths2.element("sup", {}, { fresh: false }));
      }
      if (run.isItalic) {
        paths.push(findHtmlPathForRunProperty("italic", "em"));
      }
      if (run.isBold) {
        paths.push(findHtmlPathForRunProperty("bold", "strong"));
      }
      var stylePath = htmlPaths2.empty;
      var style = findStyle(run);
      if (style) {
        stylePath = style.to;
      } else if (run.styleId) {
        messages.push(unrecognisedStyleWarning("run", run));
      }
      paths.push(stylePath);
      paths.forEach(function(path2) {
        nodes2 = path2.wrap.bind(path2, nodes2);
      });
      return nodes2();
    }
    function findHtmlPathForRunProperty(elementType, defaultTagName) {
      var path = findHtmlPath({ type: elementType });
      if (path) {
        return path;
      } else if (defaultTagName) {
        return htmlPaths2.element(defaultTagName, {}, { fresh: false });
      } else {
        return htmlPaths2.empty;
      }
    }
    function findHtmlPath(element, defaultPath) {
      var style = findStyle(element);
      return style ? style.to : defaultPath;
    }
    function findStyle(element) {
      for (var i = 0; i < styleMap2.length; i++) {
        if (styleMap2[i].from.matches(element)) {
          return styleMap2[i];
        }
      }
    }
    function recoveringConvertImage(convertImage) {
      return function(image, messages) {
        return promises2.attempt(function() {
          return convertImage(image, messages);
        }).caught(function(error) {
          messages.push(results2.error(error));
          return [];
        });
      };
    }
    function noteHtmlId(note) {
      return referentHtmlId(note.noteType, note.noteId);
    }
    function noteRefHtmlId(note) {
      return referenceHtmlId(note.noteType, note.noteId);
    }
    function referentHtmlId(referenceType, referenceId) {
      return htmlId(referenceType + "-" + referenceId);
    }
    function referenceHtmlId(referenceType, referenceId) {
      return htmlId(referenceType + "-ref-" + referenceId);
    }
    function htmlId(suffix) {
      return idPrefix + suffix;
    }
    var defaultTablePath = htmlPaths2.elements([
      htmlPaths2.element("table", {}, { fresh: true })
    ]);
    function convertTable(element, messages, options2) {
      return findHtmlPath(element, defaultTablePath).wrap(function() {
        return convertTableChildren(element, messages, options2);
      });
    }
    function convertTableChildren(element, messages, options2) {
      var bodyIndex = _.findIndex(element.children, function(child) {
        return !child.type === documents2.types.tableRow || !child.isHeader;
      });
      if (bodyIndex === -1) {
        bodyIndex = element.children.length;
      }
      var children;
      if (bodyIndex === 0) {
        children = convertElements(
          element.children,
          messages,
          _.extend({}, options2, { isTableHeader: false })
        );
      } else {
        var headRows = convertElements(
          element.children.slice(0, bodyIndex),
          messages,
          _.extend({}, options2, { isTableHeader: true })
        );
        var bodyRows = convertElements(
          element.children.slice(bodyIndex),
          messages,
          _.extend({}, options2, { isTableHeader: false })
        );
        children = [
          Html.freshElement("thead", {}, headRows),
          Html.freshElement("tbody", {}, bodyRows)
        ];
      }
      return [Html.forceWrite].concat(children);
    }
    function convertTableRow(element, messages, options2) {
      var children = convertElements(element.children, messages, options2);
      return [
        Html.freshElement("tr", {}, [Html.forceWrite].concat(children))
      ];
    }
    function convertTableCell(element, messages, options2) {
      var tagName = options2.isTableHeader ? "th" : "td";
      var children = convertElements(element.children, messages, options2);
      var attributes = {};
      if (element.colSpan !== 1) {
        attributes.colspan = element.colSpan.toString();
      }
      if (element.rowSpan !== 1) {
        attributes.rowspan = element.rowSpan.toString();
      }
      return [
        Html.freshElement(tagName, attributes, [Html.forceWrite].concat(children))
      ];
    }
    function convertCommentReference(reference, messages, options2) {
      return findHtmlPath(reference, htmlPaths2.ignore).wrap(function() {
        var comment = comments[reference.commentId];
        var count = referencedComments.length + 1;
        var label = "[" + commentAuthorLabel(comment) + count + "]";
        referencedComments.push({ label, comment });
        return [
          Html.freshElement("a", {
            href: "#" + referentHtmlId("comment", reference.commentId),
            id: referenceHtmlId("comment", reference.commentId)
          }, [Html.text(label)])
        ];
      });
    }
    function convertComment(referencedComment, messages, options2) {
      var label = referencedComment.label;
      var comment = referencedComment.comment;
      var body = convertElements(comment.body, messages, options2).concat([
        Html.nonFreshElement("p", {}, [
          Html.text(" "),
          Html.freshElement("a", { "href": "#" + referenceHtmlId("comment", comment.commentId) }, [
            Html.text("↑")
          ])
        ])
      ]);
      return [
        Html.freshElement(
          "dt",
          { "id": referentHtmlId("comment", comment.commentId) },
          [Html.text("Comment " + label)]
        ),
        Html.freshElement("dd", {}, body)
      ];
    }
    function convertBreak(element, messages, options2) {
      return htmlPathForBreak(element).wrap(function() {
        return [];
      });
    }
    function htmlPathForBreak(element) {
      var style = findStyle(element);
      if (style) {
        return style.to;
      } else if (element.breakType === "line") {
        return htmlPaths2.topLevelElement("br");
      } else {
        return htmlPaths2.empty;
      }
    }
    var elementConverters = {
      "document": function(document, messages, options2) {
        var children = convertElements(document.children, messages, options2);
        var notes = noteReferences.map(function(noteReference) {
          return document.notes.resolve(noteReference);
        });
        var notesNodes = convertElements(notes, messages, options2);
        return children.concat([
          Html.freshElement("ol", {}, notesNodes),
          Html.freshElement("dl", {}, flatMap(referencedComments, function(referencedComment) {
            return convertComment(referencedComment, messages, options2);
          }))
        ]);
      },
      "paragraph": convertParagraph,
      "run": convertRun,
      "text": function(element, messages, options2) {
        return [Html.text(element.value)];
      },
      "tab": function(element, messages, options2) {
        return [Html.text("	")];
      },
      "hyperlink": function(element, messages, options2) {
        var href = element.anchor ? "#" + htmlId(element.anchor) : element.href;
        var attributes = { href };
        if (element.targetFrame != null) {
          attributes.target = element.targetFrame;
        }
        var children = convertElements(element.children, messages, options2);
        return [Html.nonFreshElement("a", attributes, children)];
      },
      "checkbox": function(element) {
        var attributes = { type: "checkbox" };
        if (element.checked) {
          attributes["checked"] = "checked";
        }
        return [Html.freshElement("input", attributes)];
      },
      "bookmarkStart": function(element, messages, options2) {
        var anchor = Html.freshElement("a", {
          id: htmlId(element.name)
        }, [Html.forceWrite]);
        return [anchor];
      },
      "noteReference": function(element, messages, options2) {
        noteReferences.push(element);
        var anchor = Html.freshElement("a", {
          href: "#" + noteHtmlId(element),
          id: noteRefHtmlId(element)
        }, [Html.text("[" + noteNumber++ + "]")]);
        return [Html.freshElement("sup", {}, [anchor])];
      },
      "note": function(element, messages, options2) {
        var children = convertElements(element.body, messages, options2);
        var backLink = Html.elementWithTag(htmlPaths2.element("p", {}, { fresh: false }), [
          Html.text(" "),
          Html.freshElement("a", { href: "#" + noteRefHtmlId(element) }, [Html.text("↑")])
        ]);
        var body = children.concat([backLink]);
        return Html.freshElement("li", { id: noteHtmlId(element) }, body);
      },
      "commentReference": convertCommentReference,
      "comment": convertComment,
      "image": deferredConversion(recoveringConvertImage(options.convertImage || images2.dataUri)),
      "table": convertTable,
      "tableRow": convertTableRow,
      "tableCell": convertTableCell,
      "break": convertBreak
    };
    return {
      convertToHtml
    };
  }
  var deferredId = 1;
  function deferredConversion(func) {
    return function(element, messages, options) {
      return [
        {
          type: "deferred",
          id: deferredId++,
          value: function() {
            return func(element, messages, options);
          }
        }
      ];
    };
  }
  function unrecognisedStyleWarning(type, element) {
    return results2.warning(
      "Unrecognised " + type + " style: '" + element.styleName + "' (Style ID: " + element.styleId + ")"
    );
  }
  function flatMap(values, func) {
    return _.flatten(values.map(func), true);
  }
  function walkHtml(nodes2, callback) {
    nodes2.forEach(function(node) {
      callback(node);
      if (node.children) {
        walkHtml(node.children, callback);
      }
    });
  }
  var commentAuthorLabel = documentToHtml.commentAuthorLabel = function commentAuthorLabel2(comment) {
    return comment.authorInitials || "";
  };
  return documentToHtml;
}
var rawText = {};
var hasRequiredRawText;
function requireRawText() {
  if (hasRequiredRawText) return rawText;
  hasRequiredRawText = 1;
  var documents2 = requireDocuments();
  function convertElementToRawText(element) {
    if (element.type === "text") {
      return element.value;
    } else if (element.type === documents2.types.tab) {
      return "	";
    } else {
      var tail = element.type === "paragraph" ? "\n\n" : "";
      return (element.children || []).map(convertElementToRawText).join("") + tail;
    }
  }
  rawText.convertElementToRawText = convertElementToRawText;
  return rawText;
}
var styleReader = {};
var documentMatchers = {};
var hasRequiredDocumentMatchers;
function requireDocumentMatchers() {
  if (hasRequiredDocumentMatchers) return documentMatchers;
  hasRequiredDocumentMatchers = 1;
  documentMatchers.paragraph = paragraph;
  documentMatchers.run = run;
  documentMatchers.table = table;
  documentMatchers.bold = new Matcher("bold");
  documentMatchers.italic = new Matcher("italic");
  documentMatchers.underline = new Matcher("underline");
  documentMatchers.strikethrough = new Matcher("strikethrough");
  documentMatchers.allCaps = new Matcher("allCaps");
  documentMatchers.smallCaps = new Matcher("smallCaps");
  documentMatchers.highlight = highlight;
  documentMatchers.commentReference = new Matcher("commentReference");
  documentMatchers.lineBreak = new BreakMatcher({ breakType: "line" });
  documentMatchers.pageBreak = new BreakMatcher({ breakType: "page" });
  documentMatchers.columnBreak = new BreakMatcher({ breakType: "column" });
  documentMatchers.equalTo = equalTo;
  documentMatchers.startsWith = startsWith;
  function paragraph(options) {
    return new Matcher("paragraph", options);
  }
  function run(options) {
    return new Matcher("run", options);
  }
  function table(options) {
    return new Matcher("table", options);
  }
  function highlight(options) {
    return new HighlightMatcher(options);
  }
  function Matcher(elementType, options) {
    options = options || {};
    this._elementType = elementType;
    this._styleId = options.styleId;
    this._styleName = options.styleName;
    if (options.list) {
      this._listIndex = options.list.levelIndex;
      this._listIsOrdered = options.list.isOrdered;
    }
  }
  Matcher.prototype.matches = function(element) {
    return element.type === this._elementType && (this._styleId === void 0 || element.styleId === this._styleId) && (this._styleName === void 0 || element.styleName && this._styleName.operator(this._styleName.operand, element.styleName)) && (this._listIndex === void 0 || isList(element, this._listIndex, this._listIsOrdered)) && (this._breakType === void 0 || this._breakType === element.breakType);
  };
  function HighlightMatcher(options) {
    options = options || {};
    this._color = options.color;
  }
  HighlightMatcher.prototype.matches = function(element) {
    return element.type === "highlight" && (this._color === void 0 || element.color === this._color);
  };
  function BreakMatcher(options) {
    options = options || {};
    this._breakType = options.breakType;
  }
  BreakMatcher.prototype.matches = function(element) {
    return element.type === "break" && (this._breakType === void 0 || element.breakType === this._breakType);
  };
  function isList(element, levelIndex, isOrdered) {
    return element.numbering && element.numbering.level == levelIndex && element.numbering.isOrdered == isOrdered;
  }
  function equalTo(value) {
    return {
      operator: operatorEqualTo,
      operand: value
    };
  }
  function startsWith(value) {
    return {
      operator: operatorStartsWith,
      operand: value
    };
  }
  function operatorEqualTo(first, second) {
    return first.toUpperCase() === second.toUpperCase();
  }
  function operatorStartsWith(first, second) {
    return second.toUpperCase().indexOf(first.toUpperCase()) === 0;
  }
  return documentMatchers;
}
var tokeniser = {};
var hasRequiredTokeniser;
function requireTokeniser() {
  if (hasRequiredTokeniser) return tokeniser;
  hasRequiredTokeniser = 1;
  var lop = requireLop();
  var RegexTokeniser = lop.RegexTokeniser;
  tokeniser.tokenise = tokenise;
  var stringPrefix = "'((?:\\\\.|[^'])*)";
  function tokenise(string) {
    var identifierCharacter = "(?:[a-zA-Z\\-_]|\\\\.)";
    var tokeniser2 = new RegexTokeniser([
      { name: "identifier", regex: new RegExp("(" + identifierCharacter + "(?:" + identifierCharacter + "|[0-9])*)") },
      { name: "dot", regex: /\./ },
      { name: "colon", regex: /:/ },
      { name: "gt", regex: />/ },
      { name: "whitespace", regex: /\s+/ },
      { name: "arrow", regex: /=>/ },
      { name: "equals", regex: /=/ },
      { name: "startsWith", regex: /\^=/ },
      { name: "open-paren", regex: /\(/ },
      { name: "close-paren", regex: /\)/ },
      { name: "open-square-bracket", regex: /\[/ },
      { name: "close-square-bracket", regex: /\]/ },
      { name: "string", regex: new RegExp(stringPrefix + "'") },
      { name: "unterminated-string", regex: new RegExp(stringPrefix) },
      { name: "integer", regex: /([0-9]+)/ },
      { name: "choice", regex: /\|/ },
      { name: "bang", regex: /(!)/ }
    ]);
    return tokeniser2.tokenise(string);
  }
  return tokeniser;
}
var hasRequiredStyleReader;
function requireStyleReader() {
  if (hasRequiredStyleReader) return styleReader;
  hasRequiredStyleReader = 1;
  var _ = requireUnderscoreNode();
  var lop = requireLop();
  var documentMatchers2 = requireDocumentMatchers();
  var htmlPaths2 = requireHtmlPaths();
  var tokenise = requireTokeniser().tokenise;
  var results2 = requireResults();
  styleReader.readHtmlPath = readHtmlPath;
  styleReader.readDocumentMatcher = readDocumentMatcher;
  styleReader.readStyle = readStyle;
  function readStyle(string) {
    return parseString(styleRule, string);
  }
  function createStyleRule() {
    return lop.rules.sequence(
      lop.rules.sequence.capture(documentMatcherRule()),
      lop.rules.tokenOfType("whitespace"),
      lop.rules.tokenOfType("arrow"),
      lop.rules.sequence.capture(lop.rules.optional(lop.rules.sequence(
        lop.rules.tokenOfType("whitespace"),
        lop.rules.sequence.capture(htmlPathRule())
      ).head())),
      lop.rules.tokenOfType("end")
    ).map(function(documentMatcher, htmlPath) {
      return {
        from: documentMatcher,
        to: htmlPath.valueOrElse(htmlPaths2.empty)
      };
    });
  }
  function readDocumentMatcher(string) {
    return parseString(documentMatcherRule(), string);
  }
  function documentMatcherRule() {
    var sequence = lop.rules.sequence;
    var identifierToConstant = function(identifier, constant) {
      return lop.rules.then(
        lop.rules.token("identifier", identifier),
        function() {
          return constant;
        }
      );
    };
    var paragraphRule = identifierToConstant("p", documentMatchers2.paragraph);
    var runRule = identifierToConstant("r", documentMatchers2.run);
    var elementTypeRule = lop.rules.firstOf(
      "p or r or table",
      paragraphRule,
      runRule
    );
    var styleIdRule = lop.rules.sequence(
      lop.rules.tokenOfType("dot"),
      lop.rules.sequence.cut(),
      lop.rules.sequence.capture(identifierRule)
    ).map(function(styleId) {
      return { styleId };
    });
    var styleNameMatcherRule = lop.rules.firstOf(
      "style name matcher",
      lop.rules.then(
        lop.rules.sequence(
          lop.rules.tokenOfType("equals"),
          lop.rules.sequence.cut(),
          lop.rules.sequence.capture(stringRule)
        ).head(),
        function(styleName) {
          return { styleName: documentMatchers2.equalTo(styleName) };
        }
      ),
      lop.rules.then(
        lop.rules.sequence(
          lop.rules.tokenOfType("startsWith"),
          lop.rules.sequence.cut(),
          lop.rules.sequence.capture(stringRule)
        ).head(),
        function(styleName) {
          return { styleName: documentMatchers2.startsWith(styleName) };
        }
      )
    );
    var styleNameRule = lop.rules.sequence(
      lop.rules.tokenOfType("open-square-bracket"),
      lop.rules.sequence.cut(),
      lop.rules.token("identifier", "style-name"),
      lop.rules.sequence.capture(styleNameMatcherRule),
      lop.rules.tokenOfType("close-square-bracket")
    ).head();
    var listTypeRule = lop.rules.firstOf(
      "list type",
      identifierToConstant("ordered-list", { isOrdered: true }),
      identifierToConstant("unordered-list", { isOrdered: false })
    );
    var listRule = sequence(
      lop.rules.tokenOfType("colon"),
      sequence.capture(listTypeRule),
      sequence.cut(),
      lop.rules.tokenOfType("open-paren"),
      sequence.capture(integerRule),
      lop.rules.tokenOfType("close-paren")
    ).map(function(listType, levelNumber) {
      return {
        list: {
          isOrdered: listType.isOrdered,
          levelIndex: levelNumber - 1
        }
      };
    });
    function createMatcherSuffixesRule(rules) {
      var matcherSuffix = lop.rules.firstOf.apply(
        lop.rules.firstOf,
        ["matcher suffix"].concat(rules)
      );
      var matcherSuffixes = lop.rules.zeroOrMore(matcherSuffix);
      return lop.rules.then(matcherSuffixes, function(suffixes) {
        var matcherOptions = {};
        suffixes.forEach(function(suffix) {
          _.extend(matcherOptions, suffix);
        });
        return matcherOptions;
      });
    }
    var paragraphOrRun = sequence(
      sequence.capture(elementTypeRule),
      sequence.capture(createMatcherSuffixesRule([
        styleIdRule,
        styleNameRule,
        listRule
      ]))
    ).map(function(createMatcher, matcherOptions) {
      return createMatcher(matcherOptions);
    });
    var table = sequence(
      lop.rules.token("identifier", "table"),
      sequence.capture(createMatcherSuffixesRule([
        styleIdRule,
        styleNameRule
      ]))
    ).map(function(options) {
      return documentMatchers2.table(options);
    });
    var bold = identifierToConstant("b", documentMatchers2.bold);
    var italic = identifierToConstant("i", documentMatchers2.italic);
    var underline2 = identifierToConstant("u", documentMatchers2.underline);
    var strikethrough = identifierToConstant("strike", documentMatchers2.strikethrough);
    var allCaps = identifierToConstant("all-caps", documentMatchers2.allCaps);
    var smallCaps = identifierToConstant("small-caps", documentMatchers2.smallCaps);
    var highlight = sequence(
      lop.rules.token("identifier", "highlight"),
      lop.rules.sequence.capture(lop.rules.optional(lop.rules.sequence(
        lop.rules.tokenOfType("open-square-bracket"),
        lop.rules.sequence.cut(),
        lop.rules.token("identifier", "color"),
        lop.rules.tokenOfType("equals"),
        lop.rules.sequence.capture(stringRule),
        lop.rules.tokenOfType("close-square-bracket")
      ).head()))
    ).map(function(color) {
      return documentMatchers2.highlight({
        color: color.valueOrElse(void 0)
      });
    });
    var commentReference = identifierToConstant("comment-reference", documentMatchers2.commentReference);
    var breakMatcher = sequence(
      lop.rules.token("identifier", "br"),
      sequence.cut(),
      lop.rules.tokenOfType("open-square-bracket"),
      lop.rules.token("identifier", "type"),
      lop.rules.tokenOfType("equals"),
      sequence.capture(stringRule),
      lop.rules.tokenOfType("close-square-bracket")
    ).map(function(breakType) {
      switch (breakType) {
        case "line":
          return documentMatchers2.lineBreak;
        case "page":
          return documentMatchers2.pageBreak;
        case "column":
          return documentMatchers2.columnBreak;
      }
    });
    return lop.rules.firstOf(
      "element type",
      paragraphOrRun,
      table,
      bold,
      italic,
      underline2,
      strikethrough,
      allCaps,
      smallCaps,
      highlight,
      commentReference,
      breakMatcher
    );
  }
  function readHtmlPath(string) {
    return parseString(htmlPathRule(), string);
  }
  function htmlPathRule() {
    var capture = lop.rules.sequence.capture;
    var whitespaceRule = lop.rules.tokenOfType("whitespace");
    var freshRule = lop.rules.then(
      lop.rules.optional(lop.rules.sequence(
        lop.rules.tokenOfType("colon"),
        lop.rules.token("identifier", "fresh")
      )),
      function(option) {
        return option.map(function() {
          return true;
        }).valueOrElse(false);
      }
    );
    var separatorRule = lop.rules.then(
      lop.rules.optional(lop.rules.sequence(
        lop.rules.tokenOfType("colon"),
        lop.rules.token("identifier", "separator"),
        lop.rules.tokenOfType("open-paren"),
        capture(stringRule),
        lop.rules.tokenOfType("close-paren")
      ).head()),
      function(option) {
        return option.valueOrElse("");
      }
    );
    var tagNamesRule = lop.rules.oneOrMoreWithSeparator(
      identifierRule,
      lop.rules.tokenOfType("choice")
    );
    var styleElementRule = lop.rules.sequence(
      capture(tagNamesRule),
      capture(lop.rules.zeroOrMore(attributeOrClassRule)),
      capture(freshRule),
      capture(separatorRule)
    ).map(function(tagName, attributesList, fresh, separator) {
      var attributes = {};
      var options = {};
      attributesList.forEach(function(attribute) {
        if (attribute.append && attributes[attribute.name]) {
          attributes[attribute.name] += " " + attribute.value;
        } else {
          attributes[attribute.name] = attribute.value;
        }
      });
      if (fresh) {
        options.fresh = true;
      }
      if (separator) {
        options.separator = separator;
      }
      return htmlPaths2.element(tagName, attributes, options);
    });
    return lop.rules.firstOf(
      "html path",
      lop.rules.then(lop.rules.tokenOfType("bang"), function() {
        return htmlPaths2.ignore;
      }),
      lop.rules.then(
        lop.rules.zeroOrMoreWithSeparator(
          styleElementRule,
          lop.rules.sequence(
            whitespaceRule,
            lop.rules.tokenOfType("gt"),
            whitespaceRule
          )
        ),
        htmlPaths2.elements
      )
    );
  }
  var identifierRule = lop.rules.then(
    lop.rules.tokenOfType("identifier"),
    decodeEscapeSequences
  );
  var integerRule = lop.rules.tokenOfType("integer");
  var stringRule = lop.rules.then(
    lop.rules.tokenOfType("string"),
    decodeEscapeSequences
  );
  var escapeSequences = {
    "n": "\n",
    "r": "\r",
    "t": "	"
  };
  function decodeEscapeSequences(value) {
    return value.replace(/\\(.)/g, function(match, code) {
      return escapeSequences[code] || code;
    });
  }
  var attributeRule = lop.rules.sequence(
    lop.rules.tokenOfType("open-square-bracket"),
    lop.rules.sequence.cut(),
    lop.rules.sequence.capture(identifierRule),
    lop.rules.tokenOfType("equals"),
    lop.rules.sequence.capture(stringRule),
    lop.rules.tokenOfType("close-square-bracket")
  ).map(function(name, value) {
    return { name, value, append: false };
  });
  var classRule = lop.rules.sequence(
    lop.rules.tokenOfType("dot"),
    lop.rules.sequence.cut(),
    lop.rules.sequence.capture(identifierRule)
  ).map(function(className) {
    return { name: "class", value: className, append: true };
  });
  var attributeOrClassRule = lop.rules.firstOf(
    "attribute or class",
    attributeRule,
    classRule
  );
  function parseString(rule, string) {
    var tokens = tokenise(string);
    var parser = lop.Parser();
    var parseResult = parser.parseTokens(rule, tokens);
    if (parseResult.isSuccess()) {
      return results2.success(parseResult.value());
    } else {
      return new results2.Result(null, [results2.warning(describeFailure(string, parseResult))]);
    }
  }
  function describeFailure(input, parseResult) {
    return "Did not understand this style mapping, so ignored it: " + input + "\n" + parseResult.errors().map(describeError).join("\n");
  }
  function describeError(error) {
    return "Error was at character number " + error.characterNumber() + ": Expected " + error.expected + " but got " + error.actual;
  }
  var styleRule = createStyleRule();
  return styleReader;
}
var optionsReader = {};
var hasRequiredOptionsReader;
function requireOptionsReader() {
  if (hasRequiredOptionsReader) return optionsReader;
  hasRequiredOptionsReader = 1;
  optionsReader.readOptions = readOptions;
  var _ = requireUnderscoreNode();
  var defaultStyleMap = optionsReader._defaultStyleMap = [
    "p.Heading1 => h1:fresh",
    "p.Heading2 => h2:fresh",
    "p.Heading3 => h3:fresh",
    "p.Heading4 => h4:fresh",
    "p.Heading5 => h5:fresh",
    "p.Heading6 => h6:fresh",
    "p[style-name='Heading 1'] => h1:fresh",
    "p[style-name='Heading 2'] => h2:fresh",
    "p[style-name='Heading 3'] => h3:fresh",
    "p[style-name='Heading 4'] => h4:fresh",
    "p[style-name='Heading 5'] => h5:fresh",
    "p[style-name='Heading 6'] => h6:fresh",
    "p[style-name='heading 1'] => h1:fresh",
    "p[style-name='heading 2'] => h2:fresh",
    "p[style-name='heading 3'] => h3:fresh",
    "p[style-name='heading 4'] => h4:fresh",
    "p[style-name='heading 5'] => h5:fresh",
    "p[style-name='heading 6'] => h6:fresh",
    // Apple Pages
    "p.Heading => h1:fresh",
    "p[style-name='Heading'] => h1:fresh",
    "r[style-name='Strong'] => strong",
    "p[style-name='footnote text'] => p:fresh",
    "r[style-name='footnote reference'] =>",
    "p[style-name='endnote text'] => p:fresh",
    "r[style-name='endnote reference'] =>",
    "p[style-name='annotation text'] => p:fresh",
    "r[style-name='annotation reference'] =>",
    // LibreOffice
    "p[style-name='Footnote'] => p:fresh",
    "r[style-name='Footnote anchor'] =>",
    "p[style-name='Endnote'] => p:fresh",
    "r[style-name='Endnote anchor'] =>",
    "p:unordered-list(1) => ul > li:fresh",
    "p:unordered-list(2) => ul|ol > li > ul > li:fresh",
    "p:unordered-list(3) => ul|ol > li > ul|ol > li > ul > li:fresh",
    "p:unordered-list(4) => ul|ol > li > ul|ol > li > ul|ol > li > ul > li:fresh",
    "p:unordered-list(5) => ul|ol > li > ul|ol > li > ul|ol > li > ul|ol > li > ul > li:fresh",
    "p:ordered-list(1) => ol > li:fresh",
    "p:ordered-list(2) => ul|ol > li > ol > li:fresh",
    "p:ordered-list(3) => ul|ol > li > ul|ol > li > ol > li:fresh",
    "p:ordered-list(4) => ul|ol > li > ul|ol > li > ul|ol > li > ol > li:fresh",
    "p:ordered-list(5) => ul|ol > li > ul|ol > li > ul|ol > li > ul|ol > li > ol > li:fresh",
    "r[style-name='Hyperlink'] =>",
    "p[style-name='Normal'] => p:fresh",
    // Apple Pages
    "p.Body => p:fresh",
    "p[style-name='Body'] => p:fresh"
  ];
  var standardOptions = optionsReader._standardOptions = {
    externalFileAccess: false,
    transformDocument: identity,
    includeDefaultStyleMap: true,
    includeEmbeddedStyleMap: true
  };
  function readOptions(options) {
    options = options || {};
    return _.extend({}, standardOptions, options, {
      customStyleMap: readStyleMap(options.styleMap),
      readStyleMap: function() {
        var styleMap2 = this.customStyleMap;
        if (this.includeEmbeddedStyleMap) {
          styleMap2 = styleMap2.concat(readStyleMap(this.embeddedStyleMap));
        }
        if (this.includeDefaultStyleMap) {
          styleMap2 = styleMap2.concat(defaultStyleMap);
        }
        return styleMap2;
      }
    });
  }
  function readStyleMap(styleMap2) {
    if (!styleMap2) {
      return [];
    } else if (_.isString(styleMap2)) {
      return styleMap2.split("\n").map(function(line) {
        return line.trim();
      }).filter(function(line) {
        return line !== "" && line.charAt(0) !== "#";
      });
    } else {
      return styleMap2;
    }
  }
  function identity(value) {
    return value;
  }
  return optionsReader;
}
var unzip = {};
var hasRequiredUnzip;
function requireUnzip() {
  if (hasRequiredUnzip) return unzip;
  hasRequiredUnzip = 1;
  var fs = require$$0;
  var promises2 = requirePromises();
  var zipfile2 = requireZipfile();
  unzip.openZip = openZip;
  var readFile = promises2.promisify(fs.readFile);
  function openZip(options) {
    if (options.path) {
      return readFile(options.path).then(zipfile2.openArrayBuffer);
    } else if (options.buffer) {
      return promises2.resolve(zipfile2.openArrayBuffer(options.buffer));
    } else if (options.file) {
      return promises2.resolve(options.file);
    } else {
      return promises2.reject(new Error("Could not find file in options"));
    }
  }
  return unzip;
}
var underline = {};
var hasRequiredUnderline;
function requireUnderline() {
  if (hasRequiredUnderline) return underline;
  hasRequiredUnderline = 1;
  var htmlPaths2 = requireHtmlPaths();
  var Html = requireHtml();
  underline.element = element;
  function element(name) {
    return function(html2) {
      return Html.elementWithTag(htmlPaths2.element(name), [html2]);
    };
  }
  return underline;
}
var hasRequiredLib;
function requireLib() {
  if (hasRequiredLib) return lib;
  hasRequiredLib = 1;
  var _ = requireUnderscoreNode();
  var docxReader2 = requireDocxReader();
  var docxStyleMap = requireStyleMap();
  var DocumentConverter = requireDocumentToHtml().DocumentConverter;
  var convertElementToRawText = requireRawText().convertElementToRawText;
  var readStyle = requireStyleReader().readStyle;
  var readOptions = requireOptionsReader().readOptions;
  var unzip2 = requireUnzip();
  var Result = requireResults().Result;
  lib.convertToHtml = convertToHtml;
  lib.convertToMarkdown = convertToMarkdown;
  lib.convert = convert;
  lib.extractRawText = extractRawText;
  lib.images = requireImages();
  lib.transforms = requireTransforms();
  lib.underline = requireUnderline();
  lib.embedStyleMap = embedStyleMap;
  lib.readEmbeddedStyleMap = readEmbeddedStyleMap;
  function convertToHtml(input, options) {
    return convert(input, options);
  }
  function convertToMarkdown(input, options) {
    var markdownOptions = Object.create(options || {});
    markdownOptions.outputFormat = "markdown";
    return convert(input, markdownOptions);
  }
  function convert(input, options) {
    options = readOptions(options);
    return unzip2.openZip(input).tap(function(docxFile) {
      return docxStyleMap.readStyleMap(docxFile).then(function(styleMap2) {
        options.embeddedStyleMap = styleMap2;
      });
    }).then(function(docxFile) {
      return docxReader2.read(docxFile, input, options).then(function(documentResult) {
        return documentResult.map(options.transformDocument);
      }).then(function(documentResult) {
        return convertDocumentToHtml(documentResult, options);
      });
    });
  }
  function readEmbeddedStyleMap(input) {
    return unzip2.openZip(input).then(docxStyleMap.readStyleMap);
  }
  function convertDocumentToHtml(documentResult, options) {
    var styleMapResult = parseStyleMap(options.readStyleMap());
    var parsedOptions = _.extend({}, options, {
      styleMap: styleMapResult.value
    });
    var documentConverter = new DocumentConverter(parsedOptions);
    return documentResult.flatMapThen(function(document) {
      return styleMapResult.flatMapThen(function(styleMap2) {
        return documentConverter.convertToHtml(document);
      });
    });
  }
  function parseStyleMap(styleMap2) {
    return Result.combine((styleMap2 || []).map(readStyle)).map(function(styleMap3) {
      return styleMap3.filter(function(styleMapping) {
        return !!styleMapping;
      });
    });
  }
  function extractRawText(input) {
    return unzip2.openZip(input).then(docxReader2.read).then(function(documentResult) {
      return documentResult.map(convertElementToRawText);
    });
  }
  function embedStyleMap(input, styleMap2) {
    return unzip2.openZip(input).tap(function(docxFile) {
      return docxStyleMap.writeStyleMap(docxFile, styleMap2);
    }).then(function(docxFile) {
      return docxFile.toArrayBuffer();
    }).then(function(arrayBuffer) {
      return {
        toArrayBuffer: function() {
          return arrayBuffer;
        },
        toBuffer: function() {
          return Buffer.from(arrayBuffer);
        }
      };
    });
  }
  lib.styleMapping = function() {
    throw new Error(`Use a raw string instead of mammoth.styleMapping e.g. "p[style-name='Title'] => h1" instead of mammoth.styleMapping("p[style-name='Title'] => h1")`);
  };
  return lib;
}
var libExports = requireLib();
const index = /* @__PURE__ */ getDefaultExportFromCjs(libExports);
const index$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: index
}, [libExports]);
export {
  index$1 as i
};
