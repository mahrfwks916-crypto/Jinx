const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', '..', 'config', 'config.json');
const commandsPath = path.join(__dirname, '..', 'commands');

const BOT_NAME = 'EVE • ايـف';
const BOT_VERSION = 'v2.5';
const LINE = '──────────────────';

const CATEGORIES = [
  'المجموعة', 'الإدارة', 'الذكاء الاصطناعي', 'الوسائط', 'الموسيقى',
  'الألعاب', 'الترفيه', 'الخدمات السريعة', 'الأدوات', 'المطور'
];

// توحيد أسماء الفئات المبعثرة في الأوامر
const CATEGORY_MAP = {
  'group': 'المجموعة', 'المجموعة': 'المجموعة',
  'admin': 'الإدارة', 'الإدارة': 'الإدارة', 'system': 'الإدارة',
  'ai': 'الذكاء الاصطناعي', 'الذكاء الاصطناعي': 'الذكاء الاصطناعي',
  'media': 'الوسائط', 'image': 'الوسائط', 'video': 'الوسائط', 'الوسائط': 'الوسائط', 'الوسئط': 'الوسائط',
  'music': 'الموسيقى', 'الموسيقى': 'الموسيقى',
  'game': 'الألعاب', 'games': 'الألعاب', 'لعب': 'الألعاب', 'العاب': 'الألعاب', 'الألعاب': 'الألعاب', 'اللعب': 'الألعاب',
  'fun': 'الترفيه', 'مرح': 'الترفيه', 'random': 'الترفيه', 'الترفيه': 'الترفيه',
  'utility': 'الخدمات السريعة', 'الخدمات': 'الخدمات السريعة', 'الخدمات السريعة': 'الخدمات السريعة',
  'tools': 'الأدوات', 'الأدوات': 'الأدوات',
  'owner': 'المطور', 'ownr': 'المطور', 'المطور': 'المطور'
};

const FANCY = ['⓪','①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','⑪','⑫','⑬','⑭','⑮','⑯','⑰','⑱','⑲','⑳'];
const fancy = (n) => FANCY[n] || `${n}.`;

function readConfig() {
  try { return JSON.parse(fs.readFileSync(configPath, 'utf8')); }
  catch (e) { return {}; }
}

function loadCommands() {
  const list = [];
  const seen = new Set();
  for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
    try {
      const cmd = require(path.join(commandsPath, file));
      if (!cmd.config || !cmd.config.name || seen.has(cmd.config.name)) continue;
      seen.add(cmd.config.name);
      const raw = String(cmd.config.category || 'الترفيه').trim();
      const category = CATEGORY_MAP[raw.toLowerCase()] || CATEGORY_MAP[raw] || 'الترفيه';
      list.push({ ...cmd.config, category });
    } catch (e) {}
  }
  return list;
}

