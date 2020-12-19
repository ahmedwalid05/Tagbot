# Discord Tagbot

This bot tags a list of people or roles whenever there is a new message in any of the channels it can read



## Requirements

To setup and run this bot, you must first [install Node.js](https://nodejs.org/en/).

## Setup

1. Clone this repository using `git clone https://github.com/ahmedwalid05/Tagbot.git`
2. Configure your bot from [here](https://ahmedwalid05.github.io/Tagbot/) and download the generated config file
3. Configure the bot by **either**:
    - Copy the downloaded config.json file to the same director as the code 
    - **OR** (You can do both but the process parameters file will always take precedence).
    - Pasting the entire config JSON (what would normally be in your file) into the environment variable `TAGBOT_CONFIG_JSON`.
4. Open a command prompt or terminal in the extracted directory, and run `npm install`.

### Options
* `destination`: The ID of the destination text channel
* `tags`: A list of strings of the IDs of the users or roles to be tagged
* `title`: Displayed at the top of each message. Optional.
  * ```"title": "New Copied Message"```
* `includeSource`: Whether to include a line at the top showing the nickname, guild, and channel of the author who sent the message.
  * ```"includeSource": true```


`
### Finding your Token

This Discord bot is called a "self-bot," meaning it runs as your personal Discord account rather than a separate bot account.

In order for this to work, you need to provide your Discord token in the `config.json` file. To find this token, follow these steps:

1. Open the Discord client on your computer.
2. Push `Ctrl + Shift + I` to open the dev tools (may be different on non-windows operating systems).
3. Go to the `Network` tab.
4. Go to any channel in any guild.
5. Click through the network requests that appear and search for the header `authorization`. 
    - You can usually ignore image requests.
6. Copy the value of the `authorization` header.
    - It will look something like `mfa.aasdkf--SDsdkfjhsdf_ewrh-msufeusefsbeouhue_W-34FsedFwEsr_SDFsufserF4_slhSDF432f`

The token will now be on your clipboard and can be pasted into the config. Make sure there is only one set of quotation marks.

### Finding Channel IDs

Redirect sources and destinations use Channel IDs, which look like large numbers. To find these, follow these steps:

1. Open the Discord client.
2. Go to User Settings.
3. Go to Appearance.
4. Scroll to the bottom and enable Developer Mode.
5. Close User Settings.
6. Right click on any channel (only text channels are supported, not voice) and select `Copy ID`.

The ID will now be on your clipboard and can be pasted into the config.


## Deployment

### Run Locally

Open a command prompt or terminal in the extracted directory, and run `npm start`. You must have both `node` and `npm` installed.

### Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/ahmedwalid05/Tagbot/tree/master)

This bot is compatible with Heroku. You can use the button above to deploy it quickly. 

Use the `TAGBOT_CONFIG_JSON` environment variable to create your config. Simply put everything that would normally be in the config.json file into this variable. Formatting does not matter.
