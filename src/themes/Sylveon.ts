import { MantineThemeOverride, virtualColor } from '@mantine/core';

const theme: MantineThemeOverride = {
  colors: {
    dark: [
      '#f5f7ff',
      '#7182bd',
      '#415085',
      '#303c66',
      '#171d33',
      '#1b223b',
      '#10121a',
      '#0b0c0f',
      '#0d0d0f',
      '#0b0b0b'
    ],
    gray: [
      '#f5ebf3',
      '#f3e7f1',
      '#f1e4ee',
      '#efe0ec',
      '#edddea',
      '#b374a7',
      '#b56ba7',
      '#9e5490',
      '#572e50',
      '#10090f'
    ],
    blue: [
      '#eaeced',
      '#dbe7f2',
      '#cce2f6',
      '#bddefb',
      '#afd9fd',
      '#add9ff',
      '#4caafd',
      '#0e7ae1',
      '#07447d',
      '#010e18'
    ],
    green: [
      '#dafbe1',
      '#aceebb',
      '#6fdd8b',
      '#4ac26b',
      '#2da44e',
      '#1a7f37',
      '#116329',
      '#044f1e',
      '#003d16',
      '#002d11'
    ],
    yellow: [
      '#f7f1e5',
      '#faeacd',
      '#fce3b5',
      '#fddd9d',
      '#fed687',
      '#ffd685',
      '#ffb82d',
      '#ce8906',
      '#744d03',
      '#191102'
    ],
    orange: [
      '#fff1e5',
      '#ffd8b5',
      '#ffb77c',
      '#fb8f44',
      '#e16f24',
      '#bc4c00',
      '#953800',
      '#762c00',
      '#5c2200',
      '#471700'
    ],
    red: [
      '#fff5f5',
      '#ffe3e3',
      '#ffc9c9',
      '#ffa8a8',
      '#ff8787',
      '#ff6b6b',
      '#fa5252',
      '#f03e3e',
      '#e03131',
      '#c92a2a'
    ],
    pink: [
      '#fff0f6',
      '#ffdeeb',
      '#fcc2d7',
      '#faa2c1',
      '#f783ac',
      '#f06595',
      '#e64980',
      '#d6336c',
      '#c2255c',
      '#a61e4d'
    ],
    grape: [
      '#f8f0fc',
      '#f3d9fa',
      '#eebefa',
      '#e599f7',
      '#da77f2',
      '#cc5de8',
      '#be4bdb',
      '#ae3ec9',
      '#9c36b5',
      '#862e9c'
    ],
    violet: [
      '#f3f0ff',
      '#e5dbff',
      '#d0bfff',
      '#b197fc',
      '#9775fa',
      '#845ef7',
      '#7950f2',
      '#7048e8',
      '#6741d9',
      '#5f3dc4'
    ],
    indigo: [
      '#d6dbec',
      '#bfc7e6',
      '#a8b3e0',
      '#909fda',
      '#798bd4',
      '#798bd4',
      '#3d58c4',
      '#283e8b',
      '#152351',
      '#040918'
    ],
    cyan: [
      '#e3fafc',
      '#c5f6fa',
      '#99e9f2',
      '#66d9e8',
      '#3bc9db',
      '#22b8cf',
      '#15aabf',
      '#1098ad',
      '#0c8599',
      '#0b7285'
    ],
    teal: [
      '#e6fcf5',
      '#c3fae8',
      '#96f2d7',
      '#63e6be',
      '#38d9a9',
      '#20c997',
      '#12b886',
      '#0ca678',
      '#099268',
      '#087f5b'
    ],
    lime: [
      '#f4fce3',
      '#e9fac8',
      '#d8f5a2',
      '#c0eb75',
      '#a9e34b',
      '#94d82d',
      '#82c91e',
      '#74b816',
      '#66a80f',
      '#5c940d'
    ],
    fairy: virtualColor({
                        name: 'fairy',
                        dark: 'pink',
                        light: 'blue'
                      })
  },
  primaryColor: 'fairy',
  primaryShade: {
    light: 6,
    dark: 5
  },
  white: '#ffffff',
  black: '#24292f',
  autoContrast: true,
  luminanceThreshold: 0.3,
  // @ts-ignore
  isThemeDependentPrimaryShade: true,
  defaultGradient: {
    from: 'cyan',
    to: 'fairy',
    deg: 45
  },
  fontFamily: 'Poppins',
  fontFamilyMonospace: 'Roboto Mono',
  headings: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    sizes: {
      h1: {
        fontSize: '2.025rem',
        lineHeight: '1.3',
        fontWeight: '400'
      },
      h2: {
        fontSize: '1.625rem',
        lineHeight: '1.35',
        fontWeight: '500'
      },
      h3: {
        fontSize: '1.375rem',
        lineHeight: '1.4',
        fontWeight: '400'
      },
      h4: {
        fontSize: '1.125rem',
        lineHeight: '1.45',
        fontWeight: '500'
      },
      h5: {
        fontSize: '1rem',
        lineHeight: '1.5',
        fontWeight: '400'
      },
      h6: {
        fontSize: '0.875rem',
        lineHeight: '1.5',
        fontWeight: '400'
      }
    }
  },
  scale: 1,
  radius: {
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '2.2rem'
  },
  spacing: {
    xs: '0.525rem',
    sm: '1.15rem',
    md: '1.5rem',
    lg: '1.65rem',
    xl: '2.5rem'
  },
  defaultRadius: 'lg',
  breakpoints: {
    xs: '36em',
    sm: '48em',
    md: '62em',
    lg: '75em',
    xl: '88em'
  },
  fontSmoothing: true,
  focusRing: 'auto',
  components: {
    Card: {
      defaultProps: {
        withBorder: true,
        radius: 'md',
        padding: 'lg'
      },
      styles: {}
    }
  }
};

export default theme;