#!/usr/bin/env node

/*!
 * TeleOCR
 * Copyright (c) 2023
 *
 * @author Zubin
 * @username (GitHub) losparviero
 * @license AGPL-3.0
 */

// Add env vars as a preliminary

import dotenv from "dotenv";
dotenv.config();
import { Bot, session } from "grammy";
import { run, sequentialize } from "@grammyjs/runner";
import { hydrateFiles } from "@grammyjs/files";
import { hydrate } from "@grammyjs/hydrate";
import Tesseract from "tesseract.js";

// Bot

const bot = new Bot(process.env.BOT_TOKEN);

// Concurrency

function getSessionKey(ctx) {
  return ctx.chat?.id.toString();
}

// Plugins

bot.use(sequentialize(getSessionKey));
bot.use(session({ getSessionKey }));
bot.api.config.use(hydrateFiles(bot.token));
bot.use(responseTime);
bot.use(log);
bot.use(hydrate());

// Admin

const admins = process.env.BOT_ADMIN?.split(",").map(Number) || [];
bot.use(async (ctx, next) => {
  ctx.config = {
    botAdmins: admins,
    isAdmin: admins.includes(ctx.chat?.id),
  };
  await next();
});

// Response

async function responseTime(ctx, next) {
  const before = Date.now();
  await next();
  const after = Date.now();
  console.log(`Response time: ${after - before} ms`);
}

// Log

async function log(ctx, next) {
  let message = ctx.message?.text || ctx.channelPost?.text || undefined;
  const from = ctx.from || ctx.chat;
  const name =
    `${from.first_name || ""} ${from.last_name || ""}`.trim() || ctx.chat.title;

  // Console

  console.log(
    `From: ${name} (@${from.username}) ID: ${from.id}\nMessage: ${message}`
  );

  // Channel

  if (
    ctx.message &&
    !ctx.message?.text?.includes("/") &&
    process.env.BOT_ADMIN
  ) {
    await bot.api.sendMessage(
      process.env.BOT_ADMIN,
      `<b>From: ${name} (@${from.username}) ID: <code>${from.id}</code></b>`,
      { parse_mode: "HTML" }
    );

    await ctx.api.forwardMessage(
      process.env.BOT_ADMIN,
      ctx.chat.id,
      ctx.message.message_id
    );
  }

  await next();
}

bot.use(log);

// Commands

bot.command("start", async (ctx) => {
  await ctx
    .reply("*Welcome!* ✨\n_Send an image to get words from it._", {
      parse_mode: "Markdown",
    })
    .then(console.log("New user added:", ctx.from))
    .catch((e) => console.log(e));
});

bot.command("help", async (ctx) => {
  await ctx
    .reply(
      `*@anzubo Project.*\n\n_This bot uses Google's Tesseract engine to read text from images\nMedia sent is deleted immediately after processing._`,
      { parse_mode: "Markdown" }
    )
    .then(console.log(`Help command invoked by ${ctx.chat.id}`))
    .catch((e) => console.log(e));
});

// OCR

bot.on("message:photo", async (ctx) => {
  try {
    const statusMessage = await ctx.reply("*Reading*", {
      parse_mode: "Markdown",
    });
    const file = await ctx.getFile();
    const path = await file.download();

    await Tesseract.recognize(path).then(async ({ data: { text } }) => {
      await ctx.reply(text, {
        reply_to_message_id: ctx.message.message_id,
      });
    });

    await statusMessage.delete();
  } catch (error) {
    console.log(`Error sending message: ${error}`);
    if (error.message.includes("CHAT_NOT_FOUND")) {
      bot.api.sendMessage(
        ctx.chat.id,
        "Channels and groups are not supported yet."
      );
      return;
    } else if (
      error.message.includes("Forbidden: bot was blocked by the user")
    ) {
      console.log(
        `Error sending message: Bot was blocked by user ${ctx.chat.id}`
      );
      return;
    } else if (error.message.includes(`Call to 'sendMessage' failed`)) {
      await ctx.reply(
        "*Couldn't read text.*\n_Are you sure the text is legible?_",
        {
          parse_mode: "Markdown",
          reply_to_message_id: ctx.message.message_id,
        }
      );
    } else {
      await ctx.reply(`An error occurred: ${error.message}`);
    }
  }
});

// Messages

bot.on(":text", async (ctx) => {
  await ctx.reply("*Send a valid image.*", {
    parse_mode: "Markdown",
    reply_to_message_id: ctx.message.message_id,
  });
});

// Run

run(bot);
