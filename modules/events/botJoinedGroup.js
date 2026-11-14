const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: 'botJoinedGroup',
    version: '2.8',
    author: 'ماهر',
    description: 'ترحيب انضمام البوت مع صورة وكنية احترافية.',
    eventType: ['log:subscribe'],
  },

  onStart: async ({ api, event }) => {
    try {
      const botID = api.getCurrentUserID();
      const addedParticipants = event.logMessageData?.addedParticipants || [];

      // التأكد أن البوت هو العضو الجديد
      if (!addedParticipants.some(user => user.userFbId === botID)) return;

      const prefix = global.client.config.prefix || '';

      // تغيير الكنية بالاسم والزخرفة المطلوبة
      const shortNickname = `✔️┇ 𝐄⃪𝐕⃪𝐄⃪ 𖥻 𝗘⃪̺͆𝘃⃪͜͟͡.∆ ✎`;
      api.changeNickname(shortNickname, event.threadID, botID);

      // رسالة الترحيب بنفس إطار وزخرفة الأوامر
      let welcomeMsg = ``;
      welcomeMsg += `╮───────∙⋆⋅ ※ ⋅⋆∙───────╭\n`; 
      welcomeMsg += `    مـرحـباً بـكـم فـي الـمـجـمـوعة\n`; 
      welcomeMsg += `╯───────∙⋆⋅ ※ ⋅⋆∙───────╰\n\n`; 

      welcomeMsg += `╮────∙⋆⋅「 معلومات البوت 」\n`;
      welcomeMsg += `│ › الـبـوت : ✔️┇ 𝐄⃪𝐕⃪𝐄⃪ 𖥻 𝗘⃪̺͆𝘃⃪͜͟͡.∆ ✎\n`;
      welcomeMsg += `│ › الـرّمـز : [ ${prefix} ]\n`;
      welcomeMsg += `│ › الـدّليل : [ ${prefix}اوامر ]\n`;
      welcomeMsg += `│ › الـمـطـور : مـاهـر\n`;
      welcomeMsg += `╯───────∙⋆⋅ ※ ⋅⋆∙───────◈\n\n`;

      welcomeMsg += `╮───────∙⋆⋅ ※ ⋅⋆∙───────◈\n`;
      welcomeMsg += `│ 💡 اسـتـخـدم (${prefix}اوامر) لعرض الأوامر\n`;
      welcomeMsg += `╯───────∙⋆⋅ ※ ⋅⋆∙───────◈`;

      const imgPath = __dirname + "/cache/bot_join.jpg";
      const imgUrl = "https://i.ibb.co/Gf0jJr6F/1777544849126.png";

      // تحميل الصورة وإرسالها
      const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
      await fs.outputFile(imgPath, Buffer.from(response.data, "utf-8"));

      api.sendMessage({
        body: welcomeMsg,
        attachment: fs.createReadStream(imgPath)
      }, event.threadID, () => {
        // حذف الصورة بعد الإرسال للحفاظ على مساحة التخزين
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      });

    } catch (err) {
      console.error('[ERROR]:', err);
    }
  },
};
