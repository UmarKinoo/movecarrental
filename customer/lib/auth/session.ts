import { cookies } from 'next/headers'

export const authCookieName = 'move_access_token'
export const userCookieName = 'move_user_id'

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(authCookieName)?.value
  const userId = cookieStore.get(userCookieName)?.value

  if (!token || !userId) {
    return null
  }

  return { token, userId }
}
