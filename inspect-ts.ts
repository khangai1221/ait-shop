import ts from "typescript";
import fs from "fs";

const text = fs.readFileSync("src/routes/admin.tsx", "utf8");
const sourceFile = ts.createSourceFile("admin.tsx", text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

function walk(node: ts.Node, depth: number) {
  if (ts.isJsxElement(node)) {
    const open = node.openingElement;
    const openName = open.tagName.getText(sourceFile);
    const close = node.closingElement;
    if (!close) {
      console.log(`Unclosed JSX element: ${openName} at line ${open.getLine(sourceFile)}, col ${open.getCol(sourceFile)}`);
    } else {
      const closeName = close.tagName.getText(sourceFile);
      if (closeName !== openName) {
        console.log(`Mismatched JSX: <${openName}> closed by </${closeName}> at line ${close.getLine(sourceFile)}`);
      }
    }
  }
  if (ts.isJsxFragment(node)) {
    console.log(`JSX fragment at line ${node.getLine(sourceFile)}`);
  }
  if (ts.isIdentifier(node) && node.text === "collapsed" && node.getLine(sourceFile) >= 320 && node.getLine(sourceFile) <= 345) {
    console.log(`Identifier 'collapsed' at line ${node.getLine(sourceFile)}, col ${node.getCol(sourceFile)}`);
  }
  node.getChildren(sourceFile).forEach((c) => walk(c, depth + 1));
}

walk(sourceFile, 0);
