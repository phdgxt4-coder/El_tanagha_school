'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const ic=n=>`<svg class="ic"><use href="#i-${n}"/></svg>`;
const ROLE={student:'طالب',teacher:'مدرس',parent:'ولي أمر'};
const SUBJ=[['math','رياضيات'],['book','لغة عربية'],['globe','لغة إنجليزية'],['atom','فيزياء'],['flask','كيمياء'],['leaf','أحياء'],['hist','تاريخ'],['map','جغرافيا']];
const NEWS=[['إعلان','بدء التسجيل على المنصة','يمكن للطلاب وأولياء الأمور والمدرسين إنشاء حساباتهم الآن.'],['دراسة','المحتوى التعليمي','سيتم رفع الدروس والفيديوهات تباعًا من المدرسين.'],['امتحانات','الامتحانات الإلكترونية','امتحانات بتصحيح تلقائي ونتائج فورية.']];
const ROLES=[['student','طالب','دروس وامتحانات وواجبات ودرجاتك في مكان واحد.'],['teacher','مدرس','ارفع الدروس والفيديوهات وأنشئ الامتحانات وسجّل الحضور.'],['parent','ولي أمر','تابع حضور ابنك ودرجاته ورسائل المدرسة.']];
const IL={student:'<rect x="30" y="38" width="100" height="44" rx="8" fill="#e8f6fa"/><circle cx="80" cy="24" r="14" fill="#1f7f95"/><rect x="46" y="48" width="68" height="6" rx="3" fill="#5cc3d9"/><rect x="46" y="62" width="44" height="6" rx="3" fill="#c9a24b" opacity=".6"/>',
teacher:'<rect x="20" y="10" width="120" height="58" rx="8" fill="#e8f6fa"/><path d="M40 52l22-20 18 14 26-24" fill="none" stroke="#1f7f95" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><rect x="62" y="74" width="36" height="6" rx="3" fill="#0b2545"/>',
parent:'<circle cx="56" cy="30" r="14" fill="#0b2545"/><circle cx="100" cy="40" r="10" fill="#5cc3d9"/><rect x="34" y="50" width="44" height="30" rx="14" fill="#1f7f95"/><rect x="84" y="54" width="32" height="26" rx="12" fill="#e8f6fa"/>'};
const DASH={
student:{nav:[['home','الرئيسية'],['book','المواد'],['file','الواجبات'],['edit','الامتحانات'],['video','الفيديوهات'],['up','الملفات'],['cal','الجدول'],['chart','الدرجات']],qa:['المواد','الواجبات','الامتحانات','الفيديوهات'],st:[['المواد','8'],['واجبات معلقة','0'],['متوسط الدرجات','—']]},
teacher:{nav:[['home','الرئيسية'],['up','رفع الدروس'],['video','رفع الفيديوهات'],['edit','إنشاء امتحان'],['check','التصحيح'],['users','تسجيل الحضور'],['bell','إرسال إشعارات']],qa:['رفع درس','رفع فيديو','إنشاء امتحان','تسجيل الحضور'],st:[['الطلاب','0'],['الدروس المرفوعة','0'],['امتحانات نشطة','0']]},
parent:{nav:[['home','الرئيسية'],['users','حضور الابن'],['chart','درجاته'],['file','الواجبات'],['msg','رسائل المدرسة']],qa:['حضور الابن','الدرجات','الواجبات','الرسائل'],st:[['نسبة الحضور','—'],['آخر درجة','—'],['رسائل جديدة','0']]}};
const WG=[['آخر الدروس','لا توجد دروس بعد','سيظهر هنا ما يرفعه المدرسون'],['الامتحانات القادمة','لا توجد امتحانات','ستظهر مواعيدها هنا'],['آخر الإشعارات','مرحبًا بك في المنصة','الآن']];
/* helpers */
function toast(t){const m=document.createElement('div');m.className='msg';m.textContent=t;document.body.append(m);setTimeout(()=>m.remove(),2200)}
function view(v){['login','app'].forEach(x=>$('#'+x).classList.toggle('on',x===v));$('#site').style.display=v?'none':'';scrollTo(0,0)}
document.addEventListener('click',e=>{const b=e.target.closest('.btn,.qa button');if(!b)return;const r=b.getBoundingClientRect(),s=document.createElement('span'),d=Math.max(r.width,r.height);
 s.className='rp';s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;b.append(s);setTimeout(()=>s.remove(),600)});
