require("dotenv").config();
const { Client } = require("discord.js-selfbot-v13");
const config = require("./config.json");

const TOKEN = process.env.DISCORD_TOKEN;
if (!TOKEN) {
  console.error("❌ الخطأ: ضع الـ DISCORD_TOKEN في الـ Secrets");
  process.exit(1);
}

const client = new Client({ checkUpdate: false });

async function setStreamStatus() {
  const {
    name,
    url,
    details,
    state,
    largeImageUrl,
    largeImageText,
    smallImageUrl,
    smallImageText,
    applicationId,
  } = config.streaming;

  const assets = {};
  if (largeImageUrl) {
    assets.large_image = largeImageUrl;
    if (largeImageText) assets.large_text = largeImageText;
  }
  if (smallImageUrl) {
    assets.small_image = smallImageUrl;
    if (smallImageText) assets.small_text = smallImageText;
  }

  const activity = {
    name: name,
    type: "STREAMING",
    url: url,
    timestamps: { start: Date.now() },
  };

  if (details) activity.details = details;
  if (state) activity.state = state;
  if (Object.keys(assets).length > 0) activity.assets = assets;
  if (applicationId) activity.application_id = applicationId;

  await client.user.setActivity(activity);
  await client.user.setStatus("online");
}

client.on("ready", async () => {
  console.log(`✅ تم تسجيل الدخول كـ: ${client.user.tag}`);

  await setStreamStatus();
  console.log(`🎮 تم تفعيل حالة الستريم: ${config.streaming.name}`);

  // refresh كل دقيقتين لضمان بقاء الحالة
  setInterval(async () => {
    await setStreamStatus();
    console.log("🔄 تم تجديد الحالة");
  }, 2 * 60 * 1000);
});

client.on("error", (err) => {
  console.error("❌ خطأ:", err.message);
});

client.login(TOKEN);
