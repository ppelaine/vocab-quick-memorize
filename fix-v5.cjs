const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'index.html');
let c = fs.readFileSync(file, 'utf8');

const startIdx = c.indexOf('function diag(msg)');
const endIdx = c.indexOf('</script>', startIdx);

const before = c.substring(0, startIdx);
const after = c.substring(endIdx);

// Build replacement lines
const lines = [];

// Line 1: diag function - use String.fromCharCode to avoid escaping issues
lines.push('function diag(msg){var d=document.getElementById("diag");d.textContent+=msg+String.fromCharCode(10);d.scrollTop=d.scrollHeight;}');

lines.push('\t\tdiag("1. fetch+textContent approach...");');
lines.push('\t\tdocument.title="[LOAD]";');
lines.push('\t\tfetch("app.js?v=5").then(function(r){');
lines.push('\t\t  diag("2. fetch OK status="+r.status);');
lines.push('\t\t  if(!r.ok) throw new Error("HTTP "+r.status);');
lines.push('\t\t  return r.text();');
lines.push('\t\t}).then(function(js){');
lines.push('\t\t  diag("3. Got JS: "+js.length+" chars");');
lines.push('\t\t  document.title="[EXEC]";');
lines.push('\t\t  var s=document.createElement("script");');
lines.push('\t\t  s.textContent=js;');
lines.push('\t\t  document.head.appendChild(s);');
lines.push('\t\t  diag("4. After append: __APPJS_STARTED__="+window.__APPJS_STARTED__);');
lines.push('\t\t  diag("5. __APPJS_GOT_SWITCHTAB__="+window.__APPJS_GOT_SWITCHTAB__);');
lines.push('\t\t  diag("6. typeof switchTab="+typeof switchTab);');
lines.push('\t\t  if(typeof switchTab==="function"){');
lines.push('\t\t    document.title="[OK]";');
lines.push('\t\t    try{switchTab("game");diag("7. switchTab OK");document.title="[SW]";}catch(e){diag("7. ERR: "+e.message);}');
lines.push('\t\t  }else{');
lines.push('\t\t    document.title="[NOFN]";');
lines.push('\t\t    diag("7. FUNCTIONS NOT GLOBAL");');
lines.push('\t\t    diag("8. DICT via try: "+(function(){try{return DICTIONARY?DICTIONARY.length:"UNDEF";}catch(e){return "ERR:"+e.message;}})());');
lines.push('\t\t  }');
lines.push('\t\t}).catch(function(e){');
lines.push('\t\t  diag("ERR: "+e.message);');
lines.push('\t\t  document.title="[F]";');
lines.push('\t\t});');
lines.push('');

const replacement = lines.join('\r\n');
const newContent = before + replacement + after;

fs.writeFileSync(file, newContent, 'utf8');
console.log('OK - new size: ' + newContent.length + ' bytes');
