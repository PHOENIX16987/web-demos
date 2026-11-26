/* 栖木咖啡 · AI 客服演示（本地知识库匹配版，无需服务器） */
(function () {
  var KB = [
    { id: 'hours', k: ['营业', '几点', '开门', '关门', '时间', '周末', '今天开', '休息', '打烊'],
      a: '我们的营业时间是：\n· 周一至周五 08:00 – 21:00\n· 周末 09:00 – 22:00\n节假日正常营业，有调整会提前在门口和公众号通知～' },
    { id: 'addr', k: ['地址', '在哪', '怎么走', '位置', '地铁', '停车', '找到', '导航'],
      a: '我们在 示例市 梧桐路 18 号 1 楼 📍\n地铁 2 号线「梧桐路站」B 口出来步行约 3 分钟。附近有路边停车位，周末比较紧张，建议坐地铁过来～' },
    { id: 'menu', k: ['菜单', '有什么', '价格', '多少钱', '价目', '咖啡有'],
      a: '本季菜单大致是：\n· 意式：美式 ¥22、拿铁 ¥28、澳白 ¥30、脏脏 ¥32\n· 手冲：¥30 – ¥36（耶加雪菲、慧兰、云南保山）\n· 冷萃 ¥28\n· 季节特调：桂花燕麦拿铁 ¥34、烤栗子拿铁 ¥36\n完整菜单可以在页面上「本季菜单」里看到～' },
    { id: 'rec', k: ['推荐', '招牌', '好喝', '第一次', '必点', '喝哪个', '选什么', '喝什么', '点什么'],
      a: '第一次来的话推荐这几款 ☕\n· 招牌「脏脏」：冰牛奶 + 热浓缩，口感层次很明显\n· 秋季新品「桂花燕麦拿铁」：微甜，不爱苦的朋友也能接受\n· 想喝黑咖啡的话，手冲「耶加雪菲」有花香和柑橘味～' },
    { id: 'milk', k: ['燕麦', '换奶', '乳糖', '植物奶', '豆奶', '低脂', '无糖', '少糖', '甜度'],
      a: '可以的！所有奶咖都能换燕麦奶（+¥4）。甜度可以选：无糖 / 少糖 / 标准。乳糖不耐的朋友推荐燕麦奶～' },
    { id: 'decaf', k: ['低因', '无咖啡因', '孕妇', '睡不着', '不含咖啡', '晚上喝'],
      a: '我们有低因咖啡豆，意式饮品都可以换低因（+¥3）。不想喝咖啡的话，也有热可可和水果茶哦～' },
    { id: 'wifi', k: ['wifi', 'wi-fi', '无线', '网络', '密码', '插座', '充电', '办公', '电脑', '学习', '久坐'],
      a: '店里有免费 Wi-Fi，名称和密码贴在每张桌子上 📶 每个座位都有插座，欢迎带电脑来办公或学习，不限时～' },
    { id: 'pet', k: ['宠物', '狗', '猫', '带狗', '带猫'],
      a: '我们是宠物友好店 🐶 可以带毛孩子坐户外区，店员可以提供饮用水。室内区域暂时不能进宠物，请理解～' },
    { id: 'book', k: ['预约', '预订', '订位', '包场', '聚会', '活动', '多人', '团建'],
      a: '日常不用订位，到店直接坐就好。如果是 8 人以上聚会或者想包场办活动，可以提前 3 天联系店长，我帮你转给人工客服～' },
    { id: 'deliv', k: ['外卖', '配送', '送到', '美团', '饿了么', '打包', '带走', '自提'],
      a: '支持外带打包，也可以在外卖平台搜索「栖木咖啡」下单（配送范围约 3 公里）。外带自备杯可以减 ¥2 ～' },
    { id: 'pay', k: ['支付', '付款', '刷卡', '微信', '支付宝', '会员', '储值', '优惠', '折扣', '积分'],
      a: '支持微信、支付宝和刷卡。会员储值 300 送 30，每次消费都能积分。新会员首单第二杯半价～' },
    { id: 'bean', k: ['咖啡豆', '买豆', '豆子', '磨粉', '挂耳', '送人', '礼盒'],
      a: '店里有自家烘焙的咖啡豆（200g ¥68 起）和挂耳礼盒，可以免费帮你研磨成适合手冲或摩卡壶的粉。豆子都是一周内新烘的～' },
    { id: 'dessert', k: ['甜点', '蛋糕', '吃的', '饿', '早餐', '可颂', '司康', '肉桂'],
      a: '甜点有：巴斯克芝士蛋糕 ¥32（每日限量 12 份）、肉桂卷 ¥22、司康 ¥18、可颂 ¥16。早上 10 点前来，可颂是刚出炉的 🥐' },
    { id: 'human', k: ['人工', '真人', '店长', '投诉', '电话', '联系'],
      a: '好的，已帮你记录，人工客服会尽快回复你 🙋 也可以直接打店里电话（示例号码）。' },
    { id: 'hi', k: ['你好', '您好', '在吗', 'hi', 'hello', '哈喽', '嗨'],
      a: '你好呀～我是栖木咖啡的 AI 店员小栖 ☕ 营业时间、菜单、地址、能不能带宠物……都可以问我！' },
    { id: 'thx', k: ['谢谢', '感谢', '好的', '明白', '知道了', 'ok'],
      a: '不客气～期待在店里见到你 ☕' }
  ];
  var FALLBACK = '这个问题我还不太确定 🤔 我先帮你记下来，转给人工客服回复。\n你也可以试试问我：营业时间、地址、推荐喝什么、能不能带宠物。';
  var QUICK = ['几点营业？', '店在哪里？', '推荐喝什么？', '可以带狗吗？', '能换燕麦奶吗？'];

  function answer(q) {
    var s = q.toLowerCase().replace(/\s+/g, '');
    var best = null, score = 0;
    KB.forEach(function (it) {
      var sc = 0;
      it.k.forEach(function (w) { if (s.indexOf(w) !== -1) sc += w.length; });
      if (sc > score) { score = sc; best = it; }
    });
    return best ? best.a : FALLBACK;
  }

  var css = '' +
    '.qb-btn{position:fixed;right:20px;bottom:20px;z-index:50;width:60px;height:60px;border-radius:50%;border:0;cursor:pointer;background:#7b4a2a;color:#fff;box-shadow:0 10px 24px rgba(60,30,10,.3);display:grid;place-items:center;transition:transform .2s}' +
    '.qb-btn:hover{transform:scale(1.06)}' +
    '.qb-tip{position:fixed;right:90px;bottom:34px;z-index:50;background:#fff;color:#2b211b;font-size:13px;padding:8px 12px;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,.1);white-space:nowrap}' +
    '.qb-panel{position:fixed;right:20px;bottom:92px;z-index:51;width:360px;height:540px;max-height:calc(100vh - 120px);background:#fffaf3;border:1px solid #e6d9c9;border-radius:20px;box-shadow:0 20px 50px rgba(60,30,10,.22);display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(16px) scale(.98);pointer-events:none;transition:.22s}' +
    '.qb-panel.open{opacity:1;transform:none;pointer-events:auto}' +
    '.qb-head{background:#2b211b;color:#f5ede4;padding:14px 16px;display:flex;align-items:center;gap:10px}' +
    '.qb-av{width:36px;height:36px;border-radius:50%;background:#c98b52;display:grid;place-items:center;font-size:18px;flex:none}' +
    '.qb-head b{display:block;font-size:15px}.qb-head small{font-size:12px;color:#bfae9c}' +
    '.qb-head small i{display:inline-block;width:7px;height:7px;border-radius:50%;background:#7bd389;margin-right:5px;vertical-align:1px}' +
    '.qb-x{margin-left:auto;background:none;border:0;color:#f5ede4;font-size:22px;cursor:pointer;line-height:1;padding:4px}' +
    '.qb-body{flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:10px}' +
    '.qb-m{max-width:84%;padding:10px 13px;border-radius:16px;font-size:14.5px;line-height:1.6;white-space:pre-line;word-break:break-word}' +
    '.qb-m.bot{background:#fff;border:1px solid #eee2d3;border-bottom-left-radius:4px;align-self:flex-start;color:#2b211b}' +
    '.qb-m.me{background:#7b4a2a;color:#fff;border-bottom-right-radius:4px;align-self:flex-end}' +
    '.qb-typing{display:inline-flex;gap:4px}.qb-typing span{width:6px;height:6px;border-radius:50%;background:#c9b6a3;animation:qbd 1s infinite}' +
    '.qb-typing span:nth-child(2){animation-delay:.15s}.qb-typing span:nth-child(3){animation-delay:.3s}' +
    '@keyframes qbd{0%,60%,100%{opacity:.3;transform:none}30%{opacity:1;transform:translateY(-3px)}}' +
    '.qb-quick{display:flex;gap:6px;overflow-x:auto;padding:8px 12px 0;scrollbar-width:none}.qb-quick::-webkit-scrollbar{display:none}' +
    '.qb-quick button{flex:none;font:inherit;font-size:12.5px;border:1px solid #e0cdb8;background:#fff;color:#7b4a2a;border-radius:99px;padding:5px 11px;cursor:pointer}' +
    '.qb-foot{display:flex;gap:8px;padding:10px 12px 12px}' +
    '.qb-foot input{flex:1;min-width:0;font:inherit;font-size:15px;border:1.5px solid #e6d9c9;border-radius:12px;padding:10px 12px;background:#fff;color:#2b211b}' +
    '.qb-foot input:focus{outline:none;border-color:#7b4a2a}' +
    '.qb-foot button{border:0;background:#7b4a2a;color:#fff;border-radius:12px;padding:0 16px;font:inherit;font-weight:600;cursor:pointer}' +
    '.qb-note{text-align:center;font-size:11px;color:#a8988a;padding:0 12px 10px}' +
    '@media (max-width:480px){.qb-panel{right:0;left:0;bottom:0;width:auto;height:min(85vh,620px);max-height:none;border-radius:20px 20px 0 0}.qb-tip{display:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var wrap = document.createElement('div');
  wrap.innerHTML =
    '<div class="qb-tip" id="qbTip">有问题问 AI 店员 👋</div>' +
    '<button class="qb-btn" id="qbBtn" aria-label="打开在线客服"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.4A8 8 0 1 1 21 12z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/></svg></button>' +
    '<div class="qb-panel" id="qbPanel" role="dialog" aria-label="AI 客服">' +
      '<div class="qb-head"><div class="qb-av">☕</div><div><b>小栖 · AI 店员</b><small><i></i>在线，平均 1 秒回复</small></div><button class="qb-x" id="qbX" aria-label="关闭">×</button></div>' +
      '<div class="qb-body" id="qbBody"></div>' +
      '<div class="qb-quick" id="qbQuick"></div>' +
      '<form class="qb-foot" id="qbForm"><input id="qbIn" placeholder="输入问题，比如：几点关门？" autocomplete="off" maxlength="100"><button type="submit">发送</button></form>' +
      '<div class="qb-note">演示版 · 回答来自店铺知识库，实际交付可接入大模型</div>' +
    '</div>';
  document.body.appendChild(wrap);

  var panel = document.getElementById('qbPanel'), body = document.getElementById('qbBody'),
      input = document.getElementById('qbIn'), tip = document.getElementById('qbTip'), greeted = false;

  function add(text, who) {
    var m = document.createElement('div'); m.className = 'qb-m ' + who; m.textContent = text;
    body.appendChild(m); body.scrollTop = body.scrollHeight; return m;
  }
  function reply(q) {
    var t = document.createElement('div'); t.className = 'qb-m bot';
    t.innerHTML = '<span class="qb-typing"><span></span><span></span><span></span></span>';
    body.appendChild(t); body.scrollTop = body.scrollHeight;
    setTimeout(function () { t.remove(); add(answer(q), 'bot'); }, 550 + Math.random() * 400);
  }
  function ask(q) { q = q.trim(); if (!q) return; add(q, 'me'); reply(q); }
  function open() {
    panel.classList.add('open'); tip.style.display = 'none';
    if (!greeted) { greeted = true; add('你好呀～我是栖木咖啡的 AI 店员小栖 ☕\n营业时间、菜单、地址、能不能带宠物……都可以问我！', 'bot'); }
    setTimeout(function () { if (window.innerWidth > 480) input.focus(); }, 250);
  }
  QUICK.forEach(function (q) {
    var b = document.createElement('button'); b.type = 'button'; b.textContent = q;
    b.onclick = function () { ask(q); }; document.getElementById('qbQuick').appendChild(b);
  });
  document.getElementById('qbBtn').onclick = function () { panel.classList.contains('open') ? panel.classList.remove('open') : open(); };
  document.getElementById('qbX').onclick = function () { panel.classList.remove('open'); };
  document.getElementById('qbForm').onsubmit = function (e) { e.preventDefault(); ask(input.value); input.value = ''; };
  if (/[?&]chat=(1|demo)/.test(location.search)) open();
  if (/[?&]chat=demo/.test(location.search)) {
    ['推荐喝什么？', '可以带狗吗？'].forEach(function (q, i) { setTimeout(function () { ask(q); }, 300 + i * 1300); });
  }
  window.qbAnswer = answer;
})();
