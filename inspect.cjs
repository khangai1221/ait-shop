const fs = require('fs');
const txt = fs.readFileSync('src/routes/admin.tsx', 'utf8');

function countDelimiter(str, delim) {
  let count = 0, inStr = false, escaped = false;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (escaped) { escaped = false; continue; }
    if (c === '\\') { escaped = true; continue; }
    if (c === delim) { inStr = !inStr; count++; }
    else if (!inStr && (c === '`' || c === "'" || c === '"')) return -1; // mixed
  }
  return inStr ? -count : count;
}

console.log('Backtick count:', countDelimiter(txt, '`'));
console.log('Single quote count:', countDelimiter(txt, "'"));
console.log('Double quote count:', countDelimiter(txt, '"'));

const stack=[];
const re=/<\/?([A-Za-z0-9:_\-]+)(?=[\s>\/])/g;
let m;
const nearEnd=txt.slice(Math.max(0,txt.length-1200));
while ((m=re.exec(nearEnd))!==null) {
  const tag=m[1].toLowerCase();
  if (['img','br','hr','input','meta','link'].includes(tag)) {
    if (m[0].endsWith('/>')) continue;
    console.log('Non-selfclosed void-like:', m[0]);
  }
}
// find lines with unmatched braces
let braces=0;
const lines = txt.split(/\n/);
for (let i=0;i<lines.length;i++) {
  for (const c of lines[i]) { if (c==='{') braces++; if (c==='}') braces--; }
  if (i % 20 ===0) console.log(`Line ${i+1} braces=${braces}`);
}
