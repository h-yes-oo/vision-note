import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    logo: string;
    color: {
      purple: string;
      darkPurple: string;
      white: string;
      darkGrey: string;
      grey: string;
      lightgrey: string;
      veryLightGrey: string;
      hoverGrey: string;
      hoverGreyLight: string;
      hoverEffect: string;
      black: string;
      greyLetter: string;
      searchGrey: string;
      lineGrey: string;
      backgroundGrey: string;
      primaryText: string;
      secondaryText: string;
      tertiaryText: string;
      noteText: string;
      semiText: string;
      background: string;
      lightBackground: string;
      highlightBackground: string;
      contextBackground: string;
      alertBackground: string;
      border: string;
      lightBorder: string;
      placeHolder: string;
      hover: string;
      contrast: string;
    };
  }
}
