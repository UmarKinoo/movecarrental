import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

import i18n from '@/lang/i18n'
import * as helper from '@/utils/helper'
import * as UserService from '@/services/UserService'
import Layout from '@/components/Layout'
import SearchForm from '@/components/SearchForm'
import { useIsFocused } from '@react-navigation/native'

const HomeScreen = () => {
  const isFocused = useIsFocused()
  const { d } = useLocalSearchParams<{ d: string }>()

  const [init, setInit] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reload, setReload] = useState(false)

  const _init = async () => {
    const _language = await UserService.getLanguage()
    i18n.locale = _language

    setInit(true)
    setVisible(true)
  }

  useEffect(() => {
    if (isFocused) {
      _init()
      setReload(true)
    } else {
      setVisible(false)
    }
  }, [d, isFocused])

  const onLoad = () => {
    setReload(false)
  }

  return (
    <Layout style={styles.master} hideTitle brandLogo onLoad={onLoad} reload={reload}>
      {init && visible && (
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps={helper.android() ? 'handled' : 'always'}
        >
          <View style={styles.contentContainer}>
            <SearchForm />
          </View>
        </ScrollView>
      )}
    </Layout>
  )
}

const styles = StyleSheet.create({
  master: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
  },
})

export default HomeScreen
