'use strict';
/* LYNX Curators — standalone interactive demo. No backend or external JS required. */
const $ = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => Array.from(root.querySelectorAll(q));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ICONS = {
  book:'<path d="M4 5c3-2 6-2 8 0 2-2 5-2 8 0v14c-3-2-6-2-8 0-2-2-5-2-8 0z"/><path d="M12 5v14"/>',
  chart:'<path d="M4 20V11m5 9V5m6 15v-8m5 8V8"/>',
  coins:'<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v7c0 2 12 4 12 0V7M3 11c0 2 12 4 12 0"/><path d="M17 10c6-1 7 4 0 5m-2 3c8 3 9-2 4-3"/>',
  users:'<circle cx="9" cy="9" r="3"/><path d="M2 20c.5-5 3-7 7-7s6.5 2 7 7"/><path d="M16 6a3 3 0 0 1 0 6m2 2c2 1 3 3 3 6"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  bookOpen:'<path d="M3 5c3-2 6-2 9 1 3-3 6-3 9-1v14c-3-2-6-2-9 1-3-3-6-3-9-1z"/><path d="M12 6v14"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
  external:'<path d="M13 5h6v6m0-6-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
  rocket:'<path d="M7 17c-1-5 2-10 11-13 3 9-1 12-7 13"/><path d="m7 17-3 3 1-5m6 2-2 3m0-11 5 5"/><circle cx="14" cy="10" r="1"/>',
  shield:'<path d="m12 2 8 4v6c0 5-4 8-8 10-4-2-8-5-8-10V6z"/><path d="m9 12 2 2 4-4"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bolt:'<path d="M13 2 5 14h6l-1 8 9-13h-6z"/>',
  filter:'<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  star:'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',
  heart:'<path d="M12 21s-9-5-9-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 11-9 11z"/>',
  bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-4 4-4 14 0 18m0-18c4 4 4 14 0 18"/>',
  folder:'<path d="M3 6h7l2 3h9v10H3z"/>',
  play:'<path d="m7 4 13 8-13 8z"/>',
  spark:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>',
  code:'<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/>',
  search:'<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>'
};
const ic = (name, cls='')=>'<svg class="'+cls+'" viewBox="0 0 24 24" aria-hidden="true">'+(ICONS[name]||ICONS.spark)+'</svg>';
const materials=[
 {id:'earn',name:'Полный гайд по заработку в интернете',short:'Практический старт: направления, инструменты и первые шаги.',cat:'Заработок',type:'Курс',level:'Новичок',time:'42 урока',views:'32.4K',badge:'НОВИНКА',symbol:'01',read:'8 мин'},
 {id:'traffic',name:'Арбитраж трафика с нуля',short:'Как устроены рекламные кампании, аудитория и аналитика.',cat:'Маркетинг',type:'Курс',level:'Средний',time:'28 уроков',views:'24.5K',badge:'ПОПУЛЯРНОЕ',symbol:'↗',read:'12 мин'},
 {id:'crypto',name:'Криптовалюта: базовый курс',short:'Блокчейн, кошельки, безопасность и риски без лишней сложности.',cat:'Криптовалюта',type:'Гайд',level:'Новичок',time:'36 уроков',views:'19.8K',badge:'ГАЙД',symbol:'₿',read:'10 мин'},
 {id:'focus',name:'Продуктивность и саморазвитие',short:'Задачи, привычки, концентрация и цифровой порядок.',cat:'Развитие',type:'Статья',level:'Новичок',time:'8 мин',views:'17.7K',badge:'ПРАКТИКА',symbol:'✳',read:'8 мин'},
 {id:'telegram',name:'Telegram: запуск и развитие канала',short:'Оформление, контент-план, публикации и статистика.',cat:'Telegram',type:'Гайд',level:'Средний',time:'19 уроков',views:'15.2K',badge:'ГАЙД',symbol:'➤',read:'15 мин'},
 {id:'design',name:'Дизайн для социальных сетей',short:'Базовые принципы композиции и готовые шаблоны.',cat:'Дизайн',type:'Видео',level:'Новичок',time:'12 видео',views:'9.4K',badge:'ВИДЕО',symbol:'◈',read:'7 мин'},
 {id:'seo',name:'Как анализировать поисковый спрос',short:'Работа с запросами, конкурентами и метриками.',cat:'Маркетинг',type:'Статья',level:'Средний',time:'11 мин',views:'7.7K',symbol:'SEO',read:'11 мин'},
 {id:'bots',name:'Введение в Telegram-ботов',short:'Архитектура команд, кнопок и автоматизации.',cat:'Telegram',type:'Курс',level:'Средний',time:'14 уроков',views:'8.5K',symbol:'BOT',read:'9 мин'},
 {id:'budget',name:'Личный бюджет: основы',short:'Планирование расходов, резервов и финансовых целей.',cat:'Развитие',type:'Гайд',level:'Новичок',time:'6 уроков',views:'6.9K',symbol:'$',read:'6 мин'},
 {id:'ai',name:'ИИ-инструменты для ежедневной работы',short:'Подборка сценариев для текста, данных и идей.',cat:'Инструменты',type:'Подборка',level:'Новичок',time:'21 сервис',views:'12.1K',symbol:'AI',read:'9 мин'},
 {id:'security',name:'Цифровая безопасность: чек-лист',short:'Пароли, двухфакторная защита и приватность.',cat:'Инструменты',type:'Чек-лист',level:'Новичок',time:'15 шагов',views:'5.1K',symbol:'◎',read:'5 мин'},
 {id:'content',name:'Создание контент-плана',short:'От идеи к публикации: регулярность и метрики.',cat:'Дизайн',type:'Статья',level:'Средний',time:'13 мин',views:'7.3K',symbol:'✎',read:'13 мин'}
];
const tools=[
 {id:'notion',name:'Notion',letter:'N',subtitle:'Заметки и организация',description:'Рабочее пространство для заметок, проектов и баз знаний.',cat:'Продуктивность',url:'https://www.notion.so/',tags:['Заметки','Работа'],rating:'4.8'},
 {id:'chatgpt',name:'ChatGPT',letter:'✳',subtitle:'ИИ-ассистент',description:'Помощь с идеями, письмом, обучением и исследованиями.',cat:'ИИ',url:'https://chatgpt.com/',tags:['Тексты','ИИ'],rating:'4.9'},
 {id:'tradingview',name:'TradingView',letter:'↗',subtitle:'Графики и аналитика',description:'Интерактивные графики и инструменты рыночного анализа.',cat:'Аналитика',url:'https://www.tradingview.com/',tags:['Графики','Данные'],rating:'4.8'},
 {id:'capcut',name:'CapCut',letter:'✕',subtitle:'Видеомонтаж',description:'Редактирование видео, титры, монтаж и шаблоны.',cat:'Видео',url:'https://www.capcut.com/',tags:['Монтаж','Контент'],rating:'4.7'},
 {id:'telegram',name:'Telegram',letter:'➤',subtitle:'Коммуникация',description:'Общение, каналы, боты и собственное сообщество.',cat:'Коммуникации',url:'https://telegram.org/',tags:['Каналы','Боты'],rating:'4.8'},
 {id:'figma',name:'Figma',letter:'F',subtitle:'Интерфейсы и дизайн',description:'Прототипирование, интерфейсы и командный дизайн.',cat:'Дизайн',url:'https://www.figma.com/',tags:['UI','Прототипы'],rating:'4.9'},
 {id:'canva',name:'Canva',letter:'C',subtitle:'Визуальный контент',description:'Простые макеты, презентации и материалы для соцсетей.',cat:'Дизайн',url:'https://www.canva.com/',tags:['Графика','Шаблоны'],rating:'4.7'},
 {id:'trends',name:'Google Trends',letter:'G',subtitle:'Исследование спроса',description:'Изучение динамики популярности поисковых запросов.',cat:'Аналитика',url:'https://trends.google.com/',tags:['Поиск','Маркетинг'],rating:'4.7'},
 {id:'github',name:'GitHub',letter:'⌘',subtitle:'Код и проекты',description:'Репозитории, контроль версий и совместная разработка.',cat:'Разработка',url:'https://github.com/',tags:['Git','Код'],rating:'4.8'}
];
const cats=[
 ['Заработок','coins','8 материалов'],['Криптовалюта','globe','6 материалов'],['Маркетинг','chart','9 материалов'],['Развитие','heart','7 материалов'],['Инструменты','code','11 материалов'],['Дизайн','spark','8 материалов']
];
const state={materialCategory:'Все',materialType:'Все',materialLevel:'Все',materialSort:'popular',materialQuery:'',toolCategory:'Все',toolQuery:'',toolFavorites:false};
const favKey='lynx-favorites-v1';
let favoriteIds;
try {favoriteIds=JSON.parse(localStorage.getItem(favKey)||'[]')}catch(e){favoriteIds=[]}
if(!Array.isArray(favoriteIds))favoriteIds=[];
const saveFav=()=>{try{localStorage.setItem(favKey,JSON.stringify(favoriteIds))}catch(e){}};
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(window._tt);window._tt=setTimeout(()=>el.classList.remove('show'),2600)}
function saveFavorite(id){if(favoriteIds.includes(id)){favoriteIds=favoriteIds.filter(x=>x!==id);toast('Удалено из избранного')}else{favoriteIds.push(id);toast('Добавлено в избранное')}saveFav();render()}
function favoriteButton(id){return '<button class="favorite'+(favoriteIds.includes(id)?' saved':'')+'" data-fav="'+esc(id)+'" aria-label="'+(favoriteIds.includes(id)?'Удалить из избранного':'В избранное')+'">'+ic('bookmark')+'</button>'}
function matCard(m){return '<article class="material-card"><a href="#/material/'+esc(m.id)+'" aria-label="Открыть '+esc(m.name)+'"><div class="material-cover"><span class="cover-symbol">'+(m.id==='telegram'?'<img class="material-brand-img" src="assets/brands/telegram.svg" alt="Telegram" width="66" height="66" loading="eager">':esc(m.symbol))+'</span>'+(m.badge?'<span class="cover-badge">'+esc(m.badge)+'</span>':'')+'</div></a><div class="material-body"><div class="tags"><span class="tag">'+esc(m.cat)+'</span><span class="tag">'+esc(m.type)+'</span></div><a href="#/material/'+esc(m.id)+'"><h3>'+esc(m.name)+'</h3></a><div class="material-desc">'+esc(m.short)+'</div><div class="material-meta"><span>'+ic('book')+' '+esc(m.time)+'</span><span>'+ic('chart')+' '+esc(m.views)+'</span></div><div class="card-footer"><span class="tag">'+esc(m.level)+'</span><span style="display:flex;gap:6px">'+favoriteButton('m:'+m.id)+'<a class="card-arrow" href="#/material/'+esc(m.id)+'" aria-label="Открыть">'+ic('arrow')+'</a></span></div></div></article>'}
const BRAND_LOGOS = Object.freeze({
 notion:'notion', chatgpt:'chatgpt', tradingview:'tradingview',
 capcut:'capcut', telegram:'telegram', figma:'figma',
 canva:'canva', trends:'googletrends', github:'github'
});
function brandIcon(t, variant='standard'){
 const brand=BRAND_LOGOS[t.id];
 if(!brand) return '<span class="tool-logo">'+esc(t.letter)+'</span>';
 const alt=esc(t.name);
 return '<span class="brand-shell brand-'+brand+' '+(variant==='feature'?'feature-brand':'')+'"><img src="assets/brands/'+brand+'.svg" alt="Логотип '+alt+'" width="34" height="34" loading="eager" decoding="async"></span>';
}
function toolCard(t){
 return '<article class="tool-card"><div class="tool-top">'+brandIcon(t)+'<div><h3>'+esc(t.name)+'</h3><div class="subtitle">'+esc(t.subtitle)+'</div></div></div><p>'+esc(t.description)+'</p><div class="tags">'+t.tags.map(x=>'<span class="tag">'+esc(x)+'</span>').join('')+'</div><div class="card-footer"><span class="rating">★ '+t.rating+'</span><span style="display:flex;gap:6px">'+favoriteButton('t:'+t.id)+'<a class="card-arrow" href="'+t.url+'" target="_blank" rel="noopener noreferrer" title="Открыть '+esc(t.name)+'">'+ic('external')+'</a></span></div></article>'
}
function sectionTitle(title, desc, href){return '<div class="section-header"><div><h2>'+title+'</h2><p>'+desc+'</p></div>'+(href?'<a class="more-link" href="'+href+'">Смотреть все '+ic('arrow')+'</a>':'')+'</div>'}
function hero(){return '<section class="hero"><div class="shell"><div class="hero-content"><div class="eyebrow">ОБУЧЕНИЕ · ИНСТРУМЕНТЫ · ПРАКТИКА</div><h1>LYNX<br><span class="cyan">Curators</span></h1><div class="tm">TM PROJECT</div><p class="desc">Уроки, руководства и полезные сервисы — по разделам и без лишней информации. Находи материалы по интересующей теме и сохраняй то, к чему захочешь вернуться.</p><div class="hero-actions"><a class="button" href="#/materials">'+ic('rocket')+' Смотреть материалы '+ic('arrow')+'</a><a class="button button-outline" href="#/about">'+ic('play')+' О проекте</a></div><div class="hero-tags">'+[['book','Материалы','по темам'],['bolt','Быстрый','доступ'],['search','Поиск','по каталогу'],['bookmark','Удобные','закладки']].map(c=>'<div class="hero-tag"><span class="tiny-icon">'+ic(c[0])+'</span><span>'+c[1]+'<br>'+c[2]+'</span></div>').join('')+'</div></div></div><div class="float-code" aria-hidden="true"><svg viewBox="0 0 410 330"><defs><linearGradient id="markG" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#defbff"/><stop offset=".35" stop-color="#38c9ff"/><stop offset="1" stop-color="#0065d4"/></linearGradient></defs><path d="M130 35 202 17 200 204 345 205 376 277 128 277z" fill="url(#markG)" opacity=".85"/><path d="M160 65 189 58 189 229 326 229 342 252 159 252z" fill="#041325"/><path d="M130 35 160 65 159 252 128 277z" fill="#004e9c"/><path d="m202 17-13 41-29 7-30-30z" fill="#d5f8ff"/><path d="M128 277 159 252 342 252 376 277z" fill="#007bff"/><rect x="232" y="40" width="30" height="30" fill="#3acaff" opacity=".7"/><rect x="272" y="80" width="14" height="14" fill="#8eebff"/><circle cx="222" cy="156" r="154" fill="none" stroke="#158cef" stroke-opacity=".24" stroke-width="2"/></svg></div></section>'}
function statisticsCards(){const data=[['coins','Всего заработано учениками','$1,248,930','+12%'],['chart','Всего профитов','3,892','+18%'],['users','Всего учеников','26,734','+24%']];return '<div class="stat-grid">'+data.map(x=>'<div class="stat-card"><div class="stat-icon">'+ic(x[0])+'</div><div class="stat-kicker">'+x[1]+'</div><div class="stat-number">'+x[2]+'</div><div class="stat-foot">Демонстрационные данные <b>↑ '+x[3]+'</b></div></div>').join('')+'</div>'}
function communityBanner(){return '<div class="community"><div><h3>С чего начать?</h3><p>Выбери направление обучения или открой каталог полезных сервисов.</p></div><a href="#/materials" class="button">'+ic('book')+' Открыть материалы '+ic('arrow')+'</a></div>'}
function pageHome(){return hero()+'<section class="shell section section-tight">'+statisticsCards()+'</section><section class="shell section">'+sectionTitle('Рекомендуемые материалы','Курсы, руководства и статьи для самостоятельного изучения','#/materials')+'<div class="card-grid">'+materials.slice(0,4).map(matCard).join('')+'</div></section><section class="shell section">'+sectionTitle('Полезные инструменты','Проверенные временем сервисы для разных задач','#/tools')+'<div class="card-grid">'+tools.slice(0,4).map(toolCard).join('')+'</div></section><section class="shell section">'+sectionTitle('Разделы каталога','Быстрый переход к нужной теме','#/materials')+'<div class="categories-grid">'+cats.map(c=>'<a href="#/materials" data-catnav="'+esc(c[0])+'" class="category-card"><span class="category-icon">'+ic(c[1])+'</span><span><b>'+esc(c[0])+'</b><small>'+c[2]+'</small></span></a>').join('')+'</div></section><section class="shell section">'+communityBanner()+'</section>'}
function pageHead(crumb,title,desc){return '<div class="page-top"><div class="shell"><div class="breadcrumbs"><a href="#/">Главная</a> &nbsp; › &nbsp; '+esc(crumb)+'</div><h1>'+title+'</h1><p>'+desc+'</p><div class="divider-line"></div></div></div>'}
const catOptions=['Все','Заработок','Криптовалюта','Маркетинг','Развитие','Telegram','Дизайн','Инструменты'];
function materialFiltered(){let a=materials.filter(m=>(state.materialCategory==='Все'||m.cat===state.materialCategory)&&(state.materialType==='Все'||m.type===state.materialType)&&(state.materialLevel==='Все'||m.level===state.materialLevel)&&(m.name+' '+m.short+' '+m.cat).toLowerCase().includes(state.materialQuery.toLowerCase()));if(state.materialSort==='name')a.sort((x,y)=>x.name.localeCompare(y.name,'ru'));if(state.materialSort==='new')a.reverse();return a}
function renderMaterialResults(){const el=$('#listResults');if(!el)return;const list=materialFiltered();el.innerHTML='<div class="filterbar"><span class="results-count">Найдено материалов: '+list.length+'</span><span class="results-count">Курсы · Руководства · Статьи · Видео</span></div>'+(list.length?'<div class="listing-grid">'+list.map(matCard).join('')+'</div>':'<div class="empty">Ничего не найдено. Попробуй другой запрос или сбрось фильтры.</div>')}
function pageMaterials(){return pageHead('Обучающие материалы','<span class="gradient-text">Обучающие</span> материалы','Материалы по категориям: выбирай формат, уровень сложности или используй поиск.')+'<section class="shell"><div class="toolbar"><label class="searchbox">'+ic('search')+'<input id="matQuery" placeholder="Поиск по названию или теме" value="'+esc(state.materialQuery)+'" autocomplete="off"></label><select id="matSort"><option value="popular" '+(state.materialSort==='popular'?'selected':'')+'>Рекомендуемые</option><option value="new" '+(state.materialSort==='new'?'selected':'')+'>Сначала новые</option><option value="name" '+(state.materialSort==='name'?'selected':'')+'>По названию</option></select></div><div class="filterbar"><div class="left">'+catOptions.map(c=>'<button class="pill-button'+(state.materialCategory===c?' active':'')+'" data-material-cat="'+esc(c)+'">'+esc(c)+'</button>').join('')+'</div></div><div class="filterbar"><div class="left"><span class="results-count">Формат:</span>'+['Все','Курс','Гайд','Статья','Видео','Подборка','Чек-лист'].map(c=>'<button class="pill-button'+(state.materialType===c?' active':'')+'" data-material-type="'+esc(c)+'">'+esc(c)+'</button>').join('')+'</div><div class="left"><span class="results-count">Уровень:</span>'+['Все','Новичок','Средний'].map(c=>'<button class="pill-button'+(state.materialLevel===c?' active':'')+'" data-material-level="'+esc(c)+'">'+esc(c)+'</button>').join('')+'</div></div><div id="listResults"></div></section><section class="shell section">'+communityBanner()+'</section>'}
function toolFiltered(){return tools.filter(t=>(state.toolCategory==='Все'||t.cat===state.toolCategory)&&(!state.toolFavorites||favoriteIds.includes('t:'+t.id))&&(t.name+' '+t.description+' '+t.cat).toLowerCase().includes(state.toolQuery.toLowerCase()))}
function renderToolResults(){const el=$('#toolResults');if(!el)return;const list=toolFiltered();el.innerHTML='<div class="filterbar"><span class="results-count">Найдено сервисов: '+list.length+'</span><span class="results-count">Переход на официальные сайты сервисов</span></div>'+(list.length?'<div class="tool-listing">'+list.map(toolCard).join('')+'</div>':'<div class="empty">Список пуст. Измени фильтры или строку поиска.</div>')}
function pageTools(){const options=['Все',...new Set(tools.map(t=>t.cat))];return pageHead('Инструменты','<span class="gradient-text">Полезные</span> инструменты','Сервисы для работы, обучения и творчества. Выбирай категорию, сохраняй избранное и переходи на официальные сайты.')+'<section class="shell"><div class="featured"><div><span class="overline">РЕКОМЕНДУЕМ</span><h2>Один инструмент — много задач</h2><p>ChatGPT помогает разбираться в новых темах, работать с текстами и искать идеи. Другие сервисы собраны ниже по категориям.</p><a class="button button-small" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">Открыть ChatGPT '+ic('external')+'</a></div><div class="featured-logo">'+brandIcon(tools.find(t=>t.id==='chatgpt'),'feature')+'</div></div><div class="toolbar"><label class="searchbox">'+ic('search')+'<input id="toolQuery" value="'+esc(state.toolQuery)+'" placeholder="Найти инструмент или категорию..."></label><button class="pill-button'+(state.toolFavorites?' active':'')+'" data-action="toolFavorites">'+ic('bookmark')+' Избранное ('+favoriteIds.filter(x=>x.startsWith('t:')).length+')</button></div><div class="filterbar"><div class="left">'+options.map(c=>'<button class="pill-button'+(state.toolCategory===c?' active':'')+'" data-tool-cat="'+esc(c)+'">'+esc(c)+'</button>').join('')+'</div></div><div id="toolResults"></div></section><section class="shell section">'+communityBanner()+'</section>'}
function pageStatistics(){const bars=[21,29,37,44,41,55,62,58,75,70,83,94];return pageHead('Статистика','Статистика <span class="gradient-text">проекта</span>','Показатели оформлены для демонстрации интерфейса. Реальная статистика появится после подключения источника данных.')+'<section class="shell"><div class="stats-heading"><div class="overline">LYNX · STATISTICS</div><div class="demo-label">● Демонстрационные данные</div></div>'+statisticsCards()+'<div class="panel" style="margin-top:17px"><div class="section-header"><div><h2>Динамика активности</h2><p>Макет графика за 12 месяцев</p></div><span class="tag">Последний год · демо</span></div><div class="chart">'+bars.map((v,i)=>'<div class="bar" style="height:'+v+'%" data-month="'+['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'][i]+'"></div>').join('')+'</div></div><section class="section">'+sectionTitle('Что есть на платформе','Каталог, удобный поиск и сохранённые материалы')+'<div class="info-tiles"><div class="panel"><div class="stat-icon">'+ic('shield')+'</div><h3>Каталог ссылок</h3><p>Материалы и внешние ресурсы собраны по направлениям.</p></div><div class="panel"><div class="stat-icon">'+ic('bolt')+'</div><h3>Новые материалы</h3><p>Структура позволяет пополнять каталог новыми публикациями.</p></div><div class="panel"><div class="stat-icon">'+ic('users')+'</div><h3>Всё в одном месте</h3><p>Курсы, статьи и сервисы доступны из одного меню.</p></div></div></section></section>'}
function pageAbout(){return pageHead('О проекте','LYNX <span class="gradient-text">Curators</span>','Материалы, сервисы и закладки в одном месте. Проект развивается как удобная точка входа в обучение.')+'<section class="shell"><div class="about-layout"><div class="panel"><div class="overline">МИССИЯ</div><h2>Важное — под рукой.</h2><p>LYNX Curators объединяет материалы, инструкции и онлайн-сервисы в каталоге с понятной навигацией. Нужную тему можно найти через поиск или выбрать из категорий.</p><p>Сейчас доступна демонстрационная версия: можно изучать страницы, фильтровать материалы и сохранять закладки. Для реальной статистики и личных кабинетов потребуется серверная часть.</p></div><div class="panel"><div class="overline">В ПРОЕКТЕ</div><h2>Возможности каталога</h2>'+[['book','Каталог материалов','Поиск и фильтры по теме, формату и уровню.'],['spark','Страницы уроков','Оглавление и переходы между материалами.'],['bookmark','Закладки','Хранятся в браузере на этом устройстве.'],['globe','Внешние сервисы','Переходы на официальные сайты сервисов.']].map(x=>'<div style="display:flex;gap:12px;margin-top:17px"><div class="stat-icon" style="width:38px;height:38px;float:none;flex:none">'+ic(x[0])+'</div><div><b>'+x[1]+'</b><div style="font-size:12px;color:#8caaca">'+x[2]+'</div></div></div>').join('')+'</div></div><div class="panel" style="margin-top:18px"><h2>Вопросы о проекте</h2><details class="faq-item"><summary>Статистика настоящая?</summary><p>Нет. Сейчас используются явно помеченные демо-данные. Для реальных чисел потребуется подключить источник статистики.</p></details><details class="faq-item"><summary>Можно добавлять свои материалы?</summary><p>Да. Сейчас данные находятся в массиве JavaScript. Позднее их можно перенести в API, CMS или базу данных.</p></details><details class="faq-item"><summary>Почему нет настоящего входа?</summary><p>Авторизация намеренно не имитируется: для неё нужен сервер и защищённая система пользователей. Пока это презентационный сайт.</p></details></div></section>'}
function pageArticle(id){const m=materials.find(x=>x.id===id);if(!m)return pageHead('Не найдено','Материал не найден','Такого материала нет в демонстрационном каталоге.')+'<section class="shell"><a class="button" href="#/materials">Вернуться в каталог</a></section>';
const i=materials.indexOf(m),prev=materials[(i+materials.length-1)%materials.length],next=materials[(i+1)%materials.length];
const LESSONS = {
 crypto:[
  ['Что такое криптовалюта','Криптовалюта — цифровой актив, операции с которым записываются в распределённой сети. Начни с устройства кошельков, сетей и комиссий. Эти основы важнее попыток угадать движение курса.'],
  ['Как работает блокчейн','Участники сети проверяют транзакции по общим правилам, а записи объединяются в последовательные блоки. Блокчейн позволяет сверять историю операций без единого центрального оператора.'],
  ['Кошельки и ключи','Кошелёк хранит данные для управления активами. Секретную фразу восстановления нельзя передавать другим людям или вводить на подозрительных сайтах.'],
  ['Какие бывают риски','Цена активов может резко меняться, переводы часто необратимы, а поддельные сайты копируют интерфейсы популярных сервисов. Проверяй адрес, сеть и домен перед любой операцией.'],
  ['Что изучать дальше','Изучи комиссии и способы хранения ключей. Начни с простых учебных примеров, проверяй первоисточники и оценивай риски отдельно от рекламных обещаний.']
 ],
 earn:[
  ['Выбор направления','Онлайн-работа начинается с конкретного навыка: разработка, дизайн, анализ данных, редактура или сопровождение проектов. Лучше выбрать одно направление и освоить его на практике.'],
  ['Первые работы','Создай два-три небольших проекта и оформи результаты в портфолио. Покажи не только конечную картинку, но и задачу, ограничения и ход решения.'],
  ['Поиск задач','Изучай вакансии, отраслевые сообщества и фриланс-площадки. Заранее уточняй сроки, объём работы и порядок оплаты.'],
  ['На что обратить внимание','Не доверяй обещаниям гарантированного дохода и предложениям, где сначала требуют перевести деньги. Условия сотрудничества лучше фиксировать письменно.'],
  ['План на месяц','Раздели время между обучением, практикой и поиском обратной связи. Оценивай развитие по завершённым задачам и качеству выполненной работы.']
 ],
 traffic:[
  ['Из чего состоит кампания','В основе платного трафика — рекламное сообщение, выбранная аудитория и посадочная страница. Понять взаимосвязь этих элементов важно ещё до распределения бюджета.'],
  ['Аудитория и предложение','Определи, кому полезен продукт и какую задачу он решает. Текст объявления должен соответствовать содержимому страницы, на которую переходит пользователь.'],
  ['Основные показатели','CTR показывает долю кликов, CPC — стоимость перехода, конверсия — долю целевых действий. Метрики имеют смысл только вместе с результатом и затратами.'],
  ['Как проверять гипотезы','Запускай небольшие тесты с понятной целью и заранее заданными ограничениями. Меняй один значимый параметр за раз.'],
  ['Правила и качество','Соблюдай правила рекламных площадок и не используй обманные обещания. Анализируй обратную связь и улучшай предложение по реальным данным.']
 ],
 focus:[
  ['Главные приоритеты','Выдели несколько результатов, которые действительно важны на этой неделе. Ежедневные задачи должны помогать двигаться к ним, а не просто заполнять список.'],
  ['Концентрация','Выделяй время на одну задачу и по возможности убирай уведомления. Длина рабочего блока должна подходить твоему ритму.'],
  ['Организация заметок','Разделяй справочные материалы, проекты и конкретные действия. Простая система заметок удобнее сложной, которой не хочется пользоваться.'],
  ['Как измерять результат','Обращай внимание на выполненные задачи и качество работы. Количество потраченных часов само по себе мало о чём говорит.'],
  ['Устойчивый подход','Оставляй время на отдых и пересмотр приоритетов. Полезные привычки работают, когда их можно поддерживать постоянно.']
 ],
 telegram:[
  ['Концепция канала','Определи тему, аудиторию и пользу каждой публикации. Краткое описание и закреплённая навигация помогут человеку сразу понять, что он найдёт в канале.'],
  ['План публикаций','Собери несколько рубрик: новости, разборы, короткие инструкции и подборки. Оставь место для вопросов аудитории и важных изменений по теме.'],
  ['Оформление','Придерживайся одного стиля обложек и текста. Делай заголовки содержательными, а абзацы — короткими.'],
  ['Аналитика','Смотри просмотры, реакции и сохранения, сравнивай форматы, собирай обратную связь. Это полезнее попыток увеличить показатели искусственно.'],
  ['Автоматизация','Бот может отвечать на частые вопросы и вести пользователя по разделам. Продумывай меню заранее и учитывай безопасность пользовательских данных.']
 ],
 design:[
  ['Визуальная иерархия','Сначала выделяй главный смысл: заголовок, тезис или призыв к действию. Второстепенные подписи должны поддерживать основную мысль.'],
  ['Цвет и контраст','Выбери базовую палитру и один-два акцента. Проверяй читаемость текста на небольшом экране и не злоупотребляй свечением.'],
  ['Сетка и отступы','Используй повторяемые размеры и расстояния. Аккуратное выравнивание часто делает дизайн убедительнее дополнительных эффектов.'],
  ['Шаблоны','Подготовь несколько устойчивых композиций для разных типов публикаций. Меняй содержание, сохраняя узнаваемость.'],
  ['Контроль качества','Перед публикацией посмотри макет в реальном масштабе: не обрезаны ли элементы, достаточно ли воздуха, можно ли прочитать подписи.']
 ],
 seo:[
  ['Намерение пользователя','Прежде чем собирать запросы, определи, какой вопрос должен закрыть материал. Информационной странице нужна инструкция, коммерческой — ясное описание предложения.'],
  ['Группы запросов','Объединяй похожие формулировки по смыслу, а не только по отдельным словам. Это поможет создать последовательную структуру страницы.'],
  ['Качество контента','Отвечай на запрос прямо: используй понятные заголовки, короткие абзацы и примеры. Искусственное повторение ключевых слов редко помогает читателю.'],
  ['Техническая сторона','Проверяй статус страниц, внутренние ссылки, карту сайта и индексацию. Поисковик должен иметь возможность прочитать содержимое.'],
  ['Оценка изменений','Сравнивай показы, клики и поисковые запросы в панели вебмастера. Учитывай сезонность и изменения спроса.']
 ],
 bots:[
  ['Устройство бота','Бот получает события от Telegram и отвечает действиями: сообщениями, меню или вызовами сервисов. Логику удобно разделять на команды и обработчики.'],
  ['Навигация','Продумай последовательность шагов: старт, каталог, помощь и настройки. Для сложных сценариев добавь понятный возврат.'],
  ['Хранение','Токен бота не должен попадать в публичный репозиторий. Конфигурацию и секреты храни отдельно от кода.'],
  ['Надёжность','Обрабатывай ошибки, повторные запросы и таймауты. Пользователю показывай понятное сообщение вместо технической трассировки.'],
  ['Развитие проекта','Начни с рабочего минимума и проверь его на реальных сценариях. Дополнительные функции добавляй после проверки базовой логики.']
 ],
 budget:[
  ['Структура расходов','Раздели платежи на регулярные и переменные. Даже месяц наблюдений поможет увидеть, на что уходят деньги.'],
  ['Цели','Для каждой финансовой цели укажи сумму и ориентировочный срок. Проверяй, реалистичен ли план при текущих расходах.'],
  ['Резерв','Учитывай непредвиденные траты и обязательные платежи. Размер резерва зависит от личных обстоятельств.'],
  ['Инструменты','Подойдёт таблица или простое приложение, в которое удобно вносить данные. Сложная система не обязательна.'],
  ['Проверка плана','Регулярно сравнивай прогноз с фактическими расходами и корректируй категории, когда меняются условия.']
 ],
 ai:[
  ['Подходящие задачи','ИИ-сервисы удобны для черновиков, структурирования идей и работы с текстом. Сначала сформулируй ожидаемый результат.'],
  ['Хороший запрос','Укажи контекст, ограничения и формат ответа. Конкретная постановка задачи помогает быстрее получить полезный результат.'],
  ['Проверка','Модель может ошибаться. Проверяй важные факты, ссылки, расчёты и технические рекомендации.'],
  ['Приватность','Не отправляй пароли, секретные ключи и чувствительные данные без необходимости.'],
  ['Рабочий процесс','Используй генерацию как один из этапов работы, а итоговый текст или решение оценивай самостоятельно.']
 ],
 security:[
  ['Пароли','Для разных сайтов используй разные сложные пароли. Менеджер паролей помогает не запоминать каждую комбинацию.'],
  ['Дополнительная защита','Включай двухфакторную аутентификацию, где это возможно, и храни резервные коды отдельно.'],
  ['Проверка ссылок','Убедись, что домен совпадает с официальным адресом сервиса. Поддельная страница может выглядеть практически идентично.'],
  ['Обновления','Обновляй систему, браузер и приложения. Периодически проверяй активные сеансы и выданные разрешения.'],
  ['Восстановление','Заранее настрой способы возврата доступа к важным аккаунтам, особенно к основной почте.']
 ],
 content:[
  ['Цель контента','Определи аудиторию и задачу каждой рубрики. Продуманный план помогает поддерживать регулярность без публикаций ради публикаций.'],
  ['Банк идей','Собирай вопросы пользователей, полезные ссылки и темы для разборов. Не каждую идею нужно сразу превращать в пост.'],
  ['Процесс','Разделяй исследование, написание, редактуру, оформление и публикацию. Так проще видеть текущую нагрузку.'],
  ['Единый стиль','Используй повторяющиеся элементы: рубрики, заголовки, цвета и обложки. Это помогает узнаваемости.'],
  ['Аналитика','Оценивай материалы по реакциям и обратной связи. Развивай темы, которые действительно интересуют аудиторию.']
 ]
};
const sections=LESSONS[m.id]||LESSONS.focus;
return '<div class="page-top"><div class="shell"><div class="breadcrumbs"><a href="#/">Главная</a> › <a href="#/materials">Материалы</a> › '+esc(m.cat)+'</div><div class="overline">'+esc(m.type)+' • '+esc(m.cat)+'</div><h1 style="max-width:850px;margin-top:13px">'+esc(m.name)+'</h1><p>'+esc(m.short)+'</p><div class="article-meta"><span>'+ic('clock')+' '+esc(m.read)+' чтения</span><span>'+ic('book')+' '+esc(m.level)+'</span><span>'+ic('chart')+' '+esc(m.views)+' просмотров (демо)</span></div></div></div><section class="shell article-wrap"><article class="article-panel"><div class="material-cover" style="height:215px;border-radius:13px;margin-bottom:24px"><span class="cover-symbol" style="font-size:100px">'+(m.id==='telegram'?'<img class="material-brand-img" src="assets/brands/telegram.svg" alt="Telegram" width="100" height="100">':esc(m.symbol))+'</span></div>'+sections.map((s,n)=>'<section id="section-'+(n+1)+'"><h2>'+(n+1)+'. '+esc(s[0])+'</h2><p>'+esc(s[1])+'</p>'+(n===1?'<div class="callout">'+ic('spark')+' <strong>Важно:</strong> Материал предназначен для знакомства с темой. Проверяй важную информацию в первоисточниках.</div>':'')+'</section>').join('')+'<div class="article-nav"><a class="button button-quiet" href="#/material/'+esc(prev.id)+'">← Предыдущий материал</a><a class="button" href="#/material/'+esc(next.id)+'">Следующий материал '+ic('arrow')+'</a></div></article><aside class="toc-panel"><button type="button" class="toc-header" data-action="toggleToc" aria-expanded="false"><span>Содержание</span><span class="toc-chevron">⌄</span></button>'+sections.map((s,n)=>'<button type="button" class="toc-link" data-scroll-to="section-'+(n+1)+'">'+(n+1)+'. '+esc(s[0])+'</button>').join('')+'<hr style="border:0;border-top:1px solid var(--border);margin:19px 0"><div class="overline">ДЕТАЛИ МАТЕРИАЛА</div><p style="color:#8ba7c3;font-size:12px">'+esc(m.type)+' · '+esc(m.level)+' · '+esc(m.read)+'</p><button class="button button-outline" style="width:100%" data-fav="m:'+esc(m.id)+'">'+ic('bookmark')+' '+(favoriteIds.includes('m:'+m.id)?'Убрать закладку':'Сохранить материал')+'</button><button class="button button-quiet" style="width:100%;margin-top:9px" data-action="share">'+ic('external')+' Поделиться</button></aside></section>'}
function route(){let path=decodeURI(location.hash.replace(/^#/,'')||'/');return path.startsWith('/section-')?'/':path}
function render(){const path=route();let markup;if(path==='/'||path==='')markup=pageHome();else if(path==='/materials')markup=pageMaterials();else if(path==='/tools')markup=pageTools();else if(path==='/statistics')markup=pageStatistics();else if(path==='/about')markup=pageAbout();else if(path.startsWith('/material/'))markup=pageArticle(path.slice(10));else markup=pageHead('404','Страница не найдена','Вернись в главное меню.')+'<section class="shell"><a class="button" href="#/">На главную</a></section>';$('#app').innerHTML=markup;$$('[data-nav]').forEach(a=>a.classList.toggle('active',a.dataset.nav===path||path.startsWith('/material/')&&a.dataset.nav==='/materials'));document.title=(path==='/'?'Главная':path==='/tools'?'Инструменты':path==='/statistics'?'Статистика':path==='/materials'?'Материалы':path.startsWith('/material/')?'Чтение':path==='/about'?'О проекте':'LYNX')+' · LYNX Curators';renderMaterialResults();renderToolResults()}
function openModal(type){let html='<button class="icon-btn modal-close" data-action="closeModal" aria-label="Закрыть">×</button>';if(type==='search'){html+='<div class="overline">БЫСТРЫЙ ПОИСК</div><h2>Найти материал или сервис</h2><p>Поиск по названиям материалов и сервисов.</p><label class="searchbox">'+ic('search')+'<input id="modalQuery" autocomplete="off" autofocus placeholder="Например, Telegram, дизайн, крипто..."></label><div class="search-results" id="modalSearchResults"></div>'}else{html+='<div class="overline">АККАУНТ</div><h2>Личный кабинет</h2><p>Сейчас вход недоступен: сайт работает в демонстрационном режиме. Закладки можно сохранять без регистрации — они останутся в этом браузере.</p><button class="button" data-action="closeModal">Понятно</button>'}$('#modal').innerHTML='<div class="modal-window" role="dialog" aria-modal="true">'+html+'</div>';$('#modal').classList.add('open');$('#modal').setAttribute('aria-hidden','false');if(type==='search'){setTimeout(()=>{$('#modalQuery')?.focus();updateModalSearch('')},10)}}
function closeModal(){$('#modal').classList.remove('open');$('#modal').setAttribute('aria-hidden','true')}
function updateModalSearch(q){const el=$('#modalSearchResults');if(!el)return;const query=q.toLowerCase().trim();const resultM=materials.filter(m=>(m.name+' '+m.cat).toLowerCase().includes(query)).slice(0,5);const resultT=tools.filter(t=>(t.name+' '+t.cat).toLowerCase().includes(query)).slice(0,4);el.innerHTML=resultM.map(m=>'<a class="search-result" href="#/material/'+esc(m.id)+'" data-action="closeModal">'+esc(m.name)+'<small>Материал · '+esc(m.cat)+'</small></a>').join('')+resultT.map(t=>'<a class="search-result search-brand-result" href="'+t.url+'" target="_blank" rel="noopener noreferrer" data-action="closeModal">'+brandIcon(t)+'<span>'+esc(t.name)+'<small>Инструмент · '+esc(t.cat)+'</small></span></a>').join('')+(resultM.length+resultT.length===0?'<div class="empty">Совпадений нет</div>':'')}
document.addEventListener('click',e=>{const scrollControl=e.target.closest('[data-scroll-to]');if(scrollControl){document.getElementById(scrollControl.dataset.scrollTo)?.scrollIntoView({behavior:'smooth',block:'start'});return}const fav=e.target.closest('[data-fav]');if(fav){e.preventDefault();saveFavorite(fav.dataset.fav);return}
const cat=e.target.closest('[data-material-cat]');if(cat){state.materialCategory=cat.dataset.materialCat;render();return}
const typ=e.target.closest('[data-material-type]');if(typ){state.materialType=typ.dataset.materialType;render();return}
const lvl=e.target.closest('[data-material-level]');if(lvl){state.materialLevel=lvl.dataset.materialLevel;render();return}
const tcat=e.target.closest('[data-tool-cat]');if(tcat){state.toolCategory=tcat.dataset.toolCat;render();return}
const catnav=e.target.closest('[data-catnav]');if(catnav){state.materialCategory=catnav.dataset.catnav;return}
const action=e.target.closest('[data-action]');if(action){if(action.dataset.action==='login')openModal('login');else if(action.dataset.action==='closeModal')closeModal();else if(action.dataset.action==='toggleToc'){const panel=action.closest('.toc-panel');const expanded=panel.classList.toggle('expanded');action.setAttribute('aria-expanded',expanded?'true':'false')}else if(action.dataset.action==='toolFavorites'){state.toolFavorites=!state.toolFavorites;render()}else if(action.dataset.action==='share'){if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(location.href).then(()=>toast('Ссылка скопирована')).catch(()=>toast('Не удалось скопировать'));else toast('Адрес страницы можно скопировать из браузера')}}
if(e.target.matches('#modal'))closeModal();
if(e.target.closest('#nav a')){$('#nav').classList.remove('open');$('#menuToggle').setAttribute('aria-expanded','false');closeModal()}
});
document.addEventListener('input',e=>{if(e.target.id==='matQuery'){state.materialQuery=e.target.value;renderMaterialResults()}if(e.target.id==='toolQuery'){state.toolQuery=e.target.value;renderToolResults()}if(e.target.id==='modalQuery')updateModalSearch(e.target.value)});
document.addEventListener('change',e=>{if(e.target.id==='matSort'){state.materialSort=e.target.value;renderMaterialResults()}});
$('#globalSearch').addEventListener('click',()=>openModal('search'));
$('#menuToggle').addEventListener('click',()=>{const menu=$('#nav');menu.classList.toggle('open');$('#menuToggle').setAttribute('aria-expanded',menu.classList.contains('open')?'true':'false')});
window.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openModal('search')}if(e.key==='Escape')closeModal()});
window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#section-'))return;window.scrollTo({top:0,behavior:'instant'});render()});
render();