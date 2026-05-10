export const bookCarsConfig = {
  apiUrl: process.env.BOOKCARS_API_URL || 'http://localhost:4002',
  defaultSupplierId: process.env.BOOKCARS_DEFAULT_SUPPLIER_ID || '',
  defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
  defaultCurrency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'USD',
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Move Car Rental',
  carCdnUrl: process.env.NEXT_PUBLIC_BOOKCARS_CDN_CARS || 'http://localhost:4002/cdn/bookcars/cars',
  userCdnUrl: process.env.NEXT_PUBLIC_BOOKCARS_CDN_USERS || 'http://localhost:4002/cdn/bookcars/users',
}

export function joinUrl(base: string, path?: string | null) {
  if (!path) {
    return ''
  }

  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}
