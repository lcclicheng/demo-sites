// build-leads-extra.mjs — 合并精准人群(有邮箱+无独立站)70+家，追加进主库
const a1 = [
  {"name":"Sundara Yoga","industry":"yoga","city":"Brighton/Hove","source":"https://www.movegb.com/venue/14727","email":"sundarayogabrighton@gmail.com","note":"仅 MoveGB 平台，Gmail 联系，无独立官网"},
  {"name":"Sofia Condes","industry":"yoga","city":"Oxford","source":"https://www.momoyoga.com/","email":"sofiacondesyoga@gmail.com","note":"Momoyoga 导师主页，Gmail 联系，无自有网站"},
  {"name":"Rita Pedro","industry":"yoga","city":"Cambridge","source":"https://www.momoyoga.com/","email":"ritinhapedrocc@gmail.com","note":"Momoyoga 导师主页，Gmail 联系，无自有域名"},
  {"name":"ShantiSoul Yoga","industry":"yoga","city":"Bristol","source":"https://www.movegb.com/","email":"shantisoul.yoga@gmail.com","note":"仅 MoveGB 列表，Gmail 联系，无独立官网"},
  {"name":"Natasha Yule","industry":"yoga","city":"Exeter","source":"https://www.movegb.com/","email":"natashayuleyoga@gmail.com","note":"MoveGB 列表，Gmail 联系，无自有网站"},
  {"name":"Yoga with Gavin","industry":"yoga","city":"Leicester","source":"https://leicestershirepress.com/","email":"yogawithgavin@hotmail.com","note":"仅本地新闻站报道，Hotmail 联系，无独立官网"},
  {"name":"My Mojo","industry":"yoga","city":"Hove","source":"https://www.movegb.com/","email":"mymojofitness@gmail.com","note":"仅 MoveGB 列表，Gmail 联系，无自有域名"},
  {"name":"Be Yoga (Crosby)","industry":"yoga","city":"Liverpool","source":"https://www.movegb.com/venue/10937","email":"beyogacrosby@gmail.com","note":"仅 MoveGB 与 Facebook 主页，Gmail 联系，无独立官网"},
  {"name":"Liverpool Iyengar Yoga","industry":"yoga","city":"Liverpool","source":"https://iyengaryoga.org.uk/groups/liverpool-iyengar-yoga","email":"liverpooliyengaryoga@gmail.com","note":"仅全国 Iyengar 协会目录页，Gmail 联系，无自有网站"},
  {"name":"Red Lion Law","industry":"law","city":"Birmingham","source":"https://lawstreet.co.uk/","email":"redlionsolicitors@gmail.com","note":"律所目录 lawstreet.co.uk 主页，Gmail 联系，无独立官网"},
  {"name":"McBride & Co / Newford Law","industry":"law","city":"Glasgow","source":"https://www.slab.org.uk/","email":"mcbride4law@gmail.com","note":"苏格兰法律援助委员会目录，Gmail 联系，无自有网站"},
  {"name":"YourLegal","industry":"law","city":"Leicester","source":"https://lawstreet.co.uk/","email":"yourlegal247@gmail.com","note":"lawstreet.co.uk 目录主页，Gmail 联系，无独立官网"},
  {"name":"Stuart R. Oldrey","industry":"law","city":"Cardiff","source":"https://lawstreet.co.uk/","email":"stuart.r.oldrey@gmail.com","note":"lawstreet.co.uk 目录主页，Gmail 联系，无自有网站"},
  {"name":"S. Grady Solicitors","industry":"law","city":"Glasgow","source":"https://www.slab.org.uk/","email":"stephen_grady@hotmail.co.uk","note":"slab.org.uk 目录列出，Hotmail 联系，无自有网站"},
  {"name":"Stephanie Clinkscale","industry":"law","city":"Edinburgh","source":"https://www.slab.org.uk/","email":"stephanieclinkscalesolad@outlook.com","note":"slab.org.uk 目录列出，Outlook 联系，无自有网站"},
  {"name":"Paula Lavelle","industry":"law","city":"Glasgow","source":"https://www.slab.org.uk/","email":"paulalavelle@yahoo.co.uk","note":"slab.org.uk 目录列出，Yahoo 联系，无自有网站"},
  {"name":"Mike Ferrie","industry":"law","city":"Dundee","source":"https://www.slab.org.uk/","email":"mikeferrie@outlook.com","note":"slab.org.uk 目录列出，Outlook 联系，无自有网站"},
  {"name":"Crawshaw Solicitors","industry":"law","city":"Bristol","source":"https://lawstreet.co.uk/","email":"ejcawshaw@crawshawsolicitor.onmicrosoft.com","note":"lawstreet.co.uk 目录主页，onmicrosoft 联系，无独立官网"}
];
const a2 = [
  {"name":"Mr Arkwright's Tool Emporium","industry":"hardware","city":"Harrogate","source":"https://visitharrogate.co.uk/index/mr-arkwrights-tool-emporium","email":"stephanie.owen@hotmail.co.uk","note":"仅 Visit North Yorkshire 旅游目录，个人 hotmail，无自有网站"},
  {"name":"Gibraltar Gardens","industry":"restaurant","city":"Norwich","source":"http://gibraltargardens-norwich.foodanddrinksites.co.uk/","email":"gibraltargardens288@gmail.com","note":"第三方 foodanddrinksites 子域，Gmail 联系，无独立网站"},
  {"name":"Hope & Anchor","industry":"restaurant","city":"Bristol","source":"http://hopeandanchor-bristol.foodanddrinksites.co.uk/","email":"Tropicalpubcompany@gmail.com","note":"第三方 foodanddrinksites 子域，Gmail 联系，无独立网站"},
  {"name":"Pibroch Scottish Restaurant","industry":"restaurant","city":"Edinburgh","source":"https://www.visitscotland.com/info/food-drink/pibroch-scottish-restaurant-p2536951","email":"pibrochrestaurant@gmail.com","note":"仅 VisitScotland 旅游目录，Gmail 联系，无自有网站"}
];
const a3 = [
  {"name":"Tabitha's Coffee","industry":"coffee","city":"Manchester","source":"https://thegreatnorthern.com/unit/tabithas-coffee/","email":"tabithascoffeeandjuice@gmail.com","note":"仅 Great Northern 商场目录页，无自有域名"},
  {"name":"Red Berry Club","industry":"coffee","city":"Liverpool","source":"https://food.datathistle.com/place/91733-red-berry-club-liverpool/","email":"redberryclub4@gmail.com","note":"Datathistle 目录列表，Gmail 联系，无独立网站"},
  {"name":"The Dispensary","industry":"coffee","city":"Newcastle","source":"https://newcastlegateshead.com/business-directory/food-and-drink/the-dispensary","email":"thedispensaryncl@gmail.com","note":"NewcastleGateshead 商业目录，仅 Gmail 联系，无自有站"},
  {"name":"Magus Coffee Shop","industry":"coffee","city":"London","source":"https://www.towerhamletsarts.org.uk/?cid=62835&guide=Venues","email":"magusandthefool@gmail.com","note":"Tower Hamlets 艺术场所目录，Gmail 联系，无自有网站"},
  {"name":"The Apple Tree","industry":"coffee","city":"London","source":"https://www.youractonbid.co.uk/business/the-apple-tree","email":"theappletreecakes@gmail.com","note":"Acton BID 商业目录，无自有域名"},
  {"name":"The Wall Coffee and Design House","industry":"coffee","city":"Edinburgh","source":"https://www.tscci.org.uk/member/the-wall-coffee-and-design-house","email":"thewalledinburgh@gmail.com","note":"商会成员目录，Gmail 联系，无独立网站"},
  {"name":"Coffee N More","industry":"coffee","city":"Edinburgh","source":"https://www.tscci.org.uk/member/coffee-n-more","email":"coffeeenmoreuk@gmail.com","note":"商会成员目录，Gmail 联系，无自有网站"},
  {"name":"fantosity Coffee","industry":"coffee","city":"Brighton","source":"https://uk.nextdoor.com/pages/fantosity-coffee-brighton-england/","email":"fantosity@gmail.com","note":"仅 Nextdoor 商家页，Gmail 联系，无自有网站"},
  {"name":"Vault Hair & Beauty","industry":"salon","city":"Glasgow","source":"https://vaulthairandbeauty.mytreatwell.co.uk/","email":"joniewart123@gmail.com","note":"仅 Treatwell 平台页，Gmail 联系，无自有域名"},
  {"name":"Twisted Sister","industry":"salon","city":"Glasgow","source":"https://www.cybo.com/GB-biz/twisted-sister","email":"twistedsisterhair@gmail.com","note":"Cybo 商业目录，Gmail 联系，无独立网站"},
  {"name":"International Barbers","industry":"salon","city":"Bristol","source":"https://bristol.city-advisor.uk/international-barbers","email":"hassanzoorani@gmail.com","note":"Bristol city-advisor 目录，Gmail 联系，无独立网站"},
  {"name":"Stoke Lane Barber","industry":"salon","city":"Bristol","source":"http://stokelanebarber.nearcut.com/","email":"stokelanebarber@hotmail.com","note":"仅 Nearcut 预约平台页，Hotmail 联系，无自有站"},
  {"name":"L&J Hair Studio","industry":"salon","city":"Birmingham","source":"https://www.bizseek.co.uk/l-j-hair-studio_1s-0121-426-6065","email":"landjhairstudio@gmail.com","note":"BizSeek 目录列出邮箱且无 Web 字段，无自有网站"},
  {"name":"Mara's Beauty & Hair","industry":"salon","city":"London","source":"https://marabeautyandhair.mytreatwell.co.uk/","email":"marabeautyandhair@gmail.com","note":"仅 Treatwell 平台页，Gmail 联系，无自有域名"},
  {"name":"Base Hair and Beauty","industry":"salon","city":"Manchester","source":"https://www.bizseek.co.uk/base-hair-and-beauty_19-0161-370-1680","email":"base.hair.beauty@gmail.com","note":"BizSeek 列表显示 Gmail 且无 Web 字段，无独立网站"},
  {"name":"Revive Hair & Beauty","industry":"salon","city":"Leeds","source":"https://www.bizseek.co.uk/revive-hair-beauty_9z-0113-263-5054","email":"revivesalon@hotmail.co.uk","note":"BizSeek 目录条目显示 Hotmail 且无 Web 链接，无自有站"}
];
const a4 = [
  {"name":"The Cake House Brighton","industry":"dessert","city":"Brighton","source":"https://thecakehousebrighton.wordpress.com/find-us-and-contact/","email":"thecakehousebrighton@gmail.com","note":"WordPress.com 子域，无自有域名，含公开 Gmail"},
  {"name":"Claremont Cakes","industry":"dessert","city":"Bristol","source":"https://claremontcakescouk.wordpress.com/","email":"cakesofclaremont@gmail.com","note":"WordPress.com 烘焙博客，无独立站，Gmail 联系"},
  {"name":"Amy's Creative Cakes Glasgow","industry":"dessert","city":"Glasgow","source":"https://findglocal.com/GB/Glasgow/204136489967236/Amy's-Creative-Cakes-Glasgow","email":"amyscreativecakes@outlook.com","note":"仅 findglocal 社区目录，无自有网站，Outlook 邮箱"},
  {"name":"The Cakery","industry":"dessert","city":"Birmingham","source":"https://findglocal.com/GB/Birmingham/1408083902766039/The-Cakery","email":"thecakerybirmingham@hotmail.co.uk","note":"findglocal 目录列表，无自有域名，Hotmail 邮箱"},
  {"name":"Mama Mia Cakes and Cupcakes","industry":"dessert","city":"Liverpool","source":"https://wanderlog.com/zh/place/details/13358441/mama-mia-cakes-and-cupcakes","email":"mamamiacakes@hotmail.com","note":"仅 Facebook 页(经 Wanderlog)，无自有网站，Hotmail 邮箱"},
  {"name":"Bake Me a Cake","industry":"dessert","city":"North Tyneside","source":"https://threebestrated.co.uk/bakers-near-North-Tyneside","email":"hello.bakemeacake@gmail.com","note":"threebestrated 目录+仅 FB 存在，无独立网站，Gmail 邮箱"},
  {"name":"Kellys Cakes","industry":"dessert","city":"North Tyneside","source":"https://threebestrated.co.uk/bakers-near-North-Tyneside","email":"kellyscakes2020@yahoo.com","note":"threebestrated 目录列表，仅 FB，无自有域名，Yahoo 邮箱"},
  {"name":"Cakes Bakes 'n' Shakes","industry":"dessert","city":"Tavistock","source":"https://www.cybo.com/GB-biz/cakes-bakes-n-shakes","email":"cakesbakesnshakes@gmail.com","note":"仅 Cybo 商业目录，无自有网站，Gmail 联系"},
  {"name":"Hollybush Guest House","industry":"hotel","city":"Oxford","source":"https://hotels.ctrip.com/hotel/70409296.html","email":"Hollybush.oxford24@gmail.com","note":"仅 Ctrip/Trip.com OTA，无独立网站，Gmail 邮箱"},
  {"name":"E'holiday","industry":"hotel","city":"Edinburgh","source":"https://de.trip.com/hotels/edinburgh-hotel-detail-116527336/e-holiday/","email":"eholiday319@gmail.com","note":"仅 Trip.com OTA，无自有域名，Gmail 邮箱"},
  {"name":"Bishop Gate B&B","industry":"hotel","city":"Londonderry","source":"https://hotels.corporatetravel.ctrip.com/hotels/detail/?hotelId=102444667","email":"bishopgatebnb@gmail.com","note":"仅 Ctrip 企业差旅 OTA，无自有网站，Gmail 邮箱"},
  {"name":"Shepherds Lodge","industry":"hotel","city":"Cardiff","source":"https://bonvilstonvillage.co.uk/Amenities/ShepherdsLodge.html","email":"shepherdslodgebonvilston@gmail.com","note":"村社区站托管页(非自有域名)，Gmail 联系"},
  {"name":"Hudsons Guest House","industry":"hotel","city":"Brighton","source":"https://visitbrighton.com/accommodation/bed-and-breakfasts","email":"hudsonsbrighton@gmail.com","note":"VisitBrighton 旅游委员会目录，无自有网站，Gmail 邮箱"},
  {"name":"Sandpiper Guest House","industry":"hotel","city":"Brighton","source":"https://visitbrighton.com/accommodation/bed-and-breakfasts","email":"sandpiperbrighton1@gmail.com","note":"仅 VisitBrighton 旅游委员会目录，无独立站，Gmail 邮箱"},
  {"name":"The Gather Inn","industry":"hotel","city":"Hove","source":"https://visitbrighton.com/accommodation/bed-and-breakfasts","email":"infogatherinn@gmail.com","note":"VisitBrighton 旅游委员会目录，无自有域名，Gmail 联系"},
  {"name":"Finkle Green Bed and Breakfast","industry":"hotel","city":"Sheffield","source":"https://www.welcometosheffield.co.uk/content/accommodation/finkle-green-bed-and-breakfast","email":"finklegreenwortley@gmail.com","note":"Welcome to Sheffield 旅游委员会目录，无独立网站，Gmail 邮箱"}
];
const a5 = [
  {"name":"Lily Tree Bakery","industry":"bakery","city":"Newcastle upon Tyne","source":"https://newcastlegateshead.com/business-directory/food-and-drink/the-lily-tree-bakery","email":"thelilytreebakery@outlook.com","note":"NewcastleGateshead 商业目录+FB，目录网站字段指向 FB，无自有域名"},
  {"name":"Havenhands The Bakers","industry":"bakery","city":"Boroughbridge (York)","source":"https://www.bizseek.co.uk/havenhands-the-bakers_3K-01423-322432","email":"chloeat43@outlook.com","note":"BizSeek 列出，web 字段指向镇议会站非自有站，无独立网站"},
  {"name":"Hummersea Bakehouse","industry":"bakery","city":"Saltburn-by-the-Sea","source":"https://hartlepoolfoodpartnership.co.uk/local-food-procurement-maps/","email":"emdonoghue.134@gmail.com","note":"仅 Hartlepool Food Partnership 本地食物地图+FB，无自有网站"},
  {"name":"Our Dough","industry":"bakery","city":"Swinton, Salford","source":"https://www.salfordnow.co.uk/2021/03/26/salford-microbakery-launch-new-eco-friendly-bread-by-bike-delivery-service/","email":"ourdoughbakery@gmail.com","note":"仅本地媒体+Instagram，无自有网站"},
  {"name":"Birch Bread (Birch Cottage Bakery)","industry":"bakery","city":"Hermitage, Berkshire","source":"https://breadangels.com/bread-angels-baking-near-you","email":"luciemmsteel@gmail.com","note":"Bread Angels 目录+Gmail，无自有域名，仅目录+社媒"},
  {"name":"Rosetree Cottage Bakery","industry":"bakery","city":"Graveley, Cambridgeshire","source":"https://breadangels.com/bread-angels-baking-near-you","email":"rosetreecottagebakery@outlook.com","note":"Bread Angels 目录+Outlook，无独立网站"},
  {"name":"The Old Dairy Bakery","industry":"bakery","city":"Liphook, Hampshire","source":"https://breadangels.com/bread-angels-baking-near-you","email":"emmarfranklin@gmail.com","note":"Bread Angels 目录+Gmail，无自有域名，仅目录+社媒"},
  {"name":"Bara Boy Bakery","industry":"bakery","city":"Bridgend, Wales","source":"https://breadangels.com/bread-angels-baking-near-you","email":"nick.hanford1@gmail.com","note":"威尔士微烘焙 Bread Angels 目录+Gmail，无自有网站"}
];

