import{_ as n}from"./array.4626e544.js";import{u as c,i,a as p,b as l,c as d}from"./echarts.2c7d4ddc.js";import{d as u,P as r,o as f,q as m,cX as _,c_ as b}from"./vendor.c1777180.js";import"./lodash.52f79bb2.js";import"./ant-design-vue.83e8893e.js";import"./node-forge.5968f396.js";import"./prettier.bc782120.js";const v=u({props:{data:{type:Object,default:()=>({type:"static",data:[]})}},setup(a){const t=r(),e=r();c([i,p,l]);const s=()=>{if(!e.value)return;const o={xAxis:{type:"category"},yAxis:{type:"value"},series:[{type:"bar"}],dataset:{source:a.data.static}};e.value.setOption(o)};return f(()=>{t.value&&(e.value=d(t.value),m(s))}),{bar:t}}}),j={ref:"bar",class:"bar"};function y(a,t,e,s,o,h){return _(),b("div",j,null,512)}var B=n(v,[["render",y]]);export{B as default};