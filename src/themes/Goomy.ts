import { MantineThemeOverride, virtualColor } from '@mantine/core';


const theme: MantineThemeOverride = {
  colors: {
    dark: [
      '#ffffff',
      '#beb3d1',
      '#a495be',
      '#8a78aa',
      '#715d94',
      '#715d94',
      '#584872',
      '#3e3451',
      '#251f2f',
      '#0b0a0d'
    ],
    gray: [
      '#f0e7f3',
      '#ecdff0',
      '#e8d8ed',
      '#e4d1eb',
      '#e0cae8',
      '#e0cae8',
      '#b783ca',
      '#8845a1',
      '#4c265a',
      '#100713'
    ],
    green: [
      '#c3eac9',
      '#95dea0',
      '#91db88',
      '#80cc78',
      '#78b86c',
      '#77c46e',
      '#3d914c',
      '#31783e',
      '#1d662c',
      '#124d1a'
    ],
    red: [
      '#fff5f5',
      '#ffe3e3',
      '#ffc9c9',
      '#ffa8a8',
      '#eb6363',
      '#f24e4e',
      '#f75959',
      '#f55858',
      '#fc6868',
      '#c92a2a'
    ],
    blue: [
      '#dae4ed',
      '#c1d7ea',
      '#a8cae7',
      '#8fbce3',
      '#75afe0',
      '#75afe0',
      '#288ad6',
      '#0b619b',
      '#00385c',
      '#000f1c'
    ],
    darkgoo: [
      '#d1c7dd',
      '#af9ec3',
      '#8c76a9',
      '#6b5687',
      '#4b3c5e',
      '#4b3c5e',
      '#423454',
      '#2b2336',
      '#1c1722',
      '#0b0b0d'
    ],
    lightgoo: [
      '#eeecf3',
      '#efebf5',
      '#efebf7',
      '#efebf8',
      '#f0ebfa',
      '#f0ebfa',
      '#f7f5fa',
      '#6631d0',
      '#381a75',
      '#0c041a'
    ],
    goo: virtualColor({
                        name: 'goo',
                        dark: 'darkgoo',
                        light: 'lightgoo'
                      }),
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
      '#edf2ff',
      '#dbe4ff',
      '#bac8ff',
      '#91a7ff',
      '#748ffc',
      '#5c7cfa',
      '#4c6ef5',
      '#4263eb',
      '#3b5bdb',
      '#364fc7'
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
    yellow: [
      '#fff9db',
      '#fff3bf',
      '#ffec99',
      '#ffe066',
      '#ffd43b',
      '#fcc419',
      '#fab005',
      '#f59f00',
      '#f08c00',
      '#e67700'
    ],
    orange: [
      '#fff4e6',
      '#ffe8cc',
      '#ffd8a8',
      '#ffc078',
      '#ffa94d',
      '#ff922b',
      '#fd7e14',
      '#f76707',
      '#e8590c',
      '#d9480f'
    ]
  },
  primaryColor: 'green',
  primaryShade: {
    light: 5,
    dark: 5
  },
  white: '#ffffff',
  black: '#2e085c',
  autoContrast: true,
  luminanceThreshold: 0.3,
  // @ts-ignore
  isThemeDependentPrimaryShade: true,
  defaultGradient: {
    from: 'green',
    to: 'lime',
    deg: 45
  },
  fontFamily: 'Nunito',
  fontFamilyMonospace: 'Roboto Mono',
  headings: {
    fontFamily: 'Nunito',
    fontWeight: '600',
    sizes: {
      h1: {
        fontSize: 'calc(2.125rem * var(--mantine-scale))',
        lineHeight: '1.3',
        fontWeight: '600'
      },
      h2: {
        fontSize: 'calc(1.625rem * var(--mantine-scale))',
        lineHeight: '1.35',
        fontWeight: '600'
      },
      h3: {
        fontSize: 'calc(1.375rem * var(--mantine-scale))',
        lineHeight: '1.4',
        fontWeight: '600'
      },
      h4: {
        fontSize: 'calc(1.125rem * var(--mantine-scale))',
        lineHeight: '1.45',
        fontWeight: '600'
      },
      h5: {
        fontSize: 'calc(1rem * var(--mantine-scale))',
        lineHeight: '1.5',
        fontWeight: '600'
      },
      h6: {
        fontSize: 'calc(0.875rem * var(--mantine-scale))',
        lineHeight: '1.5',
        fontWeight: '600'
      }
    }
  },
  scale: 1,
  radius: {
    xs: 'calc(0.125rem * var(--mantine-scale))',
    sm: 'calc(0.25rem * var(--mantine-scale))',
    md: 'calc(0.5rem * var(--mantine-scale))',
    lg: 'calc(1rem * var(--mantine-scale))',
    xl: 'calc(2rem * var(--mantine-scale))'
  },
  spacing: {
    xs: 'calc(0.625rem * var(--mantine-scale))',
    sm: 'calc(0.75rem * var(--mantine-scale))',
    md: 'calc(1rem * var(--mantine-scale))',
    lg: 'calc(1.25rem * var(--mantine-scale))',
    xl: 'calc(2rem * var(--mantine-scale))'
  },
  defaultRadius: 'xl',
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
        bg: 'var(--mantine-color-goo-5)'
      },
      styles: {}
    },
    Paper: {
      defaultProps: {
        bg: 'var(--mantine-color-goo-6)',
        shadow: 'md'
      },
      styles: {}
    },
    Input: {
      defaultProps: {
        variant: 'default'
      },
      styles: {}
    }
  }
};

export default theme;