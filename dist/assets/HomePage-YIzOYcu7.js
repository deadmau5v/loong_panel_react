const __vite__fileDeps=["assets/Charts-BkHcZmEX.js","assets/index-DCRMDEnN.js","assets/react-dom-B_KBoKIY.js","assets/index-Cm-paKVL.css","assets/progress-Cp_dByrN.js","assets/index-UP3Xbl4Q.js","assets/index-DKI7GbiO.js","assets/index-CjouklKV.js","assets/SystemInfo-DVnZBYMx.js","assets/Power-DHXbz2AD.js","assets/button-DEnRpW9g.js","assets/index-CDqw0lfA.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{u as a,j as e,_ as n}from"./index-DCRMDEnN.js";import{r as o}from"./react-dom-B_KBoKIY.js";import{P as r}from"./ProCard-Dqfv741k.js";const d=o.lazy(()=>n(()=>import("./Charts-BkHcZmEX.js"),__vite__mapDeps([0,1,2,3,4,5,6,7]))),l=o.lazy(()=>n(()=>import("./SystemInfo-DVnZBYMx.js"),__vite__mapDeps([8,1,2,3,6,5]))),c=o.lazy(()=>n(()=>import("./Power-DHXbz2AD.js"),__vite__mapDeps([9,1,2,3,6,10,11])));function u(){const s="home",{logined:i}=a();o.useEffect(()=>{i||(window.location.href="/login")},[i]);const t=e.jsx(e.Fragment,{children:e.jsxs(r,{id:"main",bordered:!0,gutter:16,children:[e.jsx(r,{direction:"column",id:"main-l",children:e.jsx(o.Suspense,{fallback:e.jsx("div",{children:"Loading..."}),children:e.jsx(d,{})})}),e.jsx(r,{direction:"column",id:"main-r",colSpan:{xs:"30%",sm:"30%",md:"30%",lg:"30%",xl:"30%"},children:e.jsxs(o.Suspense,{fallback:e.jsx("div",{children:"Loading..."}),children:[e.jsx(l,{}),e.jsx(c,{})]})})]})});return console.log(s),e.jsx(e.Fragment,{children:t})}export{u as default};
