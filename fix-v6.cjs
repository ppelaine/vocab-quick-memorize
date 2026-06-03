const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'index.html');
let c = fs.readFileSync(file, 'utf8');

const startIdx = c.indexOf('function diag(msg)');
const endIdx = c.indexOf('</script>', startIdx);

const before = c.substring(0, startIdx);
const after = c.substring(endIdx);

const lines = [];

lines.push('function diag(msg){var d=document.getElementById("diag");d.textContent+=msg+String.fromCharCode(10);d.scrollTop=d.scrollHeight;}');
lines.push('\t\tdiag("1. Testing small script first...");');
lines.push('\t\tvar t1=document.createElement("script");');
lines.push('\t\tt1.textContent="window.__SMALL_TEST__=123;";');
lines.push('\t\tdocument.head.appendChild(t1);');
lines.push('\t\tdiag("2. Small test: __SMALL_TEST__="+window.__SMALL_TEST__);');
lines.push('');
lines.push('\t\tvar blob=new Blob(["window.__BLOB_TEST__=456;"],{type:"application/javascript"});');
lines.push('\t\tvar url=URL.createObjectURL(blob);');
lines.push('\t\tvar t2=document.createElement("script");');
lines.push('\t\tt2.src=url;');
lines.push('\t\tt2.onload=function(){');
lines.push('\t\t  diag("3. Blob small test onload: __BLOB_TEST__="+window.__BLOB_TEST__);');
lines.push('\t\t  fetch("app.js?v=7").then(function(r){return r.text();}).then(function(js){');
lines.push('\t\t    diag("4. app.js size="+js.length);');
lines.push('\t\t    try{');
lines.push('\t\t      var s3=document.createElement("script");');
lines.push('\t\t      s3.textContent=js;');
lines.push('\t\t      document.head.appendChild(s3);');
lines.push('\t\t      diag("5. textContent OK, __APPJS_STARTED__="+window.__APPJS_STARTED__);');
lines.push('\t\t      if(typeof switchTab==="function"){');
lines.push('\t\t        document.title="[OK]";');
lines.push('\t\t        switchTab("game");');
lines.push('\t\t        diag("6. switchTab OK");');
lines.push('\t\t      }else{');
lines.push('\t\t        diag("6. FUNCTIONS NOT GLOBAL");');
lines.push('\t\t        document.title="[NOFN]";');
lines.push('\t\t      }');
lines.push('\t\t    }catch(e){');
lines.push('\t\t      diag("5. textContent ERROR: "+e.message);');
lines.push('\t\t      diag("6. line="+e.line+" col="+e.col);');
lines.push('\t\t      if(e.line){');
lines.push('\t\t        var lines=js.split(String.fromCharCode(10));');
lines.push('\t\t        var start=Math.max(0,e.line-3);');
lines.push('\t\t        var end=Math.min(lines.length,e.line+2);');
lines.push('\t\t        for(var i=start;i<end;i++){');
lines.push('\t\t          diag("  L"+(i+1)+": "+lines[i].substring(0,100));');
lines.push('\t\t        }');
lines.push('\t\t      }');
lines.push('\t\t      document.title="[F]";');
lines.push('\t\t    }');
lines.push('\t\t  });');
lines.push('\t\t};');
lines.push('\t\tt2.onerror=function(){diag("3. Blob small test FAILED");};');
lines.push('\t\tdocument.head.appendChild(t2);');
lines.push('');

const replacement = lines.join('\r\n');
const newContent = before + replacement + after;

fs.writeFileSync(file, newContent, 'utf8');
console.log('OK - new size: ' + newContent.length + ' bytes');
