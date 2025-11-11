'use server'

import webpush, { PushSubscription as WebPushSubscription } from 'web-push'

// Configure VAPID keys — replace with your actual keys in env vars
webpush.setVapidDetails(
  'mailto:test@test.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

let subscription: WebPushSubscription | null = null

export async function subscribeUser(sub: PushSubscription) {
  // Convert browser subscription to format web-push expects
  const converted = sub.toJSON() as unknown as WebPushSubscription
  subscription = converted
  return { success: true }
}

export async function unsubscribeUser() {
  subscription = null
  return { success: true }
}

export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error('No subscription available')
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Test Notification',
        body: message,
        icon: '/icon.png',
      })
    )

    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}
