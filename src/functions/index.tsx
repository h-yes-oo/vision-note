export const decodeUnicode = (unicodeString: string): string => {
  const r = /\\u([\d\w]{4})/gi;
  unicodeString = unicodeString.replace(r, function (match, grp) {
    return String.fromCharCode(parseInt(grp, 16));
  });
  return unescape(unicodeString);
};

export const isChrome = () => {
  const isChromium = window.chrome;
  const winNav = window.navigator;
  const vendorName = winNav.vendor;
  const isOpera = typeof window.opr !== 'undefined';
  const isIEedge = winNav.userAgent.indexOf('Edg') > -1;
  const isIOSChrome = winNav.userAgent.match('CriOS');

  if (isIOSChrome) {
    // is Google Chrome on IOS
    return true;
  }
  if (
    isChromium !== null &&
    typeof isChromium !== 'undefined' &&
    vendorName === 'Google Inc.' &&
    isOpera === false &&
    isIEedge === false
  ) {
    // is Google Chrome
    return true;
  }
  // not Google Chrome
  return false;
};

export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isWindows = () => {
  if (navigator.appVersion.indexOf('Win') !== -1) return true;
  return false;
};

export const checkTime = (i: number) => {
  return i < 10 ? `0${i}` : String(i);
};
