"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfiguration = void 0;
const logger_1 = require("../logger");
const fs = require("fs");
function loadConfiguration(path) {
    let config;
    if (process.env.TAGBOT_CONFIG_JSON) {
        config = JSON.parse(process.env.TAGBOT_CONFIG_JSON);
    }
    else if (fs.existsSync(path)) {
        config = JSON.parse(fs.readFileSync(path).toString());
    }
    else {
        throw Error("No configuration could be found. Either create a config.json file or put the config in the ECHOBOT_CONFIG_JSON environment variable.");
    }
    checkConfiguration(config);
    return config;
}
exports.loadConfiguration = loadConfiguration;
function checkConfiguration(config) {
    var _a;
    if (!config.token) {
        throw new Error("The Discord Client token is missing from the configuration file.");
    }
    if (!config.redirect || !config.redirect.tags) {
        throw new Error("You have not defined any redirects. This bot is useless without them.");
    }
    else if (!Array.isArray(config.redirect.tags)) {
        throw new Error("The redirects are not properly formatted (missing array). Please check your configuration.");
    }
    else if (((_a = config.redirect) === null || _a === void 0 ? void 0 : _a.tags.length) == 0) {
        throw new Error("You have not defined any redirects. This bot is useless without them.");
    }
    else {
        checkRedirectModel(config.redirect);
    }
    logger_1.logger["info"]("Configuration loaded successfully.");
    return config;
}
function checkRedirectModel(redirect) {
    if (!redirect.destination) {
        throw new Error("Redirect has no destinations.");
    }
    if (!redirect.tags || redirect.tags.length == 0) {
        throw new Error("No People To tag");
    }
    return true;
}
//# sourceMappingURL=config.js.map