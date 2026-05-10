import { CheckoutSessionClient } from './checkout-session-client'

type PageProps = {
  params: Promise<{ sessionId: string }>
}

export default async function CheckoutSessionPage({ params }: PageProps) {
  const { sessionId } = await params
  return <CheckoutSessionClient sessionId={sessionId} />
}