const extra = [...a1, ...a2, ...a3, ...a4, ...a5];
const { readFileSync, writeFileSync } = await import('node:fs');
const base = JSON.parse(readFileSync('D:/workbuddy项目/2026-07-07-09-02-15/gh-pages-build/leads-100.json', 'utf8'));

// 续编 ID
let n = base.length;
const seen = {};
const out = extra.map((r) => {
  n += 1;
  const base_slug = r.name.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  let slug = base_slug + '-' + r.industry;
  if (seen[slug]) slug = base_slug + '-' + r.industry + '-' + (seen[slug]++);
  else seen[slug] = 1;
  return {
    id: 'L' + String(n).padStart(3,'0'),
    slug,
    name: r.name,
    industry: r.industry,
    city: r.city,
    source: r.source,
    email: r.email,
    emailStatus: 'found',
    hasOwnSite: false,
    note: r.note,
    status: 'lead',
    segment: 'precise',   // 精准人群标记：有邮箱+无独立站
  };
});

const all = [...base, ...out];
writeFileSync('D:/workbuddy项目/2026-07-07-09-02-15/gh-pages-build/leads-all.json', JSON.stringify(all, null, 2));

// 统计
const byIndustry = {};
for (const r of out) byIndustry[r.industry] = (byIndustry[r.industry]||0)+1;
const slugs = all.map(x=>x.slug);
console.log('新增精准商家:', out.length);
console.log('主库总数:', all.length);
console.log('新增按行业:', JSON.stringify(byIndustry));
console.log('slug 唯一:', new Set(slugs).size === slugs.length);
console.log('已写入 leads-all.json');
