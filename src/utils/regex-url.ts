import * as ipRegex from 'ip-regex';
import * as tlds from 'tlds';
const SafeRegExp = RegExp;
const ipv4 = ipRegex.v4().source;
const ipv6 = ipRegex.v6().source;
function getUrlsRegex(options?): RegExp | string {
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
  // Add option to disable matching urls with HTTP Basic Authentication
  // <https://github.com/kevva/url-regex/pull/63>
  const auth = options.auth ? '(?:\\S+(?::\\S*)?@)?' : '';
  const host = '(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)';
  const domain =
    '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*';
  // Add ability to pass custom list of tlds
  // <https://github.com/kevva/url-regex/pull/66>
  const tld = `(?:\\.${options.strict
    ? '(?:[a-z\\u00a1-\\uffff]{2,})'
    : `(?:${options.tlds.sort((a, b) => b.length - a.length).join('|')})`
    })${options.trailingPeriod ? '\\.?' : ''}`;

  const port = '(?::\\d{2,5})?';
  // Not accept closing parenthesis
  // <https://github.com/kevva/url-regex/pull/35>
  // Don't allow apostrophes
  // <https://github.com/kevva/url-regex/pull/55>
  const path = options.parens
    ? options.apostrophes
      ? '(?:[/?#][^\\s"]*)?'
      : '(?:[/?#][^\\s"\']*)?'
    : options.apostrophes
      ? '(?:[/?#][^\\s"\\)]*)?'
      : '(?:[/?#][^\\s"\\)\']*)?';

  // Added IPv6 support
  // <https://github.com/kevva/url-regex/issues/60>
  let regex = `(?:${protocol}|www\\.)${auth}(?:`;
  if (options.localhost) regex += 'localhost|';
  if (options.ipv4) regex += `${ipv4}|`;
  if (options.ipv6) regex += `${ipv6}|`;
  regex += `${host}${domain}${tld})${port}${path}`;

  // Add option to return the regex string instead of a RegExp
  if (options.returnString) return regex;

  return options.exact
    ? new SafeRegExp(`(?:^${regex}$)`, 'i')
    : new SafeRegExp(regex, 'ig');
};
export function getUrls(url: string): string[] {
  let re = <RegExp>getUrlsRegex();
  let result;
  let matches =[];
  while ((result = re.exec(url)) !== null) {
    matches.push(result[0])
  }
  return matches;
}