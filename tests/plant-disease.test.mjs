import assert from 'node:assert/strict';
import handler from '../api/plant-disease.js';
function response(){return{statusCode:200,body:null,setHeader(){},status(n){this.statusCode=n;return this;},json(v){this.body=v;return this;}}}
async function* stream(buf){yield buf;}
const previous=process.env.PLANTNET_API_KEY;delete process.env.PLANTNET_API_KEY;
let res=response();await handler({method:'POST',headers:{'content-type':'multipart/form-data; boundary=x'},[Symbol.asyncIterator]:()=>stream(Buffer.alloc(0))},res);
assert.equal(res.statusCode,503);assert.match(res.body.error,/PLANTNET_API_KEY/);
process.env.PLANTNET_API_KEY='test-key';const boundary='----disease-test';const image=Buffer.from([0xff,0xd8,0xff,0xd9]);
const body=Buffer.concat([Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="leaf.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`),image,Buffer.from(`\r\n--${boundary}--\r\n`)]);
const req={method:'POST',headers:{'content-type':`multipart/form-data; boundary=${boundary}`},[Symbol.asyncIterator]:()=>stream(body)};
const oldFetch=globalThis.fetch;globalThis.fetch=async(url,options)=>{assert.match(String(url),/my-api\.plantnet\.org\/v2\/diseases\/identify/);assert.match(String(url),/api-key=test-key/);assert.ok(options.body instanceof FormData);return new Response(JSON.stringify({results:[{name:'TEST',description:'Test disease',score:.87}],version:'test-v',remainingIdentificationRequests:499}),{status:200,headers:{'content-type':'application/json'}})};
res=response();await handler(req,res);assert.equal(res.statusCode,200);assert.equal(res.body.results[0].name,'TEST');assert.equal(res.body.source,'Pl@ntNet disease identification');
globalThis.fetch=oldFetch;if(previous===undefined)delete process.env.PLANTNET_API_KEY;else process.env.PLANTNET_API_KEY=previous;
console.log('plant-disease API tests passed');
