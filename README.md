<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=230&section=header&text=ايف%20|%20Eva%20Bot&fontSize=52&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=✨%20بوت%20ماسنجر%20فاخر%20بتطوير%20ماهر%20البوت%20ايف%20✨&descAlignY=60&descSize=17" alt="banner">

<br>

<img src="https://i.imgur.com/K9zeRpi.jpeg" alt="Bot Picture" width="180" style="border-radius:50%">

<br><br>

<img src="https://readme-typing-svg.demolab.com?font=Cairo&weight=700&size=22&pause=1000&color=F7C948&center=true&vCenter=true&width=600&lines=مرحباً+بك+في+عالم+ايف+👑;تحميل+الوسائط+•+إدارة+المجموعات+•+أوامر+مخصصة;المطور:+ماهر+البوت+ايف+(Eva)" alt="Typing SVG">

<br>



![Node](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)




![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)




![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)




![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)




![License](https://img.shields.io/badge/License-MIT-gold?style=for-the-badge)




![Build](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)



</div>

---

<h1 align="center">👑 ايف | Eva - بوت شات ماسنجر 👑</h1>

<p align="center">
  <b>بوت قوي للـ Facebook Messenger مع أوامر لتحميل الوسائط، متابعة زمن التشغيل، والمزيد.</b><br>
  مصمم ليكون سهل الاستخدام، فخم الأداء، وقابل للتخصيص بالكامل.
</p>

---

## 🌟 نظرة عامة

**ايف (Eva)** هو بوت مفتوح المصدر لتعزيز مجموعات ماسنجر بمزايا احترافية:

| الميزة | الوصف |
|:------:|:------|
| 📥 **تحميل الفيديوهات** | فيسبوك، إنستغرام، تيك توك، يوتيوب |
| ⏱️ **زمن التشغيل** | متابعة حالة البوت لحظة بلحظة |
| 👋 **رسائل الوداع** | رسائل وداع مخصصة للأعضاء |
| 🛡️ **نظام الإشراف** | أوامر خاصة بالمشرفين ومشرفي المجموعات |
| 🖥️ **لوحة تحكم** | واجهة ويب لإدارة البوت |

---

## 🛠️ التقنيات المستخدمة



![Tech Stack](https://skillicons.dev/icons?i=nodejs,js,html,css,express,mongodb,git)



- **Node.js**: بيئة تشغيل البوت
- **JavaScript**: لغة البرمجة الأساسية
- **HTML/CSS**: لواجهة الويب
- **Axios**: لطلبات HTTP إلى APIs
- **Express**: إطار عمل السيرفر
- **MongoDB**: لتخزين البيانات
- **Git**: للتحكم بالإصدارات

---

## 🚀 التثبيت

### 📋 المتطلبات المسبقة

- Node.js (الإصدار 18 أو أعلى)
- npm (مرفق مع Node.js)
- Git
- حساب فيسبوك لتصدير app state
- اتصال بالإنترنت

### ⚙️ خطوات التثبيت

**1️⃣ استنساخ المستودع**

```bash
git clone https://github.com/1dev-hridoy/Kenji-Cloud.git
cd Kenji-Cloud
```

**2️⃣ تثبيت التبعيات**

```bash
npm install
```

**3️⃣ إعداد ملف البيئة**

عدّل ملف `config/config.json` ليصبح كالتالي:

```json
{
  "botName": "ايف",
  "prefix": "!",
  "botpicture": "https://i.imgur.com/hGtGUdK.jpeg",
  "ownerName": "ماهر البوت ايف (Eva)",
  "ownerUID": "61596634585237",
  "adminUIDs": [
    "61596634585237"
  ]
}
```

استخدم امتداد **c3c utility** لتصدير حالة التطبيق **app state** وحفظها باسم `appstate.json`.

**4️⃣ إنشاء المجلدات اللازمة**

```bash
mkdir config logger/logs database database/backup temp modules/commands/nayan
```

**5️⃣ تشغيل البوت**

```bash
node .
```

- أدخل المصادقة الثنائية إذا طُلبت
- للوصول إلى لوحة التحكم: `http://localhost:3000`

**6️⃣ تجربة الأوامر**

- مثال: `!dl https://www.facebook.com/share/v/1J2zkAmJke/`
- مثال: `!uptime`

---

## 🧩 عينات الأوامر

### ✨ إنشاء أمر عادي

في `modules/commands/`، أنشئ ملف مثل `hello.js`:

```javascript
module.exports = {
  config: {
    name: 'hello',
    version: '1.0',
    author: '61596634585237',
    countDown: 5,
    prefix: true,
    adminOnly: false,
    aliases: ['hlw', 'hi'],
    description: 'يرد على رسالة hello',
    category: 'مجموعة المحادثة',
    guide: {
      ar: '{pn}hello'
    }
  },

  run: async ({ api, event }) => {
    api.sendMessage("مرحباً! 👋", event.threadID);
  }
};
```

- استخدم `!hello` لتشغيله

### 🛡️ أمر مخصص للمشرفين فقط

```javascript
module.exports = {
  config: {
    name: 'admincmd',
    version: '1.0',
    author: '61596634585237',
    countDown: 5,
    prefix: true,
    adminOnly: true,
    aliases: ['adm'],
    description: 'أمر خاص بالمشرفين',
    category: 'إدارة',
    guide: {
      ar: '{pn}admincmd'
    }
  },

  run: async ({ api, event }) => {
    api.sendMessage("هذا أمر للمشرفين فقط!", event.threadID);
  }
};
```

- لا يستطيع استخدامه إلا المشرفون

### ⚡ أمر بدون بادئة

```javascript
module.exports = {
  config: {
    name: 'noprefix',
    version: '1.0',
    author: '61596634585237',
    countDown: 5,
    prefix: false,
    adminOnly: false,
    aliases: [],
    description: 'أمر بدون بادئة',
    category: 'مجموعة المحادثة',
    guide: {
      ar: 'اكتب noprefix لتشغيل الأمر'
    }
  },

  run: async ({ api, event }) => {
    if (event.body.toLowerCase() === "noprefix") {
      api.sendMessage("تم تنفيذ الأمر بدون بادئة! 😄", event.threadID);
    }
  }
};
```

- ببساطة اكتب `noprefix`

### 👥 أمر لمشرفي المجموعة فقط

```javascript
module.exports.config = {
  name: "groupadmin",
  version: "1.0",
  author: "61596634585237",
  countDown: 5,
  prefix: true,
  groupAdminOnly: true,
  description: "أمر خاص بمشرفي المجموعة.",
  category: "إدارة"
};

module.exports.run = async ({ api, event }) => {
  api.sendMessage("هذا الأمر يظهر لمشرفي المجموعة فقط!", event.threadID);
};
```

- يُشغَّل بـ `!groupadmin`

---

## 👨‍💻 المطور

<div align="center">

<img src="https://i.imgur.com/K9zeRpi.jpeg" alt="Developer" width="150" style="border-radius:50%">

### 👑 ماهر البوت ايف | Eva 👑

`ID: 61596634585237`

[

![Facebook](https://img.shields.io/badge/Facebook-حساب%20المطور-1877F2?style=for-the-badge&logo=facebook&logoColor=white)

](https://www.facebook.com/profile.php?id=61596634585237)

</div>

---

## 🤝 المساهمة

يمكنك عمل **Fork** للمستودع، وإجراء التعديلات، وإرسال **Pull Request**. جميع المساهمات مرحب بها!

## 📜 الرخصة

MIT License

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=120&section=footer" alt="footer">

**صُنع بـ ❤️ بواسطة ماهر البوت ايف (Eva)**

</div>
