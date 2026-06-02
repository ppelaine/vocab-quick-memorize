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
        {en:"take a risk",zh:"冒险",phonetic:"",pos:"phr."}
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

function loadData(){
  try{
    const key=getUserStorageKey();
    const data=JSON.parse(localStorage.getItem(key))||{words:[],errors:{}};
    let migrated=false;
    data.words.forEach(w=>{
      if(w.phonetic===undefined){w.phonetic='';migrated=true;}
      if(w.pos===undefined){w.pos='';migrated=true;}
    });
    if(migrated)localStorage.setItem(key,JSON.stringify(data));
    return data;
  }catch(e){return{words:[],errors:{}}}
}
function saveData(data){localStorage.setItem(getUserStorageKey(),JSON.stringify(data));}

function getWordBank(){return loadData().words;}
function getErrors(){return loadData().errors||{};}

function saveWordToBank(word){
  const data=loadData();
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
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-'+tab).classList.add('active');
  if(tab==='bank')renderBank();
}

// ============================================================================
// WORD BANK VIEW
// ============================================================================
let bankFilter='all';
function filterWords(f){bankFilter=f;renderBank();}

function renderBank(){
  const words=getWordBank(),errors=getErrors();
  const now=Date.now();
  let filtered=words;
  if(bankFilter==='new')filtered=words.filter(w=>w.totalAttempts===0);
  else if(bankFilter==='learning')filtered=words.filter(w=>w.totalAttempts>0&&w.stage<EBBINGHAUS_STAGES.length-1);
  else if(bankFilter==='review')filtered=words.filter(w=>w.nextReview<=now&&w.stage<EBBINGHAUS_STAGES.length-1);
  else if(bankFilter==='mastered')filtered=words.filter(w=>w.stage>=EBBINGHAUS_STAGES.length-1);
  else if(bankFilter==='errors')filtered=words.filter(w=>errors[w.en]);

  const due=words.filter(w=>w.nextReview<=now&&w.stage<EBBINGHAUS_STAGES.length-1).length;
  const mastered=words.filter(w=>w.stage>=EBBINGHAUS_STAGES.length-1).length;
  const errCount=Object.keys(errors).length;
  document.getElementById('statsRow').innerHTML=`
    <div class="stat-card"><div class="num">${words.length}</div><div class="label">📚 总词汇</div></div>
    <div class="stat-card"><div class="num" style="color:var(--red)">${due}</div><div class="label">🔴 待复习</div></div>
    <div class="stat-card"><div class="num" style="color:var(--accent)">${errCount}</div><div class="label">❌ 错词集</div></div>
    <div class="stat-card"><div class="num" style="color:var(--blue)">${mastered}</div><div class="label">✅ 已掌握</div></div>`;

  const list=document.getElementById('wordList');
  const empty=document.getElementById('emptyBank');
  if(words.length===0){list.innerHTML='';empty.style.display='block';return;}
  empty.style.display='none';

  if(filtered.length===0){
    list.innerHTML='<div class="empty"><span class="icon">🔍</span><p>没有匹配的单词</p></div>';
    return;
  }
  list.innerHTML=filtered.map(w=>{
    const isErr=!!errors[w.en];
    const due=w.nextReview<=now&&w.stage<EBBINGHAUS_STAGES.length-1;
    let badge='',badgeClass='';
    if(w.totalAttempts===0){badge='新词';badgeClass='badge-new';}
    else if(w.stage>=EBBINGHAUS_STAGES.length-1){badge='已掌握';badgeClass='badge-mastered';}
    else if(due){badge='待复习';badgeClass='badge-review';}
    else{badge='学习中';badgeClass='badge-learning';}
    const pct=w.totalAttempts>0?Math.round((w.totalAttempts-w.errorCount)/w.totalAttempts*100):0;
    const phon=w.phonetic?`<span class="phonetic">${w.phonetic}</span>`:'';
    const pos=w.pos?`<span class="pos">${w.pos}</span>`:'';
    return`<div class="word-row">
      <span class="en">${isErr?'❌ ':''}${w.en}</span>
      ${phon}${pos}
      <span class="zh">${w.zh||'—'}</span>
      <span class="badge ${badgeClass}">${badge}</span>
      <span class="meta">正确率${pct}% · ${STAGE_LABELS[w.stage]||'已掌握'}</span>
      <button class="btn btn-sm btn-outline" onclick="editWord('${w.en}')">编辑</button>
      <button class="btn btn-sm btn-outline" onclick="deleteWord('${w.en}')" style="color:var(--red);border-color:var(--red);">删除</button>
    </div>`;
  }).join('');
}

