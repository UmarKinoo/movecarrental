import React from 'react'
import { StyleSheet, Text, Pressable } from 'react-native'

import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

interface ButtonProps {
  size?: 'small'
  color?: string
  style?: object
  label: string
  onPress?: () => void
}

const Button = ({
  size,
  color,
  style,
  label,
  onPress: onButtonPress
}: ButtonProps) => {
  const small = size === 'small'

  const onPress = () => {
    if (onButtonPress) {
      onButtonPress()
    }
  }

  const styles = StyleSheet.create({
    button: {
      height: small ? 37 : 55,
      borderRadius: 4,
      backgroundColor: color === 'secondary' ? colors.secondary : colors.lime,
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: 480,
    },
    text: {
      color: color === 'secondary' ? colors.paper : colors.ink,
      textTransform: 'uppercase',
      fontSize: small ? 14 : 17,
      fontFamily: fonts.displayMedium,
      letterSpacing: 0.5,
    },
  })

  return (
    <Pressable style={{ ...style, ...styles.button }} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  )
}

export default Button
