require("dotenv").config();
const { Bot } = require("grammy");
const tesseract = require("node-tesseract-ocr");

// Bot

const bot = new Bot(process.env.BOT_TOKEN);

// Config

const config = {
  lang: "eng",
  oem: 1,
  psm: 3,
};

// Commands

bot.command("start", async (ctx) => {
  await ctx.reply("*Welcome!* ✨\nSend an image to get words from it.");
});

// OCR

bot.on("message:photo", async (ctx) => {
  const file = await ctx.getFile();
  const path = file.file_path;
  await ctx.reply(path);

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

bot.on("message:entities:url", async (ctx) => {
  await tesseract
    .recognize(ctx.message.text, config)
    .then(async (text) => {
      console.log("Result:", text);
      await ctx.reply(text);
    })
    .catch((error) => {
      console.log(error.message);
    });
});

bot.start();
