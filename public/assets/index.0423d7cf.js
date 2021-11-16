import{e as N,_ as U,l as p,L as _}from"./array.4626e544.js";import{F as f,n as u,I as g,B,m as z}from"./ant-design-vue.83e8893e.js";import{e as L}from"./string.bb6fd376.js";import{t as S}from"./promise.aa1a7cc9.js";import{d as q,cV as E,r as w,dz as V,c_ as O,d5 as k,da as v,u as n,l as o,cZ as i,cX as P,D as R}from"./vendor.c1777180.js";import"./lodash.52f79bb2.js";import"./node-forge.5968f396.js";import"./echarts.2c7d4ddc.js";import"./prettier.bc782120.js";const T=s=>N("login",s);function b(s){s.__i18n=s.__i18n||[],s.__i18n.push({locale:"",resource:{cn:{login:r=>{const{normalize:e}=r;return e(["\u767B\u5F55"])},user:{login:r=>{const{normalize:e,linked:a}=r;return e(["\u7528\u6237",a("login")])},name:r=>{const{normalize:e}=r;return e(["\u7528\u6237\u540D"])},password:r=>{const{normalize:e}=r;return e(["\u5BC6\u7801"])}},validator:{username:r=>{const{normalize:e,linked:a}=r;return e(["\u8BF7\u8F93\u5165",a("user.name")])},password:r=>{const{normalize:e,linked:a}=r;return e(["\u8BF7\u8F93\u5165",a("user.password")])}},notify:{success:r=>{const{normalize:e}=r;return e(["\u767B\u5F55\u6210\u529F\uFF01"])},fail:r=>{const{normalize:e}=r;return e(["\u767B\u5F55\u5931\u8D25\uFF01"])}}},en:{login:r=>{const{normalize:e}=r;return e(["Login"])},user:{login:r=>{const{normalize:e,linked:a}=r;return e(["User ",a("login")])},name:r=>{const{normalize:e}=r;return e(["User Name"])},password:r=>{const{normalize:e}=r;return e(["Password"])}},validator:{username:r=>{const{normalize:e,linked:a}=r;return e(["Please Enter ",a("user.name")])},password:r=>{const{normalize:e,linked:a}=r;return e(["Please Enter ",a("user.password")])}},notify:{success:r=>{const{normalize:e,linked:a}=r;return e([a("login")," Succeed"])},fail:r=>{const{normalize:e,linked:a}=r;return e([a("login")," Failed"])}}}}})}const A={class:"login"},D={class:"login-box"},y=q({props:{redirect:{type:String,default:()=>""}},setup(s){const r=s,{t:e}=E({useScope:"local"}),a=w({name:"ccq",password:"a123456"}),d=w({name:[{required:!0,message:e("validator.username"),trigger:"blur"}],password:[{required:!0,message:e("validator.password"),trigger:"blur"}]}),h=V(),{validate:j}=f.useForm(a,d),I=async()=>{const[c]=await S(j());if(c)return;const{name:l,password:t}=a,m=await T({name:l,password:L(t)});if(m.code===0){const{token:x,name:F}=m.data;p.set(_.AUTHORIZATION,x),p.set(_.USER_INFO,{name:F}),z.success(e("notify.success")),h.push(r.redirect||"/")}else z.error(e("notify.fail"))};return(c,l)=>(P(),O("div",A,[k("div",D,[k("span",null,v(n(e)("user.login")),1),o(n(f),{"hide-required-mark":"","label-align":"left","label-col":{span:8},"wrapper-col":{span:16},model:n(a)},{default:i(()=>[o(n(u),{name:"name",label:n(e)("user.name"),rules:n(d).name},{default:i(()=>[o(n(g),{value:n(a).name,"onUpdate:value":l[0]||(l[0]=t=>n(a).name=t),placeholder:n(e)("user.name")},null,8,["value","placeholder"])]),_:1},8,["label","rules"]),o(n(u),{name:"password",label:n(e)("user.password"),rules:n(d).password},{default:i(()=>[o(n(g),{value:n(a).password,"onUpdate:value":l[1]||(l[1]=t=>n(a).password=t),placeholder:n(e)("user.password")},null,8,["value","placeholder"])]),_:1},8,["label","rules"]),o(n(u),{"wrapper-col":{span:8,offset:8}},{default:i(()=>[o(n(B),{type:"primary",onClick:I},{default:i(()=>[R(v(n(e)("login")),1)]),_:1})]),_:1})]),_:1},8,["model"])])]))}});typeof b=="function"&&b(y);var W=U(y,[["__scopeId","data-v-3a2fafc6"]]);export{W as default};