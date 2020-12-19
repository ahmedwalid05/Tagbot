// Import winston Logging Library
const winston = require("winston");

// Import Discord.JS Library
import * as discord from "discord.js";
import { Client, Message, TextChannel } from "discord.js";
import path = require("path");
import {
  EchobotConfiguration,
  EchobotOptions,
  EchobotRedirect,
} from "./models";
import { logger } from "./logger";
import { loadConfiguration } from "./config";



// Constants
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

function main(): void {
  // Load the configuration file.
  var config: EchobotConfiguration;
  try {
    config = loadConfiguration("config.json");
  } catch (error) {
    logger.error(error)
    return;
  }

  new EchoBot(config);
}


class EchoBot {

  // Create global configuration variable.
  config: EchobotConfiguration = null;

  // Create global discord client variable.
  discordClient: Client = null;
  constructor(config: EchobotConfiguration) {
    this.config = config;

    this.loginToDiscord();
  }
  /**
   * Signs into the Discord client with the token in the config,
   * and subscribes to message listeners.
   */
  loginToDiscord(): void {

    // Create client, but don't login yet.
    this.discordClient = new discord.Client();
    (<any>this.discordClient).config = this.config

    // Register event for when client is ready.
    this.discordClient.on("ready", () => {
      logger["info"]("Signed into Discord.");

      let channel = this.discordClient.channels.get(this.config.redirect.destination);
      (<any>this.discordClient).destChannel = channel;
    });

    // Register event for when client receives a message.
    this.discordClient.on("message", this.onDiscordClientMessageReceived);

    // Register event for when an error occurs.
    this.discordClient.on("error", (error) => {
      logger["error"]("An error occurred: " + error.message);
      logger["info"]("Restarting Discord Client.");
      this.loginToDiscord();
    });

    // Login.
    this.discordClient.login(this.config.token).catch((err) => {
      logger["error"]("Could not sign into Discord: " + err);
    });
  }
  /**
  * Fired when a message is received on Discord in any channel.
  * @param message The message that was received.
  */
  onDiscordClientMessageReceived(message: Message): void {
    // Find redirects that have this message's channel id as a source.
    let channel: discord.Channel = (<any>this).destChannel;

    if (message.channel.id == channel.id)
      return;
    sendMessage(message, <any>channel, this.config.redirect)

  }
}



async function sendMessage(
  message: Message,
  destChannel: TextChannel,
  redirect: EchobotRedirect
): Promise<void> {
  let options = redirect.options;
  let messageContents = message.content;
  // Copy rich embed if requested.

  // Determine if we are sending a rich embed or not. (This is decided by if a color is set).

  // Sending a standard message.
  let destinationMessage = "";

  // Add title if requested.
  if (options && options.title) {
    destinationMessage += "**" + options.title + "**\n";
  }

  // Add source if requested.
  if (options && options.includeSource) {
    destinationMessage += `*Author: **${message.member.displayName}** in **${message.guild.name
      }/${(message.channel as TextChannel).name}***\n`;
  }


  destinationMessage += `\n`;

  // Add copied message.
  destinationMessage += messageContents;


  // Add attachments if requested.
  let attachment: discord.Attachment | undefined;
  redirect.tags.forEach(tag => {
    if(message.guild.roles.get(tag)){
      destinationMessage += `\n<@&${tag}>\t`;
    }else{
      destinationMessage += `\n<@${tag}>\t`;
    }
    
  });

  // Send message.
  // if (lastEcho != destinationMessage) {
  (destChannel as TextChannel).send(destinationMessage, attachment);
  // lastEcho = destinationMessage;
  // }
  return;


}

main();