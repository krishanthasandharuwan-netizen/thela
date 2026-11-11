(() => {
  'use strict';
  const GROUP_LINK = 'https://chat.whatsapp.com/JLyJXWy0EsLGRzQc8TlM93?mode=gi_t';
  const FALLBACK = 'assets/nuwara-eliya-cinematic.webp';
  const $ = (selector, parent=document) => parent.querySelector(selector);
  const $$ = (selector, parent=document) => [...parent.querySelectorAll(selector)];
  const rupees = n => 'Rs. ' + new Intl.NumberFormat('en-LK', {maximumFractionDigits:0}).format(Math.round(n));
  const locations = [
    {id:'gregory',name:'Gregory Lake',subtitle:'Lakeside sunsets & laughs',label:'LAKESIDE EPISODE',photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Nuwara_eliya_gregory_lake.jpg/1280px-Nuwara_eliya_gregory_lake.jpg',description:'A laid-back lakeside hangout with mountain scenery, boating options and a relaxed place to take group photos. A classic Nuwara Eliya stop.',query:'Gregory Lake Nuwara Eliya Sri Lanka'},
    {id:'tea',name:'Tea Country',subtitle:'Green hills. Epic photos.',label:'THE SCENIC ROUTE',photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Tea-plantation_Nuwara_Eliya-2567.jpg/1280px-Tea-plantation_Nuwara_Eliya-2567.jpg',description:'Walk into the famous tea-country landscape and stop for photos, fresh air and a cup of Ceylon tea. A tea estate or factory visit depends on its opening arrangements.',query:'Pedro Tea Estate Nuwara Eliya Sri Lanka'},
    {id:'hakgala',name:'Hakgala Gardens',subtitle:'Flowers & forest vibes',label:'THE GARDEN EPISODE',photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Hakgala_botanical_gardens.jpg/1280px-Hakgala_botanical_gardens.jpg',description:'A colorful botanical garden near Nuwara Eliya with beautifully kept flower beds and cool highland air. Great for a relaxed walk and photos.',query:'Hakgala Botanical Garden Sri Lanka'},
    {id:'lovers',name:"Lover’s Leap",subtitle:'Waterfall adventure',label:'NATURE SPECIAL',photo:'https://upload.wikimedia.org/wikipedia/commons/f/fe/Lover%E2%80%99s_leap.jpg',description:'A waterfall near Nuwara Eliya for the crew who want a nature detour. Check current access, weather and safe walking conditions before visiting.',query:"Lover's Leap Waterfall Nuwara Eliya Sri Lanka"},
    {id:'ambewela',name:'Ambewela Farm',subtitle:'Hilltop countryside stop',label:'COUNTRYSIDE CHAPTER',photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Ambewela_Farms_in_Sri_Lanka.jpg/1280px-Ambewela_Farms_in_Sri_Lanka.jpg',description:'Rolling green hill-country scenery and dairy-farm landscapes. Confirm visitor access, opening times and any ticket arrangements before traveling.',query:'Ambewela Farm Nuwara Eliya Sri Lanka'},
    {id:'horton',name:'Horton Plains',subtitle:'For the early-bird crew',label:'OPTIONAL BONUS EPISODE',photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Horton_plains_Sri_Lanka.jpg/1280px-Horton_plains_Sri_Lanka.jpg',description:'A dramatic high-altitude national park known for hikes and sweeping views. This needs an early start, suitable weather and extra planning, so treat it as an optional extended-day adventure.',query:'Horton Plains National Park Sri Lanka'}
  ];
  const itineraries = {
    '1': [
      ['06:00','The road-trip begins','Proposed departure time — confirm your starting location together.'],
      ['11:00','Gregory Lake','Arrive, stretch, take photos and enjoy the lakeside vibe.'],
      ['13:00','Lunch & chill','Food stop, group photos and a proper recharge.'],
      ['15:00','Tea-country moments','Scenic tea-estate views and fresh hill-country air.'],
      ['19:00','Check-in + night hangout','Dinner, music, jokes and the legendary group chat in real life.']
    ],
    '2': [
      ['08:00','Breakfast together','Wake up to the cold air. No one gets left behind.'],
      ['09:30','Hakgala Gardens','A relaxed visit for garden walks, views and photos.'],
      ['12:30','Countryside detour','Ambewela or another group-approved stop if time allows.'],
      ['15:30','Start the return journey','Timing depends on your actual departure town and route.'],
      ['TBA','The memories drop','Upload the photos. Rewatch the chaos. Plan season two.']
    ]
  };
  const storage = {
    get(key, fallback){try{const val=localStorage.getItem(key);return val===null?fallback:JSON.parse(val)}catch{return fallback}},
    set(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
  };
  let picks = storage.get('thelaflix:picks', []);
  if(!Array.isArray(picks)) picks = [];
  picks = picks.filter(id => locations.some(location => location.id === id));
  let selectedPlaceId = null;
  let toastTimer;
  function toast(message){const node=$('#toast');if(!node)return;node.textContent=message;node.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('show'),3300)}
  function getPhotoURL(url){return url}
  function imageWithFallback(image){image.addEventListener('error',()=>{if(!image.dataset.fallback){image.dataset.fallback='yes';image.src=FALLBACK}}, {once:true})}
  function createCard(place,i){
    const card=document.createElement('article');card.className='place-card';card.tabIndex=0;card.role='button';card.setAttribute('aria-label','Learn more about '+place.name);
    const image=document.createElement('img');image.className='place-image';image.src=getPhotoURL(place.photo);image.alt=place.name+', Nuwara Eliya area';image.loading='lazy';imageWithFallback(image);
    const overlay=document.createElement('div');overlay.className='place-gradient';overlay.setAttribute('aria-hidden','true');
    const number=document.createElement('span');number.className='place-number';number.textContent='0'+(i+1);
    const badge=document.createElement('span');badge.className='place-badge';badge.textContent=i===5?'OPTIONAL':'TOP PICK';
    const info=document.createElement('div');info.className='place-info';
    const genre=document.createElement('div');genre.className='place-genre';genre.textContent=place.label;
    const heading=document.createElement('h3');heading.textContent=place.name;
    const sub=document.createElement('p');sub.textContent=place.subtitle;
    info.append(genre,heading,sub);
    const save=document.createElement('button');save.type='button';save.className='place-save';save.setAttribute('aria-label','Save '+place.name+' to my picks');save.textContent='♡';
    save.addEventListener('click',(event)=>{event.stopPropagation();togglePick(place.id)});
    card.append(image,overlay,number,badge,info,save);
    card.addEventListener('click',()=>openPlace(place.id));
    card.addEventListener('keydown',(event)=>{if(event.target!==card)return;if(event.key==='Enter'||event.key===' '){event.preventDefault();openPlace(place.id)}});
    return card;
  }
  function updatePicks(){
    $$('#placesTrack .place-card').forEach((card,i)=>{const saved=picks.includes(locations[i].id);const button=$('.place-save',card);button.textContent=saved?'♥':'♡';button.classList.toggle('saved',saved);button.setAttribute('aria-pressed',String(saved))});
    $('#picksCount').textContent=String(picks.length);
    const container=$('#pickedPlaces');container.replaceChildren();
    if(!picks.length){const empty=document.createElement('span');empty.className='empty-picks';empty.textContent='No picks yet. Go explore the locations ↑';container.appendChild(empty)}
    else picks.forEach(id=>{const place=locations.find(item=>item.id===id);if(!place)return;const el=document.createElement('span');el.className='picked-chip';el.textContent='♥ '+place.name;container.appendChild(el)});
    if(selectedPlaceId){const button=$('#placeSaveBtn');const chosen=picks.includes(selectedPlaceId);button.textContent=chosen?'♥ Remove from My Picks':'♡ Add to My Picks'}
    storage.set('thelaflix:picks',picks);
  }
  function togglePick(id){if(picks.includes(id)){picks=picks.filter(x=>x!==id);toast('Removed from My Picks')}else{picks.push(id);toast('Added to My Picks ♥')}updatePicks()}
  function openModal(id){const modal=$('#'+id);if(!modal)return;modal.classList.add('visible');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';$('.modal-close',modal)?.focus()}
  function closeModal(id){const modal=$('#'+id);if(!modal)return;modal.classList.remove('visible');modal.setAttribute('aria-hidden','true');if(!$$('.modal.visible').length)document.body.style.overflow=''}
  function openPlace(id){const place=locations.find(x=>x.id===id);if(!place)return;selectedPlaceId=id;$('#placeTitle').textContent=place.name;$('#placeDesc').textContent=place.description;$('#placeModalNumber').textContent=`0${locations.indexOf(place)+1} / 0${locations.length}`;const image=$('#placeModalImage');image.dataset.fallback='';image.src=getPhotoURL(place.photo);image.alt=place.name+' photograph';$('#placeMapLink').href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(place.query);updatePicks();openModal('placeModal')}
  function renderTimeline(day){const container=$('#timelinePanel');container.replaceChildren();itineraries[day].forEach(([time,title,desc])=>{
    const row=document.createElement('div');row.className='timeline-item';
    const t=document.createElement('div');t.className='timeline-time';t.textContent=time;
    const d=document.createElement('div');d.className='timeline-dot-wrap';const dot=document.createElement('div');dot.className='timeline-dot';const line=document.createElement('div');line.className='timeline-line';d.append(dot,line);
    const copy=document.createElement('div');copy.className='timeline-copy';const b=document.createElement('b');b.textContent=title;const p=document.createElement('p');p.textContent=desc;copy.append(b,p);row.append(t,d,copy);container.append(row)
  });$$('.day-tab').forEach(tab=>{const active=tab.dataset.day===day;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1})}
  function dateDisplay(){const value=storage.get('thelaflix:tripDate','');const heading=$('#dateStatusHeading');const text=$('#dateStatusText');if(value&&/^\d{4}-\d\d-\d\d$/.test(value)){const date=new Date(value+'T12:00:00');const pretty=date.toLocaleDateString('en-LK',{day:'numeric',month:'short',year:'numeric'});const today=new Date();today.setHours(0,0,0,0);const target=new Date(value+'T00:00:00');const days=Math.ceil((target-today)/86400000);heading.innerHTML='Your pick: <em></em>';$('em',heading).textContent=pretty;text.textContent=days>0?`${days} days from today. This date is saved only on your device; discuss with the crew.`:'Preferred date saved on this device only — confirm in WhatsApp.';$('#tripDate').value=value;$('#dateSavedMessage').textContent='Saved locally ✓ Final group date is not confirmed.'}else{heading.innerHTML='Date: <em>Coming soon</em>';text.textContent='Pick a date that works for you below. Final date to be decided in the group.'}}
  function updateBudget(){const people=Number($('#peopleRange').value),transport=Number($('#transportRange').value),stay=Number($('#stayRange').value),extras=Number($('#extrasRange').value);const perPerson=(transport/people)+stay+extras;$('#peopleVal').textContent=people;$('#transportVal').textContent=rupees(transport);$('#stayVal').textContent=rupees(stay);$('#extrasVal').textContent=rupees(extras);$('#perPersonCost').textContent=rupees(perPerson);$('#groupTotal').textContent=rupees(transport+people*(stay+extras));$('#peopleTotal').textContent=people+' people'}
  async function copy(text, success){try{if(navigator.clipboard && window.isSecureContext){await navigator.clipboard.writeText(text)}else{const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.left='-9999px';document.body.append(area);area.select();if(!document.execCommand('copy'))throw Error('Clipboard unavailable');area.remove()}toast(success)}catch{toast('Copy failed — please select and copy the text manually.');window.prompt('Copy this text:',text)}}
  function picksText(){const chosen=picks.map(id=>locations.find(place=>place.id===id)?.name).filter(Boolean);const date=storage.get('thelaflix:tripDate','');return `🎬 THELAFLIX — Thela වෙනුවෙන් TRIP එක යමු!\n📍 Nuwara Eliya\n❤️ My place picks: ${chosen.length?chosen.join(', '):'Still deciding'}\n📅 My preferred date: ${date||'Not selected yet'}\n🔗 Join the group: ${GROUP_LINK}\n\nThese are my suggestions, not confirmed bookings.`}
  function init(){
    const track=$('#placesTrack');locations.forEach((place,i)=>track.appendChild(createCard(place,i)));updatePicks();
    $('#railPrev').addEventListener('click',()=>track.scrollBy({left:-350,behavior:'smooth'}));$('#railNext').addEventListener('click',()=>track.scrollBy({left:350,behavior:'smooth'}));
    $$('.day-tab').forEach(tab=>tab.addEventListener('click',()=>renderTimeline(tab.dataset.day)));renderTimeline('1');
    $('#moreInfoBtn').addEventListener('click',()=>openModal('infoModal'));
    $$('[data-close]').forEach(button=>button.addEventListener('click',()=>closeModal(button.dataset.close==='info'?'infoModal':'placeModal')));
    document.addEventListener('keydown',event=>{if(event.key==='Escape')$$('.modal.visible').forEach(modal=>closeModal(modal.id))});
    $('#placeSaveBtn').addEventListener('click',()=>selectedPlaceId&&togglePick(selectedPlaceId));
    $('#saveDateBtn').addEventListener('click',()=>{const value=$('#tripDate').value;if(!value){toast('Choose your preferred date first');return}const chosen=new Date(value+'T00:00:00');const today=new Date();today.setHours(0,0,0,0);if(chosen<today){toast('Choose a future date for the trip');return}storage.set('thelaflix:tripDate',value);dateDisplay();toast('Preferred date saved on this device ✓')});
    const today=new Date();const yyyy=today.getFullYear(),mm=String(today.getMonth()+1).padStart(2,'0'),dd=String(today.getDate()).padStart(2,'0');$('#tripDate').min=`${yyyy}-${mm}-${dd}`;dateDisplay();
    ['peopleRange','transportRange','stayRange','extrasRange'].forEach(id=>$('#'+id).addEventListener('input',updateBudget));updateBudget();
    $('#copyLinkBtn').addEventListener('click',()=>copy(GROUP_LINK,'WhatsApp invite link copied ✓'));
    $('#copyPicksBtn').addEventListener('click',()=>copy(picksText(),'Your trip picks copied ✓'));
    $('#menuToggle').addEventListener('click',()=>{const nav=$('#mobileNav');const isOpen=nav.classList.toggle('open');$('#menuToggle').setAttribute('aria-expanded',String(isOpen));$('#menuToggle').setAttribute('aria-label',isOpen?'Close menu':'Open menu')});
    $$('#mobileNav a').forEach(link=>link.addEventListener('click',()=>{$('#mobileNav').classList.remove('open');$('#menuToggle').setAttribute('aria-expanded','false')}));
    const updateHeader=()=>$('#siteHeader').classList.toggle('scrolled',window.scrollY>45);window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
    if('IntersectionObserver' in window){const sections=$$('main section[id]');const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const section=entry.target.id==='special'?'places':entry.target.id==='date-planner'?'plan':entry.target.id;$$('.desktop-nav .nav-link').forEach(link=>link.classList.toggle('active',link.getAttribute('href')==='#'+section))})},{rootMargin:'-20% 0px -70% 0px'});sections.forEach(section=>observer.observe(section))}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
