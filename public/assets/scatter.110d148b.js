import{_ as c}from"./index.752285fd.js";import{u as n,i,k as p,b as d,c as l}from"./echarts.c0cd6df1.js";import{d as f,P as r,o as u,q as m,cX as _,c_ as b}from"./vendor.5d3ecb3a.js";import"./ant-design-vue.06bcb110.js";import"./lodash.1c8524b2.js";import"./node-forge.bef54000.js";import"./prettier.685e070b.js";const v=f({props:{data:{type:Object,default:()=>({type:"static",data:[]})}},setup(s){const t=r(),e=r();n([i,p,d]);const a=()=>{if(!e.value)return;const o={xAxis:{},yAxis:{},series:[{type:"scatter",symbolSize:20}],dataset:{source:s.data.static}};e.value.setOption(o)};return u(()=>{t.value&&(e.value=l(t.value),m(a))}),{scatter:t}}}),j={ref:"scatter",class:"scatter"};function h(s,t,e,a,o,x){return _(),b("div",j,null,512)}var B=c(v,[["render",h]]);export{B as default};