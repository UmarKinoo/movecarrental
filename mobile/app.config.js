const fs = require('fs')
const path = require('path')

/**
 * Drops googleServicesFile entries when the files are absent so Expo CLI
 * does not warn during local dev / Expo Go. Add real Firebase files for
 * production builds (see https://github.com/aelassas/bookcars/wiki/Build-Mobile-App).
 */
module.exports = ({ config }) => {
  const root = __dirname
  const android = { ...config.android }
  const ios = { ...config.ios }

  if (!fs.existsSync(path.join(root, 'google-services.json'))) {
    delete android.googleServicesFile
  }
  if (!fs.existsSync(path.join(root, 'GoogleService-Info.plist'))) {
    delete ios.googleServicesFile
  }

  return {
    ...config,
    android,
    ios,
  }
}