function deleteWord(en){
  const data=loadData();
  data.words=data.words.filter(w=>w.en.toLowerCase()!==en.toLowerCase());
  if(data.errors[en])delete data.errors[en];
  saveData(data);renderBank();toast('已删除: '+en);
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
  const active=meta.users.find(u=>u.id===meta.activeUserId);
  const el=document.getElementById('currentUserName');
  if(el)el.textContent=active?active.name:'默认用户';
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
function saveWord(){
  const en=document.getElementById('addEn').value.trim();
  const zh=document.getElementById('addZh').value.trim();
  const def=document.getElementById('addDef').value.trim();
  const phonetic=document.getElementById('addPhonetic').value.trim();
  const pos=document.getElementById('addPos').value.trim();
  if(!en||!zh)return toast('英文和中文为必填项','error');
  // Auto-fill from dictionary
  let finalDef=def, finalPhon=phonetic, finalPos=pos;
  const d=DICTIONARY.find(d=>d.en.toLowerCase()===en.toLowerCase());
  if(d){
    if(!finalDef)finalDef=d.def;
    if(!finalPhon)finalPhon=d.phonetic||'';
    if(!finalPos)finalPos=d.pos||'';
  }
  saveWordToBank({en,zh,def:finalDef,phonetic:finalPhon,pos:finalPos});
  closeAddWord();renderBank();toast('已添加: '+en);
}

function addSampleWords(){
  const existing=getWordBank();
  const existingEns=new Set(existing.map(w=>w.en.toLowerCase()));
  let added=0;
  DICTIONARY.forEach(d=>{if(!existingEns.has(d.en.toLowerCase())){saveWordToBank(d);added++;}});
  renderBank();toast(`已导入 ${added} 个示例词汇`);
}

// ============================================================================
// OCR / UPLOAD
// ============================================================================
let tocMode=false;
function toggleTOCMode(){
  tocMode=!tocMode;
  const toggle=document.getElementById('tocModeToggle');
  toggle.classList.toggle('active',tocMode);
  toggle.textContent=(tocMode?'✅ ':'')+'📋 TOC模式（教材目录页识别）';
  const label=document.getElementById('uploadLabel');
  if(label)label.textContent=tocMode?'点击上传目录页图片 (TOC模式)':'点击上传 或 拖拽图片到此处';
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

    // OCR
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

    // Match against DICTIONARY + user's textbook vocab banks — with fuzzy correction
    const found=[],notFound=[],fuzzyFixed=[];
    uniqueWords.forEach(w=>{
      // Apply known OCR fixes
      const fixed=_OCR_FIXES[w]||w;
      if(fixed!==w) w=fixed;
      // Exact match
      let d=_dictMap[w];
      if(d) { found.push({en:d.en,zh:d.zh||'',def:d.def||'',phonetic:d.phonetic||'',pos:d.pos||''}); return; }
      // Fuzzy match (edit distance ≤ 2)
      const fuzzy=_fuzzyDictMatch(w);
      if(fuzzy.match){
        found.push({en:fuzzy.match.en,zh:fuzzy.match.zh||'',def:fuzzy.match.def||'',phonetic:fuzzy.match.phonetic||'',pos:fuzzy.match.pos||''});
        if(fuzzy.distance>0) fuzzyFixed.push({from:w, to:fuzzy.match.en});
      } else {
        notFound.push(w);
      }
    });

    const matchedWithDef=found.filter(w=>w.def);
    let statusMsg=`<p style="color:var(--green);font-weight:bold;">✅ 识别到 ${uniqueWords.length} 个单词，其中 ${found.length} 个已匹配词典 (${matchedWithDef.length}个含英文释义)</p>
      <p style="font-size:.75em;color:var(--muted);">${isTOC?'TOC模式 · 自适应预处理 · ':''}模糊匹配已启用 · 含教材词汇库</p>`;
    if(fuzzyFixed.length>0){
      statusMsg+=`<p style="font-size:.75em;color:var(--accent);">🔧 自动修正 ${fuzzyFixed.length} 个形近词: ${fuzzyFixed.map(f=>f.from+'→'+f.to).join(', ')}</p>`;
    }
    status.innerHTML=statusMsg;

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
        html+=`<div class="card"><h2>📋 已识别的单词 (${found.length}个)</h2>
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
        html+=`<div class="card" style="margin-top:8px;"><h2>❓ 未匹配词典的单词 (${notFound.length}个)</h2>
          <p style="font-size:.85em;color:var(--muted);margin-bottom:8px;">请填写中文和英文释义后导入（英文释义为必填，否则游戏第二关无法进行）</p>
          <div style="margin-bottom:12px;">
            <button class="btn btn-accent btn-sm" onclick="importAllNotFound()">一键全部导入 (${notFound.length}个)</button>
          </div>
          <div class="word-list">${notFound.map(w=>{
            const safeId=w.replace(/[^a-z]/g,'_');
            return`<div class="word-row">
            <span class="en">${w}</span>
            <input id="zh_${safeId}" placeholder="中文(可选)" style="width:80px;padding:4px 8px;border:1px solid #ddd;border-radius:4px;">
            <input id="def_${safeId}" placeholder="⚠️英文释义(必填)" style="width:160px;padding:4px 8px;border:1px solid var(--red);border-radius:4px;font-size:.8em;">
            <input id="ph_${safeId}" placeholder="音标" style="width:80px;padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:.8em;">
            <input id="pos_${safeId}" placeholder="词性" style="width:50px;padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:.8em;">
            <button class="btn btn-sm btn-accent" onclick="importManual('${w}')">导入</button>
          </div>`;
          }).join('')}</div></div>`;
        window._lastNotFound=notFound;
      }
    }

    // Show raw OCR text for debugging
    html+=`<details class="raw-ocr-text"><summary>🔍 查看原始识别文本 (调试用)</summary><pre style="white-space:pre-wrap;font-size:.75em;">${text}</pre></details>`;

    results.innerHTML=html;
    // Store for TOC batch import
    window._tocFound=found;
    window._tocNotFound=notFound;
  }catch(e){status.innerHTML=`<p style="color:var(--red)">识别失败: ${e.message}</p>`;}
}

function importOne(en,zh,def,phonetic,pos){
  saveWordToBank({en,zh,def,phonetic,pos});toast('已导入: '+en);renderBank();
}
function importAllFound(){
  if(!window._lastFound)return;
  window._lastFound.forEach(w=>saveWordToBank(w));
  toast(`已导入 ${window._lastFound.length} 个单词`);renderBank();
}
function importManual(en){
  const safeId=en.replace(/[^a-z]/g,'_');
  const zh=document.getElementById('zh_'+safeId)?.value?.trim()||'';
  const def=document.getElementById('def_'+safeId)?.value?.trim()||'';
  const phonetic=document.getElementById('ph_'+safeId)?.value?.trim()||'';
  const pos=document.getElementById('pos_'+safeId)?.value?.trim()||'';
  saveWordToBank({en,zh:zh||'(待补充)',def:def||'',phonetic,pos});
  toast('已导入: '+en);renderBank();
}
function importAllNotFound(){
  if(!window._lastNotFound)return;
  window._lastNotFound.forEach(en=>{
    const safeId=en.replace(/[^a-z]/g,'_');
    const zh=document.getElementById('zh_'+safeId)?.value?.trim()||'';
    const def=document.getElementById('def_'+safeId)?.value?.trim()||'';
    const phonetic=document.getElementById('ph_'+safeId)?.value?.trim()||'';
    const pos=document.getElementById('pos_'+safeId)?.value?.trim()||'';
    saveWordToBank({en,zh:zh||'(待补充)',def:def||'',phonetic,pos});
  });
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
    return`<tr class="toc-unmatched">
      <td>${i+1}</td>
      <td><strong>${w}</strong></td>
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
  let html=`<div class="card"><h2>📋 TOC识别结果 — 请核对后导入</h2>
    <div class="toc-header-actions">
      <button class="btn btn-primary btn-sm" onclick="importAllTOCWords()">📥 全部导入词库 (${totalWords}词)</button>
      <button class="btn btn-sm btn-outline" onclick="importTOCMatched()">仅导入已匹配 (${found.length}词)</button>
      <span style="font-size:.8em;color:var(--muted);">💡 双击单元格可编辑内容</span>
    </div>`;

  // If structure detected: show unit-grouped accordion view
  if(unitView&&unitView.unitView&&unitView.unitView.length>=2){
    html+=`<p style="margin-top:8px;font-size:.85em;color:var(--accent);">📑 检测到 ${unitView.unitView.length} 个单元结构，按单元分组展示</p>`;
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
      html+=`<details class="toc-unit-group"><summary class="toc-unit-summary"><strong>📌 未归类单词</strong> <span style="font-weight:normal;font-size:.85em;color:var(--muted);">— ${unitView.unassignedFound.length+unitView.unassignedNotFound.length}词</span></summary><div style="padding:4px 0 8px 0;">`;
      html+=_renderFlatTable(`✅ 已匹配: ${unitView.unassignedFound.length}词`, unitView.unassignedFound, false);
      if(unitView.unassignedNotFound&&unitView.unassignedNotFound.length) html+=_renderFlatTable(`❓ 未匹配: ${unitView.unassignedNotFound.length}词`, unitView.unassignedNotFound, true);
      html+=`</div></details>`;
    }
  } else {
    // Fallback: flat view (original behavior)
    if(found.length>0) html+=_renderFlatTable(`✅ 已匹配词典: ${found.length} 个单词`, found, false);
    if(notFound.length>0) html+=_renderFlatTable(`❓ 未匹配词典: ${notFound.length} 个单词 — 请手动填写信息后导入`, notFound, true);
  }

  html+=`<p style="font-size:.75em;color:var(--red);margin-top:8px;">⚠️ 英文释义为必填项，否则游戏第二关无法进行。已匹配单词大部分已有释义，请核对。</p></div>`;
  return html;
}

