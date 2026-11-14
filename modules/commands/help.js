const fs = require('fs');
const path = require('path');
const moment = require("moment-timezone");

const configPath = path.join(__dirname, '..', '..', 'config', 'config.json');
const commandsPath = path.join(__dirname, '..', 'commands');

function readDB(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

// دالة لتحويل الرقم العادي إلى رقم مزخرف دائري
function getFancyNumber(num) {
    const fancyNums = ["⓪", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫", "⑬", "⑭", "⑮", "⑯", "⑰", "⑱", "⑲", "⑳"];
    return fancyNums[num] || num.toString();
}

module.exports = {
    config: {
        name: 'اوامر',
        aliases: ['menu', 'help', 'الأوامر'],
        version: '9.2.0',
        author: 'سينكو',
        countDown: 5,
        prefix: true,
        category: 'المجموعة'
    },

    onStart: async ({ api, event, args }) => {
        const config = readDB(configPath);
        const { threadID, messageID, senderID } = event;
        const input = args[0];

        // --- جلب الأوامر ---
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        const commands = {};

        for (const file of commandFiles) {
            try {
                const command = require(path.join(commandsPath, file));
                if (command.config) {
                    commands[command.config.name.toLowerCase()] = command.config;
                }
            } catch (e) {}
        }

        const uniqueCommands = Object.values(commands).filter((cmd, index, self) =>
            self.findIndex(c => c.name === cmd.name) === index
        );

        // --- عرض تفاصيل أمر محدد إذا كتبه المستخدم ---
        if (input && isNaN(input)) {
            const cmd = commands[input.toLowerCase()];
            if (!cmd) return api.sendMessage(`❌ لم يتم العثور على الأمر "${input}"`, threadID, messageID);

            let detailMsg = ``;
            detailMsg += `╮────∙⋆⋅「 تفاصيل 」⋅⋆∙────╭\n`;
            detailMsg += `│\n`;
            detailMsg += `│  ◈ الاســم : ${cmd.name}\n`;
            detailMsg += `│  ◈ الوصــف : ${cmd.description || 'لا يوجد وصف'}\n`;
            detailMsg += `│  ◈ الـإصـدار : ${cmd.version || '1.0.0'}\n`;
            if (cmd.guide || cmd.syntax) {
                detailMsg += `│  ◈ الاستخدام : ${cmd.syntax || `${cmd.name} ${args[0]}`}\n`;
            }
            detailMsg += `│  ◈ الـمـدة : ${cmd.countDown || 5} ثوانٍ\n`;
            detailMsg += `│\n`;
            detailMsg += `╯───────∙⋆⋅ ※ ⋅⋆∙───────╰`;
            
            return api.sendMessage(detailMsg, threadID, messageID);
        }

        // --- توزيع الفئات ---
        const categories = {};
        const categoryMap = {
            'group': 'المجموعة', 'image': 'الصور', 'media': 'الوسائط',
            'admin': 'الإدارة', 'fun': 'الترفيه', 'random': 'عشوائي',
            'music': 'الموسيقى', 'video': 'الفيديو', 'ai': 'الذكاء الاصطناعي',
            'tools': 'الأدوات', 'utility': 'الخدمات السريعة', 'owner': 'المطور'
        };

        for (const cmd of uniqueCommands) {
            let category = cmd.category || 'الترفيه';
            category = categoryMap[category.toLowerCase()] || category;
            if (!categories[category]) categories[category] = [];
            categories[category].push(cmd.name);
        }

        const adminList = config.adminUIDs || [];
        const orderedCats = ['المجموعة', 'الصور', 'الوسائط', 'الذكاء الاصطناعي', 'الترفيه', 'المطور', 'الأدوات'].filter(cat => {
            if (cat === 'المطور' && !adminList.includes(senderID)) return false;
            return categories[cat] && categories[cat].length > 0;
        });

        // --- بناء رسالة قائمة الفئات الرئيسية بدون ذكر عدد الأوامر بجانب الفئة ---
        let msg = ``;
        msg += `╮───────∙⋆⋅ ※ ⋅⋆∙───────╭\n`; 
        msg += `    قـــائــمــة فـــئـــات الــأوامـــر\n`; 
        msg += `╯───────∙⋆⋅ ※ ⋅⋆∙───────╰\n\n`; 

        msg += `╮────∙⋆⋅「 الفئات المتاحة 」\n`;
        orderedCats.forEach((cat, index) => {
            const numSymbol = getFancyNumber(index + 1);
            msg += `│ › [ ${numSymbol} ] ⟜ ${cat}\n`;
        });
        msg += `╯───────∙⋆⋅ ※ ⋅⋆∙───────◈\n\n`;

        msg += `╮───────∙⋆⋅ ※ ⋅⋆∙───────◈\n`;
        msg += `│ 💡 رد برقم الفئة لعرض أوامرها\n`;
        msg += `│ إجمالي الأوامر : ${uniqueCommands.length}\n`;
        msg += `│ الــبــوت : ✔️┇ 𝐄⃪𝐕⃪𝐄⃪ 𖥻 𝗘⃪̺͆𝘃⃪͜͟͡.∆ ✎\n`;
        msg += `╯───────∙⋆⋅ ※ ⋅⋆∙───────◈`;

        return api.sendMessage(msg, threadID, (err, info) => {
            if (!err) {
                if (!global.client.handleReply) global.client.handleReply = [];
                global.client.handleReply.push({
                    name: 'اوامر',
                    messageID: info.messageID,
                    author: senderID,
                    categories,
                    orderedCats
                });
            }
        }, messageID);
    },

    onReply: async ({ api, event, handleReply }) => {
        const { threadID, messageID, body, senderID } = event;

        if (handleReply.author && senderID !== handleReply.author) return;
        if (handleReply.name !== 'اوامر') return;

        const choice = parseInt(body.trim());
        if (isNaN(choice)) return;

        const { orderedCats, categories } = handleReply;
        const index = choice - 1;

        if (index < 0 || index >= orderedCats.length) {
            return api.sendMessage("❌ رقم الفئة غير صحيح، يرجى اختيار رقم من القائمة.", threadID, messageID);
        }

        const selectedCat = orderedCats[index];
        const cmds = categories[selectedCat];

        try { api.unsendMessage(handleReply.messageID); } catch(e) {}

        let catMsg = ``;
        catMsg += `╮───────∙⋆⋅ ※ ⋅⋆∙───────╭\n`; 
        catMsg += `    أوامـــر فــئــة [ ${selectedCat} ]\n`; 
        catMsg += `╯───────∙⋆⋅ ※ ⋅⋆∙───────╰\n\n`; 

        catMsg += `╮────∙⋆⋅「 القائمة 」\n`;
        cmds.forEach((cmdName, i) => {
            const numSymbol = getFancyNumber(i + 1);
            catMsg += `│ › [ ${numSymbol} ] ⟜ ${cmdName}\n`;
        });
        catMsg += `╯───────∙⋆⋅ ※ ⋅⋆∙───────◈\n\n`;

        catMsg += `╮───────∙⋆⋅ ※ ⋅⋆∙───────◈\n`;
        catMsg += `│ اسـتـخــدم : اوامر [اسم الامر] للتفاصيل\n`;
        catMsg += `│ الــبــوت :  𝐄⃪𝐕⃪𝐄⃪ .∆ \n`;
        catMsg += `╯───────∙⋆⋅ ※ ⋅⋆∙───────◈`;

        return api.sendMessage(catMsg, threadID, messageID);
    }
};
