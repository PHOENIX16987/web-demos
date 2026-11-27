/* 演示数据生成器：生成「订单明细」+「商品表」，看板页和示例 Excel 共用同一份，保证导入示例后数字一致。 */
(function (root) {
  function make() {
    var seed = 20261127;
    function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
    function pick(ws) { var t = 0, i; for (i = 0; i < ws.length; i++) t += ws[i]; var r = rnd() * t; for (i = 0; i < ws.length; i++) { r -= ws[i]; if (r <= 0) return i; } return ws.length - 1; }
    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    var products = [
      // 商品, 分类, 单价, 成本, 库存, 人气, 近7天趋势
      ['巴斯克芝士蛋糕', '蛋糕', 32, 12.2, 18, 1.6, 0.06],
      ['海盐卷', '面包', 12, 5.0, 64, 2.4, 0.12],
      ['肉桂卷', '面包', 18, 7.2, 40, 1.5, -0.04],
      ['可颂', '面包', 14, 6.3, 8, 1.9, 0.02],
      ['草莓奶油蛋糕', '蛋糕', 36, 15.5, 22, 1.1, -0.09],
      ['全麦吐司', '面包', 22, 10.6, 35, 0.8, -0.02],
      ['美式咖啡', '饮品', 18, 4.7, null, 2.6, 0.03],
      ['拿铁', '饮品', 24, 7.2, null, 2.2, 0.05],
      ['抹茶千层', '蛋糕', 34, 13.9, 12, 0.9, 0.22],
      ['蛋挞', '小点', 8, 3.5, 90, 2.0, 0.01],
      ['司康', '小点', 12, 4.7, 6, 0.7, -0.11],
      ['碱水结', '面包', 10, 4.3, 48, 0.45, -0.26]
    ];
    var channels = ['门店', '外卖', '小程序'], chW = [0.55, 0.3, 0.15];
    var hourW = []; for (var h = 8; h <= 21; h++) hourW.push(6 + 26 * Math.exp(-Math.pow(h - 9, 2) / 2) + 22 * Math.exp(-Math.pow(h - 15.5, 2) / 3) + 14 * Math.exp(-Math.pow(h - 19, 2) / 2));
    var memberW = []; for (var m = 0; m < 5000; m++) memberW.push(1 / (1 + m * 0.004));

    var DAYS = 60, end = new Date(2026, 10, 27), rows = [], oid = 1;
    for (var di = 0; di < DAYS; di++) {
      var d = new Date(end); d.setDate(end.getDate() - (DAYS - 1 - di));
      var wk = d.getDay(), weekend = wk === 0 || wk === 6, recent = di >= DAYS - 7, isToday = di === DAYS - 1;
      var n = Math.round((118 + di * 0.5) * (weekend ? 1.32 : 1) * (0.84 + rnd() * 0.3));
      var pw = products.map(function (p) { return p[5] * (recent ? 1 + p[6] : 1); });
      var ds = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
      for (var k = 0; k < n; k++) {
        var hour = 8 + pick(hourW), minute = Math.floor(rnd() * 60);
        var ch = channels[pick(chW)];
        var member = rnd() < 0.62 ? 'M' + (1000 + pick(memberW)) : '';
        var refund = rnd() < (isToday ? (ch === '外卖' ? 0.11 : 0.01) : 0.009);
        var lines = rnd() < 0.42 ? 2 : 1, used = {};
        for (var l = 0; l < lines; l++) {
          var pi = pick(pw); if (used[pi]) continue; used[pi] = 1;
          var p = products[pi], qty = rnd() < 0.78 ? 1 : (rnd() < 0.8 ? 2 : 3);
          var amt = qty * p[2] * (ch === '小程序' ? 0.95 : 1);
          rows.push({ 日期: ds + ' ' + pad(hour) + ':' + pad(minute), 订单号: 'D' + (100000 + oid), 渠道: ch, 商品: p[0], 分类: p[1], 数量: qty, 金额: Math.round(amt * 100) / 100, 是否退款: refund ? '是' : '否', 会员号: member });
        }
        oid++;
      }
    }
    var prodSheet = products.map(function (p) { return { 商品: p[0], 分类: p[1], 单价: p[2], 成本: p[3], 库存: p[4] == null ? '' : p[4] }; });
    return { rows: rows, products: prodSheet };
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = make;
  else root.makeDemoData = make;
})(this);