/* landing content */
$('#roleGrid').innerHTML=ROLES.map(([k,t,d])=>`<div class="card role rv"><svg class="il" viewBox="0 0 160 90">${IL[k]}</svg><h4>${t}</h4><p>${d}</p><button class="btn" data-login data-r="${k}">دخول</button></div>`).join('');
$('#subGrid').innerHTML=SUBJ.map(([i,t])=>`<div class="card sub rv"><div class="ico">${ic(i)}</div><h4>${t}</h4></div>`).join('');
$('#newsGrid').innerHTML=NEWS.map(([g,t,d])=>`<div class="card news rv"><div class="ph"></div><span class="tag">${g}</span><h4>${t}</h4><p>${d}</p></div>`).join('');
$('#stats').innerHTML=[[3,'صفوف دراسية'],[8,'مواد'],[100,'درس ومحتوى (هدف)'],[24,'ساعة متاحة يوميًا']].map(([n,l])=>`<div class="rv"><b data-n="${n}">0</b><span>${l}</span></div>`).join('');
/* nav + scroll */
const nav=$('#nav'),mock=$('#mock');
addEventListener('scroll',()=>{nav.classList.toggle('s',scrollY>20);if(scrollY<700&&innerWidth>860)mock.style.transform=`translateY(${scrollY*-.04}px)`},{passive:true});
$('#burger').onclick=()=>$('#links').classList.toggle('o');$$('#links a').forEach(a=>a.onclick=()=>$('#links').classList.remove('o'));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);const c=e.target.querySelector('[data-n]');if(c)count(c)}),{threshold:.15});
$$('.rv').forEach((el,i)=>{el.style.transitionDelay=(i%4)*.08+'s';io.observe(el)});
function count(el){const t=+el.dataset.n,s=performance.now();(function f(n){const p=Math.min((n-s)/1400,1);el.textContent=Math.round(t*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(s)}
/* auth (demo: بيانات محلية على نفس الجهاز لحد ما نربط Firebase) */
let role='student',signup=false;
async function hash(s){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){return btoa(unescape(encodeURIComponent(s)))}}
const users=()=>{try{return JSON.parse(localStorage.getItem('tn_users')||'[]')}catch(e){return[]}};
function mode(s){signup=s;$('#lt').textContent=s?'إنشاء حساب':'تسجيل الدخول';$('#nmWrap').hidden=!s;$('#sw').textContent=s?'لديك حساب؟ تسجيل الدخول':'ليس لديك حساب؟ إنشاء حساب';$('#er').textContent=''}
function setRole(r){role=r;$$('#seg button').forEach(b=>b.classList.toggle('on',b.dataset.r===r))}
$$('#seg button').forEach(b=>b.onclick=()=>setRole(b.dataset.r));
$$('[data-login]').forEach(b=>b.onclick=()=>{if(b.dataset.r)setRole(b.dataset.r);mode(b.dataset.login==='signup');view('login')});
$$('[data-home]').forEach(b=>b.onclick=()=>view(''));
$('#sw').onclick=()=>mode(!signup);
$('#go').onclick=async()=>{const er=$('#er'),ph=$('#ph').value.trim(),pw=$('#pw').value,nm=$('#nm').value.trim();
 if(!/^01\d{9}$/.test(ph))return er.textContent='رقم الهاتف غير صحيح (11 رقم يبدأ بـ 01)';
 if(pw.length<6)return er.textContent='كلمة المرور لا تقل عن 6 أحرف';
 const h=await hash(pw),a=users();let u;
 if(signup){if(!nm)return er.textContent='اكتب اسمك';if(a.some(x=>x.phone===ph))return er.textContent='هذا الرقم مسجل من قبل';
  u={role,name:nm,phone:ph,pw:h};a.push(u);try{localStorage.setItem('tn_users',JSON.stringify(a))}catch(e){}}
 else{u=a.find(x=>x.phone===ph&&x.pw===h);if(!u)return er.textContent='الرقم أو كلمة المرور غير صحيحة'}
 try{localStorage.setItem('tn_cur',u.phone)}catch(e){}openApp(u)};
/* dashboard */
function openApp(u){const d=DASH[u.role];
 $('#app').innerHTML=`<aside class="side" id="side"><a class="brand"><svg class="logo"><use href="#i-logo"/></svg><span>التناغة الشرقية<small>${ROLE[u.role]}</small></span></a>
 ${d.nav.map(([i,t],k)=>`<a class="${k?'':'on'}">${ic(i)}${t}</a>`).join('')}<a class="out" id="out">${ic('out')}تسجيل الخروج</a></aside>
 <div class="main"><div class="topb"><button class="mb" id="mb">${ic('menu')}</button><h3>أهلاً ${u.name}</h3><span style="color:var(--mu)">${ic('bell')}</span><div class="av">${u.name[0]}</div></div>
 <div class="qa">${d.qa.map(q=>`<button>${ic('arrow')}${q}</button>`).join('')}</div>
 <div class="st">${d.st.map(([l,v])=>`<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>
 <div class="wg" id="wg">${WG.map(()=>'<div class="w"><div class="sk" style="width:50%"></div><div class="sk"></div><div class="sk" style="width:70%"></div></div>').join('')}</div></div>`;
 view('app');
 setTimeout(()=>{$('#wg').innerHTML=WG.map(([h,a,b])=>`<div class="w"><h5>${h}</h5><div class="li">${a}<span>${b}</span></div></div>`).join('')},700);
 $('#out').onclick=()=>{try{localStorage.removeItem('tn_cur')}catch(e){}view('')};
 $('#mb').onclick=()=>$('#side').classList.toggle('o');
 $$('.side a:not(.brand):not(.out)').forEach(a=>a.onclick=()=>{$$('.side a').forEach(x=>x.classList.remove('on'));a.classList.add('on');$('#side').classList.remove('o')});
 $$('.qa button').forEach(b=>b.onclick=()=>toast('هذا القسم قيد التجهيز'))}
try{const c=localStorage.getItem('tn_cur'),u=users().find(x=>x.phone===c);if(u)openApp(u)}catch(e){}
