const { Client, RichPresence } = require("discord.js-selfbot-v13");
const express = require("express");
const config = require("./config");

// سيرفر صغير للـ 24/7 على Render
const app = express();
app.get("/", (_, res) => res.send("✅ البوت شغال"));
app.listen(process.env.PORT || 3000, () =>
  console.log("🌐 Health server running")
);

// البوت
const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("❌ أضف DISCORD_TOKEN في المتغيرات البيئية");
  process.exit(1);
}

const client = new Client({ checkUpdate: false });

client.on("ready", async () => {
  console.log(`✅ تسجيل دخول: ${client.user.tag}`);

  const presence = new RichPresence(client)
    .setType("STREAMING")
    .setName(config.streamName)
    .setURL(config.streamUrl);

  if (config.details)   presence.setDetails(config.details);
  if (config.state)     presence.setState(config.state);
  if (config.largeImage) {
    presence.setAssetsLargeImage(config.largeImage);
    if (config.largeText) presence.setAssetsLargeText(config.largeText);
  }
  if (config.smallImage) {
    presence.setAssetsSmallImage(config.smallImage);
    if (config.smallText) presence.setAssetsSmallText(config.smallText);
  }

  await client.user.setPresence({
    status: config.status,
    activities: [presence],
  });

  console.log(`🎮 Streaming: ${config.streamName}`);
  console.log(`🔗 URL: ${config.streamUrl}`);
});

client.on("error", (e) => console.error("خطأ:", e.message));
client.login(token);
