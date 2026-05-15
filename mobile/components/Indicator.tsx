import React from 'react'
import { ActivityIndicator } from 'react-native'

import { colors } from '@/theme/colors'

interface IndicatorProps {
  style?: object
}

const Indicator = ({ style }: IndicatorProps) => (
  <ActivityIndicator size="large" color={colors.lime} style={style} />
)

export default Indicator
