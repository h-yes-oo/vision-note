import { DefaultTheme } from 'styled-components';
import LogoLight from 'assets/icons/LogoLight.png';
import LogoDark from 'assets/icons/LogoDark.png';

const margins = {
  sm: '.5rem',
  base: '1rem',
  lg: '2rem',
  xl: '3rem',
};

const paddings = {
  sm: '.5rem',
  base: '1rem',
  lg: '2rem',
  xl: '3rem',
};

const fonts = {
  family: {
    base: `'Noto Sans KR', sans-serif`,
    title: `'Merriweather', serif`,
  },
  size: {
    sm: '1.4rem',
    base: '1.6rem',
    lg: '2rem',
    xl: '2.5rem',
    title: '6rem',
  },
  weight: {
    light: 100,
    normal: 400,
    bold: 700,
  },
};

const colors = {
  darkPurple: '#6a58d3',
  white: '#fff',
  darkGrey: '#676767',
  grey: '#f9f9f9',
  lightgrey: '#c5c5c5',
  veryLightGrey: 'f6f8fa',
  hoverGrey: '#f5f5f5',
  hoverGreyLight: '#f6f6f6',
  hoverEffect: 'f1f3f4',
  black: '#000',
  greyLetter: '#a2a2a2',
  searchGrey: '#656565',
  lineGrey: '#e6e6e6',
  backgroundGrey: '#f7f9fc',
};

// 테마에 따라 다른 값을 갖는 색상 값입니다
const lightThemeColors = {
  ...colors,
  purple: '#7b68ee',
  primaryText: '#000',
  secondaryText: '#676767',
  tertiaryText: '#656565',
  noteText: '#000',
  semiText: '#656565',
  background: '#fff',
  lightBackground: '#fff',
  highlightBackground: '#f5f4fe',
  contextBackground: '#fff',
  alertBackground: '#fff',
  border: '#e6e6e6',
  lightBorder: '#e6e6e6',
  placeHolder: '#c5c5c5',
  hover: '#f6f6f6',
  contrast: '#000',
};

const darkThemeColors = {
  ...colors,
  purple: '#816cff',
  primaryText: '#e6e6e6',
  secondaryText: '#f9f9f9',
  tertiaryText: '#a2a2a2',
  noteText: '#c5c5c5',
  semiText: '#c5c5c5',
  background: '#32363a',
  lightBackground: '#3f4549',
  highlightBackground: '#43484b',
  contextBackground: '#3e4447',
  alertBackground: '#2f3437',
  border: '#2d2d2d',
  lightBorder: '#c5c5c5',
  placeHolder: '#e6e6e6',
  hover: '#363c3e',
  contrast: '#fff',
};

const size = {
  mobile: '425px',
  tablet: '768px',
  desktop: '1440px',
};

const shadow = {
  root: '0 3rem 16rem 0 rgba(0, 0, 0, 0.16)',
  menu: '3rem 5rem 16rem 0 rgba(0, 0, 0, 0.12)',
  box: '0 3rem 16rem 0 rgba(0, 0, 0, 0.08)',
  faq: '0 4rem 16rem 0 rgba(0, 0, 0, 0.1)',
};

// 미디어 쿼리의 중복 코드를 줄이기위해 정의된 변수입니다
const device = {
  mobile: `@media only screen and (max-width: ${size.mobile})`,
  tablet: `@media only screen and (max-width: ${size.tablet})`,
  desktopL: `@media only screen and (max-width: ${size.desktop})`,
};

// 테마와 관련없이 공통으로 사용되는 변수들입니다
const defalutTheme = {
  margins,
  paddings,
  fonts,
  device,
};

// 각 테마는 공통 변수와 함께, 각기 다른 색상 값들을 갖습니다.
export const darkTheme: DefaultTheme = {
  logo: LogoDark,
  color: darkThemeColors,
};

export const lightTheme: DefaultTheme = {
  logo: LogoLight,
  color: lightThemeColors,
};
