import{_ as r}from"./index.752285fd.js";import{u as n,i as l,h as c,b as p,c as d}from"./echarts.c0cd6df1.js";import{d as f,P as i,o as u,q as b,cX as m,c_ as h}from"./vendor.5d3ecb3a.js";import"./ant-design-vue.06bcb110.js";import"./lodash.1c8524b2.js";import"./node-forge.bef54000.js";import"./prettier.685e070b.js";const _=f({props:{data:{type:Object,default:()=>({type:"static",data:[]})}},setup(s){const e=i(),t=i();n([l,c,p]);const a=()=>{if(!t.value)return;const o={series:[{type:"pie",radius:["40%","70%"],avoidLabelOverlap:!1,itemStyle:{borderRadius:10,borderColor:"#fff",borderWidth:2},label:{show:!1,position:"center"},emphasis:{label:{show:!0,fontSize:"40",fontWeight:"bold"}},labelLine:{show:!1}}],dataset:{source:s.data.static}};t.value.setOption(o)};return u(()=>{e.value&&(t.value=d(e.value),b(a))}),{pie:e}}}),v={ref:"pie",class:"pie"};function j(s,e,t,a,o,$){return m(),h("div",v,null,512)}var C=r(_,[["render",j]]);export{C as default};