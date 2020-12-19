import { logger } from '../logger'
import * as fs from "fs";
import { EchobotConfiguration, EchobotFilter, EchobotRedirect } from '../models';
import { Path } from 'path-parser'
import { assert } from 'console';


/**
 * Attempts to locate and load the configuration file.
 * @param path The path to the configuration file, if file is not passed, process variable is used
 * @returns True if configuration loaded successfully, false otherwise.
 */
export function loadConfiguration(path): EchobotConfiguration {



    let config: EchobotConfiguration;
    if (process.env.TAGBOT_CONFIG_JSON) {
        // Parse the env var contents as JSON.
        config = JSON.parse(process.env.TAGBOT_CONFIG_JSON);
    } else if (fs.existsSync(path)) {
        // Parse the file as JSON.
        config = JSON.parse(fs.readFileSync(path).toString());
    }
    else {
        throw Error("No configuration could be found. Either create a config.json file or put the config in the ECHOBOT_CONFIG_JSON environment variable.")
    }

    checkConfiguration(config);
    return config;
}
/**
 * Check the configuration object for errors 
 * @param config the config object
 */
function checkConfiguration(config: EchobotConfiguration): EchobotConfiguration {
    // Ensure the config has a Discord token defined.
    if (!config.token) {
        throw new Error("The Discord Client token is missing from the configuration file.")
    }

    // Validate format of redirects
    if (!config.redirect || !config.redirect.tags) {
        // Ensure redirects exist.
        throw new Error(
            "You have not defined any redirects. This bot is useless without them."
        );


    } else if (!Array.isArray(config.redirect.tags)) {
        // Ensure redirects is an array.
        throw new Error(
            "The redirects are not properly formatted (missing array). Please check your configuration."
        );

    } else if (
        config.redirect?.tags.length == 0

    ) {
        // Ensure we have at least one redirect.
        throw new Error(
            "You have not defined any redirects. This bot is useless without them."
        );
    } else {
        // Check each redirect.
        checkRedirectModel(config.redirect);

    }
    // Validation complete.
    logger["info"]("Configuration loaded successfully.");
    return config;
}
function checkRedirectModel(redirect: EchobotRedirect) {
 
    if(!redirect.tags || redirect.tags.length==0){
        throw new Error("No People To tag")
    }


    return true;
}


