import{H as c,s as l,n as p}from"./array.458633dd.js";import"./node-forge.8d25fd16.js";import"./ant-design-vue.23bb4852.js";import"./echarts.135e1c00.js";import"./lodash.ca867d26.js";import"./prettier.0c7bff8d.js";import{d as u,v as m,o as _,c_ as d,d1 as n,d9 as f,F as y,d7 as h,u as o,k as g}from"./vendor.e4d4afb2.js";const v=["z-index"],B=u({props:{id:{type:String,default:()=>""}},setup(r){const a=r,s=m([]);return _(async()=>{if(!a.id)return;const e=await c(a.id);document.title=e.data.title,s.value=e.data.components,document.body.style.width=e.data.width+"px",document.body.style.height=e.data.height+"px"}),(e,b)=>(d(!0),n(y,null,f(s.value,(t,i)=>(d(),n("div",{key:t.id,class:"board-wrapper","z-index":i,style:h(o(l)(t.style))},[g(o(p),{data:t,class:"board-component"},null,8,["data"])],12,v))),128))}});export{B as default};