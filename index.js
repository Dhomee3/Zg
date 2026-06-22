const { Client } = require("discord.js-selfbot-v13");
const express = require("express");

// ========== الإعدادات ==========
const config = {
  token: process.env.DISCORD_TOKEN,

  // الستاتس: online | idle | dnd | invisible
  status: process.env.STATUS || "idle",

  // اسم السترييم (اللعبة أو البرنامج)
  streamName: process.env.STREAM_NAME || " .",

  // رابط تويتش (مطلوب للستريم)
  streamUrl: process.env.STREAM_URL || "https://www.twitch.tv/x20",

  // الوصف (السطر الأول)
  details: process.env.STREAM_DETAILS || ".",

  // الحالة (السطر الثاني)
  state: process.env.STREAM_STATE || "",

  // الصورة الكبيرة (رابط مباشر)
  largeImage: process.env.LARGE_IMAGE || "",

  // نص الصورة الكبيرة
  largeText: process.env.LARGE_TEXT || "",

  // الصورة الصغيرة (رابط مباشر)
  smallImage: process.env.SMALL_IMAGE || "",

  // نص الصورة الصغيرة
  smallText: process.env.SMALL_TEXT || "",
};
// ================================

// سيرفر صغير للـ 24/7 على Render
const app = express();
app.get("/", (_, res) => res.send("✅ البوت شغال"));
app.listen(process.env.PORT || 3000, () =>
  console.log("🌐 Health server running")
);

// البوت
if (!config.token) {
  console.error("❌ أضف DISCORD_TOKEN في المتغيرات البيئية");
  process.exit(1);
}

const client = new Client({ checkUpdate: false });

client.on("ready", async () => {
  console.log(`✅ تسجيل دخول: ${client.user.tag}`);

  await client.user.setPresence({
    status: config.status,
    activities: [
      {
        name: config.streamName,
        type: "STREAMING",
        url: config.streamUrl,
        details: config.details,
        state: config.state,
        assets: {
          large_image: config.largeImage,
          large_text: config.largeText,
          small_image: config.smallImage,
          small_text: config.smallText,
        },
      },
    ],
  });

  console.log(`🎮 Streaming: ${config.streamName}`);
});

client.on("error", (e) => console.error("خطأ:", e.message));
client.login(config.token);
