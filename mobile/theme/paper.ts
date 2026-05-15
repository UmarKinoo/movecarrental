import { MD3LightTheme } from 'react-native-paper'

import { colors } from './colors'

export const movePaperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.ink,
    onPrimary: colors.paper,
    primaryContainer: colors.limeTint,
    onPrimaryContainer: colors.ink,
    secondary: colors.lime,
    onSecondary: colors.ink,
    background: colors.background,
    surface: colors.paper,
    error: colors.error,
  },
}
