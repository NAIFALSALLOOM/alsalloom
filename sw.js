/* Alsalloom family app, trial build: keeps the app working offline and opens the right screen when a notification is tapped. */
const CACHE='alsalloom-app-v2';
const SHELL=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/badge-96.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
/* the page itself: network first, so testers always get the newest version; everything else: cache first */
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put('index.html',c));return res}).catch(()=>caches.match('index.html')));return}
  if(u.origin===location.origin||u.host.endsWith('gstatic.com')||u.host.endsWith('googleapis.com')||u.host==='cdnjs.cloudflare.com')
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res})))});
self.addEventListener('notificationclick',e=>{e.notification.close();const open=(e.notification.data&&e.notification.data.open)||'alerts';
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const c of list){if('focus' in c){c.postMessage({open});return c.focus()}}
    return self.clients.openWindow('./#members')}))});
