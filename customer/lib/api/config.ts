export type CustomerPaymentGateway = 'stripe' | 'payPal'

export const bookCarsConfig = {
  apiUrl: process.env.BOOKCARS_API_URL || 'http://localhost:4002',
  defaultSupplierId: process.env.BOOKCARS_DEFAULT_SUPPLIER_ID || '',
  defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
  defaultCurrency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'USD',
  baseCurrency: process.env.NEXT_PUBLIC_BOOKCARS_BASE_CURRENCY || process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'USD',
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Move Car Rental',
  carCdnUrl: process.env.NEXT_PUBLIC_BOOKCARS_CDN_CARS || 'http://localhost:4002/cdn/bookcars/cars',
  userCdnUrl: process.env.NEXT_PUBLIC_BOOKCARS_CDN_USERS || 'http://localhost:4002/cdn/bookcars/users',
  licenseCdnUrl: process.env.NEXT_PUBLIC_BOOKCARS_CDN_LICENSES || 'http://localhost:4002/cdn/bookcars/licenses',
  paymentGateway: ((process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || 'Stripe').toLowerCase() === 'paypal'
    ? 'payPal'
    : 'stripe') as CustomerPaymentGateway,
  mapLatitude: Number.parseFloat(process.env.NEXT_PUBLIC_MAP_LATITUDE || '34.0268755'),
  mapLongitude: Number.parseFloat(process.env.NEXT_PUBLIC_MAP_LONGITUDE || '1.65284'),
  mapZoom: Number.parseInt(process.env.NEXT_PUBLIC_MAP_ZOOM || '5', 10),
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
}

export function joinUrl(base: string, path?: string | null) {
  if (!path) {
    return ''
  }

  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}
