(()=>{"use strict";var e={7329:function(e,r,a){var t,o,l=a("8026"),n=a.n(l),u=a("903"),s=a.n(u),i=a("1578"),c=a("7261"),v=a("3678"),f=a("8312"),d=a("5548"),g=a("195"),b=a("7916");a("6056");let C=window.chrome&&window.chrome.storage,h={set(e,r){r="object"==typeof r?JSON.stringify(r):r,window.localStorage.setItem(e,r)},async get(e){let r=window.localStorage.getItem(e);try{return JSON.parse(r)}catch(e){return r}}},p=(e,r)=>{C?window.chrome.storage.local.set({[e]:r}):h.set(e,r)},m=e=>C?new Promise(r=>{window.chrome.storage.local.get([e],a=>{r(a[e])})}):h.get(e),w=function(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=(0,i.iH)(r.default);return(0,i.bv)(async()=>{var t;let o=await m(e)??r.chromeDefault;a.value=o,null===(t=r.onMounted)||void 0===t||t.call(r,o)}),[a,function(r){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];!t&&(a.value=r),p(e,r)}]};var _=a("8218");(t=o||(o={})).springyEmojiCursor="springyEmojiCursor",t.fairyDustCursor="fairyDustCursor",t.snowflakeCursor="snowflakeCursor",t.characterCursor="characterCursor",t.trailingCursor="trailingCursor",t.followingDotCursor="followingDotCursor",t.bubbleCursor="bubbleCursor",t.emojiCursor="emojiCursor",t.ghostCursor="ghostCursor",t.rainbowCursor="rainbowCursor",t.clockCursor="clockCursor",t.textFlag="textFlag";let y=null,{message:U}=(0,c.M)(["message"]),k=async(e,r)=>{let a=e;if(null==y||y.destroy(),!a&&(a=await m("NEW_TAB_CURSOR_EFFECT")),!!a)switch(r&&U.info("\u9F20\u6807\u6548\u679C\u4FEE\u6539\u540E\u9700\u8981\u5237\u65B0\u9875\u9762\u624D\u80FD\u751F\u6548"),a){case"springyEmojiCursor":y=(0,_.Gu)({});return;case"fairyDustCursor":y=(0,_.f4)({});return;case"snowflakeCursor":y=(0,_.be)({});return;case"characterCursor":y=(0,_.Be)({});return;case"trailingCursor":y=(0,_.n8)({});return;case"followingDotCursor":y=(0,_.Y2)({});return;case"bubbleCursor":y=(0,_.gR)({});return;case"emojiCursor":y=(0,_.y5)({});return;case"ghostCursor":y=(0,_.$N)({});return;case"rainbowCursor":y=(0,_.Hy)({});return;case"clockCursor":y=(0,_.N$)({});return;case"textFlag":y=(0,_.$E)({});return}},S={style:{width:"100vw",height:"100vh"}},E={style:{margin:"20px"}},O={style:{margin:"20px"}},j=(0,i._)("a",{href:"https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys",target:"_blank"},"\u70B9\u51FB\u83B7\u53D6",-1),D={style:{margin:"20px"}},x={key:0,style:{"margin-top":"10px"}},T=(0,i._)("a",{href:"https://console.volcengine.com/speech/app",target:"_blank"},"\u70B9\u51FB\u83B7\u53D6",-1),A=(0,i.aZ)({__name:"Options",setup(e){let[r,a]=w("NEW_TAB_CURSOR_EFFECT",{onMounted:e=>{e&&k(e)}}),[t,l]=w("NEW_TAB_ZHI_PU_API_KEY",{default:"",chromeDefault:""}),[n,u]=w("NEW_TAB_TTS_ACCESS_TOKEN",{default:"",chromeDefault:""}),[s,C]=w("NEW_TAB_AUDIO_PLAY_ACTIVE",{default:!1,chromeDefault:!1}),h=[{label:"\u65E0\u6548\u679C",value:""},{value:o.springyEmojiCursor,label:"\u5F39\u6027\u8868\u60C5\u5149\u6807"},{value:o.fairyDustCursor,label:"\u4ED9\u5973\u7C89\u5C18\u5149\u6807"},{value:o.snowflakeCursor,label:"\u96EA\u82B1\u5149\u6807"},{value:o.characterCursor,label:"\u5B57\u7B26\u5149\u6807"},{value:o.trailingCursor,label:"\u62D6\u5C3E\u5149\u6807"},{value:o.followingDotCursor,label:"\u8DDF\u968F\u5149\u6807"},{value:o.bubbleCursor,label:"\u6C14\u6CE1\u5149\u6807"},{value:o.emojiCursor,label:"\u8868\u60C5\u5149\u6807"},{value:o.ghostCursor,label:"\u5E7D\u7075\u5149\u6807"},{value:o.rainbowCursor,label:"\u5F69\u8679\u5149\u6807"},{value:o.clockCursor,label:"\u65F6\u949F\u5149\u6807"},{value:o.textFlag,label:"\u6587\u5B57\u65D7\u5E1C"}],p=e=>{a(e),k(e,!0)},m=async e=>{try{var r;let a=await navigator.mediaDevices.enumerateDevices();e&&(null===(r=a.filter(e=>"audioinput"===e.kind))||void 0===r?void 0:r.length)<=1&&await navigator.mediaDevices.getUserMedia({audio:!0}),C(e)}catch(r){let{message:e}=(0,c.M)(["message"]);e.error("\u8BF7\u5141\u8BB8\u6D4F\u89C8\u5668\u8BBF\u95EE\u9EA6\u514B\u98CE"),C(!1)}};return(e,a)=>((0,i.wg)(),(0,i.j4)((0,i.SU)(v.Z),{locale:(0,i.SU)(f.Z)},{default:(0,i.w5)(()=>[(0,i._)("div",S,[(0,i._)("div",E,[(0,i.Uk)(" \u9F20\u6807\u6548\u679C "),(0,i.Wm)((0,i.SU)(d.Z),{clearable:"",value:(0,i.SU)(r),"onUpdate:value":a[0]||(a[0]=e=>(0,i.dq)(r)?r.value=e:null),options:h,onChange:p},null,8,["value"])]),(0,i._)("div",O,[(0,i.Uk)(" \u667A\u8C31 API Key "),j,(0,i.Wm)((0,i.SU)(g.Z),{clearable:"",value:(0,i.SU)(t),"onUpdate:value":[a[1]||(a[1]=e=>(0,i.dq)(t)?t.value=e:null),(0,i.SU)(l)]},null,8,["value","onUpdate:value"])]),(0,i._)("div",D,[(0,i.Wm)((0,i.SU)(b.Z),{value:(0,i.SU)(s),"onUpdate:value":a[2]||(a[2]=e=>(0,i.dq)(s)?s.value=e:null),onChange:m},null,8,["value"]),(0,i.Uk)(" \u64AD\u653E\u58F0\u97F3(\u4EC5\u5728\u8033\u673A\u6A21\u5F0F\u6216\u8005\u84DD\u7259\u6A21\u5F0F\u4E0B\u751F\u6548) "),(0,i.SU)(s)?((0,i.wg)(),(0,i.iD)("div",x,[(0,i.Uk)(" \u706B\u5C71\u5F15\u64CE TTS accessToken "),T,(0,i.Wm)((0,i.SU)(g.Z),{clearable:"",value:(0,i.SU)(n),"onUpdate:value":[a[3]||(a[3]=e=>(0,i.dq)(n)?n.value=e:null),(0,i.SU)(u)]},null,8,["value","onUpdate:value"])])):(0,i.kq)("",!0)])])]),_:1},8,["locale"]))}});n().extend(s()),(0,i.ri)(A).mount("#app")}},r={};function a(t){var o=r[t];if(void 0!==o)return o.exports;var l=r[t]={id:t,loaded:!1,exports:{}};return e[t].call(l.exports,l,l.exports,a),l.loaded=!0,l.exports}a.m=e,a.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(r,{a:r}),r},a.d=function(e,r){for(var t in r)a.o(r,t)&&!a.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},a.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||Function("return this")()}catch(e){if("object"==typeof window)return window}}(),a.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},a.nmd=function(e){return e.paths=[],!e.children&&(e.children=[]),e},(()=>{var e=[];a.O=function(r,t,o,l){if(t){l=l||0;for(var n=e.length;n>0&&e[n-1][2]>l;n--)e[n]=e[n-1];e[n]=[t,o,l];return}for(var u=1/0,n=0;n<e.length;n++){for(var t=e[n][0],o=e[n][1],l=e[n][2],s=!0,i=0;i<t.length;i++)(!1&l||u>=l)&&Object.keys(a.O).every(function(e){return a.O[e](t[i])})?t.splice(i--,1):(s=!1,l<u&&(u=l));if(s){e.splice(n--,1);var c=o();void 0!==c&&(r=c)}}return r}})(),a.rv=function(){return"1.0.0-beta.5"},(()=>{var e={616:0};a.O.j=function(r){return 0===e[r]};var r=function(r,t){var o=t[0],l=t[1],n=t[2],u,s,i=0;if(o.some(function(r){return 0!==e[r]})){for(u in l)a.o(l,u)&&(a.m[u]=l[u]);if(n)var c=n(a)}for(r&&r(t);i<o.length;i++)s=o[i],a.o(e,s)&&e[s]&&e[s][0](),e[s]=0;return a.O(c)},t=self.webpackChunknew_tab_extension=self.webpackChunknew_tab_extension||[];t.forEach(r.bind(null,0)),t.push=r.bind(null,t.push.bind(t))})(),a.ruid="bundler=rspack@1.0.0-beta.5";var t=a.O(void 0,["139","707","652","921"],function(){return a("7329")});t=a.O(t)})();