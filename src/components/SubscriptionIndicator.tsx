import { useFetchActiveSubscription, useFetchSubscriptionPlans, useSubscribeAccount } from '@/services/subscriptions.service'
import { useAuthStore } from '@/store/auth.store'
import { Skeleton } from '@chakra-ui/react'
import Link from 'next/link'
import React, { useEffect } from 'react'

export default function SubscriptionIndicator () {
  const { team } = useAuthStore()
  const { data: subscription, isLoading } = useFetchActiveSubscription(team?.id)
  const { data: plans } = useFetchSubscriptionPlans()
  const { mutateAsync, isPending } = useSubscribeAccount()
  useEffect(() => {
    if (subscription) {
      useAuthStore.setState({ subscription })
    }
  }, [subscription, plans])
  if (isLoading || isPending) {
    return (
      <Skeleton className='w-32 h-10 rounded-3xl' />
    )
  }
  return (
    <Link className={`min-w-32 border px-5 rounded-3xl flex justify-center items-center h-10 font-semibold bg-primary-dark text-white`} href="/dashboard/settings/subscriptions">
      {typeof subscription?.plan === "string" ? subscription?.plan : subscription?.plan.name}
    </Link>
  )
}
