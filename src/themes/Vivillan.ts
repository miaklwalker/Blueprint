import { MantineThemeOverride } from '@mantine/core';

const theme: MantineThemeOverride = {
  colors: {
    dark: [
      '#f4f7f2',
      '#5fa839',
      '#748c86',
      '#4f756b',
      '#13403a',
      '#17382b',
      '#00170f',
      '#082624',
      '#07291e',
      '#020500'
    ],
    gray: [
      '#F8FAF6',
      '#F0F4EC',
      '#E5EAE0',
      '#D4DED0',
      '#A6B6A0',
      '#788D73',
      '#5D705A',
      '#455347',
      '#303C31',
      '#1F2A17'
    ],
    green: [
      '#E7F5E4',
      '#D0EBC9',
      '#B9E1AF',
      '#A2D794',
      '#8BCE7A',
      '#44A336',
      '#378929',
      '#2A6F1F',
      '#1D5415',
      '#113A0C'
    ],
    brown: [
      '#F7F2E7',
      '#EFE6D0',
      '#E6DABA',
      '#DECFA3',
      '#D5C38D',
      '#8B6D3F',
      '#725835',
      '#5A472C',
      '#423623',
      '#2A2419'
    ],
    moss: [
      '#e6f0ca',
      '#d4e6a2',
      '#c3dd79',
      '#b1d450',
      '#9bc22f',
      '#9bc22f',
      '#77971f',
      '#546c12',
      '#314107',
      '#0f1600'
    ],
    amber: [
      '#FFF8E7',
      '#FFF1D0',
      '#FFEABA',
      '#FFE3A3',
      '#FFDC8D',
      '#E6A517',
      '#BF8813',
      '#996C0F',
      '#73510B',
      '#4C3607'
    ],
    lime: [
      '#ebf5da',
      '#def2c1',
      '#d2eea7',
      '#c5ea8d',
      '#b8e673',
      '#b8e673',
      '#93da26',
      '#669e0c',
      '#395a04',
      '#0c1700'
    ],
    red: [
      '#e6c7c7',
      '#daa0a0',
      '#ce7979',
      '#c25252',
      '#a63a3a',
      '#a63a3a',
      '#832c2c',
      '#5e1f1f',
      '#3a1112',
      '#180404'
    ],
    orange: [
      '#ebd8c8',
      '#e3bd9b',
      '#dba26f',
      '#d28742',
      '#b56d2a',
      '#b56d2a',
      '#8e541d',
      '#673c12',
      '#402305',
      '#1b0a00'
    ],
    mist: [
      '#e4e9f0',
      '#d8e2ee',
      '#ccdaec',
      '#bfd3ea',
      '#b3cbe8',
      '#b3cbe8',
      '#6699d4',
      '#2b68ab',
      '#133a62',
      '#010d19'
    ],
    blue: [
      '#c9dae7',
      '#a1c1dd',
      '#79a9d2',
      '#5191c7',
      '#3677ad',
      '#3677ad',
      '#255d89',
      '#164264',
      '#09283e',
      '#000e18'
    ],
    grape: [
      '#e0c9e7',
      '#cda3d8',
      '#ba7ec9',
      '#a659ba',
      '#8b419e',
      '#8b419e',
      '#6d327c',
      '#4e2459',
      '#2f1536',
      '#110714'
    ],
    pink: [
      '#e8d0d9',
      '#dcb2c1',
      '#cf95a9',
      '#c27791',
      '#b55979',
      '#b55979',
      '#91405c',
      '#672d41',
      '#3d1a26',
      '#14070b'
    ],
    indigo: [
      '#cdd2e9',
      '#acb6de',
      '#8c9ad3',
      '#6b7dc8',
      '#4a61bd',
      '#4a61bd',
      '#354997',
      '#25346c',
      '#151e41',
      '#050916'
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
    ]
  },
  primaryColor: 'moss',
  primaryShade: {
    light: 5,
    dark: 6
  },
  white: '#ffffff',
  black: '#07300a',
  autoContrast: true,
  luminanceThreshold: 0.37,
  // @ts-ignore
  isThemeDependentPrimaryShade: true,
  defaultGradient: {
    from: 'moss',
    to: 'lime',
    deg: 45
  },
  fontFamily: 'Lato',
  fontFamilyMonospace: 'Source Code Pro',
  headings: {
    fontFamily: 'Playfair Display',
    fontWeight: '600',
    sizes: {
      h1: {
        fontSize: 'calc(2.6rem * var(--mantine-scale))',
        fontWeight: '700',
        lineHeight: '1.3'
      },
      h2: {
        fontSize: 'calc(2.1rem * var(--mantine-scale))',
        fontWeight: '600',
        lineHeight: '1.35'
      },
      h3: {
        fontSize: 'calc(1.75rem * var(--mantine-scale))',
        fontWeight: '400',
        lineHeight: '1.4'
      },
      h4: {
        fontSize: 'calc(1.425rem * var(--mantine-scale))',
        fontWeight: '200',
        lineHeight: '1.45'
      },
      h5: {
        fontSize: 'calc(1rem * var(--mantine-scale))',
        fontWeight: '600',
        lineHeight: '1.5'
      },
      h6: {
        fontSize: 'calc(0.875rem * var(--mantine-scale))',
        fontWeight: '600',
        lineHeight: '1.5'
      }
    }
  },
  scale: 1,
  radius: {
    xs: 'calc(0.125rem * var(--mantine-scale))',
    sm: 'calc(0.25rem * var(--mantine-scale))',
    md: 'calc(0.375rem * var(--mantine-scale))',
    lg: 'calc(0.75rem * var(--mantine-scale))',
    xl: 'calc(1.5rem * var(--mantine-scale))'
  },
  spacing: {
    xs: 'calc(0.625rem * var(--mantine-scale))',
    sm: 'calc(1rem * var(--mantine-scale))',
    md: 'calc(1.1rem * var(--mantine-scale))',
    lg: 'calc(1.65rem * var(--mantine-scale))',
    xl: 'calc(2.1rem * var(--mantine-scale))'
  },
  defaultRadius: 'md',
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
    Button: {
      defaultProps: {
        variant: 'filled',
        radius: 'md',
        size: 'sm'
      },
      styles: {
        root: {
          fontWeight: '600'
        }
      }
    },
    Card: {
      defaultProps: {
        withBorder: true,
        radius: 'md',
        padding: 'lg'
      },
      styles: {}
    },
    Paper: {
      defaultProps: {
        radius: 'md',
        withBorder: true,
        bg: 'var(--mantine-color-default)'
      },
      styles: {}
    },
    Badge: {
      defaultProps: {
        radius: 'md',
        variant: 'light'
      },
      styles: {
        root: {
          textTransform: 'none',
          fontWeight: '500'
        }
      }
    },
    Blockquote: {
      defaultProps: {
        color: 'amber'
      },
      styles: {}
    },
    Avatar: {
      defaultProps: {
        color: 'mist'
      },
      styles: {}
    },
    Input: {
      defaultProps: {
        variant: 'filled'
      },
      styles: {}
    }
  }
};

export default theme;