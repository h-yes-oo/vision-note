export const decodeUnicode = (unicodeString: string): string => {
  const r = /\\u([\d\w]{4})/gi;
  unicodeString = unicodeString.replace(r, function (match, grp) {
    return String.fromCharCode(parseInt(grp, 16));
  });
  return unescape(unicodeString);
};