function importTOCWord(en){
  const safeEn=en.replace(/[^a-z]/g,'_');
  const zh=document.getElementById('toc_zh_'+safeEn)?.value?.trim()||'';
  const phonetic=document.getElementById('toc_ph_'+safeEn)?.value?.trim()||'';
  const pos=document.getElementById('toc_pos_'+safeEn)?.value?.trim()||'';
  const def=document.getElementById('toc_def_'+safeEn)?.value?.trim()||'';
  if(!def){toast('⚠️ 请先填写英文释义 (def)，否则游戏第二关无法进行','error');return;}
  saveWordToBank({en,zh:zh||'(待补充)',def,phonetic,pos});
  toast('已导入: '+en);renderBank();
}

function importAllTOCWords(){
  const allWords=[...(window._tocFound||[]),...(window._tocNotFound||[]).map(w=>({en:w,zh:'',def:'',phonetic:'',pos:''}))];
  let imported=0,skipped=0;
  allWords.forEach(w=>{
    const safeEn=w.en.replace(/[^a-z]/g,'_');
    const zh=document.getElementById('toc_zh_'+safeEn)?.value?.trim()||w.zh||'';
    const phonetic=document.getElementById('toc_ph_'+safeEn)?.value?.trim()||w.phonetic||'';
    const pos=document.getElementById('toc_pos_'+safeEn)?.value?.trim()||w.pos||'';
    const def=document.getElementById('toc_def_'+safeEn)?.value?.trim()||w.def||'';
    if(!def){skipped++;return;}
    saveWordToBank({en:w.en,zh:zh||'(待补充)',def,phonetic,pos});
    imported++;
  });
  if(skipped>0)toast(`已导入 ${imported} 个单词，${skipped} 个因缺少英文释义被跳过`,'error');
  else toast(`已导入 ${imported} 个单词`);renderBank();
}

