import{l as c}from"./node-forge.c92fc5b0.js";import{db as o}from"./vendor.b44267a2.js";const i=n=>{const t=`-----BEGIN PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsY5F3PhCnLewFmZBYki2
  U3OAgQt1NL+7rtguZfVSJq1Feo5LWbSigR4/CxPNYq4uyHqYDlDveg2oKe1Hzzhw
  9Y3mCypje1Pnmv5UXBZ/Wk9aE+f2uhTx3e3UEHuml6+H+CsZbavA4o4W5Picv4hN
  CmQpbIvsgMOMBaZnaA8gbfc4wUOYd2Mik68tzhm0Y4+z/NkoGRyQujtpL/Dxanzn
  S6pkzqLmGgWiw9skKDhHxsbk93/Hps2pvGzyynftnpsZKpFKirfhhfZAZrzV2vdw
  1yTDx9E91d7wBFJvo4mElf9bBYQXWegnFaVl2A8sSMkvu8HUHNoRqx07ACwvMom5
  SQIDAQAB
  -----END PUBLIC KEY-----`;try{const r=c.pki.publicKeyFromPem(t).encrypt(encodeURIComponent(n),"RSA-OAEP");return btoa(unescape(encodeURIComponent(r)))}catch(e){return e}},b=(n,t)=>{const e=new Function("data",`return (${n})(data)`);return o.stringify(e(o.parse(t||"[]")))};export{b as c,i as e};
