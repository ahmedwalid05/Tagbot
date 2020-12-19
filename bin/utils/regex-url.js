"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrls = void 0;
const ipRegex = require("ip-regex");
const tlds = require("tlds");
const SafeRegExp = RegExp;
const ipv4 = ipRegex.v4().source;
const ipv6 = ipRegex.v6().source;
function getUrlsRegex(options) {
    options = {
        exact: false,
        strict: false,
        auth: false,
        localhost: true,
        parens: false,
        apostrophes: false,
        trailingPeriod: false,
        ipv4: true,
        ipv6: true,
        tlds,
        returnString: false,
    };
    const protocol = `(?:(?:[a-z]+:)?//)${options.strict ? '' : '?'}`;
    const auth = options.auth ? '(?:\\S+(?::\\S*)?@)?' : '';
    const host = '(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)';
    const domain = '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*';
    const tld = `(?:\\.${options.strict
        ? '(?:[a-z\\u00a1-\\uffff]{2,})'
        : `(?:${options.tlds.sort((a, b) => b.length - a.length).join('|')})`})${options.trailingPeriod ? '\\.?' : ''}`;
    const port = '(?::\\d{2,5})?';
    const path = options.parens
        ? options.apostrophes
            ? '(?:[/?#][^\\s"]*)?'
            : '(?:[/?#][^\\s"\']*)?'
        : options.apostrophes
            ? '(?:[/?#][^\\s"\\)]*)?'
            : '(?:[/?#][^\\s"\\)\']*)?';
    let regex = `(?:${protocol}|www\\.)${auth}(?:`;
    if (options.localhost)
        regex += 'localhost|';
    if (options.ipv4)
        regex += `${ipv4}|`;
    if (options.ipv6)
        regex += `${ipv6}|`;
    regex += `${host}${domain}${tld})${port}${path}`;
    if (options.returnString)
        return regex;
    return options.exact
        ? new SafeRegExp(`(?:^${regex}$)`, 'i')
        : new SafeRegExp(regex, 'ig');
}
;
function getUrls(url) {
    let re = getUrlsRegex();
    let result;
    let matches = [];
    while ((result = re.exec(url)) !== null) {
        matches.push(result[0]);
    }
    return matches;
}
exports.getUrls = getUrls;
//# sourceMappingURL=regex-url.js.map