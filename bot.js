require("dotenv").config();
const { Bot } = require("grammy");
const tesseract = require("node-tesseract-ocr");

const bot = new Bot(process.env.BOT_TOKEN);

// Commands

bot.command("start", async (ctx) => {
  await ctx.reply("*Welcome!* ✨\nSend an image to get words from it.");
});

// Messages

bot.on("message:text", async (ctx) => {
  await ctx.reply("*Send a valid image.*");
});

// OCR

bot.on("message:photo", async (ctx) => {
  const file = await ctx.getFile();
  const path = file.file_path;

  const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
  };

  await tesseract
    .recognize(path, config)
    .then(async (text) => {
      console.log("Result:", text);
      await ctx.reply(text);
    })
    .catch((error) => {
      console.log(error.message);
    });
});

bot.start();
