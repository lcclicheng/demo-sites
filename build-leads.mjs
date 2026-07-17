// build-leads.mjs — 合并 5 个子代理返回的商家线索，落定 leads-100.json
const arr1 = [
  {"name":"Trika Yoga","industry":"yoga","city":"Bristol","source":"https://trikayoga.co.uk/","email":"unknown","note":"独立工作室，北街社区型，有完整官网但无公开邮箱"},
  {"name":"SHALA + SAGE","industry":"yoga","city":"Manchester","source":"https://www.shalastudio.co.uk/","email":"unknown","note":"精品瑜伽馆，设计感强，有官网但仅订阅表单无邮箱"},
  {"name":"Yoga Republic","industry":"yoga","city":"Manchester","source":"https://www.yoga-republic.co.uk/","email":"info@yoga-republic.co.uk","note":"曼城/索尔福德双店，中等规模，官网有公开邮箱"},
  {"name":"East Side Yoga","industry":"yoga","city":"Edinburgh","source":"https://www.eastsideyoga.co.uk/","email":"unknown","note":"爱丁堡新城独立工作室，小到中型，有官网无公开邮箱"},
  {"name":"The Yoga Space","industry":"yoga","city":"Leeds","source":"https://theyogaspace.co.uk/","email":"leanne@ldcyoga.com","note":"Horsforth 社区工作室，2004年创立，官网有公开邮箱"},
  {"name":"The Yoga House","industry":"yoga","city":"Leeds","source":"https://www.theyogahouseleeds.co.uk/about","email":"unknown","note":"Crossgates 小型温馨工作室，有官网无公开邮箱"},
  {"name":"Yogacita","industry":"yoga","city":"Liverpool","source":"https://www.yogacita.co.uk/home-1","email":"unknown","note":"Baltic Triangle 仓库改造工作室，独立社区型，无公开邮箱"},
  {"name":"Yogella Studios","industry":"yoga","city":"Liverpool","source":"https://www.yogella.com/copy-of-schedule-classes-explained","email":"unknown","note":"Strawberry Field 旁小型温馨工作室，有官网无公开邮箱"},
  {"name":"SPACE Yoga Studio","industry":"yoga","city":"Brighton","source":"http://spaceyogastudio.uk/","email":"unknown","note":"Brighton/Hove 社区工作室，2018年创立，有官网无公开邮箱"},
  {"name":"Re:Connect Studio","industry":"yoga","city":"London","source":"http://reconnectstudio.co.uk/","email":"unknown","note":"Queen's Park 小型独立热瑜伽馆，有官网无公开邮箱"},
  {"name":"Yogahome","industry":"yoga","city":"London","source":"https://yogahome.com/about","email":"unknown","note":"Stoke Newington 社区慈善工作室，有官网无公开邮箱"},
  {"name":"Harbour Family Law","industry":"law","city":"Bristol","source":"https://www.harbourfamilylaw.co.uk/about-us/","email":"unknown","note":"布里斯托精品家事律所，2013年创立，有官网无公开邮箱"},
  {"name":"Mustafa Solicitors","industry":"law","city":"Manchester","source":"http://mustafasolicitors.co.uk/pages/about-us","email":"unknown","note":"曼城小型独立律所，自述 small firm，有官网无公开邮箱"},
  {"name":"Leech and Co Solicitors","industry":"law","city":"Manchester","source":"http://www.leechandco.co.uk/about","email":"unknown","note":"Urmston 小型独立私人客户律所，上门服务，无公开邮箱"},
  {"name":"Michael Duff Lawyers","industry":"law","city":"Edinburgh","source":"https://dufflaw.co.uk/","email":"mdufflegal@ymail.com","note":"爱丁堡独立律所，小所，官网有公开邮箱"},
  {"name":"Quill Legal","industry":"law","city":"Edinburgh","source":"http://www.quilllegal.co.uk/","email":"unknown","note":"爱丁堡小型私人客户律所（遗嘱/POA），有官网无公开邮箱"},
  {"name":"Leeds Family Law","industry":"law","city":"Leeds","source":"https://leedsfamilylaw.co.uk/about/","email":"unknown","note":"利兹精品家事律所，2011年创立，有官网无公开邮箱"},
  {"name":"Crockett & Co Solicitors","industry":"law","city":"Leeds","source":"https://crockettsolicitors.co.uk/about-us/","email":"unknown","note":"利兹 Harehills 小型家事/儿童法律所，1991年创立，无公开邮箱"},
  {"name":"Canter Levin & Berg Solicitors","industry":"law","city":"Liverpool","source":"https://canter-law.co.uk/","email":"unknown","note":"利物浦市中心综合律所，75年历史中等规模，有官网无公开邮箱"},
  {"name":"Brown Turner Ross","industry":"law","city":"Liverpool","source":"https://www.brownturnerross.com/","email":"law@brownturnerross.com","note":"利物浦/绍斯波特区域律所，135年历史，官网有公开邮箱"},
  {"name":"Seymours Solicitors","industry":"law","city":"Brighton","source":"http://www.seymoursolicitors.co.uk/home-seymours","email":"info@seymoursolicitors.co.uk","note":"Brighton/Hove 精品家事律所，1980年创立，官网有公开邮箱"},
  {"name":"Bortoft Bell","industry":"law","city":"London","source":"http://www.bortoftbell.com/","email":"contact@bortoftbell.com","note":"伦敦精品家事/离婚律所，小型合伙人所，官网有公开邮箱"}
];
const arr2 = [
  {"name":"Bishopston Hardware & DIY Centre","industry":"hardware","city":"Bristol","source":"https://www.bishopstonhardware.co.uk/contact-us/","email":"info@bishopstonhardware.co.uk","note":"Family business since 1970, corner hardware on Gloucester Road; has basic website."},
  {"name":"Cotham Hardware","industry":"hardware","city":"Bristol","source":"http://www.cothamhardware.com/","email":"ben@cothamhardware.com","note":"Independent hardware est. 1915, small local shop; simple website."},
  {"name":"Cookson Hardware","industry":"hardware","city":"Stockport","source":"https://www.cooksonhardware.com/mobile/aboutus.php","email":"sales@cooksonhardware.com","note":"Independent architectural ironmongers est. 1955; trade + retail, functional website."},
  {"name":"Potts & Handy DIY Ironmongers","industry":"hardware","city":"Stockport","source":"https://stockport.gunabiz.co.uk/company/potts-handy-diy-ironmongers-stockport.html","email":"unknown","note":"Small local ironmongers on Castle St; listed in directory, no obvious own website."},
  {"name":"Bell Donaldson Steele","industry":"hardware","city":"Edinburgh","source":"https://belldonaldsonsteele.com/pages/about-us","email":"unknown","note":"Longest-established architectural ironmongers in Edinburgh; trade-focused, has website."},
  {"name":"Marchmont Hardware","industry":"hardware","city":"Edinburgh","source":"https://edinburgh.org/neighbourhoods/southside/open-now-for-business/","email":"unknown","note":"Small independent hardware store on Warrender Park Road; no dedicated website found."},
  {"name":"Geo. Spence & Sons Ltd","industry":"hardware","city":"Leeds","source":"https://geospence.co.uk/about","email":"unknown","note":"4th-generation family ironmongers since 1888; large well-stocked store, has website."},
  {"name":"Cliff's Hardware","industry":"hardware","city":"Leeds","source":"https://www.yorkshire.com/leeds/shopping/pet-shops/cliffs-hardware","email":"unknown","note":"Beloved corner ironmonger in Moortown, 4.9-star Google; directory listing only, no own site."},
  {"name":"Dockerills Brighton Ltd","industry":"hardware","city":"Brighton","source":"https://www.dockerills.co.uk/about","email":"dockerills@dockerills.demon.uk","note":"Family ironmongers since 1900, North Laine; small showroom, has website."},
  {"name":"Belton & Slade","industry":"hardware","city":"London","source":"https://www.beltonandslade.co.uk","email":"sales@beltonandslade.co.uk","note":"Family hardware/ironmongery on Wandsworth High St since 1970; basic catalogue site."},
  {"name":"Kirkstone Hardware & Garden","industry":"hardware","city":"Liverpool","source":"https://www.liverpool.org.uk/hardware-stores","email":"unknown","note":"Small local hardware & garden shop in L21; directory listing, no obvious own website."},
  {"name":"Kathmandu","industry":"restaurant","city":"Bristol","source":"https://www.timeout.com/bristol/restaurants/kathmandu","email":"unknown","note":"Family-run Nepalese restaurant near Colston Hall; reviewed on Time Out, no own site referenced."},
  {"name":"Haveli The Yard","industry":"restaurant","city":"Bristol","source":"https://havelitheyard.co.uk/","email":"unknown","note":"Family-run Pakistani/Indian/Afghani restaurant (opened 2021); has website, mid-range."},
  {"name":"Nectar Bistro","industry":"restaurant","city":"Manchester","source":"https://www.nectarbistro.co.uk/","email":"unknown","note":"Family-run Middle Eastern/Lebanese bistro in Chorlton; BYOB, has website."},
  {"name":"Namaste Nepal","industry":"restaurant","city":"Manchester","source":"https://www.namaste-nepal.co.uk/about-us","email":"unknown","note":"Family-run Nepalese & Indian restaurant in West Didsbury since 2005; has website."},
  {"name":"The Khukuri","industry":"restaurant","city":"Edinburgh","source":"http://thekhukuri.com","email":"emailus@thekhukuri.com","note":"Independent family-run Nepalese restaurant, 25+ years; has website."},
  {"name":"Namaste Kathmandu","industry":"restaurant","city":"Edinburgh","source":"https://namastektm.co.uk","email":"unknown","note":"Family-run Nepalese & Indian restaurant since 2007; has website."},
  {"name":"Bombay 2 Goa","industry":"restaurant","city":"Leeds","source":"https://www.bombay2goa.co.uk/about","email":"unknown","note":"Family-run Indian/Goan restaurant in Headingley; 4.8-star Google, has website."},
  {"name":"La Bistro Mediterranean Kitchen","industry":"restaurant","city":"Leeds","source":"https://labistroleeds.co.uk/","email":"unknown","note":"Family-run Greek/Turkish/Mediterranean bistro in Horsforth since 2015; has website."},
  {"name":"La Famiglia","industry":"restaurant","city":"Liverpool","source":"http://lafamiglialiverpool.com/","email":"info@lafamiglialiverpool.com","note":"Small family-run Italian bar & restaurant in city centre; has website."},
  {"name":"IL Bistro","industry":"restaurant","city":"Brighton","source":"https://www.tripadvisor.com/Restaurant_Review-g186273-d1385452-Reviews-Il_Bistro_Restaurant-Brighton_East_Sussex_England.html","email":"unknown","note":"Family-run steakhouse brasserie in The Lanes since 1976; listed on TripAdvisor."},
  {"name":"Le Petit Citron","industry":"restaurant","city":"London","source":"https://lepetitcitron.co.uk/","email":"unknown","note":"Family-run Provencal neighbourhood bistro in Brook Green; has website."}
];
const arr3 = [
  {"name":"Peggy's Bristol","industry":"coffee","city":"Bristol","source":"https://www.peggysbristol.co.uk","email":"unknown","note":"Independent neighbourhood specialty coffee chain with 2 Bristol sites (Gloucester Rd & North St); has a real website."},
  {"name":"Feel Good Club","industry":"coffee","city":"Manchester","source":"https://www.feelgoodclub.co","email":"unknown","note":"Independent Northern Quarter specialty coffee cafe, community/wellbeing focused; modern site but small team."},
  {"name":"Takk","industry":"coffee","city":"Manchester","source":"https://takkmcr.com/","email":"unknown","note":"Independent Icelandic-style specialty coffee shop in the Northern Quarter; small 3-location local brand."},
  {"name":"Idle Hands","industry":"coffee","city":"Manchester","source":"https://www.idlehandscoffee.com","email":"unknown","note":"Independent specialty coffee & homemade pie shop, Northern Quarter; compact single site."},
  {"name":"The Milkman","industry":"coffee","city":"Edinburgh","source":"http://themilkman.coffee","email":"unknown","note":"Independent specialty coffee shop in the Old Town, est. 2015; cosy two-site local business."},
  {"name":"Starfish & Coffee","industry":"coffee","city":"Brighton","source":"https://starfishandcoffee.cafe/about","email":"unknown","note":"Multi-award winning independent neighbourhood cafe near Queens Park, est. 2017; strong local reputation."},
  {"name":"Cafe Coho","industry":"coffee","city":"Brighton","source":"https://www.cafecoho.co.uk/about-us","email":"unknown","note":"Independent espresso bar & cafe born and based in Brighton, est. 2010; small local brand."},
  {"name":"Redroaster","industry":"coffee","city":"Brighton","source":"https://www.redroaster.co.uk/st-james-street","email":"unknown","note":"Brighton's oldest independent coffee roastery/cafe, est. 2000; established but locally owned."},
  {"name":"BAM Glasgow","industry":"coffee","city":"Glasgow","source":"http://bamglasgow.co.uk/about","email":"hello@bamglasgow.co.uk","note":"Independent coffee + vintage shop in the Southside, run by twin sisters since 2018; small community cafe."},
  {"name":"Zennor Coffee","industry":"coffee","city":"Glasgow","source":"http://zennorcoffee.co.uk/pages/287-langside-rd","email":"unknown","note":"Minimal independent filter/espresso cafe on Langside Rd, Southside Glasgow; small single-site roaster."},
  {"name":"Dark Arts Coffee","industry":"coffee","city":"London","source":"http://www.darkartscoffee.co.uk/","email":"unknown","note":"Independent specialty coffee roaster/espresso bar in Hackney (Rosina St), est. 2014; edgy small local brand."},
  {"name":"DN Hair Design","industry":"salon","city":"Manchester","source":"https://dnhairdesign.co.uk/","email":"unknown","note":"Small independent unisex salon in Ancoats, est. 2008; single ground-floor unit, has its own website."},
  {"name":"Olivier Morosini Hairdressing","industry":"salon","city":"Manchester","source":"https://oliviermorosini.co.uk","email":"unknown","note":"Small independent NQ salon, family-run since 1995; owner admits site is outdated (good demo target)."},
  {"name":"Basement 68","industry":"salon","city":"Leeds","source":"http://www.basement-68.co.uk/","email":"hair@basement-68.co.uk","note":"Independent traditional men's barbers in Leeds city centre, est. 2009; small single-site shop."},
  {"name":"No.3 Gentleman's Hairdressing","industry":"salon","city":"Leeds","source":"https://no3.mytreatwell.co.uk/","email":"joshlewisjewitt@hotmail.com","note":"Independent barber shop on Briggate, Leeds; Treatwell-listed, no standalone website (ideal lead)."},
  {"name":"Rosser Hairdressing","industry":"salon","city":"Liverpool","source":"https://rosserhairdressing.com","email":"unknown","note":"Independent salon in Cressington, Liverpool, est. 2016; small friendly local business with website."},
  {"name":"It's The Hair Studio","industry":"salon","city":"Liverpool","source":"https://itsthehairstudio.com","email":"unknown","note":"Independent gender-neutral studio in the Baltic Triangle, Liverpool; built on Squarespace (simple site)."},
  {"name":"North Laine Hair Company","industry":"salon","city":"Brighton","source":"https://www.northlainehairco.co.uk","email":"reception@northlainehairco.com","note":"Independent family hair salon in the North Laine, est. 2007; established local business."},
  {"name":"The Hair Salon (Brighton)","industry":"salon","city":"Brighton","source":"https://thehair-salon.co.uk/","email":"thehairsalon20@gmail.com","note":"Award-winning independent vegan/eco salon in Hove; small, uses a generic Gmail address."},
  {"name":"Chop Chop (Camden)","industry":"salon","city":"London","source":"https://www.chopchoplondon.com/camden","email":"unknown","note":"Independent gender-neutral salon in Camden Market, digital-only bookings; small creative local brand."},
  {"name":"Briar Grove Barbers","industry":"salon","city":"Glasgow","source":"https://thebriargrovebarbers.co.uk/","email":"hello@thebriargrovebarbers.co.uk","note":"Traditional independent barbers in Finnieston, West End Glasgow, est. 2016; small local shop."},
  {"name":"Chesne Hair & Barbershop","industry":"salon","city":"Glasgow","source":"http://www.chesnehair.com","email":"info@chesnehair.com","note":"Independent hair salon & barbers in the Merchant City, Glasgow, serving since 2008; small team."}
];
const arr4 = [
  {"name":"Josephine's Homemade Cakes","industry":"dessert","city":"Manchester","source":"https://josiescakes.co.uk/","email":"hello@josiescakes.co.uk","note":"Didsbury 的小型本地定制蛋糕店，从家庭厨房起家，仅有基础官网、无在线下单系统"},
  {"name":"Madeleine's Patisserie","industry":"dessert","city":"Edinburgh","source":"https://www.theskinny.co.uk/whats-on/edinburgh/restaurants/madeleines-patisserie","email":"contact@patisseriemadeleine.com","note":"Stockbridge 的迷你法式甜点店，2010 年独立经营，店面极小、看起来无定制网站"},
  {"name":"La Barantine","industry":"dessert","city":"Edinburgh","source":"https://www.morningside-traders.co.uk/partner/la-barantine/","email":"contact.labarantine@gmail.com","note":"Bruntsfield 的法式面包甜点咖啡馆，本地多网点小连锁，官网仅商家目录页"},
  {"name":"Patisserie La Reine","industry":"dessert","city":"Bristol","source":"https://patisserielareine.co.uk/","email":"info@lareine.co.uk","note":"2017 年创立的家庭法式甜点店，Union St 小门店，有基础官网但设计朴素"},
  {"name":"Cloud 9","industry":"dessert","city":"Brighton","source":"https://cloud9brighton.co.uk/","email":"unknown","note":"Brighton 独立蛋糕店（自 2010 年），主打定制庆典蛋糕，官网偏模板化"},
  {"name":"Slutcakes","industry":"dessert","city":"Brighton","source":"http://slutcakes.co.uk/","email":"hello@slutcakes.co.uk","note":"Brighton 一人式手工成人纸杯蛋糕作坊，仅接订单、无实体店，极简官网"},
  {"name":"Laura's Cakes & Bakes","industry":"dessert","city":"Leeds","source":"https://wanderlog.com/nb/place/details/11468940/lauras-cakes--bakes-leeds","email":"unknown","note":"Swillington/Leeds 的一人家庭蛋糕生意，居家作坊为主，仅第三方列表页"},
  {"name":"Barefoot Bakery","industry":"dessert","city":"Oxford","source":"https://barefootoxford.co.uk/","email":"unknown","note":"Oxford 小型手工面包坊，从市集摊起家，现有两家本地门店，有基础官网"},
  {"name":"Inspired Market Bakery","industry":"dessert","city":"Bath","source":"https://www.inspiredmarket.co.uk/","email":"unknown","note":"Bath 获奖手工（无麸质/纯素）烘焙坊，门店式经营，官网为网站_builder 模板"},
  {"name":"Cuthbert's Bakehouse","industry":"dessert","city":"Liverpool","source":"http://cuthbertsbakehouse.co.uk/ourstory","email":"unknown","note":"Aigburth 独立利物浦蛋糕店（自 2006 年），有官网但偏简单博客风"},
  {"name":"KG Tea-Chocolaterie","industry":"dessert","city":"London","source":"https://www.kgtchocolat.co.uk/about-us","email":"unknown","note":"Notting Hill 的独立烘焙/巧克力店，手工蛋糕与茶，小本经营、官网朴素"},
  {"name":"Brooks Guesthouse Bristol","industry":"hotel","city":"Bristol","source":"https://www.brooksguesthousebristol.com/why-choose-brooks/","email":"info@brooksguesthousebristol.com","note":"老城区家庭经营精品 guesthouse，含屋顶 Airstream 拖车房，有官网、体量小"},
  {"name":"Chestnuts House Boutique B&B","industry":"hotel","city":"Bath","source":"https://www.booking.com/hotel/gb/chestnuts-house.html","email":"unknown","note":"爱德华时期 5 间房精品 B&B，主人 Toni & Dawn 自营，仅 OTA 列表无独立官网"},
  {"name":"Sherwood Guest House","industry":"hotel","city":"Edinburgh","source":"https://www.trip.com/hotels/edinburgh-hotel-detail-734348/sherwood-guest-house/","email":"david@edinburgh-places.co.uk","note":"Newington 6 间房家庭 guesthouse，评分高，仅在 OTA 与邮箱联系、无定制站"},
  {"name":"Starlings Guest House","industry":"hotel","city":"Brighton","source":"http://www.starlingsbrighton.co.uk/","email":"unknown","note":"Kemptown 1807 年摄政联排别墅 B&B，小体量、有基础官网"},
  {"name":"Cornerstones Guest House","industry":"hotel","city":"Manchester","source":"https://cornerstonesguesthouse.com/rooms","email":"unknown","note":"Sale 的维多利亚风精品 guesthouse，含公寓房型，有官网但设计简单"},
  {"name":"Woodlands","industry":"hotel","city":"Leeds","source":"https://woodlandsleeds.com/stay/","email":"unknown","note":"22 间房独立精品酒店带餐厅，体量略大但非连锁，有官网"},
  {"name":"The Cottage B&B","industry":"hotel","city":"Liverpool","source":"https://www.agoda.cn/zh-tw/the-cottage-bed-breakfast/hotel/liverpool-gb.html","email":"unknown","note":"Hale Village 仅 4 间房的家庭 B&B，近机场，仅 OTA 列表页"},
  {"name":"Barclay House London Boutique B&B","industry":"hotel","city":"London","source":"https://cn.tripadvisor.com/Hotel_Review-g186338-d309086-Reviews-or50-Barclay_House_London_Boutique_B_B-London_England.html","email":"unknown","note":"Fulham 小型 B&B，由主人 Charlotte 自营，仅 TripAdvisor 页面、无独立官网"},
  {"name":"The Lost Poet","industry":"hotel","city":"London","source":"http://www.thelostpoet.co.uk/","email":"unknown","note":"Notting Hill Portobello Rd 的怪趣精品 B&B，少房间、强设计感，有基础官网"},
  {"name":"The Oxford House","industry":"hotel","city":"Oxford","source":"https://www.booking.com/hotel/gb/the-oxford-house.html","email":"unknown","note":"Cowley 小型家庭经营 guesthouse，便宜经济型，仅 OTA 列表无独立站"},
  {"name":"Remont Oxford Hotel","industry":"hotel","city":"Oxford","source":"https://www.independent.co.uk/travel/independent-traveller/offers/england-oxford-remont-hotel","email":"unknown","note":"Summertown 家庭经营 B&B/小酒店，交通便利，有媒体评测但无独立官网"}
];
const arr5 = [
  {"name":"Long White Cloud Bakery","industry":"bakery","city":"London","source":"http://www.longwhitecloudbakery.com/","email":"unknown","note":"Independent artisan bakery & cafe in Hoxton, East London; small neighbourhood shop, sourdough + Turkish pitta, basic site."},
  {"name":"Wild Yeast Bakery","industry":"bakery","city":"Bristol","source":"http://www.wildyeastbakery.co.uk/menu","email":"info@wildyeastbakery.co.uk","note":"Small independent sourdough bakery at 79 High St, Bristol (BS16); simple site, clearly a local micro-business."},
  {"name":"Mark's Bread","industry":"bakery","city":"Bristol","source":"https://marksbread.co.uk/about","email":"unknown","note":"Independent artisan bakery in Bedminster/Southville; award-winning but modest, community-focused, no obvious email on site."},
  {"name":"Companio Bakery","industry":"bakery","city":"Manchester","source":"http://companiobakery.co.uk/about-us","email":"unknown","note":"Worker-rooted artisan sourdough bakery in Ancoats; small team, community-focused, basic website."},
  {"name":"Flour & Soul Bakery","industry":"bakery","city":"Manchester","source":"https://flourandsoulbakery.co.uk/","email":"unknown","note":"Award-winning family-run neighbourhood sourdough bakery in Urmston; bike delivery, small-scale, ideal target client."},
  {"name":"Hobz Bakery","industry":"bakery","city":"Edinburgh","source":"https://hobzbakery.com","email":"unknown","note":"Eco-conscious artisan sourdough bakery at 106 Leith Walk; small, dog-friendly, modest web presence."},
  {"name":"Leeds Bread Co-op","industry":"bakery","city":"Leeds","source":"https://www.leedsbread.coop","email":"info@leedsbread.coop","note":"Independent worker co-op sourdough bakery in Meanwood; small, ethics-driven, email publicly listed."},
  {"name":"Baltic Bakehouse","industry":"bakery","city":"Liverpool","source":"https://www.balticbakehouse.co.uk/locations-1","email":"unknown","note":"Independent sourdough bakery in the Baltic Triangle (since 2013); two small sites, no-frills, classic local target."},
  {"name":"Mon Petit Chou","industry":"bakery","city":"Liverpool","source":"https://www.monpetitchoulpl.co.uk/","email":"unknown","note":"Small artisan bakery in Aigburth; pastry + 15 sourdough loaves, tiny team, simple site, very small-business feel."},
  {"name":"Sugardough","industry":"bakery","city":"Brighton","source":"https://sugardough.co.uk/about/","email":"unknown","note":"Local independent bakery in Hove (since 2009), started with a £100 eBay oven; handmade sourdough, modest site."},
  {"name":"Natural Bread","industry":"bakery","city":"Oxford","source":"https://oxfordbakery.co.uk/","email":"contactus.naturalbread@gmail.com","note":"Family-run independent artisan bakery in Botley; markets + wholesale, public enquiry email, small-scale."},
  {"name":"Cosgriff and Sons","industry":"bakery","city":"York","source":"https://cosgriffandsonsbakery.com/","email":"unknown","note":"Family-led microbakery opposite Clifford's Tower; started as doorstep sourdough deliveries, small and community-rooted."}
];

