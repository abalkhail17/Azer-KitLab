const crypto = require('node:crypto');
const USER = process.env.KIT_USERNAME;
const PASS = process.env.KIT_PASSWORD;
const ALTUSER = process.env.KIT_TEST_USERNAME;
const ALTPASS = process.env.KIT_TEST_PASSWORD;
const USERALIAS = process.env.KIT_USERNAME_ALIAS;
const SECRET = process.env.KIT_SESSION_SECRET;
const MAX = 20*60*1000;
const lockHeaders = {'Cache-Control':'no-store, private','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
function safeEq(a,b){const x=crypto.createHash('sha256').update(String(a)).digest();const y=crypto.createHash('sha256').update(String(b)).digest();return crypto.timingSafeEqual(x,y);}
function sign(t){return crypto.createHmac('sha256',SECRET).update(t).digest('base64url');}
function cookieOptions(maxAge){return `kit_auth=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;}
exports.handler = async event => {
 if(event.httpMethod !== 'POST') return {statusCode:405,headers:lockHeaders,body:'{"error":"Method not allowed"}'};
 if(!USER||!PASS||!SECRET||SECRET.length<32) return {statusCode:503,headers:lockHeaders,body:'{"error":"Authentication is not configured"}'};
 let data={};try{data=JSON.parse(event.body||'{}')}catch{}
 if(!((safeEq(data.username||'',USER)|| (USERALIAS && safeEq(data.username||'',USERALIAS))) && safeEq(data.password||'',PASS)) && !(ALTUSER && ALTPASS && safeEq(data.username||'',ALTUSER) && safeEq(data.password||'',ALTPASS)))return {statusCode:401,headers:lockHeaders,body:'{"error":"Incorrect username or password"}'};
 const token=String(Date.now())+'.'+crypto.randomBytes(18).toString('hex');
 return {statusCode:200,headers:{...lockHeaders,'Set-Cookie':cookieOptions(MAX/1000).replace('kit_auth=','kit_auth='+token+'.'+sign(token))},body:JSON.stringify({ok:true,expiresInSeconds:1200})};
};
exports.isAuthorized = (event)=>{
 if(!SECRET||SECRET.length<32)return false;
 const cookie=(event.headers.cookie||event.headers.Cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('kit_auth='));
 if(!cookie)return false;
 const value=cookie.slice(9);const parts=value.split('.');if(parts.length!==3)return false;
 const raw=parts[0]+'.'+parts[1];
 if(!safeEq(sign(raw),parts[2]))return false;
 const ts=Number(parts[0]);return Number.isSafeInteger(ts)&&ts<=Date.now()&&Date.now()-ts<MAX;
};
