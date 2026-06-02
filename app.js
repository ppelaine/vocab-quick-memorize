// Critical: set title to confirm script execution
document.title='[OK] '+document.title;
// Global error capture
window._errors=[];
window.onerror=function(msg,src,line,col,err){
  window._errors.push({msg:msg,line:line,col:col,time:new Date().toISOString()});
  document.title='[ERR:'+line+'] '+document.title.replace(/^\[.*?\]\s*/,'');
  return false;
};
// Inject debug bar (only if body ready)
if(document.body){
  var _dbg=document.createElement('div');
  _dbg.id='js-debug';
  _dbg.style.cssText='position:fixed;bottom:0;left:0;right:0;max-height:120px;overflow-y:auto;background:#111;color:#0f0;font:11px monospace;z-index:9999;padding:4px 8px;opacity:.9;';
  document.body.appendChild(_dbg);
  setTimeout(function(){
    if(window._errors.length===0)_dbg.innerHTML='JS OK — '+new Date().toLocaleTimeString();
  },500);
}

// ============================================================================
// DICTIONARY — ~550 common English words with IPA phonetics + part of speech
var _tesseractLoadPromise=null;
function _loadTesseract(){
  if(_tesseractLoadPromise)return _tesseractLoadPromise;
  _tesseractLoadPromise=new Promise(function(resolve,reject){
    if(window.Tesseract){resolve(window.Tesseract);return;}
    var s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    s.onload=function(){resolve(window.Tesseract);};
    s.onerror=function(){reject(new Error('Tesseract CDN load failed'));};
    document.head.appendChild(s);
  });
  return _tesseractLoadPromise;
}
// POS abbreviations: n.=noun, v.=verb, adj.=adjective, adv.=adverb, prep.=preposition
//   conj.=conjunction, pron.=pronoun, int.=interjection, det.=determiner, num.=number
// ============================================================================
const DICTIONARY = [
  {en:'abandon',zh:'放弃',def:'to give up completely',phonetic:'/əˈbændən/',pos:'v.'},
  {en:'ability',zh:'能力',def:'the power or skill to do something',phonetic:'/əˈbɪləti/',pos:'n.'},
  {en:'abroad',zh:'国外',def:'in or to a foreign country',phonetic:'/əˈbrɔːd/',pos:'adv.'},
  {en:'absent',zh:'缺席',def:'not present in a place',phonetic:'/ˈæbsənt/',pos:'adj.'},
  {en:'accept',zh:'接受',def:'to agree to take something',phonetic:'/əkˈsept/',pos:'v.'},
  {en:'achieve',zh:'实现',def:'to succeed in doing something',phonetic:'/əˈtʃiːv/',pos:'v.'},
  {en:'active',zh:'活跃的',def:'doing things with a lot of energy',phonetic:'/ˈæktɪv/',pos:'adj.'},
  {en:'actual',zh:'实际的',def:'real, not imagined',phonetic:'/ˈæktʃuəl/',pos:'adj.'},
  {en:'admire',zh:'钦佩',def:'to respect and like someone',phonetic:'/ədˈmaɪər/',pos:'v.'},
  {en:'adventure',zh:'冒险',def:'an exciting and unusual experience',phonetic:'/ədˈventʃər/',pos:'n.'},
  {en:'advice',zh:'建议',def:'an opinion about what to do',phonetic:'/ədˈvaɪs/',pos:'n.'},
  {en:'afraid',zh:'害怕',def:'feeling fear or worry',phonetic:'/əˈfreɪd/',pos:'adj.'},
  {en:'against',zh:'反对',def:'not agreeing with something',phonetic:'/əˈɡenst/',pos:'prep.'},
  {en:'allow',zh:'允许',def:'to let someone do something',phonetic:'/əˈlaʊ/',pos:'v.'},
  {en:'almost',zh:'几乎',def:'nearly but not completely',phonetic:'/ˈɔːlməʊst/',pos:'adv.'},
  {en:'alone',zh:'独自',def:'without other people',phonetic:'/əˈləʊn/',pos:'adj.'},
  {en:'amazing',zh:'令人惊奇的',def:'very surprising and impressive',phonetic:'/əˈmeɪzɪŋ/',pos:'adj.'},
  {en:'amount',zh:'数量',def:'how much there is of something',phonetic:'/əˈmaʊnt/',pos:'n.'},
  {en:'ancient',zh:'古代的',def:'from a very long time ago',phonetic:'/ˈeɪnʃənt/',pos:'adj.'},
  {en:'angry',zh:'生气的',def:'feeling strong displeasure',phonetic:'/ˈæŋɡri/',pos:'adj.'},
  {en:'animal',zh:'动物',def:'a living creature that is not a plant',phonetic:'/ˈænɪməl/',pos:'n.'},
  {en:'answer',zh:'回答',def:'to say something in reply',phonetic:'/ˈɑːnsər/',pos:'n.'},
  {en:'appear',zh:'出现',def:'to start to be seen',phonetic:'/əˈpɪər/',pos:'v.'},
  {en:'apple',zh:'苹果',def:'a round fruit with red or green skin',phonetic:'/ˈæpəl/',pos:'n.'},
  {en:'arrive',zh:'到达',def:'to get to a place',phonetic:'/əˈraɪv/',pos:'v.'},
  {en:'article',zh:'文章',def:'a piece of writing in a newspaper',phonetic:'/ˈɑːtɪkəl/',pos:'n.'},
  {en:'artist',zh:'艺术家',def:'someone who creates art',phonetic:'/ˈɑːtɪst/',pos:'n.'},
  {en:'athlete',zh:'运动员',def:'a person who competes in sports',phonetic:'/ˈæθliːt/',pos:'n.'},
  {en:'attention',zh:'注意力',def:'the act of focusing your mind',phonetic:'/əˈtenʃən/',pos:'n.'},
  {en:'autumn',zh:'秋天',def:'the season between summer and winter',phonetic:'/ˈɔːtəm/',pos:'n.'},
  {en:'awake',zh:'醒着的',def:'not sleeping',phonetic:'/əˈweɪk/',pos:'adj.'},
  {en:'balance',zh:'平衡',def:'a state where things are equal',phonetic:'/ˈbæləns/',pos:'n.'},
  {en:'banana',zh:'香蕉',def:'a long curved yellow fruit',phonetic:'/bəˈnɑːnə/',pos:'n.'},
  {en:'basic',zh:'基本的',def:'forming the most important part',phonetic:'/ˈbeɪsɪk/',pos:'adj.'},
  {en:'battle',zh:'战斗',def:'a fight between people or groups',phonetic:'/ˈbætəl/',pos:'n.'},
  {en:'beauty',zh:'美丽',def:'the quality of being pleasing to look at',phonetic:'/ˈbjuːti/',pos:'n.'},
  {en:'become',zh:'变成',def:'to start to be something',phonetic:'/bɪˈkʌm/',pos:'v.'},
  {en:'begin',zh:'开始',def:'to start doing something',phonetic:'/bɪˈɡɪn/',pos:'v.'},
  {en:'behave',zh:'表现',def:'to act in a particular way',phonetic:'/bɪˈheɪv/',pos:'v.'},
  {en:'believe',zh:'相信',def:'to think that something is true',phonetic:'/bɪˈliːv/',pos:'v.'},
  {en:'belong',zh:'属于',def:'to be owned by someone',phonetic:'/bɪˈlɒŋ/',pos:'v.'},
  {en:'better',zh:'更好的',def:'of a higher quality',phonetic:'/ˈbetər/',pos:'adj.'},
  {en:'bicycle',zh:'自行车',def:'a vehicle with two wheels',phonetic:'/ˈbaɪsɪkəl/',pos:'n.'},
  {en:'bitter',zh:'苦的',def:'having a sharp unpleasant taste',phonetic:'/ˈbɪtər/',pos:'adj.'},
  {en:'blanket',zh:'毯子',def:'a warm cover for a bed',phonetic:'/ˈblæŋkɪt/',pos:'n.'},
  {en:'blood',zh:'血液',def:'the red liquid inside your body',phonetic:'/blʌd/',pos:'n.'},
  {en:'borrow',zh:'借入',def:'to take something for a short time',phonetic:'/ˈbɒrəʊ/',pos:'v.'},
  {en:'bottom',zh:'底部',def:'the lowest part of something',phonetic:'/ˈbɒtəm/',pos:'n.'},
  {en:'brave',zh:'勇敢的',def:'showing courage',phonetic:'/breɪv/',pos:'adj.'},
  {en:'bread',zh:'面包',def:'a food made from flour and baked',phonetic:'/bred/',pos:'n.'},
  {en:'break',zh:'打破',def:'to damage something into pieces',phonetic:'/breɪk/',pos:'v.'},
  {en:'breath',zh:'呼吸',def:'the air that goes in and out of lungs',phonetic:'/breθ/',pos:'n.'},
  {en:'bridge',zh:'桥',def:'a structure over a river or road',phonetic:'/brɪdʒ/',pos:'n.'},
  {en:'bright',zh:'明亮的',def:'giving out a lot of light',phonetic:'/braɪt/',pos:'adj.'},
  {en:'bring',zh:'带来',def:'to carry something to a place',phonetic:'/brɪŋ/',pos:'v.'},
  {en:'broken',zh:'破碎的',def:'damaged and in pieces',phonetic:'/ˈbrəʊkən/',pos:'adj.'},
  {en:'brother',zh:'兄弟',def:'a male sibling',phonetic:'/ˈbrʌðər/',pos:'n.'},
  {en:'brown',zh:'棕色的',def:'the color of earth or wood',phonetic:'/braʊn/',pos:'adj.'},
  {en:'build',zh:'建造',def:'to make something by putting parts together',phonetic:'/bɪld/',pos:'v.'},
  {en:'butter',zh:'黄油',def:'a soft yellow food made from cream',phonetic:'/ˈbʌtər/',pos:'n.'},
  {en:'camera',zh:'相机',def:'a device for taking photographs',phonetic:'/ˈkæmərə/',pos:'n.'},
  {en:'candle',zh:'蜡烛',def:'a stick of wax that gives light',phonetic:'/ˈkændəl/',pos:'n.'},
  {en:'capital',zh:'首都',def:'the main city of a country',phonetic:'/ˈkæpɪtəl/',pos:'n.'},
  {en:'captain',zh:'队长',def:'the leader of a team or ship',phonetic:'/ˈkæptɪn/',pos:'n.'},
  {en:'career',zh:'职业',def:'a job for a long period of your life',phonetic:'/kəˈrɪər/',pos:'n.'},
  {en:'careful',zh:'小心的',def:'paying attention to avoid danger',phonetic:'/ˈkeərfəl/',pos:'adj.'},
  {en:'caring',zh:'关心他人的',def:'showing kindness and concern for others',phonetic:'/ˈkeərɪŋ/',pos:'adj.'},
  {en:'castle',zh:'城堡',def:'a large old building with thick walls',phonetic:'/ˈkɑːsəl/',pos:'n.'},
  {en:'celebrate',zh:'庆祝',def:'to do something enjoyable for a special occasion',phonetic:'/ˈselɪbreɪt/',pos:'v.'},
  {en:'center',zh:'中心',def:'the middle point of something',phonetic:'/ˈsentər/',pos:'n.'},
  {en:'certain',zh:'确定的',def:'completely sure',phonetic:'/ˈsɜːtən/',pos:'adj.'},
  {en:'chance',zh:'机会',def:'an opportunity to do something',phonetic:'/tʃɑːns/',pos:'n.'},
  {en:'change',zh:'改变',def:'to become different',phonetic:'/tʃeɪndʒ/',pos:'v.'},
  {en:'cheese',zh:'奶酪',def:'a solid food made from milk',phonetic:'/tʃiːz/',pos:'n.'},
  {en:'chicken',zh:'鸡',def:'a bird kept for its eggs and meat',phonetic:'/ˈtʃɪkɪn/',pos:'n.'},
  {en:'choice',zh:'选择',def:'the act of picking between things',phonetic:'/tʃɔɪs/',pos:'n.'},
  {en:'choose',zh:'选择',def:'to decide what you want',phonetic:'/tʃuːz/',pos:'v.'},
  {en:'circle',zh:'圆形',def:'a perfectly round shape',phonetic:'/ˈsɜːkəl/',pos:'n.'},
  {en:'citizen',zh:'公民',def:'a person who belongs to a country',phonetic:'/ˈsɪtɪzən/',pos:'n.'},
  {en:'clever',zh:'聪明的',def:'quick to learn and understand',phonetic:'/ˈklevər/',pos:'adj.'},
  {en:'climate',zh:'气候',def:'the typical weather of a place',phonetic:'/ˈklaɪmət/',pos:'n.'},
  {en:'climb',zh:'爬',def:'to go up something using hands and feet',phonetic:'/klaɪm/',pos:'v.'},
  {en:'clock',zh:'时钟',def:'a device that shows the time',phonetic:'/klɒk/',pos:'n.'},
  {en:'cloud',zh:'云',def:'a white mass in the sky',phonetic:'/klaʊd/',pos:'n.'},
  {en:'coffee',zh:'咖啡',def:'a hot dark drink',phonetic:'/ˈkɒfi/',pos:'n.'},
  {en:'collect',zh:'收集',def:'to gather things together',phonetic:'/kəˈlekt/',pos:'v.'},
  {en:'college',zh:'大学',def:'a place for higher education',phonetic:'/ˈkɒlɪdʒ/',pos:'n.'},
  {en:'colour',zh:'颜色',def:'red blue green yellow etc',phonetic:'/ˈkʌlər/',pos:'n.'},
  {en:'common',zh:'常见的',def:'happening often',phonetic:'/ˈkɒmən/',pos:'adj.'},
  {en:'company',zh:'公司',def:'a business organization',phonetic:'/ˈkʌmpəni/',pos:'n.'},
  {en:'compare',zh:'比较',def:'to look at how things are similar or different',phonetic:'/kəmˈpeər/',pos:'v.'},
  {en:'compete',zh:'竞争',def:'to try to be better than others',phonetic:'/kəmˈpiːt/',pos:'v.'},
  {en:'complete',zh:'完成',def:'to finish doing something',phonetic:'/kəmˈpliːt/',pos:'v.'},
  {en:'concert',zh:'音乐会',def:'a performance of music by singers or musicians',phonetic:'/ˈkɒnsət/',pos:'n.'},
  {en:'confident',zh:'自信的',def:'feeling sure about your own abilities',phonetic:'/ˈkɒnfɪdənt/',pos:'adj.'},
  {en:'connect',zh:'连接',def:'to join things together',phonetic:'/kəˈnekt/',pos:'v.'},
  {en:'continue',zh:'继续',def:'To keep happening, existing, or doing something without stopping.',phonetic:'/kənˈtɪnjuː/',pos:'v.'},
  {en:'control',zh:'控制',def:'the power to make decisions',phonetic:'/kənˈtrəʊl/',pos:'v.'},
  {en:'correct',zh:'正确的',def:'right, without mistakes',phonetic:'/kəˈrekt/',pos:'adj.'},
  {en:'country',zh:'国家',def:'an area of land with its own government',phonetic:'/ˈkʌntri/',pos:'n.'},
  {en:'courage',zh:'勇气',def:'the ability to face danger or pain',phonetic:'/ˈkʌrɪdʒ/',pos:'n.'},
  {en:'cousin',zh:'表亲',def:'the child of your aunt or uncle',phonetic:'/ˈkʌzən/',pos:'n.'},
  {en:'create',zh:'创造',def:'to make something new',phonetic:'/kriˈeɪt/',pos:'v.'},
  {en:'cucumber',zh:'黄瓜',def:'a long green vegetable',phonetic:'/ˈkjuːkʌmbər/',pos:'n.'},
  {en:'curious',zh:'好奇的',def:'wanting to know or learn',phonetic:'/ˈkjʊəriəs/',pos:'adj.'},
  {en:'danger',zh:'危险',def:'the possibility of harm',phonetic:'/ˈdeɪndʒər/',pos:'n.'},
  {en:'decide',zh:'决定',def:'to make a choice',phonetic:'/dɪˈsaɪd/',pos:'v.'},
  {en:'defeat',zh:'击败',def:'to win against someone',phonetic:'/dɪˈfiːt/',pos:'v.'},
  {en:'defend',zh:'防守',def:'to protect from attack',phonetic:'/dɪˈfend/',pos:'v.'},
  {en:'delicious',zh:'美味的',def:'tasting very good',phonetic:'/dɪˈlɪʃəs/',pos:'adj.'},
  {en:'depend',zh:'依赖',def:'to need help from someone or something',phonetic:'/dɪˈpend/',pos:'v.'},
  {en:'desert',zh:'沙漠',def:'a hot dry area of land',phonetic:'/ˈdezət/',pos:'n.'},
  {en:'design',zh:'设计',def:'to plan how something will look',phonetic:'/dɪˈzaɪn/',pos:'v.'},
  {en:'destroy',zh:'破坏',def:'to damage something completely',phonetic:'/dɪˈstrɔɪ/',pos:'v.'},
  {en:'develop',zh:'发展',def:'to grow or change over time',phonetic:'/dɪˈveləp/',pos:'v.'},
  {en:'diamond',zh:'钻石',def:'a very hard bright precious stone',phonetic:'/ˈdaɪəmənd/',pos:'n.'},
  {en:'dictionary',zh:'词典',def:'a book that lists words and their meanings',phonetic:'/ˈdɪkʃənəri/',pos:'n.'},
  {en:'difference',zh:'差异',def:'the way in which things are not the same',phonetic:'/ˈdɪfərəns/',pos:'n.'},
  {en:'difficult',zh:'困难的',def:'not easy to do or understand',phonetic:'/ˈdɪfɪkəlt/',pos:'adj.'},
  {en:'dinner',zh:'晚餐',def:'the main meal of the day',phonetic:'/ˈdɪnər/',pos:'n.'},
  {en:'direct',zh:'直接的',def:'going straight to a place',phonetic:'/daɪˈrekt/',pos:'adj.'},
  {en:'discover',zh:'发现',def:'to find something for the first time',phonetic:'/dɪˈskʌvər/',pos:'v.'},
  {en:'discuss',zh:'讨论',def:'to talk about something with someone',phonetic:'/dɪˈskʌs/',pos:'v.'},
  {en:'disease',zh:'疾病',def:'an illness that affects a person or animal',phonetic:'/dɪˈziːz/',pos:'n.'},
  {en:'distance',zh:'距离',def:'the amount of space between two things',phonetic:'/ˈdɪstəns/',pos:'n.'},
  {en:'divide',zh:'分开',def:'to separate into parts',phonetic:'/dɪˈvaɪd/',pos:'v.'},
  {en:'dollar',zh:'美元',def:'the unit of money in the US',phonetic:'/ˈdɒlər/',pos:'n.'},
  {en:'double',zh:'双倍的',def:'twice as much',phonetic:'/ˈdʌbəl/',pos:'adj.'},
  {en:'dragon',zh:'龙',def:'an imaginary fire-breathing animal',phonetic:'/ˈdræɡən/',pos:'n.'},
  {en:'dream',zh:'梦想',def:'something you hope to achieve',phonetic:'/driːm/',pos:'n.'},
  {en:'driver',zh:'司机',def:'someone who drives a vehicle',phonetic:'/ˈdraɪvər/',pos:'n.'},
  {en:'during',zh:'在...期间',def:'all through a period of time',phonetic:'/ˈdjʊərɪŋ/',pos:'prep.'},
  {en:'eager',zh:'渴望的',def:'wanting to do something very much',phonetic:'/ˈiːɡər/',pos:'adj.'},
  {en:'eagle',zh:'鹰',def:'a large bird that hunts small animals',phonetic:'/ˈiːɡəl/',pos:'n.'},
  {en:'earth',zh:'地球',def:'the planet we live on',phonetic:'/ɜːθ/',pos:'n.'},
  {en:'easily',zh:'容易地',def:'without difficulty',phonetic:'/ˈiːzɪli/',pos:'adv.'},
  {en:'easy-going',zh:'随和的',def:'relaxed and not easily upset or worried',phonetic:'/ˌiːziˈɡəʊɪŋ/',pos:'adj.'},
  {en:'education',zh:'教育',def:'the process of teaching and learning',phonetic:'/ˌedjʊˈkeɪʃən/',pos:'n.'},
  {en:'effect',zh:'效果',def:'a result or change caused by something',phonetic:'/ɪˈfekt/',pos:'n.'},
  {en:'effort',zh:'努力',def:'the physical or mental energy needed',phonetic:'/ˈefət/',pos:'n.'},
  {en:'either',zh:'任一',def:'one or the other of two',phonetic:'/ˈaɪðər/',pos:'conj.'},
  {en:'elephant',zh:'大象',def:'a very large grey animal with a trunk',phonetic:'/ˈelɪfənt/',pos:'n.'},
  {en:'empty',zh:'空的',def:'having nothing inside',phonetic:'/ˈempti/',pos:'adj.'},
  {en:'encourage',zh:'鼓励',def:'to give someone confidence',phonetic:'/ɪnˈkʌrɪdʒ/',pos:'v.'},
  {en:'enemy',zh:'敌人',def:'someone who wants to harm you',phonetic:'/ˈenəmi/',pos:'n.'},
  {en:'energy',zh:'能量',def:'the ability to be active and work hard',phonetic:'/ˈenədʒi/',pos:'n.'},
  {en:'engine',zh:'引擎',def:'a machine that provides power',phonetic:'/ˈendʒɪn/',pos:'n.'},
  {en:'enjoy',zh:'享受',def:'to take pleasure in something',phonetic:'/ɪnˈdʒɔɪ/',pos:'v.'},
  {en:'enough',zh:'足够的',def:'as much as is needed',phonetic:'/ɪˈnʌf/',pos:'adj.'},
  {en:'enter',zh:'进入',def:'to go into a place',phonetic:'/ˈentər/',pos:'v.'},
  {en:'escape',zh:'逃跑',def:'to get away from a place',phonetic:'/ɪˈskeɪp/',pos:'v.'},
  {en:'event',zh:'事件',def:'something that happens',phonetic:'/ɪˈvent/',pos:'n.'},
  {en:'examine',zh:'检查',def:'to look at something carefully',phonetic:'/ɪɡˈzæmɪn/',pos:'v.'},
  {en:'example',zh:'例子',def:'something that shows what others are like',phonetic:'/ɪɡˈzɑːmpəl/',pos:'n.'},
  {en:'excellent',zh:'优秀的',def:'extremely good',phonetic:'/ˈeksələnt/',pos:'adj.'},
  {en:'excite',zh:'使兴奋',def:'to make someone feel happy and eager',phonetic:'/ɪkˈsaɪt/',pos:'v.'},
  {en:'excuse',zh:'借口',def:'a reason given to explain a mistake',phonetic:'/ɪkˈskjuːs/',pos:'n.'},
  {en:'exercise',zh:'练习',def:'activity to improve skill or health',phonetic:'/ˈeksəsaɪz/',pos:'n.'},
  {en:'expect',zh:'期望',def:'to think something will happen',phonetic:'/ɪkˈspekt/',pos:'v.'},
  {en:'explain',zh:'解释',def:'to make something clear',phonetic:'/ɪkˈspleɪn/',pos:'v.'},
  {en:'explore',zh:'探索',def:'to travel around to learn about a place',phonetic:'/ɪkˈsplɔːr/',pos:'v.'},
  {en:'express',zh:'表达',def:'to show feelings or ideas',phonetic:'/ɪkˈspres/',pos:'v.'},
  {en:'factory',zh:'工厂',def:'a building where things are made',phonetic:'/ˈfæktəri/',pos:'n.'},
  {en:'familiar',zh:'熟悉的',def:'well known to you',phonetic:'/fəˈmɪliər/',pos:'adj.'},
  {en:'famous',zh:'著名的',def:'known by many people',phonetic:'/ˈfeɪməs/',pos:'adj.'},
  {en:'fancy',zh:'精致的',def:'decorative and expensive',phonetic:'/ˈfænsi/',pos:'adj.'},
  {en:'farmer',zh:'农民',def:'someone who grows food or keeps animals',phonetic:'/ˈfɑːmər/',pos:'n.'},
  {en:'fashion',zh:'时尚',def:'a popular style of clothes or behavior',phonetic:'/ˈfæʃən/',pos:'n.'},
  {en:'favour',zh:'支持',def:'approval or support for something',phonetic:'/ˈfeɪvər/',pos:'n.'},
  {en:'fear',zh:'恐惧',def:'a strong unpleasant feeling of danger',phonetic:'/fɪər/',pos:'n.'},
  {en:'fellow',zh:'同伴',def:'a person you work or study with',phonetic:'/ˈfeləʊ/',pos:'n.'},
  {en:'female',zh:'女性',def:'belonging to the sex that can have babies',phonetic:'/ˈfiːmeɪl/',pos:'adj.'},
  {en:'figure',zh:'数字/人物',def:'a number or an important person',phonetic:'/ˈfɪɡər/',pos:'n.'},
  {en:'finger',zh:'手指',def:'one of the five parts at the end of your hand',phonetic:'/ˈfɪŋɡər/',pos:'n.'},
  {en:'finish',zh:'完成',def:'to complete something',phonetic:'/ˈfɪnɪʃ/',pos:'v.'},
  {en:'flower',zh:'花',def:'the colored part of a plant',phonetic:'/ˈflaʊər/',pos:'n.'},
  {en:'follow',zh:'跟随',def:'to go after someone or something',phonetic:'/ˈfɒləʊ/',pos:'v.'},
  {en:'forest',zh:'森林',def:'a large area of land covered with trees',phonetic:'/ˈfɒrɪst/',pos:'n.'},
  {en:'forget',zh:'忘记',def:'to not remember something',phonetic:'/fərˈɡet/',pos:'v.'},
  {en:'forgive',zh:'原谅',def:'to stop being angry with someone',phonetic:'/fərˈɡɪv/',pos:'v.'},
  {en:'freedom',zh:'自由',def:'the right to do what you want',phonetic:'/ˈfriːdəm/',pos:'n.'},
  {en:'freeze',zh:'冻结',def:'to become hard because of cold',phonetic:'/friːz/',pos:'v.'},
  {en:'friendly',zh:'友好的',def:'behaving in a kind and pleasant way',phonetic:'/ˈfrendli/',pos:'adj.'},
  {en:'frighten',zh:'吓唬',def:'to make someone feel afraid',phonetic:'/ˈfraɪtən/',pos:'v.'},
  {en:'funny',zh:'有趣的',def:'making you laugh or smile',phonetic:'/ˈfʌni/',pos:'adj.'},
  {en:'future',zh:'未来',def:'the time that will come after now',phonetic:'/ˈfjuːtʃər/',pos:'n.'},
  {en:'garden',zh:'花园',def:'a piece of land where flowers or vegetables grow',phonetic:'/ˈɡɑːdən/',pos:'n.'},
  {en:'general',zh:'一般的',def:'not specific or detailed',phonetic:'/ˈdʒenərəl/',pos:'adj.'},
  {en:'genius',zh:'天才',def:'someone with very great ability',phonetic:'/ˈdʒiːniəs/',pos:'n.'},
  {en:'gentle',zh:'温和的',def:'kind and careful not to hurt',phonetic:'/ˈdʒentəl/',pos:'adj.'},
  {en:'giant',zh:'巨大的',def:'extremely large',phonetic:'/ˈdʒaɪənt/',pos:'adj.'},
  {en:'glad',zh:'高兴的',def:'feeling happy about something',phonetic:'/ɡlæd/',pos:'adj.'},
  {en:'global',zh:'全球的',def:'relating to the whole world',phonetic:'/ˈɡləʊbəl/',pos:'adj.'},
  {en:'golden',zh:'金色的',def:'having the color of gold',phonetic:'/ˈɡəʊldən/',pos:'adj.'},
  {en:'govern',zh:'统治',def:'to officially control a country',phonetic:'/ˈɡʌvən/',pos:'v.'},
  {en:'gradual',zh:'逐渐的',def:'happening slowly over time',phonetic:'/ˈɡrædʒuəl/',pos:'adj.'},
  {en:'grateful',zh:'感激的',def:'feeling that you want to thank someone',phonetic:'/ˈɡreɪtfəl/',pos:'adj.'},
  {en:'ground',zh:'地面',def:'the surface of the earth',phonetic:'/ɡraʊnd/',pos:'n.'},
  {en:'guarantee',zh:'保证',def:'a promise that something will happen',phonetic:'/ˌɡærənˈtiː/',pos:'v.'},
  {en:'guard',zh:'守卫',def:'to protect a person or place',phonetic:'/ɡɑːd/',pos:'v.'},
  {en:'guest',zh:'客人',def:'someone who visits your home',phonetic:'/ɡest/',pos:'n.'},
  {en:'guide',zh:'导游',def:'someone who shows the way',phonetic:'/ɡaɪd/',pos:'n.'},
  {en:'habit',zh:'习惯',def:'something you do regularly',phonetic:'/ˈhæbɪt/',pos:'n.'},
  {en:'hammer',zh:'锤子',def:'a tool for hitting nails',phonetic:'/ˈhæmər/',pos:'n.'},
  {en:'handsome',zh:'英俊的',def:'good-looking, usually for men',phonetic:'/ˈhænsəm/',pos:'adj.'},
  {en:'happen',zh:'发生',def:'to take place',phonetic:'/ˈhæpən/',pos:'v.'},
  {en:'harvest',zh:'收获',def:'the time when crops are gathered',phonetic:'/ˈhɑːvɪst/',pos:'n.'},
  {en:'health',zh:'健康',def:'the condition of your body and mind',phonetic:'/helθ/',pos:'n.'},
  {en:'heaven',zh:'天堂',def:'a place where good people go after death',phonetic:'/ˈhevən/',pos:'n.'},
  {en:'height',zh:'高度',def:'how tall something is',phonetic:'/haɪt/',pos:'n.'},
  {en:'hero',zh:'英雄',def:'someone who does brave things',phonetic:'/ˈhɪərəʊ/',pos:'n.'},
  {en:'hidden',zh:'隐藏的',def:'not easy to see or find',phonetic:'/ˈhɪdən/',pos:'adj.'},
  {en:'honest',zh:'诚实的',def:'telling the truth',phonetic:'/ˈɒnɪst/',pos:'adj.'},
  {en:'honour',zh:'荣誉',def:'great respect from other people',phonetic:'/ˈɒnər/',pos:'n.'},
  {en:'horror',zh:'恐怖',def:'a strong feeling of shock and fear',phonetic:'/ˈhɒrər/',pos:'n.'},
  {en:'humour',zh:'幽默',def:'the ability to find things funny',phonetic:'/ˈhjuːmər/',pos:'n.'},
  {en:'hungry',zh:'饥饿的',def:'wanting to eat food',phonetic:'/ˈhʌŋɡri/',pos:'adj.'},
  {en:'hunter',zh:'猎人',def:'someone who kills wild animals',phonetic:'/ˈhʌntər/',pos:'n.'},
  {en:'imagine',zh:'想象',def:'to form a picture in your mind',phonetic:'/ɪˈmædʒɪn/',pos:'v.'},
  {en:'impress',zh:'给...留下印象',def:'to make someone admire you',phonetic:'/ɪmˈpres/',pos:'v.'},
  {en:'impression',zh:'印象',def:'an idea or opinion you have about someone or something',phonetic:'/ɪmˈpreʃən/',pos:'n.'},
  {en:'include',zh:'包括',def:'to have as a part of something',phonetic:'/ɪnˈkluːd/',pos:'v.'},
  {en:'incredible',zh:'难以置信的',def:'impossible or very difficult to believe',phonetic:'/ɪnˈkredɪbəl/',pos:'adj.'},
  {en:'insect',zh:'昆虫',def:'a small creature with six legs',phonetic:'/ˈɪnsekt/',pos:'n.'},
  {en:'inside',zh:'里面',def:'the inner part of something',phonetic:'/ɪnˈsaɪd/',pos:'prep.'},
  {en:'instead',zh:'代替',def:'in place of something else',phonetic:'/ɪnˈsted/',pos:'adv.'},
  {en:'intelligent',zh:'聪明的',def:'having a high mental ability',phonetic:'/ɪnˈtelɪdʒənt/',pos:'adj.'},
  {en:'invent',zh:'发明',def:'to create something new',phonetic:'/ɪnˈvent/',pos:'v.'},
  {en:'invite',zh:'邀请',def:'to ask someone to come somewhere',phonetic:'/ɪnˈvaɪt/',pos:'v.'},
  {en:'island',zh:'岛屿',def:'a piece of land surrounded by water',phonetic:'/ˈaɪlənd/',pos:'n.'},
  {en:'jacket',zh:'夹克',def:'a short coat',phonetic:'/ˈdʒækɪt/',pos:'n.'},
  {en:'journey',zh:'旅程',def:'a trip from one place to another',phonetic:'/ˈdʒɜːni/',pos:'n.'},
  {en:'judge',zh:'判断',def:'to form an opinion about something',phonetic:'/dʒʌdʒ/',pos:'v.'},
  {en:'jungle',zh:'丛林',def:'a thick tropical forest',phonetic:'/ˈdʒʌŋɡəl/',pos:'n.'},
  {en:'junior',zh:'低年级的',def:'relating to young people',phonetic:'/ˈdʒuːniər/',pos:'adj.'},
  {en:'justice',zh:'正义',def:'fair treatment of people',phonetic:'/ˈdʒʌstɪs/',pos:'n.'},
  {en:'keen',zh:'热衷的',def:'very interested or eager',phonetic:'/kiːn/',pos:'adj.'},
  {en:'kingdom',zh:'王国',def:'a country ruled by a king or queen',phonetic:'/ˈkɪŋdəm/',pos:'n.'},
  {en:'kitchen',zh:'厨房',def:'a room where food is prepared',phonetic:'/ˈkɪtʃɪn/',pos:'n.'},
  {en:'kitten',zh:'小猫',def:'a young cat',phonetic:'/ˈkɪtən/',pos:'n.'},
  {en:'knowledge',zh:'知识',def:'information and skills you have learned',phonetic:'/ˈnɒlɪdʒ/',pos:'n.'},
  {en:'labour',zh:'劳动',def:'hard physical work',phonetic:'/ˈleɪbər/',pos:'n.'},
  {en:'lantern',zh:'灯笼',def:'a light inside a container',phonetic:'/ˈlæntən/',pos:'n.'},
  {en:'latter',zh:'后者',def:'the second of two things mentioned',phonetic:'/ˈlætər/',pos:'adj.'},
  {en:'launch',zh:'发射',def:'to send a rocket into space',phonetic:'/lɔːntʃ/',pos:'v.'},
  {en:'leader',zh:'领导者',def:'a person who guides a group',phonetic:'/ˈliːdər/',pos:'n.'},
  {en:'league',zh:'联盟',def:'a group of teams that compete together',phonetic:'/liːɡ/',pos:'n.'},
  {en:'length',zh:'长度',def:'how long something is',phonetic:'/leŋθ/',pos:'n.'},
  {en:'lesson',zh:'课程',def:'a period of teaching',phonetic:'/ˈlesən/',pos:'n.'},
  {en:'liberty',zh:'自由',def:'the state of being free',phonetic:'/ˈlɪbəti/',pos:'n.'},
  {en:'liquid',zh:'液体',def:'a substance that flows like water',phonetic:'/ˈlɪkwɪd/',pos:'n.'},
  {en:'listen',zh:'听',def:'to pay attention to sounds',phonetic:'/ˈlɪsən/',pos:'v.'},
  {en:'lonely',zh:'孤独的',def:'sad because you are alone',phonetic:'/ˈləʊnli/',pos:'adj.'},
  {en:'lovely',zh:'可爱的',def:'very nice or beautiful',phonetic:'/ˈlʌvli/',pos:'adj.'},
  {en:'luggage',zh:'行李',def:'bags you take when traveling',phonetic:'/ˈlʌɡɪdʒ/',pos:'n.'},
  {en:'machine',zh:'机器',def:'a device that does a particular job',phonetic:'/məˈʃiːn/',pos:'n.'},
  {en:'magazine',zh:'杂志',def:'a thin book with articles and pictures',phonetic:'/ˌmæɡəˈziːn/',pos:'n.'},
  {en:'magic',zh:'魔法',def:'a special power to make impossible things happen',phonetic:'/ˈmædʒɪk/',pos:'n.'},
  {en:'manage',zh:'管理',def:'To be in charge of or control something successfully.',phonetic:'/ˈmænɪdʒ/',pos:'v.'},
  {en:'market',zh:'市场',def:'a place where people buy and sell things',phonetic:'/ˈmɑːkɪt/',pos:'n.'},
  {en:'marriage',zh:'婚姻',def:'the relationship between married people',phonetic:'/ˈmærɪdʒ/',pos:'n.'},
  {en:'master',zh:'掌握',def:'to learn something completely',phonetic:'/ˈmɑːstər/',pos:'v.'},
  {en:'measure',zh:'测量',def:'to find the size or amount of something',phonetic:'/ˈmeʒər/',pos:'v.'},
  {en:'member',zh:'成员',def:'a person who belongs to a group',phonetic:'/ˈmembər/',pos:'n.'},
  {en:'memory',zh:'记忆',def:'the ability to remember things',phonetic:'/ˈmeməri/',pos:'n.'},
  {en:'mention',zh:'提到',def:'to talk about something briefly',phonetic:'/ˈmenʃən/',pos:'v.'},
  {en:'message',zh:'消息',def:'a piece of information you send to someone',phonetic:'/ˈmesɪdʒ/',pos:'n.'},
  {en:'method',zh:'方法',def:'a way of doing something',phonetic:'/ˈmeθəd/',pos:'n.'},
  {en:'middle',zh:'中间',def:'the center of something',phonetic:'/ˈmɪdəl/',pos:'n.'},
  {en:'million',zh:'百万',def:'the number 1000000',phonetic:'/ˈmɪljən/',pos:'num.'},
  {en:'miracle',zh:'奇迹',def:'an amazing and lucky event',phonetic:'/ˈmɪrəkəl/',pos:'n.'},
  {en:'mirror',zh:'镜子',def:'a piece of glass that shows your reflection',phonetic:'/ˈmɪrər/',pos:'n.'},
  {en:'mistake',zh:'错误',def:'something that is not correct',phonetic:'/mɪˈsteɪk/',pos:'n.'},
  {en:'modern',zh:'现代的',def:'relating to the present time',phonetic:'/ˈmɒdən/',pos:'adj.'},
  {en:'moment',zh:'时刻',def:'a very short period of time',phonetic:'/ˈməʊmənt/',pos:'n.'},
  {en:'monster',zh:'怪物',def:'an imaginary large frightening creature',phonetic:'/ˈmɒnstər/',pos:'n.'},
  {en:'morning',zh:'早晨',def:'the early part of the day',phonetic:'/ˈmɔːnɪŋ/',pos:'n.'},
  {en:'mountain',zh:'山',def:'a very high hill',phonetic:'/ˈmaʊntɪn/',pos:'n.'},
  {en:'muscle',zh:'肌肉',def:'a piece of flesh that makes you move',phonetic:'/ˈmʌsəl/',pos:'n.'},
  {en:'mystery',zh:'谜',def:'something that cannot be explained',phonetic:'/ˈmɪstəri/',pos:'n.'},
  {en:'narrow',zh:'狭窄的',def:'not wide',phonetic:'/ˈnærəʊ/',pos:'adj.'},
  {en:'nation',zh:'国家',def:'a country and its people',phonetic:'/ˈneɪʃən/',pos:'n.'},
  {en:'nature',zh:'自然',def:'the world of plants animals and weather',phonetic:'/ˈneɪtʃər/',pos:'n.'},
  {en:'naughty',zh:'淘气的',def:'behaving badly, used for children',phonetic:'/ˈnɔːti/',pos:'adj.'},
  {en:'nervous',zh:'紧张的',def:'feeling worried about something',phonetic:'/ˈnɜːvəs/',pos:'adj.'},
  {en:'normal',zh:'正常的',def:'usual and ordinary',phonetic:'/ˈnɔːməl/',pos:'adj.'},
  {en:'notice',zh:'注意',def:'to see or become aware of something',phonetic:'/ˈnəʊtɪs/',pos:'v.'},
  {en:'number',zh:'数字',def:'a word or symbol for counting',phonetic:'/ˈnʌmbər/',pos:'n.'},
  {en:'object',zh:'物体',def:'a thing that you can see and touch',phonetic:'/ˈɒbdʒɪkt/',pos:'n.'},
  {en:'obvious',zh:'明显的',def:'easy to see or understand',phonetic:'/ˈɒbviəs/',pos:'adj.'},
  {en:'ocean',zh:'海洋',def:'the very large area of salt water',phonetic:'/ˈəʊʃən/',pos:'n.'},
  {en:'office',zh:'办公室',def:'a room where people work',phonetic:'/ˈɒfɪs/',pos:'n.'},
  {en:'opinion',zh:'意见',def:'what you think about something',phonetic:'/əˈpɪnjən/',pos:'n.'},
  {en:'opposite',zh:'相反的',def:'completely different',phonetic:'/ˈɒpəzɪt/',pos:'adj.'},
  {en:'orange',zh:'橙子',def:'a round sweet fruit with orange skin',phonetic:'/ˈɒrɪndʒ/',pos:'n.'},
  {en:'oxygen',zh:'氧气',def:'a gas in the air that we breathe',phonetic:'/ˈɒksɪdʒən/',pos:'n.'},
  {en:'palace',zh:'宫殿',def:'a large house where a king or queen lives',phonetic:'/ˈpælɪs/',pos:'n.'},
  {en:'parent',zh:'父母',def:'a mother or father',phonetic:'/ˈpeərənt/',pos:'n.'},
  {en:'partner',zh:'伙伴',def:'someone you do something with',phonetic:'/ˈpɑːtnər/',pos:'n.'},
  {en:'passage',zh:'段落',def:'a short section of a book or piece of music',phonetic:'/ˈpæsɪdʒ/',pos:'n.'},
  {en:'patient',zh:'耐心的',def:'able to wait without getting angry',phonetic:'/ˈpeɪʃənt/',pos:'adj.'},
  {en:'pattern',zh:'模式',def:'a regular way in which something happens',phonetic:'/ˈpætən/',pos:'n.'},
  {en:'perfect',zh:'完美的',def:'as good as possible',phonetic:'/ˈpɜːfɪkt/',pos:'adj.'},
  {en:'period',zh:'时期',def:'a length of time',phonetic:'/ˈpɪəriəd/',pos:'n.'},
  {en:'picnic',zh:'野餐',def:'a meal eaten outdoors',phonetic:'/ˈpɪknɪk/',pos:'n.'},
  {en:'picture',zh:'图片',def:'a painting drawing or photograph',phonetic:'/ˈpɪktʃər/',pos:'n.'},
  {en:'pillow',zh:'枕头',def:'a soft thing you rest your head on in bed',phonetic:'/ˈpɪləʊ/',pos:'n.'},
  {en:'planet',zh:'行星',def:'a large object that moves around a star',phonetic:'/ˈplænɪt/',pos:'n.'},
  {en:'plastic',zh:'塑料',def:'a man-made material used to make many things',phonetic:'/ˈplæstɪk/',pos:'n.'},
  {en:'pleasant',zh:'愉快的',def:'nice and enjoyable',phonetic:'/ˈplezənt/',pos:'adj.'},
  {en:'pocket',zh:'口袋',def:'a small bag sewn into clothes',phonetic:'/ˈpɒkɪt/',pos:'n.'},
  {en:'police',zh:'警察',def:'the organization that keeps people safe',phonetic:'/pəˈliːs/',pos:'n.'},
  {en:'polite',zh:'有礼貌的',def:'behaving in a way that is respectful',phonetic:'/pəˈlaɪt/',pos:'adj.'},
  {en:'popular',zh:'流行的',def:'liked by many people',phonetic:'/ˈpɒpjʊlər/',pos:'adj.'},
  {en:'power',zh:'力量',def:'the ability to control people or things',phonetic:'/ˈpaʊər/',pos:'n.'},
  {en:'practise',zh:'练习',def:'to do something regularly to get better',phonetic:'/ˈpræktɪs/',pos:'v.'},
  {en:'praise',zh:'表扬',def:'to say good things about someone',phonetic:'/preɪz/',pos:'v.'},
  {en:'predict',zh:'预测',def:'to say what will happen in the future',phonetic:'/prɪˈdɪkt/',pos:'v.'},
  {en:'prepare',zh:'准备',def:'to make ready for something',phonetic:'/prɪˈpeər/',pos:'v.'},
  {en:'present',zh:'礼物',def:'something you give to someone',phonetic:'/ˈprezənt/',pos:'n.'},
  {en:'president',zh:'总统',def:'the leader of a country',phonetic:'/ˈprezɪdənt/',pos:'n.'},
  {en:'pressure',zh:'压力',def:'the force that pushes on something',phonetic:'/ˈpreʃər/',pos:'n.'},
  {en:'pretend',zh:'假装',def:'to behave as if something is true',phonetic:'/prɪˈtend/',pos:'v.'},
  {en:'prevent',zh:'阻止',def:'to stop something from happening',phonetic:'/prɪˈvent/',pos:'v.'},
  {en:'prince',zh:'王子',def:'the son of a king or queen',phonetic:'/prɪns/',pos:'n.'},
  {en:'prison',zh:'监狱',def:'a place where criminals are kept',phonetic:'/ˈprɪzən/',pos:'n.'},
  {en:'private',zh:'私人的',def:'for one person or group only',phonetic:'/ˈpraɪvɪt/',pos:'adj.'},
  {en:'problem',zh:'问题',def:'a difficult situation',phonetic:'/ˈprɒbləm/',pos:'n.'},
  {en:'produce',zh:'生产',def:'to make or grow something',phonetic:'/prəˈdjuːs/',pos:'v.'},
  {en:'program',zh:'程序',def:'a set of instructions for a computer',phonetic:'/ˈprəʊɡræm/',pos:'n.'},
  {en:'progress',zh:'进步',def:'movement towards a better state',phonetic:'/ˈprəʊɡres/',pos:'n.'},
  {en:'promise',zh:'承诺',def:'to say you will definitely do something',phonetic:'/ˈprɒmɪs/',pos:'v.'},
  {en:'protect',zh:'保护',def:'to keep safe from harm',phonetic:'/prəˈtekt/',pos:'v.'},
  {en:'proud',zh:'骄傲的',def:'feeling pleased about something you did',phonetic:'/praʊd/',pos:'adj.'},
  {en:'provide',zh:'提供',def:'to give something that is needed',phonetic:'/prəˈvaɪd/',pos:'v.'},
  {en:'publish',zh:'出版',def:'to make a book available for sale',phonetic:'/ˈpʌblɪʃ/',pos:'v.'},
  {en:'punish',zh:'惩罚',def:'to make someone suffer for bad behavior',phonetic:'/ˈpʌnɪʃ/',pos:'v.'},
  {en:'purpose',zh:'目的',def:'the reason for doing something',phonetic:'/ˈpɜːpəs/',pos:'n.'},
  {en:'quality',zh:'质量',def:'how good or bad something is',phonetic:'/ˈkwɒlɪti/',pos:'n.'},
  {en:'quarter',zh:'四分之一',def:'one of four equal parts',phonetic:'/ˈkwɔːtər/',pos:'n.'},
  {en:'quickly',zh:'快速地',def:'at a fast speed',phonetic:'/ˈkwɪkli/',pos:'adv.'},
  {en:'rabbit',zh:'兔子',def:'a small animal with long ears',phonetic:'/ˈræbɪt/',pos:'n.'},
  {en:'rainbow',zh:'彩虹',def:'an arch of colors in the sky after rain',phonetic:'/ˈreɪnbəʊ/',pos:'n.'},
  {en:'reason',zh:'原因',def:'the cause or explanation for something',phonetic:'/ˈriːzən/',pos:'n.'},
  {en:'receive',zh:'收到',def:'to get something given to you',phonetic:'/rɪˈsiːv/',pos:'v.'},
  {en:'record',zh:'记录',def:'to write down information',phonetic:'/rɪˈkɔːd/',pos:'v.'},
  {en:'refuse',zh:'拒绝',def:'to say no to something',phonetic:'/rɪˈfjuːz/',pos:'v.'},
  {en:'regret',zh:'后悔',def:'to feel sorry about something you did',phonetic:'/rɪˈɡret/',pos:'v.'},
  {en:'remain',zh:'保持',def:'to stay in the same state',phonetic:'/rɪˈmeɪn/',pos:'v.'},
  {en:'remind',zh:'提醒',def:'to help someone remember',phonetic:'/rɪˈmaɪnd/',pos:'v.'},
  {en:'remove',zh:'移除',def:'to take something away',phonetic:'/rɪˈmuːv/',pos:'v.'},
  {en:'repair',zh:'修理',def:'to fix something broken',phonetic:'/rɪˈpeər/',pos:'v.'},
  {en:'repeat',zh:'重复',def:'to say or do something again',phonetic:'/rɪˈpiːt/',pos:'v.'},
  {en:'replace',zh:'替换',def:'to use something instead of another',phonetic:'/rɪˈpleɪs/',pos:'v.'},
  {en:'report',zh:'报告',def:'a description of an event or situation',phonetic:'/rɪˈpɔːt/',pos:'n.'},
  {en:'require',zh:'需要',def:'to need something',phonetic:'/rɪˈkwaɪər/',pos:'v.'},
  {en:'respect',zh:'尊重',def:'to admire and treat well',phonetic:'/rɪˈspekt/',pos:'v.'},
  {en:'respondent',zh:'受访者',def:'a person who answers questions in a survey',phonetic:'/rɪˈspɒndənt/',pos:'n.'},
  {en:'response',zh:'回答',def:'an answer or reply to something',phonetic:'/rɪˈspɒns/',pos:'n.'},
  {en:'result',zh:'结果',def:'what happens because of an action',phonetic:'/rɪˈzʌlt/',pos:'n.'},
  {en:'return',zh:'返回',def:'to go back to a place',phonetic:'/rɪˈtɜːn/',pos:'v.'},
  {en:'review',zh:'复习',def:'to study something again',phonetic:'/rɪˈvjuː/',pos:'v.'},
  {en:'reward',zh:'奖励',def:'something given for good work',phonetic:'/rɪˈwɔːd/',pos:'n.'},
  {en:'rocket',zh:'火箭',def:'a vehicle that travels into space',phonetic:'/ˈrɒkɪt/',pos:'n.'},
  {en:'safety',zh:'安全',def:'the state of being safe',phonetic:'/ˈseɪfti/',pos:'n.'},
  {en:'salary',zh:'工资',def:'money you earn from work',phonetic:'/ˈsæləri/',pos:'n.'},
  {en:'sample',zh:'样本',def:'a small part that shows what the whole is like',phonetic:'/ˈsɑːmpəl/',pos:'n.'},
  {en:'sandwich',zh:'三明治',def:'two pieces of bread with food between them',phonetic:'/ˈsænwɪdʒ/',pos:'n.'},
  {en:'scared',zh:'害怕的',def:'feeling afraid of something',phonetic:'/skeəd/',pos:'adj.'},
  {en:'science',zh:'科学',def:'the study of the natural world',phonetic:'/ˈsaɪəns/',pos:'n.'},
  {en:'search',zh:'搜索',def:'to look for something carefully',phonetic:'/sɜːtʃ/',pos:'v.'},
  {en:'season',zh:'季节',def:'one of the four parts of the year',phonetic:'/ˈsiːzən/',pos:'n.'},
  {en:'secret',zh:'秘密',def:'something kept hidden from others',phonetic:'/ˈsiːkrɪt/',pos:'n.'},
  {en:'sentence',zh:'句子',def:'a group of words that makes complete sense',phonetic:'/ˈsentəns/',pos:'n.'},
  {en:'serious',zh:'严肃的',def:'not joking or funny; very important',phonetic:'/ˈsɪəriəs/',pos:'adj.'},
  {en:'servant',zh:'仆人',def:'someone who works in another person\'s house',phonetic:'/ˈsɜːvənt/',pos:'n.'},
  {en:'several',zh:'几个',def:'more than a few but not many',phonetic:'/ˈsevərəl/',pos:'det.'},
  {en:'shadow',zh:'影子',def:'a dark shape made when light is blocked',phonetic:'/ˈʃædəʊ/',pos:'n.'},
  {en:'shoulder',zh:'肩膀',def:'the part of your body between neck and arm',phonetic:'/ˈʃəʊldər/',pos:'n.'},
  {en:'shower',zh:'淋浴',def:'a short period of rain or washing',phonetic:'/ˈʃaʊər/',pos:'n.'},
  {en:'signal',zh:'信号',def:'a sound or action that gives information',phonetic:'/ˈsɪɡnəl/',pos:'n.'},
  {en:'silence',zh:'安静',def:'the complete absence of sound',phonetic:'/ˈsaɪləns/',pos:'n.'},
  {en:'simple',zh:'简单的',def:'easy to understand or do',phonetic:'/ˈsɪmpəl/',pos:'adj.'},
  {en:'single',zh:'单个的',def:'only one',phonetic:'/ˈsɪŋɡəl/',pos:'adj.'},
  {en:'sister',zh:'姐妹',def:'a female sibling',phonetic:'/ˈsɪstər/',pos:'n.'},
  {en:'skeleton',zh:'骨骼',def:'the structure of bones in a body',phonetic:'/ˈskelɪtən/',pos:'n.'},
  {en:'smooth',zh:'光滑的',def:'completely flat with no rough parts',phonetic:'/smuːð/',pos:'adj.'},
  {en:'social',zh:'社会的',def:'relating to people living together',phonetic:'/ˈsəʊʃəl/',pos:'adj.'},
  {en:'society',zh:'社会',def:'people living together in a community',phonetic:'/səˈsaɪəti/',pos:'n.'},
  {en:'soldier',zh:'士兵',def:'a person who serves in an army',phonetic:'/ˈsəʊldʒər/',pos:'n.'},
  {en:'source',zh:'来源',def:'where something comes from',phonetic:'/sɔːs/',pos:'n.'},
  {en:'special',zh:'特别的',def:'not ordinary or usual',phonetic:'/ˈspeʃəl/',pos:'adj.'},
  {en:'spirit',zh:'精神',def:'the non-physical part of a person',phonetic:'/ˈspɪrɪt/',pos:'n.'},
  {en:'spread',zh:'传播',def:'to cover a larger area',phonetic:'/spred/',pos:'v.'},
  {en:'square',zh:'正方形',def:'a shape with four equal sides',phonetic:'/skweər/',pos:'n.'},
  {en:'stomach',zh:'胃',def:'the organ where food is digested',phonetic:'/ˈstʌmək/',pos:'n.'},
  {en:'strange',zh:'奇怪的',def:'unusual and surprising',phonetic:'/streɪndʒ/',pos:'adj.'},
  {en:'strength',zh:'力量',def:'the quality of being physically strong',phonetic:'/streŋθ/',pos:'n.'},
  {en:'student',zh:'学生',def:'someone who is learning at school',phonetic:'/ˈstjuːdənt/',pos:'n.'},
  {en:'subject',zh:'科目',def:'an area of knowledge you study',phonetic:'/ˈsʌbdʒɪkt/',pos:'n.'},
  {en:'succeed',zh:'成功',def:'to achieve what you wanted',phonetic:'/səkˈsiːd/',pos:'v.'},
  {en:'suffer',zh:'遭受',def:'to experience pain or difficulty',phonetic:'/ˈsʌfər/',pos:'v.'},
  {en:'suggest',zh:'建议',def:'to offer an idea for others to consider',phonetic:'/səˈdʒest/',pos:'v.'},
  {en:'sunshine',zh:'阳光',def:'the light from the sun',phonetic:'/ˈsʌnʃaɪn/',pos:'n.'},
  {en:'supply',zh:'供应',def:'to provide something needed',phonetic:'/səˈplaɪ/',pos:'v.'},
  {en:'support',zh:'支持',def:'to help or encourage someone',phonetic:'/səˈpɔːt/',pos:'v.'},
  {en:'suppose',zh:'假设',def:'to think that something is probably true',phonetic:'/səˈpəʊz/',pos:'v.'},
  {en:'surface',zh:'表面',def:'the outside part of something',phonetic:'/ˈsɜːfɪs/',pos:'n.'},
  {en:'surprise',zh:'惊喜',def:'something unexpected that makes you feel happy',phonetic:'/sərˈpraɪz/',pos:'n.'},
  {en:'surround',zh:'包围',def:'to be all around something',phonetic:'/səˈraʊnd/',pos:'v.'},
  {en:'survey',zh:'调查',def:'a set of questions to gather people\'s opinions',phonetic:'/ˈsɜːveɪ/',pos:'n.'},
  {en:'survive',zh:'生存',def:'to continue to live after danger',phonetic:'/sərˈvaɪv/',pos:'v.'},
  {en:'suspect',zh:'怀疑',def:'to think something might be true',phonetic:'/səˈspekt/',pos:'v.'},
  {en:'sweet',zh:'甜的',def:'tasting like sugar',phonetic:'/swiːt/',pos:'adj.'},
  {en:'symbol',zh:'符号',def:'a sign or shape that represents something',phonetic:'/ˈsɪmbəl/',pos:'n.'},
  {en:'system',zh:'系统',def:'a set of connected things working together',phonetic:'/ˈsɪstəm/',pos:'n.'},
  {en:'talent',zh:'天赋',def:'a natural ability to do something well',phonetic:'/ˈtælənt/',pos:'n.'},
  {en:'temperature',zh:'温度',def:'how hot or cold something is',phonetic:'/ˈtemprətʃər/',pos:'n.'},
  {en:'terrible',zh:'可怕的',def:'very bad or unpleasant',phonetic:'/ˈterɪbəl/',pos:'adj.'},
  {en:'therefore',zh:'因此',def:'for that reason',phonetic:'/ˈðeəfɔːr/',pos:'adv.'},
  {en:'thousand',zh:'一千',def:'the number 1000',phonetic:'/ˈθaʊzənd/',pos:'num.'},
  {en:'through',zh:'通过',def:'from one end to the other',phonetic:'/θruː/',pos:'prep.'},
  {en:'thunder',zh:'雷声',def:'the loud noise during a storm',phonetic:'/ˈθʌndər/',pos:'n.'},
  {en:'ticket',zh:'票',def:'a piece of paper that allows you to enter',phonetic:'/ˈtɪkɪt/',pos:'n.'},
  {en:'tobacco',zh:'烟草',def:'the plant used to make cigarettes',phonetic:'/təˈbækəʊ/',pos:'n.'},
  {en:'tomorrow',zh:'明天',def:'the day after today',phonetic:'/təˈmɒrəʊ/',pos:'adv.'},
  {en:'tongue',zh:'舌头',def:'the soft part inside your mouth',phonetic:'/tʌŋ/',pos:'n.'},
  {en:'tonight',zh:'今晚',def:'the evening or night of today',phonetic:'/təˈnaɪt/',pos:'adv.'},
  {en:'tortoise',zh:'乌龟',def:'a slow-moving animal with a hard shell',phonetic:'/ˈtɔːtəs/',pos:'n.'},
  {en:'toward',zh:'朝',def:'in the direction of something',phonetic:'/təˈwɔːd/',pos:'prep.'},
  {en:'traffic',zh:'交通',def:'the vehicles moving on roads',phonetic:'/ˈtræfɪk/',pos:'n.'},
  {en:'train',zh:'训练',def:'to teach or practice a skill; a railway vehicle',phonetic:'/treɪn/',pos:'v.'},
  {en:'trainer',zh:'教练',def:'a person who teaches skills to people or animals',phonetic:'/ˈtreɪnər/',pos:'n.'},
  {en:'treasure',zh:'宝藏',def:'a collection of valuable things',phonetic:'/ˈtreʒər/',pos:'n.'},
  {en:'trouble',zh:'麻烦',def:'problems or difficulties',phonetic:'/ˈtrʌbəl/',pos:'n.'},
  {en:'trust',zh:'信任',def:'to believe that someone is honest',phonetic:'/trʌst/',pos:'v.'},
  {en:'umbrella',zh:'雨伞',def:'something you hold to keep rain off',phonetic:'/ʌmˈbrelə/',pos:'n.'},
  {en:'uncle',zh:'叔叔',def:'the brother of your mother or father',phonetic:'/ˈʌŋkəl/',pos:'n.'},
  {en:'uniform',zh:'制服',def:'special clothes worn by a group',phonetic:'/ˈjuːnɪfɔːm/',pos:'n.'},
  {en:'universe',zh:'宇宙',def:'everything that exists in space',phonetic:'/ˈjuːnɪvɜːs/',pos:'n.'},
  {en:'unknown',zh:'未知的',def:'not known or familiar',phonetic:'/ʌnˈnəʊn/',pos:'adj.'},
  {en:'vaccine',zh:'疫苗',def:'a medicine that prevents disease',phonetic:'/ˈvæksiːn/',pos:'n.'},
  {en:'valley',zh:'山谷',def:'low land between hills or mountains',phonetic:'/ˈvæli/',pos:'n.'},
  {en:'valuable',zh:'有价值的',def:'worth a lot of money or very useful',phonetic:'/ˈvæljuəbəl/',pos:'adj.'},
  {en:'victory',zh:'胜利',def:'winning a fight or competition',phonetic:'/ˈvɪktəri/',pos:'n.'},
  {en:'village',zh:'村庄',def:'a small town in the countryside',phonetic:'/ˈvɪlɪdʒ/',pos:'n.'},
  {en:'violence',zh:'暴力',def:'behavior that hurts people',phonetic:'/ˈvaɪələns/',pos:'n.'},
  {en:'visible',zh:'可见的',def:'able to be seen',phonetic:'/ˈvɪzɪbəl/',pos:'adj.'},
  {en:'visitor',zh:'访客',def:'someone who visits a place',phonetic:'/ˈvɪzɪtər/',pos:'n.'},
  {en:'voice',zh:'声音',def:'the sound you make when speaking',phonetic:'/vɔɪs/',pos:'n.'},
  {en:'voyage',zh:'航行',def:'a long journey by sea or in space',phonetic:'/ˈvɔɪɪdʒ/',pos:'n.'},
  {en:'wander',zh:'漫步',def:'to walk slowly without a clear purpose',phonetic:'/ˈwɒndər/',pos:'v.'},
  {en:'warmth',zh:'温暖',def:'a comfortable amount of heat',phonetic:'/wɔːmθ/',pos:'n.'},
  {en:'wealth',zh:'财富',def:'a large amount of money or possessions',phonetic:'/welθ/',pos:'n.'},
  {en:'weapon',zh:'武器',def:'an object used to attack or defend',phonetic:'/ˈwepən/',pos:'n.'},
  {en:'weather',zh:'天气',def:'the condition of the air outside',phonetic:'/ˈweðər/',pos:'n.'},
  {en:'wedding',zh:'婚礼',def:'a ceremony where two people get married',phonetic:'/ˈwedɪŋ/',pos:'n.'},
  {en:'weight',zh:'重量',def:'how heavy something is',phonetic:'/weɪt/',pos:'n.'},
  {en:'welcome',zh:'欢迎',def:'a friendly greeting to someone arriving',phonetic:'/ˈwelkəm/',pos:'v.'},
  {en:'western',zh:'西方的',def:'from the west part of the world',phonetic:'/ˈwestən/',pos:'adj.'},
  {en:'whether',zh:'是否',def:'used to introduce choices',phonetic:'/ˈweðər/',pos:'conj.'},
  {en:'whisper',zh:'低语',def:'to speak very quietly',phonetic:'/ˈwɪspər/',pos:'v.'},
  {en:'willing',zh:'愿意的',def:'ready to do something',phonetic:'/ˈwɪlɪŋ/',pos:'adj.'},
  {en:'wisdom',zh:'智慧',def:'the ability to make good decisions',phonetic:'/ˈwɪzdəm/',pos:'n.'},
  {en:'witness',zh:'目击者',def:'someone who sees an event happen',phonetic:'/ˈwɪtnɪs/',pos:'n.'},
  {en:'wonder',zh:'好奇',def:'to want to know about something',phonetic:'/ˈwʌndər/',pos:'v.'},
  {en:'worried',zh:'担心的',def:'feeling anxious about problems',phonetic:'/ˈwʌrid/',pos:'adj.'},
  {en:'worship',zh:'崇拜',def:'to show great respect and love',phonetic:'/ˈwɜːʃɪp/',pos:'v.'},
  {en:'worthy',zh:'值得的',def:'deserving respect or attention',phonetic:'/ˈwɜːði/',pos:'adj.'},
  {en:'wound',zh:'伤口',def:'an injury to the body',phonetic:'/wuːnd/',pos:'n.'},
  {en:'wrinkle',zh:'皱纹',def:'a line on your skin as you get older',phonetic:'/ˈrɪŋkəl/',pos:'n.'},
  {en:'youth',zh:'青春',def:'the period of being young',phonetic:'/juːθ/',pos:'n.'},
  {en:'cry',zh:'哭',def:'to produce tears from your eyes',phonetic:'/kraɪ/',pos:'v.'},
  {en:'drive',zh:'驾驶',def:'to control and guide a vehicle',phonetic:'/draɪv/',pos:'v.'},
  {en:'hope',zh:'希望',def:'to want something to happen or be true',phonetic:'/həʊp/',pos:'v.'},
  {en:'laugh',zh:'笑',def:'to make sounds showing you are happy',phonetic:'/lɑːf/',pos:'v.'},
  {en:'nice',zh:'好的',def:'pleasant, kind, or good',phonetic:'/naɪs/',pos:'adj.'},
  {en:'o\'clock',zh:'点钟',def:'used after numbers to say what time it is',phonetic:'/əˈklɒk/',pos:'adv.'},
  {en:'smile',zh:'微笑',def:'to make a happy expression with your mouth',phonetic:'/smaɪl/',pos:'v.'},
  {en:'strong',zh:'强壮的',def:'having great physical power',phonetic:'/strɒŋ/',pos:'adj.'},
  {en:'young',zh:'年轻的',def:'in the early part of life',phonetic:'/jʌŋ/',pos:'adj.'},
  {en:'big',zh:'大的',def:'large in size or amount',phonetic:'/bɪɡ/',pos:'adj.'},
  {en:'boy',zh:'男孩',def:'a male child',phonetic:'/bɔɪ/',pos:'n.'},
  {en:'child',zh:'孩子',def:'a young person who is not yet an adult',phonetic:'/tʃaɪld/',pos:'n.'},
  {en:'have',zh:'有',def:'to own or possess something',phonetic:'/hæv/',pos:'v.'},
  {en:'loud',zh:'大声的',def:'making a lot of sound or noise',phonetic:'/laʊd/',pos:'adj.'},
  {en:'story',zh:'故事',def:'a description of events that are not real',phonetic:'/ˈstɔːri/',pos:'n.'},
  {en:'swim',zh:'游泳',def:'to move through water using your body',phonetic:'/swɪm/',pos:'v.'},
  {en:'today',zh:'今天',def:'this present day',phonetic:'/təˈdeɪ/',pos:'adv.'},
  {en:'watch',zh:'观看',def:'to look at something for a period of time',phonetic:'/wɒtʃ/',pos:'v.'},
  {en:'worry',zh:'担心',def:'to feel anxious about something',phonetic:'/ˈwʌri/',pos:'v.'},
  {en:'able',zh:'能够',def:'having the skill or power to do something',phonetic:'/ˈeɪbl/',pos:'adj.'},
  {en:'call',zh:'打电话',def:'to use a phone to speak to someone',phonetic:'/kɔːl/',pos:'v.'},
  {en:'catch',zh:'抓住',def:'to stop and hold something that is moving',phonetic:'/kætʃ/',pos:'v.'},
  {en:'monkey',zh:'猴子',def:'a small animal with a long tail that lives in trees',phonetic:'/ˈmʌŋki/',pos:'n.'},
  {en:'thin',zh:'薄的',def:'having a small distance between opposite sides',phonetic:'/θɪn/',pos:'adj.'},
  {en:'word',zh:'单词',def:'a single unit of language that has meaning',phonetic:'/wɜːd/',pos:'n.'},
  {en:'baby',zh:'婴儿',def:'a very young child',phonetic:'/ˈbeɪbi/',pos:'n.'},
  {en:'clean',zh:'清理',def:'to remove dirt from something',phonetic:'/kliːn/',pos:'v.'},
  {en:'eat',zh:'吃',def:'to take food into your mouth and swallow it',phonetic:'/iːt/',pos:'v.'},
  {en:'family',zh:'家庭',def:'a group of people who are related to each other',phonetic:'/ˈfæməli/',pos:'n.'},
  {en:'fruit',zh:'水果',def:'the part of a plant that has seeds and can be eaten',phonetic:'/fruːt/',pos:'n.'},
  {en:'jump',zh:'跳',def:'to push yourself into the air using your legs',phonetic:'/dʒʌmp/',pos:'v.'},
  {en:'kind',zh:'善良的',def:'caring about others and wanting to help them',phonetic:'/kaɪnd/',pos:'adj.'},
  {en:'man',zh:'男人',def:'an adult male human',phonetic:'/mæn/',pos:'n.'},
  {en:'address',zh:'地址',def:'the place where someone lives or works',phonetic:'/əˈdres/',pos:'n.'},
  {en:'afternoon',zh:'下午',def:'the time between midday and evening',phonetic:'/ˌɑːftəˈnuːn/',pos:'n.'},
  {en:'come',zh:'来',def:'to move toward the speaker or a place',phonetic:'/kʌm/',pos:'v.'},
  {en:'home',zh:'家',def:'the place where you live',phonetic:'/həʊm/',pos:'n.'},
  {en:'letter',zh:'信',def:'a written message sent to someone',phonetic:'/ˈletər/',pos:'n.'},
  {en:'lunch',zh:'午餐',def:'the meal eaten in the middle of the day',phonetic:'/lʌntʃ/',pos:'n.'},
  {en:'make',zh:'做',def:'to produce or create something',phonetic:'/meɪk/',pos:'v.'},
  {en:'need',zh:'需要',def:'to want something because it is necessary',phonetic:'/niːd/',pos:'v.'},
  {en:'people',zh:'人们',def:'human beings in general',phonetic:'/ˈpiːpl/',pos:'n.'},
  {en:'start',zh:'开始',def:'to begin doing something',phonetic:'/stɑːt/',pos:'v.'},
  {en:'cook',zh:'烹饪',def:'to prepare food by heating it',phonetic:'/kʊk/',pos:'v.'},
  {en:'day',zh:'天',def:'a period of 24 hours',phonetic:'/deɪ/',pos:'n.'},
  {en:'drink',zh:'喝',def:'to take liquid into your mouth',phonetic:'/drɪŋk/',pos:'v.'},
  {en:'front',zh:'前面',def:'the part that faces forward',phonetic:'/frʌnt/',pos:'n.'},
  {en:'great',zh:'伟大的',def:'very good or excellent',phonetic:'/ɡreɪt/',pos:'adj.'},
  {en:'play',zh:'玩',def:'to take part in an activity for enjoyment',phonetic:'/pleɪ/',pos:'v.'},
  {en:'see',zh:'看见',def:'to notice with your eyes',phonetic:'/siː/',pos:'v.'},
  {en:'send',zh:'发送',def:'to cause something to go to a place',phonetic:'/send/',pos:'v.'},
  {en:'small',zh:'小的',def:'little in size or amount',phonetic:'/smɔːl/',pos:'adj.'},
  {en:'time',zh:'时间',def:'the measured period during which events happen',phonetic:'/taɪm/',pos:'n.'},
  {en:'again',zh:'再次',def:'one more time',phonetic:'/əˈɡen/',pos:'adv.'},
  {en:'bad',zh:'坏的',def:'not good or pleasant',phonetic:'/bæd/',pos:'adj.'},
  {en:'buy',zh:'买',def:'to get something by paying money for it',phonetic:'/baɪ/',pos:'v.'},
  {en:'end',zh:'结束',def:'the final part of something',phonetic:'/end/',pos:'n.'},
  {en:'find',zh:'找到',def:'to discover something you were looking for',phonetic:'/faɪnd/',pos:'v.'},
  {en:'friend',zh:'朋友',def:'someone you like and enjoy being with',phonetic:'/frend/',pos:'n.'},
  {en:'say',zh:'说',def:'to speak words',phonetic:'/seɪ/',pos:'v.'},
  {en:'speak',zh:'讲话',def:'to talk using words',phonetic:'/spiːk/',pos:'v.'},
  {en:'true',zh:'真的',def:'based on facts, not false',phonetic:'/truː/',pos:'adj.'},
  {en:'learn',zh:'学习',def:'to gain knowledge or a skill',phonetic:'/lɜːn/',pos:'v.'},
  {en:'like',zh:'喜欢',def:'to enjoy something or think it is good',phonetic:'/laɪk/',pos:'v.'},
  {en:'long',zh:'长的',def:'having a large distance from end to end',phonetic:'/lɒŋ/',pos:'adj.'},
  {en:'minute',zh:'分钟',def:'a period of 60 seconds',phonetic:'/ˈmɪnɪt/',pos:'n.'},
  {en:'sing',zh:'唱歌',def:'to make musical sounds with your voice',phonetic:'/sɪŋ/',pos:'v.'},
  {en:'sit',zh:'坐',def:'to be in a position with your body resting',phonetic:'/sɪt/',pos:'v.'},
  {en:'star',zh:'星星',def:'a bright point of light in the night sky',phonetic:'/stɑːr/',pos:'n.'},
  {en:'think',zh:'想',def:'to use your mind to form ideas or opinions',phonetic:'/θɪŋk/',pos:'v.'},
  {en:'town',zh:'城镇',def:'a place with many buildings where people live',phonetic:'/taʊn/',pos:'n.'},
  {en:'breakfast',zh:'早餐',def:'the first meal of the day',phonetic:'/ˈbrekfəst/',pos:'n.'},
  {en:'carry',zh:'携带',def:'to hold something and take it to another place',phonetic:'/ˈkæri/',pos:'v.'},
  {en:'cheap',zh:'便宜的',def:'not costing a lot of money',phonetic:'/tʃiːp/',pos:'adj.'},
  {en:'count',zh:'数数',def:'to say numbers in order',phonetic:'/kaʊnt/',pos:'v.'},
  {en:'cut',zh:'切',def:'to divide with a sharp tool',phonetic:'/kʌt/',pos:'v.'},
  {en:'early',zh:'早的',def:'near the beginning of a period of time',phonetic:'/ˈɜːli/',pos:'adj.'},
  {en:'food',zh:'食物',def:'things that people eat',phonetic:'/fuːd/',pos:'n.'},
  {en:'vegetable',zh:'蔬菜',def:'a plant or part of a plant used as food',phonetic:'/ˈvedʒtəbl/',pos:'n.'},
  {en:'heavy',zh:'重的',def:'weighing a lot',phonetic:'/ˈhevi/',pos:'adj.'},
  {en:'meat',zh:'肉',def:'animal flesh used as food',phonetic:'/miːt/',pos:'n.'},
  {en:'money',zh:'钱',def:'coins and bills used to pay for things',phonetic:'/ˈmʌni/',pos:'n.'},
  {en:'put',zh:'放',def:'to move something to a particular place',phonetic:'/pʊt/',pos:'v.'},
  {en:'station',zh:'车站',def:'a place where trains or buses stop',phonetic:'/ˈsteɪʃn/',pos:'n.'},
  {en:'visit',zh:'参观',def:'to go and see a person or place',phonetic:'/ˈvɪzɪt/',pos:'v.'},
  {en:'yesterday',zh:'昨天',def:'the day before today',phonetic:'/ˈjestədeɪ/',pos:'n.'},
  {en:'cold',zh:'冷的',def:'having a low temperature',phonetic:'/kəʊld/',pos:'adj.'},
  {en:'dark',zh:'黑暗的',def:'with little or no light',phonetic:'/dɑːk/',pos:'adj.'},
  {en:'dish',zh:'盘子',def:'a flat container for serving food',phonetic:'/dɪʃ/',pos:'n.'},
  {en:'evening',zh:'傍晚',def:'the period of time at the end of the day',phonetic:'/ˈiːvnɪŋ/',pos:'n.'},
  {en:'sick',zh:'生病的',def:'not well or healthy',phonetic:'/sɪk/',pos:'adj.'},
  {en:'snowy',zh:'下雪的',def:'covered with or full of snow',phonetic:'/ˈsnəʊi/',pos:'adj.'},
  {en:'sugar',zh:'糖',def:'a sweet substance used in food and drinks',phonetic:'/ˈʃʊɡər/',pos:'n.'},
  {en:'ten',zh:'十',def:'the number 10',phonetic:'/ten/',pos:'num.'},
  {en:'world',zh:'世界',def:'the earth and all the people on it',phonetic:'/wɜːld/',pos:'n.'},
  {en:'hard',zh:'困难的',def:'difficult to do or understand',phonetic:'/hɑːd/',pos:'adj.'},
  {en:'late',zh:'迟的',def:'arriving after the expected time',phonetic:'/leɪt/',pos:'adj.'},
  {en:'life',zh:'生活',def:'the period of time when a person is alive',phonetic:'/laɪf/',pos:'n.'},
  {en:'look',zh:'看',def:'to direct your eyes towards something',phonetic:'/lʊk/',pos:'v.'},
  {en:'love',zh:'爱',def:'a very strong feeling of liking someone',phonetic:'/lʌv/',pos:'v.'},
  {en:'night',zh:'夜晚',def:'the time when it is dark outside',phonetic:'/naɪt/',pos:'n.'},
  {en:'same',zh:'相同的',def:'exactly like another one',phonetic:'/seɪm/',pos:'adj.'},
  {en:'sleep',zh:'睡觉',def:'to rest with your eyes closed',phonetic:'/sliːp/',pos:'v.'},
  {en:'water',zh:'水',def:'the clear liquid that living things need',phonetic:'/ˈwɔːtər/',pos:'n.'},
  {en:'weak',zh:'虚弱的',def:'not strong or powerful',phonetic:'/wiːk/',pos:'adj.'},
  {en:'fine',zh:'好的',def:'good enough or healthy',phonetic:'/faɪn/',pos:'adj.'},
  {en:'give',zh:'给',def:'to hand something to someone',phonetic:'/ɡɪv/',pos:'v.'},
  {en:'help',zh:'帮助',def:'to make it easier for someone to do something',phonetic:'/help/',pos:'v.'},
  {en:'hour',zh:'小时',def:'a period of 60 minutes',phonetic:'/ˈaʊər/',pos:'n.'},
  {en:'meet',zh:'遇见',def:'to come together with someone',phonetic:'/miːt/',pos:'v.'},
  {en:'page',zh:'页',def:'one side of a sheet of paper in a book',phonetic:'/peɪdʒ/',pos:'n.'},
  {en:'pay',zh:'付款',def:'to give money for goods or services',phonetic:'/peɪ/',pos:'v.'},
  {en:'rain',zh:'雨',def:'water that falls from clouds',phonetic:'/reɪn/',pos:'n.'},
  {en:'sell',zh:'卖',def:'to give something to someone for money',phonetic:'/sel/',pos:'v.'},
  {en:'tree',zh:'树',def:'a tall plant with a trunk and branches',phonetic:'/triː/',pos:'n.'},
  {en:'chair',zh:'椅子',def:'a seat with a back for one person',phonetic:'/tʃeər/',pos:'n.'},
  {en:'hear',zh:'听见',def:'to receive sounds with your ears',phonetic:'/hɪər/',pos:'v.'},
  {en:'park',zh:'公园',def:'a public area with grass and trees',phonetic:'/pɑːk/',pos:'n.'},
  {en:'poor',zh:'贫穷的',def:'having very little money',phonetic:'/pʊər/',pos:'adj.'},
  {en:'ready',zh:'准备好的',def:'prepared for something',phonetic:'/ˈredi/',pos:'adj.'},
  {en:'ride',zh:'骑',def:'to travel on a bicycle, horse, or vehicle',phonetic:'/raɪd/',pos:'v.'},
  {en:'table',zh:'桌子',def:'a piece of furniture with a flat top',phonetic:'/ˈteɪbl/',pos:'n.'},
  {en:'work',zh:'工作',def:'to do a job to earn money',phonetic:'/wɜːk/',pos:'v.'},
  {en:'write',zh:'写',def:'to put words on paper or a screen',phonetic:'/raɪt/',pos:'v.'},
  {en:'door',zh:'门',def:'a movable barrier at the entrance of a room',phonetic:'/dɔːr/',pos:'n.'},
  {en:'easy',zh:'容易的',def:'not difficult',phonetic:'/ˈiːzi/',pos:'adj.'},
  {en:'grow',zh:'生长',def:'to get bigger or develop',phonetic:'/ɡrəʊ/',pos:'v.'},
  {en:'hate',zh:'讨厌',def:'to strongly dislike something',phonetic:'/heɪt/',pos:'v.'},
  {en:'music',zh:'音乐',def:'sounds arranged in a way that is pleasant',phonetic:'/ˈmjuːzɪk/',pos:'n.'},
  {en:'ring',zh:'戒指',def:'to make a sound like a bell',phonetic:'/rɪŋ/',pos:'v.'},
  {en:'stop',zh:'停止',def:'to no longer continue',phonetic:'/stɒp/',pos:'v.'},
  {en:'study',zh:'学习',def:'to spend time learning about a subject',phonetic:'/ˈstʌdi/',pos:'v.'},
  {en:'nurse',zh:'护士',def:'someone trained to care for sick people',phonetic:'/nɜːs/',pos:'n.'},
  {en:'pretty',zh:'漂亮的',def:'nice to look at',phonetic:'/ˈprɪti/',pos:'adj.'},
  {en:'pull',zh:'拉',def:'to move something towards you',phonetic:'/pʊl/',pos:'v.'},
  {en:'sad',zh:'伤心的',def:'feeling unhappy',phonetic:'/sæd/',pos:'adj.'},
  {en:'try',zh:'尝试',def:'to attempt to do something',phonetic:'/traɪ/',pos:'v.'},
  {en:'want',zh:'想要',def:'to wish to have or do something',phonetic:'/wɒnt/',pos:'v.'},
  {en:'wrong',zh:'错误的',def:'not correct or right',phonetic:'/rɒŋ/',pos:'adj.'},
  {en:'high',zh:'高的',def:'a long way above the ground',phonetic:'/haɪ/',pos:'adj.'},
  {en:'keep',zh:'保持',def:'to continue to have something',phonetic:'/kiːp/',pos:'v.'},
  {en:'know',zh:'知道',def:'to have information in your mind',phonetic:'/nəʊ/',pos:'v.'},
  {en:'let',zh:'让',def:'to allow someone to do something',phonetic:'/let/',pos:'v.'},
  {en:'move',zh:'移动',def:'to change position or go to a different place',phonetic:'/muːv/',pos:'v.'},
  {en:'pass',zh:'通过',def:'to go past or move beyond something',phonetic:'/pɑːs/',pos:'v.'},
  {en:'point',zh:'点',def:'to show where something is with your finger',phonetic:'/pɔɪnt/',pos:'v.'},
  {en:'push',zh:'推',def:'to press against something to move it away',phonetic:'/pʊʃ/',pos:'v.'},
  {en:'quick',zh:'快的',def:'happening in a short time',phonetic:'/kwɪk/',pos:'adj.'},
  {en:'together',zh:'一起',def:'with each other',phonetic:'/təˈɡeðər/',pos:'adv.'},
  {en:'fall',zh:'落下',def:'to move down toward the ground',phonetic:'/fɔːl/',pos:'v.'},
  {en:'lady',zh:'女士',def:'a polite word for a woman',phonetic:'/ˈleɪdi/',pos:'n.'},
  {en:'rest',zh:'休息',def:'to stop activity to relax',phonetic:'/rest/',pos:'v.'},
  {en:'run',zh:'跑',def:'to move very fast on your feet',phonetic:'/rʌn/',pos:'v.'},
  {en:'short',zh:'短的',def:'not long in length or time',phonetic:'/ʃɔːt/',pos:'adj.'},
  {en:'sky',zh:'天空',def:'the space above the earth',phonetic:'/skaɪ/',pos:'n.'},
  {en:'stand',zh:'站',def:'to be on your feet in an upright position',phonetic:'/stænd/',pos:'v.'},
  {en:'tall',zh:'高的',def:'having a greater than average height',phonetic:'/tɔːl/',pos:'adj.'},
  {en:'wear',zh:'穿',def:'to have clothes on your body',phonetic:'/weər/',pos:'v.'},
  {en:'bottle',zh:'瓶子',def:'a container for liquids with a narrow top',phonetic:'/ˈbɒtl/',pos:'n.'},
  {en:'cool',zh:'凉爽的',def:'slightly cold in a pleasant way',phonetic:'/kuːl/',pos:'adj.'},
  {en:'cover',zh:'覆盖',def:'to put something over something else',phonetic:'/ˈkʌvər/',pos:'v.'},
  {en:'dry',zh:'干燥的',def:'not wet or having no water',phonetic:'/draɪ/',pos:'adj.'},
  {en:'egg',zh:'蛋',def:'an oval object from a bird that can be eaten',phonetic:'/eɡ/',pos:'n.'},
  {en:'expensive',zh:'昂贵的',def:'costing a lot of money',phonetic:'/ɪkˈspensɪv/',pos:'adj.'},
  {en:'fast',zh:'快的',def:'moving or happening quickly',phonetic:'/fɑːst/',pos:'adj.'},
  {en:'fish',zh:'鱼',def:'an animal that lives in water',phonetic:'/fɪʃ/',pos:'n.'},
  {en:'knife',zh:'刀',def:'a sharp tool used for cutting',phonetic:'/naɪf/',pos:'n.'},
  {en:'full',zh:'满的',def:'with no empty space left inside',phonetic:'/fʊl/',pos:'adj.'},
  {en:'hot',zh:'热的',def:'having a high temperature',phonetic:'/hɒt/',pos:'adj.'},
  {en:'ill',zh:'生病的',def:'not in good health',phonetic:'/ɪl/',pos:'adj.'},
  {en:'light',zh:'光',def:'the energy that makes things visible',phonetic:'/laɪt/',pos:'n.'},
  {en:'milk',zh:'牛奶',def:'the white liquid produced by cows',phonetic:'/mɪlk/',pos:'n.'},
  {en:'potato',zh:'土豆',def:'a round vegetable that grows underground',phonetic:'/pəˈteɪtəʊ/',pos:'n.'},
  {en:'warm',zh:'温暖的',def:'having a moderate heat',phonetic:'/wɔːm/',pos:'adj.'},
  {en:'wash',zh:'洗',def:'to clean with water',phonetic:'/wɒʃ/',pos:'v.'},
  {en:'air',zh:'空气',def:'the mixture of gases that surrounds the earth',phonetic:'/eər/',pos:'n.'},
  {en:'beautiful',zh:'美丽的',def:'very pleasing to look at',phonetic:'/ˈbjuːtɪfl/',pos:'adj.'},
  {en:'city',zh:'城市',def:'a large and important town',phonetic:'/ˈsɪti/',pos:'n.'},
  {en:'east',zh:'东方',def:'the direction where the sun rises',phonetic:'/iːst/',pos:'n.'},
  {en:'far',zh:'远的',def:'at a large distance away',phonetic:'/fɑːr/',pos:'adj.'},
  {en:'fly',zh:'飞',def:'to move through the air',phonetic:'/flaɪ/',pos:'v.'},
  {en:'half',zh:'一半',def:'one of two equal parts',phonetic:'/hɑːf/',pos:'n.'},
  {en:'left',zh:'左边',def:'the side that is toward the west',phonetic:'/left/',pos:'adj.'},
  {en:'little',zh:'小的',def:'small in size or amount',phonetic:'/ˈlɪtl/',pos:'adj.'},
  {en:'map',zh:'地图',def:'a drawing of an area showing its features',phonetic:'/mæp/',pos:'n.'},
  {en:'new',zh:'新的',def:'recently made or not existing before',phonetic:'/njuː/',pos:'adj.'},
  {en:'open',zh:'打开',def:'to move something so it is not closed',phonetic:'/ˈəʊpən/',pos:'v.'},
  {en:'road',zh:'路',def:'a hard surface for vehicles to travel on',phonetic:'/rəʊd/',pos:'n.'},
  {en:'shoe',zh:'鞋',def:'something you wear on your foot',phonetic:'/ʃuː/',pos:'n.'},
  {en:'shop',zh:'商店',def:'a place where you can buy things',phonetic:'/ʃɒp/',pos:'n.'},
  {en:'show',zh:'展示',def:'to let someone see something',phonetic:'/ʃəʊ/',pos:'v.'},
  {en:'side',zh:'侧面',def:'one of the surfaces of an object',phonetic:'/saɪd/',pos:'n.'},
  {en:'use',zh:'使用',def:'to do something with an object or tool',phonetic:'/juːz/',pos:'v.'},
  {en:'wait',zh:'等待',def:'to stay in one place until something happens',phonetic:'/weɪt/',pos:'v.'},
  {en:'ask',zh:'问',def:'to say something to get an answer',phonetic:'/ɑːsk/',pos:'v.'},
  {en:'pencil',zh:'铅笔',def:'a tool for writing or drawing with graphite',phonetic:'/ˈpensl/',pos:'n.'},
  {en:'question',zh:'问题',def:'something you say to get information',phonetic:'/ˈkwestʃən/',pos:'n.'},
  {en:'right',zh:'正确的',def:'correct or true',phonetic:'/raɪt/',pos:'adj.'},
  {en:'teach',zh:'教',def:'to give someone knowledge or skills',phonetic:'/tiːtʃ/',pos:'v.'},
  {en:'act',zh:'行动',def:'to do something or behave in a certain way',phonetic:'/ækt/',pos:'v.'},
  {en:'desk',zh:'书桌',def:'a table for writing or working at',phonetic:'/desk/',pos:'n.'},
  {en:'seat',zh:'座位',def:'a place to sit',phonetic:'/siːt/',pos:'n.'},
  {en:'stairs',zh:'楼梯',def:'steps that go from one floor to another',phonetic:'/steəz/',pos:'n.'},
  {en:'stay',zh:'停留',def:'to remain in a place',phonetic:'/steɪ/',pos:'v.'},
  {en:'talk',zh:'说话',def:'to speak to someone',phonetic:'/tɔːk/',pos:'v.'},
  {en:'understand',zh:'理解',def:'to know what something means',phonetic:'/ˌʌndəˈstænd/',pos:'v.'},
  {en:'walk',zh:'走',def:'to move on your feet at a normal speed',phonetic:'/wɔːk/',pos:'v.'},
  {en:'way',zh:'方式',def:'a method or manner of doing something',phonetic:'/weɪ/',pos:'n.'},
  {en:'oclock',zh:'...点钟',def:'used to say what time it is exactly',phonetic:'/əˈklɒk/',pos:'adv.'},
  {en:'list',zh:'列表',def:'a series of items written one below the other',phonetic:'/lɪst/',pos:'n.'},
  {en:'tea',zh:'茶',def:'a hot drink made by pouring boiling water onto dried leaves',phonetic:'/tiː/',pos:'n.'},
  {en:'year',zh:'年',def:'a period of 365 or 366 days',phonetic:'/jɪər/',pos:'n.'},
  {en:'age',zh:'年龄',def:'the number of years someone has lived',phonetic:'/eɪdʒ/',pos:'n.'},
  {en:'ago',zh:'以前',def:'before the present time',phonetic:'/əˈɡoʊ/',pos:'adv.'},
  {en:'agree',zh:'同意',def:'to have the same opinion as someone',phonetic:'/əˈɡriː/',pos:'v.'},
  {en:'art',zh:'艺术',def:'the making or study of painting, music, etc.',phonetic:'/ɑːrt/',pos:'n.'},
  {en:'back',zh:'后面',def:'the part of something that is farthest from the front',phonetic:'/bæk/',pos:'n.'},
  {en:'bag',zh:'袋子',def:'a container made of paper or thin plastic',phonetic:'/bæɡ/',pos:'n.'},
  {en:'ball',zh:'球',def:'a round object used in games and sports',phonetic:'/bɔːl/',pos:'n.'},
  {en:'balloon',zh:'气球',def:'a small rubber bag that you fill with air',phonetic:'/bəˈluːn/',pos:'n.'},
  {en:'baseball',zh:'棒球',def:'a game played with a bat and ball by two teams',phonetic:'/ˈbeɪsbɔːl/',pos:'n.'},
  {en:'basket',zh:'篮子',def:'a container for carrying things, made of thin pieces of wood or plastic',phonetic:'/ˈbæskɪt/',pos:'n.'},
  {en:'basketball',zh:'篮球',def:'a game where two teams try to throw a ball through a high net ring',phonetic:'/ˈbæskɪtbɔːl/',pos:'n.'},
  {en:'bath',zh:'洗澡',def:'an act of washing your body in a tub of water',phonetic:'/bæθ/',pos:'n.'},
  {en:'beach',zh:'海滩',def:'an area of sand or stones beside the sea',phonetic:'/biːtʃ/',pos:'n.'},
  {en:'bed',zh:'床',def:'a piece of furniture for sleeping on',phonetic:'/bed/',pos:'n.'},
  {en:'beef',zh:'牛肉',def:'the meat from a cow',phonetic:'/biːf/',pos:'n.'},
  {en:'best',zh:'最好的',def:'of the highest quality',phonetic:'/best/',pos:'adj.'},
  {en:'birth',zh:'出生',def:'the time when a baby comes out of its mother\'s body',phonetic:'/bɜːrθ/',pos:'n.'},
  {en:'boat',zh:'船',def:'a vehicle that travels on water',phonetic:'/boʊt/',pos:'n.'},
  {en:'book',zh:'书',def:'a set of printed pages with a cover',phonetic:'/bʊk/',pos:'n.'},
  {en:'boot',zh:'靴子',def:'a shoe that covers the whole foot and part of the leg',phonetic:'/buːt/',pos:'n.'},
  {en:'boring',zh:'无聊的',def:'not interesting at all',phonetic:'/ˈbɔːrɪŋ/',pos:'adj.'},
  {en:'brush',zh:'刷子',def:'an object with short stiff hairs used for cleaning or painting',phonetic:'/brʌʃ/',pos:'n.'},
  {en:'busy',zh:'忙碌的',def:'having a lot of things to do',phonetic:'/ˈbɪzi/',pos:'adj.'},
  {en:'calendar',zh:'日历',def:'a list that shows the days, weeks, and months of a year',phonetic:'/ˈkælɪndər/',pos:'n.'},
  {en:'cap',zh:'帽子',def:'a soft flat hat with a peak at the front',phonetic:'/kæp/',pos:'n.'},
  {en:'car',zh:'汽车',def:'a road vehicle with four wheels and an engine',phonetic:'/kɑːr/',pos:'n.'},
  {en:'care',zh:'关心',def:'to think that something is important and feel interested in it',phonetic:'/keər/',pos:'v.'},
  {en:'class',zh:'班级',def:'a group of students who learn together',phonetic:'/klæs/',pos:'n.'},
  {en:'clear',zh:'清楚的',def:'easy to see, hear, or understand',phonetic:'/klɪər/',pos:'adj.'},
  {en:'close',zh:'关闭',def:'to move something so that it is not open',phonetic:'/kloʊz/',pos:'v.'},
  {en:'clothes',zh:'衣服',def:'things that you wear on your body',phonetic:'/kloʊðz/',pos:'n.'},
  {en:'cloudy',zh:'多云的',def:'full of clouds',phonetic:'/ˈklaʊdi/',pos:'adj.'},
  {en:'congratulate',zh:'祝贺',def:'to tell someone you are happy about their success',phonetic:'/kənˈɡrætʃuleɪt/',pos:'v.'},
  {en:'cost',zh:'花费',def:'the amount of money needed to buy something',phonetic:'/kɔːst/',pos:'n.'},
  {en:'dance',zh:'跳舞',def:'to move your body to music',phonetic:'/dæns/',pos:'v.'},
  {en:'dangerous',zh:'危险的',def:'likely to cause harm or injury',phonetic:'/ˈdeɪndʒərəs/',pos:'adj.'},
  {en:'date',zh:'日期',def:'a particular day of the month or year',phonetic:'/deɪt/',pos:'n.'},
  {en:'dear',zh:'亲爱的',def:'loved very much',phonetic:'/dɪər/',pos:'adj.'},
  {en:'deep',zh:'深的',def:'going far down from the top or surface',phonetic:'/diːp/',pos:'adj.'},
  {en:'die',zh:'死亡',def:'to stop living',phonetic:'/daɪ/',pos:'v.'},
  {en:'dirty',zh:'脏的',def:'not clean',phonetic:'/ˈdɜːrti/',pos:'adj.'},
  {en:'draw',zh:'画',def:'to make a picture with a pen or pencil',phonetic:'/drɔː/',pos:'v.'},
  {en:'drop',zh:'掉落',def:'to let something fall',phonetic:'/drɒp/',pos:'v.'},
  {en:'excited',zh:'兴奋的',def:'very happy and enthusiastic about something',phonetic:'/ɪkˈsaɪtɪd/',pos:'adj.'},
  {en:'fan',zh:'风扇',def:'a machine that moves air to make a room cooler',phonetic:'/fæn/',pos:'n.'},
  {en:'farm',zh:'农场',def:'an area of land used for growing food or keeping animals',phonetic:'/fɑːrm/',pos:'n.'},
  {en:'fat',zh:'胖的',def:'having too much flesh on the body',phonetic:'/fæt/',pos:'adj.'},
  {en:'favorite',zh:'最喜欢的',def:'liked more than others of the same kind',phonetic:'/ˈfeɪvərɪt/',pos:'adj.'},
  {en:'feed',zh:'喂养',def:'to give food to a person or animal',phonetic:'/fiːd/',pos:'v.'},
  {en:'feel',zh:'感觉',def:'to experience a particular emotion or physical feeling',phonetic:'/fiːl/',pos:'v.'},
  {en:'fill',zh:'装满',def:'to make a container full of something',phonetic:'/fɪl/',pos:'v.'},
  {en:'fix',zh:'修理',def:'to repair something that is broken',phonetic:'/fɪks/',pos:'v.'},
  {en:'flag',zh:'旗子',def:'a piece of cloth with a pattern that represents a country or group',phonetic:'/flæɡ/',pos:'n.'},
  {en:'floor',zh:'地板',def:'the flat surface that you walk on inside a building',phonetic:'/flɔːr/',pos:'n.'},
  {en:'foolish',zh:'愚蠢的',def:'not sensible or wise',phonetic:'/ˈfuːlɪʃ/',pos:'adj.'},
  {en:'free',zh:'自由的',def:'not costing any money',phonetic:'/friː/',pos:'adj.'},
  {en:'fresh',zh:'新鲜的',def:'recently made, picked, or prepared',phonetic:'/freʃ/',pos:'adj.'},
  {en:'frog',zh:'青蛙',def:'a small animal with smooth skin that lives in water and on land',phonetic:'/frɒɡ/',pos:'n.'},
  {en:'gate',zh:'大门',def:'a door in a fence or wall outside a building',phonetic:'/ɡeɪt/',pos:'n.'},
  {en:'gentleman',zh:'绅士',def:'a polite man',phonetic:'/ˈdʒentlmən/',pos:'n.'},
  {en:'girl',zh:'女孩',def:'a female child',phonetic:'/ɡɜːrl/',pos:'n.'},
  {en:'glass',zh:'玻璃杯',def:'a transparent container used for drinking',phonetic:'/ɡlæs/',pos:'n.'},
  {en:'glove',zh:'手套',def:'a piece of clothing that covers your hand and fingers',phonetic:'/ɡlʌv/',pos:'n.'},
  {en:'glue',zh:'胶水',def:'a thick sticky liquid used to join things together',phonetic:'/ɡluː/',pos:'n.'},
  {en:'grand',zh:'宏伟的',def:'very large and impressive',phonetic:'/ɡrænd/',pos:'adj.'},
  {en:'grass',zh:'草',def:'a low green plant that grows in fields and gardens',phonetic:'/ɡræs/',pos:'n.'},
  {en:'group',zh:'组',def:'a number of people or things together in one place',phonetic:'/ɡruːp/',pos:'n.'},
  {en:'guess',zh:'猜测',def:'to give an answer without knowing if it is correct',phonetic:'/ɡes/',pos:'v.'},
  {en:'hat',zh:'帽子',def:'something you wear on your head',phonetic:'/hæt/',pos:'n.'},
  {en:'heart',zh:'心',def:'the organ in your chest that pumps blood',phonetic:'/hɑːrt/',pos:'n.'},
  {en:'hide',zh:'隐藏',def:'to put something where people cannot see it',phonetic:'/haɪd/',pos:'v.'},
  {en:'hill',zh:'小山',def:'a raised area of land, smaller than a mountain',phonetic:'/hɪl/',pos:'n.'},
  {en:'hit',zh:'击打',def:'to touch someone or something quickly and with force',phonetic:'/hɪt/',pos:'v.'},
  {en:'hobby',zh:'爱好',def:'an activity you enjoy doing in your free time',phonetic:'/ˈhɒbi/',pos:'n.'},
  {en:'hold',zh:'拿着',def:'to have something in your hand or arms',phonetic:'/hoʊld/',pos:'v.'},
  {en:'holiday',zh:'假期',def:'a day when you do not go to work or school',phonetic:'/ˈhɒlɪdeɪ/',pos:'n.'},
  {en:'hospital',zh:'医院',def:'a place where sick or injured people are treated',phonetic:'/ˈhɒspɪtl/',pos:'n.'},
  {en:'house',zh:'房子',def:'a building where a family lives',phonetic:'/haʊs/',pos:'n.'},
  {en:'hundred',zh:'一百',def:'the number 100',phonetic:'/ˈhʌndrəd/',pos:'num.'},
  {en:'hurry',zh:'赶快',def:'to move or do something more quickly than usual',phonetic:'/ˈhʌri/',pos:'v.'},
  {en:'hurt',zh:'受伤',def:'to feel pain in a part of your body',phonetic:'/hɜːrt/',pos:'v.'},
  {en:'husband',zh:'丈夫',def:'the man a woman is married to',phonetic:'/ˈhʌzbənd/',pos:'n.'},
  {en:'idea',zh:'主意',def:'a thought or plan about what to do',phonetic:'/aɪˈdɪə/',pos:'n.'},
  {en:'interested',zh:'感兴趣的',def:'wanting to know or learn more about something',phonetic:'/ˈɪntrəstɪd/',pos:'adj.'},
  {en:'job',zh:'工作',def:'work that you do to earn money',phonetic:'/dʒɒb/',pos:'n.'},
  {en:'join',zh:'加入',def:'to become a member of a group or organization',phonetic:'/dʒɔɪn/',pos:'v.'},
  {en:'kid',zh:'小孩',def:'a child',phonetic:'/kɪd/',pos:'n.'},
  {en:'king',zh:'国王',def:'the male ruler of a country',phonetic:'/kɪŋ/',pos:'n.'},
  {en:'lake',zh:'湖',def:'a large area of water with land all around it',phonetic:'/leɪk/',pos:'n.'},
  {en:'lamp',zh:'灯',def:'an electric light that stands on a table or floor',phonetic:'/læmp/',pos:'n.'},
  {en:'land',zh:'陆地',def:'the solid dry part of the Earth\'s surface',phonetic:'/lænd/',pos:'n.'},
  {en:'large',zh:'大的',def:'big in size or amount',phonetic:'/lɑːrdʒ/',pos:'adj.'},
  {en:'last',zh:'最后的',def:'coming after all others in time or order',phonetic:'/læst/',pos:'adj.'},
  {en:'library',zh:'图书馆',def:'a room or building with books you can borrow or read',phonetic:'/ˈlaɪbrəri/',pos:'n.'},
  {en:'line',zh:'线',def:'a long thin mark on a surface',phonetic:'/laɪn/',pos:'n.'},
  {en:'live',zh:'居住',def:'to have your home in a particular place',phonetic:'/lɪv/',pos:'v.'},
  {en:'lose',zh:'丢失',def:'to be unable to find something you had before',phonetic:'/luːz/',pos:'v.'},
  {en:'luck',zh:'运气',def:'good things that happen to you by chance',phonetic:'/lʌk/',pos:'n.'},
  {en:'lazy',zh:'懒惰的',def:'not willing to work or make an effort',phonetic:'/ˈleɪzi/',pos:'adj.'},
  {en:'emergency',zh:'紧急情况',def:'a serious situation that needs immediate action',phonetic:'/ɪˈmɜːrdʒənsi/',pos:'n.'},
  {en:'fight',zh:'打架',def:'to try to hurt or beat someone',phonetic:'/faɪt/',pos:'v.'},
  {en:'lay',zh:'放置',def:'to put something down in a flat position',phonetic:'/leɪ/',pos:'v.'},
  {en:'low',zh:'低的',def:'not high; close to the ground',phonetic:'/loʊ/',pos:'adj.'},
  {en:'math',zh:'数学',def:'the study of numbers and shapes',phonetic:'/mæθ/',pos:'n.'},
  {en:'matter',zh:'事情',def:'a subject or situation that you need to deal with',phonetic:'/ˈmætər/',pos:'n.'},
  {en:'mean',zh:'意思是',def:'to have a particular meaning',phonetic:'/miːn/',pos:'v.'},
  {en:'month',zh:'月',def:'one of the twelve periods that a year is divided into',phonetic:'/mʌnθ/',pos:'n.'},
  {en:'moon',zh:'月亮',def:'the round object that shines in the sky at night',phonetic:'/muːn/',pos:'n.'},
  {en:'motorbike',zh:'摩托车',def:'a vehicle with two wheels and an engine',phonetic:'/ˈmoʊtərbaɪk/',pos:'n.'},
  {en:'museum',zh:'博物馆',def:'a building where you can look at old and interesting objects',phonetic:'/mjuːˈziːəm/',pos:'n.'},
  {en:'name',zh:'名字',def:'the word that a person or thing is called',phonetic:'/neɪm/',pos:'n.'},
  {en:'noise',zh:'噪音',def:'a sound that is loud or unpleasant',phonetic:'/nɔɪz/',pos:'n.'},
  {en:'north',zh:'北方',def:'the direction on your left when facing the rising sun',phonetic:'/nɔːrθ/',pos:'n.'},
  {en:'paint',zh:'画',def:'a colored liquid you put on surfaces with a brush',phonetic:'/peɪnt/',pos:'n.'},
  {en:'pair',zh:'一双',def:'two things of the same type used together',phonetic:'/peər/',pos:'n.'},
  {en:'pants',zh:'裤子',def:'a piece of clothing that covers your legs',phonetic:'/pænts/',pos:'n.'},
  {en:'paper',zh:'纸',def:'thin material used for writing, drawing, or wrapping',phonetic:'/ˈpeɪpər/',pos:'n.'},
  {en:'past',zh:'过去',def:'the time before the present',phonetic:'/pæst/',pos:'n.'},
  {en:'pet',zh:'宠物',def:'an animal kept at home for pleasure',phonetic:'/pet/',pos:'n.'},
  {en:'phone',zh:'电话',def:'a device used to talk to someone far away',phonetic:'/foʊn/',pos:'n.'},
  {en:'photograph',zh:'照片',def:'a picture made with a camera',phonetic:'/ˈfoʊtəɡræf/',pos:'n.'},
  {en:'pick',zh:'选择',def:'to choose someone or something from a group',phonetic:'/pɪk/',pos:'v.'},
  {en:'piece',zh:'片',def:'a part of something that has been broken or cut',phonetic:'/piːs/',pos:'n.'},
  {en:'plan',zh:'计划',def:'an idea about what to do in the future',phonetic:'/plæn/',pos:'n.'},
  {en:'plant',zh:'植物',def:'a living thing that grows in soil and has leaves and roots',phonetic:'/plænt/',pos:'n.'},
  {en:'plate',zh:'盘子',def:'a flat round dish for eating food from',phonetic:'/pleɪt/',pos:'n.'},
  {en:'post',zh:'邮寄',def:'to send a letter or package by mail',phonetic:'/poʊst/',pos:'v.'},
  {en:'practice',zh:'练习',def:'to do something again and again to become better at it',phonetic:'/ˈpræktɪs/',pos:'v.'},
  {en:'puppy',zh:'小狗',def:'a young dog',phonetic:'/ˈpʌpi/',pos:'n.'},
  {en:'queen',zh:'女王',def:'the female ruler of a country',phonetic:'/kwiːn/',pos:'n.'},
  {en:'quiet',zh:'安静的',def:'making very little or no noise',phonetic:'/ˈkwaɪət/',pos:'adj.'},
  {en:'read',zh:'阅读',def:'to look at and understand written words',phonetic:'/riːd/',pos:'v.'},
  {en:'really',zh:'真正地',def:'very; used to emphasize what you are saying',phonetic:'/ˈrɪəli/',pos:'adv.'},
  {en:'relax',zh:'放松',def:'to rest and become less worried or tired',phonetic:'/rɪˈlæks/',pos:'v.'},
  {en:'remember',zh:'记住',def:'to keep a fact or event in your mind',phonetic:'/rɪˈmembər/',pos:'v.'},
  {en:'restaurant',zh:'餐厅',def:'a place where you buy and eat food',phonetic:'/ˈrestrɒnt/',pos:'n.'},
  {en:'rice',zh:'米饭',def:'small white or brown grains from a plant, used as food',phonetic:'/raɪs/',pos:'n.'},
  {en:'rich',zh:'富有的',def:'having a lot of money or valuable things',phonetic:'/rɪtʃ/',pos:'adj.'},
  {en:'river',zh:'河流',def:'a long natural flow of water across the land',phonetic:'/ˈrɪvər/',pos:'n.'},
  {en:'rock',zh:'岩石',def:'the hard solid material that forms part of the Earth\'s surface',phonetic:'/rɒk/',pos:'n.'},
  {en:'round',zh:'圆的',def:'shaped like a circle or a ball',phonetic:'/raʊnd/',pos:'adj.'},
  {en:'rule',zh:'规则',def:'an instruction that says what you must or must not do',phonetic:'/ruːl/',pos:'n.'},
  {en:'school',zh:'学校',def:'a place where children go to learn',phonetic:'/skuːl/',pos:'n.'},
  {en:'second',zh:'秒',def:'a unit for measuring time, equal to 1/60 of a minute',phonetic:'/ˈsekənd/',pos:'n.'},
  {en:'ship',zh:'船',def:'a large boat for carrying people or goods across water',phonetic:'/ʃɪp/',pos:'n.'},
  {en:'size',zh:'大小',def:'how big or small something is',phonetic:'/saɪz/',pos:'n.'},
  {en:'skirt',zh:'裙子',def:'a piece of clothing for women that hangs from the waist',phonetic:'/skɜːrt/',pos:'n.'},
  {en:'slow',zh:'慢的',def:'moving or doing something at a low speed',phonetic:'/sloʊ/',pos:'adj.'},
  {en:'smell',zh:'闻',def:'to notice the odor of something using your nose',phonetic:'/smel/',pos:'v.'},
  {en:'soap',zh:'肥皂',def:'a substance used with water for washing your body',phonetic:'/soʊp/',pos:'n.'},
  {en:'soft',zh:'软的',def:'not hard, firm, or stiff',phonetic:'/sɒft/',pos:'adj.'},
  {en:'sound',zh:'声音',def:'something that you hear',phonetic:'/saʊnd/',pos:'n.'},
  {en:'south',zh:'南方',def:'the direction on your right when facing the rising sun',phonetic:'/saʊθ/',pos:'n.'},
  {en:'speech',zh:'演讲',def:'a formal talk given to a group of people',phonetic:'/spiːtʃ/',pos:'n.'},
  {en:'spend',zh:'花费',def:'to use money or time',phonetic:'/spend/',pos:'v.'},
  {en:'spoon',zh:'勺子',def:'a tool with a round end used for eating soup or other food',phonetic:'/spuːn/',pos:'n.'},
  {en:'store',zh:'商店',def:'a place where you can buy things',phonetic:'/stɔːr/',pos:'n.'},
  {en:'street',zh:'街道',def:'a road in a city or town with buildings on each side',phonetic:'/striːt/',pos:'n.'},
  {en:'subway',zh:'地铁',def:'an underground railway in a city',phonetic:'/ˈsʌbweɪ/',pos:'n.'},
  {en:'sunny',zh:'晴朗的',def:'bright because of light from the sun',phonetic:'/ˈsʌni/',pos:'adj.'},
  {en:'take',zh:'拿',def:'to move something from one place to another',phonetic:'/teɪk/',pos:'v.'},
  {en:'tell',zh:'告诉',def:'to give information to someone by speaking or writing',phonetic:'/tel/',pos:'v.'},
  {en:'test',zh:'测试',def:'a set of questions to measure someone\'s knowledge or skill',phonetic:'/test/',pos:'n.'},
  {en:'thank',zh:'感谢',def:'to tell someone you are grateful for what they did',phonetic:'/θæŋk/',pos:'v.'},
  {en:'theater',zh:'剧院',def:'a building where people watch plays or movies',phonetic:'/ˈθɪətər/',pos:'n.'},
  {en:'thirsty',zh:'口渴的',def:'needing to drink something',phonetic:'/ˈθɜːrsti/',pos:'adj.'},
  {en:'throw',zh:'扔',def:'to send something through the air with your hand',phonetic:'/θroʊ/',pos:'v.'},
  {en:'tie',zh:'领带',def:'a long piece of cloth worn around the neck',phonetic:'/taɪ/',pos:'n.'},
  {en:'toilet',zh:'厕所',def:'a bowl-shaped device used for passing waste from the body',phonetic:'/ˈtɔɪlɪt/',pos:'n.'},
  {en:'top',zh:'顶部',def:'the highest part of something',phonetic:'/tɒp/',pos:'n.'},
  {en:'touch',zh:'触摸',def:'to put your hand or fingers on something',phonetic:'/tʌtʃ/',pos:'v.'},
  {en:'towel',zh:'毛巾',def:'a piece of cloth used for drying your body',phonetic:'/ˈtaʊəl/',pos:'n.'},
  {en:'toy',zh:'玩具',def:'an object for children to play with',phonetic:'/tɔɪ/',pos:'n.'},
  {en:'travel',zh:'旅行',def:'to go from one place to another',phonetic:'/ˈtrævl/',pos:'v.'},
  {en:'trip',zh:'旅行',def:'a journey in which you go to a place and come back',phonetic:'/trɪp/',pos:'n.'},
  {en:'turn',zh:'转',def:'to move around a central point',phonetic:'/tɜːrn/',pos:'v.'},
  {en:'ugly',zh:'丑陋的',def:'unpleasant to look at',phonetic:'/ˈʌɡli/',pos:'adj.'},
  {en:'unit',zh:'单元',def:'a single part of a book or course of study',phonetic:'/ˈjuːnɪt/',pos:'n.'},
  {en:'vacation',zh:'假期',def:'a period of time away from work or school for rest or travel',phonetic:'/veɪˈkeɪʃn/',pos:'n.'},
  {en:'wake',zh:'醒来',def:'to stop sleeping',phonetic:'/weɪk/',pos:'v.'},
  {en:'wall',zh:'墙',def:'a vertical structure that divides or surrounds an area',phonetic:'/wɔːl/',pos:'n.'},
  {en:'week',zh:'周',def:'a period of seven days',phonetic:'/wiːk/',pos:'n.'},
  {en:'weigh',zh:'称重',def:'to measure how heavy something is',phonetic:'/weɪ/',pos:'v.'},
  {en:'well',zh:'好地',def:'in a good or satisfactory way',phonetic:'/wel/',pos:'adv.'},
  {en:'west',zh:'西方',def:'the direction where the sun sets',phonetic:'/west/',pos:'n.'},
  {en:'wet',zh:'湿的',def:'covered with water or another liquid',phonetic:'/wet/',pos:'adj.'},
  {en:'wide',zh:'宽的',def:'measuring a large distance from side to side',phonetic:'/waɪd/',pos:'adj.'},
  {en:'wife',zh:'妻子',def:'the woman a man is married to',phonetic:'/waɪf/',pos:'n.'},
  {en:'win',zh:'赢',def:'to be the best or first in a competition or game',phonetic:'/wɪn/',pos:'v.'},
  {en:'window',zh:'窗户',def:'an opening in a wall with glass that lets in light',phonetic:'/ˈwɪndoʊ/',pos:'n.'},
  {en:'windy',zh:'有风的',def:'with a lot of wind blowing',phonetic:'/ˈwɪndi/',pos:'adj.'},
  {en:'wish',zh:'希望',def:'to want something that is not likely to happen',phonetic:'/wɪʃ/',pos:'v.'},
  {en:'woman',zh:'女人',def:'an adult female person',phonetic:'/ˈwʊmən/',pos:'n.'},
  {en:'wood',zh:'木头',def:'the hard material from a tree used for building or burning',phonetic:'/wʊd/',pos:'n.'},
  {en:'zoo',zh:'动物园',def:'a place where wild animals are kept for people to see',phonetic:'/zuː/',pos:'n.'},
  {en:'accident',zh:'事故',def:'an unexpected event that causes damage or injury',phonetic:'/ˈæksɪdənt/',pos:'n.'},
  {en:'actually',zh:'实际上',def:'in fact; used to emphasize the truth of something',phonetic:'/ˈæktʃuəli/',pos:'adv.'},
  {en:'add',zh:'增加',def:'to put something together with another thing',phonetic:'/æd/',pos:'v.'},
  {en:'airplane',zh:'飞机',def:'a vehicle that flies through the air with wings',phonetic:'/ˈeərpleɪn/',pos:'n.'},
  {en:'airport',zh:'机场',def:'a place where airplanes take off and land',phonetic:'/ˈeərpɔːrt/',pos:'n.'},
  {en:'area',zh:'地区',def:'a particular part of a place or country',phonetic:'/ˈeəriə/',pos:'n.'},
  {en:'attend',zh:'参加',def:'to go to an event or place',phonetic:'/əˈtend/',pos:'v.'},
  {en:'audience',zh:'观众',def:'the people watching or listening to a performance',phonetic:'/ˈɔːdiəns/',pos:'n.'},
  {en:'bake',zh:'烘烤',def:'to cook food in an oven without liquid',phonetic:'/beɪk/',pos:'v.'},
  {en:'bat',zh:'蝙蝠',def:'a small animal like a mouse with wings',phonetic:'/bæt/',pos:'n.'},
  {en:'bell',zh:'铃',def:'a metal object that makes a ringing sound when hit',phonetic:'/bel/',pos:'n.'},
  {en:'bill',zh:'账单',def:'a paper that shows how much money you owe for something',phonetic:'/bɪl/',pos:'n.'},
  {en:'blind',zh:'失明的',def:'unable to see',phonetic:'/blaɪnd/',pos:'adj.'},
  {en:'block',zh:'街区',def:'a group of buildings with streets on all sides',phonetic:'/blɒk/',pos:'n.'},
  {en:'blow',zh:'吹',def:'to send air out from your mouth',phonetic:'/bloʊ/',pos:'v.'},
  {en:'board',zh:'板',def:'a flat piece of wood or other material',phonetic:'/bɔːrd/',pos:'n.'},
  {en:'bowl',zh:'碗',def:'a deep round dish used for holding food or liquid',phonetic:'/boʊl/',pos:'n.'},
  {en:'brain',zh:'大脑',def:'the organ inside your head that controls thought and feeling',phonetic:'/breɪn/',pos:'n.'},
  {en:'burn',zh:'燃烧',def:'to damage or destroy something with fire',phonetic:'/bɜːrn/',pos:'v.'},
  {en:'button',zh:'按钮',def:'a small object you press to operate a machine',phonetic:'/ˈbʌtn/',pos:'n.'},
  {en:'camp',zh:'营地',def:'a place where people live in tents for a short time',phonetic:'/kæmp/',pos:'n.'},
  {en:'carrot',zh:'胡萝卜',def:'a long orange vegetable that grows under the ground',phonetic:'/ˈkærət/',pos:'n.'},
  {en:'case',zh:'情况',def:'a particular situation or example of something',phonetic:'/keɪs/',pos:'n.'},
  {en:'cause',zh:'原因',def:'the thing that makes something happen',phonetic:'/kɔːz/',pos:'n.'},
  {en:'century',zh:'世纪',def:'a period of 100 years',phonetic:'/ˈsentʃəri/',pos:'n.'},
  {en:'cheer',zh:'欢呼',def:'to shout to show support or happiness',phonetic:'/tʃɪər/',pos:'v.'},
  {en:'comfortable',zh:'舒适的',def:'making you feel relaxed and pleasant',phonetic:'/ˈkʌmftəbl/',pos:'adj.'},
  {en:'communicate',zh:'沟通',def:'to share information with others by speaking or writing',phonetic:'/kəˈmjuːnɪkeɪt/',pos:'v.'},
  {en:'community',zh:'社区',def:'a group of people living in the same area',phonetic:'/kəˈmjuːnəti/',pos:'n.'},
  {en:'confuse',zh:'使困惑',def:'to make someone unable to understand clearly',phonetic:'/kənˈfjuːz/',pos:'v.'},
  {en:'contest',zh:'比赛',def:'a competition to find the best person or team',phonetic:'/ˈkɒntest/',pos:'n.'},
  {en:'corn',zh:'玉米',def:'a tall plant with yellow seeds used as food',phonetic:'/kɔːrn/',pos:'n.'},
  {en:'cross',zh:'穿过',def:'to go from one side of something to the other',phonetic:'/krɒs/',pos:'v.'},
  {en:'culture',zh:'文化',def:'the way of life of a particular group of people',phonetic:'/ˈkʌltʃər/',pos:'n.'},
  {en:'custom',zh:'习俗',def:'a traditional way of behaving that is typical of a society',phonetic:'/ˈkʌstəm/',pos:'n.'},
  {en:'deliver',zh:'递送',def:'to take goods or letters to a place',phonetic:'/dɪˈlɪvər/',pos:'v.'},
  {en:'describe',zh:'描述',def:'to say what someone or something is like',phonetic:'/dɪˈskraɪb/',pos:'v.'},
  {en:'electricity',zh:'电',def:'a form of energy used to power lights, machines, etc.',phonetic:'/ɪˌlekˈtrɪsəti/',pos:'n.'},
  {en:'environment',zh:'环境',def:'the natural world around us',phonetic:'/ɪnˈvaɪrənmənt/',pos:'n.'},
  {en:'especially',zh:'特别地',def:'more than usual; in a special way',phonetic:'/ɪˈspeʃəli/',pos:'adv.'},
  {en:'exam',zh:'考试',def:'a formal test of your knowledge or ability',phonetic:'/ɪɡˈzæm/',pos:'n.'},
  {en:'exchange',zh:'交换',def:'to give something and receive something in return',phonetic:'/ɪksˈtʃeɪndʒ/',pos:'v.'},
  {en:'experience',zh:'经历',def:'something that happens to you that affects how you feel',phonetic:'/ɪkˈspɪəriəns/',pos:'n.'},
  {en:'experiment',zh:'实验',def:'a scientific test to find out what happens',phonetic:'/ɪkˈsperɪmənt/',pos:'n.'},
  {en:'fact',zh:'事实',def:'a piece of information that is known to be true',phonetic:'/fækt/',pos:'n.'},
  {en:'fair',zh:'公平的',def:'treating everyone equally',phonetic:'/feər/',pos:'adj.'},
  {en:'festival',zh:'节日',def:'a special event or party',phonetic:'/ˈfestɪvl/',pos:'n.'},
  {en:'field',zh:'田野',def:'an area of land used for growing crops or playing sports',phonetic:'/fiːld/',pos:'n.'},
  {en:'finally',zh:'最后',def:'at the end; after a long time',phonetic:'/ˈfaɪnəli/',pos:'adv.'},
  {en:'focus',zh:'集中',def:'to give all your attention to something',phonetic:'/ˈfoʊkəs/',pos:'v.'},
  {en:'fold',zh:'折叠',def:'to bend something so that one part covers another',phonetic:'/foʊld/',pos:'v.'},
  {en:'force',zh:'力量',def:'power or strength',phonetic:'/fɔːrs/',pos:'n.'},
  {en:'foreign',zh:'外国的',def:'from a country that is not your own',phonetic:'/ˈfɒrɪn/',pos:'adj.'},
  {en:'form',zh:'形式',def:'a type or shape of something',phonetic:'/fɔːrm/',pos:'n.'},
  {en:'fry',zh:'油炸',def:'to cook food in hot oil',phonetic:'/fraɪ/',pos:'v.'},
  {en:'gift',zh:'礼物',def:'something you give to someone on a special occasion',phonetic:'/ɡɪft/',pos:'n.'},
  {en:'goal',zh:'目标',def:'something you want to achieve in the future',phonetic:'/ɡoʊl/',pos:'n.'},
  {en:'goat',zh:'山羊',def:'an animal with horns kept for its milk and meat',phonetic:'/ɡoʊt/',pos:'n.'},
  {en:'grade',zh:'年级',def:'a level of study in school',phonetic:'/ɡreɪd/',pos:'n.'},
  {en:'hang',zh:'悬挂',def:'to attach something at the top so it hangs down',phonetic:'/hæŋ/',pos:'v.'},
  {en:'heat',zh:'热',def:'the quality of being hot; warmth',phonetic:'/hiːt/',pos:'n.'},
  {en:'history',zh:'历史',def:'the study of things that happened in the past',phonetic:'/ˈhɪstri/',pos:'n.'},
  {en:'hole',zh:'洞',def:'an empty space in the surface of something',phonetic:'/hoʊl/',pos:'n.'},
  {en:'human',zh:'人类',def:'a person; relating to people',phonetic:'/ˈhjuːmən/',pos:'n.'},
  {en:'hunt',zh:'狩猎',def:'to chase and kill wild animals for food or sport',phonetic:'/hʌnt/',pos:'v.'},
  {en:'ice',zh:'冰',def:'water that has frozen into a solid state',phonetic:'/aɪs/',pos:'n.'},
  {en:'important',zh:'重要的',def:'having great meaning or value',phonetic:'/ɪmˈpɔːrtnt/',pos:'adj.'},
  {en:'inform',zh:'通知',def:'to tell someone about something officially',phonetic:'/ɪnˈfɔːrm/',pos:'v.'},
  {en:'international',zh:'国际的',def:'involving two or more countries',phonetic:'/ˌɪntərˈnæʃnəl/',pos:'adj.'},
  {en:'interview',zh:'面试',def:'a meeting where someone asks you questions about yourself',phonetic:'/ˈɪntərvjuː/',pos:'n.'},
  {en:'introduce',zh:'介绍',def:'to tell someone\'s name when they meet for the first time',phonetic:'/ˌɪntrəˈdjuːs/',pos:'v.'},
  {en:'item',zh:'物品',def:'a single thing in a group or list',phonetic:'/ˈaɪtəm/',pos:'n.'},
  {en:'key',zh:'钥匙',def:'a piece of metal used for opening a lock',phonetic:'/kiː/',pos:'n.'},
  {en:'kick',zh:'踢',def:'to hit something with your foot',phonetic:'/kɪk/',pos:'v.'},
  {en:'kill',zh:'杀死',def:'to make a living thing die',phonetic:'/kɪl/',pos:'v.'},
  {en:'knock',zh:'敲',def:'to hit a surface with your hand to make a sound',phonetic:'/nɒk/',pos:'v.'},
  {en:'language',zh:'语言',def:'a system of words used by people to communicate',phonetic:'/ˈlæŋɡwɪdʒ/',pos:'n.'},
  {en:'leaf',zh:'叶子',def:'a flat green part of a plant or tree',phonetic:'/liːf/',pos:'n.'},
  {en:'leave',zh:'离开',def:'to go away from a place or person',phonetic:'/liːv/',pos:'v.'},
  {en:'level',zh:'水平',def:'how good or high something is in quality or amount',phonetic:'/ˈlevl/',pos:'n.'},
  {en:'lie',zh:'说谎',def:'to say something that is not true',phonetic:'/laɪ/',pos:'v.'},
  {en:'mad',zh:'生气',def:'angry about something',phonetic:'/mæd/',pos:'adj.'},
  {en:'mail',zh:'邮件',def:'letters and packages sent through the post',phonetic:'/meɪl/',pos:'n.'},
  {en:'main',zh:'主要的',def:'most important',phonetic:'/meɪn/',pos:'adj.'},
  {en:'march',zh:'三月',def:'the third month of the year',phonetic:'/mɑːrtʃ/',pos:'n.'},
  {en:'mark',zh:'标记',def:'a small area of something on a surface that looks different',phonetic:'/mɑːrk/',pos:'n.'},
  {en:'match',zh:'比赛',def:'a sports competition between two people or teams',phonetic:'/mætʃ/',pos:'n.'},
  {en:'meal',zh:'一餐',def:'an occasion when you eat food, or the food you eat',phonetic:'/miːl/',pos:'n.'},
  {en:'medicine',zh:'药',def:'a substance used for treating illness',phonetic:'/ˈmedɪsn/',pos:'n.'},
  {en:'mind',zh:'头脑',def:'the part of you that thinks, knows, and remembers',phonetic:'/maɪnd/',pos:'n.'},
  {en:'mix',zh:'混合',def:'to combine two or more things together',phonetic:'/mɪks/',pos:'v.'},
  {en:'newspaper',zh:'报纸',def:'a set of printed pages with news, sold every day',phonetic:'/ˈnjuːzpeɪpər/',pos:'n.'},
  {en:'offer',zh:'提供',def:'To present or provide something for acceptance or consideration; a proposal.',phonetic:'/ˈɒfə/',pos:'v./n.'},
  {en:'order',zh:'命令',def:'to tell someone they must do something',phonetic:'/ˈɔːrdər/',pos:'v.'},
  {en:'own',zh:'自己的',def:'belonging to the person mentioned',phonetic:'/oʊn/',pos:'adj.'},
  {en:'pardon',zh:'原谅',def:'to forgive someone for something they did wrong',phonetic:'/ˈpɑːrdn/',pos:'v.'},
  {en:'part',zh:'部分',def:'a piece or section of something',phonetic:'/pɑːrt/',pos:'n.'},
  {en:'path',zh:'小路',def:'a way from one place to another that people walk along',phonetic:'/pæθ/',pos:'n.'},
  {en:'perform',zh:'表演',def:'to entertain people by acting, singing, or dancing',phonetic:'/pərˈfɔːrm/',pos:'v.'},
  {en:'possible',zh:'可能的',def:'able to happen or be done',phonetic:'/ˈpɒsɪbl/',pos:'adj.'},
  {en:'pot',zh:'锅',def:'a deep round container used for cooking',phonetic:'/pɒt/',pos:'n.'},
  {en:'price',zh:'价格',def:'the amount of money that something costs',phonetic:'/praɪs/',pos:'n.'},
  {en:'princess',zh:'公主',def:'the daughter of a king and queen',phonetic:'/ˌprɪnˈses/',pos:'n.'},
  {en:'product',zh:'产品',def:'something that is made to be sold',phonetic:'/ˈprɒdʌkt/',pos:'n.'},
  {en:'public',zh:'公共的',def:'available for everyone to use or see',phonetic:'/ˈpʌblɪk/',pos:'adj.'},
  {en:'quite',zh:'相当',def:'fairly; to a certain degree',phonetic:'/kwaɪt/',pos:'adv.'},
  {en:'raise',zh:'举起',def:'to lift or move something to a higher position',phonetic:'/reɪz/',pos:'v.'},
  {en:'reach',zh:'到达',def:'to arrive at a place after traveling',phonetic:'/riːtʃ/',pos:'v.'},
  {en:'real',zh:'真实的',def:'actually existing; not imagined',phonetic:'/rɪəl/',pos:'adj.'},
  {en:'rise',zh:'升起',def:'to move upward or become higher',phonetic:'/raɪz/',pos:'v.'},
  {en:'roll',zh:'滚动',def:'to move by turning over and over',phonetic:'/roʊl/',pos:'v.'},
  {en:'roof',zh:'屋顶',def:'the top covering of a building',phonetic:'/ruːf/',pos:'n.'},
  {en:'rope',zh:'绳子',def:'a thick strong cord made by twisting fibers together',phonetic:'/roʊp/',pos:'n.'},
  {en:'safe',zh:'安全的',def:'not in danger; not likely to cause harm',phonetic:'/seɪf/',pos:'adj.'},
  {en:'sand',zh:'沙子',def:'tiny pieces of rock found on beaches and in deserts',phonetic:'/sænd/',pos:'n.'},
  {en:'save',zh:'拯救',def:'to stop someone or something from being harmed or killed',phonetic:'/seɪv/',pos:'v.'},
  {en:'scene',zh:'场景',def:'a part of a movie, play, or story',phonetic:'/siːn/',pos:'n.'},
  {en:'seem',zh:'似乎',def:'to appear to be something based on what you see or know',phonetic:'/siːm/',pos:'v.'},
  {en:'service',zh:'服务',def:'the act of helping or doing work for someone',phonetic:'/ˈsɜːrvɪs/',pos:'n.'},
  {en:'set',zh:'放置',def:'to put something in a particular place or position',phonetic:'/set/',pos:'v.'},
  {en:'shake',zh:'摇晃',def:'to move something quickly up and down or side to side',phonetic:'/ʃeɪk/',pos:'v.'},
  {en:'shape',zh:'形状',def:'the form that something has, e.g. round, square',phonetic:'/ʃeɪp/',pos:'n.'},
  {en:'share',zh:'分享',def:'to have or use something together with others',phonetic:'/ʃeər/',pos:'v.'},
  {en:'shout',zh:'喊叫',def:'to speak very loudly',phonetic:'/ʃaʊt/',pos:'v.'},
  {en:'shy',zh:'害羞的',def:'nervous and uncomfortable with other people',phonetic:'/ʃaɪ/',pos:'adj.'},
  {en:'sign',zh:'标志',def:'a board with words or pictures giving information',phonetic:'/saɪn/',pos:'n.'},
  {en:'smart',zh:'聪明的',def:'intelligent; able to learn and understand quickly',phonetic:'/smɑːrt/',pos:'adj.'},
  {en:'soccer',zh:'足球',def:'a game played by two teams who kick a ball to score goals',phonetic:'/ˈsɒkər/',pos:'n.'},
  {en:'sock',zh:'袜子',def:'a piece of clothing worn on your foot inside your shoe',phonetic:'/sɒk/',pos:'n.'},
  {en:'soil',zh:'土壤',def:'the top layer of the earth in which plants grow',phonetic:'/sɔɪl/',pos:'n.'},
  {en:'solve',zh:'解决',def:'to find the answer to a problem or question',phonetic:'/sɒlv/',pos:'v.'},
  {en:'sore',zh:'疼痛的',def:'painful, especially when touched or used',phonetic:'/sɔːr/',pos:'adj.'},
  {en:'space',zh:'空间',def:'an empty area that is available to use',phonetic:'/speɪs/',pos:'n.'},
  {en:'sport',zh:'运动',def:'a physical activity or game, e.g. football or tennis',phonetic:'/spɔːrt/',pos:'n.'},
  {en:'spot',zh:'地点',def:'a particular place or area',phonetic:'/spɒt/',pos:'n.'},
  {en:'stage',zh:'舞台',def:'the raised area where actors perform in a theater',phonetic:'/steɪdʒ/',pos:'n.'},
  {en:'step',zh:'步骤',def:'one action in a series of actions',phonetic:'/step/',pos:'n.'},
  {en:'stick',zh:'棍子',def:'a long thin piece of wood',phonetic:'/stɪk/',pos:'n.'},
  {en:'still',zh:'仍然',def:'continuing to happen or exist',phonetic:'/stɪl/',pos:'adv.'},
  {en:'stone',zh:'石头',def:'a hard solid substance found in the ground',phonetic:'/stoʊn/',pos:'n.'},
  {en:'stress',zh:'压力',def:'a feeling of worry caused by problems in your life',phonetic:'/stres/',pos:'n.'},
  {en:'string',zh:'绳子',def:'thin rope made of twisted threads',phonetic:'/strɪŋ/',pos:'n.'},
  {en:'stupid',zh:'愚蠢的',def:'not intelligent; silly',phonetic:'/ˈstjuːpɪd/',pos:'adj.'},
  {en:'suddenly',zh:'突然',def:'quickly and without warning',phonetic:'/ˈsʌdnli/',pos:'adv.'},
  {en:'taste',zh:'味道',def:'the flavor of something in your mouth',phonetic:'/teɪst/',pos:'n.'},
  {en:'tear',zh:'撕裂',def:'to pull something apart or into pieces',phonetic:'/teər/',pos:'v.'},
  {en:'tent',zh:'帐篷',def:'a shelter made of cloth supported by poles',phonetic:'/tent/',pos:'n.'},
  {en:'thick',zh:'厚的',def:'having a large distance between opposite sides',phonetic:'/θɪk/',pos:'adj.'},
  {en:'tight',zh:'紧的',def:'fitting very closely to the body',phonetic:'/taɪt/',pos:'adj.'},
  {en:'tired',zh:'累的',def:'feeling that you need to rest or sleep',phonetic:'/ˈtaɪərd/',pos:'adj.'},
  {en:'topic',zh:'话题',def:'a subject that people talk or write about',phonetic:'/ˈtɒpɪk/',pos:'n.'},
  {en:'tower',zh:'塔',def:'a tall narrow building or structure',phonetic:'/ˈtaʊər/',pos:'n.'},
  {en:'tradition',zh:'传统',def:'a belief or custom passed down from older generations',phonetic:'/trəˈdɪʃn/',pos:'n.'},
  {en:'treat',zh:'对待',def:'to behave toward someone in a particular way',phonetic:'/triːt/',pos:'v.'},
  {en:'unique',zh:'独特的',def:'being the only one of its kind',phonetic:'/juːˈniːk/',pos:'adj.'},
  {en:'upset',zh:'难过的',def:'unhappy, worried, or angry about something',phonetic:'/ʌpˈset/',pos:'adj.'},
  {en:'usually',zh:'通常',def:'in most cases; most of the time',phonetic:'/ˈjuːʒuəli/',pos:'adv.'},
  {en:'vote',zh:'投票',def:'to make a choice in an election',phonetic:'/voʊt/',pos:'v.'},
  {en:'whole',zh:'整个的',def:'all of something; complete',phonetic:'/hoʊl/',pos:'adj.'},
  {en:'wild',zh:'野生的',def:'living in nature and not controlled by people',phonetic:'/waɪld/',pos:'adj.'},
  {en:'wise',zh:'明智的',def:'able to make good decisions based on experience',phonetic:'/waɪz/',pos:'adj.'},
  {en:'adult',zh:'成年人',def:'a person who is fully grown',phonetic:'/ˈædʌlt/',pos:'n.'},
  {en:'announce',zh:'宣布',def:'to tell people about something officially',phonetic:'/əˈnaʊns/',pos:'v.'},
  {en:'appreciate',zh:'欣赏',def:'to recognize the good qualities of something',phonetic:'/əˈpriːʃieɪt/',pos:'v.'},
  {en:'attack',zh:'攻击',def:'To take aggressive action against someone or something; an act of aggression.',phonetic:'/əˈtæk/',pos:'v./n.'},
  {en:'attractive',zh:'有吸引力的',def:'pleasant to look at; beautiful or handsome',phonetic:'/əˈtræktɪv/',pos:'adj.'},
  {en:'available',zh:'可用的',def:'able to be used or obtained',phonetic:'/əˈveɪləbl/',pos:'adj.'},
  {en:'avenue',zh:'大道',def:'a wide road in a town or city',phonetic:'/ˈævənjuː/',pos:'n.'},
  {en:'avoid',zh:'避免',def:'to stay away from someone or something',phonetic:'/əˈvɔɪd/',pos:'v.'},
  {en:'awful',zh:'糟糕的',def:'very bad or unpleasant',phonetic:'/ˈɔːfl/',pos:'adj.'},
  {en:'band',zh:'乐队',def:'a group of musicians who play music together',phonetic:'/bænd/',pos:'n.'},
  {en:'base',zh:'基础',def:'the bottom part of something that supports it',phonetic:'/beɪs/',pos:'n.'},
  {en:'beat',zh:'打败',def:'to win against someone in a game or competition',phonetic:'/biːt/',pos:'v.'},
  {en:'beg',zh:'乞求',def:'to ask for something very strongly',phonetic:'/beɡ/',pos:'v.'},
  {en:'bit',zh:'一点',def:'a small amount or piece of something',phonetic:'/bɪt/',pos:'n.'},
  {en:'business',zh:'商业',def:'the activity of buying and selling goods or services',phonetic:'/ˈbɪznɪs/',pos:'n.'},
  {en:'challenge',zh:'挑战',def:'something difficult that tests your ability',phonetic:'/ˈtʃælɪndʒ/',pos:'n.'},
  {en:'character',zh:'角色',def:'a person in a story, book, or movie',phonetic:'/ˈkærəktər/',pos:'n.'},
  {en:'classic',zh:'经典的',def:'having high quality and lasting value',phonetic:'/ˈklæsɪk/',pos:'adj.'},
  {en:'cloth',zh:'布',def:'material made from fibers used for making clothes',phonetic:'/klɒθ/',pos:'n.'},
  {en:'concentrate',zh:'集中',def:'to give all your attention to one thing',phonetic:'/ˈkɒnsntreɪt/',pos:'v.'},
  {en:'conduct',zh:'行为',def:'the way someone behaves',phonetic:'/ˈkɒndʌkt/',pos:'n.'},
  {en:'consider',zh:'考虑',def:'to think carefully about something before deciding',phonetic:'/kənˈsɪdər/',pos:'v.'},
  {en:'convenient',zh:'方便的',def:'easy and suitable for a particular purpose',phonetic:'/kənˈviːniənt/',pos:'adj.'},
  {en:'copy',zh:'复制',def:'to make something exactly like another thing',phonetic:'/ˈkɒpi/',pos:'v.'},
  {en:'cough',zh:'咳嗽',def:'to force air out of your throat with a sudden noise',phonetic:'/kɒf/',pos:'v.'},
  {en:'crazy',zh:'疯狂的',def:'very strange or foolish',phonetic:'/ˈkreɪzi/',pos:'adj.'},
  {en:'crowd',zh:'人群',def:'a large group of people in one place',phonetic:'/kraʊd/',pos:'n.'},
  {en:'cure',zh:'治愈',def:'to make a sick person healthy again',phonetic:'/kjʊər/',pos:'v.'},
  {en:'customer',zh:'顾客',def:'a person who buys things from a shop or business',phonetic:'/ˈkʌstəmər/',pos:'n.'},
  {en:'debate',zh:'辩论',def:'a formal discussion where people express different opinions',phonetic:'/dɪˈbeɪt/',pos:'n.'},
  {en:'decision',zh:'决定',def:'a choice you make after thinking about something',phonetic:'/dɪˈsɪʒn/',pos:'n.'},
  {en:'diet',zh:'饮食',def:'the food and drink that a person usually has',phonetic:'/ˈdaɪət/',pos:'n.'},
  {en:'disappear',zh:'消失',def:'to become impossible to see or find',phonetic:'/ˌdɪsəˈpɪər/',pos:'v.'},
  {en:'disappointed',zh:'失望的',def:'unhappy because something was not as good as expected',phonetic:'/ˌdɪsəˈpɔɪntɪd/',pos:'adj.'},
  {en:'edge',zh:'边缘',def:'the outside limit of an object or area',phonetic:'/edʒ/',pos:'n.'},
  {en:'edit',zh:'编辑',def:'to make changes to a text before it is published',phonetic:'/ˈedɪt/',pos:'v.'},
  {en:'electronic',zh:'电子的',def:'using electricity and tiny electronic parts to work',phonetic:'/ɪˌlekˈtrɒnɪk/',pos:'adj.'},
  {en:'empire',zh:'帝国',def:'a group of countries ruled by one government',phonetic:'/ˈempaɪər/',pos:'n.'},
  {en:'equal',zh:'相等的',def:'the same in size, amount, or value',phonetic:'/ˈiːkwəl/',pos:'adj.'},
  {en:'evidence',zh:'证据',def:'facts that show something is true',phonetic:'/ˈevɪdəns/',pos:'n.'},
  {en:'exhibit',zh:'展览',def:'to show something to the public, e.g. in a museum',phonetic:'/ɪɡˈzɪbɪt/',pos:'v.'},
  {en:'exist',zh:'存在',def:'to be real or present in the world',phonetic:'/ɪɡˈzɪst/',pos:'v.'},
  {en:'extra',zh:'额外的',def:'more than the usual or necessary amount',phonetic:'/ˈekstrə/',pos:'adj.'},
  {en:'fail',zh:'失败',def:'to not succeed in doing something',phonetic:'/feɪl/',pos:'v.'},
  {en:'false',zh:'错误的',def:'not true or correct',phonetic:'/fɔːls/',pos:'adj.'},
  {en:'fit',zh:'健康的',def:'in good physical condition; healthy and strong',phonetic:'/fɪt/',pos:'adj.'},
  {en:'flight',zh:'航班',def:'a journey in an airplane',phonetic:'/flaɪt/',pos:'n.'},
  {en:'flood',zh:'洪水',def:'a large amount of water covering an area that is usually dry',phonetic:'/flʌd/',pos:'n.'},
  {en:'flow',zh:'流动',def:'to move smoothly and continuously in one direction',phonetic:'/floʊ/',pos:'v.'},
  {en:'fortune',zh:'财富',def:'a large amount of money',phonetic:'/ˈfɔːrtʃuːn/',pos:'n.'},
  {en:'gather',zh:'收集',def:'to bring things or people together in one place',phonetic:'/ˈɡæðər/',pos:'v.'},
  {en:'goods',zh:'商品',def:'things that are made to be sold',phonetic:'/ɡʊdz/',pos:'n.'},
  {en:'hall',zh:'大厅',def:'a large room in a building for meetings or events',phonetic:'/hɔːl/',pos:'n.'},
  {en:'handle',zh:'处理',def:'to deal with a situation or problem',phonetic:'/ˈhændl/',pos:'v.'},
  {en:'host',zh:'主人',def:'a person who invites guests to their home or event',phonetic:'/hoʊst/',pos:'n.'},
  {en:'huge',zh:'巨大的',def:'extremely large in size or amount',phonetic:'/hjuːdʒ/',pos:'adj.'},
  {en:'image',zh:'图像',def:'a picture or photograph',phonetic:'/ˈɪmɪdʒ/',pos:'n.'},
  {en:'immediately',zh:'立即',def:'without delay; at once',phonetic:'/ɪˈmiːdiətli/',pos:'adv.'},
  {en:'improve',zh:'改善',def:'to make something better',phonetic:'/ɪmˈpruːv/',pos:'v.'},
  {en:'increase',zh:'增加',def:'to become larger in number or amount',phonetic:'/ɪnˈkriːs/',pos:'v.'},
  {en:'influence',zh:'影响',def:'the power to change how someone thinks or behaves',phonetic:'/ˈɪnfluəns/',pos:'n.'},
  {en:'intend',zh:'打算',def:'to plan to do something',phonetic:'/ɪnˈtend/',pos:'v.'},
  {en:'joy',zh:'快乐',def:'a feeling of great happiness',phonetic:'/dʒɔɪ/',pos:'n.'},
  {en:'lead',zh:'领导',def:'to guide a group of people or an organization',phonetic:'/liːd/',pos:'v.'},
  {en:'lift',zh:'举起',def:'to move something to a higher position',phonetic:'/lɪft/',pos:'v.'},
  {en:'limit',zh:'限制',def:'the greatest amount of something that is allowed',phonetic:'/ˈlɪmɪt/',pos:'n.'},
  {en:'local',zh:'当地的；本地人',def:'Belonging or relating to a particular area or neighborhood.',phonetic:'/ˈləʊkəl/',pos:'adj./n.'},
  {en:'major',zh:'主要的',def:'very large or important',phonetic:'/ˈmeɪdʒər/',pos:'adj.'},
  {en:'male',zh:'男性的',def:'relating to men or boys',phonetic:'/meɪl/',pos:'adj.'},
  {en:'married',zh:'已婚的',def:'having a husband or wife',phonetic:'/ˈmærid/',pos:'adj.'},
  {en:'material',zh:'材料',def:'the substance used to make things',phonetic:'/məˈtɪəriəl/',pos:'n.'},
  {en:'maximum',zh:'最大的',def:'the largest amount possible or allowed',phonetic:'/ˈmæksɪməm/',pos:'n.'},
  {en:'medical',zh:'医学的',def:'relating to medicine and the treatment of illness',phonetic:'/ˈmedɪkl/',pos:'adj.'},
  {en:'medium',zh:'中等的',def:'in the middle of a range of size or quality',phonetic:'/ˈmiːdiəm/',pos:'adj.'},
  {en:'melt',zh:'融化',def:'to change from solid to liquid because of heat',phonetic:'/melt/',pos:'v.'},
  {en:'native',zh:'本地的',def:'relating to the place where you were born',phonetic:'/ˈneɪtɪv/',pos:'adj.'},
  {en:'necessary',zh:'必要的',def:'needed for a particular purpose',phonetic:'/ˈnesəsəri/',pos:'adj.'},
  {en:'noon',zh:'中午',def:'twelve o\'clock in the middle of the day',phonetic:'/nuːn/',pos:'n.'},
  {en:'odd',zh:'奇怪的',def:'strange or unusual',phonetic:'/ɒd/',pos:'adj.'},
  {en:'old',zh:'老的',def:'having lived for many years',phonetic:'/oʊld/',pos:'adj.'},
  {en:'operate',zh:'操作',def:'to control or use a machine',phonetic:'/ˈɒpəreɪt/',pos:'v.'},
  {en:'original',zh:'原始的',def:'existing first; not a copy',phonetic:'/əˈrɪdʒɪnl/',pos:'adj.'},
  {en:'pack',zh:'打包',def:'to put things into a bag or box',phonetic:'/pæk/',pos:'v.'},
  {en:'peace',zh:'和平',def:'a situation without war or fighting',phonetic:'/piːs/',pos:'n.'},
  {en:'penny',zh:'便士',def:'a small British coin worth one hundredth of a pound',phonetic:'/ˈpeni/',pos:'n.'},
  {en:'physical',zh:'身体的',def:'relating to the body rather than the mind',phonetic:'/ˈfɪzɪkl/',pos:'adj.'},
  {en:'pity',zh:'同情',def:'a feeling of sadness for someone who is suffering',phonetic:'/ˈpɪti/',pos:'n.'},
  {en:'pleasure',zh:'快乐',def:'a feeling of happiness and enjoyment',phonetic:'/ˈpleʒər/',pos:'n.'},
  {en:'poem',zh:'诗',def:'a piece of writing with short lines that often rhyme',phonetic:'/ˈpoʊɪm/',pos:'n.'},
  {en:'poison',zh:'毒药',def:'a substance that can cause death or illness',phonetic:'/ˈpɔɪzn/',pos:'n.'},
  {en:'population',zh:'人口',def:'the number of people living in a place',phonetic:'/ˌpɒpjuˈleɪʃn/',pos:'n.'},
  {en:'position',zh:'位置',def:'the place where someone or something is',phonetic:'/pəˈzɪʃn/',pos:'n.'},
  {en:'positive',zh:'积极的',def:'thinking about what is good in a situation',phonetic:'/ˈpɒzɪtɪv/',pos:'adj.'},
  {en:'pour',zh:'倒',def:'to make liquid flow from a container',phonetic:'/pɔːr/',pos:'v.'},
  {en:'prefer',zh:'更喜欢',def:'to like one thing more than another',phonetic:'/prɪˈfɜːr/',pos:'v.'},
  {en:'press',zh:'按',def:'to push something firmly with your finger or hand',phonetic:'/pres/',pos:'v.'},
  {en:'print',zh:'打印',def:'to produce words or pictures on paper using a machine',phonetic:'/prɪnt/',pos:'v.'},
  {en:'prize',zh:'奖品',def:'something valuable given to a winner of a competition',phonetic:'/praɪz/',pos:'n.'},
  {en:'project',zh:'项目',def:'a carefully planned piece of work',phonetic:'/ˈprɒdʒekt/',pos:'n.'},
  {en:'proper',zh:'适当的',def:'correct or right for a particular situation',phonetic:'/ˈprɒpər/',pos:'adj.'},
  {en:'race',zh:'比赛',def:'a competition to see who is the fastest',phonetic:'/reɪs/',pos:'n.'},
  {en:'rather',zh:'相当',def:'to a fairly large degree',phonetic:'/ˈræðər/',pos:'adv.'},
  {en:'reaction',zh:'反应',def:'what you do or say because of something that happened',phonetic:'/riˈækʃn/',pos:'n.'},
  {en:'recently',zh:'最近',def:'not long ago',phonetic:'/ˈriːsntli/',pos:'adv.'},
  {en:'recognize',zh:'认出',def:'to know someone or something because you have seen them before',phonetic:'/ˈrekəɡnaɪz/',pos:'v.'},
  {en:'reduce',zh:'减少',def:'to make something smaller or less in amount',phonetic:'/rɪˈdjuːs/',pos:'v.'},
  {en:'regularly',zh:'定期地',def:'at the same time each day, week, or month',phonetic:'/ˈreɡjələrli/',pos:'adv.'},
  {en:'rent',zh:'租',def:'to pay money to use something for a period of time',phonetic:'/rent/',pos:'v.'},
  {en:'represent',zh:'代表',def:'to speak or act for someone else officially',phonetic:'/ˌreprɪˈzent/',pos:'v.'},
  {en:'research',zh:'研究',def:'careful study to find out new facts or information',phonetic:'/rɪˈsɜːrtʃ/',pos:'n.'},
  {en:'respond',zh:'回应',def:'to say or do something as an answer',phonetic:'/rɪˈspɒnd/',pos:'v.'},
  {en:'responsible',zh:'负责的',def:'having the duty to take care of something',phonetic:'/rɪˈspɒnsɪbl/',pos:'adj.'},
  {en:'role',zh:'角色',def:'the part that someone or something plays in a situation',phonetic:'/roʊl/',pos:'n.'},
  {en:'root',zh:'根',def:'the part of a plant that grows under the ground',phonetic:'/ruːt/',pos:'n.'},
  {en:'rub',zh:'擦',def:'to move your hand or a cloth firmly over a surface',phonetic:'/rʌb/',pos:'v.'},
  {en:'sale',zh:'销售',def:'the act of selling something',phonetic:'/seɪl/',pos:'n.'},
  {en:'sea',zh:'海',def:'the large area of salt water covering most of the Earth',phonetic:'/siː/',pos:'n.'},
  {en:'score',zh:'分数',def:'the number of points in a game or test',phonetic:'/skɔːr/',pos:'n.'},
  {en:'screen',zh:'屏幕',def:'the flat surface on a TV, computer, or phone',phonetic:'/skriːn/',pos:'n.'},
  {en:'section',zh:'部分',def:'one of the parts that something is divided into',phonetic:'/ˈsekʃn/',pos:'n.'},
  {en:'select',zh:'选择',def:'to choose someone or something from a group',phonetic:'/sɪˈlekt/',pos:'v.'},
  {en:'sense',zh:'感觉',def:'a feeling or understanding about something',phonetic:'/sens/',pos:'n.'},
  {en:'separate',zh:'分开',def:'to divide into different parts or groups',phonetic:'/ˈsepəreɪt/',pos:'v.'},
  {en:'serve',zh:'服务',def:'to do work that helps other people',phonetic:'/sɜːrv/',pos:'v.'},
  {en:'sheet',zh:'一张',def:'a single piece of paper',phonetic:'/ʃiːt/',pos:'n.'},
  {en:'shine',zh:'发光',def:'to produce bright light',phonetic:'/ʃaɪn/',pos:'v.'},
  {en:'shoot',zh:'射击',def:'to fire a bullet from a gun',phonetic:'/ʃuːt/',pos:'v.'},
  {en:'similar',zh:'相似的',def:'like someone or something but not exactly the same',phonetic:'/ˈsɪmɪlər/',pos:'adj.'},
  {en:'site',zh:'地点',def:'a place where something happens or is located',phonetic:'/saɪt/',pos:'n.'},
  {en:'skill',zh:'技能',def:'the ability to do something well',phonetic:'/skɪl/',pos:'n.'},
  {en:'skin',zh:'皮肤',def:'the outer covering of a person\'s or animal\'s body',phonetic:'/skɪn/',pos:'n.'},
  {en:'smoke',zh:'烟',def:'the gray or black cloud produced by something burning',phonetic:'/smoʊk/',pos:'n.'},
  {en:'southern',zh:'南方的',def:'in or from the south of a place',phonetic:'/ˈsʌðərn/',pos:'adj.'},
  {en:'speed',zh:'速度',def:'how fast something moves or happens',phonetic:'/spiːd/',pos:'n.'},
  {en:'spell',zh:'拼写',def:'to write or say the letters of a word in order',phonetic:'/spel/',pos:'v.'},
  {en:'state',zh:'状态',def:'the condition that someone or something is in',phonetic:'/steɪt/',pos:'n.'},
  {en:'steal',zh:'偷',def:'to take something that does not belong to you',phonetic:'/stiːl/',pos:'v.'},
  {en:'storm',zh:'暴风雨',def:'very bad weather with strong wind and heavy rain',phonetic:'/stɔːrm/',pos:'n.'},
  {en:'stream',zh:'小溪',def:'a small narrow river',phonetic:'/striːm/',pos:'n.'},
  {en:'stretch',zh:'伸展',def:'to make your body or part of it straight and long',phonetic:'/stretʃ/',pos:'v.'},
  {en:'structure',zh:'结构',def:'the way parts of something are arranged together',phonetic:'/ˈstrʌktʃər/',pos:'n.'},
  {en:'task',zh:'任务',def:'a piece of work that must be done',phonetic:'/tæsk/',pos:'n.'},
  {en:'technology',zh:'技术',def:'the use of science to make machines and tools',phonetic:'/tekˈnɒlədʒi/',pos:'n.'},
  {en:'teenager',zh:'青少年',def:'a young person between 13 and 19 years old',phonetic:'/ˈtiːneɪdʒər/',pos:'n.'},
  {en:'thief',zh:'小偷',def:'a person who steals things',phonetic:'/θiːf/',pos:'n.'},
  {en:'title',zh:'标题',def:'the name of a book, movie, or piece of art',phonetic:'/ˈtaɪtl/',pos:'n.'},
  {en:'tool',zh:'工具',def:'an object used to do a particular job',phonetic:'/tuːl/',pos:'n.'},
  {en:'total',zh:'总的',def:'including everything or everyone',phonetic:'/ˈtoʊtl/',pos:'adj.'},
  {en:'tough',zh:'坚强的',def:'strong and able to deal with difficulties',phonetic:'/tʌf/',pos:'adj.'},
  {en:'tour',zh:'旅游',def:'a visit to a place for pleasure',phonetic:'/tʊər/',pos:'n.'},
  {en:'trick',zh:'诡计',def:'something done to fool or cheat someone',phonetic:'/trɪk/',pos:'n.'},
  {en:'type',zh:'类型',def:'a group of things with similar qualities',phonetic:'/taɪp/',pos:'n.'},
  {en:'value',zh:'价值',def:'how much something is worth in money or importance',phonetic:'/ˈvæljuː/',pos:'n.'},
  {en:'various',zh:'各种各样的',def:'many different types of the same thing',phonetic:'/ˈveəriəs/',pos:'adj.'},
  {en:'view',zh:'景色',def:'the things you can see from a particular place',phonetic:'/vjuː/',pos:'n.'},
  {en:'war',zh:'战争',def:'fighting between two or more countries or groups',phonetic:'/wɔːr/',pos:'n.'},
  {en:'warn',zh:'警告',def:'to tell someone about a possible danger or problem',phonetic:'/wɔːrn/',pos:'v.'},
  {en:'waste',zh:'浪费',def:'to use more of something than you need',phonetic:'/weɪst/',pos:'v.'},
  {en:'wave',zh:'波浪',def:'a raised line of water on the surface of the sea',phonetic:'/weɪv/',pos:'n.'},
  {en:'wealthy',zh:'富有的',def:'having a lot of money and possessions',phonetic:'/ˈwelθi/',pos:'adj.'},
  {en:'wheel',zh:'轮子',def:'a round object that turns to move vehicles',phonetic:'/wiːl/',pos:'n.'},
  {en:'wing',zh:'翅膀',def:'a body part used by birds and insects to fly',phonetic:'/wɪŋ/',pos:'n.'},
  {en:'worse',zh:'更糟的',def:'more unpleasant or difficult than something else',phonetic:'/wɜːrs/',pos:'adj.'},
  {en:'worth',zh:'价值',def:'the value or importance of something',phonetic:'/wɜːrθ/',pos:'n.'},
  {en:'wrap',zh:'包',def:'to cover something with paper or cloth',phonetic:'/ræp/',pos:'v.'},
  {en:'academic',zh:'学术的',def:'(usually capitalized) A follower of Plato, a Platonist.',phonetic:'/ˌækəˈdɛmɪk/',pos:'adj.'},
  {en:'academy',zh:'学院',def:'(usually capitalized) The garden where Plato taught.',phonetic:'/əˈkæd.ə.mi/',pos:'n.'},
  {en:'account',zh:'账户',def:'A registry of pecuniary transactions; a written or printed statement of business dealings or debts and credits, and also of other things subjected to a reckoning or review.',phonetic:'/ə.ˈkaʊnt/',pos:'n.'},
  {en:'accuse',zh:'指控',def:'Accusation.',phonetic:'/əˈkjuːz/',pos:'v.'},
  {en:'activity',zh:'活动',def:'The state or quality of being active; activeness.',phonetic:'/ækˈtɪ.və.ti/',pos:'n.'},
  {en:'actor',zh:'男演员',def:'A person who performs, plays a part in a theatrical play or film.',phonetic:'/ˈæk.tə/',pos:'n.'},
  {en:'actress',zh:'女演员',def:'A female who performs on the stage or in films.',phonetic:'/ˈak.tɹəs/',pos:'n.'},
  {en:'adapt',zh:'适应',def:'To make suitable; to make to correspond; to fit or suit',phonetic:'/əˈdæpt/',pos:'v.'},
  {en:'adopt',zh:'收养；采用',def:'To take by choice into relationship (a child, heir, friend, citizen, etc.)',phonetic:'/əˈdɒpt/',pos:'v.'},
  {en:'advertisement',zh:'广告',def:'A commercial solicitation designed to sell some commodity, service or similar.',phonetic:'/ədˈvɜːtɪsmənt/',pos:'n.'},
  {en:'afford',zh:'负担得起',def:'To incur, stand, or bear without serious detriment, as an act which might under other circumstances be injurious;—with an auxiliary, as can, could, might, etc.; to be able or rich enough.',phonetic:'/əˈfɔːd/',pos:'v.'},
  {en:'agency',zh:'代理机构',def:'The capacity, condition, or state of acting or of exerting power.',phonetic:'/ˈeɪ.dʒən.si/',pos:'n.'},
  {en:'agent',zh:'代理人',def:'One who exerts power, or has the power to act',phonetic:'/ˈeɪ.dʒənt/',pos:'n.'},
  {en:'agreement',zh:'协议',def:'An understanding between entities to follow a specific course of conduct.',phonetic:'/əˈɡɹiːmənt/',pos:'n.'},
  {en:'ahead',zh:'在前面',def:'In or to the front; in advance; onward.',phonetic:'/əˈhɛd/',pos:'adv.'},
  {en:'aircraft',zh:'飞机；飞行器',def:'A vehicle capable of atmospheric flight due to interaction with the air, such as buoyancy or lift',phonetic:'/ɛə.kɹɑːft/',pos:'n.'},
  {en:'album',zh:'专辑',def:'A book specially designed to keep photographs, stamps, or autographs.',phonetic:'/ˈælbəm/',pos:'n.'},
  {en:'ally',zh:'盟友',def:'A person, group, or state (etc) which is associated with another for a common cause; one united to another by treaty or common purpose; a confederate.',phonetic:'',pos:'n.'},
  {en:'altogether',zh:'完全地',def:'Completely; in total.',phonetic:'/ˌɔːltəˈɡeðə/',pos:'adv.'},
  {en:'amazed',zh:'惊讶的',def:'To fill with wonder and surprise; to astonish, astound, surprise or perplex.',phonetic:'/əˈmeɪzd/',pos:'adj.'},
  {en:'ambulance',zh:'救护车',def:'An emergency vehicle designed for transporting seriously ill or injured people to a hospital.',phonetic:'/ˈæm.bjə.ləns/',pos:'n.'},
  {en:'among',zh:'在...之中',def:'Denotes a mingling or intermixing with distinct or separable objects. (See Usage Note at amidst.)',phonetic:'/əˈmɒŋ/',pos:'prep.'},
  {en:'amuse',zh:'逗乐',def:'To entertain or occupy in a pleasant manner; to stir with pleasing emotions.',phonetic:'/əˈmjuːz/',pos:'v.'},
  {en:'angel',zh:'天使',def:'An incorporeal and sometimes divine messenger from a deity, or other divine entity, often depicted in art as a youthful winged figure in flowing robes.',phonetic:'/ˈeɪn.dʒəl/',pos:'n.'},
  {en:'anger',zh:'愤怒',def:'A strong feeling of displeasure, hostility or antagonism towards someone or something, usually combined with an urge to harm.',phonetic:'/ˈæŋɡə(ɹ)/',pos:'n.'},
  {en:'ankle',zh:'脚踝',def:'The skeletal joint which connects the foot with the leg; the uppermost portion of the foot and lowermost portion of the leg, which contain this skeletal joint.',phonetic:'/ˈæŋ.kəl/',pos:'n.'},
  {en:'annoy',zh:'使烦恼',def:'A feeling of discomfort or vexation caused by what one dislikes.',phonetic:'/əˈnɔɪ/',pos:'v.'},
  {en:'anxiety',zh:'焦虑',def:'An unpleasant state of mental uneasiness, nervousness, apprehension and obsession or concern about some uncertain event.',phonetic:'/ˌæŋ(ɡ)ˈzaɪ.ə.ti/',pos:'n.'},
  {en:'anxious',zh:'焦虑的',def:'Nervous and worried.',phonetic:'/ˈaŋ(k)ʃəs/',pos:'adj.'},
  {en:'appeal',zh:'呼吁',def:'An application for the removal of a cause or suit from an inferior to a superior judge or court for re-examination or review.',phonetic:'/əˈpiːl/',pos:'n.'},
  {en:'apply',zh:'申请',def:'To lay or place; to put (one thing to another)',phonetic:'/əˈplaɪ/',pos:'v.'},
  {en:'argue',zh:'争论',def:'To show grounds for concluding (that); to indicate, imply.',phonetic:'/ˈɑː.ɡjuː/',pos:'v.'},
  {en:'arithmetic',zh:'算术',def:'The mathematics of numbers (integers, rational numbers, real numbers, or complex numbers) under the operations of addition, subtraction, multiplication, and division.',phonetic:'',pos:'n.'},
  {en:'armed',zh:'武装的',def:'To take by the arm; to take up in one\'s arms.',phonetic:'/ɑːmd/',pos:'adj.'},
  {en:'armor',zh:'盔甲',def:'A protective layer over a body, vehicle, or other object intended to deflect or diffuse damaging forces.',phonetic:'/ˈɑː.mə/',pos:'n.'},
  {en:'army',zh:'军队',def:'A large, highly organized military force, concerned mainly with ground (rather than air or naval) operations.',phonetic:'/ˈɑː.miː/',pos:'n.'},
  {en:'around',zh:'周围',def:'(with the verb "to be") Present in the vicinity.',phonetic:'/əˈɹaʊnd/',pos:'adj.'},
  {en:'arrest',zh:'逮捕',def:'A check, stop, an act or instance of arresting something.',phonetic:'/əˈɹɛst/',pos:'n.'},
  {en:'arrow',zh:'箭',def:'A projectile consisting of a shaft, a point and a tail with stabilizing fins that is shot from a bow.',phonetic:'/ˈæɹ.əʊ/',pos:'n.'},
  {en:'ashamed',zh:'羞愧的',def:'To feel shame; to be ashamed.',phonetic:'/əˈʃeɪmd/',pos:'adj.'},
  {en:'asleep',zh:'睡着的',def:'In a state of sleep; also, broadly, resting.',phonetic:'/əˈsliːp/',pos:'adj.'},
  {en:'assistant',zh:'助手',def:'Someone who is present; a bystander, a witness.',phonetic:'/əˈsɪstənt/',pos:'n.'},
  {en:'astonish',zh:'使惊讶',def:'To surprise greatly.',phonetic:'/əˈstɒnɪʃ/',pos:'v.'},
  {en:'attitude',zh:'态度',def:'The position of the body or way of carrying oneself.',phonetic:'/ˈætɪˌtjuːd/',pos:'n.'},
  {en:'attract',zh:'吸引',def:'To pull toward without touching.',phonetic:'/əˈtɹækt/',pos:'v.'},
  {en:'author',zh:'作者',def:'The originator or creator of a work, especially of a literary composition.',phonetic:'/ˈɔː.θə/',pos:'n.'},
  {en:'authority',zh:'权威',def:'The power to enforce rules or give orders.',phonetic:'/ɔːˈθɒɹəti/',pos:'n.'},
  {en:'automatic',zh:'自动的',def:'A car with automatic transmission.',phonetic:'/ˌɔːtəˈmætɪk/',pos:'adj.'},
  {en:'aviation',zh:'航空',def:'The art or science of making and flying aircraft.',phonetic:'/eɪviˈeɪʃən/',pos:'n.'},
  {en:'avocado',zh:'牛油果',def:'The large, usually yellowish-green or black, pulpy fruit of the avocado tree.',phonetic:'/ævəˈkɑːdəʊ/',pos:'n.'},
  {en:'award',zh:'奖品',def:'A judgment, sentence, or final decision. Specifically: The decision of arbitrators in a case submitted.',phonetic:'/əˈwɔːd/',pos:'n.'},
  {en:'aware',zh:'意识到的',def:'Vigilant or on one\'s guard against danger or difficulty.',phonetic:'/əˈweːɹ/',pos:'adj.'},
  {en:'away',zh:'离开',def:'To depart; to go to another place.',phonetic:'/əˈweɪ/',pos:'adv.'},
  {en:'awkward',zh:'尴尬的',def:'Someone or something that is awkward.',phonetic:'/ˈɑkwɚd/',pos:'adj.'},
  {en:'background',zh:'背景',def:'One\'s social heritage, or previous life; what one did in the past.',phonetic:'/ˈbæk.ɡɹaʊnd/',pos:'n.'},
  {en:'backpack',zh:'背包',def:'A knapsack, sometimes mounted on a light frame, but always supported by straps, worn on a person’s back for the purpose of carrying things, especially when hiking, or on a student\'s back when carrying books.',phonetic:'/ˈbæk.pæk/',pos:'n.'},
  {en:'backyard',zh:'后院',def:'A yard to the rear of a house or similar residence.',phonetic:'/bækˈjɑːd/',pos:'n.'},
  {en:'bacon',zh:'培根',def:'Cured meat from the sides, belly or back of a pig.',phonetic:'/ˈbeɪ.kən/',pos:'n.'},
  {en:'badly',zh:'严重地',def:'Ill, unwell.',phonetic:'/ˈbæd.li/',pos:'adv.'},
  {en:'bagel',zh:'百吉饼',def:'A toroidal bread roll that is boiled before it is baked.',phonetic:'/bæ.ɡɫ̩/',pos:'n.'},
  {en:'baggage',zh:'行李',def:'(usually uncountable) Luggage; traveling equipment',phonetic:'/ˈbæɡɪdʒ/',pos:'n.'},
  {en:'baker',zh:'面包师',def:'A person who bakes and sells bread, cakes and similar items.',phonetic:'/ˈbeɪ.kə(ɹ)/',pos:'n.'},
  {en:'ballet',zh:'芭蕾舞',def:'A classical form of dance.',phonetic:'/bælæe/',pos:'n.'},
  {en:'barbecue',zh:'烧烤',def:'A fireplace or pit for grilling food, typically used outdoors and traditionally employing hot charcoal as the heating medium.',phonetic:'/ˈbɑːbɪˌkjuː/',pos:'n.'},
  {en:'barber',zh:'理发师',def:'A person whose profession is cutting (usually male) customers\' hair and beards.',phonetic:'/ˈbɑː.bə/',pos:'n.'},
  {en:'basement',zh:'地下室',def:'A floor of a building below ground level.',phonetic:'/ˈbeɪsmənt/',pos:'n.'},
  {en:'bathtub',zh:'浴缸',def:'A large container for holding water in which a person may bathe (take a bath).',phonetic:'/ˈbæθtʊb/',pos:'n.'},
  {en:'battery',zh:'电池',def:'A device used to power electric devices, consisting of a set of electrically connected electrochemical or, archaically, electrostatic cells. A single such cell when used by itself.',phonetic:'/ˈbætəɹi/',pos:'n.'},
  {en:'bay',zh:'海湾',def:'A berry.',phonetic:'/beɪ/',pos:'n.'},
  {en:'beak',zh:'喙',def:'Anatomical uses.',phonetic:'/biːk/',pos:'n.'},
  {en:'beast',zh:'野兽',def:'Any animal other than a human; usually only applied to land vertebrates, especially large or dangerous four-footed ones.',phonetic:'/biːst/',pos:'n.'},
  {en:'bedding',zh:'床上用品',def:'The textiles associated with a bed, e.g., sheets, pillowcases, bedspreads, blankets, etc.',phonetic:'/ˈbɛdɪŋ/',pos:'n.'},
  {en:'bedroom',zh:'卧室',def:'A room in a house where a bed is kept for sleeping.',phonetic:'/ˈbɛdɹʊm/',pos:'n.'},
  {en:'belief',zh:'信念',def:'Mental acceptance of a claim as true.',phonetic:'/bəˈliːf/',pos:'n.'},
  {en:'belly',zh:'腹部',def:'The abdomen, especially a fat one.',phonetic:'/bɛli/',pos:'n.'},
  {en:'below',zh:'在下面',def:'In a lower place.',phonetic:'/bɪˈləʊ/',pos:'adv.'},
  {en:'belt',zh:'皮带',def:'A band worn around the waist to hold clothing to one\'s body (usually pants), hold weapons (such as a gun or sword), or serve as a decorative piece of clothing.',phonetic:'/bɛlt/',pos:'n.'},
  {en:'billion',zh:'十亿',def:'(modern British & Australian, short scale) a thousand million (logic: 1,000 × 1,000^2): 1 followed by nine zeros, 109; a milliard',phonetic:'/ˈbɪljən/',pos:'n.'},
  {en:'biography',zh:'传记',def:'A person\'s life story, especially one published.',phonetic:'/baɪˈɒɡɹəfi/',pos:'n.'},
  {en:'biscuit',zh:'饼干',def:'(rare in the US) A small, flat, baked good which is either hard and crisp or else soft but firm: a cookie.',phonetic:'/ˈbɪskɪt/',pos:'n.'},
  {en:'blackboard',zh:'黑板',def:'A large flat surface, finished with black slate or a similar material, that can be written upon with chalk and subsequently erased; a chalkboard.',phonetic:'/ˈblækbɔːd/',pos:'n.'},
  {en:'blame',zh:'责备',def:'Censure.',phonetic:'/bleɪm/',pos:'n.'},
  {en:'bloom',zh:'开花',def:'A blossom; the flower of a plant; an expanded bud.',phonetic:'/bluːm/',pos:'n.'},
  {en:'blouse',zh:'女衬衫',def:'A shirt, typically loose and reaching from the neck to the waist.',phonetic:'/blaʊs/',pos:'n.'},
  {en:'body',zh:'身体',def:'Physical frame.',phonetic:'/ˈbɒdi/',pos:'n.'},
  {en:'bone',zh:'骨头',def:'A composite material consisting largely of calcium phosphate and collagen and making up the skeleton of most vertebrates.',phonetic:'/bəʉn/',pos:'n.'},
  {en:'bookstore',zh:'书店',def:'A store where books are bought and sold.',phonetic:'/ˈbʊkstɔː/',pos:'n.'},
  {en:'border',zh:'边界',def:'The outer edge of something.',phonetic:'/ˈbɔədə/',pos:'n.'},
  {en:'bored',zh:'无聊的',def:'To inspire boredom in somebody.',phonetic:'/bɔːd/',pos:'adj.'},
  {en:'boss',zh:'老板',def:'A person who oversees and directs the work of others; a supervisor.',phonetic:'/bɑs/',pos:'n.'},
  {en:'both',zh:'两者都',def:'Each of the two, or of the two kinds.',phonetic:'/bəʊθ/',pos:'pron.'},
  {en:'bother',zh:'打扰',def:'Fuss, ado.',phonetic:'[ˈbɔðə(ɹ)]',pos:'v.'},
  {en:'bow',zh:'鞠躬',def:'A weapon made of a curved piece of wood or other flexible material whose ends are connected by a string, used for shooting arrows.',phonetic:'/bəʊ/',pos:'n.'},
  {en:'brake',zh:'刹车',def:'A fern; bracken.',phonetic:'/bɹeɪk/',pos:'n.'},
  {en:'brand',zh:'品牌',def:'A conflagration; a flame.',phonetic:'/bɹand/',pos:'n.'},
  {en:'breathe',zh:'呼吸',def:'To draw air into (inhale), and expel air from (exhale), the lungs in order to extract oxygen and excrete waste gases.',phonetic:'/bɹiːð/',pos:'v.'},
  {en:'breed',zh:'繁殖；品种',def:'All animals or plants of the same species or subspecies.',phonetic:'/bɹiːd/',pos:'n.'},
  {en:'brick',zh:'砖',def:'A hardened rectangular block of mud, clay etc., used for building.',phonetic:'/bɹɪk/',pos:'n.'},
  {en:'bride',zh:'新娘',def:'A woman in the context of her own wedding; one who is going to marry or has just been married.',phonetic:'/bɹaɪd/',pos:'n.'},
  {en:'broadcast',zh:'广播',def:'A transmission of a radio or television programme intended to be received by anyone with a receiver.',phonetic:'/ˈbɹɑdkæst/',pos:'n.'},
  {en:'budget',zh:'预算',def:'The amount of money or resources earmarked for a particular institution, activity or time-frame.',phonetic:'/ˈbʌdʒ.ɪt/',pos:'n.'},
  {en:'building',zh:'建筑物',def:'The act or process by which something is built; construction.',phonetic:'/ˈbɪl.dɪŋ/',pos:'n.'},
  {en:'bullet',zh:'子弹',def:'A projectile, usually of metal, shot from a gun at high speed.',phonetic:'/ˈbʊl.ɪt/',pos:'n.'},
  {en:'butcher',zh:'屠夫',def:'A person who prepares and sells meat (and sometimes also slaughters the animals).',phonetic:'/ˈbʊtʃ.ə(ɹ)/',pos:'n.'},
  {en:'buttock',zh:'臀部',def:'Either of the two rounded fleshy parts of the human body that form the bottom.',phonetic:'/ˈbʌtək/',pos:'n.'},
  {en:'buyer',zh:'买家',def:'A person who makes one or more purchases.',phonetic:'/ˈbaɪ.ə(ɹ)/',pos:'n.'},
  {en:'cabin',zh:'小木屋',def:'A small dwelling characteristic of the frontier, especially when built from logs with simple tools and not constructed by professional builders, but by those who meant to live in it.',phonetic:'/ˈkæbɪn/',pos:'n.'},
  {en:'cafe',zh:'咖啡馆',def:'A convenience store, originally one that sold coffee and similar basic items.',phonetic:'/ˈkæfeɪ/',pos:'n.'},
  {en:'cafeteria',zh:'自助餐厅',def:'A restaurant in which customers select their food at a counter then carry it on a tray to a table to eat',phonetic:'',pos:'n.'},
  {en:'calculate',zh:'计算',def:'To determine the value of something or the solution to something by a mathematical process.',phonetic:'/ˈkælkjəleɪt/',pos:'v.'},
  {en:'calm',zh:'平静的',def:'(in a person) The state of being calm; peacefulness; absence of worry, anger, fear or other strong negative emotion.',phonetic:'/kam/',pos:'adj.'},
  {en:'camping',zh:'露营',def:'To live in a tent or similar temporary accommodation.',phonetic:'/ˈkæmpɪŋ/',pos:'n.'},
  {en:'campsite',zh:'露营地',def:'A place where a tent may be or is pitched.',phonetic:'',pos:'n.'},
  {en:'campus',zh:'校园',def:'The grounds or property of a school, college, university, business, church, or hospital, often understood to include buildings and other structures.',phonetic:'/ˈkæmpəs/',pos:'n.'},
  {en:'cancer',zh:'癌症',def:'A disease in which the cells of a tissue undergo uncontrolled (and often rapid) proliferation.',phonetic:'/ˈkæːnsə/',pos:'n.'},
  {en:'candidate',zh:'候选人',def:'A person who is running in an election.',phonetic:'/ˈkæn.dɪdət/',pos:'n.'},
  {en:'capable',zh:'有能力的',def:'Able and efficient; having the ability needed for a specific task; having the disposition to do something; permitting or being susceptible to something.',phonetic:'/ˈkeɪpəbl̩/',pos:'adj.'},
  {en:'capture',zh:'捕获',def:'An act of capturing; a seizing by force or stratagem.',phonetic:'/ˈkæp.t͡ʃə/',pos:'v.'},
  {en:'card',zh:'卡片',def:'A playing card.',phonetic:'/kaːd/',pos:'n.'},
  {en:'cardigan',zh:'开衫毛衣',def:'A type of sweater or jumper that fastens up the front with buttons or a zipper, usually machine- or hand-knitted from wool.',phonetic:'/ˈkɑːdɪɡən/',pos:'n.'},
  {en:'careless',zh:'粗心的',def:'Not concerned or worried (about).',phonetic:'/ˈkɛələs/',pos:'adj.'},
  {en:'carpet',zh:'地毯',def:'A fabric used as a complete floor covering.',phonetic:'/ˈkɑː(ɹ)pɪt/',pos:'n.'},
  {en:'carsick',zh:'晕车的',def:'Dizzy or feeling nauseated due to riding in a vehicle; suffering from motion sickness.',phonetic:'',pos:'adj.'},
  {en:'cart',zh:'购物车',def:'A small, open, wheeled vehicle, drawn or pushed by a person or animal, more often used for transporting goods than passengers.',phonetic:'/kɑːt/',pos:'n.'},
  {en:'cartoon',zh:'卡通',def:'A humorous drawing, often with a caption, or a strip of such drawings.',phonetic:'/kɑːˈtuːn/',pos:'n.'},
  {en:'cash',zh:'现金',def:'Money in the form of notes/bills and coins, as opposed to cheques/checks or electronic transactions.',phonetic:'/kæʃ/',pos:'n.'},
  {en:'cast',zh:'投掷；石膏',def:'An act of throwing.',phonetic:'/kæst/',pos:'n.'},
  {en:'cathedral',zh:'大教堂',def:'Relating to the throne or the see of a bishop.',phonetic:'/kəˈθiː.dɹəl/',pos:'n.'},
  {en:'cattle',zh:'牛',def:'Domesticated bovine animals (cows, bulls, steers etc).',phonetic:'/ˈkæt(ə)l/',pos:'n.'},
  {en:'cave',zh:'洞穴',def:'A large, naturally-occurring cavity formed underground or in the face of a cliff or a hillside.',phonetic:'/keɪv/',pos:'n.'},
  {en:'ceiling',zh:'天花板',def:'To line or finish (a surface, such as a wall), with plaster, stucco, thin boards, or similar.',phonetic:'/ˈsiːlɪŋ/',pos:'n.'},
  {en:'celebrity',zh:'名人',def:'A rite or ceremony.',phonetic:'/sɪˈlɛbɹɪti/',pos:'n.'},
  {en:'cell',zh:'细胞',def:'A single-room dwelling for a hermit.',phonetic:'/sɛl/',pos:'n.'},
  {en:'cellphone',zh:'手机',def:'A portable, wireless telephone, which changes antenna connections seamlessly during travel from one radio reception cell to another without losing the party-to-party call connection.',phonetic:'/ˈsɛlfəʊn/',pos:'n.'},
  {en:'cent',zh:'分',def:'(money) A subunit of currency equal to one-hundredth of the main unit of currency in many countries. Symbol: ¢.',phonetic:'/sɛnt/',pos:'n.'},
  {en:'cereal',zh:'谷物；麦片',def:'A type of grass (such as wheat, rice or oats) cultivated for its edible grains.',phonetic:'[ˈsɪəɹiːəɫ]',pos:'n.'},
  {en:'ceremony',zh:'仪式',def:'A ritual, with religious or cultural significance.',phonetic:'/ˈsɛɹɪməni/',pos:'n.'},
  {en:'certificate',zh:'证书',def:'A document containing a certified statement.',phonetic:'',pos:'n.'},
  {en:'chain',zh:'链；连锁',def:'A series of interconnected rings or links usually made of metal.',phonetic:'/ˈt͡ʃeɪn/',pos:'n.'},
  {en:'chalk',zh:'粉笔',def:'A soft, white, powdery limestone.',phonetic:'/t͡ʃɔːk/',pos:'n.'},
  {en:'channel',zh:'频道',def:'The physical confine of a river or slough, consisting of a bed and banks.',phonetic:'/ˈtʃænəl/',pos:'n.'},
  {en:'chapter',zh:'章节',def:'(authorship) One of the main sections into which the text of a book is divided.',phonetic:'/ˈt͡ʃæptə/',pos:'n.'},
  {en:'charge',zh:'收费；充电',def:'The amount of money levied for a service.',phonetic:'/t͡ʃɑːd͡ʒ/',pos:'n.'},
  {en:'charity',zh:'慈善',def:'An organization, the objective of which is to carry out a charitable purpose.',phonetic:'/ˈtʃæɹɪti/',pos:'n.'},
  {en:'charm',zh:'魅力',def:'An object, act or words believed to have magic power (usually carries a positive connotation).',phonetic:'/tʃɑːm/',pos:'n.'},
  {en:'chart',zh:'图表',def:'A map.',phonetic:'/tʃɑːt/',pos:'n.'},
  {en:'chat',zh:'聊天',def:'Informal conversation.',phonetic:'/tʃæt/',pos:'n.'},
  {en:'cheat',zh:'欺骗',def:'To violate rules in order to gain advantage from a situation.',phonetic:'/tʃiːt/',pos:'v.'},
  {en:'check',zh:'检查',def:'A situation in which the king is directly threatened by an opposing piece.',phonetic:'/t͡ʃɛk/',pos:'v.'},
  {en:'cheek',zh:'脸颊',def:'The soft skin on each side of the face, below the eyes; the outer surface of the sides of the oral cavity.',phonetic:'/tʃiːk/',pos:'n.'},
  {en:'cheerful',zh:'开朗的',def:'Noticeably happy and optimistic.',phonetic:'/ˈt͡ʃɪəfəl/',pos:'adj.'},
  {en:'chef',zh:'厨师',def:'The presiding cook in the kitchen of a large household.',phonetic:'/ʃɛf/',pos:'n.'},
  {en:'chess',zh:'国际象棋',def:'A board game for two players with each beginning with sixteen chess pieces moving according to fixed rules across a chessboard with the objective to checkmate the opposing king.',phonetic:'/t͡ʃɛs/',pos:'n.'},
  {en:'chest',zh:'胸部',def:'A box, now usually a large strong box with a secure convex lid.',phonetic:'/t͡ʃɛst/',pos:'n.'},
  {en:'chief',zh:'首领',def:'A leader or head of a group of people, organisation, etc.',phonetic:'/tʃiːf/',pos:'n.'},
  {en:'childhood',zh:'童年',def:'The state of being a child.',phonetic:'/ˈtʃaɪldhʊd/',pos:'n.'},
  {en:'chili',zh:'辣椒',def:'The pungent, spicy fresh or dried fruit of any of several cultivated varieties of capsicum peppers, used in cooking.',phonetic:'/ˈt͡ʃɪli/',pos:'n.'},
  {en:'chin',zh:'下巴',def:'The bottom of a face, (specifically) the typically jutting jawline below the mouth.',phonetic:'/tʃɪn/',pos:'n.'},
  {en:'chop',zh:'切；砍',def:'A cut of meat, often containing a section of a rib.',phonetic:'/tʃɒp/',pos:'v.'},
  {en:'chopsticks',zh:'筷子',def:'A particular East Asian eating utensil, used in pairs and held in the hand. The utensil is a stick, usually made of wood and measuring approximately 23cm (10 inches) in length.',phonetic:'',pos:'n.'},
  {en:'chubby',zh:'胖乎乎的',def:'A chubby, plump person',phonetic:'/ˈtʃʌbi/',pos:'adj.'},
  {en:'church',zh:'教堂',def:'A Christian house of worship; a building where Christian religious services take place.',phonetic:'/t͡ʃɜːt͡ʃ/',pos:'n.'},
  {en:'cinema',zh:'电影院',def:'A movie theatre, a movie house',phonetic:'/ˈsɪn.ɪ.mɑː/',pos:'n.'},
  {en:'circus',zh:'马戏团',def:'A traveling company of performers that may include acrobats, clowns, trained animals, and other novelty acts, that gives shows usually in a circular tent.',phonetic:'/ˈsɜːkəs/',pos:'n.'},
  {en:'classmate',zh:'同班同学',def:'A student who is in the same class at school.',phonetic:'/ˈklɑːs.meɪt/',pos:'n.'},
  {en:'claw',zh:'爪子',def:'A curved, pointed horny nail on each digit of the foot of a mammal, reptile, or bird.',phonetic:'/klɔː/',pos:'n.'},
  {en:'cleaner',zh:'清洁剂',def:'A person whose occupation is to clean floors, windows and other things.',phonetic:'/ˈkliː.nə/',pos:'n.'},
  {en:'click',zh:'点击',def:'A brief, sharp, not particularly loud, relatively high-pitched sound produced by the impact of something small and hard against something hard, such as by the operation of a switch, a lock or a latch, or a finger pressed against the thumb and then released to strike the hand.',phonetic:'/klɪk/',pos:'n.'},
  {en:'client',zh:'客户',def:'A customer, a buyer or receiver of goods or services.',phonetic:'/ˈklʌɪənt/',pos:'n.'},
  {en:'cliff',zh:'悬崖',def:'A vertical (or nearly vertical) rock face.',phonetic:'/klɪf/',pos:'n.'},
  {en:'climbing',zh:'攀登',def:'To ascend; rise; to go up.',phonetic:'/ˈklaɪ̯mɪŋ/',pos:'n.'},
  {en:'clinic',zh:'诊所',def:'A medical facility, such as a hospital, especially one for the treatment and diagnosis of outpatients.',phonetic:'/ˈklɪnɪk/',pos:'n.'},
  {en:'closed',zh:'关闭的',def:'(physical) To remove a gap.',phonetic:'/kləʊzd/',pos:'adj.'},
  {en:'closet',zh:'衣柜',def:'Any private area, (particularly) bowers in the open air.',phonetic:'/ˈklɒzɪt/',pos:'n.'},
  {en:'clothing',zh:'衣服',def:'To adorn or cover with clothing; to dress; to supply clothes or clothing.',phonetic:'/ˈkləʊðɪŋ/',pos:'n.'},
  {en:'club',zh:'俱乐部',def:'An association of members joining together for some common purpose, especially sports or recreation.',phonetic:'/klʌb/',pos:'n.'},
  {en:'clue',zh:'线索',def:'A strand of yarn etc. as used to guide one through a labyrinth; something which points the way, a guide.',phonetic:'/kluː/',pos:'n.'},
  {en:'coach',zh:'教练',def:'A wheeled vehicle, generally drawn by horse power.',phonetic:'/kəʊtʃ/',pos:'n.'},
  {en:'coast',zh:'海岸',def:'The edge of the land where it meets an ocean, sea, gulf, bay, or large lake.',phonetic:'/kəʊst/',pos:'n.'},
  {en:'coat',zh:'外套',def:'An outer garment covering the upper torso and arms.Wp',phonetic:'/kəʊt/',pos:'n.'},
  {en:'code',zh:'代码',def:'A short symbol, often with little relation to the item it represents.',phonetic:'/kəʊd/',pos:'n.'},
  {en:'coffin',zh:'棺材',def:'A rectangular closed box in which the body of a dead person is placed for burial.',phonetic:'/ˈkɑfɪn/',pos:'n.'},
  {en:'column',zh:'柱子；专栏',def:'A solid upright structure designed usually to support a larger structure above it, such as a roof or horizontal beam, but sometimes for decoration.',phonetic:'/ˈkɑljəm/',pos:'n.'},
  {en:'comedy',zh:'喜剧',def:'A choric song of celebration or revel, especially in Ancient Greece.',phonetic:'/ˈkɒmədi/',pos:'n.'},
  {en:'comfort',zh:'舒适',def:'Contentment, ease.',phonetic:'/ˈkʊm.fət/',pos:'n.'},
  {en:'comic',zh:'漫画',def:'A comedian.',phonetic:'/ˈkɒmɪk/',pos:'n.'},
  {en:'command',zh:'命令',def:'An order to do something.',phonetic:'/kəˈmɑːnd/',pos:'n.'},
  {en:'commercial',zh:'商业的；广告',def:'An advertisement in a common media format, usually radio or television.',phonetic:'/kəˈmɜːʃəl/',pos:'n.'},
  {en:'commit',zh:'犯（罪）',def:'The act of committing (e.g. a database transaction or source code into a source control repository), making it a permanent change.',phonetic:'/kəˈmɪt/',pos:'v.'},
  {en:'committee',zh:'委员会',def:'A body of one or more persons convened for the accomplishment of some specific purpose, typically with formal protocols.',phonetic:'',pos:'n.'},
  {en:'compass',zh:'指南针',def:'A magnetic or electronic device used to determine the cardinal directions (usually magnetic or true north).',phonetic:'/ˈkʌm.pəs/',pos:'n.'},
  {en:'computer',zh:'电脑',def:'A person employed to perform computations; one who computes.',phonetic:'/kəmˈpjuːtə/',pos:'n.'},
  {en:'concern',zh:'关心',def:'That which affects one’s welfare or happiness. A matter of interest to someone. The adposition before the matter of interest is usually over, about or for.',phonetic:'/kənˈsɜːn/',pos:'n.'},
  {en:'concrete',zh:'混凝土',def:'A solid mass formed by the coalescence of separate particles; a compound substance, a concretion.',phonetic:'/kɵnˈkɹiːt/',pos:'n.'},
  {en:'condo',zh:'公寓',def:'Joint sovereignty over a territory by two or more countries.',phonetic:'/ˈkɒndəʊ/',pos:'n.'},
  {en:'confidence',zh:'信心',def:'Self-assurance.',phonetic:'/ˈkɒnfɪdəns/',pos:'n.'},
  {en:'congratulations',zh:'祝贺',def:'The act of congratulating.',phonetic:'/kənˌɡɹad͡ʒəˈleɪʃ(ə)nz/',pos:'n.'},
  {en:'connection',zh:'连接',def:'The act of connecting.',phonetic:'/kəˈnɛkʃən/',pos:'n.'},
  {en:'construction',zh:'建筑',def:'The process of constructing.',phonetic:'/kənˈstɹʌkʃən/',pos:'n.'},
  {en:'content',zh:'内容；满足的',def:'(except in phrases) Satisfaction, contentment; pleasure.',phonetic:'/kənˈtɛnt/',pos:'n.'},
  {en:'continent',zh:'大陆',def:'Each of the main continuous land-masses on the earth\'s surface, now generally regarded as seven in number, including their related islands, continental shelves etc.',phonetic:'/ˈkɒntɪnənt/',pos:'n.'},
  {en:'contract',zh:'合同',def:'An agreement between two or more parties, to perform a specific job or work order, often temporary or of fixed duration and usually governed by a written agreement.',phonetic:'/ˈkɒntɹækt/',pos:'n.'},
  {en:'cookie',zh:'饼干',def:'A small, flat, baked good which is either crisp or soft but firm.',phonetic:'/ˈkuːki/',pos:'n.'},
  {en:'cooking',zh:'烹饪',def:'To prepare (food) for eating by heating it, often by combining it with other ingredients.',phonetic:'/ˈkʊ.kɪŋ/',pos:'n.'},
  {en:'coral',zh:'珊瑚',def:'A hard substance made of the limestone skeletons of marine polyps.',phonetic:'/ˈkɒɹəl/',pos:'n.'},
  {en:'corner',zh:'角落',def:'The point where two converging lines meet; an angle, either external or internal.',phonetic:'/ˈkɔːnə(ɹ)/',pos:'n.'},
  {en:'costume',zh:'服装',def:'A style of dress, including garments, accessories and hairstyle, especially as characteristic of a particular country, period or people.',phonetic:'/ˈkɒs.tjuːm/',pos:'n.'},
  {en:'cottage',zh:'小屋',def:'A small house.',phonetic:'/ˈkɒtɪdʒ/',pos:'n.'},
  {en:'cotton',zh:'棉花',def:'Gossypium, a genus of plant used as a source of cotton fiber.',phonetic:'/ˈkɒt.n̩/',pos:'n.'},
  {en:'couch',zh:'沙发',def:'Couch grass, a species of persistent grass, Elymus repens, usually considered a weed.',phonetic:'/kaʊtʃ/',pos:'n.'},
  {en:'council',zh:'委员会',def:'A committee that leads or governs (e.g. city council, student council).',phonetic:'/ˈkaʊn.səl/',pos:'n.'},
  {en:'counter',zh:'柜台',def:'One who counts',phonetic:'/ˈkaʊntə/',pos:'n.'},
  {en:'countryside',zh:'乡村',def:'A rural area, or the rural part of a larger area.',phonetic:'/ˈkʌn.tɹiˌsaɪd/',pos:'n.'},
  {en:'couple',zh:'一对；夫妇',def:'Two partners in a romantic or sexual relationship.',phonetic:'/ˈkʌpəl/',pos:'n.'},
  {en:'course',zh:'课程',def:'A series of lessons or lectures in a particular subject or area.',phonetic:'/kɔːs/',pos:'n.'},
  {en:'crab',zh:'螃蟹',def:'A crustacean of the infraorder Brachyura, having five pairs of legs, the foremost of which are in the form of claws, and a carapace.',phonetic:'/kɹæb/',pos:'n.'},
  {en:'cracker',zh:'饼干',def:'A dry, thin, crispy baked bread (usually salty or savoury, but sometimes sweet, as in the case of graham crackers and animal crackers).',phonetic:'/ˈkɹækə(ɹ)/',pos:'n.'},
  {en:'craft',zh:'工艺',def:'Strength; power; might; force .',phonetic:'/kɹɑːft/',pos:'n.'},
  {en:'crash',zh:'碰撞',def:'A sudden, intense, loud sound, as made for example by cymbals.',phonetic:'/kɹæʃ/',pos:'n.'},
  {en:'crawl',zh:'爬行',def:'The act of moving slowly on hands and knees etc, or with frequent stops.',phonetic:'/kɹɔl/',pos:'v.'},
  {en:'crayon',zh:'蜡笔',def:'A stick of colored chalk or wax used for drawing.',phonetic:'/ˈkɹeɪ.ɒ̃/',pos:'n.'},
  {en:'cream',zh:'奶油',def:'The butterfat/milkfat part of milk which rises to the top; this part when separated from the remainder.',phonetic:'/kɹiːm/',pos:'n.'},
  {en:'creative',zh:'有创造力的',def:'A person directly involved in a creative marketing process.',phonetic:'/kɹiˈeɪtɪv/',pos:'adj.'},
  {en:'creativity',zh:'创造力',def:'The ability to use imagination to produce a novel idea or product that is useful to society.',phonetic:'/kɹieɪˈtɪvɪti/',pos:'n.'},
  {en:'creature',zh:'生物',def:'A living being; an animal or (sometimes derogatory) a human.',phonetic:'/ˈkɹiːt͡ʃə/',pos:'n.'},
  {en:'creed',zh:'信条',def:'That which is believed; accepted doctrine, especially religious doctrine; a particular set of beliefs; any summary of principles or opinions professed or adhered to.',phonetic:'/kɹiːd/',pos:'n.'},
  {en:'creepy',zh:'令人毛骨悚然的',def:'Moving by creeping along.',phonetic:'/ˈkɹiːpi/',pos:'adj.'},
  {en:'crescent',zh:'新月',def:'The figure of the moon as it appears in its first or last quarter, with concave and convex edges terminating in points.',phonetic:'/ˈkɹɛ.sənt/',pos:'n.'},
  {en:'crew',zh:'船员',def:'To make the shrill sound characteristic of a rooster; to make a sound in this manner, either in gaiety, joy, pleasure, or defiance.',phonetic:'',pos:'n.'},
  {en:'crime',zh:'犯罪',def:'A specific act committed in violation of the law.',phonetic:'/kɹaɪm/',pos:'n.'},
  {en:'criminal',zh:'罪犯',def:'A person who is guilty of a crime, notably breaking the law.',phonetic:'/ˈkɹɪmənəl/',pos:'n.'},
  {en:'crisis',zh:'危机',def:'A crucial or decisive point or situation; a turning point.',phonetic:'/ˈkɹaɪsɪs/',pos:'n.'},
  {en:'cruel',zh:'残忍的',def:'To spoil or ruin (one\'s chance of success)',phonetic:'/kɹuː(ə)l/',pos:'adj.'},
  {en:'cruise',zh:'巡航',def:'A sea or lake voyage, especially one taken for pleasure.',phonetic:'/kɹuːz/',pos:'n.'},
  {en:'cup',zh:'杯子',def:'A concave vessel for drinking from, usually made of opaque material (as opposed to a glass) and with a handle.',phonetic:'/kʌp/',pos:'n.'},
  {en:'cupboard',zh:'橱柜',def:'A board or table used to openly hold and display silver plate and other dishware; a sideboard; a buffet.',phonetic:'/ˈkʌbəd/',pos:'n.'},
  {en:'currency',zh:'货币',def:'Money or other items used to facilitate transactions.',phonetic:'/ˈkʌɹ.ən.si/',pos:'n.'},
  {en:'current',zh:'当前的；电流',def:'The generally unidirectional movement of a gas or fluid.',phonetic:'/ˈkʌɹənt/',pos:'n.'},
  {en:'curriculum',zh:'课程',def:'The set of courses, coursework, and their content, offered at a school or university.',phonetic:'/kəˈɹɪk.jə.ləm/',pos:'n.'},
  {en:'curse',zh:'诅咒',def:'A supernatural detriment or hindrance; a bane.',phonetic:'/kɜːs/',pos:'n.'},
  {en:'curtain',zh:'窗帘',def:'A piece of cloth covering a window, bed, etc. to offer privacy and keep out light.',phonetic:'/ˈkɜːtn̩/',pos:'n.'},
  {en:'cushion',zh:'垫子',def:'A soft mass of material stuffed into a cloth bag, used for comfort or support; for sitting on, kneeling on, resting one\'s head on etc.',phonetic:'/ˈkʊʃən/',pos:'n.'},
  {en:'cycle',zh:'循环',def:'An interval of space or time in which one set of events or phenomena is completed.',phonetic:'/ˈsaɪkəl/',pos:'n.'},
  {en:'dancer',zh:'舞者',def:'A person who dances, usually as a job or profession.',phonetic:'/ˈdæns.ə(ɹ)/',pos:'n.'},
  {en:'data',zh:'数据',def:'(plural: data) A measurement of something on a scale understood by both the recorder (a person or device) and the reader (another person or device). The scale is arbitrarily defined, such as from 1 to 10 by ones, 1 to 100 by 0.1, or simply true or false, on or off, yes, no, or maybe, etc.',phonetic:'/ˈdaetə/',pos:'n.'},
  {en:'dead',zh:'死的',def:'(with "the", a demonstrative, or a possessive) Those who have died.',phonetic:'/diːd/',pos:'adj.'},
  {en:'deaf',zh:'聋的',def:'A deaf person.',phonetic:'/diːf/',pos:'adj.'},
  {en:'death',zh:'死亡',def:'The cessation of life and all associated processes; the end of an organism\'s existence as an entity independent from its environment and its return to an inert, nonliving state.',phonetic:'/diːθ/',pos:'n.'},
  {en:'debt',zh:'债务',def:'An action, state of mind, or object one has an obligation to perform for another, adopt toward another, or give to another.',phonetic:'/dɛt/',pos:'n.'},
  {en:'decoration',zh:'装饰',def:'The act of adorning, embellishing, or honoring; ornamentation.',phonetic:'/ˌdɛkəˈɹeɪʃən/',pos:'n.'},
  {en:'degree',zh:'学位；程度',def:'A stage of proficiency or qualification in a course of study, now especially an award bestowed by a university or, in some countries, a college, as a certification of academic achievement. (In the United States, can include secondary schools.)',phonetic:'/dɪˈɡɹiː/',pos:'n.'},
  {en:'deliberate',zh:'故意的',def:'To consider carefully; to weigh well in the mind.',phonetic:'',pos:'adj.'},
  {en:'delight',zh:'高兴',def:'Joy; pleasure.',phonetic:'/dəˈlaɪt/',pos:'n.'},
  {en:'demand',zh:'要求',def:'The desire to purchase goods and services.',phonetic:'/dɪˈmɑːnd/',pos:'n.'},
  {en:'democracy',zh:'民主',def:'Rule by the people, especially as a form of government; either directly or through elected representatives (representative democracy).',phonetic:'/dɪˈmɒkɹəsi/',pos:'n.'},
  {en:'denim',zh:'牛仔布',def:'A textile often made of cotton with a distinct diagonal pattern.',phonetic:'/ˈdɛnɪm/',pos:'n.'},
  {en:'dentist',zh:'牙医',def:'A medical doctor who specializes in dentistry.',phonetic:'/ˈdɛntɪst/',pos:'n.'},
  {en:'deny',zh:'否认',def:'To disallow or reject.',phonetic:'/dɪˈnaɪ/',pos:'v.'},
  {en:'depart',zh:'离开',def:'Division; separation, as of compound substances.',phonetic:'/dɪˈpɑːt/',pos:'v.'},
  {en:'department',zh:'部门',def:'A part, portion, or subdivision.',phonetic:'/dɪˈpɑːtm(ə)nt/',pos:'n.'},
  {en:'deposit',zh:'存款',def:'Sediment or rock that is not native to its present location or is different from the surrounding material. Sometimes refers to ore or gems.',phonetic:'/dɪˈpɒzɪt/',pos:'noun'},
  {en:'depressed',zh:'沮丧的',def:'To press down.',phonetic:'/dɪˈpɹɛst/',pos:'adj.'},
  {en:'depression',zh:'抑郁',def:'In psychotherapy and psychiatry, a state of mind producing serious, long-term lowering of enjoyment of life or inability to visualize a happy future.',phonetic:'/dɪˈpɹɛʃən/',pos:'n.'},
  {en:'designer',zh:'设计师',def:'A person who designs something, or who designs things as a profession.',phonetic:'/dɪˈzaɪnɚ/',pos:'n.'},
  {en:'desire',zh:'渴望',def:'Someone or something wished for.',phonetic:'/dɪˈzaɪə/',pos:'noun'},
  {en:'dessert',zh:'甜点',def:'A sweet confection served as the last course of a meal',phonetic:'/dɪˈzɜːt/',pos:'n.'},
  {en:'destination',zh:'目的地',def:'The act of destining or appointing.',phonetic:'/dɛstɪˈneɪʃən/',pos:'n.'},
  {en:'detail',zh:'细节',def:'Something small enough to escape casual notice.',phonetic:'/ˈdiːteɪl/',pos:'n.'},
  {en:'development',zh:'发展',def:'The process of developing; growth, directed change.',phonetic:'/dɪˈvɛləpmənt/',pos:'n.'},
  {en:'device',zh:'设备',def:'Any piece of equipment made for a particular purpose, especially a mechanical or electrical one.',phonetic:'/dəˈvaɪs/',pos:'n.'},
  {en:'diary',zh:'日记',def:'A daily log of experiences, especially those of the writer.',phonetic:'/ˈdaɪəɹi/',pos:'n.'},
  {en:'difficulty',zh:'困难',def:'The state of being difficult, or hard to do.',phonetic:'/ˈdɪfɪkəlti/',pos:'n.'},
  {en:'digital',zh:'数字的',def:'A digital option.',phonetic:'/ˈdɪd͡ʒɪtəɫ/',pos:'adj.'},
  {en:'diploma',zh:'文凭',def:'A document issued by an educational institution testifying that the recipient has earned a degree or has successfully completed a particular course of study.',phonetic:'/dɪˈpləʊmə/',pos:'n.'},
  {en:'direction',zh:'方向',def:'A theoretical line (physically or mentally) followed from a point of origin or towards a destination. May be relative (e.g. up, left, outbound, dorsal), geographical (e.g. north), rotational (e.g. clockwise), or with respect to an object or location (e.g. toward Boston).',phonetic:'/d(a)ɪˈɹɛk.ʃən/',pos:'n.'},
  {en:'dirt',zh:'泥土',def:'Soil or earth.',phonetic:'/dɜːt/',pos:'n.'},
  {en:'disabled',zh:'残疾的',def:'To render unable; to take away an ability of, as by crippling.',phonetic:'[dɪsˈeɪbəɫd]',pos:'adj.'},
  {en:'disappoint',zh:'使失望',def:'To sadden or displease (someone) by underperforming, or by not delivering something promised or hoped for.',phonetic:'/dɪsəˈpɔɪnt/',pos:'v.'},
  {en:'disaster',zh:'灾难',def:'A sudden event causing great damage or loss of life.',phonetic:'/dɪˈzɑːstə/',pos:'n.'},
  {en:'discount',zh:'折扣',def:'A reduction in price.',phonetic:'/dɪsˈkaʊnt/',pos:'noun'},
  {en:'disk',zh:'磁盘',def:'A thin, flat, circular plate or similar object.',phonetic:'/dɪsk/',pos:'n.'},
  {en:'disorder',zh:'紊乱',def:'Absence of order; state of not being arranged in an orderly manner.',phonetic:'/dɪsˈɔːdə(ɹ)/',pos:'n.'},
  {en:'display',zh:'显示',def:'A show or spectacle.',phonetic:'/dɪsˈpleɪ/',pos:'noun'},
  {en:'district',zh:'地区',def:'An administrative division of an area.',phonetic:'/ˈdɪstɹɪkt/',pos:'n.'},
  {en:'division',zh:'除法',def:'The act or process of dividing anything.',phonetic:'/dɪˈvɪʒən/',pos:'n.'},
  {en:'divorce',zh:'离婚',def:'The legal dissolution of a marriage.',phonetic:'/dɪˈvɔːs/',pos:'noun'},
  {en:'doctor',zh:'医生',def:'A physician; a member of the medical profession; one who is trained and licensed to heal the sick or injured. The final examination and qualification may award a doctor degree in which case the post-nominal letters are D.O., DPM, M.D., DMD, DDS, in the US or MBBS in the UK.',phonetic:'/ˈdɒktə/',pos:'n.'},
  {en:'document',zh:'文件',def:'An original or official paper used as the basis, proof, or support of anything else, including any writing, book, or other instrument conveying information pertinent to such proof or support.',phonetic:'/ˈdɒkjʊmənt/',pos:'n.'},
  {en:'domestic',zh:'国内的',def:'A house servant; a maid; a household worker.',phonetic:'/dəˈmɛstɪk/',pos:'adj.'},
  {en:'dose',zh:'剂量',def:'A measured quantity of a medicine or drug taken at one time.',phonetic:'/dəʊs/',pos:'n.'},
  {en:'dot',zh:'点',def:'A small, round spot.',phonetic:'',pos:'n.'},
  {en:'doubt',zh:'怀疑',def:'Disbelief or uncertainty (about something); a particular instance of such disbelief or uncertainty.',phonetic:'/dʌʊt/',pos:'noun'},
  {en:'download',zh:'下载',def:'A file transfer to the local computer.',phonetic:'/ˈdaʊnˌləʊd/',pos:'noun'},
  {en:'downstairs',zh:'在楼下',def:'The lower floor of a house, at ground level.',phonetic:'/daʊnˈstɛəz/',pos:'adv.'},
  {en:'downtown',zh:'市中心',def:'The main business part of a city or town, usually located at or near its center.',phonetic:'',pos:'n.'},
  {en:'dozen',zh:'一打',def:'A set of twelve.',phonetic:'/ˈdʌzən/',pos:'n.'},
  {en:'draft',zh:'草稿',def:'A current of air, usually coming into a room or vehicle.',phonetic:'/dɹæft/',pos:'n.'},
  {en:'dramatic',zh:'戏剧性的',def:'Of or relating to the drama.',phonetic:'/dɹəˈmætɪk/',pos:'adj.'},
  {en:'drawer',zh:'抽屉',def:'An open-topped box that can be slid in and out of the cabinet that contains it, used for storing clothing or other articles.',phonetic:'/dɹɔː(ɹ)/',pos:'n.'},
  {en:'dress',zh:'连衣裙；穿衣',def:'An item of clothing (usually worn by a woman or young girl) which both covers the upper part of the body and includes skirts below the waist.',phonetic:'/dɹɛs/',pos:'n.'},
  {en:'dresser',zh:'梳妆台',def:'An item of kitchen furniture, like a cabinet with shelves, for storing crockery or utensils.',phonetic:'/ˈdɹɛsə/',pos:'n.'},
  {en:'drug',zh:'药物',def:'A substance used to treat an illness, relieve a symptom, or modify a chemical process in the body for a specific purpose.',phonetic:'/dɹʌɡ/',pos:'n.'},
  {en:'drum',zh:'鼓',def:'A percussive musical instrument spanned with a thin covering on at least one end for striking, forming an acoustic chamber, affecting what materials are used to make it; a membranophone.',phonetic:'/ˈdɹʌm/',pos:'n.'},
  {en:'dust',zh:'灰尘',def:'Fine particles',phonetic:'/dʌst/',pos:'n.'},
  {en:'earn',zh:'赚取',def:'To gain (success, reward, recognition) through applied effort or work.',phonetic:'/ɜːn/',pos:'v.'},
  {en:'earring',zh:'耳环',def:'A piece of jewelry worn on the ear.',phonetic:'/ˈɪəɹɪŋ/',pos:'n.'},
  {en:'ease',zh:'减轻；舒适',def:'Ability, the means to do something, particularly:',phonetic:'/iːz/',pos:'n.'},
  {en:'eastern',zh:'东方的',def:'Of, facing, situated in, or related to the east.',phonetic:'/ˈiːstən/',pos:'adj.'},
  {en:'economic',zh:'经济的',def:'Pertaining to an economy.',phonetic:'/ˌiːkəˈnɒmɪk/',pos:'adj.'},
  {en:'economy',zh:'经济',def:'Effective management of a community or system, or especially its resources.',phonetic:'/iːˈkɒn.ə.mi/',pos:'n.'},
  {en:'edition',zh:'版本',def:'A written work edited and published, as by a certain editor or in a certain manner.',phonetic:'/əˈdɪʃən/',pos:'n.'},
  {en:'editor',zh:'编辑',def:'A person who edits or makes changes to documents.',phonetic:'/ˈɛdɪtə/',pos:'n.'},
  {en:'educate',zh:'教育',def:'To instruct or train',phonetic:'/ˈedʒɘkæet/',pos:'v.'},
  {en:'educational',zh:'教育的',def:'A free (or low cost) trip for travel consultants, provided by a travel operator or airline as a means of promoting their service. A fam trip',phonetic:'/ˌɛdʒʊˈkeɪʃənəl/',pos:'adj.'},
  {en:'election',zh:'选举',def:'A process of choosing a leader, members of parliament, councillors or other representatives by popular vote.',phonetic:'/ɪˈlɛkʃ(ə)n/',pos:'n.'},
  {en:'electric',zh:'电的',def:'(usually with definite article) Electricity; the electricity supply.',phonetic:'/əˈlɛktɹɪk/',pos:'adj.'},
  {en:'elegant',zh:'优雅的',def:'Characterised by or exhibiting elegance.',phonetic:'/ˈɛl.ə.ɡənt/',pos:'adj.'},
  {en:'elementary',zh:'初级的',def:'An elementary school',phonetic:'/(ˌ)ɛlɪ̈ˈmɛnt(ə)ɹɪ/',pos:'adj.'},
  {en:'elevator',zh:'电梯',def:'Anything that raises or uplifts.',phonetic:'/ˈɛl.ə.veɪ.tɚ/',pos:'n.'},
  {en:'else',zh:'其他',def:'(used only with indefinite or interrogative pronouns) Other; in addition to previously mentioned items.',phonetic:'/ɛls/',pos:'adv.'},
  {en:'embarrassed',zh:'尴尬的',def:'To humiliate; to disrupt somebody\'s composure or comfort with acting publicly or freely; to disconcert; to abash',phonetic:'/ɪmˈbæɹ.əst/',pos:'adj.'},
  {en:'emotion',zh:'情绪',def:'A person\'s internal state of being and involuntary physiological response to an object or a situation, based on or tied to physical state and sensory data.',phonetic:'/iˈmoʊʃən/',pos:'n.'},
  {en:'emotional',zh:'情绪的',def:'Of or relating to the emotions.',phonetic:'/ɪˈməʊʃnəl/',pos:'adj.'},
  {en:'employ',zh:'雇用',def:'The state of being an employee; employment.',phonetic:'/ɛmˈplɔɪ/',pos:'v.'},
  {en:'employer',zh:'雇主',def:'A person, firm or other entity which pays for or hires the services of another person.',phonetic:'/ɛmplɔɪˈə/',pos:'n.'},
  {en:'engagement',zh:'订婚；约会',def:'An appointment, especially to speak or perform.',phonetic:'/ɪnˈɡeɪd͡ʒ.mənt/',pos:'n.'},
  {en:'enjoyable',zh:'愉快的',def:'Pleasant, capable of giving pleasure.',phonetic:'/ɛnˈdʒɔɪ.jə.bəl/',pos:'adj.'},
  {en:'entire',zh:'整个的',def:'The whole of something; the entirety.',phonetic:'/ənˈtaɪə/',pos:'adj.'},
  {en:'entrance',zh:'入口',def:'The action of entering, or going in.',phonetic:'/ˈɛn.tɹəns/',pos:'n.'},
  {en:'entry',zh:'进入；条目',def:'The act of entering.',phonetic:'/ˈɛntɹi/',pos:'n.'},
  {en:'envelope',zh:'信封',def:'A paper or cardboard wrapper used to enclose small, flat items, especially letters, for mailing.',phonetic:'/ˈɒn.və.ləʊp/',pos:'n.'},
  {en:'envy',zh:'嫉妒',def:'Resentful desire of something possessed by another or others (but not limited to material possessions).',phonetic:'/ˈɛnvi/',pos:'n.'},
  {en:'episode',zh:'集；片段',def:'An incident, action, or time period standing out by itself, but more or less connected with a complete series of events.',phonetic:'/ˈɛpɪsəʊd/',pos:'n.'},
  {en:'equation',zh:'方程',def:'The act or process of equating two or more things, or the state of those things being equal (that is, identical).',phonetic:'/ɪˈkweɪʃən/',pos:'n.'},
  {en:'equipment',zh:'设备',def:'The act of equipping, or the state of being equipped, as for a voyage or expedition.',phonetic:'/ɪˈkwɪpmənt/',pos:'n.'},
  {en:'eraser',zh:'橡皮擦',def:'One who erases.',phonetic:'/ɪˈɹeɪzə/',pos:'n.'},
  {en:'error',zh:'错误',def:'The state, quality, or condition of being wrong.',phonetic:'/ˈɛɹə(ɹ)/',pos:'n.'},
  {en:'esteem',zh:'尊重',def:'Favourable regard.',phonetic:'[ɛsˈtiːm]',pos:'n.'},
  {en:'even',zh:'甚至',def:'(diminutive) An even number.',phonetic:'/ˈiːvən/',pos:'noun'},
  {en:'examination',zh:'考试',def:'The act of examining.',phonetic:'/ɪɡˌzæmɪˈneɪʃən/',pos:'n.'},
  {en:'excitement',zh:'兴奋',def:'The state of being excited (emotionally aroused).',phonetic:'/ɪkˈsaɪtmənt/',pos:'n.'},
  {en:'exit',zh:'出口',def:'An act of going out or going away, or leaving; a departure.',phonetic:'/ˈɛksɪt/',pos:'n.'},
  {en:'expedition',zh:'探险',def:'The act of expediting something; prompt execution.',phonetic:'/ɛkspəˈdɪʃən/',pos:'n.'},
  {en:'expert',zh:'专家',def:'A person with extensive knowledge or ability in a given subject.',phonetic:'/ˈɛkspəːt/',pos:'n.'},
  {en:'explanation',zh:'解释',def:'The act or process of explaining.',phonetic:'/ˌɛkspləˈneɪʃən/',pos:'n.'},
  {en:'expression',zh:'表达',def:'The action of expressing thoughts, ideas, feelings, etc.',phonetic:'/ɪkˈspɹɛʃ.ən/',pos:'n.'},
  {en:'extinct',zh:'灭绝的',def:'To make extinct; to extinguish or annihilate.',phonetic:'/ɛkˈstɪŋkt/',pos:'adj.'},
  {en:'extraordinary',zh:'非凡的',def:'Anything that goes beyond what is ordinary.',phonetic:'/ɪksˈtɹɔː(ɹ)dɪnəɹi/',pos:'adj.'},
  {en:'extreme',zh:'极端的',def:'The greatest or utmost point, degree or condition.',phonetic:'/ɛkˈstɹiːm/',pos:'adj.'},
  {en:'facility',zh:'设施',def:'The fact of being easy, or easily done; absence of difficulty, simplicity.',phonetic:'/fəˈsɪlɪti/',pos:'n.'},
  {en:'faint',zh:'微弱的；昏倒',def:'The act of fainting, syncope.',phonetic:'/feɪnt/',pos:'noun'},
  {en:'fairy',zh:'仙女',def:'The realm of faerie; enchantment, illusion.',phonetic:'/ˈfɛə̯ɹi/',pos:'n.'},
  {en:'faith',zh:'信仰',def:'A trust or confidence in the intentions or abilities of a person, object, or ideal from prior empirical evidence.',phonetic:'/feɪθ/',pos:'n.'},
  {en:'fame',zh:'名声',def:'What is said or reported; gossip, rumour.',phonetic:'/feɪm/',pos:'n.'},
  {en:'fare',zh:'费用',def:'A going; journey; travel; voyage; course; passage.',phonetic:'/fɛə(ɹ)/',pos:'n.'},
  {en:'fashionable',zh:'时尚的',def:'A fashionable person; a fop',phonetic:'/ˈfæʃənəbl̩/',pos:'adj.'},
  {en:'fatherinlaw',zh:'岳父；公公',def:'The father of one\'s spouse.',phonetic:'',pos:'n.'},
  {en:'faucet',zh:'水龙头',def:'A device for controlling the flow of liquid from a pipe.',phonetic:'/ˈfɔːsɪt/',pos:'n.'},
  {en:'feather',zh:'羽毛',def:'A branching, hair-like structure that grows on the bodies of birds, used for flight, swimming, protection and display.',phonetic:'/ˈfɛð.ə(ɹ)/',pos:'n.'},
  {en:'feature',zh:'特征',def:'One\'s structure or make-up: form, shape, bodily proportions.',phonetic:'/ˈfiːtʃə/',pos:'n.'},
  {en:'federal',zh:'联邦的',def:'A law-enforcement official of the FBI; a federal agent.',phonetic:'/ˈfɛdəɹəl/',pos:'adj.'},
  {en:'fee',zh:'费用',def:'(feudal law) A right to the use of a superior\'s land, as a stipend for services to be performed; also, the land so held; a fief.',phonetic:'/fiː/',pos:'n.'},
  {en:'feeling',zh:'感觉',def:'(heading) To use or experience the sense of touch.',phonetic:'/ˈfiːlɪŋ/',pos:'n.'},
  {en:'fence',zh:'围栏',def:'A thin artificial barrier that separates two pieces of land or a house perimeter.',phonetic:'/fɛns/',pos:'n.'},
  {en:'fever',zh:'发烧',def:'A higher than normal body temperature of a person (or, generally, a mammal), usually caused by disease.',phonetic:'/ˈfiːvə/',pos:'n.'},
  {en:'fiction',zh:'小说',def:'Literary type using invented or imaginative writing, instead of real facts, usually written as prose.',phonetic:'/ˈfɪk.ʃən/',pos:'n.'},
  {en:'file',zh:'文件',def:'A collection of papers collated and archived together.',phonetic:'/faɪl/',pos:'n.'},
  {en:'film',zh:'电影',def:'A thin layer of some substance; a pellicle; a membranous covering, causing opacity.',phonetic:'[ˈfɪlm̩]',pos:'n.'},
  {en:'final',zh:'最后的',def:'A final examination; a test or examination given at the end of a term or class; the test that concludes a class.',phonetic:'/ˈfaɪ.nəl/',pos:'adj.'},
  {en:'financial',zh:'金融的',def:'Related to finances.',phonetic:'/faɪˈnænʃəl/',pos:'adj.'},
  {en:'firefighter',zh:'消防员',def:'A person who puts out fires.',phonetic:'/ˈfaɪə(ɹ)ˌfaɪt.ə(ɹ)/',pos:'n.'},
  {en:'fishing',zh:'钓鱼',def:'The act of catching fish.',phonetic:'/ˈfɪʃɪŋ/',pos:'n.'},
  {en:'fitness',zh:'健康',def:'The condition of being fit, suitable or appropriate.',phonetic:'/ˈfɪtnəs/',pos:'n.'},
  {en:'flame',zh:'火焰',def:'The visible part of fire; a stream of burning vapour or gas, emitting light and heat.',phonetic:'/fleɪm/',pos:'n.'},
  {en:'flour',zh:'面粉',def:'Powder obtained by grinding or milling cereal grains, especially wheat, or other foodstuffs such as soybeans and potatoes, and used to bake bread, cakes, and pastry.',phonetic:'/ˈflaʊə/',pos:'n.'},
  {en:'flu',zh:'流感',def:'Influenza.',phonetic:'/flʉː/',pos:'n.'},
  {en:'fog',zh:'雾',def:'A thick cloud that forms near the ground; the obscurity of such a cloud.',phonetic:'/fɒɡ/',pos:'n.'},
  {en:'fool',zh:'傻瓜',def:'A person with poor judgment or little intelligence.',phonetic:'/fuːl/',pos:'n.'},
  {en:'forecast',zh:'预报',def:'An estimation of a future condition.',phonetic:'/ˈfɔːkɑːst/',pos:'n.'},
  {en:'forehead',zh:'额头',def:'The part of the face above the eyebrows and below the hairline.',phonetic:'/ˈfɒɹɛd/',pos:'n.'},
  {en:'forever',zh:'永远',def:'An extremely long time.',phonetic:'/fəˈɹɛvə(ɹ)/',pos:'adv.'},
  {en:'fork',zh:'叉子',def:'A pronged tool having a long straight handle, used for digging, lifting, throwing etc.',phonetic:'/fɔːk/',pos:'n.'},
  {en:'formula',zh:'公式',def:'Any mathematical rule expressed symbolically.',phonetic:'/ˈfɔː.mjʊ.lə/',pos:'n.'},
  {en:'fossil',zh:'化石',def:'The mineralized remains of an animal or plant.',phonetic:'/ˈfɒsəl/',pos:'n.'},
  {en:'fountain',zh:'喷泉',def:'A natural source of water; a spring.',phonetic:'[ˈfaʊn.ʔn̩]',pos:'n.'},
  {en:'fraction',zh:'分数',def:'A part of a whole, especially a comparatively small part.',phonetic:'/ˈfɹæk.ʃən/',pos:'n.'},
  {en:'frame',zh:'框架',def:'The structural elements of a building or other constructed object.',phonetic:'/fɹeɪm/',pos:'n.'},
  {en:'frank',zh:'坦率的',def:'Free postage, a right exercised by governments (usually with definite article).',phonetic:'/fɹæŋk/',pos:'adj.'},
  {en:'fried',zh:'油炸的',def:'Cooked by frying.',phonetic:'/fɹaɪd/',pos:'adj.'},
  {en:'fright',zh:'惊吓',def:'A state of terror excited by the sudden appearance of danger; sudden and violent fear, usually of short duration; a sudden alarm.',phonetic:'/fɹʌit/',pos:'n.'},
  {en:'frozen',zh:'冻结的',def:'Especially of a liquid, to become solid due to low temperature.',phonetic:'/ˈfɹəʊzən/',pos:'adj.'},
  {en:'fuel',zh:'燃料',def:'Substance consumed to provide energy through combustion, or through chemical or nuclear reaction.',phonetic:'/ˈfjuːl/',pos:'n.'},
  {en:'fulltime',zh:'全职的',def:'Involving a full amount of time spent on some activity, especially a job.',phonetic:'',pos:'adj.'},
  {en:'fully',zh:'完全地',def:'In a full manner; without lack or defect.',phonetic:'/ˈfʊli/',pos:'adv.'},
  {en:'function',zh:'功能',def:'What something does or is used for.',phonetic:'/ˈfʌŋ(k)ʃən/',pos:'n.'},
  {en:'funeral',zh:'葬礼',def:'A ceremony to honour and remember a deceased person. Often distinguished from a memorial service by the presence of the body of the deceased.',phonetic:'/ˈfjuːnəɹəl/',pos:'n.'},
  {en:'furniture',zh:'家具',def:'Large movable item(s), usually in a room, which enhance(s) the room\'s characteristics, functionally or decoratively.',phonetic:'/ˈfɜːnɪtʃə/',pos:'n.'},
  {en:'gain',zh:'获得',def:'The act of gaining; acquisition.',phonetic:'/ɡeɪn/',pos:'n.'},
  {en:'galaxy',zh:'星系',def:'The Milky Way; the apparent band of concentrated stars which appears in the night sky over earth.',phonetic:'/ˈɡaləksi/',pos:'n.'},
  {en:'gallery',zh:'画廊',def:'An institution, building, or room for the exhibition and conservation of works of art.',phonetic:'/ˈɡæləɹi/',pos:'n.'},
  {en:'game',zh:'游戏',def:'A playful or competitive activity.',phonetic:'/ɡeɪm/',pos:'n.'},
  {en:'garage',zh:'车库',def:'A building (or section of a building) used to store a car or cars, tools and other miscellaneous items.',phonetic:'/ɡəˈɹɑː(d)ʒ/',pos:'n.'},
  {en:'garlic',zh:'大蒜',def:'A plant, Allium sativum, related to the onion, having a pungent bulb much used in cooking.',phonetic:'/ˈɡɑːlɪk/',pos:'n.'},
  {en:'gas',zh:'气体；汽油',def:'Matter in a state intermediate between liquid and plasma that can be contained only if it is fully surrounded by a solid (or in a bubble of liquid) (or held together by gravitational pull); it can condense into a liquid, or can (rarely) become a solid directly.',phonetic:'/ɡæs/',pos:'n.'},
  {en:'gear',zh:'齿轮；装备',def:'Equipment or paraphernalia, especially that used for an athletic endeavor.',phonetic:'/ɡɪə(ɹ)/',pos:'n.'},
  {en:'gender',zh:'性别',def:'Class; kind.',phonetic:'/ˈdʒɛndə/',pos:'n.'},
  {en:'gene',zh:'基因',def:'A theoretical unit of heredity of living organisms; a gene may take several values and in principle predetermines a precise trait of an organism\'s form (phenotype), such as hair color.',phonetic:'/dʒiːn/',pos:'n.'},
  {en:'generate',zh:'产生',def:'To bring into being; give rise to.',phonetic:'/ˈdʒɛn.əɹ.eɪt/',pos:'v.'},
  {en:'generous',zh:'慷慨的',def:'Noble in behaviour or actions; principled, not petty; kind, magnanimous.',phonetic:'/ˈdʒɛn(ə)ɹəs/',pos:'adj.'},
  {en:'get',zh:'得到',def:'Offspring.',phonetic:'/ɡɛt/',pos:'v.'},
  {en:'ghost',zh:'鬼',def:'The spirit; the soul of man.',phonetic:'/ɡəʊst/',pos:'n.'},
  {en:'ginger',zh:'姜',def:'The pungent aromatic rhizome of a tropical Asian herb, Zingiber officinale, used as a spice and as a stimulant and acarminative.',phonetic:'/ˈdʒɪndʒə/',pos:'n.'},
  {en:'girlfriend',zh:'女朋友',def:'A female partner in an unmarried romantic relationship.',phonetic:'/ˈɡɜːlfɹɛnd/',pos:'n.'},
  {en:'glasses',zh:'眼镜',def:'To apply fibreglass to.',phonetic:'/ˈɡlasɪz/',pos:'n.'},
  {en:'gloomy',zh:'阴郁的',def:'Not very illuminated; dim because of darkness, especially when appearing depressing or frightening.',phonetic:'/ˈɡlumi/',pos:'adj.'},
  {en:'golf',zh:'高尔夫',def:'A ball game played by individuals competing against one another in which the object is to hit a ball into each of a series of (usually 18 or nine) holes in the minimum number of strokes.',phonetic:'/ɡɒlf/',pos:'n.'},
  {en:'government',zh:'政府',def:'The body with the power to make and/or enforce laws to control a country, land area, people or organization.',phonetic:'/ˈɡʌvə(n)mənt/',pos:'n.'},
  {en:'gown',zh:'礼服',def:'A loose, flowing upper garment.',phonetic:'/ɡaʊn/',pos:'n.'},
  {en:'graduation',zh:'毕业',def:'The action or process of graduating and receiving a diploma for completing a course of study (such as from an educational institution).',phonetic:'/ˌɡɹædʒuˈeɪʃən/',pos:'n.'},
  {en:'grandparent',zh:'祖父母',def:'To be, or act as, a grandfather to.',phonetic:'/ˈɡɹæn(d)pæɹənt/',pos:'n.'},
  {en:'graph',zh:'图表',def:'(applied mathematics) A data chart (graphical representation of data) intended to illustrate the relationship between a set (or sets) of numbers (quantities, measurements or indicative numbers) and a reference set, whose elements are indexed to those of the former set(s) and may or may not be numbers.',phonetic:'/ɡɹæf/',pos:'n.'},
  {en:'grave',zh:'坟墓',def:'An excavation in the earth as a place of burial',phonetic:'/ɡɹeɪv/',pos:'n.'},
  {en:'graveyard',zh:'墓地',def:'A tract of land in which the dead are buried.',phonetic:'/ˈɡɹeɪvˌjɑɹd/',pos:'n.'},
  {en:'greet',zh:'问候',def:'To welcome in a friendly manner, either in person or through another means e.g. writing or over the phone/internet',phonetic:'/ɡɹiːt/',pos:'v.'},
  {en:'grief',zh:'悲伤',def:'Suffering, hardship.',phonetic:'/ɡɹiːf/',pos:'n.'},
  {en:'groom',zh:'新郎',def:'A man who is about to marry.',phonetic:'/ɡɹuːm/',pos:'n.'},
  {en:'growth',zh:'生长',def:'An increase in size, number, value, or strength.',phonetic:'/ɡɹəʊθ/',pos:'n.'},
  {en:'guesthouse',zh:'宾馆',def:'A small house near a main house, for lodging visitors.',phonetic:'',pos:'n.'},
  {en:'guidebook',zh:'旅行指南',def:'A book that provides guidance, but especially one designed for travellers which provides local tourist information about a particular country or area.',phonetic:'',pos:'n.'},
  {en:'guilty',zh:'有罪的',def:'A plea by a defendant who does not contest a charge.',phonetic:'/ˈɡɪl.ti/',pos:'adj.'},
  {en:'gun',zh:'枪',def:'A device for projecting a hard object very forcefully; a firearm or cannon.',phonetic:'/ɡʌn/',pos:'n.'},
  {en:'gym',zh:'体育馆',def:'A sports facility specialized for lifting weights and exercise.',phonetic:'/dʒɪm/',pos:'n.'},
  {en:'ham',zh:'火腿',def:'The region back of the knee joint; the popliteal space; the hock.',phonetic:'/ˈhæːm/',pos:'n.'},
  {en:'hamburger',zh:'汉堡包',def:'A hot sandwich consisting of a patty of cooked ground beef or a meat substitute, in a sliced bun, sometimes also containing salad vegetables, condiments, or both.',phonetic:'/ˈhæm.bə.ɡə/',pos:'n.'},
  {en:'handwriting',zh:'笔迹',def:'To write something manually, normally used to emphasise that it is not being typed.',phonetic:'/ˈhændɹaɪtɪŋ/',pos:'n.'},
  {en:'happily',zh:'快乐地',def:'By chance; perhaps.',phonetic:'/ˈha.pə.li/',pos:'adv.'},
  {en:'happiness',zh:'幸福',def:'The emotion of being happy; joy.',phonetic:'/ˈhæpinəs/',pos:'n.'},
  {en:'harbor',zh:'港口',def:'Any place of shelter.',phonetic:'/ˈhɑːbə/',pos:'n.'},
  {en:'hardware',zh:'硬件',def:'Fixtures, equipment, tools and devices used for general-purpose construction and repair of a structure or object. Also such equipment as sold as stock by a store of the same name, e.g. hardware store.',phonetic:'/ˈhɑːdˌwɛə/',pos:'n.'},
  {en:'harm',zh:'伤害',def:'Physical injury; hurt; damage',phonetic:'/hɑːm/',pos:'n.'},
  {en:'hatch',zh:'孵化',def:'A horizontal door in a floor or ceiling.',phonetic:'/hætʃ/',pos:'v.'},
  {en:'haunted',zh:'闹鬼的',def:'To inhabit, or visit frequently (most often used in reference to ghosts).',phonetic:'/ˈhɑntɪd/',pos:'adj.'},
  {en:'headache',zh:'头痛',def:'A pain or ache in the head.',phonetic:'/ˈhɛdeɪk/',pos:'n.'},
  {en:'heal',zh:'治愈',def:'A spell or ability that restores hit points or removes a status ailment.',phonetic:'/hiːl/',pos:'v.'},
  {en:'healthy',zh:'健康的',def:'Enjoying health and vigor of body, mind, or spirit: well.',phonetic:'/ˈhɛl.θi/',pos:'adj.'},
  {en:'heater',zh:'加热器',def:'A device that produces and radiates heat, typically to raise the temperature of a room or building.',phonetic:'/ˈhiːtə/',pos:'n.'},
  {en:'heel',zh:'脚后跟',def:'The rear part of the foot, where it joins the leg.',phonetic:'/hiːl/',pos:'n.'},
  {en:'helicopter',zh:'直升机',def:'An aircraft that is borne along by one or more sets of long rotating blades which allow it to hover, move in any direction including reverse, or land; and typically having a smaller set of blades on its tail that stabilize the aircraft.',phonetic:'/ˈheliˌkɔptə(ɹ)/',pos:'n.'},
  {en:'helmet',zh:'头盔',def:'A protective head covering, usually part of armour.',phonetic:'/ˈhɛlmət/',pos:'n.'},
  {en:'helpful',zh:'有帮助的',def:'Furnishing help; giving aid; useful.',phonetic:'/ˈhɛlp.fəl/',pos:'adj.'},
  {en:'highway',zh:'高速公路',def:'A motor vehicle for transporting large numbers of people along roads.',phonetic:'/ˈhaɪweɪ/',pos:'n.'},
  {en:'hike',zh:'远足',def:'A long walk.',phonetic:'/haɪk/',pos:'n.'},
  {en:'hip',zh:'臀部',def:'The outward-projecting parts of the pelvis and top of the femur and the overlying tissue.',phonetic:'/hɪp/',pos:'n.'},
  {en:'hire',zh:'雇用',def:'Payment for the temporary use of something.',phonetic:'/haɪə/',pos:'v.'},
  {en:'homework',zh:'家庭作业',def:'Work that is done at home, especially school exercises assigned by a teacher.',phonetic:'/ˈhəʊmˌwɜːk/',pos:'n.'},
  {en:'honey',zh:'蜂蜜',def:'A viscous, sweet fluid produced from plant nectar by bees. Often used to sweeten tea or to spread on baked goods.',phonetic:'/ˈhʌni/',pos:'n.'},
  {en:'honeymoon',zh:'蜜月',def:'The period of time immediately following a marriage.',phonetic:'/ˈhʌn.iˌmun/',pos:'n.'},
  {en:'honor',zh:'荣誉',def:'Recognition of importance or value; respect; veneration (of someone, usually for being morally upright or successful)',phonetic:'/ˈɒn.ə/',pos:'n.'},
  {en:'hopeless',zh:'无望的',def:'Without hope; despairing; not expecting anything positive.',phonetic:'/ˈhəʊplɪs/',pos:'adj.'},
  {en:'hotel',zh:'旅馆',def:'A large town house or mansion; a grand private residence, especially in France.',phonetic:'/(h)əʊˈtɛl/',pos:'n.'},
  {en:'household',zh:'家庭',def:'Collectively, all the persons who live in a given house; a family including attendants, servants etc.; a domestic or family establishment.',phonetic:'/ˈhaʊshəʊld/',pos:'n.'},
  {en:'hug',zh:'拥抱',def:'A close embrace, especially when charged with such an emotion as represented by: affection, joy, relief, lust, anger, agression, compassion, and the like, as opposed to being characterized by formality, equivocation or ambivalence (a half-embrace or "little hug").',phonetic:'/hʌɡ/',pos:'n.'},
  {en:'humid',zh:'潮湿的',def:'Containing perceptible moisture (usually describing air or atmosphere); damp; moist; somewhat wet or watery.',phonetic:'/ˈhjuːmɪd/',pos:'adj.'},
  {en:'humor',zh:'幽默',def:'The quality of being amusing, comical, funny.',phonetic:'/hjuː.mə(ɹ)/',pos:'n.'},
  {en:'hunger',zh:'饥饿',def:'A need or compelling desire for food.',phonetic:'/ˈhʌŋɡə/',pos:'n.'},
  {en:'hut',zh:'小屋',def:'A small, simple one-storey dwelling or shelter, often with just one room, and generally built of readily available local materials.',phonetic:'/hʌt/',pos:'n.'},
  {en:'illegal',zh:'非法的',def:'An illegal act or technique.',phonetic:'/ɪˈliːɡəl/',pos:'adj.'},
  {en:'illness',zh:'疾病',def:'An instance of a disease or poor health.',phonetic:'/ˈɪl.nəs/',pos:'n.'},
  {en:'imagination',zh:'想象力',def:'The image-making power of the mind; the act of mentally creating or reproducing an object not previously perceived; the ability to create such images.',phonetic:'/ɪˌmædʒəˈneɪʃən/',pos:'n.'},
  {en:'impact',zh:'影响',def:'The striking of one body against another; collision.',phonetic:'',pos:'n.'},
  {en:'import',zh:'进口',def:'Something brought in from an exterior source, especially for sale or trade.',phonetic:'/ˈɪm.pɔːt/',pos:'n.'},
  {en:'income',zh:'收入',def:'Money one earns by working or by capitalising on the work of others.',phonetic:'/ˈɪnˌkʌm/',pos:'n.'},
  {en:'independent',zh:'独立的',def:'A candidate or voter not affiliated with any political party, a freethinker, free of a party platform.',phonetic:'/ɪndɪˈpɛndənt/',pos:'adj.'},
  {en:'industry',zh:'工业',def:'The tendency to work persistently. Diligence.',phonetic:'/ˈɪndəstɹi/',pos:'n.'},
  {en:'infection',zh:'感染',def:'The act or process of infecting.',phonetic:'/ɪnˈfɛkʃən/',pos:'n.'},
  {en:'information',zh:'信息',def:'That which resolves uncertainty; anything that answers the question of "what a given entity is".',phonetic:'/ˌɪnfəˈmeɪʃən/',pos:'n.'},
  {en:'injury',zh:'伤害',def:'Damage to the body of a human or animal.',phonetic:'/ˈɪn.dʒə.ɹi/',pos:'n.'},
  {en:'ink',zh:'墨水',def:'A pigment (or dye)-based fluid used for writing, printing etc.',phonetic:'/ɪŋk/',pos:'n.'},
  {en:'innocent',zh:'无辜的',def:'One who is innocent, especially a young child.',phonetic:'/ˈɪnəsn̩t/',pos:'adj.'},
  {en:'innovation',zh:'创新',def:'The act of innovating; the introduction of something new, in customs, rites, etc.',phonetic:'/ˌɪnəˈveɪʃən/',pos:'n.'},
  {en:'institution',zh:'机构',def:'A custom or practice of a society or community.',phonetic:'/ˌɪnstɪˈtjuːʃən/',pos:'n.'},
  {en:'instruction',zh:'指导',def:'The act of instructing, teaching, or furnishing with information or knowledge.',phonetic:'/ɪnˈstɹʌkʃən/',pos:'n.'},
  {en:'instrument',zh:'乐器',def:'A device used to produce music.',phonetic:'/ˈɪnstɹəmənt/',pos:'n.'},
  {en:'insurance',zh:'保险',def:'A means of indemnity against a future occurrence of an uncertain event.',phonetic:'/ɪn.ˈʃɔː.ɹəns/',pos:'n.'},
  {en:'intelligence',zh:'智力',def:'Capacity of mind, especially to understand principles, truths, facts or meanings, acquire knowledge, and apply it to practice; the ability to comprehend and learn.',phonetic:'/ɪnˈtɛl.ɪ.d͡ʒəns/',pos:'n.'},
  {en:'interior',zh:'内部',def:'The inside of a building, container, cavern, or other enclosed structure.',phonetic:'/ɪnˈtɪəɹɪə/',pos:'n.'},
  {en:'internal',zh:'内部的',def:'Inside of something',phonetic:'/ɪnˈtɝnəl/',pos:'adj.'},
  {en:'internet',zh:'互联网',def:'Any set of computer networks that communicate using the Internet Protocol. (An intranet.)',phonetic:'/ˈɪntəˌnɛt/',pos:'n.'},
  {en:'invisible',zh:'看不见的',def:'An invisible person or thing; specifically, God, the Supreme Being.',phonetic:'/ɪnˈvɪzəb(ə)l/',pos:'adj.'},
  {en:'issue',zh:'问题',def:'The action or an instance of flowing or coming out, an outflow, particularly:',phonetic:'/ˈɪsjuː/',pos:'n.'},
  {en:'jail',zh:'监狱',def:'A place or institution for the confinement of persons held in lawful custody or detention, especially for minor offenses or with reference to some future judicial proceeding.',phonetic:'/dʒeɪl/',pos:'n.'},
  {en:'jam',zh:'果酱',def:'A sweet mixture of fruit boiled with sugar and allowed to congeal. Often spread on bread or toast or used in jam tarts.',phonetic:'/ˈdʒæːm/',pos:'n.'},
  {en:'jar',zh:'罐子',def:'An earthenware container, either with two or no handles, for holding oil, water, wine, etc., or used for burial.',phonetic:'/dʒɐː/',pos:'n.'},
  {en:'jazz',zh:'爵士乐',def:'A musical art form rooted in West African cultural and musical expression and in the African American blues tradition, with diverse influences over time, commonly characterized by blue notes, syncopation, swing, call and response, polyrhythms and improvisation.',phonetic:'/d͡ʒæz/',pos:'n.'},
  {en:'jealous',zh:'嫉妒的',def:'Suspecting rivalry in love; troubled by worries that one might have been replaced in someone\'s affections; suspicious of a lover\'s or spouse\'s fidelity.',phonetic:'/ˈdʒɛləs/',pos:'adj.'},
  {en:'jeans',zh:'牛仔裤',def:'Denim.',phonetic:'/d͡ʒiːnz/',pos:'n.'},
  {en:'jeep',zh:'吉普车',def:'A small, blocky, military-style vehicle with four-wheel drive, suited to rough terrain.',phonetic:'/dʒiːp/',pos:'n.'},
  {en:'jelly',zh:'果冻',def:'An explosive mixture of nitroglycerine and nitrate absorbed onto a base of wood pulp.',phonetic:'/ˈd͡ʒɛl.i/',pos:'n.'},
  {en:'jellyfish',zh:'水母',def:'An almost transparent aquatic animal; any one of the acalephs, especially one of the larger species, having a jellylike appearance.',phonetic:'/ˈdʒɛliˌfɪʃ/',pos:'n.'},
  {en:'jet',zh:'喷气式飞机',def:'A collimated stream, spurt or flow of liquid or gas from a pressurized container, an engine, etc.',phonetic:'/dʒɛt/',pos:'n.'},
  {en:'jewelry',zh:'珠宝',def:'Collectively, personal ornamentation such as rings, necklaces, brooches and bracelets, made of precious metals and sometimes set with gemstones.',phonetic:'',pos:'n.'},
  {en:'joint',zh:'关节',def:'The point where two components of a structure join, but are still able to rotate.',phonetic:'/dʒɔɪnt/',pos:'n.'},
  {en:'joke',zh:'笑话',def:'An amusing story.',phonetic:'/dʒəʊk/',pos:'n.'},
  {en:'journalist',zh:'记者',def:'The keeper of a personal journal, who writes in it regularly.',phonetic:'/ˈdʒɜːnəlɪst/',pos:'n.'},
  {en:'ketchup',zh:'番茄酱',def:'A tomato-vinegar-based sauce, sometimes containing spices, onion or garlic, and (especially in the US) sweeteners.',phonetic:'/ˈkɛtʃ.əp/',pos:'n.'},
  {en:'keyboard',zh:'键盘',def:'(etc.) A set of keys used to operate a typewriter, computer etc.',phonetic:'/ˈkiːbɔːd/',pos:'n.'},
  {en:'kindergarten',zh:'幼儿园',def:'An educational institution for young children, usually between ages 4 and 6; nursery school.',phonetic:'/ˈkɪndəɹˌɡɑːɹd(ə)n/',pos:'n.'},
  {en:'kiss',zh:'亲吻',def:'To touch with the lips or press the lips against, usually to show love or affection or passion, or as part of a greeting.',phonetic:'/kɪs/',pos:'v.'},
  {en:'knee',zh:'膝盖',def:'In humans, the joint or the region of the joint in the middle part of the leg between the thigh and the shank.',phonetic:'/niː/',pos:'n.'},
  {en:'knit',zh:'编织',def:'A knitted garment.',phonetic:'/ˈnɪt/',pos:'n.'},
  {en:'lab',zh:'实验室',def:'A laboratory.',phonetic:'/læb/',pos:'n.'},
  {en:'label',zh:'标签',def:'A small ticket or sign giving information about something to which it is attached or intended to be attached.',phonetic:'/ˈleɪbəl/',pos:'n.'},
  {en:'ladder',zh:'梯子',def:'A frame, usually portable, of wood, metal, or rope, used for ascent and descent, consisting of two side pieces to which are fastened rungs (cross strips or rounds acting as steps).',phonetic:'/ˈladə/',pos:'n.'},
  {en:'landscape',zh:'风景',def:'A portion of land or territory which the eye can comprehend in a single view, including all the objects it contains.',phonetic:'/ˈlandskeɪp/',pos:'n.'},
  {en:'lane',zh:'车道',def:'(used in street names) A road, street, or similar thoroughfare.',phonetic:'/leɪn/',pos:'n.'},
  {en:'laptop',zh:'笔记本电脑',def:'A laptop computer.',phonetic:'/ˈlæp.tɒp/',pos:'n.'},
  {en:'law',zh:'法律',def:'The body of binding rules and regulations, customs and standards established in a community by its legislative and judicial authorities.',phonetic:'/lɔː/',pos:'n.'},
  {en:'lawyer',zh:'律师',def:'A professional person qualified (as by a law degree or bar exam) and authorized to practice law, i.e. represent parties in lawsuits or trials and give legal advice.',phonetic:'/ˈlɔɪ.ə(ɹ)/',pos:'n.'},
  {en:'lecture',zh:'讲座',def:'A spoken lesson or exposition, usually delivered to a group.',phonetic:'/ˈlɛk.t͡ʃə/',pos:'n.'},
  {en:'lecturer',zh:'讲师',def:'A person who gives lectures, especially as a profession.',phonetic:'/ˈlɛktʃəɹə/',pos:'n.'},
  {en:'legal',zh:'法律的',def:'The legal department of a company.',phonetic:'/ˈliː.ɡəl/',pos:'adj.'},
  {en:'legend',zh:'传说',def:'An unrealistic story depicting past events.',phonetic:'/ˈlɛdʒ.ənd/',pos:'n.'},
  {en:'lemon',zh:'柠檬',def:'A yellowish citrus fruit.',phonetic:'/ˈlɛmən/',pos:'n.'},
  {en:'leopard',zh:'豹',def:'Panthera pardus, a large wild cat with a spotted coat native to Africa and Asia, especially the male of the species (in contrast to leopardess).',phonetic:'/ˈlɛpəd/',pos:'n.'},
  {en:'less',zh:'更少的',def:'A smaller amount or quantity.',phonetic:'/lɛs/',pos:'adj.'},
  {en:'lettuce',zh:'生菜',def:'An edible plant, Lactuca sativa and its close relatives, having a head of green and/or purple leaves.',phonetic:'/ˈlɛtəs/',pos:'n.'},
  {en:'librarian',zh:'图书管理员',def:'The keeper, manager of a library.',phonetic:'/laɪˈbɹɛɹ.i.ən/',pos:'n.'},
  {en:'lightning',zh:'闪电',def:'A flash of light produced by short-duration, high-voltage discharge of electricity within a cloud, between clouds, or between a cloud and the earth.',phonetic:'/ˈlaɪt.nɪŋ/',pos:'n.'},
  {en:'lime',zh:'酸橙',def:'Any inorganic material containing calcium, usually calcium oxide (quicklime) or calcium hydroxide (slaked lime).',phonetic:'/laɪm/',pos:'n.'},
  {en:'link',zh:'链接',def:'Some text or a graphic in an electronic document that can be activated to display another document or trigger an action.',phonetic:'/lɪŋk/',pos:'n.'},
  {en:'lips',zh:'嘴唇',def:'Either of the two fleshy protrusions around the opening of the mouth.',phonetic:'/lɪps/',pos:'n.'},
  {en:'literacy',zh:'读写能力',def:'The ability to read and write.',phonetic:'/ˈlɪt.ɹə.si/',pos:'n.'},
  {en:'lively',zh:'活泼的',def:'Term of address.',phonetic:'/ˈlaɪvli/',pos:'adj.'},
  {en:'living',zh:'客厅',def:'To be alive; to have life.',phonetic:'/ˈlɪvɪŋ/',pos:'n.'},
  {en:'load',zh:'负荷',def:'A burden; a weight to be carried.',phonetic:'/ləʊd/',pos:'n.'},
  {en:'loan',zh:'贷款',def:'An act or instance of lending, an act or instance of granting something for temporary use.',phonetic:'/ləʊn/',pos:'n.'},
  {en:'locate',zh:'定位',def:'To place; to set in a particular spot or position.',phonetic:'/ləʊˈkeɪt/',pos:'v.'},
  {en:'loss',zh:'损失',def:'The result of no longer possessing an object, a function, or a characteristic due to external causes or misplacement.',phonetic:'/lɑs/',pos:'n.'},
  {en:'lost',zh:'迷路的',def:'To cause (something) to cease to be in one\'s possession or capability due to unfortunate or unknown circumstances, events or reasons.',phonetic:'/lɒst/',pos:'adj.'},
  {en:'lucky',zh:'幸运的',def:'(of people) Favoured by luck; fortunate; having good success or good fortune',phonetic:'/ˈlʌki/',pos:'adj.'},
  {en:'lunchtime',zh:'午餐时间',def:'The time or hour at or around which lunch is normally eaten.',phonetic:'/ˈlʌnt͡ʃtaɪm/',pos:'n.'},
  {en:'lung',zh:'肺',def:'A biological organ of vertebrates that controls breathing and oxygenates the blood.',phonetic:'/ˈlʌŋ/',pos:'n.'},
  {en:'mall',zh:'商场',def:'A pedestrianised street, especially a shopping precinct.',phonetic:'/mɔːl/',pos:'n.'},
  {en:'manager',zh:'经理',def:'A person whose job is to manage something, such as a business, a restaurant, or a sports team.',phonetic:'/ˈmæn.ɪ.dʒə/',pos:'n.'},
  {en:'manufacture',zh:'制造',def:'The action or process of making goods systematically or on a large scale.',phonetic:'/ˌmænjʊˈfæktʃə/',pos:'v.'},
  {en:'marine',zh:'海洋的',def:'A soldier, normally a member of a marine corps, trained to serve on board or from a ship',phonetic:'/məˈɹiːn/',pos:'n.'},
  {en:'marker',zh:'记号笔',def:'An object used to mark a location.',phonetic:'',pos:'n.'},
  {en:'marry',zh:'结婚',def:'To enter into the conjugal or connubial state; to take a husband or a wife.',phonetic:'/ˈmæɹɪ/',pos:'v.'},
  {en:'marshmallow',zh:'棉花糖',def:'A species of mallow, Althaea officinalis, that grows in marshy terrain.',phonetic:'/mɑːʃˈmæləʊ/',pos:'n.'},
  {en:'massive',zh:'巨大的',def:'A homogeneous mass of rock, not layered and without an obvious crystal structure.',phonetic:'/ˈmæs.ɪv/',pos:'adj.'},
  {en:'mat',zh:'垫子',def:'A flat piece of coarse material used for wiping one’s feet, or as a decorative or protective floor covering.',phonetic:'/mæt/',pos:'n.'},
  {en:'mattress',zh:'床垫',def:'A pad on which a person can recline and sleep, usually having an inner section of coiled springs covered with foam or other cushioning material then enclosed with cloth fabric.',phonetic:'/ˈmætɹɪs/',pos:'n.'},
  {en:'maybe',zh:'也许',def:'Something that is possibly true.',phonetic:'/ˈmeɪbi/',pos:'adv.'},
  {en:'mayor',zh:'市长',def:'The chief executive of the municipal government of a city, borough, &c., formerly usually appointed as a caretaker by European royal courts but now usually appointed or elected locally.',phonetic:'/ˈmeɪ.ə/',pos:'n.'},
  {en:'meaning',zh:'意思',def:'(of words or symbols) The entity, perception, feeling or concept thereby represented or evoked.',phonetic:'/ˈmiːnɪŋ/',pos:'n.'},
  {en:'mechanic',zh:'机械师',def:'A manual worker; a labourer or artisan.',phonetic:'/məˈkænɪk/',pos:'n.'},
  {en:'media',zh:'媒体',def:'The middle layer of the wall of a blood vessel or lymph vessel which is composed of connective and muscular tissue.',phonetic:'/ˈmiːdɪə/',pos:'n.'},
  {en:'meeting',zh:'会议',def:'(gerund) The act of persons or things that meet.',phonetic:'/ˈmiːtɪŋ/',pos:'n.'},
  {en:'mental',zh:'精神的',def:'Of or relating to the mind or an intellectual process.',phonetic:'/ˈmɛntəl/',pos:'adj.'},
  {en:'mentor',zh:'导师',def:'A wise and trusted counselor or teacher',phonetic:'/ˈmɛn.tɔː/',pos:'n.'},
  {en:'menu',zh:'菜单',def:'The details of the food to be served at a banquet; a bill of fare.',phonetic:'/ˈmɛnju/',pos:'n.'},
  {en:'mermaid',zh:'美人鱼',def:'A mythological creature with a woman\'s head and upper body, and a tail of a fish.',phonetic:'/ˈməː.meɪd/',pos:'n.'},
  {en:'meter',zh:'米',def:'(always meter) A device that measures things.',phonetic:'/ˈmiːtə/',pos:'n.'},
  {en:'midterm',zh:'期中考试',def:'A midterm school exam (i.e., halfway through the term).',phonetic:'/ˈmɪdˌtəɹm/',pos:'n.'},
  {en:'military',zh:'军事的',def:'Armed forces.',phonetic:'/ˈmɪl.ɪ.tɹi/',pos:'n.'},
  {en:'minister',zh:'部长',def:'A person who is trained to preach, to perform religious ceremonies, and to afford pastoral care at a Protestant church.',phonetic:'/ˈmɪnɪstə/',pos:'n.'},
  {en:'minor',zh:'次要的；辅修',def:'A person who is below the age of majority, consent, criminal responsibility or other adult responsibilities and accountabilities.',phonetic:'/ˈmaɪnɚ/',pos:'n.'},
  {en:'minus',zh:'减',def:'The minus sign (−).',phonetic:'/ˈmaɪnəs/',pos:'n.'},
  {en:'miserable',zh:'痛苦的',def:'A miserable person; a wretch.',phonetic:'/ˈmɪz(ə)ɹəbəl/',pos:'adj.'},
  {en:'misery',zh:'痛苦',def:'Great unhappiness; extreme pain of body or mind; wretchedness; distress; woe.',phonetic:'/ˈmɪz(ə)ɹɪ/',pos:'n.'},
  {en:'monument',zh:'纪念碑',def:'A structure built for commemorative or symbolic reasons, or as a memorial; a commemoration.',phonetic:'/ˈmɒnjʊmənt/',pos:'n.'},
  {en:'mood',zh:'心情',def:'A mental or emotional state, composure.',phonetic:'/muːd/',pos:'n.'},
  {en:'motor',zh:'发动机',def:'A machine or device that converts other energy forms into mechanical energy, or imparts motion.',phonetic:'/ˈməʊtə/',pos:'n.'},
  {en:'motorcycle',zh:'摩托车',def:'An open-seated motor vehicle with handlebars instead of a steering wheel, and having two (or sometimes three) wheels.',phonetic:'/ˈməʊtəˌsaikəl/',pos:'n.'},
  {en:'movement',zh:'运动',def:'Physical motion between points in space.',phonetic:'/ˈmuːv.mənt/',pos:'n.'},
  {en:'movie',zh:'电影',def:'A recorded sequence of images displayed on a screen at a rate sufficiently fast to create the appearance of motion.',phonetic:'/ˈmuːvi/',pos:'n.'},
  {en:'mug',zh:'杯子',def:'A large cup for hot liquids, usually having a handle and used without a saucer.',phonetic:'/mʌɡ/',pos:'n.'},
  {en:'multiply',zh:'乘',def:'An act or instance of multiplying.',phonetic:'/ˈmʌltɪplaɪ/',pos:'v.'},
  {en:'mushroom',zh:'蘑菇',def:'Any of the fleshy fruiting bodies of fungi typically produced above ground on soil or on their food sources (such as decaying wood).',phonetic:'/ˈmʌʃˌɹuːm/',pos:'n.'},
  {en:'musical',zh:'音乐的；音乐剧',def:'A stage performance, show or film that involves singing, dancing and musical numbers performed by the cast as well as acting.',phonetic:'/ˈmju.zɪ.kəl/',pos:'n.'},
  {en:'musician',zh:'音乐家',def:'A composer, conductor, or performer of music; specifically, a person who sings and/or plays a musical instrument as a hobby, an occupation, or a profession.',phonetic:'/mjuˈzɪʃən/',pos:'n.'},
  {en:'mysterious',zh:'神秘的',def:'Of unknown origin.',phonetic:'/mɪˈstɪəɹi.əs/',pos:'adj.'},
  {en:'myth',zh:'神话',def:'A traditional story which embodies a belief regarding some fact or phenomenon of experience, and in which often the forces of nature and of the soul are personified; a sacred narrative regarding a god, a hero, the origin of the world or of a people, etc.',phonetic:'/mɪθ/',pos:'n.'},
  {en:'mythical',zh:'神话的',def:'Existing in myth.',phonetic:'/ˈmɪθɪkəl/',pos:'adj.'},
  {en:'nail',zh:'指甲；钉子',def:'The thin, horny plate at the ends of fingers and toes on humans and some other animals.',phonetic:'/neɪl/',pos:'n.'},
  {en:'naked',zh:'裸体的',def:'Bare, not covered by clothing.',phonetic:'/ˈnɛkɪd/',pos:'adj.'},
  {en:'nap',zh:'小睡',def:'A short period of sleep, especially one during the day.',phonetic:'/nap/',pos:'n.'},
  {en:'napkin',zh:'餐巾',def:'A serviette; a (usually rectangular) piece of cloth or paper used at the table for wiping the mouth and hands for cleanliness while eating.',phonetic:'/ˈnæp.kɪn/',pos:'n.'},
  {en:'national',zh:'国家的',def:'A subject of a nation.',phonetic:'/ˈnæʃ(ə)nəl/',pos:'adj.'},
  {en:'navy',zh:'海军',def:'A country\'s entire sea force, including ships and personnel.',phonetic:'/ˈneɪvi/',pos:'n.'},
  {en:'neck',zh:'脖子',def:'The part of the body connecting the head and the trunk found in humans and some animals.',phonetic:'/nɛk/',pos:'n.'},
  {en:'necklace',zh:'项链',def:'An article of jewelry that is worn around the neck, most often made of a string of precious metal, pearls, gems, beads or shells, and sometimes having a pendant attached.',phonetic:'/ˈnɛkləs/',pos:'n.'},
  {en:'needle',zh:'针',def:'A fine, sharp implement usually for piercing such as sewing, or knitting, acupuncture, tattooing, body piercing, medical injections, etc.',phonetic:'/ˈniː.dl/',pos:'n.'},
  {en:'negative',zh:'消极的',def:'Refusal or withholding of assents; prohibition, veto',phonetic:'/ˈnɛ(e)ɡəˌɾɪv/',pos:'adj.'},
  {en:'nephew',zh:'侄子；外甥',def:'A son of one\'s sibling, brother-in-law, or sister-in-law; either a son of one\'s brother (fraternal nephew) or a son of one\'s sister (sororal nephew).',phonetic:'/ˈnɛf.ju/',pos:'n.'},
  {en:'net',zh:'网',def:'An open-meshed fabric twisted or woven together, used for catching or holding things.',phonetic:'/net/',pos:'n.'},
  {en:'network',zh:'网络',def:'A fabric or structure of fibrous elements attached to each other at regular intervals.',phonetic:'/nɛtwɜːk/',pos:'n.'},
  {en:'newborn',zh:'新生的',def:'A recently born baby.',phonetic:'',pos:'adj.'},
  {en:'newlywed',zh:'新婚夫妇',def:'A recently married person',phonetic:'',pos:'n.'},
  {en:'news',zh:'新闻',def:'New information of interest.',phonetic:'/njuːz/',pos:'n.'},
  {en:'niece',zh:'侄女；外甥女',def:'A daughter of one’s sibling, brother-in-law, or sister-in-law; either the daughter of one\'s brother ("fraternal niece"), or of one\'s sister ("sororal niece").',phonetic:'/niːs/',pos:'n.'},
  {en:'noisy',zh:'嘈杂的',def:'Making a noise, especially a loud unpleasant sound',phonetic:'/ˈnɔːɪzɪ/',pos:'adj.'},
  {en:'noodle',zh:'面条',def:'(usually in the plural) a string or strip of pasta',phonetic:'/nuːdl̩/',pos:'n.'},
  {en:'note',zh:'笔记',def:'(heading) A symbol or annotation.',phonetic:'/nəʊt/',pos:'n.'},
  {en:'notebook',zh:'笔记本',def:'A book in which notes or memoranda are written.',phonetic:'/ˈnəʊtˌbʊk/',pos:'n.'},
  {en:'nuclear',zh:'核的',def:'Nuclear power',phonetic:'/ˈn(j)ukliɚ/',pos:'adj.'},
  {en:'nut',zh:'坚果',def:'A hard-shelled seed.',phonetic:'[nɐt]',pos:'n.'},
  {en:'obesity',zh:'肥胖',def:'The state of being obese due to an excess of body fat.',phonetic:'',pos:'n.'},
  {en:'off',zh:'离开',def:'(usually in phrases such as \'from the off\', \'at the off\', etc.) Beginning; starting point.',phonetic:'/ɔːf/',pos:'adv.'},
  {en:'offense',zh:'冒犯',def:'The act of offending:',phonetic:'/əˈfɛns/',pos:'n.'},
  {en:'officer',zh:'军官；官员',def:'One who has a position of authority in a hierarchical organization, especially in military, police or government organizations.',phonetic:'/ˈɑfɪsɚ/',pos:'n.'},
  {en:'official',zh:'官方的',def:'An office holder invested with powers and authorities.',phonetic:'/əˈfɪʃəl/',pos:'n.'},
  {en:'often',zh:'经常',def:'Frequent.',phonetic:'/ˈɑf(t)ən/',pos:'adv.'},
  {en:'oil',zh:'油',def:'Liquid fat.',phonetic:'/ɔɪl/',pos:'n.'},
  {en:'omelet',zh:'煎蛋卷',def:'A dish made with beaten eggs cooked in a frying pan without stirring, flipped over to cook on both sides, and sometimes filled or topped with cheese, chives or other foodstuffs.',phonetic:'',pos:'n.'},
  {en:'online',zh:'在线',def:'To bring (a system, etc.) online; to promote to an active or running state.',phonetic:'/ɒnˈlaɪn/',pos:'v.'},
  {en:'opera',zh:'歌剧',def:'A theatrical work, combining drama, music, song and sometimes dance.',phonetic:'/ˈɒp.əɹ.ə/',pos:'n.'},
  {en:'operation',zh:'手术',def:'The method by which a device performs its function.',phonetic:'/ˌɒpəˈɹeɪʃən/',pos:'n.'},
  {en:'opportunity',zh:'机会',def:'A chance for advancement, progress or profit.',phonetic:'/ˌɒp.əˈtjuː.nɪ.tɪ/',pos:'n.'},
  {en:'orchestra',zh:'管弦乐队',def:'A large group of musicians who play together on various instruments, usually including some from strings, woodwind, brass and/or percussion; the instruments played by such a group.',phonetic:'/ˈɔːkəstɹə/',pos:'n.'},
  {en:'ordinal',zh:'序数的',def:'An ordinal number such as first, second and third.',phonetic:'/ˈɔː(ɹ).dɪ.nəl/',pos:'adj.'},
  {en:'organization',zh:'组织',def:'The quality of being organized.',phonetic:'/ˌɔɹɡənaɪˈzeɪʃən/',pos:'n.'},
  {en:'outside',zh:'在外面',def:'The part of something that faces out; the outer surface.',phonetic:'',pos:'adv.'},
  {en:'owe',zh:'欠',def:'To be under an obligation to give something back to someone or to perform some action for someone.',phonetic:'/əʊ/',pos:'v.'},
  {en:'pain',zh:'疼痛',def:'An ache or bodily suffering, or an instance of this; an unpleasant sensation, resulting from a derangement of functions, disease, or injury by violence; hurt.',phonetic:'/peɪn/',pos:'n.'},
  {en:'painful',zh:'疼痛的',def:'Causing pain or distress, either physical or mental.',phonetic:'/ˈpeɪn.fəl/',pos:'adj.'},
  {en:'painter',zh:'画家',def:'An artist who paints pictures.',phonetic:'/ˈpeɪntə/',pos:'n.'},
  {en:'painting',zh:'绘画',def:'To apply paint to.',phonetic:'/ˈpeɪn.tɪŋ/',pos:'n.'},
  {en:'pajamas',zh:'睡衣',def:'Clothes for wearing to bed and sleeping in, usually consisting of a loose-fitting shirt and pants/trousers.',phonetic:'/pəˈd͡ʒæ.məz/',pos:'n.'},
  {en:'parking',zh:'停车',def:'To bring (something such as a vehicle) to a halt or store in a specified place.',phonetic:'/ˈpɑːkɪŋ/',pos:'n.'},
  {en:'parliament',zh:'议会',def:'A formal council summoned (especially by a monarch) to discuss important issues.',phonetic:'/ˈpɑːləmənt/',pos:'n.'},
  {en:'party',zh:'聚会',def:'A person or group of people constituting a particular side in a contract or legal action.',phonetic:'/ˈpɑ(ː)ɾi/',pos:'n.'},
  {en:'passenger',zh:'乘客',def:'One who rides or travels in a vehicle, but who does not operate it and is not a member of the crew.',phonetic:'/ˈpæsənd͡ʒə/',pos:'n.'},
  {en:'passport',zh:'护照',def:'An official document normally used for international journeys, which proves the identity and nationality of the person for whom it was issued.',phonetic:'/ˈpɑːspɔːt/',pos:'n.'},
  {en:'pasta',zh:'意大利面',def:'Dough made from wheat and water and sometimes mixed with egg and formed into various shapes; often sold in dried form and typically boiled for eating.',phonetic:'/ˈpɐːstə/',pos:'n.'},
  {en:'paw',zh:'爪子',def:'The soft foot of a mammal or other animal, generally a quadruped, that has claws or nails; comparable to a human hand or foot.',phonetic:'/pɔː/',pos:'n.'},
  {en:'pe',zh:'体育',def:'The seventeenth letter of many Semitic alphabets/abjads (Phoenician, Aramaic, Hebrew פ, Syriac ܦ, and others; Arabic has the analog faa).',phonetic:'/peɪ/',pos:'n.'},
  {en:'peaceful',zh:'和平的',def:'Not at war or disturbed by strife or turmoil.',phonetic:'/ˈpiːsfəl/',pos:'adj.'},
  {en:'peak',zh:'山顶',def:'A point; the sharp end or top of anything that terminates in a point; as, the peak, or front, of a cap.',phonetic:'/piːk/',pos:'n.'},
  {en:'penalty',zh:'惩罚',def:'A legal sentence.',phonetic:'/ˈpɛnəlti/',pos:'n.'},
  {en:'pepper',zh:'胡椒粉',def:'A plant of the family Piperaceae.',phonetic:'/ˈpɛpə/',pos:'n.'},
  {en:'percent',zh:'百分比',def:'A percentage, a proportion (especially per hundred).',phonetic:'/pəˈsɛnt/',pos:'n.'},
  {en:'performance',zh:'表演',def:'The act of performing; carrying into execution or action; execution; achievement; accomplishment; representation by action.',phonetic:'[pə.ˈfɔː.məns]',pos:'n.'},
  {en:'performer',zh:'表演者',def:'One who performs for, or entertains, an audience.',phonetic:'/pəˈfɔːmə/',pos:'n.'},
  {en:'pharmacist',zh:'药剂师',def:'A professional who dispenses prescription drugs in a hospital or retail pharmacy.',phonetic:'/ˈfɑɹməsɪst/',pos:'n.'},
  {en:'philosophy',zh:'哲学',def:'The love of wisdom.',phonetic:'/fɪˈlɒsəfi/',pos:'n.'},
  {en:'physician',zh:'医生',def:'A practitioner of physic, i.e. a specialist in internal medicine, especially as opposed to a surgeon; a practitioner who treats with medication rather than with surgery.',phonetic:'/fɪˈzɪʃən/',pos:'n.'},
  {en:'pilot',zh:'飞行员',def:'A person who steers a ship, a helmsman.',phonetic:'/ˈpaɪlət/',pos:'n.'},
  {en:'pirate',zh:'海盗',def:'A criminal who plunders at sea; commonly attacking merchant vessels, though often pillaging port towns.',phonetic:'/ˈpaɪ̯(ə)ɹət/',pos:'n.'},
  {en:'pizza',zh:'比萨饼',def:'A baked Italian dish of a thinly rolled bread dough crust typically topped before baking with tomato sauce, cheese and other ingredients such as meat, vegetables or fruit',phonetic:'/ˈpiːt.sə/',pos:'n.'},
  {en:'place',zh:'地方',def:'(physical) An area; somewhere within an area.',phonetic:'/pleɪs/',pos:'n.'},
  {en:'plane',zh:'飞机',def:'A level or flat surface.',phonetic:'/pleɪn/',pos:'n.'},
  {en:'platform',zh:'平台',def:'A raised stage from which speeches are made and on which musical and other performances are made.',phonetic:'/ˈplætfɔːm/',pos:'n.'},
  {en:'player',zh:'运动员',def:'One that plays',phonetic:'/ˈpleɪə(ɹ)/',pos:'n.'},
  {en:'pleased',zh:'高兴的',def:'To make happy or satisfy; to give pleasure to.',phonetic:'/pliːzd/',pos:'adj.'},
  {en:'plot',zh:'情节',def:'(authorship) The course of a story, comprising a series of incidents which are gradually unfolded, sometimes by unexpected means.',phonetic:'/plɒt/',pos:'n.'},
  {en:'plug',zh:'插头',def:'A pronged connecting device which fits into a mating socket, especially an electrical one.',phonetic:'/plʌɡ/',pos:'n.'},
  {en:'plumber',zh:'水管工',def:'One who works in or with lead.',phonetic:'/ˈplʌmə/',pos:'n.'},
  {en:'plus',zh:'加',def:'A positive quantity.',phonetic:'/plʌs/',pos:'n.'},
  {en:'poetry',zh:'诗歌',def:'Literature composed in verse or language exhibiting conscious attention to patterns and rhythm.',phonetic:'/ˈpəʊɪtɹi/',pos:'n.'},
  {en:'polar',zh:'极地的',def:'The line joining the points of contact of tangents drawn to meet a curve from a point called the pole of the line.',phonetic:'/ˈpəʊ̯lə(ɹ)/',pos:'adj.'},
  {en:'policy',zh:'政策',def:'A principle of behaviour, conduct etc. thought to be desirable or necessary, especially as formally expressed by a government or other authoritative body.',phonetic:'/ˈpɒləsi/',pos:'n.'},
  {en:'politician',zh:'政治家',def:'One engaged in politics, especially an elected or appointed government official.',phonetic:'/ˈpɒl.ɪ.tɪʃ.ən/',pos:'n.'},
  {en:'politics',zh:'政治',def:'To engage in political activity; politick.',phonetic:'/ˈpɒl.ɪ.tɪks/',pos:'n.'},
  {en:'pollution',zh:'污染',def:'The desecration of something holy or sacred; defilement, profanation.',phonetic:'/pəˈl(j)uːʃn̩/',pos:'n.'},
  {en:'pond',zh:'池塘',def:'An inland body of standing water, either natural or man-made, that is smaller than a lake.',phonetic:'/pɒnd/',pos:'n.'},
  {en:'pool',zh:'游泳池',def:'A small and rather deep collection of (usually) fresh water, as one supplied by a spring, or occurring in the course of a stream; a reservoir for water.',phonetic:'/pul/',pos:'n.'},
  {en:'pop',zh:'流行音乐',def:'A loud, sharp sound as of a cork coming out of a bottle.',phonetic:'/pɒp/',pos:'n.'},
  {en:'porter',zh:'搬运工',def:'A person who carries luggage and related objects.',phonetic:'/ˈpɔːtə/',pos:'n.'},
  {en:'postcard',zh:'明信片',def:'A rectangular piece of thick paper or thin cardboard intended to be written on and mailed without an envelope. In the case of a picture postcard one side carries a picture or photograph.',phonetic:'/ˈpoʊstˌkɑɹd/',pos:'n.'},
  {en:'potential',zh:'潜在的',def:'Currently unrealized ability (with the most common adposition being to)',phonetic:'/pəˈtɛnʃəl/',pos:'adj.'},
  {en:'pound',zh:'英镑',def:'A unit of mass equal to 16 avoirdupois ounces (= 453.592 37 g). Today this value is the most common meaning of "pound" as a unit of weight.',phonetic:'/paʊnd/',pos:'n.'},
  {en:'pray',zh:'祈祷',def:'To direct words and/or thoughts to God or any higher being, for the sake of adoration, thanks, petition for help, etc.',phonetic:'/pɹeɪ/',pos:'v.'},
  {en:'pregnant',zh:'怀孕的',def:'A pregnant person.',phonetic:'/ˈpɹɛɡnənt/',pos:'adj.'},
  {en:'prescription',zh:'处方',def:'The act of prescribing a rule, law, etc..',phonetic:'/pɝˈskɹɪpʃən/',pos:'n.'},
  {en:'pride',zh:'骄傲',def:'The quality or state of being proud; an unreasonable overestimation of one\'s own superiority in terms of talents, looks, wealth, importance etc., which manifests itself in lofty airs, distance, reserve and often contempt of others.',phonetic:'/pɹaɪd/',pos:'n.'},
  {en:'priest',zh:'神父',def:'A religious clergyman (clergywoman, clergyperson) who is trained to perform services or sacrifices at a church or temple',phonetic:'/ˈpɹiːst/',pos:'n.'},
  {en:'principal',zh:'校长',def:'The money originally invested or loaned, on which basis interest and returns are calculated.',phonetic:'/ˈpɹɪnsəpəl/',pos:'n.'},
  {en:'printer',zh:'打印机',def:'One who makes prints.',phonetic:'/ˈpɹɪntə(ɹ)/',pos:'n.'},
  {en:'prisoner',zh:'囚犯',def:'A person incarcerated in a prison, while on trial or serving a sentence.',phonetic:'/ˈpɹɪzənəɹ/',pos:'n.'},
  {en:'procedure',zh:'程序',def:'A particular method for performing a task.',phonetic:'/pɹəˈsiːdʒə/',pos:'n.'},
  {en:'producer',zh:'制片人',def:'An individual or organization that creates goods and services.',phonetic:'/pɹəˈdjuːsə/',pos:'n.'},
  {en:'production',zh:'生产',def:'The act of producing, making or creating something.',phonetic:'/pɹəˈdʌkʃən/',pos:'n.'},
  {en:'profession',zh:'职业',def:'A declaration of belief, faith or one\'s opinion, whether genuine or pretended.',phonetic:'/pɹəˈfɛʃən/',pos:'n.'},
  {en:'professional',zh:'专业的；专业人士',def:'Relating to a paid occupation or skilled work.',phonetic:'/prəˈfeʃənl/',pos:'adj./n.'},
  {en:'professor',zh:'教授',def:'The most senior rank for an academic at a university or similar institution, informally also known as "full professor." Abbreviated Prof.',phonetic:'/pɹəˈfɛsə/',pos:'n.'},
  {en:'profit',zh:'利润',def:'Total income or cash flow minus expenditures. The money or other benefit a non-governmental organization or individual receives in exchange for products and services sold at an advertised price.',phonetic:'/ˈpɹɒfɪt/',pos:'n.'},
  {en:'progressive',zh:'进步的',def:'A person who actively favors or strives for progress towards improved conditions, as in society or government.',phonetic:'/pɹəˈɡɹɛsɪv/',pos:'adj.'},
  {en:'promote',zh:'促进；晋升',def:'To raise (someone) to a more important, responsible, or remunerative job or rank.',phonetic:'/pɹəˈməʊt/',pos:'v.'},
  {en:'promotion',zh:'晋升',def:'An advancement in rank or position.',phonetic:'/pɹəˈməʊʃən/',pos:'n.'},
  {en:'property',zh:'财产',def:'Something that is owned.',phonetic:'/ˈpɹɒp.ət.i/',pos:'n.'},
  {en:'publication',zh:'出版',def:'The act of publishing printed or other matter.',phonetic:'/ˌpʌblɪˈkeɪʃən/',pos:'n.'},
  {en:'publicity',zh:'宣传',def:'Advertising or other activity designed to rouse public interest in something.',phonetic:'',pos:'n.'},
  {en:'pump',zh:'泵',def:'A device for moving or compressing a liquid or gas.',phonetic:'/pʌmp/',pos:'n.'},
  {en:'punishment',zh:'惩罚',def:'The act or process of punishing, imposing and/or applying a sanction.',phonetic:'/ˈpʌnɪʃmənt/',pos:'n.'},
  {en:'pure',zh:'纯的',def:'One who, or that which, is pure.',phonetic:'/ˈpjɔː/',pos:'adj.'},
  {en:'purse',zh:'钱包',def:'A small bag for carrying money.',phonetic:'/pɜːs/',pos:'n.'},
  {en:'puzzle',zh:'拼图',def:'Anything that is difficult to understand or make sense of.',phonetic:'/ˈpʌzəl/',pos:'n.'},
  {en:'quiz',zh:'测验',def:'An odd, puzzling or absurd person or thing.',phonetic:'/kwɪz/',pos:'n.'},
  {en:'racket',zh:'球拍',def:'A racquet: an implement with a handle connected to a round frame strung with wire, sinew, or plastic cords, and used to hit a ball, such as in tennis or a birdie in badminton.',phonetic:'/ˈɹækɪt/',pos:'n.'},
  {en:'radar',zh:'雷达',def:'A method of detecting distant objects and determining their position, velocity, or other characteristics by analysis of sent radio waves (usually microwaves) reflected from their surfaces',phonetic:'/ˈɹeɪdɑː(ɹ)/',pos:'n.'},
  {en:'rail',zh:'铁路',def:'A horizontal bar extending between supports and used for support or as a barrier; a railing.',phonetic:'/ɹeɪl/',pos:'n.'},
  {en:'railroad',zh:'铁路',def:'A permanent road consisting of fixed metal rails to drive trains or similar motorized vehicles on.',phonetic:'/ˈɹeɪlɹəʊd/',pos:'n.'},
  {en:'raincoat',zh:'雨衣',def:'A waterproof coat to be worn in the rain.',phonetic:'/ˈɹeɪnkəʊt/',pos:'n.'},
  {en:'rank',zh:'等级',def:'Strong of its kind or in character; unmitigated; virulent; thorough; utter (used of negative things).',phonetic:'/ɹæŋk/',pos:'n.'},
  {en:'rap',zh:'说唱',def:'A sharp blow with something hard.',phonetic:'/ɹæp/',pos:'n.'},
  {en:'rate',zh:'比率',def:'The worth of something; value.',phonetic:'/ɹeɪt/',pos:'n.'},
  {en:'realize',zh:'意识到',def:'To make real; to convert from the imaginary or fictitious into reality; to bring into real existence',phonetic:'/ˈɹɪə.laɪz/',pos:'v.'},
  {en:'receipt',zh:'收据',def:'The act of receiving, or the fact of having been received.',phonetic:'/ɹɪˈsiːt/',pos:'n.'},
  {en:'recording',zh:'录音',def:'To make a record of information.',phonetic:'',pos:'n.'},
  {en:'recover',zh:'恢复',def:'Recovery.',phonetic:'/ɹɪˈkʌvə/',pos:'v.'},
  {en:'recycle',zh:'回收',def:'An act of recycling.',phonetic:'/ɹiˈsaɪkəl/',pos:'v.'},
  {en:'reference',zh:'参考',def:'A relationship or relation (to something).',phonetic:'/ˈɹɛf.(ə)ɹəns/',pos:'n.'},
  {en:'region',zh:'地区',def:'Any considerable and connected part of a space or surface; specifically, a tract of land or sea of considerable but indefinite extent; a country; a district; in a broad sense, a place without special reference to location or extent but viewed as an entity for geographical, social or cultural reasons.',phonetic:'/ˈɹiːd͡ʒn̩/',pos:'n.'},
  {en:'regulation',zh:'规定',def:'The act of regulating or the condition of being regulated.',phonetic:'/ˌɹɛɡjʊˈleɪʃən/',pos:'n.'},
  {en:'reindeer',zh:'驯鹿',def:'(plural: reindeer) Any Arctic and subarctic-dwelling deer of the species Rangifer tarandus, with a number of subspecies.',phonetic:'/ˈɹeɪndɪə/',pos:'n.'},
  {en:'relative',zh:'亲戚',def:'Someone in the same family; someone connected by blood, marriage, or adoption.',phonetic:'[ˈɹɛl.ə.tʰɪv]',pos:'n.'},
  {en:'release',zh:'释放',def:'The event of setting (someone or something) free (e.g. hostages, slaves, prisoners, caged animals, hooked or stuck mechanisms).',phonetic:'/ɹɪˈliːs/',pos:'n.'},
  {en:'reliable',zh:'可靠的',def:'Something or someone reliable or dependable',phonetic:'/ɹɪˈlaɪəbəl/',pos:'adj.'},
  {en:'religion',zh:'宗教',def:'Belief in a spiritual or metaphysical reality (often including at least one deity), accompanied by practices or rituals pertaining to the belief.',phonetic:'/ɹɪˈlɪdʒən/',pos:'n.'},
  {en:'reply',zh:'回复',def:'A written or spoken response; part of a conversation.',phonetic:'/ɹɪˈplaɪ/',pos:'n.'},
  {en:'republic',zh:'共和国',def:'A state where sovereignty rests with the people or their representatives, rather than with a monarch or emperor; a country with no monarchy.',phonetic:'[ɹɪˈpʌblɪk]',pos:'n.'},
  {en:'reputation',zh:'名声',def:'What somebody is known for.',phonetic:'/ˌɹɛpjʊˈteɪʃən/',pos:'n.'},
  {en:'reserve',zh:'保留；预定',def:'(behaviour) Restriction.',phonetic:'/ɹɪˈzɜːv/',pos:'n.'},
  {en:'resident',zh:'居民',def:'A person, animal or plant living at a certain location or in a certain area.',phonetic:'/ˈɹɛzɪd(ə)nt/',pos:'n.'},
  {en:'resort',zh:'度假地',def:'A place where people go for recreation, especially one with facilities such as lodgings, entertainment, and a relaxing environment.',phonetic:'/ɹɨˈzɔ(ɹ)t/',pos:'n.'},
  {en:'responsibility',zh:'责任',def:'The state of being responsible, accountable, or answerable.',phonetic:'/ɹɪˌspɑnsəˈbɪlɪɾi/',pos:'n.'},
  {en:'retire',zh:'退休',def:'The act of retiring, or the state of being retired.',phonetic:'/ɹəˈtaɪə(ɹ)/',pos:'v.'},
  {en:'reveal',zh:'揭露',def:'The outer side of a window or door frame; the jamb.',phonetic:'/ɹəˈviːl/',pos:'v.'},
  {en:'revolution',zh:'革命',def:'A political upheaval in a government or nation state characterized by great change.',phonetic:'/ˌɹɛvəˈl(j)uːʃən/',pos:'n.'},
  {en:'rhythm',zh:'节奏',def:'The variation of strong and weak elements (such as duration, accent) of sounds, notably in speech or music, over time; a beat or meter.',phonetic:'/ˈɹɪ.ð(ə)m/',pos:'n.'},
  {en:'risk',zh:'风险',def:'A possible adverse event or outcome',phonetic:'/ɹɪsk/',pos:'n.'},
  {en:'ritual',zh:'仪式',def:'Rite; a repeated set of actions',phonetic:'/ˈɹɪ.tʃu.əl/',pos:'n.'},
  {en:'roar',zh:'吼叫',def:'A long, loud, deep shout, as of rage or laughter, made with the mouth wide open.',phonetic:'/ɹɔː/',pos:'n.'},
  {en:'roast',zh:'烤',def:'A cut of meat suited to roasting',phonetic:'/ɹəʊst/',pos:'v.'},
  {en:'route',zh:'路线',def:'A course or way which is traveled or passed.',phonetic:'/ɹʉːt/',pos:'n.'},
  {en:'royal',zh:'皇家的',def:'A royal person; a member of a royal family.',phonetic:'/ˈɹɔɪəl/',pos:'adj.'},
  {en:'rug',zh:'地毯',def:'A partial covering for a floor.',phonetic:'/ɹʌɡ/',pos:'n.'},
  {en:'ruin',zh:'废墟',def:'(sometimes in the plural) The remains of a destroyed or dilapidated construction, such as a house or castle.',phonetic:'/ˈɹuː.ɪn/',pos:'n.'},
  {en:'runner',zh:'跑步者',def:'Act or instance of running, of moving rapidly using the feet.',phonetic:'/ˈɹʌnə/',pos:'n.'},
  {en:'running',zh:'跑步',def:'To move swiftly.',phonetic:'/ˈɹʌnɪŋ/',pos:'n.'},
  {en:'rush',zh:'冲；匆忙',def:'Any of several stiff plants of the genus Juncus, or the family Juncaceae, having hollow or pithy stems and small flowers, and often growing in marshes or near water.',phonetic:'/ɹʌʃ/',pos:'n.'},
  {en:'sailing',zh:'帆船运动',def:'To be impelled or driven forward by the action of wind upon sails, as a ship on water; to be impelled on a body of water by steam or other power.',phonetic:'/ˈseɪ.lɪŋ/',pos:'n.'},
  {en:'sailor',zh:'水手',def:'A person in the business of navigating ships or other vessels',phonetic:'/ˈseɪlə/',pos:'n.'},
  {en:'salad',zh:'沙拉',def:'A food made primarily of a mixture of raw or cold ingredients, typically vegetables, usually served with a dressing such as vinegar or mayonnaise.',phonetic:'/ˈsæləd/',pos:'n.'},
  {en:'salesman',zh:'销售员',def:'A man whose job it is to sell things, either in a shop/store or elsewhere.',phonetic:'',pos:'n.'},
  {en:'salt',zh:'盐',def:'A common substance, chemically consisting mainly of sodium chloride (NaCl), used extensively as a condiment and preservative.',phonetic:'/sɔlt/',pos:'n.'},
  {en:'sandal',zh:'凉鞋',def:'A type of open shoe made up of straps or bands holding a sole to the foot',phonetic:'/ˈsændəl/',pos:'n.'},
  {en:'satisfy',zh:'满足',def:'To do enough for; to meet the needs of; to fulfill the wishes or requirements of.',phonetic:'/ˈsætɪsfaɪ/',pos:'v.'},
  {en:'sausage',zh:'香肠',def:'A food made of ground meat (or meat substitute) and seasoning, packed in a section of the animal\'s intestine, or in a similarly cylindrical shaped synthetic casing; a length of this food.',phonetic:'/ˈsɑsɪd͡ʒ/',pos:'n.'},
  {en:'scarf',zh:'围巾',def:'A long, often knitted, garment worn around the neck.',phonetic:'/skɑːf/',pos:'n.'},
  {en:'scenery',zh:'风景',def:'View, natural features, landscape.',phonetic:'/ˈsiːnəɹi/',pos:'n.'},
  {en:'schedule',zh:'时间表',def:'A slip of paper; a short note.',phonetic:'/ˈskɛ.dʒu.əl/',pos:'n.'},
  {en:'scissors',zh:'剪刀',def:'One blade on a pair of scissors.',phonetic:'/ˈsɪzəz/',pos:'n.'},
  {en:'scooter',zh:'滑板车',def:'A kick scooter or push scooter; a human-powered land vehicle with a handlebar, deck and wheels that is propelled by a rider pushing off the ground.',phonetic:'/ˈskuːtə(ɹ)/',pos:'n.'},
  {en:'secretary',zh:'秘书',def:'Someone entrusted with a secret; a confidant.',phonetic:'/ˈsɛk.ɹə.tɹi/',pos:'n.'},
  {en:'seed',zh:'种子',def:'A fertilized and ripened ovule, containing an embryonic plant.',phonetic:'/siːd/',pos:'n.'},
  {en:'seek',zh:'寻找',def:'The operation of navigating through a stream.',phonetic:'/siːk/',pos:'v.'},
  {en:'selfish',zh:'自私的',def:'Holding one\'s own self-interest as the standard for decision making.',phonetic:'/ˈsɛlfɪʃ/',pos:'adj.'},
  {en:'senior',zh:'年长的',def:'An old person.',phonetic:'/ˈsiːnjə(r)/',pos:'n.'},
  {en:'sensible',zh:'明智的',def:'Sensation; sensibility.',phonetic:'/ˈsen.sə.bl̩/',pos:'adj.'},
  {en:'series',zh:'系列',def:'A number of things that follow on one after the other or are connected one after the other.',phonetic:'/ˈsɪə.ɹiːz/',pos:'n.'},
  {en:'severe',zh:'严重的',def:'Very bad or intense.',phonetic:'/sɪˈvɪə/',pos:'adj.'},
  {en:'shelf',zh:'架子',def:'A flat, rigid structure, fixed at right angles to a wall or forming a part of a cabinet, desk etc., and used to support, store or display objects.',phonetic:'/ʃɛlf/',pos:'n.'},
  {en:'shelter',zh:'庇护所',def:'A refuge, haven or other cover or protection from something.',phonetic:'/ˈʃɛltə/',pos:'n.'},
  {en:'shock',zh:'震惊',def:'A sudden, heavy impact.',phonetic:'/ʃɒk/',pos:'n.'},
  {en:'shocked',zh:'震惊的',def:'To cause to be emotionally shocked, to cause (someone) to feel surprised and upset.',phonetic:'/ʃɒkt/',pos:'adj.'},
  {en:'shocking',zh:'令人震惊的',def:'To cause to be emotionally shocked, to cause (someone) to feel surprised and upset.',phonetic:'/ˈʃɒkɪŋ/',pos:'adj.'},
  {en:'shopper',zh:'购物者',def:'A person who shops.',phonetic:'/ˈʃɔp.ə/',pos:'n.'},
  {en:'shore',zh:'海岸',def:'Land adjoining a non-flowing body of water, such as an ocean, lake or pond.',phonetic:'/ʃɔː/',pos:'n.'},
  {en:'shorts',zh:'短裤',def:'A short circuit.',phonetic:'/ʃɔː(ɹ)ts/',pos:'n.'},
  {en:'shot',zh:'射击；镜头',def:'To launch a projectile.',phonetic:'/ʃɒt/',pos:'n.'},
  {en:'shrimp',zh:'虾',def:'Any of many swimming, often edible crustaceans, chiefly of the infraorder Caridea or the suborder Dendrobranchiata, with slender legs, long whiskers and a long abdomen.',phonetic:'/ʃɹɪmp/',pos:'n.'},
  {en:'sidewalk',zh:'人行道',def:'A footpath, usually paved, at the side of a road for the use of pedestrians; a pavement (UK) or footpath (Australia, New Zealand)',phonetic:'/ˈsaɪdwɔːk/',pos:'n.'},
  {en:'sightseeing',zh:'观光',def:'To go sightseeing; to visit places of interest in a city, town or geographical area.',phonetic:'',pos:'n.'},
  {en:'signature',zh:'签名',def:'A person\'s name, written by that person, used as identification or to signify approval of accompanying material, such as a legal contract.',phonetic:'/ˈsɪɡnətʃə/',pos:'n.'},
  {en:'singer',zh:'歌手',def:'A person who sings, often professionally.',phonetic:'/ˈsɪŋə/',pos:'n.'},
  {en:'singing',zh:'唱歌',def:'To produce musical or harmonious sounds with one’s voice.',phonetic:'/ˈsɪŋɪŋ/',pos:'n.'},
  {en:'sink',zh:'水槽',def:'A basin used for holding water for washing.',phonetic:'/sɪŋk/',pos:'n.'},
  {en:'skate',zh:'滑冰',def:'A light boot, fitted with a blade, used for ice skating.',phonetic:'/skeɪt/',pos:'n.'},
  {en:'skateboard',zh:'滑板',def:'A narrow, wooden or plastic platform mounted on pairs of wheels, on which one stands and propels oneself by pushing along the ground with one foot.',phonetic:'',pos:'n.'},
  {en:'skull',zh:'头骨',def:'The main bones of the head considered as a unit; including the cranium, facial bones, and mandible.',phonetic:'/skʌl/',pos:'n.'},
  {en:'sled',zh:'雪橇',def:'A small, light vehicle with runners, used recreationally, mostly by children, for sliding down snow-covered hills. (A "sled" in this sense is not pulled by an animal as a "sleigh" is.)',phonetic:'/slɛd/',pos:'n.'},
  {en:'sleeve',zh:'袖子',def:'The part of a garment that covers the arm.',phonetic:'/sliːv/',pos:'n.'},
  {en:'slim',zh:'苗条的',def:'A type of cigarette substantially longer and thinner than normal cigarettes.',phonetic:'/slɪm/',pos:'adj.'},
  {en:'snack',zh:'零食',def:'A light meal.',phonetic:'/snæk/',pos:'n.'},
  {en:'snake',zh:'蛇',def:'A legless reptile of the sub-order Serpentes with a long, thin body and a fork-shaped tongue.',phonetic:'/ˈsneɪk/',pos:'n.'},
  {en:'sneeze',zh:'打喷嚏',def:'An act of sneezing.',phonetic:'/sniːz/',pos:'v.'},
  {en:'snow',zh:'雪',def:'The frozen, crystalline state of water that falls as precipitation.',phonetic:'/snəʊ/',pos:'n.'},
  {en:'snowball',zh:'雪球',def:'A ball of snow, usually one made in the hand and thrown for amusement in a snowball fight; also a larger ball of snow made by rolling a snowball around in snow that sticks to it and increases its diameter.',phonetic:'/ˈsnoʊbɑl/',pos:'n.'},
  {en:'snowboard',zh:'滑雪板',def:'A board, somewhat like a broad ski, or a very long skateboard with no wheels, used in the sport of snowboarding.',phonetic:'/ˈsnəʊˌbɔːd/',pos:'n.'},
  {en:'snowman',zh:'雪人',def:'A humanoid figure made with large snowballs stacked on each other. Human traits like a face and arms may be fashioned with sticks (arms), a carrot (nose), and stones or coal (eyes, mouth).',phonetic:'/ˈsnəʊ.mæn/',pos:'n.'},
  {en:'software',zh:'软件',def:'Encoded computer instructions, usually modifiable (unless stored in some form of unalterable memory such as ROM).',phonetic:'/ˈsɑftˌwɛɹ/',pos:'n.'},
  {en:'sorrow',zh:'悲伤',def:'Unhappiness, woe',phonetic:'/ˈsɔɹoʊ/',pos:'n.'},
  {en:'soul',zh:'灵魂',def:'The spirit or essence of a person usually thought to consist of one\'s thoughts and personality. Often believed to live on after the person\'s death.',phonetic:'/səʊl/',pos:'n.'},
  {en:'soup',zh:'汤',def:'Any of various dishes commonly made by combining liquids, such as water or stock with other ingredients, such as meat and vegetables, that contribute flavor and texture.',phonetic:'/suːp/',pos:'n.'},
  {en:'sour',zh:'酸的',def:'The sensation of a sour taste.',phonetic:'/ˈsaʊə/',pos:'adj.'},
  {en:'souvenir',zh:'纪念品',def:'An item of sentimental value, to remember an event or location.',phonetic:'/ˌsuːvəˈnɪə(ɹ)/',pos:'n.'},
  {en:'spare',zh:'空闲的；抽出',def:'The act of sparing; moderation; restraint.',phonetic:'/ˈspɛə(ɹ)/',pos:'n.'},
  {en:'speaker',zh:'扬声器',def:'One who speaks.',phonetic:'/ˈspiːkə/',pos:'n.'},
  {en:'specialist',zh:'专家',def:'A person who is highly skilled in a specific field or area.',phonetic:'/ˈspeʃəlɪst/',pos:'n.'},
  {en:'spicy',zh:'辛辣的',def:'Of, pertaining to, or containing spice.',phonetic:'',pos:'adj.'},
  {en:'spooky',zh:'阴森恐怖的',def:'Eerie, or suggestive of ghosts or the supernatural.',phonetic:'/spuːki/',pos:'adj.'},
  {en:'spouse',zh:'配偶',def:'A person in a marriage or marital relationship.',phonetic:'/spaʊs/',pos:'n.'},
  {en:'stadium',zh:'体育场',def:'A venue where sporting events are held.',phonetic:'/ˈsteɪ.di.əm/',pos:'n.'},
  {en:'staff',zh:'员工',def:'(plural staffs or staves) A long, straight, thick wooden rod or stick, especially one used to assist in walking.',phonetic:'/ˈstæf/',pos:'n.'},
  {en:'stair',zh:'楼梯',def:'A single step in a staircase.',phonetic:'/stɛə/',pos:'n.'},
  {en:'standard',zh:'标准',def:'A principle or example or measure used for comparison.',phonetic:'/ˈstændəd/',pos:'n.'},
  {en:'starve',zh:'挨饿',def:'To die; in later use especially to die slowly, waste away.',phonetic:'/stɑːv/',pos:'v.'},
  {en:'statue',zh:'雕像',def:'A three-dimensional work of art, usually representing a person or animal, usually created by sculpting, carving, molding, or casting.',phonetic:'/ˈstæt.juː/',pos:'n.'},
  {en:'steady',zh:'稳定的',def:'A rest or support, as for the hand, a tool, or a piece of work.',phonetic:'/ˈstɛdi/',pos:'adj.'},
  {en:'steak',zh:'牛排',def:'Beefsteak, a slice of beef, broiled or cut for broiling.',phonetic:'/steɪk/',pos:'n.'},
  {en:'steam',zh:'蒸汽',def:'The vapor formed when water changes from liquid phase to gas phase.',phonetic:'/stiːm/',pos:'n.'},
  {en:'steer',zh:'驾驶',def:'A suggestion about a course of action.',phonetic:'/stɪə(ɹ)/',pos:'v.'},
  {en:'stepbrother',zh:'继兄弟',def:'The son of one\'s stepparent who is not the son of either of one\'s biological parents.',phonetic:'',pos:'n.'},
  {en:'stomachache',zh:'胃痛',def:'A pain in the abdomen, often caused by indigestion. (The pain is usually lower than the stomach and related to the intestines.)',phonetic:'/ˈstʌməkˌeɪk/',pos:'n.'},
  {en:'storage',zh:'存储',def:'The act of storing goods; the state of being stored.',phonetic:'/ˈstɔ.ɹɪd͡ʒ/',pos:'n.'},
  {en:'stove',zh:'炉子',def:'A heater, a closed apparatus to burn fuel for the warming of a room.',phonetic:'/stəʊv/',pos:'n.'},
  {en:'stressful',zh:'有压力的',def:'Irritating; causing stress.',phonetic:'/ˈstɹɛsfəl/',pos:'adj.'},
  {en:'strict',zh:'严格的',def:'Strained; drawn close; tight.',phonetic:'/stɹɪkt/',pos:'adj.'},
  {en:'strike',zh:'罢工',def:'A status resulting from a batter swinging and missing a pitch, or not swinging at a pitch when the ball goes in the strike zone, or hitting a foul ball that is not caught.',phonetic:'/stɹaɪk/',pos:'n.'},
  {en:'studio',zh:'工作室',def:'An artist’s or photographer’s workshop or the room in which an artist works.',phonetic:'/ˈstjuːdiəʊ/',pos:'n.'},
  {en:'style',zh:'风格',def:'Senses relating to a thin, pointed object.',phonetic:'/staɪl/',pos:'n.'},
  {en:'submarine',zh:'潜艇',def:'A boat that can go underwater.',phonetic:'/sʌb.məˈɹiːn/',pos:'n.'},
  {en:'subtract',zh:'减去',def:'To remove or reduce; especially to reduce a quantity or number',phonetic:'/səbˈtɹækt/',pos:'v.'},
  {en:'suit',zh:'西装',def:'A set of clothes to be worn together, now especially a man\'s matching jacket and trousers (also business suit or lounge suit), or a similar outfit for a woman.',phonetic:'/s(j)uːt/',pos:'n.'},
  {en:'suitcase',zh:'行李箱',def:'A large (usually rectangular) piece of luggage used for carrying clothes, and sometimes suits, when travelling.',phonetic:'/ˈsutkeɪs/',pos:'n.'},
  {en:'sum',zh:'总和',def:'A quantity obtained by addition or aggregation.',phonetic:'/sʌm/',pos:'n.'},
  {en:'sunglasses',zh:'太阳镜',def:'Tinted glasses worn to protect the eyes from the sun.',phonetic:'',pos:'n.'},
  {en:'sunset',zh:'日落',def:'The time of day when the sun disappears below the western horizon.',phonetic:'/ˈsʌnˌsɛt/',pos:'n.'},
  {en:'supermarket',zh:'超市',def:'A large self-service store that sells groceries and, usually, medications, household goods and/or clothing.',phonetic:'/ˌsuːpəˈmɑːkɪt/',pos:'n.'},
  {en:'supper',zh:'晚餐',def:'Food consumed before going to bed.',phonetic:'/ˈsʌpə/',pos:'n.'},
  {en:'surfing',zh:'冲浪',def:'To ride a wave, usually on a surfboard.',phonetic:'/ˈsɝfɪŋ/',pos:'n.'},
  {en:'surgery',zh:'外科手术',def:'A procedure involving major incisions to remove, repair, or replace a part of a body.',phonetic:'/ˈsɜːdʒəɹi/',pos:'n.'},
  {en:'suspicion',zh:'怀疑',def:'The act of suspecting something or someone, especially of something wrong.',phonetic:'/sə.ˈspɪ.ʃən/',pos:'n.'},
  {en:'sweat',zh:'汗水',def:'Fluid that exits the body through pores in the skin usually due to physical stress and/or high temperature for the purpose of regulating body temperature and removing certain compounds from the circulation.',phonetic:'/swɛt/',pos:'n.'},
  {en:'sweater',zh:'毛衣',def:'A knitted jacket or jersey, usually of thick wool, worn by athletes before or after exercise.',phonetic:'/ˈswetə/',pos:'n.'},
  {en:'sweatshirt',zh:'运动衫',def:'A loose shirt, usually made of a knit fleece, for athletic wear and now often used as casual apparel.',phonetic:'',pos:'n.'},
  {en:'swimsuit',zh:'泳衣',def:'A garment worn for swimming.',phonetic:'',pos:'n.'},
  {en:'swing',zh:'秋千',def:'The manner in which something is swung.',phonetic:'/ˈswɪŋ/',pos:'n.'},
  {en:'switch',zh:'开关',def:'A bundle of thin sticks, typically made of wood, sometimes bond in such a way that binding can be moved so that it varies the tightness of the binding.',phonetic:'/swɪtʃ/',pos:'n.'},
  {en:'symptom',zh:'症状',def:'A perceived change in some function, sensation or appearance of a person that indicates a disease or disorder, such as fever, headache or rash.',phonetic:'/ˈsɪm(p)təm/',pos:'n.'},
  {en:'tablet',zh:'药片',def:'A slab of clay used for inscription.',phonetic:'/ˈtæblət/',pos:'n.'},
  {en:'tail',zh:'尾巴',def:'The caudal appendage of an animal that is attached to its posterior and near the anus.',phonetic:'/teɪl/',pos:'n.'},
  {en:'takeout',zh:'外卖',def:'Food purchased from a takeaway.',phonetic:'',pos:'n.'},
  {en:'tank',zh:'坦克',def:'A closed container for liquids or gases.',phonetic:'/tæŋk/',pos:'n.'},
  {en:'tape',zh:'胶带',def:'Flexible material in a roll with a sticky surface on one or both sides; adhesive tape.',phonetic:'/teɪ̯p/',pos:'n.'},
  {en:'tax',zh:'税',def:'Money paid to the government other than for transaction-specific goods and services.',phonetic:'/tæks/',pos:'n.'},
  {en:'taxi',zh:'出租车',def:'A vehicle that may be hired for single journeys by members of the public, driven by a taxi driver.',phonetic:'/ˈtæk.si/',pos:'n.'},
  {en:'team',zh:'团队',def:'A set of draught animals, such as two horses in front of a carriage.',phonetic:'/tiːm/',pos:'n.'},
  {en:'technical',zh:'技术的',def:'A pickup truck with a gun mounted on it.',phonetic:'/ˈtɛk.nɪk.əl/',pos:'adj.'},
  {en:'technique',zh:'技术',def:'The practical aspects of a given art, occupation etc.; formal requirements.',phonetic:'/tɛkˈniːk/',pos:'n.'},
  {en:'telephone',zh:'电话',def:'A telecommunication device (originally mechanical, and now electronic) used for two-way talking with another person (now often shortened to phone).',phonetic:'/ˈtɛləfəʊn/',pos:'n.'},
  {en:'tennis',zh:'网球',def:'A sport played by two players (or four in doubles), who alternately strike the ball over a net using racquets.',phonetic:'/ˈtɛn.ɪs/',pos:'n.'},
  {en:'tense',zh:'紧张的',def:'(grammar) Any of the forms of a verb which distinguish when an action or state of being occurs or exists.',phonetic:'/tɛns/',pos:'adj.'},
  {en:'tension',zh:'紧张',def:'The condition of being held in a state between two or more forces, which are acting in opposition to each other.',phonetic:'/ˈtɛnʃən/',pos:'n.'},
  {en:'term',zh:'学期；术语',def:'That which limits the extent of anything; limit, extremity, bound, boundary.',phonetic:'/tɜːm/',pos:'n.'},
  {en:'terminal',zh:'终点站',def:'A building in an airport where passengers transfer from ground transportation to the facilities that allow them to board airplanes.',phonetic:'/ˈtɚmɪnəl/',pos:'n.'},
  {en:'textbook',zh:'教科书',def:'A coursebook, a formal manual of instruction in a specific subject, especially one for use in schools or colleges.',phonetic:'/ˈtɛkst.bʊk/',pos:'n.'},
  {en:'therapy',zh:'治疗',def:'Attempted remediation of a health problem following a diagnosis, usually synonymous with treatment.',phonetic:'/ˈθɛɹ.ə.pi/',pos:'n.'},
  {en:'thigh',zh:'大腿',def:'The upper leg of a human, between the hip and the knee.',phonetic:'/θaɪ/',pos:'n.'},
  {en:'thoughtful',zh:'深思熟虑的',def:'Demonstrating thought or careful consideration.',phonetic:'/ˈθɔːtfəl/',pos:'adj.'},
  {en:'throat',zh:'喉咙',def:'The front part of the neck.',phonetic:'/ˈθɹəʊt/',pos:'n.'},
  {en:'tights',zh:'紧身衣',def:'A close-fitting, sheer or non-sheer skin-tight garment worn principally by women and girls that covers the body completely from the waist down, usually including the feet.',phonetic:'/taɪts/',pos:'n.'},
  {en:'tile',zh:'瓷砖',def:'A regularly-shaped slab of clay or other material, affixed to cover or decorate a surface, as in a roof-tile, glazed tile, stove tile, carpet tile etc.',phonetic:'/taɪl/',pos:'n.'},
  {en:'toast',zh:'烤面包',def:'Toasted bread.',phonetic:'/təʊst/',pos:'n.'},
  {en:'toe',zh:'脚趾',def:'Each of the five digits on the end of the foot.',phonetic:'/təʊ/',pos:'n.'},
  {en:'tomb',zh:'坟墓',def:'A small building (or "vault") for the remains of the dead, with walls, a roof, and (if it is to be used for more than one corpse) a door. It may be partly or wholly in the ground (except for its entrance) in a cemetery, or it may be inside a church proper or in its crypt. Single tombs may be permanently sealed; those for families (or other groups) have doors for access whenever needed.',phonetic:'/tuːm/',pos:'n.'},
  {en:'tone',zh:'语气',def:'A specific pitch.',phonetic:'/təʊn/',pos:'n.'},
  {en:'tooth',zh:'牙齿',def:'A hard, calcareous structure present in the mouth of many vertebrate animals, generally used for eating.',phonetic:'/tuːθ/',pos:'n.'},
  {en:'toothache',zh:'牙痛',def:'A pain or ache in a tooth.',phonetic:'/ˈtuθˌeɪk/',pos:'n.'},
  {en:'toothbrush',zh:'牙刷',def:'A brush, used with toothpaste, for cleaning the teeth.',phonetic:'/ˈtuːθbɹʌʃ/',pos:'n.'},
  {en:'tourism',zh:'旅游业',def:'The act of travelling or sightseeing, particularly away from one\'s home.',phonetic:'/tɔːɹɪz(ə)m/',pos:'n.'},
  {en:'tourist',zh:'游客',def:'Someone who travels for pleasure rather than for business.',phonetic:'/ˈtʊəɹɪst/',pos:'n.'},
  {en:'trade',zh:'贸易',def:'Buying and selling of goods and services on a market.',phonetic:'/tɹeɪd/',pos:'n.'},
  {en:'training',zh:'训练',def:'To practice an ability.',phonetic:'/ˈtɹeɪnɪŋ/',pos:'n.'},
  {en:'transit',zh:'运输',def:'The act of passing over, across, or through something.',phonetic:'/ˈtɹæn.sɪt/',pos:'n.'},
  {en:'transportation',zh:'交通',def:'The act of transporting, or the state of being transported; conveyance, often of people, goods etc.',phonetic:'/tɹænspɔːˈteɪʃən/',pos:'n.'},
  {en:'trash',zh:'垃圾',def:'Useless things to be discarded; rubbish; refuse.',phonetic:'/tɹæʃ/',pos:'n.'},
  {en:'traveler',zh:'旅行者',def:'A member of a particular nomadic ethnic minority in Ireland, the Pavee.',phonetic:'/ˈtɹæv.l̩.ɚ/',pos:'n.'},
  {en:'treatment',zh:'治疗',def:'The process or manner of treating someone or something.',phonetic:'/ˈtɹiːtmənt/',pos:'n.'},
  {en:'trial',zh:'审判',def:'An opportunity to test something out; a test.',phonetic:'/ˈtɹaɪəl/',pos:'n.'},
  {en:'tropical',zh:'热带的',def:'A tropical plant.',phonetic:'',pos:'adj.'},
  {en:'truly',zh:'真正地',def:'(manner) In accordance with the facts; truthfully, accurately.',phonetic:'/ˈtɹuːli/',pos:'adv.'},
  {en:'tshirt',zh:'T恤衫',def:'A short-sleeved casual top, typically made of cotton, having the shape of a T when laid flat.',phonetic:'/ˈtiːʃɜːt/',pos:'n.'},
  {en:'tuition',zh:'学费',def:'A sum of money paid for instruction (such as in a high school, boarding school, university, or college).',phonetic:'/ˈtjuːʃən/',pos:'n.'},
  {en:'tunnel',zh:'隧道',def:'An underground passage, often built through a hill or under a road.',phonetic:'/ˈtʌnl/',pos:'n.'},
  {en:'turtle',zh:'海龟',def:'Any land or marine reptile of the order Testudines, characterised by a protective shell enclosing its body. See also tortoise.',phonetic:'/ˈtɜːtəl/',pos:'n.'},
  {en:'tutor',zh:'导师',def:'One who teaches another (usually called a student, learner, or tutee) in a one-on-one or small-group interaction.',phonetic:'/ˈtjuːtə/',pos:'n.'},
  {en:'tutorial',zh:'教程',def:'A self-paced learning exercise; a lesson prepared so that a student can learn at their own speed, at their convenience.',phonetic:'/tʃʉˈtoːɹiəɫ/',pos:'n.'},
  {en:'twin',zh:'双胞胎',def:'Either of two people (or, less commonly, animals) who shared the same uterus at the same time; one who was born at the same birth as a sibling.',phonetic:'/twɪn/',pos:'n.'},
  {en:'underwater',zh:'水下',def:'Underlying water or body of water, for example in an aquifer or the deep ocean',phonetic:'',pos:'n.'},
  {en:'underwear',zh:'内衣',def:'Clothes worn next to the skin, underneath outer clothing.',phonetic:'/ˈʌndəwɛə/',pos:'n.'},
  {en:'unicorn',zh:'独角兽',def:'A mythical beast resembling a horse or deer with a single, straight, spiraled horn projecting from its forehead.',phonetic:'/ˈjuːnɪkɔːn/',pos:'n.'},
  {en:'union',zh:'联盟',def:'The act of uniting or joining two or more things into one.',phonetic:'/ˈjuːnjən/',pos:'n.'},
  {en:'university',zh:'大学',def:'Institution of higher education (typically accepting students from the age of about 17 or 18, depending on country, but in some exceptional cases able to take younger students) where subjects are studied and researched in depth and degrees are offered.',phonetic:'/juːnɪˈvɜːsətiː/',pos:'n.'},
  {en:'unlucky',zh:'不幸的',def:'Unfortunate, marked by misfortune.',phonetic:'/ʌnˈlʌki/',pos:'adj.'},
  {en:'update',zh:'更新',def:'An advisement providing more up-to-date information than currently known.',phonetic:'',pos:'n.'},
  {en:'upstairs',zh:'在楼上',def:'An upper storey.',phonetic:'/ˈʌpˌstɛəz/',pos:'adv.'},
  {en:'user',zh:'用户',def:'One who uses or makes use of something, a consumer/client or an express or implied licensee (free user) or a trespasser.',phonetic:'/ˈjuːzə/',pos:'n.'},
  {en:'vanilla',zh:'香草',def:'Any tropical, climbing orchid of the genus Vanilla (especially Vanilla planifolia), bearing podlike fruit yielding an extract used in flavoring food or in perfumes.',phonetic:'/vəˈnɛlə/',pos:'n.'},
  {en:'vehicle',zh:'车辆',def:'A conveyance; a device for carrying or transporting substances, objects or individuals.',phonetic:'/ˈvɪː(ə).kəl/',pos:'n.'},
  {en:'veterinarian',zh:'兽医',def:'A medical doctor who treats animals.',phonetic:'/ˌvɛt(ə)ɹəˈnɛɹi.ən/',pos:'n.'},
  {en:'via',zh:'经由',def:'A main road or highway, especially in ancient Rome. (Mainly used in set phrases, below.)',phonetic:'/ˈvaɪə/',pos:'prep.'},
  {en:'video',zh:'视频',def:'Television, television show, movie.',phonetic:'/ˈvɪ.di.əʊ/',pos:'n.'},
  {en:'villa',zh:'别墅',def:'(plural "villas") A house, often larger and more expensive than average, in the countryside or on the coast, often used as a retreat.',phonetic:'/ˈvɪlə/',pos:'n.'},
  {en:'violent',zh:'暴力的',def:'An assailant.',phonetic:'/ˈvaɪ(ə)lənt/',pos:'adj.'},
  {en:'violin',zh:'小提琴',def:'A musical four-string instrument, generally played with a bow or by plucking the string, with the pitch set by pressing the strings at the appropriate place with the fingers; also any instrument of the violin family.',phonetic:'/ˌvɑe.ɘˈlɘn/',pos:'n.'},
  {en:'virtual',zh:'虚拟的',def:'A virtual member function of a class.',phonetic:'/ˈvɵːtʃuəl/',pos:'adj.'},
  {en:'virus',zh:'病毒',def:'A submicroscopic, non-cellular structure consisting of a core of DNA or RNA surrounded by a protein coat, that requires a living host cell to replicate, and often causes disease in the host organism.',phonetic:'/ˈvaɪɹəs/',pos:'n.'},
  {en:'vocabulary',zh:'词汇',def:'A usually alphabetized and explained collection of words e.g. of a particular field, or prepared for a specific purpose, often for learning.',phonetic:'/vəʊˈkabjʊləɹɪ/',pos:'n.'},
  {en:'volleyball',zh:'排球',def:'A game played on a rectangular court between two teams of two to six players which involves striking a ball back and forth over a net.',phonetic:'/ˈvɒlibɔ(ː)l/',pos:'n.'},
  {en:'volume',zh:'音量；体积',def:'A three-dimensional measure of space that comprises a length, a width and a height. It is measured in units of cubic centimeters in metric, cubic inches or cubic feet in English measurement.',phonetic:'/ˈvɒl.juːm/',pos:'n.'},
  {en:'voodoo',zh:'伏都教',def:'Any of a group of related religious practices found chiefly in and around the Caribbean, particularly in Haiti and Louisiana.',phonetic:'/ˈvuːduː/',pos:'n.'},
  {en:'wage',zh:'工资',def:'(often in plural) An amount of money paid to a worker for a specified quantity of work, usually calculated on an hourly basis and expressed in an amount of money per hour.',phonetic:'/weɪd͡ʒ/',pos:'n.'},
  {en:'waist',zh:'腰部',def:'The part of the body between the pelvis and the stomach.',phonetic:'/weɪst/',pos:'n.'},
  {en:'wallet',zh:'钱包',def:'A small case, often flat and often made of leather, for keeping money (especially paper money), credit cards, etc.',phonetic:'/ˈwɒlɪt/',pos:'n.'},
  {en:'wallpaper',zh:'墙纸',def:'Decorative paper-like material used to cover the inner walls of buildings.',phonetic:'',pos:'n.'},
  {en:'watermelon',zh:'西瓜',def:'A plant of the species Citrullus lanatus, bearing a melon-like fruit.',phonetic:'/ˈwɔːtəˌmɛlən/',pos:'n.'},
  {en:'website',zh:'网站',def:'A collection of interlinked web pages on the World Wide Web that are typically accessible from the same base URL and reside on the same server.',phonetic:'/ˈwɛbˌsaɪt/',pos:'n.'},
  {en:'werewolf',zh:'狼人',def:'A person who is transformed or can transform into a wolf or a wolflike human, often said to transform during a full moon.',phonetic:'/ˈwɛːwʊlf/',pos:'n.'},
  {en:'whistle',zh:'口哨',def:'A device designed to be placed in the mouth and blown, or driven by steam or some other mechanism, to make a whistling sound.',phonetic:'/wɪsl̩/',pos:'n.'},
  {en:'white',zh:'白色',def:'The color/colour of snow or milk; the colour of light containing equal amounts of all visible wavelengths.',phonetic:'/waɪt/',pos:'n.'},
  {en:'whiteboard',zh:'白板',def:'A writing board finished with a hard white material, which can be written upon using special non-permanent markers and subsequently wiped clean.',phonetic:'/ˈwaɪtbɔːd/',pos:'n.'},
  {en:'widow',zh:'寡妇',def:'A woman whose spouse has died (and who has not remarried); feminine of widower.',phonetic:'/ˈwɪ.dəʊ/',pos:'n.'},
  {en:'wildlife',zh:'野生动物',def:'Animals, plants, and fungi, not normally domesticated, often to the exclusion of plants, fungi, fish, insects and other invertebrates, and microscopic plants and animals; hence:',phonetic:'/ˈwaɪldlaɪf/',pos:'n.'},
  {en:'wind',zh:'风',def:'Real or perceived movement of atmospheric air usually caused by convection or differences in air pressure.',phonetic:'/ˈwaɪnd/',pos:'n.'},
  {en:'winner',zh:'获胜者',def:'One who has won or often wins.',phonetic:'/ˈwɪnə/',pos:'n.'},
  {en:'witch',zh:'女巫',def:'A person who practices witchcraft; a woman or man who practices witchcraft.',phonetic:'/wɪtʃ/',pos:'n.'},
  {en:'wolf',zh:'狼',def:'The gray wolf, specifically all subspecies of the gray wolf (Canis lupus) that are not dingoes or dogs.',phonetic:'/wʊlf/',pos:'n.'},
  {en:'wonderful',zh:'精彩的',def:'Tending to excite wonder; surprising, extraordinary.',phonetic:'/ˈwʌn.də.fl/',pos:'adj.'},
  {en:'worm',zh:'蠕虫',def:'A generally tubular invertebrate of the annelid phylum; an earthworm.',phonetic:'/wɜːm/',pos:'n.'},
  {en:'wrist',zh:'手腕',def:'The complex joint between forearm bones, carpus, and metacarpals where the hand is attached to the arm; the carpus in a narrow sense.',phonetic:'/ɹɪst/',pos:'n.'},
  {en:'writer',zh:'作家',def:'A person who writes, or produces literary work.',phonetic:'/ˈɹaɪ.tə/',pos:'n.'},
  {en:'yard',zh:'院子',def:'A small, usually uncultivated area adjoining or (now especially) within the precincts of a house or other building.',phonetic:'/jɑːd/',pos:'n.'},
  {en:'yogurt',zh:'酸奶',def:'A milk-based product stiffened by a bacterium-aided curdling process, and sometimes mixed with fruit or other flavoring.',phonetic:'/ˈjəʉɡət/',pos:'n.'},
  {en:'zookeeper',zh:'动物园管理员',def:'A person employed at a zoo to attend to the animals.',phonetic:'',pos:'n.'},
  {en:'access',zh:'访问；进入',def:'A way or means of approaching or entering; an entrance; a passage.',phonetic:'/ˈæksɛs/',pos:'n.'},
  {en:'ache',zh:'疼痛',def:'Continued dull pain, as distinguished from sudden twinges, or spasmodic pain.',phonetic:'/eɪk/',pos:'n.'},
  {en:'advertise',zh:'做广告',def:'To give (especially public) notice of (something); to announce publicly.',phonetic:'/ˈadvə(ɹ)taɪz/',pos:'v.'},
  {en:'aged',zh:'年老的',def:'To cause to grow old; to impart the characteristics of age to.',phonetic:'/eɪdʒd/',pos:'adj.'},
  {en:'alive',zh:'活着的',def:'Having life; living; not dead',phonetic:'/əˈlaɪv/',pos:'adj.'},
  {en:'anniversary',zh:'周年纪念日',def:'A day that is an exact number of years (to the day) since a given significant event occurred. Often preceded by an ordinal number indicating the number of years.',phonetic:'/ˌænɪˈvɜːs(ə)ɹi/',pos:'n.'},
  {en:'annual',zh:'每年的',def:'An annual publication; a book, periodical, journal, report, comic book, yearbook, etc., which is published serially once a year, which may or may not be in addition to regular weekly or monthly publication.',phonetic:'/ˈæn.ju.əl/',pos:'adj.'},
  {en:'appearance',zh:'外貌；出现',def:'The act of appearing or coming into sight; the act of becoming visible to the eye.',phonetic:'/əˈpɪəɹəns/',pos:'n.'},
  {en:'average',zh:'平均；平均的',def:'The typical or normal amount, rate, or quality.',phonetic:'/ˈævərɪdʒ/',pos:'n./adj.'},
  {en:'benefit',zh:'好处；受益',def:'An advantage; help or aid from something.',phonetic:'/ˈbɛn.ɪ.fɪt/',pos:'n.'},
  {en:'bleed',zh:'流血',def:'An incident of bleeding, as in haemophilia.',phonetic:'/ˈbliːd/',pos:'v.'},
  {en:'clap',zh:'鼓掌',def:'The act of striking the palms of the hands, or any two surfaces, together.',phonetic:'/klæp/',pos:'n.'},
  {en:'clearly',zh:'清楚地',def:'(manner) In a clear manner.',phonetic:'/ˈkliːɹli/',pos:'adv.'},
  {en:'comic book',zh:'漫画书',def:'A book or magazine that uses sequences of drawings to tell a story or series of stories, primarily in serialized form, usually fiction.',phonetic:'',pos:'n.'},
  {en:'comment',zh:'评论',def:'A spoken or written remark.',phonetic:'/ˈkɒmɛnt/',pos:'n.'},
  {en:'companion',zh:'同伴',def:'A friend, acquaintance, or partner; someone with whom one spends time or keeps company',phonetic:'/kəmˈpænjən/',pos:'n.'},
  {en:'condition',zh:'条件；状况',def:'A logical clause or phrase that a conditional statement uses. The phrase can either be true or false.',phonetic:'/kənˈdɪʃən/',pos:'n.'},
  {en:'context',zh:'上下文；背景',def:'The surroundings, circumstances, environment, background or settings that determine, specify, or clarify the meaning of an event or other occurrence.',phonetic:'/ˈkɒntɛkst/',pos:'n.'},
  {en:'conversation',zh:'对话',def:'Expression and exchange of individual ideas through talking with other people; also, a set instance or occasion of such talking.',phonetic:'/ˌkɒn.vəˈseɪ.ʃən/',pos:'n.'},
  {en:'deal',zh:'交易；处理',def:'A division, a portion, a share.',phonetic:'/diːl/',pos:'n.'},
  {en:'detective',zh:'侦探',def:'(law enforcement) A police officer who looks for evidence as part of solving a crime; an investigator.',phonetic:'/dɪˈtɛktɪv/',pos:'n.'},
  {en:'director',zh:'导演；主管',def:'One who directs; the person in charge of managing a department or directorate (e.g., director of engineering), project, or production (as in a show or film, e.g., film director).',phonetic:'/daɪˈɹɛktə(ɹ)/',pos:'n.'},
  {en:'duty',zh:'职责',def:'That which one is morally or legally obligated to do.',phonetic:'/ˈdjuːti/',pos:'n.'},
  {en:'elf',zh:'精灵',def:'A luminous spirit presiding over nature and fertility and dwelling in the world of Álfheim (Elfland). Compare angel, nymph, fairy.',phonetic:'/ɛlf/',pos:'n.'},
  {en:'evil',zh:'邪恶的',def:'Moral badness; wickedness; malevolence; the forces or behaviors that are the opposite or enemy of good.',phonetic:'/ˈivəl/',pos:'n.'},
  {en:'father-in-law',zh:'岳父；公公',def:'One\'s spouse\'s father.',phonetic:'',pos:'n.'},
  {en:'full-time',zh:'全职的',def:'Involving a full amount of time spent on some activity, especially a job.',phonetic:'',pos:'adj.'},
  {en:'horn',zh:'角；喇叭',def:'A hard growth of keratin that protrudes from the top of the head of certain animals, usually paired.',phonetic:'/hɔːn/',pos:'n.'},
  {en:'merry',zh:'快乐的',def:'Jolly and full of high spirits.',phonetic:'/ˈmɛɹi/',pos:'adj.'},
  {en:'powerful',zh:'强大的',def:'Having, or capable of exerting power, potency or influence.',phonetic:'/ˈpaʊəfl/',pos:'adj.'},
  {en:'reporter',zh:'记者',def:'Someone or something that reports.',phonetic:'/ɹɪˈpɔːtə/',pos:'n.'},
  {en:'scary',zh:'可怕的',def:'Causing or able to cause fright.',phonetic:'/ˈskɛəɹi/',pos:'adj.'},
  {en:'silly',zh:'愚蠢的',def:'A silly person.',phonetic:'/ˈsɪli/',pos:'adj.'},
  {en:'slice',zh:'薄片；切片',def:'That which is thin and broad.',phonetic:'/slaɪs/',pos:'n.'},
  {en:'sorry',zh:'抱歉的',def:'The act of saying sorry; an apology.',phonetic:'/ˈsɔɹi/',pos:'adj.'},
  {en:'stamp',zh:'邮票',def:'An act of stamping the foot, paw or hoof.',phonetic:'/stæmp/',pos:'n.'},
  {en:'straw',zh:'吸管；稻草',def:'A dried stalk of a cereal plant.',phonetic:'/stɹɔː/',pos:'n.'},
  {en:'strawberry',zh:'草莓',def:'The sweet, usually red, edible fruit of certain plants of the genus Fragaria.',phonetic:'/ˈstɹɔːb(ə)ɹi/',pos:'n.'},
  {en:'sure',zh:'确信的',def:'Physically secure and certain, non-failing, reliable.',phonetic:'/ʃoː/',pos:'adj.'},
  {en:'surprised',zh:'惊讶的',def:'To cause (someone) to feel unusually alarmed or delighted by something unexpected.',phonetic:'/səˈpɹaɪzd/',pos:'adj.'},
  {en:'t-shirt',zh:'T恤',def:'A lightweight shirt without buttons, usually with short sleeves and no collar. Often made of cotton and frequently bears a picture or slogan.',phonetic:'',pos:'n.'},
  {en:'tire',zh:'轮胎',def:'To become sleepy or weary.',phonetic:'/ˈtʌɪ̯ɚ/',pos:'n.'},
  {en:'parking lot',zh:'停车场',def:'An open area, generally paved, where automobiles may be left when not in use.',phonetic:'',pos:'n.'},
  {en:'neat',zh:'整洁的',def:'An artificial intelligence researcher who believes that solutions should be elegant, clear and provably correct. Compare scruffy.',phonetic:'/niːt/',pos:'adj.'},
  {en:'gold',zh:'金子；金色',def:'A heavy yellow elemental metal of great value, with atomic number 79 and symbol Au.',phonetic:'/ɡɒʊld/',pos:'n.'},
  {en:'grapefruit',zh:'葡萄柚',def:'The tree of the species Citrus paradisi, a hybrid of pomelo (Citrus maxima) and sweet orange.',phonetic:'/ˈɡɹeɪp.fɹuːt/',pos:'n.'},
  {en:'living room',zh:'客厅',def:'A room in a private house used for general social and leisure activities.',phonetic:'',pos:'n.'},
  {en:'melon',zh:'瓜；甜瓜',def:'Any of various plants of the family Cucurbitaceae grown for food, generally not including the cucumber.',phonetic:'/ˈmɛlən/',pos:'n.'},
  {en:'milkshake',zh:'奶昔',def:'A thick beverage consisting of milk and ice cream mixed together, often with fruit, chocolate, or other flavoring.',phonetic:'[ˈmɪɫk.ʃeɪk]',pos:'n.'},
  {en:'bravery',zh:'勇敢',def:'Courageous behavior or character.',phonetic:'/ˈbreɪvəri/',pos:'n.'},
  {en:'bury',zh:'埋葬',def:'To put a dead body into the ground.',phonetic:'/ˈberi/',pos:'v.'},
  {en:'dig',zh:'挖（过去式 dug，过去分词 dug）',def:'To break up or remove earth or sand using a tool or hands.',phonetic:'/dɪɡ/',pos:'v.'},
  {en:'earthquake',zh:'地震',def:'A sudden shaking of the ground, often causing destruction.',phonetic:'/ˈɜːθkweɪk/',pos:'n.'},
  {en:'fallen',zh:'倒下的',def:'Having dropped or come down from a higher position.',phonetic:'/ˈfɔːlən/',pos:'adj.'},
  {en:'mole',zh:'鼹鼠',def:'A small, burrowing mammal with dark velvety fur and small eyes.',phonetic:'/məʊl/',pos:'n.'},
  {en:'psychologist',zh:'心理学家',def:'A person who studies and treats the human mind and behavior.',phonetic:'/saɪˈkɒlədʒɪst/',pos:'n.'},
  {en:'rescue',zh:'援救',def:'To save or deliver from danger or harm; an act of saving or delivering.',phonetic:'/ˈreskjuː/',pos:'v./n.'},
  {en:'tsunami',zh:'海啸',def:'A long high sea wave caused by an earthquake or other disturbance.',phonetic:'/suːˈnɑːmi/',pos:'n.'},
  {en:'volunteer',zh:'志愿者；志愿做某事',def:'A person who offers to do something willingly or without pay.',phonetic:'/ˌvɒlənˈtɪə/',pos:'n./v.'},
  {en:'zone',zh:'区域',def:'An area or stretch of land with a particular characteristic or use.',phonetic:'/zəʊn/',pos:'n.'}
];

// ============================================================================
// TEXTBOOK STORAGE — User-extensible textbook vocabulary bank (localStorage)
// Each user has their own textbooks stored under vocab_champion_textbooks_{userId}
// Seeded with Think 2 Unit 1 on first load as a starter example.
// ============================================================================
// Build: {name,publisher,grade,unitCount,searchAliases:[], units:[{name,words}]}
// words===null means "no embedded data — needs fetch or paste"
// ============================================================================
let _TEXTBOOK_DB_CACHE=null;
function getTextbookDB(){
  if(_TEXTBOOK_DB_CACHE)return _TEXTBOOK_DB_CACHE;
  try{
    var all=genTextbookDB();
    var keep=[
      'Cambridge Think 2 (2nd Ed.) B1',
      '1000 Basic English Words 1 (Pre-A1)','1000 Basic English Words 2 (A1)',
      '1000 Basic English Words 3 (A2)','1000 Basic English Words 4 (A2+)',
      '2000 Core English Words 1 (A2+)','2000 Core English Words 2 (B1)',
      '2000 Core English Words 3 (B1+)','2000 Core English Words 4 (B2)'
    ];
    _TEXTBOOK_DB_CACHE=all.filter(function(t){return keep.indexOf(t.n)>=0;});
  }catch(e){console.error('genTextbookDB failed:',e);_TEXTBOOK_DB_CACHE=[];}
  return _TEXTBOOK_DB_CACHE;
}
function getTextbookStorageKey(){return 'vocab_champion_textbooks_'+getActiveUserId();}
function getTextbooksData(){
  try{
    const raw=localStorage.getItem(getTextbookStorageKey());
    return raw?JSON.parse(raw):{textbooks:JSON.parse(JSON.stringify(getTextbookDB()))};
  }catch(e){return{textbooks:JSON.parse(JSON.stringify(getTextbookDB()))};}
}
function saveTextbooksData(data){localStorage.setItem(getTextbookStorageKey(),JSON.stringify(data));}
function seedTextbooks(){
  const data=getTextbooksData();
  const builtin=getTextbookDB();
  if(!builtin||builtin.length===0)return;
  let changed=false;
  // Remove any entries not in the current built-in list
  const builtinNames=new Set(builtin.map(b=>b.n));
  const removed=data.textbooks.filter(t=>!builtinNames.has(t.n));
  if(removed.length){data.textbooks=data.textbooks.filter(t=>builtinNames.has(t.n));changed=true;}
  builtin.forEach(bt=>{
    const exists=data.textbooks.find(t=>t.n===bt.n);
    if(!exists){
      data.textbooks.push(JSON.parse(JSON.stringify(bt)));
      changed=true;
    }else if(bt.p==='Compass Publishing'||bt.p==='Cambridge University Press'){
      // Force-update Compass & Cambridge built-in entries to match current genTextbookDB
      const fresh=JSON.parse(JSON.stringify(bt));
      if(JSON.stringify(exists.u)!==JSON.stringify(fresh.u)){exists.u=fresh.u;changed=true;}
      if(exists.g!==fresh.g){exists.g=fresh.g;changed=true;}
      if(exists.uc!==fresh.uc){exists.uc=fresh.uc;changed=true;}
      if(JSON.stringify(exists.a)!==JSON.stringify(fresh.a)){exists.a=fresh.a;changed=true;}
    }else if(!exists.u||exists.u.length===0){
      // Update existing empty non-Compass entry with built-in data
      exists.u=JSON.parse(JSON.stringify(bt.u));
      exists.p=bt.p;exists.g=bt.g;exists.uc=bt.uc;exists.a=bt.a;
      changed=true;
    }
  });
  if(changed)saveTextbooksData(data);
}
function genTextbookDB(){
  // Helper: create word entries with auto-matched phonetic/pos from DICTIONARY
  const W=(en,zh)=>{
    const d=DICTIONARY.find(d=>d.en.toLowerCase()===en.toLowerCase());
    return {en,zh,phonetic:d?d.phonetic||'':'',pos:d?d.pos||'':''};
  };
  return [
    // -- Cambridge ------------------------------------------------
    {n:"Cambridge Think 1 (2nd Ed.) A2", p:"Cambridge University Press", g:"A2", uc:12,
     a:["Think 1","think1","剑桥 Think 1"], u:[
      {n:"Unit 1 — Having Fun",w:null},{n:"Unit 2 — Spending Money",w:null},
      {n:"Unit 3 — Food for Life",w:null},{n:"Unit 4 — Social Networking",w:null},
      {n:"Unit 5 — My Life in Music",w:null},{n:"Unit 6 — Making a Difference",w:null},
      {n:"Unit 7 — Future Bodies",w:null},{n:"Unit 8 — The World of Work",w:null},
      {n:"Unit 9 — Great Sounds",w:null},{n:"Unit 10 — The List",w:null},
      {n:"Unit 11 — Flu Season",w:null},{n:"Unit 12 — Making Decisions",w:null}
    ]},
    {n:"Cambridge Think 2 (2nd Ed.) B1", p:"Cambridge University Press", g:"B1", uc:12,
     a:["Think 2","think2","剑桥 Think 2"], u:[
      {n:"Unit 1 — Incredible People",w:[
        W("active","活跃的"),W("admire","钦佩"),W("athlete","运动员"),W("bossy","专横的"),
        W("brave","勇敢的"),W("caring","关心他人的"),W("charming","迷人的"),W("cheerful","开朗的"),
        W("concert","音乐会"),W("confident","自信的"),W("cool","酷的"),W("creative","有创造力的"),
        W("curious","好奇的"),W("easy-going","随和的"),W("exactly","确切地"),W("friendly","友好的"),
        W("funny","有趣的"),W("imagination","想象力"),W("impression","印象"),W("incredible","难以置信的"),
        W("intelligent","聪明的"),W("keen","热衷的"),W("laid-back","悠闲的"),W("marathon","马拉松"),
        W("neighbourhood","街区"),W("operation","手术"),W("positive","积极的"),W("reasonable","合理的"),
        W("reliable","可靠的"),W("respondent","受访者"),W("response","回应"),W("serious","严肃的"),
        W("smart","聪明的"),W("survey","调查"),W("talented","有天赋的"),W("train","训练"),
        W("trainer","教练"),W("athlete","运动员"),
        {en:"bring up",zh:"抚养，提出",phonetic:"",pos:"phr."},
        {en:"do your best",zh:"尽力",phonetic:"",pos:"phr."},
        {en:"form a group",zh:"组建团队",phonetic:"",pos:"phr."},
        {en:"get a job",zh:"找到工作",phonetic:"",pos:"phr."},
        {en:"keen on",zh:"热衷于",phonetic:"",pos:"phr."},
        {en:"lose a race",zh:"输掉比赛",phonetic:"",pos:"phr."},
        {en:"make a mistake",zh:"犯错误",phonetic:"",pos:"phr."},
        {en:"take a risk",zh:"冒险",phonetic:"",pos:"phr."},
        // Additional Unit 1 vocabulary (23 words)
        W("mole","鼹鼠"),W("tunnel","隧道"),W("earthquake","地震"),W("bury","埋葬"),
        W("fallen","倒下的"),W("volunteer","志愿者；志愿做某事"),W("bravery","勇敢"),
        W("disaster","灾难"),W("zone","区域"),W("attack","攻击"),W("tsunami","海啸"),
        W("altogether","完全地"),W("average","平均；平均的"),W("professional","专业的；专业人士"),
        W("specialist","专家"),W("psychologist","心理学家"),W("local","当地的；本地人"),
        W("rescue","援救"),W("manage","管理"),W("offer","提供"),W("course","课程"),
        W("continue","继续"),W("dig","挖（过去式 dug，过去分词 dug）"),
        {en:"decide to do sth.",zh:"决定做某事",phonetic:"",pos:"phr."},
        {en:"on average",zh:"平均",phonetic:"",pos:"phr."}
      ]},
      {n:"Unit 2 — A Good Education",w:[
        // School subjects (15)
        {en:"art",zh:"美术",phonetic:"/ɑːrt/",pos:"n.",def:"the expression or application of human creative skill and imagination"},
        {en:"biology",zh:"生物",phonetic:"/baɪˈɒlədʒi/",pos:"n.",def:"the study of living organisms"},
        {en:"chemistry",zh:"化学",phonetic:"/ˈkemɪstri/",pos:"n.",def:"the branch of science concerned with substances and their reactions"},
        {en:"drama",zh:"戏剧",phonetic:"/ˈdrɑːmə/",pos:"n.",def:"a play for theatre, radio, or television"},
        {en:"economics",zh:"经济学",phonetic:"/ˌiːkəˈnɒmɪks/",pos:"n.",def:"the study of production, consumption, and transfer of wealth"},
        {en:"French",zh:"法语",phonetic:"/frentʃ/",pos:"n.",def:"the language of France"},
        {en:"geography",zh:"地理",phonetic:"/dʒiˈɒɡrəfi/",pos:"n.",def:"the study of the physical features of the earth"},
        {en:"German",zh:"德语",phonetic:"/ˈdʒɜːmən/",pos:"n.",def:"the language of Germany"},
        {en:"history",zh:"历史",phonetic:"/ˈhɪstəri/",pos:"n.",def:"the study of past events"},
        {en:"ICT",zh:"信息与通信技术",phonetic:"/ˌaɪ siː ˈtiː/",pos:"n.",def:"Information and Communications Technology"},
        {en:"maths",zh:"数学",phonetic:"/mæθs/",pos:"n.",def:"the abstract science of number, quantity, and space"},
        {en:"PE",zh:"体育",phonetic:"/ˌpiː ˈiː/",pos:"n.",def:"physical education; instruction in physical exercise and games"},
        {en:"physics",zh:"物理",phonetic:"/ˈfɪzɪks/",pos:"n.",def:"the branch of science concerned with matter, energy, and their interactions"},
        {en:"science",zh:"科学",phonetic:"/ˈsaɪəns/",pos:"n.",def:"the systematic study of the structure and behaviour of the natural world"},
        {en:"Spanish",zh:"西班牙语",phonetic:"/ˈspænɪʃ/",pos:"n.",def:"the language of Spain"},
        // Reflexive pronouns (8)
        {en:"myself",zh:"我自己",phonetic:"/maɪˈself/",pos:"pron.",def:"used by a speaker to refer to himself or herself"},
        {en:"yourself",zh:"你自己",phonetic:"/jɔːˈself/",pos:"pron.",def:"used to refer to the person being addressed"},
        {en:"himself",zh:"他自己",phonetic:"/hɪmˈself/",pos:"pron.",def:"used to refer to a male person previously mentioned"},
        {en:"herself",zh:"她自己",phonetic:"/hɜːˈself/",pos:"pron.",def:"used to refer to a female person previously mentioned"},
        {en:"itself",zh:"它自己",phonetic:"/ɪtˈself/",pos:"pron.",def:"used to refer to a thing or animal previously mentioned"},
        {en:"ourselves",zh:"我们自己",phonetic:"/aʊəˈselvz/",pos:"pron.",def:"used to refer to the speaker together with others"},
        {en:"yourselves",zh:"你们自己",phonetic:"/jɔːˈselvz/",pos:"pron.",def:"used to refer to the people being addressed"},
        {en:"themselves",zh:"他们/她们/它们自己",phonetic:"/ðəmˈselvz/",pos:"pron.",def:"used to refer to people or things previously mentioned"},
        // Verbs with -ing and to / verb patterns (11)
        {en:"try",zh:"尝试；试图",phonetic:"/traɪ/",pos:"v.",def:"make an attempt or effort to do something"},
        {en:"remember",zh:"记住；记得",phonetic:"/rɪˈmembə/",pos:"v.",def:"have in or be able to bring to mind an awareness of"},
        {en:"stop",zh:"停止",phonetic:"/stɒp/",pos:"v.",def:"cease to happen or continue"},
        {en:"regret",zh:"后悔；遗憾",phonetic:"/rɪˈɡret/",pos:"v.",def:"feel sad or disappointed over something that has happened"},
        {en:"go on",zh:"继续",phonetic:"/ɡəʊ ɒn/",pos:"phr.",def:"continue doing something"},
        {en:"mean",zh:"意思是；意味着",phonetic:"/miːn/",pos:"v.",def:"intend to convey or refer to"},
        {en:"need",zh:"需要",phonetic:"/niːd/",pos:"v.",def:"require something because it is essential"},
        {en:"want",zh:"想要",phonetic:"/wɒnt/",pos:"v.",def:"have a desire to possess or do something"},
        {en:"forget",zh:"忘记",phonetic:"/fəˈɡet/",pos:"v.",def:"fail to remember"},
        {en:"learn",zh:"学习",phonetic:"/lɜːn/",pos:"v.",def:"gain knowledge or skill in something through study or experience"},
        {en:"would like",zh:"想要",phonetic:"/wʊd laɪk/",pos:"phr.",def:"want or wish for something; a polite form of 'want'"},
      ]},{n:"Unit 3 — On the Screen",w:null},
      {n:"Unit 4 — Online Life",w:null},{n:"Unit 5 — Music to My Ears",w:null},
      {n:"Unit 6 — No Planet B",w:null},{n:"Unit 7 — The Future is Now",w:null},
      {n:"Unit 8 — Science and Us",w:null},{n:"Unit 9 — Working Week",w:null},
      {n:"Unit 10 — Mind and Body",w:null},{n:"Unit 11 — Breaking News",w:null},
      {n:"Unit 12 — Rules and Regulations",w:null}
    ]},
    // -- 人教版 (PEP) ----------------------------------------------
    {n:"人教版七年级英语上册 (2024新版)", p:"人民教育出版社", g:"七年级上", uc:7,
     a:["PEP 7A","人教版 七年级上","人教版初一上","新人教版七上","2024人教版七上"], u:[
      {n:"Starter Unit 1 — Hello!",w:null},
      {n:"Starter Unit 2 — Keep Tidy!",w:null},
      {n:"Starter Unit 3 — Welcome!",w:null},
      {n:"Unit 1 — You and Me",w:[
        W("make friends","交朋友"),W("full","完整的"),W("grade","年级"),W("classmate","同班同学"),
        W("mistake","错误"),W("country","国家"),W("same","相同的"),W("twin","双胞胎"),
        W("both","两个都"),W("band","乐队"),W("pot","锅"),W("tofu","豆腐"),
        W("parrot","鹦鹉"),W("guitar","吉他"),W("tennis","网球"),W("page","页面"),
        W("even","甚至"),W("information","信息"),W("hobby","爱好"),
        {en:"full name",zh:"全名",phonetic:"",pos:"phr."},
        {en:"last name",zh:"姓氏",phonetic:"",pos:"phr."},
        {en:"first name",zh:"名字",phonetic:"",pos:"phr."},
        {en:"class teacher",zh:"班主任",phonetic:"",pos:"phr."},
        {en:"a lot",zh:"很，非常",phonetic:"",pos:"phr."},
        {en:"play the guitar",zh:"弹吉他",phonetic:"",pos:"phr."},
        {en:"would like to",zh:"愿意，喜欢",phonetic:"",pos:"phr."},
        {en:"hot pot",zh:"火锅",phonetic:"",pos:"phr."},
        {en:"get to know",zh:"认识，了解",phonetic:"",pos:"phr."}
      ]},
      {n:"Unit 2 — We're Family!",w:null},{n:"Unit 3 — Is This Your Pencil?",w:null},
      {n:"Unit 4 — My Favourite Subject",w:null},{n:"Unit 5 — Fun Clubs",w:null},
      {n:"Unit 6 — A Day in the Life",w:null},{n:"Unit 7 — Happy Birthday!",w:null}
    ]},
    {n:"人教版七年级英语下册 (2024新版)", p:"人民教育出版社", g:"七年级下", uc:8,
     a:["PEP 7B","人教版 七年级下","人教版初一下","新人教版七下"], u:[
      {n:"Unit 1 — Animal Friends",w:null},{n:"Unit 2 — No Rules, No Order",w:null},
      {n:"Unit 3 — Keep Fit",w:null},{n:"Unit 4 — Eat Well",w:null},
      {n:"Unit 5 — Here and Now",w:null},{n:"Unit 6 — Rain or Shine",w:null},
      {n:"Unit 7 — A Day to Remember",w:null},{n:"Unit 8 — Once Upon a Time",w:null}
    ]},
    {n:"人教版八年级英语上册", p:"人民教育出版社", g:"八年级上", uc:10,
     a:["PEP 8A","人教版 八年级上","人教版初二上"], u:Array.from({length:10},(_,i)=>({n:`Unit ${i+1}`,w:null}))},
    {n:"人教版八年级英语下册", p:"人民教育出版社", g:"八年级下", uc:10,
     a:["PEP 8B","人教版 八年级下","人教版初二下"], u:Array.from({length:10},(_,i)=>({n:`Unit ${i+1}`,w:null}))},
    {n:"人教版九年级英语全一册", p:"人民教育出版社", g:"九年级", uc:14,
     a:["PEP 9","人教版 九年级","人教版初三"], u:Array.from({length:14},(_,i)=>({n:`Unit ${i+1}`,w:null}))},
    // -- 外研社 (FLTRP) --------------------------------------------
    {n:"外研社七年级英语上册", p:"外语教学与研究出版社", g:"七年级上", uc:10,
     a:["外研版 七年级上","外研社初一上","FLTRP 7A","外研七上"], u:[
      {n:"Starter Module 1 — My teacher and my friends",w:null},
      {n:"Starter Module 2 — My classroom",w:null},
      {n:"Starter Module 3 — Colours, everyday things",w:null},
      {n:"Starter Module 4 — My everyday life",w:null},
      {n:"Module 1 — My classmates",w:[
        W("Chinese","中国人，汉语"),W("from","从……来"),W("where","在哪里"),W("year","年龄，年"),
        W("about","关于"),W("America","美国"),W("England","英格兰"),W("American","美国人"),
        W("our","我们的"),W("grade","年级"),W("China","中国"),W("everyone","大家"),
        W("capital","首都"),W("but","但是"),W("very","很"),W("big","大的"),
        W("city","城市"),W("small","小的"),W("first","第一的"),W("last","最后的"),
        W("all","每个，全体"),
        {en:"What about...?",zh:"……怎么样？",phonetic:"",pos:"phr."},
        {en:"first name",zh:"名字",phonetic:"",pos:"phr."},
        {en:"last name",zh:"姓",phonetic:"",pos:"phr."}
      ]},
      {n:"Module 2 — My family",w:null},{n:"Module 3 — My school",w:null},
      {n:"Module 4 — Healthy food",w:null},{n:"Module 5 — My school day",w:null},
      {n:"Module 6 — A trip to the zoo",w:null},{n:"Module 7 — Computers",w:null},
      {n:"Module 8 — Choosing presents",w:null},{n:"Module 9 — People and places",w:null},
      {n:"Module 10 — Spring Festival",w:null}
    ]},
    {n:"外研社七年级英语下册", p:"外语教学与研究出版社", g:"七年级下", uc:12,
     a:["外研版 七年级下","外研社初一下","FLTRP 7B"], u:Array.from({length:12},(_,i)=>({n:`Module ${i+1}`,w:null}))},
    {n:"外研社八年级英语上册", p:"外语教学与研究出版社", g:"八年级上", uc:12,
     a:["外研版 八年级上","外研社初二上","FLTRP 8A"], u:Array.from({length:12},(_,i)=>({n:`Module ${i+1}`,w:null}))},
    // -- 牛津版 ----------------------------------------------------
    {n:"牛津译林版七年级英语上册", p:"译林出版社", g:"七年级上", uc:8,
     a:["牛津 七年级上","译林 七上","Oxford 7A","牛津译林七上"], u:Array.from({length:8},(_,i)=>({n:`Unit ${i+1}`,w:null}))},
    {n:"牛津译林版七年级英语下册", p:"译林出版社", g:"七年级下", uc:8,
     a:["牛津 七年级下","译林 七下","Oxford 7B"], u:Array.from({length:8},(_,i)=>({n:`Unit ${i+1}`,w:null}))},
    // -- 新概念英语 ------------------------------------------------
    {n:"新概念英语第一册 (New Concept English 1)", p:"外语教学与研究出版社", g:"入门/初级", uc:144,
     a:["新概念1","NCE 1","New Concept English 1","新概念一"], u:[
      {n:"Lessons 1–2 — Excuse me!",w:[
        W("excuse","原谅"),W("handbag","手提包"),W("pardon","原谅，再说一遍"),
        W("pen","钢笔"),W("pencil","铅笔"),W("book","书"),W("watch","手表"),
        W("coat","上衣"),W("dress","连衣裙"),W("skirt","裙子"),W("shirt","衬衣"),
        W("car","小汽车"),W("house","房子")
      ]},
      {n:"Lessons 3–4 — Sorry, sir.",w:[
        W("umbrella","伞"),W("please","请"),W("here","这里"),W("ticket","票"),
        W("number","号码"),W("sorry","对不起"),W("sir","先生"),W("cloakroom","衣帽间"),
        W("suit","一套衣服"),W("school","学校"),W("teacher","老师"),W("son","儿子"),W("daughter","女儿")
      ]},
      {n:"Lessons 5–6 — Nice to meet you.",w:[
        W("good","好"),W("morning","早晨"),W("new","新的"),W("student","学生"),
        W("French","法国的"),W("German","德国的"),W("nice","美好的"),W("meet","遇见"),
        W("Japanese","日本的"),W("Korean","韩国的"),W("Chinese","中国的"),W("make","牌号"),
        W("Swedish","瑞典的"),W("English","英国的"),W("American","美国的"),W("Italian","意大利的")
      ]},
      {n:"Lessons 7–8 — Are you a teacher?",w:[
        W("nationality","国籍"),W("job","工作"),W("keyboard","键盘"),W("operator","操作员"),
        W("engineer","工程师"),W("policeman","警察"),W("policewoman","女警察"),W("taxi driver","出租车司机"),
        W("air hostess","空姐"),W("postman","邮递员"),W("nurse","护士"),W("mechanic","机械师"),
        W("hairdresser","理发师"),W("housewife","家庭主妇"),W("milkman","送奶工")
      ]},
      {n:"Lessons 9–10 — How are you today?",w:[
        W("hello","你好"),W("today","今天"),W("well","身体好"),W("fine","美好的"),
        W("thanks","谢谢"),W("goodbye","再见"),W("fat","胖的"),W("woman","女人"),
        W("thin","瘦的"),W("tall","高的"),W("short","矮的"),W("dirty","脏的"),
        W("clean","干净的"),W("hot","热的"),W("cold","冷的"),W("old","老的"),
        W("young","年轻的"),W("busy","忙的"),W("lazy","懒的")
      ]}
    ]},
    {n:"新概念英语第二册 (New Concept English 2)", p:"外语教学与研究出版社", g:"初中/中级", uc:96,
     a:["新概念2","NCE 2","New Concept English 2","新概念二"], u:Array.from({length:96},(_,i)=>({n:`Lesson ${i+1}`,w:null}))},
    // -- 仁爱版 ----------------------------------------------------
    {n:"仁爱版七年级英语上册", p:"科学普及出版社", g:"七年级上", uc:4,
     a:["仁爱 七年级上","仁爱版七上","Project English 7A"], u:Array.from({length:4},(_,i)=>({n:`Topic ${i+1}`,w:null}))},
    // -- 北师大版 --------------------------------------------------
    {n:"北师大版七年级英语上册", p:"北京师范大学出版社", g:"七年级上", uc:6,
     a:["北师大 七年级上","北师大版七上"], u:Array.from({length:6},(_,i)=>({n:`Unit ${i+1}`,w:null}))},
    // -- 高中 ------------------------------------------------------
    {n:"人教版高中英语必修第一册 (2019版)", p:"人民教育出版社", g:"高一上", uc:6,
     a:["PEP 高中必修一","人教版高中必修一","高中英语必修一"], u:[
      {n:"Unit 1 — Teenage Life",w:null},{n:"Unit 2 — Travelling Around",w:null},
      {n:"Unit 3 — Sports and Fitness",w:null},{n:"Unit 4 — Natural Disasters",w:null},
      {n:"Unit 5 — Languages Around the World",w:null},{n:"Unit 6 — Cultural Heritage",w:null}
    ]},
    {n:"人教版高中英语必修第二册 (2019版)", p:"人民教育出版社", g:"高一下", uc:5,
     a:["PEP 高中必修二","人教版高中必修二"], u:Array.from({length:5},(_,i)=>({n:`Unit ${i+1}`,w:null}))},
    {n:"人教版高中英语必修第三册 (2019版)", p:"人民教育出版社", g:"高二上", uc:5,
     a:["PEP 高中必修三","人教版高中必修三"], u:Array.from({length:5},(_,i)=>({n:`Unit ${i+1}`,w:null}))},
    // -- 其他国际教材 ----------------------------------------------
    {n:"Cambridge English in Mind 1 (2nd Ed.)", p:"Cambridge University Press", g:"A2", uc:14,
     a:["English in Mind 1","EIM 1"], u:Array.from({length:14},(_,i)=>({n:`Unit ${i+1}`,w:null}))},
    {n:"Cambridge English in Mind 2 (2nd Ed.)", p:"Cambridge University Press", g:"B1", uc:14,
     a:["English in Mind 2","EIM 2"], u:Array.from({length:14},(_,i)=>({n:`Unit ${i+1}`,w:null}))},
    {n:"Cambridge Prepare! Level 1 A1", p:"Cambridge University Press", g:"A1", uc:20,
     a:["Prepare 1","Prepare A1"], u:Array.from({length:20},(_,i)=>({n:`Unit ${i+1}`,w:null}))},
    {n:"Cambridge Prepare! Level 2 A2", p:"Cambridge University Press", g:"A2", uc:20,
     a:["Prepare 2","Prepare A2"], u:Array.from({length:20},(_,i)=>({n:`Unit ${i+1}`,w:null}))},
    {n:"Oxford Discover 1 (2nd Ed.)", p:"Oxford University Press", g:"A1", uc:9,
     a:["Oxford Discover 1","OD1"], u:Array.from({length:9},(_,i)=>({n:`Unit ${i+1}`,w:null}))},
    {n:"Oxford Discover 2 (2nd Ed.)", p:"Oxford University Press", g:"A2", uc:9,
     a:["Oxford Discover 2","OD2"], u:Array.from({length:9},(_,i)=>({n:`Unit ${i+1}`,w:null}))},

// -- 1000 Basic English Words (4 books, 12 units, 20 words/unit) --
    {n:"1000 Basic English Words 1 (Pre-A1)", p:"Compass Publishing", g:"Pre-A1", uc:12,
     a:["1000 Basic 1","1000词 Book 1","Compass 1000-1"], u:[
      {n:"Unit 1", w:[
        W("cry","哭"),
        W("drive","驾驶"),
        W("funny","有趣的"),
        W("hope","希望"),
        W("laugh","笑"),
        W("nice","好的"),
        W("smile","微笑"),
        W("strong","强壮的"),
        W("student","学生"),
        W("young","年轻的"),
        W("big","大的"),
        W("boy","男孩"),
        W("child","孩子"),
        W("have","有"),
        W("loud","大声的"),
        W("story","故事"),
        W("swim","游泳"),
        W("today","今天"),
        W("watch","观看"),
        W("worry","担心")
      ]},
      {n:"Unit 2", w:[
        W("able","能够"),
        W("alone","独自"),
        W("animal","动物"),
        W("become","变成"),
        W("call","打电话"),
        W("catch","抓住"),
        W("country","国家"),
        W("monkey","猴子"),
        W("thin","薄的"),
        W("word","单词"),
        W("baby","婴儿"),
        W("clean","清理"),
        W("eat","吃"),
        W("enjoy","享受"),
        W("family","家庭"),
        W("fruit","水果"),
        W("jump","跳"),
        W("kind","善良的"),
        W("man","男人"),
        W("parent","父母")
      ]},
      {n:"Unit 3", w:[
        W("address","地址"),
        W("afternoon","下午"),
        W("come","来"),
        W("home","家"),
        W("letter","信"),
        W("lunch","午餐"),
        W("make","做"),
        W("need","需要"),
        W("people","人们"),
        W("start","开始"),
        W("cook","烹饪"),
        W("day","天"),
        W("drink","喝"),
        W("front","前面"),
        W("great","伟大的"),
        W("play","玩"),
        W("see","看见"),
        W("send","发送"),
        W("small","小的"),
        W("time","时间")
      ]},
      {n:"Unit 4", w:[
        W("again","再次"),
        W("bad","坏的"),
        W("buy","买"),
        W("end","结束"),
        W("find","找到"),
        W("friend","朋友"),
        W("say","说"),
        W("speak","讲话"),
        W("sweet","甜的"),
        W("true","真的"),
        W("answer","回答"),
        W("learn","学习"),
        W("like","喜欢"),
        W("long","长的"),
        W("minute","分钟"),
        W("sing","唱歌"),
        W("sit","坐"),
        W("star","星星"),
        W("think","想"),
        W("town","城镇")
      ]},
      {n:"Unit 5", w:[
        W("breakfast","早餐"),
        W("carry","携带"),
        W("cheap","便宜的"),
        W("count","数数"),
        W("cut","切"),
        W("early","早的"),
        W("finish","完成"),
        W("flower","花"),
        W("food","食物"),
        W("vegetable","蔬菜"),
        W("begin","开始"),
        W("excuse","借口"),
        W("heavy","重的"),
        W("market","市场"),
        W("meat","肉"),
        W("money","钱"),
        W("put","放"),
        W("station","车站"),
        W("visit","参观"),
        W("yesterday","昨天")
      ]},
      {n:"Unit 6", w:[
        W("cold","冷的"),
        W("dark","黑暗的"),
        W("dinner","晚餐"),
        W("dish","盘子"),
        W("evening","傍晚"),
        W("sick","生病的"),
        W("snowy","下雪的"),
        W("sugar","糖"),
        W("tea","茶"),
        W("world","世界"),
        W("hard","困难的"),
        W("late","迟的"),
        W("life","生活"),
        W("look","看"),
        W("love","爱"),
        W("night","夜晚"),
        W("same","相同的"),
        W("sleep","睡觉"),
        W("water","水"),
        W("weak","虚弱的")
      ]},
      {n:"Unit 7", w:[
        W("fine","好的"),
        W("give","给"),
        W("help","帮助"),
        W("hour","小时"),
        W("meet","遇见"),
        W("page","页"),
        W("pay","付款"),
        W("rain","雨"),
        W("sell","卖"),
        W("tree","树"),
        W("chair","椅子"),
        W("hear","听见"),
        W("number","数字"),
        W("park","公园"),
        W("poor","贫穷的"),
        W("ready","准备好的"),
        W("ride","骑"),
        W("table","桌子"),
        W("work","工作"),
        W("write","写")
      ]},
      {n:"Unit 8", w:[
        W("door","门"),
        W("easy","容易的"),
        W("grow","生长"),
        W("hate","讨厌"),
        W("morning","早晨"),
        W("music","音乐"),
        W("oclock","...点钟"),
        W("ring","戒指"),
        W("stop","停止"),
        W("study","学习"),
        W("mirror","镜子"),
        W("nurse","护士"),
        W("pocket","口袋"),
        W("pretty","漂亮的"),
        W("problem","问题"),
        W("pull","拉"),
        W("sad","伤心的"),
        W("try","尝试"),
        W("want","想要"),
        W("wrong","错误的")
      ]},
      {n:"Unit 9", w:[
        W("high","高的"),
        W("keep","保持"),
        W("know","知道"),
        W("let","让"),
        W("move","移动"),
        W("pass","通过"),
        W("point","点"),
        W("push","推"),
        W("quick","快的"),
        W("together","一起"),
        W("fall","落下"),
        W("lady","女士"),
        W("rest","休息"),
        W("run","跑"),
        W("season","季节"),
        W("short","短的"),
        W("sky","天空"),
        W("stand","站"),
        W("tall","高的"),
        W("wear","穿")
      ]},
      {n:"Unit 10", w:[
        W("bottle","瓶子"),
        W("change","改变"),
        W("cool","凉爽的"),
        W("cover","覆盖"),
        W("dry","干燥的"),
        W("egg","蛋"),
        W("expensive","昂贵的"),
        W("fast","快的"),
        W("fish","鱼"),
        W("knife","刀"),
        W("full","满的"),
        W("garden","花园"),
        W("hot","热的"),
        W("ill","生病的"),
        W("kitchen","厨房"),
        W("light","光"),
        W("milk","牛奶"),
        W("potato","土豆"),
        W("warm","温暖的"),
        W("wash","洗")
      ]},
      {n:"Unit 11", w:[
        W("beautiful","美丽的"),
        W("bicycle","自行车"),
        W("city","城市"),
        W("east","东方"),
        W("far","远的"),
        W("map","地图"),
        W("open","打开"),
        W("road","路"),
        W("shoe","鞋"),
        W("side","侧面"),
        W("air","空气"),
        W("fly","飞"),
        W("half","一半"),
        W("left","左边"),
        W("little","小的"),
        W("new","新的"),
        W("shop","商店"),
        W("show","展示"),
        W("use","使用"),
        W("wait","等待")
      ]},
      {n:"Unit 12", w:[
        W("ask","问"),
        W("break","打破"),
        W("desk","书桌"),
        W("seat","座位"),
        W("stairs","楼梯"),
        W("stay","停留"),
        W("talk","说话"),
        W("understand","理解"),
        W("walk","走"),
        W("year","年"),
        W("act","行动"),
        W("bring","带来"),
        W("glad","高兴的"),
        W("lesson","课"),
        W("listen","听"),
        W("pencil","铅笔"),
        W("question","问题"),
        W("right","正确的"),
        W("teach","教"),
        W("way","方式")
      ]}
    ]},
    {n:"1000 Basic English Words 2 (A1)", p:"Compass Publishing", g:"A1", uc:12,
     a:["1000 Basic 2","1000 Basic2","Compass 1000 2"], u:[
      {n:"Unit 1", w:[
        W("angry","生气的"),
        W("boring","无聊的"),
        W("class","班级"),
        W("dream","梦想"),
        W("famous","著名的"),
        W("feel","感觉"),
        W("future","未来"),
        W("group","组"),
        W("hobby","爱好"),
        W("job","工作"),
        W("hundred","一百"),
        W("invite","邀请"),
        W("math","数学"),
        W("photograph","照片"),
        W("president","总统"),
        W("really","真正地"),
        W("speech","演讲"),
        W("travel","旅行"),
        W("voice","声音"),
        W("wonder","好奇")
      ]},
      {n:"Unit 2", w:[
        W("baseball","棒球"),
        W("basketball","篮球"),
        W("dangerous","危险的"),
        W("excited","兴奋的"),
        W("hill","小山"),
        W("hit","击打"),
        W("hospital","医院"),
        W("hurt","受伤"),
        W("motorbike","摩托车"),
        W("slow","慢的"),
        W("drop","掉落"),
        W("earth","地球"),
        W("flag","旗子"),
        W("foolish","愚蠢的"),
        W("hold","拿着"),
        W("matter","事情"),
        W("round","圆的"),
        W("take","拿"),
        W("tie","领带"),
        W("weather","天气")
      ]},
      {n:"Unit 3", w:[
        W("art","艺术"),
        W("build","建造"),
        W("choose","选择"),
        W("draw","画"),
        W("kid","小孩"),
        W("paint","画"),
        W("picture","图片"),
        W("plant","植物"),
        W("repeat","重复"),
        W("wall","墙"),
        W("absent","缺席"),
        W("back","后面"),
        W("fix","修理"),
        W("land","陆地"),
        W("pants","裤子"),
        W("picnic","野餐"),
        W("river","河流"),
        W("rock","岩石"),
        W("school","学校"),
        W("wood","木头")
      ]},
      {n:"Unit 4", w:[
        W("book","书"),
        W("example","例子"),
        W("glue","胶水"),
        W("library","图书馆"),
        W("mean","意思是"),
        W("piece","片"),
        W("plan","计划"),
        W("quiet","安静的"),
        W("read","阅读"),
        W("sound","声音"),
        W("correct","正确的"),
        W("difference","差异"),
        W("difficult","困难的"),
        W("excellent","优秀的"),
        W("guess","猜测"),
        W("museum","博物馆"),
        W("noise","噪音"),
        W("relax","放松"),
        W("science","科学"),
        W("tomorrow","明天")
      ]},
      {n:"Unit 5", w:[
        W("close","关闭"),
        W("grass","草"),
        W("hat","帽子"),
        W("lake","湖"),
        W("moon","月亮"),
        W("mountain","山"),
        W("smell","闻"),
        W("soap","肥皂"),
        W("toilet","厕所"),
        W("wet","湿的"),
        W("boot","靴子"),
        W("deep","深的"),
        W("farm","农场"),
        W("glove","手套"),
        W("house","房子"),
        W("sunny","晴朗的"),
        W("top","顶部"),
        W("well","好地"),
        W("wide","宽的"),
        W("windy","有风的")
      ]},
      {n:"Unit 6", w:[
        W("care","关心"),
        W("die","死亡"),
        W("empty","空的"),
        W("feed","喂养"),
        W("health","健康"),
        W("heart","心"),
        W("large","大的"),
        W("remember","记住"),
        W("rule","规则"),
        W("zoo","动物园"),
        W("dirty","脏的"),
        W("fill","装满"),
        W("fresh","新鲜的"),
        W("frog","青蛙"),
        W("girl","女孩"),
        W("glass","玻璃杯"),
        W("hungry","饥饿的"),
        W("spoon","勺子"),
        W("thirsty","口渴的"),
        W("window","窗户")
      ]},
      {n:"Unit 7", w:[
        W("ago","以前"),
        W("agree","同意"),
        W("beach","海滩"),
        W("cap","帽子"),
        W("fat","胖的"),
        W("sea","海"),
        W("throw","扔"),
        W("towel","毛巾"),
        W("trip","旅行"),
        W("vacation","假期"),
        W("ball","球"),
        W("basket","篮子"),
        W("boat","船"),
        W("holiday","假期"),
        W("lamp","灯"),
        W("last","最后的"),
        W("past","过去"),
        W("ship","船"),
        W("spend","花费"),
        W("west","西方")
      ]},
      {n:"Unit 8", w:[
        W("beef","牛肉"),
        W("best","最好的"),
        W("bread","面包"),
        W("free","自由的"),
        W("hurry","赶快"),
        W("join","加入"),
        W("middle","中间"),
        W("pair","一双"),
        W("pick","选择"),
        W("store","商店"),
        W("bag","袋子"),
        W("dear","亲爱的"),
        W("live","居住"),
        W("low","低的"),
        W("month","月"),
        W("name","名字"),
        W("phone","电话"),
        W("rice","米饭"),
        W("rich","富有的"),
        W("size","大小")
      ]},
      {n:"Unit 9", w:[
        W("birth","出生"),
        W("clothes","衣服"),
        W("cost","花费"),
        W("hide","隐藏"),
        W("pet","宠物"),
        W("puppy","小狗"),
        W("soft","软的"),
        W("touch","触摸"),
        W("weigh","称重"),
        W("wish","希望"),
        W("age","年龄"),
        W("bath","洗澡"),
        W("bright","明亮的"),
        W("brush","刷子"),
        W("lose","丢失"),
        W("second","秒"),
        W("tell","告诉"),
        W("test","测试"),
        W("thank","感谢"),
        W("ugly","丑陋的")
      ]},
      {n:"Unit 10", w:[
        W("calendar","日历"),
        W("dance","跳舞"),
        W("date","日期"),
        W("idea","主意"),
        W("luck","运气"),
        W("paper","纸"),
        W("post","邮寄"),
        W("receive","收到"),
        W("toy","玩具"),
        W("week","周"),
        W("clear","清楚的"),
        W("continue","继续"),
        W("fan","风扇"),
        W("favorite","最喜欢的"),
        W("floor","地板"),
        W("polite","有礼貌的"),
        W("practice","练习"),
        W("present","礼物"),
        W("train","训练"),
        W("turn","转")
      ]},
      {n:"Unit 11", w:[
        W("balloon","气球"),
        W("bridge","桥"),
        W("busy","忙碌的"),
        W("company","公司"),
        W("congratulate","祝贺"),
        W("delicious","美味的"),
        W("fight","打架"),
        W("old","老的"),
        W("restaurant","餐厅"),
        W("surprise","惊喜"),
        W("gentleman","绅士"),
        W("handsome","英俊的"),
        W("husband","丈夫"),
        W("interested","感兴趣的"),
        W("king","国王"),
        W("queen","女王"),
        W("skirt","裙子"),
        W("wake","醒来"),
        W("wife","妻子"),
        W("woman","女人")
      ]},
      {n:"Unit 12", w:[
        W("arrive","到达"),
        W("car","汽车"),
        W("forget","忘记"),
        W("gate","大门"),
        W("grand","宏伟的"),
        W("line","线"),
        W("subway","地铁"),
        W("theater","剧院"),
        W("thousand","一千"),
        W("win","赢"),
        W("cloudy","多云的"),
        W("north","北方"),
        W("office","办公室"),
        W("plate","盘子"),
        W("police","警察"),
        W("south","南方"),
        W("square","正方形"),
        W("street","街道"),
        W("tonight","今晚"),
        W("umbrella","雨伞")
      ]}
    ]},
    {n:"1000 Basic English Words 3 (A2)", p:"Compass Publishing", g:"A2", uc:12,
     a:["1000 Basic 3","1000 Basic3","Compass 1000 3"], u:[
      {n:"Unit 1", w:[
        W("burn","燃烧"),
        W("exchange","交换"),
        W("introduce","介绍"),
        W("offer","提供"),
        W("pardon","原谅"),
        W("popular","流行的"),
        W("prepare","准备"),
        W("reason","原因"),
        W("shake","摇晃"),
        W("shy","害羞的"),
        W("bell","铃"),
        W("block","街区"),
        W("borrow","借入"),
        W("bowl","碗"),
        W("confuse","使困惑"),
        W("knock","敲"),
        W("result","结果"),
        W("seem","似乎"),
        W("smart","聪明的"),
        W("subject","科目")
      ]},
      {n:"Unit 2", w:[
        W("active","活跃的"),
        W("believe","相信"),
        W("environment","环境"),
        W("forest","森林"),
        W("human","人类"),
        W("hunt","狩猎"),
        W("path","小路"),
        W("safe","安全的"),
        W("service","服务"),
        W("wild","野生的"),
        W("area","地区"),
        W("choice","选择"),
        W("enter","进入"),
        W("important","重要的"),
        W("lie","说谎"),
        W("mad","生气"),
        W("nature","自然"),
        W("protect","保护"),
        W("shout","喊叫"),
        W("usually","通常")
      ]},
      {n:"Unit 3", w:[
        W("amazing","令人惊奇的"),
        W("attend","参加"),
        W("event","事件"),
        W("express","表达"),
        W("grade","年级"),
        W("part","部分"),
        W("save","拯救"),
        W("set","放置"),
        W("space","空间"),
        W("special","特别的"),
        W("cheer","欢呼"),
        W("contest","比赛"),
        W("gift","礼物"),
        W("magazine","杂志"),
        W("perform","表演"),
        W("public","公共的"),
        W("scene","场景"),
        W("secret","秘密"),
        W("stage","舞台"),
        W("unique","独特的")
      ]},
      {n:"Unit 4", w:[
        W("electricity","电"),
        W("fact","事实"),
        W("fold","折叠"),
        W("key","钥匙"),
        W("mind","头脑"),
        W("power","力量"),
        W("sock","袜子"),
        W("solve","解决"),
        W("stick","棍子"),
        W("traffic","交通"),
        W("advice","建议"),
        W("case","情况"),
        W("exam","考试"),
        W("happen","发生"),
        W("lazy","懒惰的"),
        W("message","消息"),
        W("stupid","愚蠢的"),
        W("succeed","成功"),
        W("terrible","可怕的"),
        W("upset","难过的")
      ]},
      {n:"Unit 5", w:[
        W("airplane","飞机"),
        W("airport","机场"),
        W("culture","文化"),
        W("decide","决定"),
        W("leave","离开"),
        W("modern","现代的"),
        W("order","命令"),
        W("sand","沙子"),
        W("spot","地点"),
        W("strange","奇怪的"),
        W("bill","账单"),
        W("blow","吹"),
        W("century","世纪"),
        W("custom","习俗"),
        W("experience","经历"),
        W("international","国际的"),
        W("island","岛屿"),
        W("journey","旅程"),
        W("meal","一餐"),
        W("return","返回")
      ]},
      {n:"Unit 6", w:[
        W("actually","实际上"),
        W("camp","营地"),
        W("collect","收集"),
        W("form","形式"),
        W("kick","踢"),
        W("reach","到达"),
        W("review","复习"),
        W("simple","简单的"),
        W("soccer","足球"),
        W("symbol","符号"),
        W("allow","允许"),
        W("bat","蝙蝠"),
        W("exercise","练习"),
        W("force","力量"),
        W("leaf","叶子"),
        W("member","成员"),
        W("real","真实的"),
        W("sign","标志"),
        W("step","步骤"),
        W("treat","对待")
      ]},
      {n:"Unit 7", w:[
        W("afraid","害怕"),
        W("fair","公平的"),
        W("focus","集中"),
        W("foreign","外国的"),
        W("habit","习惯"),
        W("invent","发明"),
        W("language","语言"),
        W("nation","国家"),
        W("still","仍然"),
        W("wise","明智的"),
        W("audience","观众"),
        W("college","大学"),
        W("comfortable","舒适的"),
        W("honest","诚实的"),
        W("imagine","想象"),
        W("level","水平"),
        W("sentence","句子"),
        W("stress","压力"),
        W("suddenly","突然"),
        W("topic","话题")
      ]},
      {n:"Unit 8", w:[
        W("add","增加"),
        W("blind","失明的"),
        W("button","按钮"),
        W("create","创造"),
        W("memory","记忆"),
        W("prince","王子"),
        W("string","绳子"),
        W("thick","厚的"),
        W("tight","紧的"),
        W("tradition","传统"),
        W("board","板"),
        W("brain","大脑"),
        W("celebrate","庆祝"),
        W("especially","特别地"),
        W("hole","洞"),
        W("item","物品"),
        W("match","比赛"),
        W("princess","公主"),
        W("social","社会的"),
        W("tear","撕裂")
      ]},
      {n:"Unit 9", w:[
        W("cross","穿过"),
        W("finally","最后"),
        W("follow","跟随"),
        W("heat","热"),
        W("rainbow","彩虹"),
        W("spread","传播"),
        W("tired","累的"),
        W("tower","塔"),
        W("unit","单元"),
        W("vote","投票"),
        W("climb","爬"),
        W("describe","描述"),
        W("energy","能量"),
        W("engine","引擎"),
        W("field","田野"),
        W("include","包括"),
        W("perfect","完美的"),
        W("rise","升起"),
        W("shape","形状"),
        W("stone","石头")
      ]},
      {n:"Unit 10", w:[
        W("bake","烘烤"),
        W("communicate","沟通"),
        W("deliver","递送"),
        W("direct","直接的"),
        W("goal","目标"),
        W("history","历史"),
        W("inform","通知"),
        W("mail","邮件"),
        W("march","三月"),
        W("whole","整个的"),
        W("appear","出现"),
        W("community","社区"),
        W("festival","节日"),
        W("interview","面试"),
        W("million","百万"),
        W("newspaper","报纸"),
        W("report","报告"),
        W("sport","运动"),
        W("support","支持"),
        W("uniform","制服")
      ]},
      {n:"Unit 11", w:[
        W("brave","勇敢的"),
        W("goat","山羊"),
        W("hang","悬挂"),
        W("ice","冰"),
        W("insect","昆虫"),
        W("raise","举起"),
        W("roll","滚动"),
        W("sore","疼痛的"),
        W("tent","帐篷"),
        W("village","村庄"),
        W("accident","事故"),
        W("adventure","冒险"),
        W("corn","玉米"),
        W("develop","发展"),
        W("medicine","药"),
        W("own","自己的"),
        W("product","产品"),
        W("quite","相当"),
        W("roof","屋顶"),
        W("rope","绳子")
      ]},
      {n:"Unit 12", w:[
        W("carrot","胡萝卜"),
        W("cause","原因"),
        W("experiment","实验"),
        W("fry","油炸"),
        W("ground","地面"),
        W("kill","杀死"),
        W("mix","混合"),
        W("possible","可能的"),
        W("pot","锅"),
        W("proud","骄傲的"),
        W("lay","放置"),
        W("list","列表"),
        W("main","主要的"),
        W("mark","标记"),
        W("mistake","错误"),
        W("price","价格"),
        W("several","几个"),
        W("share","分享"),
        W("soil","土壤"),
        W("taste","味道")
      ]}
    ]},
    {n:"1000 Basic English Words 4 (A2+)", p:"Compass Publishing", g:"A2+", uc:12,
     a:["1000 Basic 4","1000 Basic4","Compass 1000 4"], u:[
      {n:"Unit 1", w:[
        W("awful","糟糕的"),
        W("crazy","疯狂的"),
        W("huge","巨大的"),
        W("moment","时刻"),
        W("odd","奇怪的"),
        W("pour","倒"),
        W("regret","后悔"),
        W("steal","偷"),
        W("thief","小偷"),
        W("tough","坚强的"),
        W("chance","机会"),
        W("extra","额外的"),
        W("hall","大厅"),
        W("immediately","立即"),
        W("intend","打算"),
        W("mention","提到"),
        W("reaction","反应"),
        W("score","分数"),
        W("search","搜索"),
        W("worse","更糟的")
      ]},
      {n:"Unit 2", w:[
        W("bit","一点"),
        W("common","常见的"),
        W("diet","饮食"),
        W("evidence","证据"),
        W("fit","健康的"),
        W("limit","限制"),
        W("physical","身体的"),
        W("poison","毒药"),
        W("sale","销售"),
        W("type","类型"),
        W("amount","数量"),
        W("cure","治愈"),
        W("disease","疾病"),
        W("medical","医学的"),
        W("necessary","必要的"),
        W("produce","生产"),
        W("reduce","减少"),
        W("serious","严肃的"),
        W("source","来源"),
        W("supply","供应")
      ]},
      {n:"Unit 3", w:[
        W("castle","城堡"),
        W("decision","决定"),
        W("empire","帝国"),
        W("explore","探索"),
        W("flight","航班"),
        W("guard","守卫"),
        W("incredible","难以置信的"),
        W("serve","服务"),
        W("skin","皮肤"),
        W("southern","南方的"),
        W("admire","钦佩"),
        W("ancient","古代的"),
        W("attractive","有吸引力的"),
        W("giant","巨大的"),
        W("pack","打包"),
        W("prefer","更喜欢"),
        W("rent","租"),
        W("respect","尊重"),
        W("view","景色"),
        W("wave","波浪")
      ]},
      {n:"Unit 4", w:[
        W("base","基础"),
        W("character","角色"),
        W("clever","聪明的"),
        W("enemy","敌人"),
        W("length","长度"),
        W("promise","承诺"),
        W("quality","质量"),
        W("regularly","定期地"),
        W("survive","生存"),
        W("title","标题"),
        W("adult","成年人"),
        W("classic","经典的"),
        W("desert","沙漠"),
        W("discover","发现"),
        W("female","女性"),
        W("flow","流动"),
        W("mystery","谜"),
        W("opinion","意见"),
        W("pleasure","快乐"),
        W("publish","出版")
      ]},
      {n:"Unit 5", w:[
        W("cough","咳嗽"),
        W("crowd","人群"),
        W("curious","好奇的"),
        W("disappear","消失"),
        W("edge","边缘"),
        W("guide","导游"),
        W("local","当地的"),
        W("machine","机器"),
        W("native","本地的"),
        W("smoke","烟"),
        W("avenue","大道"),
        W("expect","期望"),
        W("explain","解释"),
        W("rub","擦"),
        W("shine","发光"),
        W("strength","力量"),
        W("suggest","建议"),
        W("tour","旅游"),
        W("western","西方的"),
        W("wheel","轮子")
      ]},
      {n:"Unit 6", w:[
        W("cloth","布"),
        W("equal","相等的"),
        W("fail","失败"),
        W("false","错误的"),
        W("goods","商品"),
        W("increase","增加"),
        W("penny","便士"),
        W("separate","分开"),
        W("total","总的"),
        W("wrap","包"),
        W("appreciate","欣赏"),
        W("avoid","避免"),
        W("convenient","方便的"),
        W("customer","顾客"),
        W("destroy","破坏"),
        W("disappointed","失望的"),
        W("medium","中等的"),
        W("pattern","模式"),
        W("trick","诡计"),
        W("value","价值")
      ]},
      {n:"Unit 7", w:[
        W("beat","打败"),
        W("conduct","行为"),
        W("confident","自信的"),
        W("lead","领导"),
        W("lift","举起"),
        W("male","男性的"),
        W("muscle","肌肉"),
        W("speed","速度"),
        W("stretch","伸展"),
        W("trouble","麻烦"),
        W("captain","队长"),
        W("challenge","挑战"),
        W("complete","完成"),
        W("encourage","鼓励"),
        W("noon","中午"),
        W("position","位置"),
        W("race","比赛"),
        W("record","记录"),
        W("skill","技能"),
        W("wing","翅膀")
      ]},
      {n:"Unit 8", w:[
        W("certain","确定的"),
        W("discuss","讨论"),
        W("edit","编辑"),
        W("gather","收集"),
        W("image","图像"),
        W("material","材料"),
        W("positive","积极的"),
        W("role","角色"),
        W("screen","屏幕"),
        W("technology","技术"),
        W("attack","攻击"),
        W("available","可用的"),
        W("career","职业"),
        W("connect","连接"),
        W("dictionary","词典"),
        W("handle","处理"),
        W("major","主要的"),
        W("provide","提供"),
        W("section","部分"),
        W("site","地点")
      ]},
      {n:"Unit 9", w:[
        W("accept","接受"),
        W("consider","考虑"),
        W("exist","存在"),
        W("familiar","熟悉的"),
        W("joy","快乐"),
        W("married","已婚的"),
        W("rather","相当"),
        W("represent","代表"),
        W("root","根"),
        W("society","社会"),
        W("band","乐队"),
        W("fortune","财富"),
        W("guest","客人"),
        W("host","主人"),
        W("original","原始的"),
        W("peace","和平"),
        W("poem","诗"),
        W("sense","感觉"),
        W("trust","信任"),
        W("wealthy","富有的")
      ]},
      {n:"Unit 10", w:[
        W("blood","血液"),
        W("business","商业"),
        W("electronic","电子的"),
        W("influence","影响"),
        W("master","掌握"),
        W("pity","同情"),
        W("press","按"),
        W("shoot","射击"),
        W("signal","信号"),
        W("teenager","青少年"),
        W("achieve","实现"),
        W("beg","乞求"),
        W("control","控制"),
        W("debate","辩论"),
        W("improve","改善"),
        W("similar","相似的"),
        W("soldier","士兵"),
        W("system","系统"),
        W("war","战争"),
        W("warn","警告")
      ]},
      {n:"Unit 11", w:[
        W("announce","宣布"),
        W("bottom","底部"),
        W("compete","竞争"),
        W("copy","复制"),
        W("exhibit","展览"),
        W("print","打印"),
        W("project","项目"),
        W("proper","适当的"),
        W("select","选择"),
        W("sheet","一张"),
        W("concentrate","集中"),
        W("maximum","最大的"),
        W("prize","奖品"),
        W("require","需要"),
        W("research","研究"),
        W("respond","回应"),
        W("spell","拼写"),
        W("state","状态"),
        W("structure","结构"),
        W("tool","工具")
      ]},
      {n:"Unit 12", w:[
        W("flood","洪水"),
        W("gentle","温和的"),
        W("melt","融化"),
        W("operate","操作"),
        W("recognize","认出"),
        W("remain","保持"),
        W("task","任务"),
        W("various","各种各样的"),
        W("waste","浪费"),
        W("worth","价值"),
        W("climate","气候"),
        W("emergency","紧急情况"),
        W("factory","工厂"),
        W("freeze","冻结"),
        W("population","人口"),
        W("recently","最近"),
        W("responsible","负责的"),
        W("storm","暴风雨"),
        W("stream","小溪"),
        W("temperature","温度")
      ]}
    ]},
// -- 2000 Core English Words (4 books, 16 units, 20 words/unit) --
    {n:"2000 Core English Words 1 (A2+)", p:"Compass Publishing", g:"A2+", uc:16,
     a:["2000 Core 1","2000 Core1","Compass 2000 1"], u:[
      {n:"Unit 1", w:[
        W("blood","血液"),
        W("body","n. 身体"),
        W("chin","n. 下巴"),
        W("dentist","n. 牙医"),
        W("doctor","n. 医生"),
        W("ease","v./n. 减轻；舒适"),
        W("finger","手指"),
        W("headache","n. 头痛"),
        W("healthy","adj. 健康的"),
        W("hurt","受伤"),
        W("lips","n. 嘴唇"),
        W("medicine","药"),
        W("neck","n. 脖子"),
        W("pain","n. 疼痛"),
        W("sick","生病的"),
        W("skin","皮肤"),
        W("stomach","胃"),
        W("stomachache","n. 胃痛"),
        W("tooth","n. 牙齿"),
        W("toothache","n. 牙痛")
      ]},
      {n:"Unit 2", w:[
        W("accident","事故"),
        W("ambulance","n. 救护车"),
        W("back","后面"),
        W("bone","n. 骨头"),
        W("brain","大脑"),
        W("cheek","n. 脸颊"),
        W("fat","胖的"),
        W("fit","健康的"),
        W("health","健康"),
        W("heart","心"),
        W("hospital","医院"),
        W("ill","生病的"),
        W("knee","n. 膝盖"),
        W("nail","n. 指甲；钉子"),
        W("nurse","护士"),
        W("safety","安全"),
        W("shoulder","肩膀"),
        W("slim","adj. 苗条的"),
        W("toe","n. 脚趾"),
        W("well","好地")
      ]},
      {n:"Unit 3", w:[
        W("activity","n. 活动"),
        W("coach","n. 教练"),
        W("final","adj. 最后的"),
        W("meter","n. 米"),
        W("move","移动"),
        W("net","n. 网"),
        W("park","公园"),
        W("pool","n. 游泳池"),
        W("prize","奖品"),
        W("race","比赛"),
        W("skate","v./n. 滑冰"),
        W("sled","n. 雪橇"),
        W("snowball","n. 雪球"),
        W("snowboard","n. 滑雪板"),
        W("snowman","n. 雪人"),
        W("swing","n./v. 秋千"),
        W("team","n. 团队"),
        W("touch","触摸"),
        W("win","赢"),
        W("winner","n. 获胜者")
      ]},
      {n:"Unit 4", w:[
        W("chess","n. 国际象棋"),
        W("climbing","n. 攀登"),
        W("field","田野"),
        W("fishing","n. 钓鱼"),
        W("game","n. 游戏"),
        W("goal","目标"),
        W("golf","n. 高尔夫"),
        W("hit","击打"),
        W("play","玩"),
        W("player","n. 运动员"),
        W("puzzle","n. 拼图"),
        W("racket","n. 球拍"),
        W("runner","n. 跑步者"),
        W("running","n. 跑步"),
        W("sailing","n. 帆船运动"),
        W("skateboard","n. 滑板"),
        W("soccer","足球"),
        W("surfing","n. 冲浪"),
        W("tennis","n. 网球"),
        W("volleyball","n. 排球")
      ]},
      {n:"Unit 5", w:[
        W("backyard","n. 后院"),
        W("basement","n. 地下室"),
        W("bathtub","n. 浴缸"),
        W("blanket","毯子"),
        W("ceiling","n. 天花板"),
        W("couch","n. 沙发"),
        W("cupboard","n. 橱柜"),
        W("cushion","n. 垫子"),
        W("downstairs","adv. 在楼下"),
        W("drawer","n. 抽屉"),
        W("garage","n. 车库"),
        W("hall","大厅"),
        W("living room","n. 客厅"),
        W("napkin","n. 餐巾"),
        W("roof","屋顶"),
        W("sink","n. 水槽"),
        W("tile","n. 瓷砖"),
        W("toilet","厕所"),
        W("toothbrush","n. 牙刷"),
        W("upstairs","adv. 在楼上")
      ]},
      {n:"Unit 6", w:[
        W("bedding","n. 床上用品"),
        W("bedroom","n. 卧室"),
        W("build","建造"),
        W("carpet","n. 地毯"),
        W("cleaner","n. 清洁剂"),
        W("curtain","n. 窗帘"),
        W("dresser","n. 梳妆台"),
        W("floor","地板"),
        W("furniture","n. 家具"),
        W("live","居住"),
        W("mat","n. 垫子"),
        W("mattress","n. 床垫"),
        W("pillow","枕头"),
        W("seat","座位"),
        W("shelf","n. 架子"),
        W("stair","n. 楼梯"),
        W("tool","工具"),
        W("wall","墙"),
        W("wallpaper","n. 墙纸"),
        W("wood","木头")
      ]},
      {n:"Unit 7", w:[
        W("address","地址"),
        W("building","n. 建筑物"),
        W("cafe","n. 咖啡馆"),
        W("cathedral","n. 大教堂"),
        W("center","中心"),
        W("church","n. 教堂"),
        W("elevator","n. 电梯"),
        W("entrance","n. 入口"),
        W("exit","n. 出口"),
        W("gallery","n. 画廊"),
        W("gate","大门"),
        W("guesthouse","n. 宾馆"),
        W("hotel","n. 旅馆"),
        W("library","图书馆"),
        W("museum","博物馆"),
        W("outside","adv. 在外面"),
        W("restaurant","餐厅"),
        W("stadium","n. 体育场"),
        W("theater","剧院"),
        W("villa","n. 别墅")
      ]},
      {n:"Unit 8", w:[
        W("bacon","n. 培根"),
        W("butter","黄油"),
        W("chop","v. 切；砍"),
        W("coffee","咖啡"),
        W("cup","n. 杯子"),
        W("eat","吃"),
        W("fork","n. 叉子"),
        W("have","有"),
        W("honey","n. 蜂蜜"),
        W("jam","n. 果酱"),
        W("marshmallow","n. 棉花糖"),
        W("mushroom","n. 蘑菇"),
        W("pepper","n. 胡椒粉"),
        W("salt","n. 盐"),
        W("sausage","n. 香肠"),
        W("soup","n. 汤"),
        W("stove","n. 炉子"),
        W("tea","茶"),
        W("vanilla","n. 香草"),
        W("vegetable","蔬菜")
      ]},
      {n:"Unit 9", w:[
        W("avocado","n. 牛油果"),
        W("barbecue","n./v. 烧烤"),
        W("bagel","n. 百吉饼"),
        W("cheese","奶酪"),
        W("cook","烹饪"),
        W("cookie","n. 饼干"),
        W("full","满的"),
        W("grapefruit","n. 葡萄柚"),
        W("hamburger","n. 汉堡包"),
        W("ketchup","n. 番茄酱"),
        W("lemon","n. 柠檬"),
        W("melon","n. 瓜；甜瓜"),
        W("milkshake","n. 奶昔"),
        W("orange","橙子"),
        W("pasta","n. 意大利面"),
        W("salad","n. 沙拉"),
        W("shrimp","n. 虾"),
        W("snack","n. 零食"),
        W("supper","n. 晚餐"),
        W("thirsty","口渴的")
      ]},
      {n:"Unit 10", w:[
        W("among","prep. 在...之中"),
        W("both","adj./pron. 两者都"),
        W("buyer","n. 买家"),
        W("cart","n. 购物车"),
        W("customer","顾客"),
        W("else","adv. 其他"),
        W("expensive","昂贵的"),
        W("find","找到"),
        W("gold","n. 金子；金色"),
        W("look","看"),
        W("neat","adj. 整洁的"),
        W("parking lot","n. 停车场"),
        W("pick","选择"),
        W("price","价格"),
        W("sell","卖"),
        W("shop","商店"),
        W("shopper","n. 购物者"),
        W("supermarket","n. 超市"),
        W("try","尝试"),
        W("wonderful","adj. 精彩的")
      ]},
      {n:"Unit 11", w:[
        W("afford","v. 负担得起"),
        W("around","adv./prep. 周围"),
        W("bookstore","n. 书店"),
        W("card","n. 卡片"),
        W("chain","n. 链；连锁"),
        W("choose","选择"),
        W("closed","adj. 关闭的"),
        W("discount","n./v. 折扣"),
        W("dress","n./v. 连衣裙；穿衣"),
        W("fashionable","adj. 时尚的"),
        W("get","v. 得到"),
        W("instead","代替"),
        W("jewelry","n. 珠宝"),
        W("label","n. 标签"),
        W("mall","n. 商场"),
        W("piece","片"),
        W("receipt","n. 收据"),
        W("return","返回"),
        W("style","n. 风格"),
        W("take","拿")
      ]},
      {n:"Unit 12", w:[
        W("belt","n. 皮带"),
        W("cardigan","n. 开衫毛衣"),
        W("clothes","衣服"),
        W("denim","n. 牛仔布"),
        W("glasses","n. 眼镜"),
        W("jacket","夹克"),
        W("jeans","n. 牛仔裤"),
        W("pajamas","n. 睡衣"),
        W("pants","裤子"),
        W("pocket","口袋"),
        W("ring","戒指"),
        W("sleeve","n. 袖子"),
        W("suit","n. 西装"),
        W("sweater","n. 毛衣"),
        W("sweatshirt","n. 运动衫"),
        W("tie","领带"),
        W("tights","n. 紧身衣"),
        W("T-shirt","n. T恤"),
        W("uniform","制服"),
        W("wear","穿")
      ]},
      {n:"Unit 13", w:[
        W("backpack","n. 背包"),
        W("blouse","n. 女衬衫"),
        W("boot","靴子"),
        W("clothing","n. 衣服"),
        W("coat","n. 外套"),
        W("cotton","n. 棉花"),
        W("earring","n. 耳环"),
        W("glove","手套"),
        W("knit","v./n. 编织"),
        W("necklace","n. 项链"),
        W("purse","n. 钱包"),
        W("raincoat","n. 雨衣"),
        W("sandal","n. 凉鞋"),
        W("scarf","n. 围巾"),
        W("shorts","n. 短裤"),
        W("skirt","裙子"),
        W("sunglasses","n. 太阳镜"),
        W("swimsuit","n. 泳衣"),
        W("umbrella","雨伞"),
        W("underwear","n. 内衣")
      ]},
      {n:"Unit 14", w:[
        W("album","n. 专辑"),
        W("band","乐队"),
        W("channel","n. 频道"),
        W("concert","音乐会"),
        W("dancer","n. 舞者"),
        W("drum","n. 鼓"),
        W("instrument","n. 乐器"),
        W("jazz","n. 爵士乐"),
        W("musical","adj./n. 音乐的；音乐剧"),
        W("opera","n. 歌剧"),
        W("painting","n. 绘画"),
        W("pop","n. 流行音乐"),
        W("rap","n. 说唱"),
        W("record","记录"),
        W("recording","n. 录音"),
        W("singer","n. 歌手"),
        W("singing","n. 唱歌"),
        W("stage","舞台"),
        W("video","n. 视频"),
        W("violin","n. 小提琴")
      ]},
      {n:"Unit 15", w:[
        W("actor","n. 男演员"),
        W("actress","n. 女演员"),
        W("advertisement","n. 广告"),
        W("art","艺术"),
        W("cartoon","n. 卡通"),
        W("chapter","n. 章节"),
        W("cinema","n. 电影院"),
        W("circus","n. 马戏团"),
        W("comic book","n. 漫画书"),
        W("fiction","n. 小说"),
        W("film","n. 电影"),
        W("magazine","杂志"),
        W("magic","魔法"),
        W("movie","n. 电影"),
        W("painter","n. 画家"),
        W("photograph","照片"),
        W("picture","图片"),
        W("present","礼物"),
        W("program","程序"),
        W("soul","n. 灵魂")
      ]},
      {n:"Unit 16", w:[
        W("below","adv./prep. 在下面"),
        W("cave","n. 洞穴"),
        W("cloud","云"),
        W("countryside","n. 乡村"),
        W("dirt","n. 泥土"),
        W("fog","n. 雾"),
        W("gas","n. 气体；汽油"),
        W("hike","n./v. 远足"),
        W("jungle","丛林"),
        W("lightning","n. 闪电"),
        W("place","n. 地方"),
        W("seed","n. 种子"),
        W("snake","n. 蛇"),
        W("snow","n./v. 雪"),
        W("steam","n. 蒸汽"),
        W("sunset","n. 日落"),
        W("sunshine","阳光"),
        W("temperature","温度"),
        W("thunder","雷声"),
        W("wind","n. 风")
      ]}
    ]},
    {n:"2000 Core English Words 2 (B1)", p:"Compass Publishing", g:"B1", uc:16,
     a:["2000 Core 2","2000 Core2","Compass 2000 2"], u:[
      {n:"Unit 1", w:[
        W("downtown","n./adj. 市中心"),
        W("guidebook","n. 旅行指南"),
        W("harbor","n. 港口"),
        W("lost","adj. 迷路的"),
        W("passport","n. 护照"),
        W("plane","n. 飞机"),
        W("platform","n. 平台"),
        W("railroad","n. 铁路"),
        W("scooter","n. 滑板车"),
        W("sidewalk","n. 人行道"),
        W("sightseeing","n. 观光"),
        W("subway","地铁"),
        W("suitcase","n. 行李箱"),
        W("taxi","n. 出租车"),
        W("terminal","n. 终点站"),
        W("ticket","票"),
        W("tour","旅游"),
        W("tourist","n. 游客"),
        W("transit","n. 运输"),
        W("traveler","n. 旅行者")
      ]},
      {n:"Unit 2", w:[
        W("adventure","冒险"),
        W("arrive","到达"),
        W("away","adv. 离开"),
        W("camping","n. 露营"),
        W("corner","n. 角落"),
        W("depart","v. 离开"),
        W("driver","司机"),
        W("helicopter","n. 直升机"),
        W("highway","n. 高速公路"),
        W("motorcycle","n. 摩托车"),
        W("north","北方"),
        W("parking","n. 停车"),
        W("passenger","n. 乘客"),
        W("south","南方"),
        W("stay","停留"),
        W("tire","n. 轮胎"),
        W("toward","朝"),
        W("traffic","交通"),
        W("vacation","假期"),
        W("visitor","访客")
      ]},
      {n:"Unit 3", w:[
        W("chef","n. 厨师"),
        W("chili","n. 辣椒"),
        W("cooking","n. 烹饪"),
        W("cracker","n. 饼干"),
        W("fried","adj. 油炸的"),
        W("garlic","n. 大蒜"),
        W("ginger","n. 姜"),
        W("ham","n. 火腿"),
        W("jar","n. 罐子"),
        W("make","做"),
        W("menu","n. 菜单"),
        W("noodle","n. 面条"),
        W("oil","n. 油"),
        W("pizza","n. 比萨饼"),
        W("sandwich","三明治"),
        W("smell","闻"),
        W("steak","n. 牛排"),
        W("taste","味道"),
        W("toast","n. 烤面包"),
        W("yogurt","n. 酸奶")
      ]},
      {n:"Unit 4", w:[
        W("biscuit","n. 饼干"),
        W("cereal","n. 谷物；麦片"),
        W("chopsticks","n. 筷子"),
        W("cream","n. 奶油"),
        W("dessert","n. 甜点"),
        W("drink","喝"),
        W("flour","n. 面粉"),
        W("jelly","n. 果冻"),
        W("lettuce","n. 生菜"),
        W("lime","n. 酸橙"),
        W("lunchtime","n. 午餐时间"),
        W("mug","n. 杯子"),
        W("nut","n. 坚果"),
        W("omelet","n. 煎蛋卷"),
        W("plate","盘子"),
        W("slice","n./v. 薄片；切片"),
        W("straw","n. 吸管；稻草"),
        W("strawberry","n. 草莓"),
        W("takeout","n. 外卖"),
        W("watermelon","n. 西瓜")
      ]},
      {n:"Unit 5", w:[
        W("ache","n./v. 疼痛"),
        W("alive","adj. 活着的"),
        W("bleed","v. 流血"),
        W("blind","失明的"),
        W("breath","呼吸"),
        W("condition","n. 条件；状况"),
        W("cure","治愈"),
        W("disabled","adj. 残疾的"),
        W("disease","疾病"),
        W("fitness","n. 健康"),
        W("habit","习惯"),
        W("harm","n./v. 伤害"),
        W("heal","v. 治愈"),
        W("hip","n. 臀部"),
        W("needle","n. 针"),
        W("often","adv. 经常"),
        W("painful","adj. 疼痛的"),
        W("result","结果"),
        W("tablet","n. 药片"),
        W("treatment","n. 治疗")
      ]},
      {n:"Unit 6", w:[
        W("asleep","adj. 睡着的"),
        W("belly","n. 腹部"),
        W("cast","v./n. 投掷；石膏"),
        W("chubby","adj. 胖乎乎的"),
        W("clinic","n. 诊所"),
        W("cough","咳嗽"),
        W("deaf","adj. 聋的"),
        W("drug","n. 药物"),
        W("emergency","紧急情况"),
        W("fever","n. 发烧"),
        W("forehead","n. 额头"),
        W("hunger","n. 饥饿"),
        W("illness","n. 疾病"),
        W("muscle","肌肉"),
        W("nap","n. 小睡"),
        W("normal","正常的"),
        W("operation","n. 手术"),
        W("recover","v. 恢复"),
        W("virus","n. 病毒"),
        W("weight","重量")
      ]},
      {n:"Unit 7", w:[
        W("agency","n. 代理机构"),
        W("baker","n. 面包师"),
        W("career","职业"),
        W("company","公司"),
        W("department","n. 部门"),
        W("designer","n. 设计师"),
        W("employer","n. 雇主"),
        W("industry","n. 工业"),
        W("librarian","n. 图书管理员"),
        W("manager","n. 经理"),
        W("opportunity","n. 机会"),
        W("organization","n. 组织"),
        W("professional","n./adj. 专业人士"),
        W("professor","n. 教授"),
        W("salary","工资"),
        W("secretary","n. 秘书"),
        W("staff","n. 员工"),
        W("trade","n./v. 贸易"),
        W("training","n. 训练"),
        W("writer","n. 作家")
      ]},
      {n:"Unit 8", w:[
        W("advertise","v. 做广告"),
        W("athlete","运动员"),
        W("benefit","n./v. 好处；受益"),
        W("business","商业"),
        W("deal","n./v. 交易；处理"),
        W("detective","n. 侦探"),
        W("director","n. 导演；主管"),
        W("duty","n. 职责"),
        W("firefighter","n. 消防员"),
        W("journalist","n. 记者"),
        W("lawyer","n. 律师"),
        W("mayor","n. 市长"),
        W("mechanic","n. 机械师"),
        W("musician","n. 音乐家"),
        W("pilot","n. 飞行员"),
        W("pirate","n. 海盗"),
        W("reporter","n. 记者"),
        W("salesman","n. 销售员"),
        W("senior","adj./n. 年长的"),
        W("veterinarian","n. 兽医")
      ]},
      {n:"Unit 9", w:[
        W("clearly","adv. 清楚地"),
        W("comment","n./v. 评论"),
        W("context","n. 上下文；背景"),
        W("conversation","n. 对话"),
        W("detail","n. 细节"),
        W("diary","n. 日记"),
        W("document","n. 文件"),
        W("explanation","n. 解释"),
        W("internet","n. 互联网"),
        W("list","列表"),
        W("meaning","n. 意思"),
        W("news","n. 新闻"),
        W("note","n. 笔记"),
        W("notebook","n. 笔记本"),
        W("problem","问题"),
        W("repeat","重复"),
        W("shout","喊叫"),
        W("show","展示"),
        W("speak","讲话"),
        W("write","写")
      ]},
      {n:"Unit 10", w:[
        W("bow","v./n. 鞠躬"),
        W("envelope","n. 信封"),
        W("forget","忘记"),
        W("fully","adv. 完全地"),
        W("greet","v. 问候"),
        W("handwriting","n. 笔迹"),
        W("ink","n. 墨水"),
        W("invite","邀请"),
        W("joke","n. 笑话"),
        W("maybe","adv. 也许"),
        W("meeting","n. 会议"),
        W("message","消息"),
        W("postcard","n. 明信片"),
        W("print","打印"),
        W("sorry","adj. 抱歉的"),
        W("stamp","n. 邮票"),
        W("sure","adj. 确信的"),
        W("talk","说话"),
        W("tell","告诉"),
        W("welcome","欢迎")
      ]},
      {n:"Unit 11", w:[
        W("academy","n. 学院"),
        W("campus","n. 校园"),
        W("childhood","n. 童年"),
        W("course","n. 课程"),
        W("crayon","n. 蜡笔"),
        W("difficulty","n. 困难"),
        W("eraser","n. 橡皮擦"),
        W("gym","n. 体育馆"),
        W("kindergarten","n. 幼儿园"),
        W("learn","学习"),
        W("lecture","n./v. 讲座"),
        W("marker","n. 记号笔"),
        W("purpose","目的"),
        W("rank","n. 等级"),
        W("student","学生"),
        W("teach","教"),
        W("understand","理解"),
        W("university","n. 大学"),
        W("vocabulary","n. 词汇"),
        W("whiteboard","n. 白板")
      ]},
      {n:"Unit 12", w:[
        W("blackboard","n. 黑板"),
        W("cafeteria","n. 自助餐厅"),
        W("chalk","n. 粉笔"),
        W("check","v. 检查"),
        W("classmate","n. 同班同学"),
        W("club","n. 俱乐部"),
        W("dictionary","词典"),
        W("homework","n. 家庭作业"),
        W("junior","低年级的"),
        W("line","线"),
        W("mistake","错误"),
        W("PE","n. 体育"),
        W("practice","练习"),
        W("principal","n. 校长"),
        W("quiz","n. 测验"),
        W("remember","记住"),
        W("scissors","n. 剪刀"),
        W("study","学习"),
        W("tape","n. 胶带"),
        W("textbook","n. 教科书")
      ]},
      {n:"Unit 13", w:[
        W("ashamed","adj. 羞愧的"),
        W("astonish","v. 使惊讶"),
        W("careless","adj. 粗心的"),
        W("clever","聪明的"),
        W("congratulations","n. 祝贺"),
        W("creative","adj. 有创造力的"),
        W("emotional","adj. 情绪的"),
        W("fool","n./v. 傻瓜"),
        W("happiness","n. 幸福"),
        W("helpful","adj. 有帮助的"),
        W("lazy","懒惰的"),
        W("lovely","可爱的"),
        W("pleased","adj. 高兴的"),
        W("powerful","adj. 强大的"),
        W("scary","adj. 可怕的"),
        W("serious","严肃的"),
        W("silly","adj. 愚蠢的"),
        W("stupid","愚蠢的"),
        W("surprised","adj. 惊讶的"),
        W("talent","天赋")
      ]},
      {n:"Unit 14", w:[
        W("attitude","n. 态度"),
        W("attract","v. 吸引"),
        W("background","n. 背景"),
        W("boring","无聊的"),
        W("bother","v. 打扰"),
        W("calm","adj. 平静的"),
        W("careful","小心的"),
        W("cheerful","adj. 开朗的"),
        W("enjoyable","adj. 愉快的"),
        W("excitement","n. 兴奋"),
        W("feeling","n. 感觉"),
        W("gentle","温和的"),
        W("happily","adv. 快乐地"),
        W("interested","感兴趣的"),
        W("lucky","adj. 幸运的"),
        W("noisy","adj. 嘈杂的"),
        W("peaceful","adj. 和平的"),
        W("realize","v. 意识到"),
        W("scared","害怕的"),
        W("wish","希望")
      ]},
      {n:"Unit 15", w:[
        W("average","adj./n. 平均的；平均数"),
        W("beautiful","美丽的"),
        W("bride","n. 新娘"),
        W("brother","兄弟"),
        W("clap","v./n. 鼓掌"),
        W("couple","n. 一对；夫妇"),
        W("cousin","表亲"),
        W("elegant","adj. 优雅的"),
        W("engagement","n. 订婚；约会"),
        W("forever","adv. 永远"),
        W("girlfriend","n. 女朋友"),
        W("gown","n. 礼服"),
        W("kiss","v./n. 亲吻"),
        W("marry","v. 结婚"),
        W("merry","adj. 快乐的"),
        W("nephew","n. 侄子；外甥"),
        W("party","n. 聚会"),
        W("sister","姐妹"),
        W("stepbrother","n. 继兄弟"),
        W("white","adj./n. 白色")
      ]},
      {n:"Unit 16", w:[
        W("aged","adj. 年老的"),
        W("anniversary","n. 周年纪念日"),
        W("annual","adj. 每年的"),
        W("companion","n. 同伴"),
        W("divorce","n./v. 离婚"),
        W("extraordinary","adj. 非凡的"),
        W("father-in-law","n. 岳父；公公"),
        W("gender","n. 性别"),
        W("grandparent","n. 祖父母"),
        W("hug","v./n. 拥抱"),
        W("marriage","婚姻"),
        W("newborn","adj. 新生的"),
        W("niece","n. 侄女；外甥女"),
        W("pure","adj. 纯的"),
        W("refuse","拒绝"),
        W("reveal","v. 揭露"),
        W("seek","v. 寻找"),
        W("spouse","n. 配偶"),
        W("twin","n. 双胞胎"),
        W("widow","n. 寡妇")
      ]}
    ]},
    {n:"2000 Core English Words 3 (B1+)", p:"Compass Publishing", g:"B1+", uc:16,
     a:["2000 Core 3","2000 Core3","Compass 2000 3"], u:[
      {n:"Unit 1", w:[
        W("battery","n. 电池"),
        W("cellphone","n. 手机"),
        W("click","v./n. 点击"),
        W("computer","n. 电脑"),
        W("current","adj./n. 当前的；电流"),
        W("development","n. 发展"),
        W("file","n./v. 文件"),
        W("improve","改善"),
        W("keyboard","n. 键盘"),
        W("laptop","n. 笔记本电脑"),
        W("machine","机器"),
        W("online","adj./adv. 在线"),
        W("plug","n./v. 插头"),
        W("printer","n. 打印机"),
        W("speaker","n. 扬声器"),
        W("switch","n./v. 开关"),
        W("technique","n. 技术"),
        W("telephone","n. 电话"),
        W("update","v./n. 更新"),
        W("website","n. 网站")
      ]},
      {n:"Unit 2", w:[
        W("access","v./n. 访问；进入"),
        W("chat","n./v. 聊天"),
        W("device","n. 设备"),
        W("digital","adj. 数字的"),
        W("display","n./v. 显示"),
        W("dot","n. 点"),
        W("electric","adj. 电的"),
        W("electricity","电"),
        W("energy","能量"),
        W("information","n. 信息"),
        W("innovation","n. 创新"),
        W("link","n./v. 链接"),
        W("load","n./v. 负荷"),
        W("memory","记忆"),
        W("off","adv. 离开"),
        W("screen","屏幕"),
        W("search","搜索"),
        W("software","n. 软件"),
        W("technology","技术"),
        W("user","n. 用户")
      ]},
      {n:"Unit 3", w:[
        W("automatic","adj. 自动的"),
        W("code","n. 代码"),
        W("connection","n. 连接"),
        W("data","n. 数据"),
        W("disk","n. 磁盘"),
        W("equipment","n. 设备"),
        W("error","n. 错误"),
        W("function","n./v. 功能"),
        W("gear","n. 齿轮；装备"),
        W("generate","v. 产生"),
        W("hardware","n. 硬件"),
        W("network","n. 网络"),
        W("nuclear","adj. 核的"),
        W("procedure","n. 程序"),
        W("pump","n./v. 泵"),
        W("storage","n. 存储"),
        W("technical","adj. 技术的"),
        W("unit","单元"),
        W("virtual","adj. 虚拟的"),
        W("volume","n. 音量；体积")
      ]},
      {n:"Unit 4", w:[
        W("biography","n. 传记"),
        W("celebrity","n. 名人"),
        W("comedy","n. 喜剧"),
        W("download","v./n. 下载"),
        W("episode","n. 集；片段"),
        W("item","物品"),
        W("orchestra","n. 管弦乐队"),
        W("passage","段落"),
        W("performance","n. 表演"),
        W("performer","n. 表演者"),
        W("poem","诗"),
        W("poetry","n. 诗歌"),
        W("publish","出版"),
        W("release","n./v. 释放"),
        W("rhythm","n. 节奏"),
        W("scene","场景"),
        W("series","n. 系列"),
        W("shot","n. 射击；镜头"),
        W("statue","n. 雕像"),
        W("whistle","n. 口哨")
      ]},
      {n:"Unit 5", w:[
        W("amuse","v. 逗乐"),
        W("audience","观众"),
        W("author","n. 作者"),
        W("ballet","n. 芭蕾舞"),
        W("broadcast","v./n. 广播"),
        W("capture","v. 捕获"),
        W("commercial","adj./n. 商业的；广告"),
        W("conduct","行为"),
        W("craft","n. 工艺"),
        W("dramatic","adj. 戏剧性的"),
        W("edition","n. 版本"),
        W("expression","n. 表达"),
        W("fame","n. 名声"),
        W("horror","恐怖"),
        W("humor","n. 幽默"),
        W("media","n. 媒体"),
        W("plot","n./v. 情节"),
        W("publication","n. 出版"),
        W("publicity","n. 宣传"),
        W("tone","n. 语气")
      ]},
      {n:"Unit 6", w:[
        W("bill","账单"),
        W("borrow","借入"),
        W("budget","n./v. 预算"),
        W("buy","买"),
        W("cash","n. 现金"),
        W("cent","n. 分"),
        W("currency","n. 货币"),
        W("debt","n. 债务"),
        W("dollar","美元"),
        W("earn","v. 赚取"),
        W("economic","adj. 经济的"),
        W("exchange","交换"),
        W("income","n. 收入"),
        W("insurance","n. 保险"),
        W("loss","n. 损失"),
        W("pay","付款"),
        W("pound","n. 英镑"),
        W("save","拯救"),
        W("spend","花费"),
        W("wallet","n. 钱包")
      ]},
      {n:"Unit 7", w:[
        W("account","n. 账户"),
        W("award","n. 奖品"),
        W("balance","平衡"),
        W("charge","n./v. 收费；充电"),
        W("cost","花费"),
        W("deposit","n./v. 存款"),
        W("economy","n. 经济"),
        W("fare","n. 费用"),
        W("fee","n. 费用"),
        W("financial","adj. 金融的"),
        W("loan","n. 贷款"),
        W("owe","v. 欠"),
        W("rate","n. 比率"),
        W("sum","n. 总和"),
        W("tax","n. 税"),
        W("valuable","有价值的"),
        W("value","价值"),
        W("wage","n. 工资"),
        W("wealth","财富"),
        W("worth","价值")
      ]},
      {n:"Unit 8", w:[
        W("cabin","n. 小木屋"),
        W("cottage","n. 小屋"),
        W("dust","n. 灰尘"),
        W("facility","n. 设施"),
        W("faucet","n. 水龙头"),
        W("fountain","n. 喷泉"),
        W("frame","n. 框架"),
        W("heat","热"),
        W("heater","n. 加热器"),
        W("hut","n. 小屋"),
        W("lab","n. 实验室"),
        W("ladder","n. 梯子"),
        W("palace","宫殿"),
        W("property","n. 财产"),
        W("rug","n. 地毯"),
        W("ruin","n./v. 废墟"),
        W("shelter","n. 庇护所"),
        W("string","绳子"),
        W("structure","结构"),
        W("yard","n. 院子")
      ]},
      {n:"Unit 9", w:[
        W("altogether","adv. 总共"),
        W("brick","n. 砖"),
        W("candle","蜡烛"),
        W("closet","n. 衣柜"),
        W("column","n. 柱子；专栏"),
        W("concrete","adj./n. 混凝土"),
        W("condo","n. 公寓"),
        W("construction","n. 建筑"),
        W("counter","n. 柜台"),
        W("decoration","n. 装饰"),
        W("feature","n. 特征"),
        W("fence","n. 围栏"),
        W("hammer","锤子"),
        W("household","n./adj. 家庭"),
        W("interior","n./adj. 内部"),
        W("lamp","灯"),
        W("locate","v. 定位"),
        W("monument","n. 纪念碑"),
        W("resident","n. 居民"),
        W("studio","n. 工作室")
      ]},
      {n:"Unit 10", w:[
        W("ankle","n. 脚踝"),
        W("breathe","v. 呼吸"),
        W("cancer","n. 癌症"),
        W("cell","n. 细胞"),
        W("chest","n. 胸部"),
        W("flu","n. 流感"),
        W("funeral","n. 葬礼"),
        W("gene","n. 基因"),
        W("heel","n. 脚后跟"),
        W("lung","n. 肺"),
        W("obesity","n. 肥胖"),
        W("pregnant","adj. 怀孕的"),
        W("skull","n. 头骨"),
        W("surgery","n. 外科手术"),
        W("tension","n. 紧张"),
        W("thigh","n. 大腿"),
        W("throat","n. 喉咙"),
        W("waist","n. 腰部"),
        W("wound","伤口"),
        W("wrist","n. 手腕")
      ]},
      {n:"Unit 11", w:[
        W("badly","adv. 严重地"),
        W("buttock","n. 臀部"),
        W("carsick","adj. 晕车的"),
        W("depression","n. 抑郁"),
        W("disorder","n. 紊乱"),
        W("entire","adj. 整个的"),
        W("faint","adj./v. 微弱的；昏倒"),
        W("grave","n. 坟墓"),
        W("growth","n. 生长"),
        W("infection","n. 感染"),
        W("injury","n. 伤害"),
        W("internal","adj. 内部的"),
        W("joint","n. 关节"),
        W("medical","医学的"),
        W("naked","adj. 裸体的"),
        W("physician","n. 医生"),
        W("sneeze","v. 打喷嚏"),
        W("starve","v. 挨饿"),
        W("survive","生存"),
        W("sweat","n./v. 汗水")
      ]},
      {n:"Unit 12", w:[
        W("confuse","使困惑"),
        W("content","n./adj. 内容；满足的"),
        W("delight","n./v. 高兴"),
        W("eager","渴望的"),
        W("generous","adj. 慷慨的"),
        W("grateful","感激的"),
        W("hero","英雄"),
        W("imagination","n. 想象力"),
        W("judge","判断"),
        W("mood","n. 心情"),
        W("patient","耐心的"),
        W("pleasure","快乐"),
        W("proud","骄傲的"),
        W("regret","后悔"),
        W("reliable","adj. 可靠的"),
        W("selfish","adj. 自私的"),
        W("shocking","adj. 令人震惊的"),
        W("steady","adj. 稳定的"),
        W("suffer","遭受"),
        W("violent","adj. 暴力的")
      ]},
      {n:"Unit 13", w:[
        W("caring","关心他人的"),
        W("courage","勇气"),
        W("desire","n./v. 渴望"),
        W("doubt","n./v. 怀疑"),
        W("emotion","n. 情绪"),
        W("envy","n./v. 嫉妒"),
        W("faith","n. 信仰"),
        W("force","力量"),
        W("frank","adj. 坦率的"),
        W("freedom","自由"),
        W("honor","n. 荣誉"),
        W("mental","adj. 精神的"),
        W("misery","n. 痛苦"),
        W("offense","n. 冒犯"),
        W("reputation","n. 名声"),
        W("shocked","adj. 震惊的"),
        W("stress","压力"),
        W("stressful","adj. 有压力的"),
        W("strict","adj. 严格的"),
        W("truly","adv. 真正地")
      ]},
      {n:"Unit 14", w:[
        W("coffin","n. 棺材"),
        W("costume","n. 服装"),
        W("creed","n. 信条"),
        W("creepy","adj. 令人毛骨悚然的"),
        W("dead","adj. 死的"),
        W("gloomy","adj. 阴郁的"),
        W("graveyard","n. 墓地"),
        W("haunted","adj. 闹鬼的"),
        W("myth","n. 神话"),
        W("pray","v. 祈祷"),
        W("religion","n. 宗教"),
        W("ritual","n. 仪式"),
        W("sorrow","n. 悲伤"),
        W("spooky","adj. 阴森恐怖的"),
        W("tomb","n. 坟墓"),
        W("voodoo","n. 伏都教"),
        W("unlucky","adj. 不幸的"),
        W("werewolf","n. 狼人"),
        W("witch","n. 女巫"),
        W("worship","崇拜")
      ]},
      {n:"Unit 15", w:[
        W("angel","n. 天使"),
        W("appearance","n. 外貌；出现"),
        W("beast","n. 野兽"),
        W("crawl","v. 爬行"),
        W("crescent","n. 新月"),
        W("elf","n. 精灵"),
        W("evil","adj./n. 邪恶的"),
        W("fairy","n. 仙女"),
        W("false","错误的"),
        W("ghost","n. 鬼"),
        W("horn","n. 角；喇叭"),
        W("hunt","狩猎"),
        W("image","图像"),
        W("invisible","adj. 看不见的"),
        W("legend","n. 传说"),
        W("luck","运气"),
        W("mermaid","n. 美人鱼"),
        W("mysterious","adj. 神秘的"),
        W("mythical","adj. 神话的"),
        W("unicorn","n. 独角兽")
      ]},
      {n:"Unit 16", w:[
        W("beak","n. 喙"),
        W("breed","v./n. 繁殖；品种"),
        W("cattle","n. 牛"),
        W("claw","n. 爪子"),
        W("crab","n. 螃蟹"),
        W("creature","n. 生物"),
        W("extinct","adj. 灭绝的"),
        W("feather","n. 羽毛"),
        W("hatch","v. 孵化"),
        W("jellyfish","n. 水母"),
        W("leopard","n. 豹"),
        W("paw","n. 爪子"),
        W("reindeer","n. 驯鹿"),
        W("roar","n./v. 吼叫"),
        W("tail","n. 尾巴"),
        W("turtle","n. 海龟"),
        W("wildlife","n. 野生动物"),
        W("wolf","n. 狼"),
        W("worm","n. 蠕虫"),
        W("zookeeper","n. 动物园管理员")
      ]}
    ]},
    {n:"2000 Core English Words 4 (B2)", p:"Compass Publishing", g:"B2", uc:16,
     a:["2000 Core 4","2000 Core4","Compass 2000 4"], u:[
      {n:"Unit 1", w:[
        W("bay","n. 海湾"),
        W("bloom","v./n. 开花"),
        W("cliff","n. 悬崖"),
        W("climate","气候"),
        W("coast","n. 海岸"),
        W("coral","n./adj. 珊瑚"),
        W("district","n. 地区"),
        W("fossil","n. 化石"),
        W("galaxy","n. 星系"),
        W("pollution","n. 污染"),
        W("pond","n. 池塘"),
        W("recycle","v. 回收"),
        W("region","n. 地区"),
        W("scenery","n. 风景"),
        W("shore","n. 海岸"),
        W("soil","土壤"),
        W("stream","小溪"),
        W("trash","n. 垃圾"),
        W("universe","宇宙"),
        W("wave","波浪")
      ]},
      {n:"Unit 2", w:[
        W("adapt","v. 适应"),
        W("continent","n. 大陆"),
        W("disaster","n. 灾难"),
        W("environment","环境"),
        W("flame","n. 火焰"),
        W("flood","洪水"),
        W("flow","流动"),
        W("forecast","n./v. 预报"),
        W("freeze","冻结"),
        W("frozen","adj. 冻结的"),
        W("global","全球的"),
        W("humid","adj. 潮湿的"),
        W("impact","n./v. 影响"),
        W("landscape","n. 风景"),
        W("oxygen","氧气"),
        W("peak","n. 山顶"),
        W("polar","adj. 极地的"),
        W("rise","升起"),
        W("root","根"),
        W("underwater","adj./adv. 水下")
      ]},
      {n:"Unit 3", w:[
        W("border","n. 边界"),
        W("brake","n./v. 刹车"),
        W("convenient","方便的"),
        W("crash","n./v. 碰撞"),
        W("crew","n. 船员"),
        W("cycle","n./v. 循环"),
        W("eastern","adj. 东方的"),
        W("entry","n. 进入；条目"),
        W("expedition","n. 探险"),
        W("movement","n. 运动"),
        W("rail","n. 铁路"),
        W("reserve","n./v. 保留；预定"),
        W("resort","n. 度假地"),
        W("route","n. 路线"),
        W("sailor","n. 水手"),
        W("souvenir","n. 纪念品"),
        W("tourism","n. 旅游业"),
        W("transportation","n. 交通"),
        W("tropical","adj. 热带的"),
        W("wander","漫步")
      ]},
      {n:"Unit 4", w:[
        W("abroad","国外"),
        W("ahead","adv. 在前面"),
        W("aircraft","n. 飞机；飞行器"),
        W("baggage","n. 行李"),
        W("campsite","n. 露营地"),
        W("cruise","n./v. 巡航"),
        W("destination","n. 目的地"),
        W("fuel","n. 燃料"),
        W("jet","n. 喷气式飞机"),
        W("lane","n. 车道"),
        W("launch","发射"),
        W("motor","n. 发动机"),
        W("rush","v./n. 冲；匆忙"),
        W("signal","信号"),
        W("southern","南方的"),
        W("steer","v. 驾驶"),
        W("tunnel","n. 隧道"),
        W("vehicle","n. 车辆"),
        W("via","prep. 经由"),
        W("western","西方的")
      ]},
      {n:"Unit 5", w:[
        W("agent","n. 代理人"),
        W("apply","v. 申请"),
        W("assistant","n. 助手"),
        W("chief","n./adj. 首领"),
        W("client","n. 客户"),
        W("committee","n. 委员会"),
        W("editor","n. 编辑"),
        W("full-time","adj. 全职的"),
        W("hire","v. 雇用"),
        W("import","v./n. 进口"),
        W("issue","n./v. 问题"),
        W("manufacture","v. 制造"),
        W("minister","n. 部长"),
        W("officer","n. 军官；官员"),
        W("priest","n. 神父"),
        W("producer","n. 制片人"),
        W("production","n. 生产"),
        W("promotion","n. 晋升"),
        W("retire","v. 退休"),
        W("specialist","n. 专家")
      ]},
      {n:"Unit 6", w:[
        W("barber","n. 理发师"),
        W("boss","n. 老板"),
        W("capable","adj. 有能力的"),
        W("chart","n. 图表"),
        W("contract","n./v. 合同"),
        W("debate","辩论"),
        W("employ","v. 雇用"),
        W("expert","n. 专家"),
        W("guide","导游"),
        W("profession","n. 职业"),
        W("profit","n. 利润"),
        W("promote","v. 促进；晋升"),
        W("report","报告"),
        W("responsibility","n. 责任"),
        W("schedule","n./v. 时间表"),
        W("servant","仆人"),
        W("signature","n. 签名"),
        W("spare","adj./v. 空闲的；抽出"),
        W("strike","n./v. 罢工"),
        W("survey","调查")
      ]},
      {n:"Unit 7", w:[
        W("ally","n. 盟友"),
        W("argue","v. 争论"),
        W("armor","n. 盔甲"),
        W("arrow","n. 箭"),
        W("attack","攻击"),
        W("attention","注意力"),
        W("captain","队长"),
        W("defeat","击败"),
        W("guard","守卫"),
        W("gun","n. 枪"),
        W("helmet","n. 头盔"),
        W("jeep","n. 吉普车"),
        W("military","adj./n. 军事的"),
        W("navy","n. 海军"),
        W("peace","和平"),
        W("radar","n. 雷达"),
        W("soldier","士兵"),
        W("submarine","n. 潜艇"),
        W("tank","n. 坦克"),
        W("weapon","武器")
      ]},
      {n:"Unit 8", w:[
        W("agreement","n. 协议"),
        W("army","n. 军队"),
        W("aviation","n. 航空"),
        W("battle","战斗"),
        W("capital","首都"),
        W("charity","n. 慈善"),
        W("crisis","n. 危机"),
        W("gain","v./n. 获得"),
        W("government","n. 政府"),
        W("independent","adj. 独立的"),
        W("leader","领导者"),
        W("marine","adj./n. 海洋的"),
        W("nation","国家"),
        W("national","adj. 国家的"),
        W("official","adj./n. 官方的"),
        W("president","总统"),
        W("public","公共的"),
        W("revolution","n. 革命"),
        W("social","社会的"),
        W("society","社会")
      ]},
      {n:"Unit 9", w:[
        W("authority","n. 权威"),
        W("blame","n./v. 责备"),
        W("candidate","n. 候选人"),
        W("citizen","公民"),
        W("council","n. 委员会"),
        W("democracy","n. 民主"),
        W("deny","v. 否认"),
        W("domestic","adj. 国内的"),
        W("election","n. 选举"),
        W("federal","adj. 联邦的"),
        W("govern","统治"),
        W("influence","影响"),
        W("massive","adj. 巨大的"),
        W("parliament","n. 议会"),
        W("policy","n. 政策"),
        W("politician","n. 政治家"),
        W("politics","n. 政治"),
        W("regulation","n. 规定"),
        W("republic","n. 共和国"),
        W("royal","adj. 皇家的")
      ]},
      {n:"Unit 10", w:[
        W("clue","n. 线索"),
        W("crime","n. 犯罪"),
        W("criminal","n. 罪犯"),
        W("danger","危险"),
        W("death","n. 死亡"),
        W("evidence","证据"),
        W("guilty","adj. 有罪的"),
        W("illegal","adj. 非法的"),
        W("jail","n. 监狱"),
        W("justice","正义"),
        W("law","n. 法律"),
        W("legal","adj. 法律的"),
        W("police","警察"),
        W("prison","监狱"),
        W("prisoner","n. 囚犯"),
        W("punish","惩罚"),
        W("punishment","n. 惩罚"),
        W("rule","规则"),
        W("thief","小偷"),
        W("trick","诡计")
      ]},
      {n:"Unit 11", w:[
        W("accuse","v. 指控"),
        W("armed","adj. 武装的"),
        W("arrest","v./n. 逮捕"),
        W("bullet","n. 子弹"),
        W("commit","v. 犯（罪）"),
        W("cruel","adj. 残忍的"),
        W("deliberate","adj. 故意的"),
        W("fear","恐惧"),
        W("frighten","吓唬"),
        W("hold","拿着"),
        W("innocent","adj. 无辜的"),
        W("penalty","n. 惩罚"),
        W("potential","adj. 潜在的"),
        W("pretend","假装"),
        W("risk","n./v. 风险"),
        W("shock","n./v. 震惊"),
        W("suspect","怀疑"),
        W("suspicion","n. 怀疑"),
        W("trial","n. 审判"),
        W("witness","目击者")
      ]},
      {n:"Unit 12", w:[
        W("arithmetic","n. 算术"),
        W("billion","n. 十亿"),
        W("calculate","v. 计算"),
        W("compass","n. 指南针"),
        W("divide","分开"),
        W("division","n. 除法"),
        W("dozen","n. 一打"),
        W("equation","n. 方程"),
        W("even","adj./adv. 甚至"),
        W("formula","n. 公式"),
        W("fraction","n. 分数"),
        W("graph","n. 图表"),
        W("less","adj. 更少的"),
        W("minus","prep./adj. 减"),
        W("multiply","v. 乘"),
        W("ordinal","adj. 序数的"),
        W("percent","n. 百分比"),
        W("plus","prep./adj. 加"),
        W("quarter","四分之一"),
        W("subtract","v. 减去")
      ]},
      {n:"Unit 13", w:[
        W("certificate","n. 证书"),
        W("creativity","n. 创造力"),
        W("degree","n. 学位；程度"),
        W("demand","n./v. 要求"),
        W("direction","n. 方向"),
        W("education","教育"),
        W("elementary","adj. 初级的"),
        W("examination","n. 考试"),
        W("focus","集中"),
        W("instruction","n. 指导"),
        W("intelligence","n. 智力"),
        W("knowledge","知识"),
        W("major","主要的"),
        W("mark","标记"),
        W("master","掌握"),
        W("mentor","n. 导师"),
        W("section","部分"),
        W("solve","解决"),
        W("standard","n./adj. 标准"),
        W("tuition","n. 学费")
      ]},
      {n:"Unit 14", w:[
        W("academic","adj. 学术的"),
        W("curriculum","n. 课程"),
        W("diploma","n. 文凭"),
        W("draft","n./v. 草稿"),
        W("educate","v. 教育"),
        W("educational","adj. 教育的"),
        W("fail","失败"),
        W("graduation","n. 毕业"),
        W("institution","n. 机构"),
        W("lecturer","n. 讲师"),
        W("literacy","n. 读写能力"),
        W("midterm","n. 期中考试"),
        W("minor","adj./n. 次要的；辅修"),
        W("philosophy","n. 哲学"),
        W("progressive","adj. 进步的"),
        W("reference","n. 参考"),
        W("term","n. 学期；术语"),
        W("tutor","n. 导师"),
        W("tutorial","n. 教程"),
        W("union","n. 联盟")
      ]},
      {n:"Unit 15", w:[
        W("annoy","v. 使烦恼"),
        W("belief","n. 信念"),
        W("belong","属于"),
        W("charm","n. 魅力"),
        W("cheat","v. 欺骗"),
        W("depressed","adj. 沮丧的"),
        W("disappoint","v. 使失望"),
        W("embarrassed","adj. 尴尬的"),
        W("intelligent","聪明的"),
        W("jealous","adj. 嫉妒的"),
        W("lively","adj. 活泼的"),
        W("lonely","孤独的"),
        W("miserable","adj. 痛苦的"),
        W("negative","adj. 消极的"),
        W("nervous","紧张的"),
        W("positive","积极的"),
        W("pride","n. 骄傲"),
        W("respect","尊重"),
        W("satisfy","v. 满足"),
        W("severe","adj. 严重的")
      ]},
      {n:"Unit 16", w:[
        W("anger","n. 愤怒"),
        W("anxiety","n. 焦虑"),
        W("anxious","adj. 焦虑的"),
        W("appeal","v./n. 呼吁"),
        W("appreciate","欣赏"),
        W("aware","adj. 意识到的"),
        W("awkward","adj. 尴尬的"),
        W("comfort","n./v. 舒适"),
        W("command","n./v. 命令"),
        W("concern","n./v. 关心"),
        W("confidence","n. 信心"),
        W("esteem","n. 尊重"),
        W("extreme","adj. 极端的"),
        W("fright","n. 惊吓"),
        W("grief","n. 悲伤"),
        W("hopeless","adj. 无望的"),
        W("sensible","adj. 明智的"),
        W("tense","adj. 紧张的"),
        W("thoughtful","adj. 深思熟虑的"),
        W("wisdom","智慧")
      ]}
    ]}
  ]
}
// ============================================================================
const USERS_KEY = 'vocab_champion_users';
const DATA_PREFIX = 'vocab_champion_data_';
const EBBINGHAUS_STAGES = [5*60, 30*60, 12*3600, 24*3600, 2*86400, 4*86400, 7*86400, 15*86400];
const STAGE_LABELS = ['5分钟后','30分钟后','12小时后','1天后','2天后','4天后','7天后','已掌握'];

// Check-in / review history tracking
function getCheckinData(){
  try{return JSON.parse(localStorage.getItem('vocab_champion_checkin_'+getActiveUserId()))||{};}
  catch(e){return{};}
}
function saveCheckinData(data){localStorage.setItem('vocab_champion_checkin_'+getActiveUserId(),JSON.stringify(data));}
function recordCheckin(){
  const data=getCheckinData();
  const d0=new Date();const today=d0.getFullYear()+'-'+String(d0.getMonth()+1).padStart(2,'0')+'-'+String(d0.getDate()).padStart(2,'0');
  data[today]=(data[today]||0)+1;
  saveCheckinData(data);
}
function getCheckinDates(){return Object.keys(getCheckinData()).sort();}
function getCheckinStreak(){
  const dates=getCheckinDates();
  if(!dates.length)return 0;
  let streak=0;
  const today=new Date();today.setHours(0,0,0,0);
  for(let i=dates.length-1;i>=0;i--){
    const d=new Date(dates[i]+'T00:00:00');
    const expected=new Date(today);expected.setDate(expected.getDate()-(dates.length-1-i));
    if(d.getTime()===expected.getTime())streak++;
    else break;
  }
  return streak;
}

function updateHeaderReviewBadge(){
  const badge=document.getElementById('headerReviewBadge');
  if(!badge)return;
  const words=getWordBank(),now=Date.now();
  const due=words.filter(w=>w.nextReview<=now&&w.stage<EBBINGHAUS_STAGES.length-1).length;
  if(due>0){badge.style.display='inline';badge.innerHTML='<svg class="icon"><use href="#icon-warning"/></svg> '+due+'词待复习';}
  else{badge.style.display='none';}
}

let _calMonth=null;
function renderCheckinCalendar(offset){
  try{
    if(offset===undefined&&_calMonth!==null)offset=_calMonth;
    const now=new Date();
    const ym=offset!=null?offset:{y:now.getFullYear(),m:now.getMonth()};
    _calMonth=ym;
    const first=new Date(ym.y,ym.m,1);
    const last=new Date(ym.y,ym.m+1,0);
    const startDow=first.getDay();
    let dates=[];
    try{dates=getCheckinDates();}catch(e){}
    const checkinSet=new Set(dates);
    const todayStr=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
    const months=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    const dayHdrs=['日','一','二','三','四','五','六'];

    let html='<div class="cal-month-nav">';
    html+='<button onclick="renderCheckinCalendar({y:'+ym.y+',m:'+(ym.m-1)+'})">◀</button>';
    html+='<span class="cal-month-title">'+ym.y+'年 '+months[ym.m]+'</span>';
    html+='<button onclick="renderCheckinCalendar({y:'+ym.y+',m:'+(ym.m+1)+'})">▶</button>';
    html+='</div>';
    html+='<div class="cal-grid">';
    for(var i=0;i<dayHdrs.length;i++)html+='<div class="cal-day-hdr">'+dayHdrs[i]+'</div>';
    for(var i=0;i<startDow;i++)html+='<div class="cal-cell empty"></div>';
    for(var d=1;d<=last.getDate();d++){
      var ds=ym.y+'-'+String(ym.m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
      var checked=checkinSet.has(ds);
      var isToday=ds===todayStr;
      var cls='cal-cell';
      if(checked)cls+=' checked';
      if(isToday&&!checked)cls+=' today';
      html+='<div class="'+cls+'" title="'+ds+'">'+d+'</div>';
    }
    html+='</div>';
    var el=document.getElementById('checkinCalendar');
    if(el)el.innerHTML=html;
    var sl=document.getElementById('streakLabel');
    if(sl){var s=getCheckinStreak();sl.innerHTML=s>0?'<svg class="icon"><use href="#icon-calendar"/></svg> 已连续打卡 '+s+' 天':'';}
  }catch(e){
    var el2=document.getElementById('checkinCalendar');
    if(el2)el2.innerHTML='<div style="padding:16px;color:var(--muted);">日历加载失败，请刷新页面</div>';
  }
}

function getUsersMeta(){
  try{return JSON.parse(localStorage.getItem(USERS_KEY))||{users:[],activeUserId:null};}
  catch(e){return{users:[],activeUserId:null};}
}
function saveUsersMeta(meta){localStorage.setItem(USERS_KEY,JSON.stringify(meta));}

function getActiveUserId(){
  const meta=getUsersMeta();
  return meta.activeUserId||'default';
}
function getUserStorageKey(){
  return DATA_PREFIX+getActiveUserId();
}

function migrateToMultiUser(){
  if(localStorage.getItem(USERS_KEY))return; // already migrated
  const oldData=localStorage.getItem('vocab_champion_data');
  const defaultId='u_'+Date.now();
  const meta={
    users:[{id:defaultId,name:'默认用户',createdAt:Date.now()}],
    activeUserId:defaultId
  };
  saveUsersMeta(meta);
  if(oldData){
    localStorage.setItem(DATA_PREFIX+defaultId,oldData);
    localStorage.removeItem('vocab_champion_data');
  }
}

// ── Word Info Cache (Plan C: localStorage → DICTIONARY → API) ───────────
function _getWordCacheKey(){ return 'vocab_wordcache_'+getActiveUserId(); }
function _getWordCache(){
  try{ return JSON.parse(localStorage.getItem(_getWordCacheKey())) || {}; }
  catch(e){ return {}; }
}
function _setWordCacheEntry(en, info){
  const key=_getWordCacheKey(), cache=_getWordCache();
  cache[en.toLowerCase().trim()]=info;
  try{ localStorage.setItem(key, JSON.stringify(cache)); }catch(e){}
}

async function fetchWordInfo(en){
  const word=en.toLowerCase().trim();
  if(!word) return { def:'', phonetic:'', pos:'', zh:'' };
  // Tier 1: localStorage cache
  const cache=_getWordCache();
  if(cache[word] && (cache[word].def || cache[word].zh)) return cache[word];
  let result={ def:'', phonetic:'', pos:'', zh:'' }, fromDict=false;
  // Tier 2: DICTIONARY (in-memory, instant)
  const d=DICTIONARY.find(function(d){return d.en.toLowerCase()===word;});
  if(d){
    fromDict=true;
    if(d.def) result.def=d.def;
    if(d.phonetic) result.phonetic=d.phonetic;
    if(d.pos) result.pos=d.pos;
    if(d.zh) result.zh=d.zh;
  }
  if(fromDict){ _setWordCacheEntry(word, result); return result; }
  // Tier 3: Free Dictionary API (def, phonetic, POS)
  try{
    const resp=await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+encodeURIComponent(word));
    if(resp.ok){
      const data=await resp.json();
      if(data&&data.length>0){
        const entry=data[0];
        if(!result.phonetic&&entry.phonetics&&entry.phonetics.length>0){
          const p=entry.phonetics.find(function(p){return p.text;});
          if(p) result.phonetic=p.text;
        }
        if(entry.meanings&&entry.meanings.length>0){
          const m=entry.meanings[0];
          if(!result.pos&&m.partOfSpeech) result.pos=normalizePOS(m.partOfSpeech);
          if(!result.def&&m.definitions&&m.definitions.length>0) result.def=m.definitions[0].definition;
        }
      }
    }
  }catch(e){}
  // Tier 4: MyMemory translation API (Chinese meaning)
  if(!result.zh){
    try{
      const resp=await fetch('https://api.mymemory.translated.net/get?q='+encodeURIComponent(en)+'&langpair=en|zh');
      if(resp.ok){
        const data=await resp.json();
        if(data&&data.responseData&&data.responseData.translatedText&&data.responseData.translatedText!==en)
          result.zh=data.responseData.translatedText;
      }
    }catch(e){}
  }
  _setWordCacheEntry(word, result);
  return result;
}

function loadData(){
  try{
    const key=getUserStorageKey();
    const data=JSON.parse(localStorage.getItem(key))||{words:[],errors:{}};
    let migrated=false;
    data.words.forEach(w=>{
      if(w.phonetic===undefined){w.phonetic='';migrated=true;}
      if(w.pos===undefined){w.pos='';migrated=true;}
      if(w.stage===undefined){w.stage=0;migrated=true;}
      if(w.nextReview===undefined){w.nextReview=0;migrated=true;}
      if(w.lastReview===undefined){w.lastReview=0;migrated=true;}
      if(w.totalAttempts===undefined){w.totalAttempts=0;migrated=true;}
      if(w.errorCount===undefined){w.errorCount=0;migrated=true;}
      if(w.addedAt===undefined){w.addedAt=0;migrated=true;}
      // Clean POS suffix from zh field if accidentally stored
      if(w.zh&&(/^\s*(n\.|v\.|adj\.|adv\.|prep\.|conj\.|pron\.|num\.|det\.|phr\.)\s+/.test(w.zh)||/\s+(n\.|v\.|adj\.|adv\.|prep\.|conj\.|pron\.|num\.|det\.|phr\.)$/.test(w.zh))){w.zh=w.zh.replace(/^\s*(n\.|v\.|adj\.|adv\.|prep\.|conj\.|pron\.|num\.|det\.|phr\.)\s+/,'').replace(/\s+(n\.|v\.|adj\.|adv\.|prep\.|conj\.|pron\.|num\.|det\.|phr\.)$/,'');migrated=true;}
    });
    if(migrated)localStorage.setItem(key,JSON.stringify(data));
    return data;
  }catch(e){return{words:[],errors:{}}}
}
function saveData(data){localStorage.setItem(getUserStorageKey(),JSON.stringify(data));}

function getWordBank(){return loadData().words;}
function getErrors(){return loadData().errors||{};}

function normalizePOS(pos){
  if(!pos)return'';
  pos=pos.toLowerCase().replace(/^[.\s]+|[.\s]+$/g,'').replace(/\.$/,'');
  const map={
    n:'n.',noun:'n.',v:'v.',verb:'v.',vi:'v.',vt:'v.',
    adj:'adj.',adjective:'adj.',adv:'adv.',adverb:'adv.',
    prep:'prep.',preposition:'prep.',conj:'conj.',conjunction:'conj.',
    pron:'pron.',pronoun:'pron.',num:'num.',numeral:'num.',
    det:'det.',determiner:'det.',phr:'phr.',phrase:'phr.',
    interj:'interj.',interjection:'interj.',art:'art.',article:'art.',
    aux:'aux.',auxiliary:'aux.',modal:'aux.',
  };
  if(map[pos])return map[pos];
  if(/^(n|v|adj|adv|prep|conj|pron|num|det|phr|interj|art|aux)$/.test(pos))return pos+'.';
  return pos;
}

async function saveWordToBank(word){
  const data=loadData();
  word.pos=normalizePOS(word.pos);
  // Plan C auto-fill: cache → DICTIONARY → API
  if(!word.def||!word.phonetic||!word.pos||!word.zh){
    const info=await fetchWordInfo(word.en);
    if(!word.def&&info.def)word.def=info.def;
    if(!word.phonetic&&info.phonetic)word.phonetic=info.phonetic;
    if(!word.pos&&info.pos)word.pos=normalizePOS(info.pos);
    if(!word.zh&&info.zh)word.zh=info.zh;
  }
  const idx=data.words.findIndex(w=>w.en.toLowerCase()===word.en.toLowerCase());
  if(idx>=0){
    data.words[idx].zh=word.zh||data.words[idx].zh;
    data.words[idx].def=word.def||data.words[idx].def;
    if(word.phonetic)data.words[idx].phonetic=word.phonetic;
    if(word.pos)data.words[idx].pos=word.pos;
  }else{
    data.words.push({
      en:word.en,zh:word.zh||'',def:word.def||'',
      phonetic:word.phonetic||'',pos:word.pos||'',
      stage:0,lastReview:0,nextReview:Date.now(),
      errorCount:0,totalAttempts:0,addedAt:Date.now()
    });
  }
  saveData(data);
}

function updateWordProgress(en,correct){
  const data=loadData();
  const word=data.words.find(w=>w.en.toLowerCase()===en.toLowerCase());
  if(!word)return;
  word.totalAttempts=(word.totalAttempts||0)+1;
  word.lastReview=Date.now();
  if(correct){
    if(word.stage<EBBINGHAUS_STAGES.length-1)word.stage++;
    word.nextReview=Date.now()+(EBBINGHAUS_STAGES[word.stage]||EBBINGHAUS_STAGES[EBBINGHAUS_STAGES.length-1])*1000;
    if(data.errors[word.en])delete data.errors[word.en];
  }else{
    word.stage=0;word.nextReview=Date.now()+5*60*1000;
    word.errorCount=(word.errorCount||0)+1;
    data.errors[word.en]=(data.errors[word.en]||0)+1;
  }
  saveData(data);
}

// ============================================================================
// UI HELPERS
// ============================================================================
function toast(msg,type='success'){
  const t=document.createElement('div');t.className='toast toast-'+type;t.textContent=msg;
  document.body.appendChild(t);setTimeout(()=>t.remove(),2500);
}

function switchTab(tab){
  const tabOrder=['review','bank','game','profile'];
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  const currentView=document.querySelector('.view.active');
  const nextView=document.getElementById('view-'+tab);
  if(!nextView||currentView===nextView)return;
  const currentIdx=currentView?tabOrder.indexOf(currentView.id.replace('view-','')):0;
  const nextIdx=tabOrder.indexOf(tab);
  const goingRight=nextIdx>currentIdx;
  if(currentView){
    currentView.classList.add(goingRight?'slide-out-left':'slide-out-right');
  }
  nextView.classList.add(goingRight?'slide-in-right':'slide-in-left');
  nextView.classList.add('active');
  setTimeout(function(){
    if(currentView){
      currentView.classList.remove('active','slide-out-left','slide-out-right');
    }
    nextView.classList.remove('slide-in-right','slide-in-left');
  },280);
  if(tab==='bank')renderBank();
  if(tab==='review')renderReview();
  if(tab==='profile')renderProfile();
}

// ============================================================================
// WORD BANK VIEW
// ============================================================================
let reviewFilter='all';
function setReviewFilter(f){ reviewFilter=f; renderReview(); }

function renderBank(){
  const tbData=getTextbooksData();
  const heading=document.getElementById('textbookSectionHeading');
  if(heading&&tbData.textbooks){
    heading.innerHTML='<svg class="icon"><use href="#icon-bank"/></svg> 教材词汇库 <span style="font-size:.7em;color:var(--muted);font-weight:normal;">('+tbData.textbooks.length+'套教材)</span>';
  }
}

function markReviewed(en){
  const data=loadData();
  const w=data.words.find(w=>w.en.toLowerCase()===en.toLowerCase());
  if(!w)return;
  w.lastReview=Date.now();
  if(w.stage<EBBINGHAUS_STAGES.length-1)w.stage++;
  w.nextReview=Date.now()+(EBBINGHAUS_STAGES[Math.min(w.stage,EBBINGHAUS_STAGES.length-1)]||EBBINGHAUS_STAGES[EBBINGHAUS_STAGES.length-1])*1000;
  w.totalAttempts=(w.totalAttempts||0)+1;
  saveData(data);
  recordCheckin();
  toast('已标记复习完成: '+en);
  renderReview();
  renderProfile();
}
function renderReview(){
  const words=getWordBank(),errors=getErrors(),now=Date.now();
  const due=words.filter(function(w){return w.nextReview<=now&&w.stage<EBBINGHAUS_STAGES.length-1;});
  const errWords=Object.keys(errors);
  const masteredWords=words.filter(function(w){return w.stage>=EBBINGHAUS_STAGES.length-1;});
  const mastered=masteredWords.length;
  const errCount=errWords.length;
  const streak=getCheckinStreak();
  const statsRow=document.getElementById('reviewStatsRow');
  if(statsRow)statsRow.innerHTML=
    '<div class="stat-card'+(reviewFilter==='all'?' filter-active':'')+'" onclick="setReviewFilter(\'all\')"><div class="num">'+words.length+'</div><div class="label"><svg class="icon"><use href="#icon-bank"/></svg> 总词汇</div></div>'+
    '<div class="stat-card'+(reviewFilter==='due'?' filter-active':'')+'" onclick="setReviewFilter(\'due\')" style="'+(due.length>0?'border-color:var(--red-lt);background:var(--red-lt);':'')+'"><div class="num" style="color:var(--red)">'+due.length+'</div><div class="label"><svg class="icon"><use href="#icon-warning"/></svg> 待复习</div></div>'+
    '<div class="stat-card'+(reviewFilter==='errors'?' filter-active':'')+'" onclick="setReviewFilter(\'errors\')"><div class="num" style="color:var(--accent)">'+errCount+'</div><div class="label"><svg class="icon"><use href="#icon-error"/></svg> 错词集</div></div>'+
    '<div class="stat-card'+(reviewFilter==='mastered'?' filter-active':'')+'" onclick="setReviewFilter(\'mastered\')"><div class="num" style="color:var(--green)">'+mastered+'</div><div class="label"><svg class="icon"><use href="#icon-success"/></svg> 已掌握</div></div>'+
    '<div class="stat-card" onclick="switchTab(\'profile\')"><div class="num" style="color:var(--accent2)">'+streak+'天</div><div class="label"><svg class="icon"><use href="#icon-calendar"/></svg> 连续打卡</div></div>';
  updateHeaderReviewBadge();
  var filtered;
  if(reviewFilter==='all')filtered=words;
  else if(reviewFilter==='errors')filtered=words.filter(function(w){return errors[w.en];});
  else if(reviewFilter==='mastered')filtered=masteredWords;
  else filtered=due;
  var list=document.getElementById('wordList');
  var empty=document.getElementById('emptyBank');
  if(!list)return;
  if(words.length===0){list.innerHTML='';if(empty)empty.style.display='block';return;}
  if(empty)empty.style.display='none';
  if(filtered.length===0){
    list.innerHTML='<div class="empty"><span class="icon">🔍</span><p>没有匹配的单词</p></div>';
    return;
  }
  var isAll=reviewFilter==='all', isDue=reviewFilter==='due', isErrors=reviewFilter==='errors', isMastered=reviewFilter==='mastered';
  list.innerHTML=filtered.map(function(w){
    var pos=w.pos?'<span class="pos">'+w.pos+'</span>':'<span class="pos pos-empty"></span>';
    var pct=w.totalAttempts>0?Math.round((w.totalAttempts-w.errorCount)/w.totalAttempts*100):0;
    var errWord=!!errors[w.en];
    var extra='';
    if(isDue||isErrors){
      var pctStr=w.totalAttempts>0?'<span class="r-pct">正确率'+pct+'%</span>':'<span class="r-pct">新词</span>';
      extra+=pctStr;
    }
    if(isDue){
      var reason=errWord?'<span class="r-reason r-err">错词</span>':'<span class="r-reason">'+STAGE_LABELS[Math.min(w.stage,6)]+'</span>';
      extra+=reason;
      extra+='<button class="btn btn-xs btn-review" onclick="markReviewed(\''+w.en+'\')">已复习</button>';
    }
    if(isAll){
      extra+='<button class="btn btn-xs btn-edit-row" onclick="editWord(\''+w.en+'\')">编辑</button>';
      extra+='<button class="btn btn-xs btn-del-row" onclick="deleteWord(\''+w.en+'\')">删</button>';
    }
    return'<div class="word-row word-row-review">'+
      '<span class="rw-en">'+w.en+'</span>'+pos+
      '<span class="rw-zh">'+(w.zh||'—')+'</span>'+
      '<span class="rw-extra">'+extra+'</span>'+
    '</div>';
  }).join('');
}


function deleteWord(en){
  const data=loadData();
  data.words=data.words.filter(w=>w.en.toLowerCase()!==en.toLowerCase());
  if(data.errors[en])delete data.errors[en];
  saveData(data);renderBank();renderReview();renderProfile();toast('已删除: '+en);
}

function editWord(en){
  const data=loadData();
  const w=data.words.find(w=>w.en.toLowerCase()===en.toLowerCase());
  if(!w)return;
  document.getElementById('addEn').value=w.en;
  document.getElementById('addPhonetic').value=w.phonetic||'';
  document.getElementById('addPos').value=w.pos||'';
  document.getElementById('addZh').value=w.zh||'';
  document.getElementById('addDef').value=w.def||'';
  showAddWord();
}

function clearAll(){
  if(!confirm('确定要清空所有单词和学习记录吗？此操作不可恢复！'))return;
  localStorage.removeItem(getUserStorageKey());renderBank();toast('词库已清空');
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================
function switchUser(userId){
  const meta=getUsersMeta();
  if(!meta.users.find(u=>u.id===userId))return false;
  if(gameState)backToMenu();
  meta.activeUserId=userId;
  saveUsersMeta(meta);
  renderBank();
  updateUserDisplay();
  return true;
}
function addUser(name){
  const meta=getUsersMeta();
  const id='u_'+Date.now();
  meta.users.push({id,name,createdAt:Date.now()});
  meta.activeUserId=id;
  saveUsersMeta(meta);
  localStorage.setItem(DATA_PREFIX+id,JSON.stringify({words:[],errors:{}}));
  renderBank();
  updateUserDisplay();
  toast('已添加用户: '+name);
}
function deleteUser(userId){
  const meta=getUsersMeta();
  if(meta.users.length<=1){toast('至少保留一个用户','error');return;}
  meta.users=meta.users.filter(u=>u.id!==userId);
  localStorage.removeItem(DATA_PREFIX+userId);
  if(meta.activeUserId===userId)meta.activeUserId=meta.users[0].id;
  saveUsersMeta(meta);
  renderBank();
  updateUserDisplay();
  toast('用户已删除');
}
function updateUserDisplay(){
  const meta=getUsersMeta();
  const aid=getActiveUserId();
  const active=meta.users.find(u=>u.id===aid);
  const el=document.getElementById('currentUserName');
  if(el)el.textContent=active?active.name:'默认用户';
  const avatar=active&&active.avatar||'<svg class="icon" style="font-size:1.2em;"><use href="#icon-profile"/></svg>';
  const parent=el?el.parentNode:null;
  if(parent){
    let avatarEl=parent.querySelector('.header-avatar');
    if(!avatarEl){
      avatarEl=document.createElement('span');
      avatarEl.className='header-avatar';
      avatarEl.style.cssText='margin-right:4px;font-size:1.1em;';
      parent.insertBefore(avatarEl,el);
    }
    if(avatar.startsWith('data:')){
      avatarEl.innerHTML='<img src="'+avatar+'" style="width:20px;height:20px;border-radius:50%;object-fit:cover;vertical-align:middle;">';
    }else{
      avatarEl.textContent=avatar;
    }
  }
}

function getActiveUserMeta(){
  const meta=getUsersMeta();
  const aid=getActiveUserId();
  return meta.users.find(function(u){return u.id===aid;});
}
function updateAvatarDisplay(){
  const user=getActiveUserMeta();
  const avatar=user&&user.avatar||'<svg class="icon" style="font-size:1.2em;"><use href="#icon-profile"/></svg>';
  const el=document.getElementById('avatarContent');
  if(el){
    if(avatar.startsWith('data:')){
      el.innerHTML='<img src="'+avatar+'" alt="avatar">';
    }else{
      el.innerHTML='';
      el.textContent=avatar;
    }
  }
}
function toggleAvatarPicker(){
  const picker=document.getElementById('avatarPicker');
  if(picker)picker.style.display=picker.style.display==='none'?'block':'none';
}
function pickAvatar(emoji){
  const meta=getUsersMeta();
  const aid=getActiveUserId();
  const user=meta.users.find(function(u){return u.id===aid;});
  if(!user)return;
  user.avatar=emoji;
  saveUsersMeta(meta);
  updateAvatarDisplay();
  updateUserDisplay();
  document.getElementById('avatarPicker').style.display='none';
  toast('头像已更新: '+emoji);
}
function handleAvatarUpload(input){
  if(!input.files||!input.files.length)return;
  const file=input.files[0];
  if(file.size>200*1024){toast('图片不能超过200KB','error');return;}
  const reader=new FileReader();
  reader.onload=function(){
    const meta=getUsersMeta();
    const aid=getActiveUserId();
    const user=meta.users.find(function(u){return u.id===aid;});
    if(!user)return;
    // Resize large images
    const img=new Image();
    img.onload=function(){
      const canvas=document.createElement('canvas');
      const max=200;
      let w=img.width,h=img.height;
      if(w>h&&w>max){h=h*max/w;w=max;}
      else if(h>max){w=w*max/h;h=max;}
      canvas.width=w;canvas.height=h;
      const ctx=canvas.getContext('2d');
      ctx.drawImage(img,0,0,w,h);
      user.avatar=canvas.toDataURL('image/jpeg',0.7);
      saveUsersMeta(meta);
      updateAvatarDisplay();
      updateUserDisplay();
      document.getElementById('avatarPicker').style.display='none';
      toast('头像已更新');
    };
    img.src=reader.result;
  };
  reader.readAsDataURL(file);
}

function showUserModal(){
  const meta=getUsersMeta();
  const list=document.getElementById('userList');
  list.innerHTML=meta.users.map(u=>`<div class="user-row${u.id===meta.activeUserId?' active':''}" onclick="switchUser('${u.id}');closeUserModal();">
    <span>${u.id===meta.activeUserId?'✅ ':''}${u.name}</span>
    ${meta.users.length>1?`<button class="user-del" onclick="event.stopPropagation();if(confirm('删除用户 ${u.name} 及其所有数据？')){deleteUser('${u.id}');showUserModal();}">删除</button>`:''}
  </div>`).join('');
  document.getElementById('userModal').style.display='flex';
}
function closeUserModal(){document.getElementById('userModal').style.display='none';}
function doAddUser(){
  const name=document.getElementById('newUserName').value.trim();
  if(!name){toast('请输入用户名','error');return;}
  addUser(name);
  document.getElementById('newUserName').value='';
  showUserModal();
}

function showAddWord(){document.getElementById('addWordModal').style.display='flex';}
function closeAddWord(){
  document.getElementById('addWordModal').style.display='none';
  document.getElementById('addEn').value='';
  document.getElementById('addPhonetic').value='';
  document.getElementById('addPos').value='';
  document.getElementById('addZh').value='';
  document.getElementById('addDef').value='';
}
async function saveWord(){
  const en=document.getElementById('addEn').value.trim();
  const zh=document.getElementById('addZh').value.trim();
  const def=document.getElementById('addDef').value.trim();
  const phonetic=document.getElementById('addPhonetic').value.trim();
  const pos=document.getElementById('addPos').value.trim();
  if(!en||!zh)return toast('英文和中文为必填项','error');
  await saveWordToBank({en,zh,def,phonetic,pos});
  closeAddWord();renderBank();toast('已添加: '+en);
}

// ============================================================================
// OCR / UPLOAD
// ============================================================================
let tocMode=false;
function toggleTOCMode(){
  tocMode=!tocMode;
  const toggle=document.getElementById('tocModeToggle');
  toggle.classList.toggle('active',tocMode);
  toggle.textContent=(tocMode?'✅ ':'')+'📋 TOC模式';
  const label=document.getElementById('uploadLabel');
  if(label)label.textContent=tocMode?'点击上传目录页图片 (TOC模式)':'点击上传 或 拖拽图片到此处';
}
let autoCorrect=false;
function toggleAutoCorrect(){
  autoCorrect=!autoCorrect;
  const toggle=document.getElementById('autoCorrectToggle');
  toggle.classList.toggle('active',autoCorrect);
  toggle.textContent=(autoCorrect?'🔮 ':'')+'词典辅助匹配';
}
const uploadZone=document.getElementById('uploadZone');
if(uploadZone){
  uploadZone.addEventListener('click',()=>document.getElementById('fileInput').click());
  uploadZone.addEventListener('dragover',e=>{e.preventDefault();uploadZone.classList.add('dragover');});
  uploadZone.addEventListener('dragleave',()=>uploadZone.classList.remove('dragover'));
  uploadZone.addEventListener('drop',e=>{
    e.preventDefault();uploadZone.classList.remove('dragover');
    if(e.dataTransfer.files.length)handleFileInput(e.dataTransfer.files[0]);
  });
}

function handleFile(input){if(input.files.length)handleFileInput(input.files[0]);}

function preprocessImage(imgEl){
  // Grayscale + contrast enhancement via canvas. Returns a canvas.
  const c=document.createElement('canvas');
  c.width=imgEl.naturalWidth;c.height=imgEl.naturalHeight;
  const ctx=c.getContext('2d');
  ctx.drawImage(imgEl,0,0);
  const imageData=ctx.getImageData(0,0,c.width,c.height);
  const d=imageData.data;
  for(let i=0;i<d.length;i+=4){
    // Grayscale
    const gray=0.299*d[i]+0.587*d[i+1]+0.114*d[i+2];
    // Contrast stretch: map 40-220 → 0-255
    const contrast=Math.max(0,Math.min(255,(gray-40)*(255/(220-40))));
    d[i]=d[i+1]=d[i+2]=contrast;
  }
  ctx.putImageData(imageData,0,0);
  return c;
}

async function handleFileInput(file){
  const status=document.getElementById('ocrStatus');
  const results=document.getElementById('ocrResults');
  const isTOC=tocMode;
  status.innerHTML='<div class="spinner"></div><p>正在预处理图片'+(isTOC?' (TOC模式)':'')+'...</p>';
  results.innerHTML='';
  window._ocrSuggestions={};
  window._ocrSaveWords=null;
  try{
    // Load image, preprocess on canvas
    const imgBlobUrl=URL.createObjectURL(file);
    const imgEl=await new Promise((resolve,reject)=>{
      const img=new Image();
      img.onload=()=>resolve(img);
      img.onerror=reject;
      img.src=imgBlobUrl;
    });
    const processedCanvas=isTOC?preprocessTOCImage(imgEl):preprocessImage(imgEl);
    URL.revokeObjectURL(imgBlobUrl);

    const ocrLang=isTOC?'eng':'eng+chi_sim';
    status.innerHTML=`<div class="spinner"></div><p>正在识别文字${isTOC?' (仅英文TOC模式)':'(中英双语)'}...</p>`;

    // OCR — dynamically load Tesseract first (non-blocking)
    const Tesseract=await _loadTesseract();
    const worker=await Tesseract.recognize(processedCanvas,ocrLang,{
      logger:m=>{
        if(m.status==='recognizing text')status.innerHTML=`<div class="spinner"></div><p>识别中... ${Math.round(m.progress*100)}%</p>`;
      }
    });
    const text=worker.data.text;

    // Extract English words with improved regex (handles hyphens, apostrophes)
    _ensureDictCache();
    const rawWords=text.match(/[a-zA-Z]{2,}(?:[-'][a-zA-Z]{2,})*(?: [a-zA-Z]{2,}(?:[-'][a-zA-Z]{2,})*)?/g)||[];
    const plausibleWords=rawWords.filter(w=>_isPlausibleWord(w));
    const uniqueWords=[...new Set(plausibleWords.map(w=>w.toLowerCase()))];

    // Detect multi-word terms from DICTIONARY in raw text
    const multiWords=_detectMultiWordTerms(text, uniqueWords);
    multiWords.forEach(w=>uniqueWords.push(w));

    if(uniqueWords.length===0){status.innerHTML='<p style="color:var(--red)">未识别到英文单词，请确认图片清晰包含英文文本</p>';return;}

    // Match against DICTIONARY + user's textbook vocab banks — EXACT MATCH ONLY, never auto-replace
    const found=[],notFound=[],suggestionMap={};
    uniqueWords.forEach(w=>{
      // Exact match only — never apply OCR fixes or fuzzy auto-correction
      let d=_dictMap[w];
      if(d) { found.push({en:d.en,zh:d.zh||'',def:d.def||'',phonetic:d.phonetic||'',pos:d.pos||''}); return; }
      // Not in dictionary: preserve original OCR word
      notFound.push(w);
      // If autoCorrect is on, compute suggestions for UI display
      if(autoCorrect){
        const sugs=_findSuggestions(w,2);
        if(sugs.length>0) suggestionMap[w.toLowerCase()]=sugs;
      }
    });

    const matchedWithDef=found.filter(w=>w.def);
    let statusMsg=`<p style="color:var(--green);font-weight:bold;"><svg class="icon"><use href="#icon-success"/></svg> 识别到 ${uniqueWords.length} 个单词，其中 ${found.length} 个已匹配词典 (${matchedWithDef.length}个含英文释义)</p>
      <p style="font-size:.75em;color:var(--muted);">${isTOC?'TOC模式 · 自适应预处理 · ':''}精确匹配 · 词典仅作参考${autoCorrect?' (辅助匹配已开启)':''}</p>`;
    if(autoCorrect&&Object.keys(suggestionMap).length>0){
      statusMsg+=`<p style="font-size:.75em;color:var(--accent);"><svg class="icon"><use href="#icon-settings"/></svg> 💡 为 ${Object.keys(suggestionMap).length} 个未匹配词找到词典候选 (点击小标签可用)</p>`;
    }
    if(notFound.length>0){
      statusMsg+=`<p style="font-size:.75em;color:var(--blue);"><svg class="icon"><use href="#icon-search"/></svg> 🌐 正在从在线词典自动查询 ${notFound.length} 个未匹配词...</p>`;
    }
    status.innerHTML=statusMsg;
    // Store suggestions for rendering
    window._ocrSuggestions=suggestionMap;

    let html='';

    if(isTOC){
      // TOC mode: detect unit structure and show grouped review table
      const structure=detectTOCStructure(text);
      let unitView=null;
      if(structure&&structure.length>=2){
        unitView=_buildUnitView(structure,found,notFound);
      }
      html+=renderTOCReviewTable(found,notFound,unitView);
    }else{
      // Normal mode: original display
      if(found.length>0){
        html+=`<div class="card"><h2>📋 <svg class="icon"><use href="#icon-bank"/></svg> 已识别的单词 (${found.length}个)</h2>
          <div style="margin-bottom:12px;display:flex;gap:8px;">
            <button class="btn btn-primary btn-sm" onclick="importAllFound()">全部导入词库</button>
          </div>
          <div class="word-list">${found.map(w=>{
            const safeDef=(w.def||'').replace(/'/g,"\\'").replace(/"/g,'&quot;');
            const safePh=(w.phonetic||'').replace(/'/g,"\\'");
            return`<div class="word-row">
              <span class="en">${w.en}</span>
              ${w.phonetic?`<span class="phonetic">${w.phonetic}</span>`:''}
              ${w.pos?`<span class="pos">${w.pos}</span>`:''}
              <span class="zh">${w.zh}</span>
              <span class="meta">${safeDef}</span>
              <button class="btn btn-sm btn-outline" onclick="importOne('${w.en}','${w.zh}','${safeDef}','${safePh}','${w.pos||''}')">导入</button>
            </div>`;
          }).join('')}</div></div>`;
        window._lastFound=found;
      }
      if(notFound.length>0){
        html+=`<div class="card" style="margin-top:8px;"><h2><svg class="icon"><use href="#icon-search"/></svg> 未匹配词典的单词 (${notFound.length}个)</h2>
          <p style="font-size:.85em;color:var(--muted);margin-bottom:8px;">请填写中文和英文释义后导入（英文释义为必填，否则游戏第二关无法进行）</p>
          <div style="margin-bottom:12px;">
            <button class="btn btn-accent btn-sm" onclick="importAllNotFound()">一键全部导入 (${notFound.length}个)</button>
          </div>
          <div class="word-list">${notFound.map(w=>{
            const safeId=w.replace(/[^a-z]/g,'_');
            const sugs=autoCorrect?(suggestionMap[w.toLowerCase()]||[]):[];
            let sugTags='';
            if(sugs.length>0){
              sugTags='<div style="display:flex;gap:3px;flex-wrap:wrap;margin-top:2px;">'+sugs.map((s,si)=>{
                const sdef=(s.entry.def||'').replace(/'/g,"\\'").replace(/"/g,'&quot;');
                const szh=(s.entry.zh||'').replace(/'/g,"\\'");
                const sph=(s.entry.phonetic||'').replace(/'/g,"\\'");
                const spos=(s.entry.pos||'').replace(/'/g,"\\'");
                return'<span class="suggestion-chip" title="'+s.entry.en+': '+szh+' ('+(s.distance===1?'一字之差':'相似')+')" onclick="applySuggestion(\''+safeId+'\',\''+szh+'\',\''+sdef+'\',\''+sph+'\',\''+spos+'\')">'+s.entry.en+'</span>';
              }).join('')+'</div>';
            }
            return`<div class="word-row">
            <div><span class="en">${w}</span>${sugTags}</div>
            <input id="zh_${safeId}" placeholder="中文(可选)" style="width:80px;padding:4px 8px;border:1px solid #d8d0d8;border-radius:4px;">
            <input id="def_${safeId}" placeholder="⚠️英文释义(必填)" style="width:160px;padding:4px 8px;border:1px solid var(--red);border-radius:4px;font-size:.8em;">
            <input id="ph_${safeId}" placeholder="音标" style="width:80px;padding:4px 8px;border:1px solid #d8d0d8;border-radius:4px;font-size:.8em;">
            <input id="pos_${safeId}" placeholder="词性" style="width:50px;padding:4px 8px;border:1px solid #d8d0d8;border-radius:4px;font-size:.8em;">
            <button class="btn btn-sm btn-accent" onclick="importManual('${w}')">导入</button>
          </div>`;
          }).join('')}</div></div>`;
        window._lastNotFound=notFound;
      }
    }

    // Show raw OCR text for debugging
    html+=`<details class="raw-ocr-text"><summary><svg class="icon"><use href="#icon-search"/></svg> 查看原始识别文本 (调试用)</summary><pre style="white-space:pre-wrap;font-size:.75em;">${text}</pre></details>`;

    // OCR save to textbook section
    const allOCRWords=[...found,...notFound.map(w=>({en:w,zh:'',def:'',phonetic:'',pos:''}))];
    if(allOCRWords.length>0){
      html+=`<div class="card" style="margin-top:16px;"><h2>💾 保存OCR结果到教材单元</h2>
        <p style="font-size:.85em;color:var(--muted);margin-bottom:8px;">将识别到的 ${allOCRWords.length} 个词汇保存到指定教材单元，同时自动加入词库以便复习。</p>
        <div style="position:relative;margin-bottom:8px;">
          <input type="text" id="ocrTbSearch" placeholder="🔍 搜索教材名称..." autocomplete="off"
            style="width:100%;padding:10px 14px;border:2px solid #d8d0d8;border-radius:8px;font-size:.95em;font-family:inherit;"
            oninput="onOCRTextbookSearch(this.value)" onfocus="onOCRTextbookSearch(this.value)">
          <div id="ocrTbSearchResults" style="display:none;position:absolute;top:100%;left:0;right:0;z-index:50;background:#fff;border:2px solid var(--accent);border-top:none;border-radius:0 0 8px 8px;max-height:200px;overflow-y:auto;box-shadow:0 4px 16px rgba(0,0,0,.12);"></div>
        </div>
        <select id="ocrUnitSelect" style="width:100%;padding:10px 14px;border:2px solid #d8d0d8;border-radius:8px;font-size:.95em;font-family:inherit;margin-bottom:8px;display:none;">
          <option value="">选择单元</option>
        </select>
        <button class="btn btn-primary btn-sm" id="btnOCRSave" onclick="saveOCRToTextbookUnit()" disabled>📥 保存到教材单元</button>
      </div>`;
      // Store OCR words for save handler
      window._ocrSaveWords=allOCRWords;
    }

    results.innerHTML=html;
    // Auto-fill not-found words from online dictionary API
    if(notFound.length>0){
      const prefix=isTOC?'toc_':'';
      autoFillNotFoundWords(notFound, prefix);
    }
    // Store for TOC batch import
    window._tocFound=found;
    window._tocNotFound=notFound;
  }catch(e){status.innerHTML=`<p style="color:var(--red)">识别失败: ${e.message}</p>`;}
}

// -- Online dictionary API lookup for not-found words ---------------------------
async function _fetchDictAPI(word){
  try{
    const resp=await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+encodeURIComponent(word));
    if(!resp.ok) return null;
    const data=await resp.json();
    if(!Array.isArray(data)||!data.length) return null;
    // Pick the first entry with the most complete data
    const entry=data[0];
    const phonetic=entry.phonetic||(entry.phonetics&&entry.phonetics[0]?entry.phonetics[0].text||'':'');
    let pos='', def='';
    if(entry.meanings&&entry.meanings.length){
      pos=entry.meanings[0].partOfSpeech||'';
      if(entry.meanings[0].definitions&&entry.meanings[0].definitions.length){
        def=entry.meanings[0].definitions[0].definition||'';
      }
    }
    return {phonetic, pos, def};
  }catch(e){return null;}
}
async function _fetchTranslation(word){
  try{
    const resp=await fetch('https://api.mymemory.translated.net/get?q='+encodeURIComponent(word)+'&langpair=en|zh-CN');
    if(!resp.ok) return '';
    const data=await resp.json();
    return (data.responseData&&data.responseData.translatedText)||'';
  }catch(e){return '';}
}
async function _autoFillOneWord(en, prefix){
  const safeId=en.replace(/[^a-z]/g,'_');
  const zhEl=document.getElementById(prefix+'zh_'+safeId);
  const defEl=document.getElementById(prefix+'def_'+safeId);
  const phEl=document.getElementById(prefix+'ph_'+safeId);
  const posEl=document.getElementById(prefix+'pos_'+safeId);
  // Show fetching indicator
  if(defEl&&!defEl.value) defEl.placeholder='⏳ 联网查询中...';
  try{
    const [dictResult, zhResult]=await Promise.all([_fetchDictAPI(en),_fetchTranslation(en)]);
    if(dictResult){
      if(phEl&&!phEl.value) phEl.value=dictResult.phonetic||'';
      if(posEl&&!posEl.value) posEl.value=dictResult.pos||'';
      if(defEl&&!defEl.value) defEl.value=dictResult.def||'';
    }
    if(zhResult&&zhEl&&!zhEl.value) zhEl.value=zhResult;
    if(defEl&&!defEl.value) defEl.placeholder='⚠️ 英文释义(必填)';
  }catch(e){
    if(defEl) defEl.placeholder='⚠️ 英文释义(必填)';
  }
}
async function autoFillNotFoundWords(notFoundWords, prefix){
  prefix=prefix||'';
  // Fetch sequentially with small delay to respect API rate limits
  for(let i=0;i<notFoundWords.length;i++){
    await _autoFillOneWord(notFoundWords[i], prefix);
    if(i<notFoundWords.length-1) await new Promise(r=>setTimeout(r,200));
  }
}

function applySuggestion(safeId,zh,def,phonetic,pos){
  const zhEl=document.getElementById('zh_'+safeId);
  const defEl=document.getElementById('def_'+safeId);
  const phEl=document.getElementById('ph_'+safeId);
  const posEl=document.getElementById('pos_'+safeId);
  if(zhEl)zhEl.value=zh;
  if(defEl)defEl.value=def;
  if(phEl)phEl.value=phonetic;
  if(posEl)posEl.value=pos;
}
function applyTOCSuggestion(safeEn,zh,def,phonetic,pos){
  const zhEl=document.getElementById('toc_zh_'+safeEn);
  const defEl=document.getElementById('toc_def_'+safeEn);
  const phEl=document.getElementById('toc_ph_'+safeEn);
  const posEl=document.getElementById('toc_pos_'+safeEn);
  if(zhEl)zhEl.value=zh;
  if(defEl)defEl.value=def;
  if(phEl)phEl.value=phonetic;
  if(posEl)posEl.value=pos;
}
// -- OCR save to textbook unit -----------------------------------------------
let _ocrSelectedTbIdx=null;
let _ocrSelectedUnitIdx=null;
function onOCRTextbookSearch(query){
  const data=getTextbooksData();
  const db=getTextbookDB();
  if(!data||!data.textbooks||data.textbooks.length===0){if(db&&db.length){saveTextbooksData({textbooks:JSON.parse(JSON.stringify(db))});}else{return;}}
  const tbs=data.textbooks;
  const resultsDiv=document.getElementById('ocrTbSearchResults');
  if(!query||!query.trim()){resultsDiv.style.display='none';return;}
  const q=query.toLowerCase().trim();
  const results=tbs.filter(tb=>(tb.a||[]).some(a=>a.toLowerCase().includes(q))||tb.n.toLowerCase().includes(q)||(tb.p||'').toLowerCase().includes(q));
  if(results.length===0){resultsDiv.innerHTML='<div style="padding:12px;color:var(--muted);text-align:center;">未找到匹配的教材</div>';resultsDiv.style.display='block';return;}
  resultsDiv.innerHTML=results.map((tb,i)=>{
    const realIdx=tbs.findIndex(t=>t.n===tb.n);
    return'<div style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #f0ebe0;font-weight:700;font-size:.9em;" onmousedown="selectOCRTextbook('+realIdx+')">'+tb.n+'<span style="font-weight:normal;font-size:.8em;color:var(--muted);"> · '+(Array.isArray(tb.u)?tb.u.length:0)+'个单元</span></div>';
  }).join('');
  resultsDiv.style.display='block';
}
function selectOCRTextbook(idx){
  const data=getTextbooksData();
  const tb=data.textbooks[idx];
  _ocrSelectedTbIdx=idx;
  _ocrSelectedUnitIdx=null;
  document.getElementById('ocrTbSearch').value=tb.n;
  document.getElementById('ocrTbSearchResults').style.display='none';
  const unitSel=document.getElementById('ocrUnitSelect');
  unitSel.style.display='block';
  unitSel.innerHTML='<option value="">选择单元</option>'+((Array.isArray(tb.u)?tb.u:[]).map((u,i)=>'<option value="'+i+'">'+u.n+'</option>').join(''));
  unitSel.onchange=function(){
    _ocrSelectedUnitIdx=this.value!==''?parseInt(this.value):null;
    document.getElementById('btnOCRSave').disabled=(_ocrSelectedUnitIdx===null);
  };
  document.getElementById('btnOCRSave').disabled=true;
}
async function saveOCRToTextbookUnit(){
  if(_ocrSelectedTbIdx===null||_ocrSelectedUnitIdx===null||!window._ocrSaveWords) return;
  const words=window._ocrSaveWords;
  const data=getTextbooksData();
  const unit=data.textbooks[_ocrSelectedTbIdx].u[_ocrSelectedUnitIdx];
  unit.w=words.map(w=>({en:w.en,zh:w.zh||'',phonetic:w.phonetic||'',pos:w.pos||'',def:w.def||''}));
  saveTextbooksData(data);
  // Also add each word to word bank
  for(const w of words){
    if(!w.en) continue;
    await saveWordToBank({en:w.en,zh:w.zh||'(待补充)',def:w.def||'',phonetic:w.phonetic||'',pos:w.pos||''});
  }
  toast('已保存 '+words.length+' 词到「'+(unit.n||'所选单元')+'」并加入词库');
  renderBank();
  // Update textbook section heading
  updateTextbookHeading();
}

async function importOne(en,zh,def,phonetic,pos){
  await saveWordToBank({en,zh,def,phonetic,pos});toast('已导入: '+en);renderBank();
}
async function importAllFound(){
  if(!window._lastFound)return;
  for(const w of window._lastFound) await saveWordToBank(w);
  toast(`已导入 ${window._lastFound.length} 个单词`);renderBank();
}
async function importManual(en){
  const safeId=en.replace(/[^a-z]/g,'_');
  const zh=document.getElementById('zh_'+safeId)?.value?.trim()||'';
  const def=document.getElementById('def_'+safeId)?.value?.trim()||'';
  const phonetic=document.getElementById('ph_'+safeId)?.value?.trim()||'';
  const pos=document.getElementById('pos_'+safeId)?.value?.trim()||'';
  await saveWordToBank({en,zh:zh||'(待补充)',def:def||'',phonetic,pos});
  toast('已导入: '+en);renderBank();
}
async function importAllNotFound(){
  if(!window._lastNotFound)return;
  for(const en of window._lastNotFound){
    const safeId=en.replace(/[^a-z]/g,'_');
    const zh=document.getElementById('zh_'+safeId)?.value?.trim()||'';
    const def=document.getElementById('def_'+safeId)?.value?.trim()||'';
    const phonetic=document.getElementById('ph_'+safeId)?.value?.trim()||'';
    const pos=document.getElementById('pos_'+safeId)?.value?.trim()||'';
    await saveWordToBank({en,zh:zh||'(待补充)',def:def||'',phonetic,pos});
  }
  toast(`已导入 ${window._lastNotFound.length} 个单词`);renderBank();
}

// -- TOC-specific functions -------------------------------------------------
function preprocessTOCImage(imgEl){
  // Adaptive thresholding — handles uneven lighting/shadows on textbook pages
  // Downscale for performance, then apply local-mean threshold (5x5 kernel)
  const c=document.createElement('canvas');
  const maxDim=1200;
  let w=imgEl.naturalWidth, h=imgEl.naturalHeight;
  const scale=Math.min(1, maxDim/Math.max(w,h));
  w=Math.round(w*scale); h=Math.round(h*scale);
  c.width=w; c.height=h;
  const ctx=c.getContext('2d');
  ctx.drawImage(imgEl,0,0,w,h);
  const imageData=ctx.getImageData(0,0,w,h);
  const d=imageData.data;
  // Grayscale pass
  const gray=new Uint8Array(w*h);
  for(let i=0;i<d.length;i+=4) gray[i>>2]=0.299*d[i]+0.587*d[i+1]+0.114*d[i+2];
  // Adaptive threshold: 5×5 local window
  const k=2;
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      let sum=0, ct=0;
      const y0=Math.max(0,y-k), y1=Math.min(h-1,y+k);
      const x0=Math.max(0,x-k), x1=Math.min(w-1,x+k);
      for(let ny=y0;ny<=y1;ny++) for(let nx=x0;nx<=x1;nx++){sum+=gray[ny*w+nx];ct++;}
      const mean=sum/ct;
      const pix=gray[y*w+x];
      const bw=pix>mean-8?255:0;
      const idx=(y*w+x)<<2;
      d[idx]=d[idx+1]=d[idx+2]=bw;
    }
  }
  ctx.putImageData(imageData,0,0);
  return c;
}

function _renderWordRow(w, i, isNotFound){
  if(isNotFound){
    const safeEn=w.replace(/[^a-z]/g,'_');
    const sugs=autoCorrect&&window._ocrSuggestions?(window._ocrSuggestions[w.toLowerCase()]||[]):[];
    let sugTags='';
    if(sugs.length>0){
      sugTags='<div style="display:flex;gap:2px;flex-wrap:wrap;margin-top:2px;">'+sugs.map(s=>{
        const szh=(s.entry.zh||'').replace(/'/g,"\\'");
        const sdef=(s.entry.def||'').replace(/'/g,"\\'").replace(/"/g,'&quot;');
        const sph=(s.entry.phonetic||'').replace(/'/g,"\\'");
        const spos=(s.entry.pos||'').replace(/'/g,"\\'");
        return'<span class="suggestion-chip" title="'+s.entry.en+': '+szh+'" onclick="applyTOCSuggestion(\''+safeEn+'\',\''+szh+'\',\''+sdef+'\',\''+sph+'\',\''+spos+'\')">'+s.entry.en+'</span>';
      }).join('')+'</div>';
    }
    return`<tr class="toc-unmatched">
      <td>${i+1}</td>
      <td><strong>${w}</strong>${sugTags}</td>
      <td><input class="toc-edit-input" id="toc_zh_${safeEn}" placeholder="中文" style="width:80px;"></td>
      <td><input class="toc-edit-input" id="toc_ph_${safeEn}" placeholder="音标" style="width:100px;"></td>
      <td><input class="toc-edit-input" id="toc_pos_${safeEn}" placeholder="词性" style="width:60px;"></td>
      <td><input class="toc-edit-input" id="toc_def_${safeEn}" placeholder="⚠️ 英文释义 (必填)" style="width:200px;border-color:var(--red);"></td>
      <td><button class="btn btn-sm btn-accent" onclick="importTOCWord('${w}')">导入</button></td>
    </tr>`;
  }
  const safeEn=w.en.replace(/[^a-z]/g,'_');
  const hasDef=!!w.def;
  return`<tr class="toc-matched">
    <td>${i+1}</td>
    <td><strong>${w.en}</strong></td>
    <td><input class="toc-edit-input" id="toc_zh_${safeEn}" value="${(w.zh||'').replace(/"/g,'&quot;')}" style="width:80px;"></td>
    <td><input class="toc-edit-input" id="toc_ph_${safeEn}" value="${(w.phonetic||'').replace(/"/g,'&quot;')}" style="width:100px;"></td>
    <td><input class="toc-edit-input" id="toc_pos_${safeEn}" value="${(w.pos||'').replace(/"/g,'&quot;')}" style="width:60px;"></td>
    <td><input class="toc-edit-input" id="toc_def_${safeEn}" value="${(w.def||'').replace(/"/g,'&quot;')}" style="width:200px;${hasDef?'':'border-color:var(--accent);'}" placeholder="${hasDef?'':'⚠️ 需要英文释义'}"></td>
    <td><button class="btn btn-sm btn-outline" onclick="importTOCWord('${w.en}')">导入</button></td>
  </tr>`;
}

function _renderFlatTable(title, words, isNotFound){
  if(!words.length) return '';
  let h=`<p style="margin-top:10px;color:${isNotFound?'var(--red)':'var(--green)'};font-weight:bold;">${title}</p>`;
  h+=`<table class="toc-review-table"><thead><tr>
    <th>#</th><th>英文</th><th>中文</th><th>音标</th><th>词性</th><th>英文释义${isNotFound?' ⚠️必填':''}</th><th>导入</th>
  </tr></thead><tbody>`;
  words.forEach((w,i)=>h+=_renderWordRow(w,i,isNotFound));
  h+=`</tbody></table>`;
  return h;
}

function renderTOCReviewTable(found,notFound,unitView){
  const totalWords=found.length+notFound.length;
  let html=`<div class="card"><h2><svg class="icon"><use href="#icon-bank"/></svg> TOC识别结果 — 请核对后导入</h2>
    <div class="toc-header-actions">
      <button class="btn btn-primary btn-sm" onclick="importAllTOCWords()"><svg class="icon"><use href="#icon-upload"/></svg> 全部导入词库 (${totalWords}词)</button>
      <button class="btn btn-sm btn-outline" onclick="importTOCMatched()">仅导入已匹配 (${found.length}词)</button>
      <span style="font-size:.8em;color:var(--muted);"><svg class="icon"><use href="#icon-warning"/></svg> 双击单元格可编辑内容</span>
    </div>`;

  // If structure detected: show unit-grouped accordion view
  if(unitView&&unitView.unitView&&unitView.unitView.length>=2){
    html+=`<p style="margin-top:8px;font-size:.85em;color:var(--accent);"><svg class="icon"><use href="#icon-bank"/></svg> 检测到 ${unitView.unitView.length} 个单元结构，按单元分组展示</p>`;
    let globalIdx=0;
    unitView.unitView.forEach((u,ui)=>{
      const unitTotal=u.found.length+u.notFound.length;
      if(!unitTotal) return;
      const matchedDef=u.found.filter(w=>w.def).length;
      html+=`<details class="toc-unit-group" ${ui<3?'open':''}>
        <summary class="toc-unit-summary">
          <strong>${u.header||'Unit '+u.num}</strong>
          <span style="font-weight:normal;font-size:.85em;color:var(--muted);">— ${unitTotal}词 (${u.found.length}匹配, ${matchedDef}含释义)</span>
        </summary>
        <div style="padding:4px 0 8px 0;">`;
      if(u.found.length) html+=_renderFlatTable(`✅ 已匹配: ${u.found.length}词`, u.found, false);
      if(u.notFound.length) html+=_renderFlatTable(`❓ 未匹配: ${u.notFound.length}词`, u.notFound, true);
      html+=`</div></details>`;
    });
    // Unassigned words
    if(unitView.unassignedFound&&unitView.unassignedFound.length){
      html+=`<details class="toc-unit-group"><summary class="toc-unit-summary"><strong><svg class="icon"><use href="#icon-bank"/></svg> 未归类单词</strong> <span style="font-weight:normal;font-size:.85em;color:var(--muted);">— ${unitView.unassignedFound.length+unitView.unassignedNotFound.length}词</span></summary><div style="padding:4px 0 8px 0;">`;
      html+=_renderFlatTable(`✅ 已匹配: ${unitView.unassignedFound.length}词`, unitView.unassignedFound, false);
      if(unitView.unassignedNotFound&&unitView.unassignedNotFound.length) html+=_renderFlatTable(`❓ 未匹配: ${unitView.unassignedNotFound.length}词`, unitView.unassignedNotFound, true);
      html+=`</div></details>`;
    }
  } else {
    // Fallback: flat view (original behavior)
    if(found.length>0) html+=_renderFlatTable(`<svg class="icon"><use href="#icon-success"/></svg> 已匹配词典: ${found.length} 个单词`, found, false);
    if(notFound.length>0) html+=_renderFlatTable(`❓ 未匹配词典: ${notFound.length} 个单词 — 请手动填写信息后导入`, notFound, true);
  }

  html+=`<p style="font-size:.75em;color:var(--red);margin-top:8px;">⚠️ 英文释义为必填项，否则游戏第二关无法进行。已匹配单词大部分已有释义，请核对。</p></div>`;
  return html;
}

async function importTOCWord(en){
  const safeEn=en.replace(/[^a-z]/g,'_');
  const zh=document.getElementById('toc_zh_'+safeEn)?.value?.trim()||'';
  const phonetic=document.getElementById('toc_ph_'+safeEn)?.value?.trim()||'';
  const pos=document.getElementById('toc_pos_'+safeEn)?.value?.trim()||'';
  const def=document.getElementById('toc_def_'+safeEn)?.value?.trim()||'';
  if(!def){toast('⚠️ 请先填写英文释义 (def)，否则游戏第二关无法进行','error');return;}
  await saveWordToBank({en,zh:zh||'(待补充)',def,phonetic,pos});
  toast('已导入: '+en);renderBank();
}

async function importAllTOCWords(){
  const allWords=[...(window._tocFound||[]),...(window._tocNotFound||[]).map(w=>({en:w,zh:'',def:'',phonetic:'',pos:''}))];
  let imported=0,skipped=0;
  for(const w of allWords){
    const safeEn=w.en.replace(/[^a-z]/g,'_');
    const zh=document.getElementById('toc_zh_'+safeEn)?.value?.trim()||w.zh||'';
    const phonetic=document.getElementById('toc_ph_'+safeEn)?.value?.trim()||w.phonetic||'';
    const pos=document.getElementById('toc_pos_'+safeEn)?.value?.trim()||w.pos||'';
    const def=document.getElementById('toc_def_'+safeEn)?.value?.trim()||w.def||'';
    if(!def){skipped++;continue;}
    await saveWordToBank({en:w.en,zh:zh||'(待补充)',def,phonetic,pos});
    imported++;
  }
  if(skipped>0)toast(`已导入 ${imported} 个单词，${skipped} 个因缺少英文释义被跳过`,'error');
  else toast(`已导入 ${imported} 个单词`);renderBank();
}

async function importTOCMatched(){
  if(!window._tocFound)return;
  let imported=0;
  for(const w of window._tocFound){
    const safeEn=w.en.replace(/[^a-z]/g,'_');
    const zh=document.getElementById('toc_zh_'+safeEn)?.value?.trim()||w.zh||'';
    const phonetic=document.getElementById('toc_ph_'+safeEn)?.value?.trim()||w.phonetic||'';
    const pos=document.getElementById('toc_pos_'+safeEn)?.value?.trim()||w.pos||'';
    const def=document.getElementById('toc_def_'+safeEn)?.value?.trim()||w.def||'';
    if(def){await saveWordToBank({en:w.en,zh:zh||'(待补充)',def,phonetic,pos});imported++;}
  }
  toast(`已导入 ${imported} 个单词`);renderBank();
}

// ============================================================================
// OCR SMART HELPERS — fuzzy matching, spell-check, structure detection
// ============================================================================

// Levenshtein edit distance
function _lev(a,b){
  if(!a.length)return b.length; if(!b.length)return a.length;
  const m=[]; for(let i=0;i<=b.length;i++){m[i]=[i];} for(let j=0;j<=a.length;j++){m[0][j]=j;}
  for(let i=1;i<=b.length;i++){for(let j=1;j<=a.length;j++){
    m[i][j]=b[i-1]===a[j-1]?m[i-1][j-1]:Math.min(m[i-1][j-1]+1,m[i][j-1]+1,m[i-1][j]+1);
  }}
  return m[b.length][a.length];
}

// Find fuzzy suggestions from dictionary (for UI display only, never auto-replaces)
function _findSuggestions(w, maxDistance){
  maxDistance=maxDistance||2;
  const lw=w.toLowerCase();
  const results=[];
  for(const [key,d] of _dictEntries){
    if(Math.abs(key.length-lw.length)>maxDistance) continue;
    if(key[0]!==lw[0]) continue;
    const dist=_lev(lw,key);
    if(dist>0&&dist<=maxDistance) results.push({entry:d, distance:dist});
  }
  results.sort((a,b)=>a.distance-b.distance);
  return results.slice(0,5);
}

// Validate if a string looks like a plausible English word (not OCR garbage)
function _isPlausibleWord(w){
  if(w.length<2||w.length>25) return false;
  // Must contain at least one vowel
  if(!/[aeiou]/i.test(w)) return false;
  // No 3+ consecutive same letters
  if(/(.)\1\1/i.test(w)) return false;
  // Not just numbers or special chars
  if(!/^[a-zA-Z][a-zA-Z'-]*$/.test(w)&&!/^[a-zA-Z][a-zA-Z'-]* [a-zA-Z]/.test(w)) return false;
  // No isolated single letters (OCR noise)
  if(/^[bcdfghjklmnpqrstvwxyz]$/i.test(w)) return false;
  return true;
}

// Detect multi-word terms from DICTIONARY in raw OCR text
function _detectMultiWordTerms(text, singleWords){
  const found=new Set();
  const lowerText=text.toLowerCase();
  // Collect multi-word DICTIONARY entries
  for(const [key] of _dictEntries){
    if(!key.includes(' ')&&!key.includes('-')) continue;
    if(lowerText.includes(key)) found.add(key);
  }
  return [...found];
}

// Detect unit boundaries from TOC OCR text
function detectTOCStructure(text){
  const units=[];
  const lines=text.split(/\n/);
  let currentUnit=null;
  for(let i=0;i<lines.length;i++){
    const line=lines[i].trim();
    if(!line) continue;
    // Detect unit header: "UNIT 01", "Unit 1", "🔹 Unit 01" etc.
    const unitMatch=line.match(/(?:UNIT|Unit|🔹\s*Unit)\s*(\d+)/i);
    if(unitMatch){
      if(currentUnit) units.push(currentUnit);
      currentUnit={num:parseInt(unitMatch[1]), header:line, words:[]};
      continue;
    }
    // Detect TARGET WORDS line
    const targetMatch=line.match(/(?:TARGET WORDS|目标词汇)[:\s]*(.+)/i);
    if(targetMatch&&currentUnit){
      const words=targetMatch[1].split(/[,，\s]+/).filter(w=>w.length>1&&/[a-zA-Z]/.test(w));
      currentUnit.words=words;
    }
    // Also try to detect comma-separated word list (no explicit TARGET WORDS label)
    if(!currentUnit||currentUnit.words.length>0) continue;
    const wordList=line.match(/^([a-zA-Z][a-zA-Z,\s'-]{20,})$/);
    if(wordList){
      const words=wordList[1].split(/[,，\s]+/).filter(w=>w.length>1&&/[a-zA-Z]/.test(w));
      if(words.length>=8) currentUnit.words=words;
    }
  }
  if(currentUnit) units.push(currentUnit);
  return units;
}

function _buildUnitView(structure, found, notFound){
  // Normalize: lowercase, strip non-alphanumeric for fuzzy comparison
  const norm=w=>w.toLowerCase().replace(/[^a-z0-9]/g,'');
  const foundMap={}; found.forEach(f=>{foundMap[norm(f.en)]=f;});
  const notFoundSet=new Set(notFound.map(w=>norm(w)));
  const usedFound=new Set(), usedNotFound=new Set();
  const unitView=[];
  structure.forEach(unit=>{
    const uf=[], unf=[];
    unit.words.forEach(raw=>{
      const n=norm(raw);
      if(foundMap[n]&&!usedFound.has(n)){uf.push(foundMap[n]);usedFound.add(n);return;}
      if(notFoundSet.has(n)&&!usedNotFound.has(n)){unf.push(raw);usedNotFound.add(n);return;}
      // Fuzzy match in found (edit distance ≤1 on normalized form)
      let best=null, bestDist=99, bestKey=null;
      for(const [fn,fe] of Object.entries(foundMap)){
        if(usedFound.has(fn))continue;
        const d=_lev(n,fn);
        if(d<=1&&d<bestDist){best=fe;bestDist=d;bestKey=fn;}
      }
      if(best){uf.push(best);usedFound.add(bestKey);return;}
      // Fuzzy match in notFound (compare normalized forms)
      for(const nfw of notFound){
        const nn=norm(nfw);
        if(usedNotFound.has(nn))continue;
        if(_lev(n,nn)<=1){unf.push(nfw);usedNotFound.add(nn);return;}
      }
      unf.push(raw);
    });
    if(uf.length||unf.length) unitView.push({num:unit.num,header:unit.header,found:uf,notFound:unf});
  });
  const unassignedFound=found.filter(f=>!usedFound.has(norm(f.en)));
  const unassignedNotFound=notFound.filter(w=>!usedNotFound.has(norm(w)));
  return {unitView, unassignedFound, unassignedNotFound};
}

// Build dictionary lookup (called once, cached)
let _dictMap=null, _dictEntries=null;
function _ensureDictCache(){
  if(_dictMap) return;
  _dictMap={};
  _dictEntries=[];
  DICTIONARY.forEach(d=>{
    const key=d.en.toLowerCase();
    _dictMap[key]=d;
    _dictEntries.push([key,d]);
  });
  // Also index textbook vocab for richer matching
  try{
    const td=getTextbooksData();
    td.textbooks.forEach(tb=>{
      if(!Array.isArray(tb.u)) return;
      tb.u.forEach(u=>{if(!u||!Array.isArray(u.w)) return; u.w.forEach(w=>{
        if(!w||!w.en) return;
        const key=w.en.toLowerCase();
        if(!_dictMap[key]){_dictMap[key]=w;_dictEntries.push([key,w]);}
      });});
    });
  }catch(e){}
}

// ============================================================================
// TEXTBOOK IMPORT — Search-based textbook selection + auto-fetch + paste
// ============================================================================
let _selectedTbIdx=null;
const FETCH_DEBOUNCE={};

// -- Search-as-you-type ---------------------------------------------------
function onTextbookSearch(query){
  // Defensive: re-seed if storage is empty
  const data=getTextbooksData();
  if(data.textbooks.length===0){
    const db=getTextbookDB();
    if(db&&db.length){saveTextbooksData({textbooks:JSON.parse(JSON.stringify(db))});}
  }
  const results=document.getElementById('textbookSearchResults');
  if(!results)return;
  if(!query||!query.trim()){
    displaySearchResults(data.textbooks.length>0?data.textbooks:getTextbookDB());
  }else{
    displaySearchResults(searchTextbooks(query));
  }
}
function searchTextbooks(query){
  const data=getTextbooksData();
  const q=query.toLowerCase().trim();
  return data.textbooks.filter(tb=>{
    if(tb.n.toLowerCase().includes(q))return true;
    if(tb.p.toLowerCase().includes(q))return true;
    if(tb.g.toLowerCase().includes(q))return true;
    if(tb.a)for(const a of tb.a){if(a.toLowerCase().includes(q))return true;}
    if(tb.u)for(const u of tb.u){if(u.n&&u.n.toLowerCase().includes(q))return true;}
    return false;
  });
}
function displaySearchResults(textbooks){
  const results=document.getElementById('textbookSearchResults');
  if(!results)return;
  if(!textbooks||textbooks.length===0){
    results.innerHTML='<div class="tb-search-item" style="color:var(--muted);">未找到匹配的教材，可去 管理 添加</div>';
  }else{
    const data=getTextbooksData();
    results.innerHTML=textbooks.map((tb)=>{
      const realIdx=data.textbooks.findIndex(t=>t.n===tb.n);
      const units=Array.isArray(tb.u)?tb.u:[];
      const hasData=units.some(u=>u&&u.w&&u.w.length>0);
      return`<div class="tb-search-item" onclick="selectTextbook(${realIdx})" onkeydown="if(event.key==='Enter')selectTextbook(${realIdx})" tabindex="0">
        <div class="tb-name">${tb.n}
          ${hasData?'<span class="tb-badge tb-badge-data">有数据</span>':'<span class="tb-badge tb-badge-nodata">待补充</span>'}
        </div>
        <div class="tb-meta">${tb.p} · ${tb.g} · ${units.length}个单元</div>
      </div>`;
    }).join('');
  }
  results.style.display='block';
}
function selectTextbook(idx){
  _selectedTbIdx=idx;
  const data=getTextbooksData();
  const tb=data.textbooks[idx];
  document.getElementById('textbookSearch').value=tb.n;
  document.getElementById('textbookSearchResults').style.display='none';
  document.getElementById('selectedTextbookInfo').style.display='flex';
  document.getElementById('selTbName').textContent=tb.n;
  const units=Array.isArray(tb.u)?tb.u:[];
  document.getElementById('selTbMeta').textContent=tb.p+' · '+tb.g+' · '+units.length+'个单元';
  document.getElementById('unitSelectArea').style.display='block';
  // Populate unit dropdown
  const unitSel=document.getElementById('unitSelect');
  unitSel.innerHTML='<option value="">选择单元</option>';
  units.forEach((u,i)=>{
    const hasData=u.w&&u.w.length>0;
    unitSel.innerHTML+=`<option value="${i}">${u.n}${hasData?' ✅':''}${!hasData?' 🔍':''}</option>`;
  });
  document.getElementById('btnImportUnit').disabled=true;
  document.getElementById('btnFetchUnit').style.display='none';
  document.getElementById('textbookPreview').innerHTML='';
  // Update modal selects too
  populateManageTbSelect();
}
function clearTextbookSelection(){
  _selectedTbIdx=null;
  document.getElementById('textbookSearch').value='';
  document.getElementById('selectedTextbookInfo').style.display='none';
  document.getElementById('unitSelectArea').style.display='none';
  document.getElementById('textbookPreview').innerHTML='';
  document.getElementById('btnImportUnit').disabled=true;
  document.getElementById('fetchStatus').innerHTML='';
}
function updateTextbookHeading(){
  const h2=document.getElementById('textbookSectionHeading');
  const data=getTextbooksData();
  if(h2&&data&&data.textbooks) h2.innerHTML=h2.innerHTML.replace(/\{\{textbookCount\}\}/g, data.textbooks.length);
}
// Close search dropdown when clicking outside
document.addEventListener('click',function(e){
  const sr=document.getElementById('textbookSearchResults');
  const inp=document.getElementById('textbookSearch');
  if(sr&&inp&&e.target!==inp&&!sr.contains(e.target))sr.style.display='none';
});

// -- Unit selection & import ---------------------------------------------
function onUnitChange(){
  if(_selectedTbIdx===null)return;
  const unitIdx=parseInt(document.getElementById('unitSelect').value);
  const btn=document.getElementById('btnImportUnit');
  const fetchBtn=document.getElementById('btnFetchUnit');
  const preview=document.getElementById('textbookPreview');
  const fetchStatus=document.getElementById('fetchStatus');
  fetchStatus.innerHTML='';
  if(isNaN(unitIdx)){btn.disabled=true;fetchBtn.style.display='none';preview.innerHTML='';return;}
  const data=getTextbooksData();
  const unit=data.textbooks[_selectedTbIdx].u[unitIdx];
  if(!unit){btn.disabled=true;fetchBtn.style.display='none';preview.innerHTML='';return;}
  if(unit.w&&unit.w.length>0){
    btn.disabled=false;fetchBtn.style.display='none';
    preview.innerHTML=`<div class="word-count">📋 ${unit.n} — 共 <strong>${unit.w.length}</strong> 个词汇 ✅ 已内置</div>
      <div class="word-list">${unit.w.map(w=>`<div class="word-row">
        <span class="en">${w.en}</span>${w.pos?`<span class="pos">${w.pos}</span>`:''}${w.phonetic?`<span class="phonetic">${w.phonetic}</span>`:''}<span class="zh">${w.zh}</span>
      </div>`).join('')}</div>`;
  }else{
    btn.disabled=true;fetchBtn.style.display='inline-block';fetchBtn.disabled=false;
    preview.innerHTML=`<div style="padding:16px;text-align:center;color:var(--muted);"><svg class="icon"><use href="#icon-search"/></svg> 该单元暂无词汇数据<br><span style="font-size:.85em;">点击"🌐 在线检索"尝试从网络获取，或去 ⚙️ 管理 粘贴词汇</span></div>`;
  }
}
async function importTextbookUnit(){
  if(_selectedTbIdx===null){toast('请先搜索并选择教材','error');return;}
  const unitIdx=parseInt(document.getElementById('unitSelect').value);
  if(isNaN(unitIdx)){toast('请选择单元','error');return;}
  const data=getTextbooksData();
  const unit=data.textbooks[_selectedTbIdx].u[unitIdx];
  if(!unit||!unit.w){toast('该单元暂无词汇数据','error');return;}
  let count=0;
  for(const w of unit.w){
    const bank=getWordBank();
    if(bank.find(b=>b.en.toLowerCase()===w.en.toLowerCase()))continue;
    await saveWordToBank({en:w.en,zh:w.zh,def:w.def||'',phonetic:w.phonetic||'',pos:w.pos||''});
    count++;
  }
  if(count===0){toast('该单元所有词汇已在词库中');}
  else{toast(`已导入 ${count} 个新词汇`);}
  renderBank();
}

// -- Online fetch: search web for unit vocabulary -------------------------
async function fetchUnitVocabOnline(){
  if(_selectedTbIdx===null)return;
  const unitIdx=parseInt(document.getElementById('unitSelect').value);
  const data=getTextbooksData();
  const tb=data.textbooks[_selectedTbIdx];
  const unit=(Array.isArray(tb.u)?tb.u:[])[unitIdx];
  const status=document.getElementById('fetchStatus');
  const fetchBtn=document.getElementById('btnFetchUnit');
  fetchBtn.disabled=true;
  status.innerHTML='<div class="fetch-progress"><div class="spinner" style="width:16px;height:16px;border-width:2px;"></div> 正在搜索: '+tb.n+' — '+unit.n+'...</div>';
  try{
    // Strategy 1: DuckDuckGo API (CORS-friendly)
    const query=encodeURIComponent(`${tb.n} ${unit.n} vocabulary words list`);
    const ddgUrl=`https://api.duckduckgo.com/?q=${query}&format=json&no_html=1`;
    const ddgRes=await fetch(ddgUrl);
    if(ddgRes.ok){
      const ddgData=await ddgRes.json();
      const abstractText=ddgData.AbstractText||'';
      const relatedTopics=ddgData.RelatedTopics||[];
      // Try to extract words from abstract + related topics
      let extractedWords=[];
      const allText=[abstractText,...relatedTopics.map(r=>r.Text||'')].join(' ');
      const wordMatches=allText.match(/[a-zA-Z]{2,}(?:[-'][a-zA-Z]{2,})?/g)||[];
      const STOP_WORDS=new Set(['the','and','for','are','was','has','not','but','its','all','can','had','have','were','been','this','that','with','from','they','them','their','will','would','could','should','about','there','which','more','some','than','then','these','those','also','each','many','make','made','like','just','over','into','other','only','most','very','much','such','when','what','who','how','where','your','our','new','old','use','used','see','get','got','say','said','know','think','come','came','take','took','give','gave','find','found','tell','told','ask','asked','work','call','called','try','tried','turn','need','look','looked','show','want','mean','keep','let','put','run','set','end','add','help','play','move','live','love','read','write','open','close','start','stop','begin','left','right','back','down','away','home','here','now','then','first','last','good','bad','high','low','long','short','small','large','little','big','own','same','part','place','day','way','man','woman','child','world','life','hand','eye','head','thing','time','people']);
      const potentialWords=[...new Set(wordMatches.map(w=>w.toLowerCase()))].filter(w=>w.length>=3&&!STOP_WORDS.has(w));
      // Match against DICTIONARY to get Chinese translations
      potentialWords.forEach(w=>{
        const d=DICTIONARY.find(d=>d.en.toLowerCase()===w);
        if(d){extractedWords.push({en:d.en,zh:d.zh,phonetic:d.phonetic||'',pos:d.pos||''});}
      });
      if(extractedWords.length>=4){
        // Save fetched words to the unit
        unit.w=extractedWords;
        saveTextbooksData(data);
        status.innerHTML=`<div class="fetch-done">✅ 在线检索到 <strong>${extractedWords.length}</strong> 个词汇，已保存到教材库！</div>`;
        onUnitChange(); // Refresh preview
        return;
      }
    }
    // Strategy 2: Open search in new tab as helper
    status.innerHTML=`<div class="fetch-fail">⚠️ 自动检索未能获取到足够词汇</div>
      <div style="margin-top:6px;">
        <button class="btn btn-accent btn-sm" onclick="openExternalSearch()">🔗 打开网页搜索</button>
        <span style="font-size:.8em;color:var(--muted);margin-left:8px;">或去 ⚙️ 管理 粘贴词汇</span>
      </div>`;
  }catch(e){
    status.innerHTML=`<div class="fetch-fail">⚠️ 网络请求失败：${e.message}</div>
      <div style="margin-top:6px;"><button class="btn btn-accent btn-sm" onclick="openExternalSearch()">🔗 打开网页搜索</button></div>`;
  }
  fetchBtn.disabled=false;
}
function openExternalSearch(){
  if(_selectedTbIdx===null)return;
  const unitIdx=parseInt(document.getElementById('unitSelect').value);
  const data=getTextbooksData();
  const tb=data.textbooks[_selectedTbIdx];
  const unit=(Array.isArray(tb.u)?tb.u:[])[unitIdx];
  const query=encodeURIComponent(`${tb.n} ${unit.n} 词汇表 vocabulary`);
  window.open(`https://www.google.com/search?q=${query}`, '_blank');
}

// -- Management Modal ----------------------------------------------------
function populateManageTbSelect(){
  const data=getTextbooksData();
  const sel=document.getElementById('manageTbSelect');
  sel.innerHTML='<option value="">选择教材</option>';
  data.textbooks.forEach((tb,i)=>{sel.innerHTML+=`<option value="${i}">${tb.n}</option>`;});
  // Also update textbook count badge
  const h2=document.getElementById('textbookSectionHeading');
  if(h2)h2.innerHTML=h2.innerHTML.replace(/\{\{textbookCount\}\}/g, data.textbooks.length);
}
let _manageTbIdx=null;
function showTextbookModal(){
  populateManageTbSelect();
  _manageTbIdx=null;
  document.getElementById('manageUnitSection').style.display='none';
  renderTextbookDeleteList();
  document.getElementById('textbookModal').style.display='flex';
}
function closeTextbookModal(){document.getElementById('textbookModal').style.display='none';}
function onManageTbChange(){
  const idx=parseInt(document.getElementById('manageTbSelect').value);
  if(isNaN(idx)){_manageTbIdx=null;document.getElementById('manageUnitSection').style.display='none';return;}
  _manageTbIdx=idx;
  const data=getTextbooksData();
  const tb=data.textbooks[idx];
  document.getElementById('manageUnitSection').style.display='block';
  renderManageUnitList();
  renderPasteTargetUnits();
}
function renderManageUnitList(){
  if(_manageTbIdx===null)return;
  const data=getTextbooksData();
  const tb=data.textbooks[_manageTbIdx];
  const list=document.getElementById('manageUnitList');
  list.innerHTML=tb.u.map((u,i)=>`<div class="user-row">
    <span>📖 ${u.n} <span style="color:var(--muted);font-size:.8em;">${u.w?u.w.length+'词':'无数据'}</span></span>
    <button class="user-del" onclick="deleteUnit(${i})">删除</button>
  </div>`).join('');
}
function renderPasteTargetUnits(){
  if(_manageTbIdx===null)return;
  const data=getTextbooksData();
  const tb=data.textbooks[_manageTbIdx];
  const sel=document.getElementById('pasteTargetUnit');
  sel.innerHTML=tb.u.map((u,i)=>`<option value="${i}">${u.n}</option>`).join('');
}
function renderTextbookDeleteList(){
  const data=getTextbooksData();
  const list=document.getElementById('textbookDeleteList');
  if(data.textbooks.length===0){
    list.innerHTML='<p style="color:var(--muted);font-size:.85em;">暂无教材</p>';return;
  }
  list.innerHTML=data.textbooks.map((tb,i)=>`<div class="user-row">
    <span><svg class="icon"><use href="#icon-bank"/></svg> ${tb.n} <span style="color:var(--muted);font-size:.8em;">(${(Array.isArray(tb.u)?tb.u:[]).length}单元)</span></span>
    <button class="user-del" onclick="deleteTextbook(${i})">删除</button>
  </div>`).join('');
}
function addCustomTextbook(){
  const name=document.getElementById('newTextbookName').value.trim();
  if(!name){toast('请输入教材名称','error');return;}
  const grade=document.getElementById('newTextbookGrade').value.trim()||'未知';
  const data=getTextbooksData();
  data.textbooks.push({n:name,p:'自定义',g:grade,uc:0,a:[],u:[]});
  saveTextbooksData(data);
  document.getElementById('newTextbookName').value='';
  document.getElementById('newTextbookGrade').value='';
  populateManageTbSelect();
  renderTextbookDeleteList();
  toast('已添加教材: '+name);
}
function deleteTextbook(idx){
  const data=getTextbooksData();
  const name=data.textbooks[idx].n;
  if(!confirm(`确定删除教材"${name}"及其所有单元词汇？`))return;
  data.textbooks.splice(idx,1);
  saveTextbooksData(data);
  if(_manageTbIdx===idx){_manageTbIdx=null;document.getElementById('manageUnitSection').style.display='none';}
  if(_selectedTbIdx===idx)clearTextbookSelection();
  populateManageTbSelect();
  renderTextbookDeleteList();
  toast('已删除教材: '+name);
}
function addUnitToTextbook(){
  if(_manageTbIdx===null){toast('请先在上方选择教材','error');return;}
  const name=document.getElementById('newUnitName').value.trim();
  if(!name){toast('请输入单元名称','error');return;}
  const data=getTextbooksData();
  data.textbooks[_manageTbIdx].u.push({n:name,w:null});
  saveTextbooksData(data);
  document.getElementById('newUnitName').value='';
  renderManageUnitList();
  renderPasteTargetUnits();
  if(_selectedTbIdx===_manageTbIdx){selectTextbook(_manageTbIdx);}
  toast('已添加单元: '+name);
}
function deleteUnit(idx){
  if(_manageTbIdx===null)return;
  const data=getTextbooksData();
  const name=data.textbooks[_manageTbIdx].u[idx].n;
  if(!confirm(`确定删除单元"${name}"？`))return;
  data.textbooks[_manageTbIdx].u.splice(idx,1);
  saveTextbooksData(data);
  renderManageUnitList();
  renderPasteTargetUnits();
  if(_selectedTbIdx===_manageTbIdx)selectTextbook(_manageTbIdx);
  toast('已删除单元: '+name);
}

// -- Word List Parsing & Pasting -----------------------------------------
function parseWordList(text){
  const lines=text.split(/[\n\r]+/).filter(l=>l.trim());
  const words=[];
  lines.forEach(line=>{
    line=line.trim();
    let en='',zh='';
    const dashIdx=line.indexOf(' - ');
    if(dashIdx>0){en=line.substring(0,dashIdx).trim();zh=line.substring(dashIdx+3).trim();}
    else{
      const parts=line.split(/\s+/);
      if(parts.length>=2&&/^[a-zA-Z]/.test(parts[0])){en=parts[0];zh=parts.slice(1).join(' ');}
      else{en=line;zh='';}
    }
    en=en.replace(/^[^a-zA-Z]+|[^a-zA-Z-]+$/g,'').toLowerCase();
    if(en.length<2)return;
    let phonetic='',pos='';
    const d=DICTIONARY.find(d=>d.en.toLowerCase()===en);
    if(d){if(!zh)zh=d.zh;phonetic=d.phonetic||'';pos=d.pos||'';}
    words.push({en,zh:zh||'(待补充)',phonetic,pos});
  });
  return words;
}
function pasteWordsToUnit(){
  if(_manageTbIdx===null){toast('请先在上方选择教材','error');return;}
  const text=document.getElementById('pasteWordList').value.trim();
  if(!text){toast('请粘贴词汇列表','error');return;}
  const words=parseWordList(text);
  if(words.length===0){toast('未解析到有效词汇','error');return;}
  const unitIdx=parseInt(document.getElementById('pasteTargetUnit').value);
  const data=getTextbooksData();
  const unit=data.textbooks[_manageTbIdx].u[unitIdx];
  if(!unit.w)unit.w=[];
  let added=0;
  words.forEach(w=>{
    if(!unit.w.find(uw=>uw.en.toLowerCase()===w.en.toLowerCase())){unit.w.push(w);added++;}
  });
  saveTextbooksData(data);
  document.getElementById('pasteWordList').value='';
  renderManageUnitList();
  if(_selectedTbIdx===_manageTbIdx)selectTextbook(_manageTbIdx);
  toast(`已添加 ${added} 个词汇到 ${unit.n}`);
}

// ============================================================================
// GAME ENGINE
// ============================================================================
let gameState=null;
let gameScope='all';

function filterByScope(words,scope){
  if(scope==='all')return words;
  const now=Date.now();
  const ranges={today:1,'3days':3,'7days':7,'30days':30};
  const days=ranges[scope];
  if(days){
    const cutoff=now-days*86400*1000;
    return words.filter(w=>(w.addedAt||0)>=cutoff);
  }
  return words;
}
function setScope(scope){
  gameScope=scope;
  document.querySelectorAll('.scope-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector(`.scope-btn[data-scope="${scope}"]`)?.classList.add('active');
}

function getGameWords(wordList){
  const words=wordList||getWordBank();
  if(words.length<4)return null;
  const errors=getErrors();const now=Date.now();

  const scored=words.map(w=>{
    let score=0;
    if(errors[w.en])score+=(errors[w.en]*5);
    if(w.nextReview<=now&&w.stage<EBBINGHAUS_STAGES.length-1)score+=3;
    if(w.totalAttempts===0)score+=1;
    score-=w.stage*0.5;
    return{...w,score};
  });
  scored.sort((a,b)=>b.score-a.score);
  return scored;
}

function startGame(mode){
  let words=filterByScope(getWordBank(),gameScope);
  if(words.length<4){toast('当前范围内词汇不足4个，请扩大范围或先导入更多单词','error');return;}

  const scored=getGameWords(words);
  if(!scored)return;

  const topN=Math.min(12,scored.length);
  const top=scored.slice(0,topN);
  const rest=scored.slice(topN);
  const shuffledRest=rest.sort(()=>Math.random()-0.5).slice(0,Math.min(8,rest.length));
  const pool=[...top,...shuffledRest].sort(()=>Math.random()-0.5);

  gameState={
    mode,pool,
    current:0,total:Math.min(20,pool.length),
    correct:0,wrong:0,
    wrongWords:[],
    answers:[],
    stageBefore:{},stageAdvanced:0,stageReset:0
  };
  // Record pre-game stages for feedback
  const data=loadData();
  pool.forEach(w=>{
    const dw=data.words.find(dw=>dw.en.toLowerCase()===w.en.toLowerCase());
    if(dw) gameState.stageBefore[w.en]=dw.stage||0;
  });

  document.getElementById('gameSetup').style.display='none';
  document.getElementById('gameResult').style.display='none';
  renderQuestion();
}

function blankWordMixed(word){
  if(word.length<=2)return word;
  const chars=word.split('');
  const vowels=[];const consonants=[];
  for(let i=0;i<chars.length;i++){
    if(/[aeiou]/i.test(chars[i]))vowels.push(i);
    else if(/[a-z]/i.test(chars[i]))consonants.push(i);
  }
  const targetVowelCount=Math.max(0,Math.floor(vowels.length*0.8));
  const targetConsonantCount=Math.max(0,Math.floor(consonants.length*0.2));
  const toBlank=new Set();
  const shuffledV=[...vowels].sort(()=>Math.random()-0.5).slice(0,targetVowelCount);
  const shuffledC=[...consonants].sort(()=>Math.random()-0.5).slice(0,targetConsonantCount);
  shuffledV.forEach(i=>toBlank.add(i));
  shuffledC.forEach(i=>toBlank.add(i));
  if(toBlank.size===0&&chars.length>=3){
    // Ensure at least 1 blank for short words
    const pool=vowels.length>0?vowels:consonants;
    const pick=pool[Math.floor(Math.random()*pool.length)];
    toBlank.add(pick);
  }
  const visibleCount=chars.length-toBlank.size;
  if(visibleCount<2){
    const excess=[...toBlank].sort(()=>Math.random()-0.5);
    for(let i=0;i<2-visibleCount&&i<excess.length;i++)toBlank.delete(excess[i]);
  }
  return chars.map((c,i)=>toBlank.has(i)?'<span class="blank-char">_</span>':c).join('');
}

function revealHint(zh){
  const el=document.getElementById('hintReveal');
  const btn=document.getElementById('hintBtn');
  if(el)el.style.display='inline';
  if(btn)btn.style.display='none';
}

function renderQuestion(){
  if(!gameState||gameState.current>=gameState.total){showGameResult();return;}
  const idx=gameState.current;
  const word=gameState.pool[idx];
  const play=document.getElementById('gamePlay');
  play.style.display='block';

  const progressPct=Math.round(idx/gameState.total*100);
  const modeNames=['','识单词','义单词','拼单词'];
  const modeName=modeNames[gameState.mode]||'';
  play.innerHTML=`
    <div class="card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <span style="font-weight:900;font-size:1.1em;color:var(--accent);"><svg class="icon"><use href="#icon-game"/></svg> ${modeName}</span>
        <button class="btn btn-sm btn-outline" onclick="backToMenu()"><svg class="icon"><use href="#icon-error"/></svg> 退出</button>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${progressPct}%"></div></div>
      <div class="question-num">第 ${idx+1} / ${gameState.total} 题</div>
      <div id="questionContent"></div>
    </div>`;

  const qc=document.getElementById('questionContent');

  if(gameState.mode===1){
    // English word → choose Chinese translation
    const distractors=getDistractors(word,3);
    const options=[word,...distractors].sort(()=>Math.random()-0.5);
        const optsHtml=options.map(function(w){
      var label=w.zh||w.en;
      label=label.replace(/^\s*(n\.|v\.|adj\.|adv\.|prep\.|conj\.|pron\.|num\.|det\.|phr\.)\s+/,'').replace(/\s+(n\.|v\.|adj\.|adv\.|prep\.|conj\.|pron\.|num\.|det\.|phr\.)$/,'');
      return'<button class="option-btn" data-en="'+w.en+'" onclick="answerGame1(this,\''+word.en+'\')">'+label+'</button>';
    }).join('');
    qc.innerHTML=`
      <div class="question-word">${word.en}${word.pos?` <span class="question-pos-pill">${word.pos}</span>`:''}</div>
      ${word.phonetic?`<div class="question-phonetic">${word.phonetic}</div>`:''}
      <div class="options-grid">${optsHtml}</div>`;
  }else if(gameState.mode===2){
    // English definition → choose English word
    const distractors=getDistractors(word,3);
    const options=[word,...distractors].sort(()=>Math.random()-0.5);
    const defText=word.def||word.zh||'';
    qc.innerHTML=`
      <div class="question-def" style="font-size:1.3em;">${defText||'(暂无释义)'}</div>
      <div class="question-pos">${word.pos||''}</div>
      <div style="font-size:.85em;color:var(--muted);margin-bottom:8px;">选择正确的英文单词</div>
      <div class="options-grid">${options.map(w=>`<button class="option-btn" data-en="${w.en}" onclick="answerGame2(this,'${word.en}')">${w.en}</button>`).join('')}</div>`;
  }else if(gameState.mode===3){
    // Fill missing letters (vowels + some consonants)
    const blanked=blankWordMixed(word.en);
    qc.innerHTML=`
      <div class="question-word" style="letter-spacing:.2em;">${blanked}</div>
      <div class="question-pos">词性：${word.pos||''}</div>
      <div style="font-size:.85em;color:var(--muted);margin-bottom:12px;">
        补全缺失的字母（元音为主，含少量辅音）
        <span id="hintReveal" style="display:none;margin-left:8px;color:var(--accent);font-weight:bold;">${word.zh||''}</span>
        <button class="btn btn-sm hint-btn" id="hintBtn" onclick="revealHint('${word.zh||''}')"><svg class="icon"><use href="#icon-warning"/></svg> 提示</button>
      </div>
      <input class="question-input" id="fillInput" placeholder="输入完整单词" autocomplete="off" autofocus>
      <div style="margin-top:12px;"><button class="btn btn-primary" onclick="answerGame3('${word.en}')">确认</button></div>`;
    setTimeout(()=>document.getElementById('fillInput')?.focus(),100);
    document.getElementById('fillInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')answerGame3(word.en);});
  }
}

function getDistractors(correct,n){
  const words=getWordBank().filter(w=>w.en.toLowerCase()!==correct.en.toLowerCase());
  const shuffled=words.sort(()=>Math.random()-0.5);
  return shuffled.slice(0,n);
}

function answerGame1(btn,correctEn){
  const selected=btn.dataset.en;
  const correct=selected===correctEn;
  processAnswer(correct,correctEn);
  document.querySelectorAll('#questionContent .option-btn').forEach(b=>{
    b.disabled=true;
    if(b.dataset.en===correctEn)b.classList.add('correct');
    if(b===btn&&!correct)b.classList.add('wrong');
  });
  setTimeout(nextQuestion,800);
}

function answerGame2(btn,correctEn){
  const selected=btn.dataset.en;
  const correct=selected===correctEn;
  processAnswer(correct,correctEn);
  document.querySelectorAll('#questionContent .option-btn').forEach(b=>{
    b.disabled=true;
    if(b.dataset.en===correctEn)b.classList.add('correct');
    if(b===btn&&!correct)b.classList.add('wrong');
  });
  setTimeout(nextQuestion,800);
}

function answerGame3(correctEn){
  const input=document.getElementById('fillInput');
  if(!input)return;
  const answer=input.value.trim().toLowerCase();
  const correct=answer===correctEn.toLowerCase();
  processAnswer(correct,correctEn);
  const qc=document.getElementById('questionContent');
  qc.innerHTML+=`<div style="margin-top:8px;font-weight:bold;color:${correct?'var(--green)':'var(--red)'}">${correct?'<svg class="icon"><use href="#icon-success"/></svg> 正确！':'<svg class="icon"><use href="#icon-error"/></svg> 正确答案是: '+correctEn}</div>`;
  setTimeout(nextQuestion,800);
}

function processAnswer(correct,en){
  if(!gameState)return;
  if(correct){gameState.correct++;}
  else{
    gameState.wrong++;
    if(!gameState.wrongWords.includes(en))gameState.wrongWords.push(en);
  }
  gameState.answers.push({en,correct});
  // Track stage changes for feedback
  const before=gameState.stageBefore[en]||0;
  updateWordProgress(en,correct);
  const data=loadData();
  const dw=data.words.find(dw=>dw.en.toLowerCase()===en.toLowerCase());
  const after=dw?dw.stage||0:0;
  if(after>before)gameState.stageAdvanced++;
  else if(after<before)gameState.stageReset++;
}

function nextQuestion(){
  if(!gameState)return;
  gameState.current++;
  if(gameState.current>=gameState.total){showGameResult();}
  else{renderQuestion();}
}

function showGameResult(){
  if(!gameState)return;
  document.getElementById('gamePlay').style.display='none';
  document.getElementById('gameResult').style.display='block';
  const res=document.getElementById('gameResult');
  const pct=Math.round(gameState.correct/gameState.total*100);
  let cls='score-ok',resultIcon='<svg class="icon" style="font-size:1.3em;"><use href="#icon-error"/></svg>';
  if(pct>=90){cls='score-perfect';resultIcon='<svg class="icon" style="font-size:1.3em;"><use href="#icon-confetti"/></svg>';shootConfetti();}
  else if(pct>=70){cls='score-good';resultIcon='<svg class="icon" style="font-size:1.3em;"><use href="#icon-success"/></svg>';}

  res.innerHTML=`
    <div class="card" style="text-align:center;">
      <h2><svg class="icon"><use href="#icon-game"/></svg> 游戏结束！</h2>
      <div class="score-circle ${cls}" id="scoreCircle">0%</div>
      <div style="font-size:1.5em;margin-bottom:4px;">${resultIcon} ${pct>=80?'非常棒！':pct>=60?'不错！':'继续加油！'}</div>
      <div class="result-row">
        <div class="result-item"><div class="rnum" style="color:var(--green)">${gameState.correct}</div><div class="rlabel"><svg class="icon"><use href="#icon-success"/></svg> 正确</div></div>
        <div class="result-item"><div class="rnum" style="color:var(--red)">${gameState.wrong}</div><div class="rlabel"><svg class="icon"><use href="#icon-error"/></svg> 错误</div></div>
        <div class="result-item"><div class="rnum" style="color:var(--accent)">${gameState.wrongWords.length}</div><div class="rlabel"><svg class="icon"><use href="#icon-bank"/></svg> 错词入集</div></div>
        <div class="result-item"><div class="rnum" style="color:var(--green)">+${gameState.stageAdvanced||0}</div><div class="rlabel"><svg class="icon"><use href="#icon-review"/></svg> 记忆推进</div></div>
        ${gameState.stageReset>0?`<div class="result-item"><div class="rnum" style="color:var(--red)">${gameState.stageReset}</div><div class="rlabel"><svg class="icon"><use href="#icon-switch"/></svg> 需重记</div></div>`:''}
      </div>
      <div style="font-size:.8em;color:var(--muted);margin-top:4px;"><svg class="icon"><use href="#icon-review"/></svg> 艾宾浩斯记忆: ${gameState.stageAdvanced||0}词推进至下一阶段 · ${gameState.stageReset||0}词重置</div>
      ${gameState.wrongWords.length>0?`<div class="card" style="text-align:left;margin-top:12px;background:#fdf5f8;">
        <h3 style="color:var(--red);"><svg class="icon"><use href="#icon-bank"/></svg> 需要复习的单词</h3>
        ${gameState.wrongWords.map(en=>{
          const w=getWordBank().find(w=>w.en===en);
          return w?`<div class="word-row"><span class="en">${w.en}</span><span class="zh">${w.zh||''}</span></div>`:'';
        }).join('')}
      </div>`:''}
      <div style="margin-top:20px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="startGame(1)"><svg class="icon"><use href="#icon-read"/></svg> 再玩一局</button>
        <button class="btn btn-accent" onclick="startGame(2)"><svg class="icon"><use href="#icon-meaning"/></svg> 换模式2</button>
        <button class="btn btn-accent" onclick="startGame(3)"><svg class="icon"><use href="#icon-spell"/></svg> 换模式3</button>
        <button class="btn btn-outline" onclick="backToMenu()"><svg class="icon"><use href="#icon-error"/></svg> 返回菜单</button>
      </div>
    </div>`;
  saveData(loadData());
  // Record check-in and animate score counter
  recordCheckin();
  setTimeout(()=>{
    const circle=document.getElementById('scoreCircle');
    if(circle) animateNumber(circle, pct, 800);
  }, 100);
  renderBank();
}

function backToMenu(){
  gameState=null;
  document.getElementById('gamePlay').style.display='none';
  document.getElementById('gameResult').style.display='none';
  document.getElementById('gameSetup').style.display='block';
  renderBank();
}

// ============================================================================

// ============================================================================
// PROFILE VIEW
// ============================================================================
function renderProfile(){
  try{
    const words=getWordBank(),meta=getUsersMeta();
    const users=meta&&meta.users||[];
    const active=users.find(function(u){return u.id===getActiveUserId();});
    const nameEl=document.getElementById('profileUserName');
    if(nameEl&&active)nameEl.textContent=active.name;
    const streakEl=document.getElementById('profileStreakLabel');
    if(streakEl){
      const streak=getCheckinStreak();
      streakEl.textContent='🔥 连续打卡 '+streak+' 天 · 📚 '+words.length+' 词汇';
    }
  }catch(e){}
  updateAvatarDisplay();
  try{renderCheckinCalendar();}catch(e){}
}

// ===========================================================
// CONFETTI & CELEBRATION EFFECTS
// ============================================================================
function shootConfetti(){
  const colors=['#e8507a','#f0b835','#4aaf85','#4da3c8','#6b3fa0','#f0628a','#f0c860','#a0d0c0'];
  const container=document.createElement('div');
  container.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:999;';
  document.body.appendChild(container);
  for(let i=0;i<80;i++){
    const particle=document.createElement('div');
    const color=colors[Math.floor(Math.random()*colors.length)];
    const size=6+Math.random()*10;
    const x=50+(Math.random()-0.5)*80;
    const delay=Math.random()*0.6;
    const duration=1.5+Math.random()*2;
    const rotation=Math.random()*720-360;
    particle.style.cssText=`
      position:absolute;left:${x}vw;top:-20px;width:${size}px;height:${size*0.6}px;
      background:${color};border-radius:2px;opacity:0;
      animation:confettiFall ${duration}s ${delay}s ease-in forwards;
      transform:rotate(${Math.random()*360}deg);
    `;
    container.appendChild(particle);
  }
  setTimeout(()=>container.remove(), 4000);
}

function animateNumber(el, target, duration){
  const start=0;
  const startTime=performance.now();
  function tick(now){
    const elapsed=now-startTime;
    const progress=Math.min(elapsed/duration, 1);
    const eased=1-Math.pow(1-progress, 3);
    el.textContent=Math.round(start+(target-start)*eased);
    if(progress<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Add confetti keyframes to stylesheet
(function(){
  const style=document.createElement('style');
  style.textContent=`
    @keyframes confettiFall{
      0%{opacity:1;transform:translateY(0) rotate(0deg) scale(1);}
      100%{opacity:0;transform:translateY(100vh) rotate(720deg) scale(.3);}
    }
  `;
  document.head.appendChild(style);
})();

// ============================================================================

// ============================================================================
// DARK MODE
// ============================================================================
var darkMode='auto';
function applyTheme(){
  var isDark;
  if(darkMode==='auto'){
    isDark=window.matchMedia('(prefers-color-scheme:dark)').matches;
  }else{
    isDark=darkMode==='dark';
  }
  document.documentElement.setAttribute('data-theme',isDark?'dark':'light');
  var btn=document.getElementById('darkModeToggle');
  if(btn){
    if(darkMode==='auto')btn.textContent='自动';
    else if(darkMode==='dark')btn.textContent='深色';
    else btn.textContent='浅色';
  }
}
function toggleDarkMode(){
  if(darkMode==='auto')darkMode='dark';
  else if(darkMode==='dark')darkMode='light';
  else darkMode='auto';
  applyTheme();
  try{localStorage.setItem('vocab_champion_darkmode',darkMode);}catch(e){}
}
function initDarkMode(){
  try{darkMode=localStorage.getItem('vocab_champion_darkmode')||'auto';}catch(e){}
  applyTheme();
  window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change',function(){
    if(darkMode==='auto')applyTheme();
  });
}

// ============================================================================
// SWIPE GESTURES
// ============================================================================
function initSwipeGestures(){
  var touchStartX=0,touchStartY=0;
  var tabOrder=['review','bank','game','profile'];
  document.addEventListener('touchstart',function(e){
    touchStartX=e.touches[0].clientX;
    touchStartY=e.touches[0].clientY;
  },{passive:true});
  document.addEventListener('touchend',function(e){
    var dx=e.changedTouches[0].clientX-touchStartX;
    var dy=e.changedTouches[0].clientY-touchStartY;
    if(Math.abs(dx)<50||Math.abs(dx)<Math.abs(dy))return;
    var currentView=document.querySelector('.view.active');
    if(!currentView)return;
    var currentTab=currentView.id.replace('view-','');
    var idx=tabOrder.indexOf(currentTab);
    if(dx>0&&idx>0)switchTab(tabOrder[idx-1]);
    if(dx<0&&idx<tabOrder.length-1)switchTab(tabOrder[idx+1]);
  },{passive:true});
}

// INIT
// ============================================================================
try{
migrateToMultiUser();
seedTextbooks();
updateUserDisplay();
initDarkMode();
initSwipeGestures();
document.body.classList.add('has-bottom-nav');
// Update textbook count badge
(function(){
  const data=getTextbooksData();
  const h2=document.getElementById('textbookSectionHeading');
  if(h2)h2.innerHTML=h2.innerHTML.replace(/\{\{textbookCount\}\}/g, data.textbooks.length);
})();
document.getElementById('userModal').addEventListener('click',function(e){if(e.target===this)closeUserModal();});
document.getElementById('textbookModal').addEventListener('click',function(e){if(e.target===this)closeTextbookModal();});
document.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
document.getElementById('addWordModal').addEventListener('click',function(e){if(e.target===this)closeAddWord();});
document.getElementById('addEn').addEventListener('keydown',e=>{
  if(e.key==='Enter'){
    // Auto-lookup dictionary for all fields
    const en=document.getElementById('addEn').value.trim().toLowerCase();
    const d=DICTIONARY.find(d=>d.en===en);
    if(d){
      if(!document.getElementById('addZh').value)document.getElementById('addZh').value=d.zh;
      if(!document.getElementById('addDef').value)document.getElementById('addDef').value=d.def;
      if(!document.getElementById('addPhonetic').value)document.getElementById('addPhonetic').value=d.phonetic||'';
      if(!document.getElementById('addPos').value)document.getElementById('addPos').value=d.pos||'';
    }
    saveWord();
  }
});
// Also auto-fill on blur
document.getElementById('addEn').addEventListener('blur',function(){
  const en=this.value.trim().toLowerCase();
  const d=DICTIONARY.find(d=>d.en===en);
  if(d){
    if(!document.getElementById('addZh').value)document.getElementById('addZh').value=d.zh;
    if(!document.getElementById('addDef').value)document.getElementById('addDef').value=d.def;
    if(!document.getElementById('addPhonetic').value)document.getElementById('addPhonetic').value=d.phonetic||'';
    if(!document.getElementById('addPos').value)document.getElementById('addPos').value=d.pos||'';
  }
});

renderBank();
renderReview();
renderProfile();
updateAvatarDisplay();
}catch(e){console.error('Init error:',e);}
// Register service worker for PWA offline support
// SW temporarily disabled for debugging
// if('serviceWorker' in navigator){
//   navigator.serviceWorker.register('sw.js').catch(function(){});
// }
