import React from 'react'
import { Image, StyleSheet, type ImageStyle, type StyleProp } from 'react-native'

const logoSource = require('@/assets/move-logo.png')

/** Horizontal lockup — source asset is 1024×240 */
const LOGO_ASPECT = 1024 / 240

interface MoveLogoProps {
  width?: number
  style?: StyleProp<ImageStyle>
}

export function MoveLogo({ width = 168, style }: MoveLogoProps) {
  return (
    <Image
      source={logoSource}
      style={[styles.logo, { width, height: width / LOGO_ASPECT }, style]}
      resizeMode="contain"
      accessibilityLabel="MOVE"
    />
  )
}

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
  },
})
