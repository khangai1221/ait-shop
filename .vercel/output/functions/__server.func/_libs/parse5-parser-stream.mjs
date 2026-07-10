import { Writable } from "node:stream";
import { P as Parser } from "./parse5.mjs";
class ParserStream extends Writable {
  static getFragmentStream(fragmentContext, options) {
    const parser = Parser.getFragmentParser(fragmentContext, options);
    const stream = new ParserStream(options, parser);
    return stream;
  }
  /** The resulting document node. */
  get document() {
    return this.parser.document;
  }
  getFragment() {
    return this.parser.getFragment();
  }
  /**
   * @param options Parsing options.
   */
  constructor(options, parser = new Parser(options)) {
    super({ decodeStrings: false });
    this.parser = parser;
    this.lastChunkWritten = false;
    this.writeCallback = void 0;
    this.pendingHtmlInsertions = [];
    const resume = () => {
      for (let i = this.pendingHtmlInsertions.length - 1; i >= 0; i--) {
        this.parser.tokenizer.insertHtmlAtCurrentPos(this.pendingHtmlInsertions[i]);
      }
      this.pendingHtmlInsertions.length = 0;
      this.parser.tokenizer.resume(this.writeCallback);
    };
    const documentWrite = (html) => {
      if (!this.parser.stopped) {
        this.pendingHtmlInsertions.push(html);
      }
    };
    const scriptHandler = (scriptElement) => {
      if (this.listenerCount("script") > 0) {
        this.parser.tokenizer.pause();
        this.emit("script", scriptElement, documentWrite, resume);
      }
    };
    this.parser.scriptHandler = scriptHandler;
  }
  //WritableStream implementation
  _write(chunk, _encoding, callback) {
    if (typeof chunk !== "string") {
      throw new TypeError("Parser can work only with string streams.");
    }
    this.writeCallback = callback;
    this.parser.tokenizer.write(chunk, this.lastChunkWritten, this.writeCallback);
  }
  // TODO [engine:node@>=16]: Due to issues with Node < 16, we are overriding `end` instead of `_final`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  end(chunk, encoding, callback) {
    this.lastChunkWritten = true;
    super.end(chunk || "", encoding, callback);
  }
}
export {
  ParserStream as P
};
