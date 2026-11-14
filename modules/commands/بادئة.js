const { Threads } = require('../../database/database');

module.exports = {
  config: {
    name: 'بادئة',
    version: '1.3',
    author: 'سينكو',
    countDown: 5,
    prefix: true,
    groupAdminOnly: true,
    description: 'يضبط بادئة المجموعة ويغير كنية البوت تلقائياً بصمت.',
    category: 'group',
    guide: {
      ar: '{pn} [البادئة_الجديدة] أو اتركها فارغة للعمل بدون بادئة'
    },
  },

  onStart: async ({ api, event, args }) => {
    try {
      const { threadID, messageID, senderID, isGroup } = event;
      
      // التحقق أولاً إذا كان الأمر مستخدم داخل مجموعة
      if (!isGroup) {
        return api.sendMessage("❌ هذا الأمر يمكن استخدامه داخل المجموعات فقط.", threadID, messageID);
      }

      // جلب معلومات المجموعة للتحقق من المشرفين
      const threadInfo = await api.getThreadInfo(threadID);
      const adminIDs = threadInfo.adminIDs.map(admin => admin.id);

      // التحقق إذا كان المرسل هو أحد المشرفين
      if (!adminIDs.includes(senderID)) {
        return api.sendMessage(
          "●───── ✾ ⌬ ✾ ─────●\n" +
          "✾ ┇ ❌ عذراً! هذا الأمر متاح لمشرفي المجموعة فقط 🙅‍♂️\n" +
          "●───── ✾ ⌬ ✾ ─────●", 
          threadID, messageID
        );
      }

      const botID = api.getCurrentUserID();
      let newPrefix = args[0] || '';

      const threadData = Threads.get(threadID);
      if (!threadData) return;

      // تحديث البادئة في قاعدة البيانات
      threadData.settings.prefix = newPrefix;
      Threads.set(threadID, threadData);

      // --- تغيير كنية البوت ---
      const botName = "✔️┇ 𝐄⃪𝐕⃪𝐄⃪ 𖥻 𝗘⃪̺͆𝘃⃪͜͟͡.∆ ✎"; 
      const newNickname = newPrefix === '' ? ` ┇ ${botName}` : ` ┇  ❨${newPrefix}❩  ${botName}`;
      
      try {
        await api.changeNickname(newNickname, threadID, botID);
      } catch (e) {
        console.log("فشل تغيير الكنية بسبب نقص صلاحيات البوت كمشرف");
      }

      // التفاعل برمز الصح (✔️) على رسالة المستخدم بهدوء تام بدون إرسال أي نص
      return api.setMessageReaction("✔️", messageID, (err) => {}, true);

    } catch (error) {
      console.error("خطأ في أمر تعيين البادئة:", error);
    }
  },
};
