(()=>{"use strict";var r={7329:function(r,e,o){var t,n,u=o("8026"),a=o.n(u),l=o("903"),s=o.n(l),i=o("1578"),c=o("5718");o("6056");let f=window.chrome&&window.chrome.storage,b={set(r,e){e="object"==typeof e?JSON.stringify(e):e,window.localStorage.setItem(r,e)},async get(r){let e=window.localStorage.getItem(r);try{return JSON.parse(e)}catch(r){return e}}},C=(r,e)=>{f?window.chrome.storage.local.set({[r]:e}):b.set(r,e)},v=r=>f?new Promise(e=>{window.chrome.storage.local.get([r],o=>{e(o[r])})}):b.get(r),g=function(r){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=(0,i.iH)(e.default);return(0,i.bv)(async()=>{var t;let n=await v(r)??e.chromeDefault;o.value=n,null===(t=e.onMounted)||void 0===t||t.call(e,n)}),[o,function(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];!t&&(o.value=e),C(r,e)}]};var d=o("8218"),h=o("6895");(t=n||(n={})).springyEmojiCursor="springyEmojiCursor",t.fairyDustCursor="fairyDustCursor",t.snowflakeCursor="snowflakeCursor",t.characterCursor="characterCursor",t.trailingCursor="trailingCursor",t.followingDotCursor="followingDotCursor",t.bubbleCursor="bubbleCursor",t.emojiCursor="emojiCursor",t.ghostCursor="ghostCursor",t.rainbowCursor="rainbowCursor",t.clockCursor="clockCursor",t.textFlag="textFlag";let w=null,{message:p}=(0,h.M)(["message"]),y=async(r,e)=>{let o=r;if(null==w||w.destroy(),!o&&(o=await v("NEW_TAB_CURSOR_EFFECT")),!!o)switch(e&&p.info("\u9F20\u6807\u6548\u679C\u4FEE\u6539\u540E\u9700\u8981\u5237\u65B0\u9875\u9762\u624D\u80FD\u751F\u6548"),o){case"springyEmojiCursor":w=(0,d.Gu)({});return;case"fairyDustCursor":w=(0,d.f4)({});return;case"snowflakeCursor":w=(0,d.be)({});return;case"characterCursor":w=(0,d.Be)({});return;case"trailingCursor":w=(0,d.n8)({});return;case"followingDotCursor":w=(0,d.Y2)({});return;case"bubbleCursor":w=(0,d.gR)({});return;case"emojiCursor":w=(0,d.y5)({});return;case"ghostCursor":w=(0,d.$N)({});return;case"rainbowCursor":w=(0,d.Hy)({});return;case"clockCursor":w=(0,d.N$)({});return;case"textFlag":w=(0,d.$E)({});return}},m={style:{width:"100vw",height:"100vh"}},O={style:{margin:"20px"}},j=(0,i.aZ)({__name:"Options",setup(r){let[e,o]=g("NEW_TAB_CURSOR_EFFECT",{onMounted:r=>{r&&y(r)}}),t=[{label:"\u65E0\u6548\u679C",value:""},{value:n.springyEmojiCursor,label:"\u5F39\u6027\u8868\u60C5\u5149\u6807"},{value:n.fairyDustCursor,label:"\u4ED9\u5973\u7C89\u5C18\u5149\u6807"},{value:n.snowflakeCursor,label:"\u96EA\u82B1\u5149\u6807"},{value:n.characterCursor,label:"\u5B57\u7B26\u5149\u6807"},{value:n.trailingCursor,label:"\u62D6\u5C3E\u5149\u6807"},{value:n.followingDotCursor,label:"\u8DDF\u968F\u5149\u6807"},{value:n.bubbleCursor,label:"\u6C14\u6CE1\u5149\u6807"},{value:n.emojiCursor,label:"\u8868\u60C5\u5149\u6807"},{value:n.ghostCursor,label:"\u5E7D\u7075\u5149\u6807"},{value:n.rainbowCursor,label:"\u5F69\u8679\u5149\u6807"},{value:n.clockCursor,label:"\u65F6\u949F\u5149\u6807"},{value:n.textFlag,label:"\u6587\u5B57\u65D7\u5E1C"}],u=r=>{o(r),y(r,!0)};return(r,o)=>((0,i.wg)(),(0,i.iD)("div",m,[(0,i._)("div",O,[(0,i.Uk)(" \u9F20\u6807\u6548\u679C "),(0,i.Wm)((0,i.SU)(c.Z),{clearable:"",value:(0,i.SU)(e),"onUpdate:value":o[0]||(o[0]=r=>(0,i.dq)(e)?e.value=r:null),options:t,onChange:u},null,8,["value"])])]))}});a().extend(s()),(0,i.ri)(j).mount("#app")}},e={};function o(t){var n=e[t];if(void 0!==n)return n.exports;var u=e[t]={id:t,loaded:!1,exports:{}};return r[t].call(u.exports,u,u.exports,o),u.loaded=!0,u.exports}o.m=r,o.n=function(r){var e=r&&r.__esModule?function(){return r.default}:function(){return r};return o.d(e,{a:e}),e},o.d=function(r,e){for(var t in e)o.o(e,t)&&!o.o(r,t)&&Object.defineProperty(r,t,{enumerable:!0,get:e[t]})},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||Function("return this")()}catch(r){if("object"==typeof window)return window}}(),o.o=function(r,e){return Object.prototype.hasOwnProperty.call(r,e)},o.nmd=function(r){return r.paths=[],!r.children&&(r.children=[]),r},(()=>{var r=[];o.O=function(e,t,n,u){if(t){u=u||0;for(var a=r.length;a>0&&r[a-1][2]>u;a--)r[a]=r[a-1];r[a]=[t,n,u];return}for(var l=1/0,a=0;a<r.length;a++){for(var t=r[a][0],n=r[a][1],u=r[a][2],s=!0,i=0;i<t.length;i++)(!1&u||l>=u)&&Object.keys(o.O).every(function(r){return o.O[r](t[i])})?t.splice(i--,1):(s=!1,u<l&&(l=u));if(s){r.splice(a--,1);var c=n();void 0!==c&&(e=c)}}return e}})(),o.rv=function(){return"1.0.0-beta.5"},(()=>{var r={616:0};o.O.j=function(e){return 0===r[e]};var e=function(e,t){var n=t[0],u=t[1],a=t[2],l,s,i=0;if(n.some(function(e){return 0!==r[e]})){for(l in u)o.o(u,l)&&(o.m[l]=u[l]);if(a)var c=a(o)}for(e&&e(t);i<n.length;i++)s=n[i],o.o(r,s)&&r[s]&&r[s][0](),r[s]=0;return o.O(c)},t=self.webpackChunknew_tab_extension=self.webpackChunknew_tab_extension||[];t.forEach(e.bind(null,0)),t.push=e.bind(null,t.push.bind(t))})(),o.ruid="bundler=rspack@1.0.0-beta.5";var t=o.O(void 0,["139","707","710","434"],function(){return o("7329")});t=o.O(t)})();