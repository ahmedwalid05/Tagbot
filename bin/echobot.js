"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const discord = require("discord.js");
const logger_1 = require("./logger");
const config_1 = require("./config");
const imageExts = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "tif",
    "tiff",
    "bmp",
    "svg",
    "jif",
    "jfif",
    "apng",
];
function main() {
    var config;
    try {
        config = config_1.loadConfiguration("config.json");
    }
    catch (error) {
        logger_1.logger.error(error);
        return;
    }
    new EchoBot(config);
}
class EchoBot {
    constructor(config) {
        this.config = null;
        this.discordClient = null;
        this.config = config;
        this.loginToDiscord();
    }
    loginToDiscord() {
        this.discordClient = new discord.Client();
        this.discordClient.config = this.config;
        this.discordClient.on("ready", () => {
            logger_1.logger["info"]("Signed into Discord.");
            let channel = this.discordClient.channels.get(this.config.redirect.destination);
            this.discordClient.destChannel = channel;
        });
        this.discordClient.on("message", this.onDiscordClientMessageReceived);
        this.discordClient.on("error", (error) => {
            logger_1.logger["error"]("An error occurred: " + error.message);
            logger_1.logger["info"]("Restarting Discord Client.");
            this.loginToDiscord();
        });
        this.discordClient.login(this.config.token).catch((err) => {
            logger_1.logger["error"]("Could not sign into Discord: " + err);
        });
    }
    onDiscordClientMessageReceived(message) {
        let channel = this.destChannel;
        if (message.channel.id == channel.id)
            return;
        sendMessage(message, channel, this.config.redirect);
    }
}
function sendMessage(message, destChannel, redirect) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = redirect.options;
        let messageContents = message.content;
        let destinationMessage = "";
        if (options && options.title) {
            destinationMessage += "**" + options.title + "**\n";
        }
        if (options && options.includeSource) {
            destinationMessage += `*Author: **${message.member.displayName}** in **${message.guild.name}/${message.channel.name}***\n`;
        }
        destinationMessage += `\n`;
        destinationMessage += messageContents;
        let attachment;
        redirect.tags.forEach(tag => {
            destinationMessage += `\n<@${tag}>\t`;
        });
        destChannel.send(destinationMessage, attachment);
        return;
    });
}
main();
//# sourceMappingURL=echobot.js.map