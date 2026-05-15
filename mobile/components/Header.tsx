import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router' // Add these for Navigation
import { Avatar, Badge } from 'react-native-paper'
import * as bookcarsHelper from ':bookcars-helper'

import * as UserService from '@/services/UserService'
import * as env from '@/config/env.config'
import { useGlobalContext, GlobalContextType } from '@/context/GlobalContext'
import * as NotificationService from '@/services/NotificationService'
import CurrencyMenu from '@/components/CurrencyMenu'
import { MoveLogo } from '@/components/brand/MoveLogo'
import { useDrawer } from '@/context/DrawerContext'
import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

interface HeaderProps {
  title?: string
  hideTitle?: boolean
  brandLogo?: boolean
  loggedIn?: boolean
  reload?: boolean
  _avatar?: string | null
}

const Header = ({
  title,
  hideTitle,
  brandLogo,
  loggedIn,
  reload,
  _avatar
}: HeaderProps) => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { toggle } = useDrawer()
  
  const { notificationCount, setNotificationCount } = useGlobalContext() as GlobalContextType
  const [avatar, setAvatar] = useState<string | null | undefined>(null)

  useEffect(() => {
    const init = async () => {
      const currentUser = await UserService.getCurrentUser()
      if (currentUser && currentUser._id) {
        const user = await UserService.getUser(currentUser._id)

        if (user.avatar) {
          setAvatar((user.avatar.startsWith('https://') || user.avatar.startsWith('http://')) 
            ? user.avatar 
            : bookcarsHelper.joinURL(env.CDN_USERS, user.avatar))
        } else {
          setAvatar('')
        }

        const notificationCounter = await NotificationService.getNotificationCounter(currentUser._id)
        setNotificationCount(notificationCounter.count)
      }
    }

    // Trigger on manual reload or when the 'd' (cache buster) param changes
    if (reload || params.d) {
      init()
    }
  }, [reload, params.d, setNotificationCount])

  useEffect(() => {
    setAvatar(_avatar)
  }, [_avatar])

  return (
    <View>
      <View style={styles.accentBar} />
      <View style={styles.container}>
        <View style={styles.side}>
          <Pressable hitSlop={15} style={styles.menu} onPress={toggle}>
            <MaterialIcons name="menu" size={22} color="#fff" />
          </Pressable>
        </View>

        {brandLogo && (
          <View style={styles.brandCenter} pointerEvents="none">
            <MoveLogo width={76} />
          </View>
        )}

        {!brandLogo && !hideTitle && title ? (
          <View style={styles.titleCenter}>
            <Text style={styles.text} numberOfLines={1}>{title}</Text>
          </View>
        ) : null}

        <View style={[styles.side, styles.sideRight]}>
          <View style={styles.actions}>
        {/* Pass params to CurrencyMenu instead of the old route object */}
        <CurrencyMenu
          textColor="#fff"
          style={styles.currency}
        />

        {loggedIn && (
          <>
            <Pressable style={styles.notifications} onPress={() => router.push('/notifications')}>
              {notificationCount > 0 && (
                <Badge style={styles.badge} size={18}>
                  {notificationCount}
                </Badge>
              )}
              <MaterialIcons name="notifications" size={22} color="#fff" style={styles.badgeIcon} />
            </Pressable>
            
            <Pressable style={styles.avatar} onPress={() => router.push('/settings')}>
              {avatar 
                ? <Avatar.Image size={22} source={{ uri: avatar }} /> 
                : <MaterialIcons name="account-circle" size={22} color="#fff" />
              }
            </Pressable>
          </>
        )}
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  accentBar: {
    height: 2,
    backgroundColor: colors.lime,
  },
  container: {
    backgroundColor: colors.ink,
    zIndex: 40,
    elevation: 40,
    height: 48,
    flexDirection: 'row',
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  side: {
    minWidth: 88,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  sideRight: {
    justifyContent: 'flex-end',
    marginLeft: 'auto',
  },
  brandCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  text: {
    color: colors.paper,
    fontFamily: fonts.displayMedium,
    fontSize: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  menu: {
    padding: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currency: {
    marginRight: 10,
  },
  notifications: {
    paddingVertical: 5,
    paddingRight: 10,
    paddingLeft: 5,
  },
  avatar: {
    marginLeft: 2,
    padding: 5,
  },
  badge: {
    backgroundColor: colors.lime,
    color: colors.ink,
    position: 'absolute',
    top: -2,
    right: 2,
    zIndex: 2,
  },
  badgeIcon: {
    zIndex: 1,
  },
})

export default Header