const all = [...arr1, ...arr2, ...arr3, ...arr4, ...arr5];
const slugify = (n, i) => n.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') + '-' + (n.match(/[A-Za-z]+/)? n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''):'x') + '-' + i;
// 用行业+序号做稳定 slug，避免重名冲突
const seen = {};
const out = all.map((r, i) => {
  const base = r.name.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  let slug = base + '-' + r.industry;
  if (seen[slug]) slug = base + '-' + r.industry + '-' + (seen[slug]++);
  else seen[slug] = 1;
  return {
    id: 'L' + String(i+1).padStart(3,'0'),
    slug,
    name: r.name,
    industry: r.industry,
    city: r.city,
    source: r.source,
    email: r.email,
    emailStatus: r.email === 'unknown' ? 'unknown' : 'found',
    note: r.note,
    status: 'lead',
  };
});

import { writeFileSync } from 'node:fs';
const path = 'D:/workbuddy项目/2026-07-07-09-02-15/gh-pages-build/leads-100.json';
writeFileSync(path, JSON.stringify(out, null, 2));
// 统计
const byIndustry = {};
let found = 0;
for (const r of out) {
  byIndustry[r.industry] = (byIndustry[r.industry]||0)+1;
  if (r.emailStatus === 'found') found++;
}
console.log('总商家数:', out.length);
console.log('按行业:', JSON.stringify(byIndustry));
console.log('已查到邮箱:', found, ' 待查:', out.length - found);
console.log('已写入:', path);
