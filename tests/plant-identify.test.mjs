import assert from 'node:assert/strict';
import handler from '../api/plant-identify.js';

function mockRes() {
  return {
    statusCode: 200, body: null,
    setHeader() {},
    status(n) { this.statusCode=n; return this; },
    json(v) { this.body=v; return this; }
  };
}
async function* stream(buf) { yield buf; }

const missingKeyReq={method:'POST',headers:{'content-type':'multipart/form-data; boundary=x'},...stream(Buffer.from(''))};
const oldKey=process.env.PLANTNET_API_KEY;
delete process.env.PLANTNET_API_KEY;
let res=mockRes();
await handler(missingKeyReq,res);
assert.equal(res.statusCode,503);
assert.match(res.body.error,/PLANTNET_API_KEY/);

process.env.PLANTNET_API_KEY='test-key';
const boundary='----test-boundary';
const image=Buffer.from([0xff,0xd8,0xff,0xd9]);
const multipart=Buffer.concat([
  Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="leaf.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`),
  image,
  Buffer.from(`\r\n--${boundary}--\r\n`)
]);
const req={method:'POST',headers:{'content-type':`multipart/form-data; boundary=${boundary}`},[Symbol.asyncIterator]:()=>stream(multipart)};
const originalFetch=globalThis.fetch;
globalThis.fetch=async (url,options)=>{
  assert.match(String(url),/my-api\.plantnet\.org\/v2\/identify\/all/);
  assert.match(String(url),/api-key=test-key/);
  assert.equal(options.method,'POST');
  assert.ok(options.body instanceof FormData);
  return new Response(JSON.stringify({results:[{score:0.91,species:{scientificName:'Test plant'}}],version:'test'}),{status:200,headers:{'content-type':'application/json'}});
};
res=mockRes();
await handler(req,res);
assert.equal(res.statusCode,200);
assert.equal(res.body.results.length,1);
assert.equal(res.body.source,'Pl@ntNet');
globalThis.fetch=originalFetch;
if(oldKey===undefined) delete process.env.PLANTNET_API_KEY; else process.env.PLANTNET_API_KEY=oldKey;
console.log('plant-identify API tests passed');
