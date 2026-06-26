const fs = require("fs");
const txt = fs.readFileSync("src/routes/admin.tsx", "utf8");
const line = 522;
const lines = txt.split(/\n/);
const text = lines[line - 1];
console.log(`Line ${line} length: ${text.length}`);
console.log("Stringified:", JSON.stringify(text));
console.log(
  "Bytes:",
  [...text].map((c) => c.charCodeAt(0)),
);
// Look for tags
const tags = [];
const re = /<\/?([A-Za-z0-9:_\-]+)(?=[\s>\/])/g;
let m;
while ((m = re.exec(text)) !== null) tags.push(m[0]);
console.log("Tags found:", tags);
// Track opens/closes in whole file near end
const stack = [];
const start = Math.max(0, txt.length - 800);
const end = txt.length;
const snippet = txt.slice(start, end);
const re2 = /<\/?([A-Za-z0-9:_\-]+)/g;
while ((m = re2.exec(snippet)) !== null) {
  if (m[0].startsWith("</")) {
    if (stack.length && stack[stack.length - 1] === m[1]) stack.pop();
    else stack.push(m[1]);
  } else if (
    m[0].endsWith("/>") ||
    m[1] === "img" ||
    m[1] === "br" ||
    m[1] === "hr" ||
    m[1] === "input"
  ) {
    // self-closingish
  } else {
    stack.push(m[1]);
  }
}
console.log("Remaining stack:", stack);
