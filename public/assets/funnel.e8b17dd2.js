import{_ as i}from"./array.4626e544.js";import{u as r,i as l,d as u,b as c,c as d}from"./echarts.2c7d4ddc.js";import{d as p,P as n,o as f,q as m,cX as b,c_ as h}from"./vendor.c1777180.js";import"./lodash.52f79bb2.js";import"./ant-design-vue.83e8893e.js";import"./node-forge.5968f396.js";import"./prettier.bc782120.js";const _=p({props:{data:{type:Object,default:()=>({type:"static",data:[]})}},setup(s){const e=n(),t=n();r([l,u,c]);const a=()=>{if(!t.value)return;const o={tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c}%"},legend:{data:["\u5C55\u73B0","\u70B9\u51FB","\u8BBF\u95EE","\u54A8\u8BE2","\u8BA2\u5355"]},series:[{name:"\u6F0F\u6597\u56FE",type:"funnel",left:"10%",top:60,bottom:60,width:"80%",min:0,max:100,minSize:"0%",maxSize:"100%",sort:"descending",gap:2,label:{show:!0,position:"inside"},labelLine:{length:10,lineStyle:{width:1,type:"solid"}},itemStyle:{borderColor:"#fff",borderWidth:1},emphasis:{label:{fontSize:20}}}],dataset:{source:s.data.static}};t.value.setOption(o)};return f(()=>{e.value&&(t.value=d(e.value),m(a))}),{funnel:e}}}),v={ref:"funnel",class:"funnel"};function B(s,e,t,a,o,g){return b(),h("div",v,null,512)}var S=i(_,[["render",B]]);export{S as default};