function importTOCMatched(){
  if(!window._tocFound)return;
  let imported=0;
  window._tocFound.forEach(w=>{
    const safeEn=w.en.replace(/[^a-z]/g,'_');
    const zh=document.getElementById('toc_zh_'+safeEn)?.value?.trim()||w.zh||'';
    const phonetic=document.getElementById('toc_ph_'+safeEn)?.value?.trim()||w.phonetic||'';
    const pos=document.getElementById('toc_pos_'+safeEn)?.value?.trim()||w.pos||'';
    const def=document.getElementById('toc_def_'+safeEn)?.value?.trim()||w.def||'';
    if(def){saveWordToBank({en:w.en,zh:zh||'(待补充)',def,phonetic,pos});imported++;}
  });
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

// Fuzzy match a word against DICTIONARY (edit distance ≤ 2)
function _fuzzyDictMatch(w){
  const lw=w.toLowerCase();
  // Exact match
  if(_dictMap[lw]) return {match:_dictMap[lw], distance:0, corrected:lw};
  // Fuzzy search: only check entries with similar length and first char
  let best=null, bestDist=99;
  for(const [key,d] of _dictEntries){
    if(Math.abs(key.length-lw.length)>2) continue;
    if(key[0]!==lw[0]) continue;
    const dist=_lev(lw,key);
    if(dist<bestDist){bestDist=dist;best=d;}
    if(dist===0) break;
  }
  if(bestDist<=2&&best) return {match:best, distance:bestDist, corrected:best.en.toLowerCase()};
  return {match:null, distance:99, corrected:lw};
}

// Common OCR error patterns for auto-correction
const _OCR_FIXES={
  'oclock':"o'clock",'ted':'ten','vear':'wear','sed':'bed','iazy':'lazy',
  'reeze':'freeze','lood':'flood','iow':'low','tshirt':'T-shirt','fatherof':'father of',
  'comer':'corner','pround':'pound','ofif':'off',
};

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

export default genTextbookDB;
