import{_ as n}from"./index.752285fd.js";import{u as c,i,a as p,b as d,c as l}from"./echarts.c0cd6df1.js";import{d as f,P as r,o as u,q as b,cX as m,c_ as _}from"./vendor.5d3ecb3a.js";import"./ant-design-vue.06bcb110.js";import"./lodash.1c8524b2.js";import"./node-forge.bef54000.js";import"./prettier.685e070b.js";const v=f({props:{data:{type:Object,default:()=>({type:"static",data:[]})}},setup(a){const t=r(),e=r();c([i,p,d]);const s=()=>{if(!e.value)return;const o={xAxis:{type:"category"},yAxis:{type:"value"},series:[{type:"bar"}],dataset:{source:a.data.static}};e.value.setOption(o)};return u(()=>{t.value&&(e.value=l(t.value),b(s))}),{bar:t}}}),j={ref:"bar",class:"bar"};function h(a,t,e,s,o,x){return m(),_("div",j,null,512)}var B=n(v,[["render",h]]);export{B as default};