module.exports = {
  config: {
    name: 'اوامر',
    aliases: ['menu', 'help', 'الأوامر'],
    version: '10.0.0',
    author: 'MAHER',
    countDown: 5,
    prefix: true,
    description: 'عرض قائمة الأوامر وفئاتها',
    category: 'المجموعة'
  },

  onStart: async ({ api, event, args }) => {
    const { threadID, messageID, senderID } = event;
    const config = readConfig();
    const commands = loadCommands();

    // ─── تفاصيل أمر معيّن ───
    const input = args.join(' ').trim();
    if (input && isNaN(input)) {
      const key = input.toLowerCase();
      const cmd = commands.find(c =>
        c.name.toLowerCase() === key ||
        (c.aliases || []).some(a => a.toLowerCase() === key)
      );
      if (!cmd) return api.sendMessage(`❌ لم يتم العثور على الأمر "${input}"`, threadID, messageID);

      let d = '';
      d += `╔══════════════════╗\n`;
      d += `   ✦  تـفـاصـيـل الأمـر  ✦\n`;
      d += `╚══════════════════╝\n\n`;
      d += `▸ الاسم : ${cmd.name}\n`;
      d += `▸ الفئة : ${cmd.category}\n`;
      d += `▸ الوصف : ${cmd.description || 'لا يوجد وصف'}\n`;
      if (cmd.aliases && cmd.aliases.length) d += `▸ الاختصارات : ${cmd.aliases.join(' ، ')}\n`;
      if (cmd.syntax || cmd.guide) d += `▸ الاستخدام : ${cmd.syntax || cmd.guide}\n`;
      d += `▸ الانتظار : ${cmd.countDown || 5} ثوانٍ\n`;
      d += `▸ الإصدار : ${cmd.version || '1.0.0'}\n`;
      d += `${LINE}`;
      return api.sendMessage(d, threadID, messageID);
    }

    // ─── القائمة الرئيسية ───
    const owner = String(config.ownerName || 'MAHER').toUpperCase();
    const ownerLink = config.ownerUID
      ? `https://www.facebook.com/profile.php?id=${config.ownerUID}`
      : '';

    let msg = '';
    msg += `╔══════════════════╗\n`;
    msg += `   ✦  ${BOT_NAME}  ${BOT_VERSION}  ✦\n`;
    msg += `   قـائـمـة الأوامـر\n`;
    msg += `╚══════════════════╝\n\n`;
    msg += `▸ الفئات المتاحة\n`;
    CATEGORIES.forEach((cat, i) => { msg += `  ${fancy(i + 1)}  ${cat}\n`; });
    msg += `\n${LINE}\n`;
    msg += `💡 رد برقم الفئة لعرض أوامرها\n`;
    msg += `🔎 اوامر [اسم الأمر] لعرض التفاصيل\n`;
    msg += `📦 إجمالي الأوامر : ${commands.length}\n`;
    msg += `${LINE}\n`;
    msg += `🤖 BOT : EVE  •  ${BOT_VERSION}\n`;
    msg += `👑 المطور : ${owner}\n`;
    msg += `   🤲 اللهم اجعله من المحسنين وارزقه الجنة بغير حساب\n`;
    if (ownerLink) msg += `🔗 ${ownerLink}`;

    return api.sendMessage(msg, threadID, (err, info) => {
      if (err || !info) return;
      if (!global.client.handleReply) global.client.handleReply = [];
      global.client.handleReply.push({
        name: 'اوامر',
        messageID: info.messageID,
        author: senderID
      });
    }, messageID);
  },

  onReply: async ({ api, event, handleReply }) => {
    const { threadID, messageID, body, senderID } = event;
    if (handleReply.name !== 'اوامر') return;
    if (handleReply.author && senderID !== handleReply.author) return;

    const choice = parseInt(String(body).trim());
    if (isNaN(choice)) return;
    if (choice < 1 || choice > CATEGORIES.length) {
      return api.sendMessage(`❌ اختر رقماً من 1 إلى ${CATEGORIES.length}`, threadID, messageID);
    }

    const catName = CATEGORIES[choice - 1];
    const config = readConfig();

    if (catName === 'المطور' && !(config.adminUIDs || []).includes(String(senderID))) {
      return api.sendMessage('⛔ هذه الفئة للمطور والأدمن فقط.', threadID, messageID);
    }

    const cmds = loadCommands().filter(c => c.category === catName);
    try { api.unsendMessage(handleReply.messageID); } catch (e) {}

    let m = '';
    m += `╔══════════════════╗\n`;
    m += `   ✦  ${catName}  ✦\n`;
    m += `   عـدد الأوامـر : ${cmds.length}\n`;
    m += `╚══════════════════╝\n\n`;
    if (!cmds.length) {
      m += `  🚧 لا توجد أوامر في هذه الفئة بعد\n`;
    } else {
      cmds.forEach((c, i) => { m += `  ${fancy(i + 1)}  ${c.name}\n`; });
    }
    m += `\n${LINE}\n`;
    m += `🔎 اوامر [اسم الأمر] لعرض التفاصيل\n`;
    m += `🤖 BOT : EVE  •  ${BOT_VERSION}`;

    return api.sendMessage(m, threadID, messageID);
  }
};
