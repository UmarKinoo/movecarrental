import React, { useEffect, useState } from 'react'
import { Image, NativeModules, Pressable, StyleSheet, Text, TurboModuleRegistry, View } from 'react-native'
import { useRouter } from 'expo-router'
import { isAvailableAsync as isAppleAuthAvailableAsync, signInAsync as appleSignInAsync } from 'expo-apple-authentication/build/AppleAuthentication'
import { AppleAuthenticationScope } from 'expo-apple-authentication/build/AppleAuthentication.types'
import { Paragraph, Dialog, Portal, Button as NativeButton } from 'react-native-paper'
import * as bookcarsTypes from ':bookcars-types'

import i18n from '@/lang/i18n'
import * as helper from '@/utils/helper'
import * as UserService from '@/services/UserService'
import * as env from '@/config/env.config'

/** Expo Go and other binaries without this native module must never import `@react-native-google-signin/google-signin`. */
const HAS_NATIVE_GOOGLE_SIGNIN = TurboModuleRegistry.get('RNGoogleSignin') != null
const HAS_NATIVE_FACEBOOK = NativeModules.FBLoginManager != null

type GoogleSignInLib = typeof import('@react-native-google-signin/google-signin')
let googleSignInLib: GoogleSignInLib | null = null

function loadGoogleSignIn(): GoogleSignInLib | null {
  if (!HAS_NATIVE_GOOGLE_SIGNIN) {
    return null
  }
  if (!googleSignInLib) {
    googleSignInLib = require('@react-native-google-signin/google-signin') as GoogleSignInLib
  }
  return googleSignInLib
}

type FacebookSdkLib = typeof import('react-native-fbsdk-next')
let facebookSdkLib: FacebookSdkLib | null = null

function loadFacebookSdk(): FacebookSdkLib | null {
  if (!HAS_NATIVE_FACEBOOK) {
    return null
  }
  if (!facebookSdkLib) {
    facebookSdkLib = require('react-native-fbsdk-next') as FacebookSdkLib
  }
  return facebookSdkLib
}

interface SocialLoginProps {
  stayConnected?: boolean
  checkoutParams?: CheckoutParams
  onSignInError?: () => void
  onBlackListed?: () => void
}

const SocialLogin = (
  {
    stayConnected,
    checkoutParams,
    onSignInError,
    onBlackListed,
  }: SocialLoginProps
) => {
  const router = useRouter()
  const [openErrorDialog, setOpenErrorDialog] = useState(false)

  useEffect(() => {
    const lib = loadGoogleSignIn()
    if (!lib) {
      return
    }
    lib.GoogleSignin.configure({
      webClientId: env.GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
      scopes: ['profile', 'email'],
    })
  }, [])

  const [appleAuthSupported, setAppleAuthSupported] = useState(false)
  useEffect(() => {
    if (!helper.ios()) {
      return
    }
    void isAppleAuthAvailableAsync().then(setAppleAuthSupported)
  }, [])

  const showGoogle = HAS_NATIVE_GOOGLE_SIGNIN
  const showFacebook = HAS_NATIVE_FACEBOOK
  const showApple = helper.ios() && appleAuthSupported

  const longinError = () => {
    setOpenErrorDialog(true)

    if (onSignInError) {
      onSignInError()
    }
  }

  const loginSuccess = async (socialSignInType: bookcarsTypes.SocialSignInType, accessToken: string, email: string, fullName: string, avatar?: string) => {
    let success = true

    try {
      const data: bookcarsTypes.SignInPayload = {
        socialSignInType,
        accessToken,
        email,
        fullName,
        avatar,
        stayConnected,
        mobile: true,
      }
      const res = await UserService.socialSignin(data)
      if (res.status === 200) {
        if (res.data.blacklisted) {
          await UserService.signout()
          if (onBlackListed) {
            onBlackListed()
          }
        } else {
          await helper.registerPushToken(res.data._id as string)

          // 1. Ensure pathname starts with '/'
          // 2. Remove the old navigation.navigate('Home') - router.push('/') does this now.
          if (checkoutParams) {
            router.push({
              pathname: '/checkout',
              params: {
                ...checkoutParams,
                d: Date.now().toString() // force a refresh on the checkout screen
              }
            })
          } else {
            // router.replace is often better for going "Home" to clear the stack
            router.replace('/')
          }
        }
      } else {
        success = false
      }
    } catch (err) {
      console.error(err)
      success = false
    }

    if (success) {
      console.log(`${socialSignInType} login success`)
    } else {
      console.error(`${socialSignInType} login error`)
      longinError()
    }
  }

  const getEmail = (jwtToken: string) => {
    const jwt = UserService.parseJwt(jwtToken)
    const { email } = jwt
    return email
  }

  if (!showGoogle && !showFacebook && !showApple) {
    return null
  }

  return (
    <View style={styles.view}>
      <View style={styles.or}>
        <View style={styles.orHr} />
        <Text style={styles.orText}>{i18n.t('OR')}</Text>
        <View style={styles.orHr} />
      </View>

      <View style={styles.buttons}>

        {/* GOOGLE — native module missing in Expo Go */}
        {showGoogle && (
          <Pressable
            onPress={async () => {
              const lib = loadGoogleSignIn()
              if (!lib) {
                return
              }
              const { GoogleSignin, isErrorWithCode, statusCodes } = lib
              try {
                await GoogleSignin.hasPlayServices()

                // Force account picker
                await GoogleSignin.signOut()

                const userInfo = await GoogleSignin.signIn()

                const user = userInfo.data?.user
                const idToken = userInfo.data?.idToken

                if (!user || !idToken) {
                  // user probably cancelled the login flow
                  console.log('Google login aborted before token received')
                  return
                }

                await loginSuccess(
                  bookcarsTypes.SocialSignInType.Google,
                  idToken,
                  user.email,
                  user.name || user.email,
                  user.photo || ''
                )
              } catch (err: any) {
                let error = false
                if (isErrorWithCode(err)) {
                  switch (err.code) {
                    case statusCodes.SIGN_IN_CANCELLED:
                      // user cancelled the login flow
                      console.log('Google login cancelled')
                      break
                    case statusCodes.IN_PROGRESS:
                      // operation (eg. login) already in progress
                      console.log('Google login in progress')
                      error = true
                      break
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                      console.error('Google play services not available')
                      error = true
                      break
                    default:
                      console.error('Google login error:', err.message)
                      error = true
                      break
                  }
                } else {
                  // an error that's not related to google login occurred
                  console.error('Google login error:', err)
                  error = true
                }

                if (error) {
                  longinError()
                }
              }
            }}>
            <Image source={require('@/assets/google-icon.png')} style={styles.google} />
          </Pressable>
        )}

        {/* APPLE */}
        {showApple && (
          <Pressable
            onPress={async () => {
              let error = false

              try {
                const credential = await appleSignInAsync({
                  requestedScopes: [
                    AppleAuthenticationScope.FULL_NAME,
                    AppleAuthenticationScope.EMAIL,
                  ],
                })

                // 1. Get the email from the credential OR decode it from the identityToken
                const email = credential.email || getEmail(String(credential.identityToken))

                // 2. Build the name (will be null on repeat logins)
                const firstName = credential.fullName?.givenName || ''
                const lastName = credential.fullName?.familyName || ''
                const name = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : email

                if (email) {
                  // Use identityToken instead of authorizationCode for consistency with your web logic
                  await loginSuccess(
                    bookcarsTypes.SocialSignInType.Apple, credential.identityToken || '',
                    email,
                    name,
                    '')
                } else {
                  error = true
                }
                // signed in
              } catch (err: any) {
                if (err.code === 'ERR_REQUEST_CANCELED') {
                  // handle that the user canceled the sign-in flow
                  console.log('Apple login cancelled')
                } else {
                  console.error('Apple login error:', err.message)
                  error = true
                }
              }

              if (error) {
                longinError()
              }
            }}>
            <Image source={require('@/assets/apple-icon.png')} style={styles.apple} />
          </Pressable>
        )}

        {/* FACEBOOK — native module missing in Expo Go */}
        {showFacebook && (
          <Pressable
          // style={{ display: 'none' }}
          onPress={async () => {
            const fb = loadFacebookSdk()
            if (!fb) {
              return
            }
            const { AccessToken, GraphRequest, GraphRequestManager, LoginManager, Profile } = fb
            LoginManager.logInWithPermissions(['public_profile', 'email'])
              .then(
                async (result: any) => {
                  if (result.isCancelled) {
                    console.log('Facebook login cancelled')
                  } else {
                    let error = false
                    const currentAccessToken = await AccessToken.getCurrentAccessToken()
                    if (currentAccessToken) {
                      const req = new GraphRequest('/me', {
                        httpMethod: 'GET',
                        version: 'v20.0',
                        accessToken: currentAccessToken.accessToken,
                        parameters: {
                          fields: {
                            string: 'email,name,picture'
                          }
                        }
                      }, async (err: any, res: any) => {
                        let fbError = false
                        if (err) {
                          console.log(err)
                          fbError = true
                        } else {
                          const currentProfile = await Profile.getCurrentProfile()

                          if (res && currentProfile) {
                            const email = res.email as string
                            const imageURL = (res.picture as any).data.url as string
                            const { name } = currentProfile
                            // const { name, imageURL } = currentProfile
                            // console.log('email', email)
                            // console.log('name', name)
                            // console.log('imageURL', imageURL)

                            if (email && name) {
                              await loginSuccess(bookcarsTypes.SocialSignInType.Facebook, currentAccessToken.accessToken, email, name || email, imageURL || '')
                            } else {
                              fbError = true
                            }
                          } else {
                            fbError = true
                          }
                        }

                        if (fbError) {
                          console.error('Facebook GraphRequest error')
                          longinError()
                        }
                      })
                      new GraphRequestManager().addRequest(req).start()
                    } else {
                      error = true
                    }

                    if (error) {
                      console.error('Facebook login error')
                      longinError()
                    }
                  }
                },
                (error: any) => {
                  console.error(`Facebook login fail with error: ${error}`)

                  longinError()
                }
              )
          }}>
          <Image source={require('@/assets/facebook-blue-icon.png')} style={styles.facebook} />
        </Pressable>
        )}

        <Portal>
          <Dialog style={styles.dialog} visible={openErrorDialog} dismissable={false}>
            <Dialog.Title style={styles.dialogTitleContent}>{i18n.t('ERROR')}</Dialog.Title>
            <Dialog.Content style={styles.dialogContent}>
              <Paragraph>{i18n.t('LOGIN_ERROR')}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions style={styles.dialogActions}>
              <NativeButton
                // color='#3CB371'
                onPress={() => {
                  setOpenErrorDialog(false)
                }}
              >
                {i18n.t('CLOSE')}
              </NativeButton>
            </Dialog.Actions>
          </Dialog>
        </Portal>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 15,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  or: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    marginBottom: 10,
  },
  orHr: {
    borderBottomColor: '#CFD8DC',
    borderBottomWidth: 1,
    width: '46%',
    position: 'relative',
    top: -8,
  },
  orText: {
    textAlign: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
  google: {
    height: 55,
    resizeMode: 'contain',
  },
  apple: {
    height: 48,
    resizeMode: 'contain',
  },
  facebook: {
    height: 48,
    resizeMode: 'contain',
  },
  dialog: {
    width: '90%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  dialogTitleContent: {
    textAlign: 'center',
  },
  dialogContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogActions: {
    height: 75,
  },
})

export default SocialLogin
